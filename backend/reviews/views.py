from django.db.models import Avg

from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import HelperProfile, User

from .models import Review
from .serializers import (
    HelperReviewSerializer,
    ReviewSerializer,
)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_review(request):

    if request.user.role != User.Role.CUSTOMER:
        return Response(
            {
                "detail": "Only customers can submit reviews."
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = ReviewSerializer(
        data=request.data,
        context={
            "request": request,
        },
    )

    if serializer.is_valid():
        review = serializer.save()

        return Response(
            ReviewSerializer(review).data,
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["GET"])
def helper_reviews(request, helper_id):

    try:
        helper = HelperProfile.objects.get(
            id=helper_id
        )

    except HelperProfile.DoesNotExist:
        return Response(
            {
                "detail": "Helper not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    reviews = (
        Review.objects
        .filter(
            booking__helper=helper
        )
        .select_related(
            "customer",
            "booking",
        )
        .order_by("-created_at")
    )

    rating_data = reviews.aggregate(
        average_rating=Avg("rating")
    )

    average_rating = (
        rating_data["average_rating"] or 0
    )

    serializer = HelperReviewSerializer(
        reviews,
        many=True,
    )

    return Response(
        {
            "helper_id": helper.id,
            "average_rating": round(
                average_rating,
                1,
            ),
            "total_reviews": reviews.count(),
            "reviews": serializer.data,
        }
    )
