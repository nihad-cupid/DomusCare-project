from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "customer",
        "helper",
        "service",
        "booking_type",
        "booking_date",
        "status",
        "created_at",
    ]

    list_filter = [
        "status",
        "booking_type",
        "service",
    ]

    search_fields = [
        "customer__username",
        "helper__user__username",
        "service__name",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]
