from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models

from services.models import Service


class User(AbstractUser):

    class Role(models.TextChoices):
        CUSTOMER = "CUSTOMER", "Customer"
        HELPER = "HELPER", "Helping Hand"
        RETAILER = "RETAILER", "Retailer"
        ADMIN = "ADMIN", "Admin"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER,
    )

    def __str__(self):
        return self.username


class CustomerProfile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="customer_profile",
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    address = models.TextField(
        blank=True,
    )

    def __str__(self):
        return (
            f"Customer: "
            f"{self.user.username}"
        )


class RetailerProfile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="retailer_profile",
    )

    business_name = models.CharField(
        max_length=150,
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    address = models.TextField(
        blank=True,
    )

    is_verified = models.BooleanField(
        default=False,
    )

    def __str__(self):
        return self.business_name


class HelperProfile(models.Model):

    class Availability(
        models.TextChoices
    ):
        AVAILABLE = (
            "AVAILABLE",
            "Available",
        )

        BUSY = (
            "BUSY",
            "Busy",
        )

        UNAVAILABLE = (
            "UNAVAILABLE",
            "Unavailable",
        )

    class WorkModel(
        models.TextChoices
    ):
        PERSONAL = (
            "PERSONAL",
            "Personal / Freelancer",
        )

        RETAILER = (
            "RETAILER",
            "Retailer Based",
        )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="helper_profile",
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    address = models.TextField(
        blank=True,
    )

    experience_years = (
        models.PositiveIntegerField(
            default=0,
        )
    )

    bio = models.TextField(
        blank=True,
    )

    is_verified = models.BooleanField(
        default=False,
    )

    skills = models.ManyToManyField(
        Service,
        blank=True,
        related_name="helpers",
    )

    availability = models.CharField(
        max_length=20,
        choices=Availability.choices,
        default=Availability.AVAILABLE,
    )

    work_model = models.CharField(
        max_length=20,
        choices=WorkModel.choices,
        default=WorkModel.PERSONAL,
    )

    retailer = models.ForeignKey(
        RetailerProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="helpers",
    )

    def __str__(self):
        return (
            f"Helper: "
            f"{self.user.username}"
        )
