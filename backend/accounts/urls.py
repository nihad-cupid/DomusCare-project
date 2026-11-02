from .views import retailer_list
from django.urls import path


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    register,
    me,
    profile,
    available_helpers,
    helper_detail,
    retailer_workers,
    available_workers_for_retailer,
    assign_retailer_worker,
    remove_retailer_worker,
    create_retailer_worker,
)


urlpatterns = [
    path(
        "register/",
        register,
        name="register",
    ),

    path(
        "login/",
        TokenObtainPairView.as_view(),
        name="login",
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="refresh",
    ),

    path(
        "me/",
        me,
        name="me",
    ),

    path(
        "profile/",
        profile,
        name="profile",
    ),

    path(
        "helpers/available/",
        available_helpers,
        name="available-helpers",
    ),

    path(
        "helpers/<int:helper_id>/",
        helper_detail,
        name="helper-detail",
    ),

    path(
        "retailer/workers/",
        retailer_workers,
        name="retailer-workers",
    ),

    path(
        "retailer/workers/available/",
        available_workers_for_retailer,
        name="available-workers-for-retailer",
    ),

    path(
        "retailer/workers/assign/",
        assign_retailer_worker,
        name="assign-retailer-worker",
    ),

    path(
        "retailer/workers/<int:helper_id>/remove/",
        remove_retailer_worker,
        name="remove-retailer-worker",
    ),
    path(
        "retailers/",
        retailer_list,
        name="retailer-list",
    ),
    path(
        "retailer/workers/create/",
        create_retailer_worker,
        name="create-retailer-worker",
    ),
]
