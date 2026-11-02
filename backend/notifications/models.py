from django.conf import settings
from django.db import models


class Notification(models.Model):

    class Type(models.TextChoices):
        BOOKING_REQUEST = (
            "BOOKING_REQUEST",
            "Booking Request",
        )

        BOOKING_ACCEPTED = (
            "BOOKING_ACCEPTED",
            "Booking Accepted",
        )

        BOOKING_REJECTED = (
            "BOOKING_REJECTED",
            "Booking Rejected",
        )

        HELPER_ASSIGNED = (
            "HELPER_ASSIGNED",
            "Helper Assigned",
        )

        WORK_STARTED = (
            "WORK_STARTED",
            "Work Started",
        )

        WORK_COMPLETED = (
            "WORK_COMPLETED",
            "Work Completed",
        )

        BOOKING_CANCELLED = (
            "BOOKING_CANCELLED",
            "Booking Cancelled",
        )

        GENERAL = (
            "GENERAL",
            "General",
        )

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    notification_type = models.CharField(
        max_length=30,
        choices=Type.choices,
        default=Type.GENERAL,
    )

    title = models.CharField(
        max_length=150,
    )

    message = models.TextField()

    booking = models.ForeignKey(
        "bookings.Booking",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications",
    )

    url = models.CharField(
        max_length=255,
        blank=True,
    )

    is_read = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = [
            "-created_at",
        ]

    def __str__(self):
        return (
            f"{self.recipient.username} - "
            f"{self.title}"
        )
