from django.urls import path

from .views import (
    create_booking,
    customer_bookings,
    helper_booking_requests,
    update_booking_status,
    cancel_booking,
    create_retailer_booking,
    retailer_booking_requests,
    assign_booking_helper,
)


urlpatterns = [

    path(
        "",
        create_booking,
        name="create-booking",
    ),

    path(
        "my/",
        customer_bookings,
        name="customer-bookings",
    ),

    path(
        "helper/requests/",
        helper_booking_requests,
        name="helper-booking-requests",
    ),

    path(
        "<int:booking_id>/status/",
        update_booking_status,
        name="update-booking-status",
    ),

    path(
        "<int:booking_id>/cancel/",
        cancel_booking,
        name="cancel-booking",
    ),

    path(
        "retailer/create/",
        create_retailer_booking,
        name="create-retailer-booking",
    ),

    path(
        "retailer/requests/",
        retailer_booking_requests,
        name="retailer-booking-requests",
    ),

    path(
        "retailer/<int:booking_id>/assign/",
        assign_booking_helper,
        name="assign-booking-helper",
    ),
]
