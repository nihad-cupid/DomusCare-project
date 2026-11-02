from django.urls import path

from . import views


urlpatterns = [

    path(
        "",
        views.my_notifications,
        name="my-notifications",
    ),

    path(
        "unread-count/",
        views.unread_notification_count,
        name="notification-unread-count",
    ),

    path(
        "<int:notification_id>/read/",
        views.mark_notification_read,
        name="notification-read",
    ),

    path(
        "read-all/",
        views.mark_all_notifications_read,
        name="notification-read-all",
    ),
]
