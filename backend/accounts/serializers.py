from rest_framework import serializers

from services.serializers import ServiceSerializer
from services.models import Service
from .models import (
    User,
    CustomerProfile,
    HelperProfile,
    RetailerProfile,
)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User

        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "role",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        if user.role == User.Role.CUSTOMER:
            CustomerProfile.objects.create(
                user=user
            )

        elif user.role == User.Role.HELPER:
            HelperProfile.objects.create(
                user=user
            )

        elif user.role == User.Role.RETAILER:
            RetailerProfile.objects.create(
                user=user,
                business_name=user.username,
            )

        return user


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
        ]

        read_only_fields = [
            "id",
            "username",
            "role",
        ]


class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile

        fields = [
            "phone",
            "address",
        ]


class HelperProfileSerializer(serializers.ModelSerializer):
    retailer_name = serializers.CharField(
        source="retailer.business_name",
        read_only=True,
    )

    class Meta:
        model = HelperProfile

        fields = [
            "phone",
            "address",
            "experience_years",
            "bio",
            "is_verified",
            "skills",
            "availability",
            "work_model",
            "retailer",
            "retailer_name",
        ]

        read_only_fields = [
            "is_verified",
            "retailer",
            "retailer_name",
            "work_model",
        ]


class RetailerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerProfile

        fields = [
            "business_name",
            "phone",
            "address",
            "is_verified",
        ]

        read_only_fields = [
            "is_verified",
        ]


class AvailableHelperSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True,
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True,
    )

    skills = ServiceSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = HelperProfile

        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "phone",
            "address",
            "experience_years",
            "bio",
            "is_verified",
            "availability",
            "work_model",
            "skills",
        ]


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            "id",
            "name",
        ]


class RetailerWorkerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True,
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True,
    )

    email = serializers.CharField(
        source="user.email",
        read_only=True,
    )

    skills = ServiceSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = HelperProfile

        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "address",
            "experience_years",
            "bio",
            "is_verified",
            "availability",
            "work_model",
            "skills",
        ]


class RetailerWorkerAssignSerializer(
    serializers.Serializer
):
    helper_id = serializers.IntegerField()


class PublicRetailerSerializer(
    serializers.ModelSerializer
):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    class Meta:
        model = RetailerProfile

        fields = [
            "id",
            "username",
            "business_name",
            "phone",
            "address",
            "is_verified",
        ]


class RetailerCreateWorkerSerializer(
    serializers.Serializer
):
    username = serializers.CharField(
        max_length=150
    )

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True,
        min_length=6,
    )

    first_name = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    last_name = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    phone = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    address = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    experience_years = serializers.IntegerField(
        required=False,
        min_value=0,
        default=0,
    )

    bio = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    skills = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.filter(
            is_active=True
        ),
        many=True,
        required=False,
    )

    def validate_username(
        self,
        value,
    ):
        if User.objects.filter(
            username=value
        ).exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )

        return value

    def validate_email(
        self,
        value,
    ):
        if User.objects.filter(
            email=value
        ).exists():
            raise serializers.ValidationError(
                "This email is already in use."
            )

        return value

    def create(
        self,
        validated_data,
    ):
        request = self.context[
            "request"
        ]

        retailer_profile = (
            request.user.retailer_profile
        )

        skills = validated_data.pop(
            "skills",
            [],
        )

        phone = validated_data.pop(
            "phone",
            "",
        )

        address = validated_data.pop(
            "address",
            "",
        )

        experience_years = (
            validated_data.pop(
                "experience_years",
                0,
            )
        )

        bio = validated_data.pop(
            "bio",
            "",
        )

        password = validated_data.pop(
            "password"
        )

        user = User.objects.create_user(
            password=password,
            role=User.Role.HELPER,
            **validated_data,
        )

        helper = HelperProfile.objects.create(
            user=user,

            phone=phone,
            address=address,

            experience_years=experience_years,

            bio=bio,

            work_model=HelperProfile.WorkModel.RETAILER,

            retailer=retailer_profile,

            availability=HelperProfile.Availability.AVAILABLE,
        )

        helper.skills.set(
            skills
        )

        return helper
