from .serializers import PublicRetailerSerializer
from rest_framework import status

from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import (
    User,
    CustomerProfile,
    HelperProfile,
    RetailerProfile,
)

from .serializers import (
    RegisterSerializer,
    UserBasicSerializer,
    CustomerProfileSerializer,
    HelperProfileSerializer,
    RetailerProfileSerializer,
    AvailableHelperSerializer,
    RetailerWorkerSerializer,
    RetailerWorkerAssignSerializer,
    PublicRetailerSerializer,
    RetailerCreateWorkerSerializer,
)


@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(
        data=request.data
    )

    if serializer.is_valid():
        user = serializer.save()

        return Response(
            {
                "message": "Account created successfully.",
                "username": user.username,
                "role": user.role,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user

    return Response(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
        }
    )


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user

    if user.role == User.Role.CUSTOMER:
        profile_obj, _ = CustomerProfile.objects.get_or_create(
            user=user
        )

        profile_serializer_class = CustomerProfileSerializer

    elif user.role == User.Role.HELPER:
        profile_obj, _ = HelperProfile.objects.get_or_create(
            user=user
        )

        profile_serializer_class = HelperProfileSerializer

    elif user.role == User.Role.RETAILER:
        profile_obj, _ = RetailerProfile.objects.get_or_create(
            user=user,
            defaults={
                "business_name": user.username
            },
        )

        profile_serializer_class = RetailerProfileSerializer

    else:
        return Response(
            {
                "detail": "No profile available for this role."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if request.method == "GET":
        return Response(
            {
                "user": UserBasicSerializer(
                    user
                ).data,

                "profile": profile_serializer_class(
                    profile_obj
                ).data,
            }
        )

    user_data = request.data.get(
        "user",
        {},
    )

    profile_data = request.data.get(
        "profile",
        {},
    )

    user_serializer = UserBasicSerializer(
        user,
        data=user_data,
        partial=True,
    )

    profile_serializer = profile_serializer_class(
        profile_obj,
        data=profile_data,
        partial=True,
    )

    if (
        user_serializer.is_valid()
        and profile_serializer.is_valid()
    ):
        user_serializer.save()
        profile_serializer.save()

        return Response(
            {
                "user": user_serializer.data,
                "profile": profile_serializer.data,
            }
        )

    return Response(
        {
            "user_errors": user_serializer.errors,
            "profile_errors": profile_serializer.errors,
        },
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["GET"])
def available_helpers(request):
    service_id = request.GET.get(
        "service"
    )

    helpers = HelperProfile.objects.filter(
        availability=HelperProfile.Availability.AVAILABLE
    )

    if service_id:
        helpers = helpers.filter(
            skills__id=service_id
        )

    helpers = (
        helpers
        .select_related(
            "user",
            "retailer",
        )
        .prefetch_related(
            "skills"
        )
        .distinct()
    )

    serializer = AvailableHelperSerializer(
        helpers,
        many=True,
    )

    return Response(
        serializer.data
    )


@api_view(["GET"])
def helper_detail(request, helper_id):
    try:
        helper = (
            HelperProfile.objects
            .select_related(
                "user",
                "retailer",
            )
            .prefetch_related(
                "skills"
            )
            .get(
                id=helper_id
            )
        )

    except HelperProfile.DoesNotExist:
        return Response(
            {
                "detail": "Helper not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = AvailableHelperSerializer(
        helper
    )

    return Response(
        serializer.data
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def retailer_workers(request):
    if request.user.role != User.Role.RETAILER:
        return Response(
            {
                "detail": (
                    "Only retailers can view "
                    "their Helping Hands."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        retailer_profile = request.user.retailer_profile

    except RetailerProfile.DoesNotExist:
        return Response(
            {
                "detail": "Retailer profile not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    helpers = (
        HelperProfile.objects
        .filter(
            retailer=retailer_profile,
            work_model=HelperProfile.WorkModel.RETAILER,
        )
        .select_related(
            "user"
        )
        .prefetch_related(
            "skills"
        )
        .order_by(
            "user__first_name"
        )
    )

    serializer = RetailerWorkerSerializer(
        helpers,
        many=True,
    )

    return Response(
        serializer.data
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def available_workers_for_retailer(request):
    if request.user.role != User.Role.RETAILER:
        return Response(
            {
                "detail": "Only retailers can access this endpoint."
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        retailer = request.user.retailer_profile

    except RetailerProfile.DoesNotExist:
        return Response(
            {
                "detail": "Retailer profile not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    workers = (
        HelperProfile.objects
        .filter(
            retailer=retailer,
            availability=HelperProfile.Availability.AVAILABLE,
        )
        .select_related("user")
        .prefetch_related("skills")
        .order_by("user__username")
    )

    serializer = RetailerWorkerSerializer(
        workers,
        many=True,
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def assign_retailer_worker(request):
    if request.user.role != User.Role.RETAILER:
        return Response(
            {
                "detail": (
                    "Only retailers can assign "
                    "Helping Hands."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = RetailerWorkerAssignSerializer(
        data=request.data
    )

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    helper_id = serializer.validated_data[
        "helper_id"
    ]

    try:
        retailer_profile = request.user.retailer_profile

    except RetailerProfile.DoesNotExist:
        return Response(
            {
                "detail": "Retailer profile not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        helper = (
            HelperProfile.objects
            .select_related(
                "user",
                "retailer",
            )
            .prefetch_related(
                "skills"
            )
            .get(
                id=helper_id
            )
        )

    except HelperProfile.DoesNotExist:
        return Response(
            {
                "detail": "Helping Hand not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    if (
        helper.retailer is not None
        and helper.retailer != retailer_profile
    ):
        return Response(
            {
                "detail": (
                    "This Helping Hand is already "
                    "assigned to another retailer."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if (
        helper.retailer == retailer_profile
        and helper.work_model
        == HelperProfile.WorkModel.RETAILER
    ):
        return Response(
            {
                "detail": (
                    "This Helping Hand is "
                    "already assigned to you."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    helper.retailer = retailer_profile

    helper.work_model = (
        HelperProfile.WorkModel.RETAILER
    )

    helper.save(
        update_fields=[
            "retailer",
            "work_model",
        ]
    )

    return Response(
        RetailerWorkerSerializer(
            helper
        ).data,
        status=status.HTTP_200_OK,
    )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_retailer_worker(
    request,
    helper_id,
):
    if request.user.role != User.Role.RETAILER:
        return Response(
            {
                "detail": (
                    "Only retailers can remove "
                    "Helping Hands."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        retailer_profile = request.user.retailer_profile

    except RetailerProfile.DoesNotExist:
        return Response(
            {
                "detail": "Retailer profile not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        helper = HelperProfile.objects.get(
            id=helper_id,
            retailer=retailer_profile,
        )

    except HelperProfile.DoesNotExist:
        return Response(
            {
                "detail": (
                    "Helping Hand not found "
                    "under this retailer."
                )
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    helper.retailer = None

    helper.work_model = (
        HelperProfile.WorkModel.PERSONAL
    )

    helper.save(
        update_fields=[
            "retailer",
            "work_model",
        ]
    )

    return Response(
        {
            "message": (
                "Helping Hand removed successfully."
            )
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def retailer_list(request):

    retailers = (
        RetailerProfile.objects
        .filter(
            is_verified=True
        )
        .select_related("user")
        .order_by("business_name")
    )

    serializer = PublicRetailerSerializer(
        retailers,
        many=True,
    )

    return Response(
        serializer.data
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_retailer_worker(request):
    if request.user.role != User.Role.RETAILER:
        return Response(
            {
                "detail": "Only Retailers can create team members."
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    if not hasattr(
        request.user,
        "retailer_profile",
    ):
        return Response(
            {
                "detail": "Retailer profile not found."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = RetailerCreateWorkerSerializer(
        data=request.data,
        context={
            "request": request,
        },
    )

    serializer.is_valid(
        raise_exception=True
    )

    helper = serializer.save()

    return Response(
        RetailerWorkerSerializer(
            helper
        ).data,
        status=status.HTTP_201_CREATED,
    )
