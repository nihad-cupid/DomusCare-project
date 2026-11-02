from .models import Notification


def create_notification(
    *,
    user,
    title,
    message,
    notification_type,
    booking=None,
):
    if user is None:
        return None

    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        booking=booking,
    )
