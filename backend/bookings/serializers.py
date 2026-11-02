from .pricing import calculate_booking_price
from rest_framework import serializers

from accounts.models import (
    HelperProfile,
    RetailerProfile,
)

from services.models import Service

from .models import Booking


class BookingCreateSerializer(serializers.ModelSerializer):

    helper = serializers.PrimaryKeyRelatedField(
        queryset=HelperProfile.objects.all()
    )

    service = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.filter(
            is_active=True
        )
    )

    class Meta:
        model = Booking

        fields = [
            "id",
            "helper",
            "service",
            "booking_type",
            "booking_date",
            "booking_time",
            "duration",
            "address",
            "instructions",
            "status",
            "created_at",

        ]

        read_only_fields = [
            "id",
            "status",
            "created_at",
        ]

    def validate(self, attrs):
        helper = attrs["helper"]
        service = attrs["service"]

        if (
            helper.availability
            != HelperProfile.Availability.AVAILABLE
        ):
            raise serializers.ValidationError(
                {
                    "helper": (
                        "This helper is currently "
                        "not available."
                    )
                }
            )

        if not helper.skills.filter(
            id=service.id
        ).exists():
            raise serializers.ValidationError(
                {
                    "service": (
                        "This helper does not provide "
                        "this service."
                    )
                }
            )

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user

        return Booking.objects.create(
            customer=user,
            booking_model=Booking.BookingModel.PERSONAL,
            retailer=None,
            **validated_data,
        )


class HelperBookingSerializer(serializers.ModelSerializer):

    customer_username = serializers.CharField(
        source="customer.username",
        read_only=True,
    )

    customer_name = serializers.SerializerMethodField()

    service_name = serializers.CharField(
        source="service.name",
        read_only=True,
    )

    helper_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking

        fields = [
            "id",
            "customer_username",
            "customer_name",
            "helper_name",
            "service",
            "service_name",
            "booking_model",
            "booking_type",
            "booking_date",
            "booking_time",
            "duration",
            "address",
            "instructions",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_customer_name(self, obj):
        full_name = (
            f"{obj.customer.first_name} "
            f"{obj.customer.last_name}"
        ).strip()

        return full_name or obj.customer.username

    def get_helper_name(self, obj):
        if not obj.helper:
            return None

        full_name = (
            f"{obj.helper.user.first_name} "
            f"{obj.helper.user.last_name}"
        ).strip()

        return full_name or obj.helper.user.username


class CustomerBookingSerializer(serializers.ModelSerializer):

    helper_name = serializers.SerializerMethodField()

    helper_username = serializers.SerializerMethodField()

    retailer_name = serializers.SerializerMethodField()

    service_name = serializers.CharField(
        source="service.name",
        read_only=True,
    )

    has_review = serializers.SerializerMethodField()

    class Meta:
        model = Booking

        fields = [
            "id",
            "booking_model",
            "helper",
            "helper_name",
            "helper_username",
            "retailer",
            "retailer_name",
            "service",
            "service_name",
            "booking_type",
            "booking_date",
            "booking_time",
            "duration",
            "address",
            "instructions",
            "status",
            "has_review",
            "created_at",
            "updated_at",
            "rate",
            "total_amount",
        ]

    def get_helper_name(self, obj):
        if not obj.helper:
            return None

        full_name = (
            f"{obj.helper.user.first_name} "
            f"{obj.helper.user.last_name}"
        ).strip()

        return full_name or obj.helper.user.username

    def get_helper_username(self, obj):
        if not obj.helper:
            return None

        return obj.helper.user.username

    def get_retailer_name(self, obj):
        if not obj.retailer:
            return None

        return obj.retailer.business_name

    def get_has_review(self, obj):
        return hasattr(
            obj,
            "review"
        )


class RetailerBookingCreateSerializer(
    serializers.ModelSerializer
):

    retailer_id = serializers.PrimaryKeyRelatedField(
        queryset=RetailerProfile.objects.all(),
        source="retailer",
        write_only=True,
    )

    service = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.filter(
            is_active=True
        )
    )

    class Meta:
        model = Booking

        fields = [
            "id",
            "retailer_id",
            "service",
            "booking_type",
            "booking_date",
            "booking_time",
            "duration",
            "address",
            "instructions",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "status",
            "created_at",
        ]

    def validate(self, attrs):
        retailer = attrs["retailer"]
        service = attrs["service"]

        has_worker = (
            HelperProfile.objects
            .filter(
                retailer=retailer,
                work_model=HelperProfile.WorkModel.RETAILER,
                skills=service,
            )
            .exists()
        )

        if not has_worker:
            raise serializers.ValidationError(
                {
                    "service": (
                        "This retailer currently "
                        "has no Helping Hand for "
                        "this service."
                    )
                }
            )

        return attrs

    def create(self, validated_data):
        user = self.context[
            "request"
        ].user

        return Booking.objects.create(
            customer=user,
            booking_model=(
                Booking.BookingModel.RETAILER
            ),
            helper=None,
            **validated_data,
        )


class RetailerBookingSerializer(
    serializers.ModelSerializer
):

    customer_username = serializers.CharField(
        source="customer.username",
        read_only=True,
    )

    customer_name = (
        serializers.SerializerMethodField()
    )

    service_name = serializers.CharField(
        source="service.name",
        read_only=True,
    )

    retailer_name = serializers.CharField(
        source="retailer.business_name",
        read_only=True,
    )

    helper_name = (
        serializers.SerializerMethodField()
    )

    class Meta:
        model = Booking

        fields = [
            "id",
            "customer_username",
            "customer_name",
            "retailer",
            "retailer_name",
            "service",
            "service_name",
            "helper",
            "helper_name",
            "booking_model",
            "booking_type",
            "booking_date",
            "booking_time",
            "duration",
            "rate",
            "total_amount",
            "address",
            "instructions",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "customer_username",
            "customer_name",
            "retailer",
            "retailer_name",
            "service_name",
            "helper",
            "helper_name",
            "booking_model",
            "rate",
            "total_amount",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_customer_name(
        self,
        obj,
    ):
        full_name = (
            f"{obj.customer.first_name} "
            f"{obj.customer.last_name}"
        ).strip()

        return (
            full_name
            or obj.customer.username
        )

    def get_helper_name(
        self,
        obj,
    ):
        if not obj.helper:
            return None

        full_name = (
            f"{obj.helper.user.first_name} "
            f"{obj.helper.user.last_name}"
        ).strip()

        return (
            full_name
            or obj.helper.user.username
        )
