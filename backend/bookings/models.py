from django.conf import settings
from django.db import models

from accounts.models import (
    HelperProfile,
    RetailerProfile,
)

from services.models import Service


class Booking(models.Model):
    class BookingType(models.TextChoices):
        HOURLY = "HOURLY", "Hourly"
        DAILY = "DAILY", "Daily"
        MONTHLY = "MONTHLY", "Monthly"

    class BookingModel(models.TextChoices):
        PERSONAL = "PERSONAL", "Personal Helping Hand"
        RETAILER = "RETAILER", "Retailer Service"

    class Status(models.TextChoices):
        REQUESTED = "REQUESTED", "Requested"
        ACCEPTED = "ACCEPTED", "Accepted"
        REJECTED = "REJECTED", "Rejected"
        ASSIGNED = "ASSIGNED", "Assigned"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings",
    )

    booking_model = models.CharField(
        max_length=20,
        choices=BookingModel.choices,
        default=BookingModel.PERSONAL,
    )

    helper = models.ForeignKey(
        HelperProfile,
        on_delete=models.SET_NULL,
        related_name="booking_requests",
        null=True,
        blank=True,
    )

    retailer = models.ForeignKey(
        RetailerProfile,
        on_delete=models.SET_NULL,
        related_name="booking_requests",
        null=True,
        blank=True,
    )

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="bookings",
    )

    booking_type = models.CharField(
        max_length=20,
        choices=BookingType.choices,
    )

    booking_date = models.DateField()

    booking_time = models.TimeField()

    duration = models.PositiveIntegerField(
        default=1
    )

    rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    address = models.TextField()

    instructions = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.REQUESTED,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    # ✅ এইখানে বসাবে
    def save(self, *args, **kwargs):
        rates = {
            self.BookingType.HOURLY: 300,
            self.BookingType.DAILY: 700,
            self.BookingType.MONTHLY: 4500,
        }

        rate = rates.get(
            self.booking_type
        )

        if rate is not None:
            self.rate = rate

            duration = (
                self.duration
                or 1
            )

            self.total_amount = (
                rate * duration
            )

        super().save(
            *args,
            **kwargs
        )
