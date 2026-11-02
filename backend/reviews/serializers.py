from rest_framework import serializers

from bookings.models import Booking

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    helper_name = serializers.SerializerMethodField()

    class Meta:
        model = Review

        fields = [
            "id",
            "booking",
            "customer_name",
            "helper_name",
            "rating",
            "comment",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "customer_name",
            "helper_name",
            "created_at",
        ]

    def get_customer_name(self, obj):
        full_name = (
            f"{obj.customer.first_name} "
            f"{obj.customer.last_name}"
        ).strip()

        return full_name or obj.customer.username

    def get_helper_name(self, obj):
        helper = obj.booking.helper.user

        full_name = (
            f"{helper.first_name} "
            f"{helper.last_name}"
        ).strip()

        return full_name or helper.username

    def validate_booking(self, booking):
        request = self.context["request"]

        if booking.customer != request.user:
            raise serializers.ValidationError(
                "You can only review your own booking."
            )

        if booking.status != Booking.Status.COMPLETED:
            raise serializers.ValidationError(
                "Only completed bookings can be reviewed."
            )

        if hasattr(booking, "review"):
            raise serializers.ValidationError(
                "This booking has already been reviewed."
            )

        return booking

    def create(self, validated_data):
        request = self.context["request"]

        return Review.objects.create(
            customer=request.user,
            **validated_data,
        )


class HelperReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Review

        fields = [
            "id",
            "customer_name",
            "rating",
            "comment",
            "created_at",
        ]

    def get_customer_name(self, obj):
        full_name = (
            f"{obj.customer.first_name} "
            f"{obj.customer.last_name}"
        ).strip()

        return full_name or obj.customer.username
