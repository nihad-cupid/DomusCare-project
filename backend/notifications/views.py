from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import (
    IsAuthenticated,
)
from rest_framework.response import Response

from .models import Notification
from .serializers import (
    NotificationSerializer,
)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_notifications(request):

    notifications = (
        Notification.objects
        .filter(recipient=request.user)
        .order_by("-created_at")[:50]
    )

    serializer = NotificationSerializer(
        notifications,
        many=True,
    )

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def unread_notification_count(request):

    count = Notification.objects.filter(
        recipient=request.user,
        is_read=False,
    ).count()

    return Response({
        "unread_count": count,
    })


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def mark_notification_read(
    request,
    notification_id,
):

    try:
        notification = (
            Notification.objects.get(
                id=notification_id,
                recipient=request.user,
            )
        )

    except Notification.DoesNotExist:

        return Response(
            {
                "detail":
                    "Notification not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    notification.is_read = True

    notification.save(
        update_fields=["is_read"]
    )

    serializer = NotificationSerializer(
        notification
    )

    return Response(serializer.data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):

    Notification.objects.filter(
        recipient=request.user,
        is_read=False,
    ).update(
        is_read=True
    )

    return Response({
        "detail":
            "All notifications marked as read."
    })
