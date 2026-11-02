from .models import Notification


def create_notification(
    recipient,
    title,
    message,
    notification_type,
    booking=None,
    url="",
):

    if recipient is None:
        return None

    return Notification.objects.create(
        recipient=recipient,
        notification_type=notification_type,
        title=title,
        message=message,
        booking=booking,
        url=url,
    )


def notify_personal_booking_request(
    booking,
):

    if not booking.helper:
        return

    create_notification(
        recipient=booking.helper.user,
        notification_type=(
            Notification.Type.BOOKING_REQUEST
        ),
        title="New Booking Request",
        message=(
            f"{booking.customer.username} "
            f"sent you a booking request "
            f"for {booking.service.name}."
        ),
        booking=booking,
        url="/helpers/requests",
    )


def notify_retailer_booking_request(
    booking,
):

    if not booking.retailer:
        return

    create_notification(
        recipient=booking.retailer.user,
        notification_type=(
            Notification.Type.BOOKING_REQUEST
        ),
        title="New Service Request",
        message=(
            f"{booking.customer.username} "
            f"requested "
            f"{booking.service.name}."
        ),
        booking=booking,
        url="/retailer/requests",
    )


def notify_booking_accepted(
    booking,
):

    create_notification(
        recipient=booking.customer,
        notification_type=(
            Notification.Type.BOOKING_ACCEPTED
        ),
        title="Booking Accepted",
        message=(
            f"Your booking for "
            f"{booking.service.name} "
            f"has been accepted."
        ),
        booking=booking,
        url="/bookings",
    )


def notify_booking_rejected(
    booking,
):

    create_notification(
        recipient=booking.customer,
        notification_type=(
            Notification.Type.BOOKING_REJECTED
        ),
        title="Booking Rejected",
        message=(
            f"Your booking for "
            f"{booking.service.name} "
            f"was rejected."
        ),
        booking=booking,
        url="/bookings",
    )


def notify_helper_assigned(
    booking,
):

    if booking.helper:

        create_notification(
            recipient=booking.helper.user,
            notification_type=(
                Notification.Type.HELPER_ASSIGNED
            ),
            title="New Job Assigned",
            message=(
                f"You have been assigned "
                f"to a {booking.service.name} "
                f"booking."
            ),
            booking=booking,
            url="/helpers/requests",
        )

    create_notification(
        recipient=booking.customer,
        notification_type=(
            Notification.Type.HELPER_ASSIGNED
        ),
        title="Helping Hand Assigned",
        message=(
            f"A Helping Hand has been "
            f"assigned to your "
            f"{booking.service.name} booking."
        ),
        booking=booking,
        url="/bookings",
    )


def notify_work_started(
    booking,
):

    create_notification(
        recipient=booking.customer,
        notification_type=(
            Notification.Type.WORK_STARTED
        ),
        title="Work Started",
        message=(
            f"Work has started for your "
            f"{booking.service.name} booking."
        ),
        booking=booking,
        url="/bookings",
    )

    if booking.retailer:

        create_notification(
            recipient=booking.retailer.user,
            notification_type=(
                Notification.Type.WORK_STARTED
            ),
            title="Assigned Job Started",
            message=(
                f"The assigned Helping Hand "
                f"started booking "
                f"#{booking.id}."
            ),
            booking=booking,
            url="/retailer/requests",
        )


def notify_work_completed(
    booking,
):

    create_notification(
        recipient=booking.customer,
        notification_type=(
            Notification.Type.WORK_COMPLETED
        ),
        title="Work Completed",
        message=(
            f"Your {booking.service.name} "
            f"booking has been completed."
        ),
        booking=booking,
        url=f"/review/{booking.id}",
    )

    if booking.retailer:

        create_notification(
            recipient=booking.retailer.user,
            notification_type=(
                Notification.Type.WORK_COMPLETED
            ),
            title="Job Completed",
            message=(
                f"Booking #{booking.id} "
                f"has been completed."
            ),
            booking=booking,
            url="/retailer/requests",
        )


def notify_booking_cancelled(
    booking,
):

    if booking.helper:

        create_notification(
            recipient=booking.helper.user,
            notification_type=(
                Notification.Type.BOOKING_CANCELLED
            ),
            title="Booking Cancelled",
            message=(
                f"Booking #{booking.id} "
                f"was cancelled."
            ),
            booking=booking,
            url="/helpers/requests",
        )

    if booking.retailer:

        create_notification(
            recipient=booking.retailer.user,
            notification_type=(
                Notification.Type.BOOKING_CANCELLED
            ),
            title="Booking Cancelled",
            message=(
                f"Booking #{booking.id} "
                f"was cancelled by the customer."
            ),
            booking=booking,
            url="/retailer/requests",
        )
