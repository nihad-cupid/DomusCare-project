from django.urls import path

from .views import (
    create_review,
    helper_reviews,
)


urlpatterns = [

    path(
        "",
        create_review,
        name="create-review",
    ),

    path(
        "helper/<int:helper_id>/",
        helper_reviews,
        name="helper-reviews",
    ),

]
