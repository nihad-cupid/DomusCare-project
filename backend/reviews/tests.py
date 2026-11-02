from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import User

from .serializers import ReviewSerializer


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
            ReviewSerializer(
                review
            ).data,
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )
