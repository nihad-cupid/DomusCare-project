from rest_framework import status

from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import (
    IsAuthenticated,
)

from rest_framework.response import Response


from accounts.models import (
    User,
    HelperProfile,
    RetailerProfile,
)


from .models import Booking


from .serializers import (
    BookingCreateSerializer,
    CustomerBookingSerializer,
    HelperBookingSerializer,
    RetailerBookingCreateSerializer,
    RetailerBookingSerializer,
)


from notifications.services import (
    notify_personal_booking_request,
    notify_retailer_booking_request,
    notify_helper_assigned,
    notify_booking_accepted,
    notify_booking_rejected,
    notify_work_started,
    notify_work_completed,
    notify_booking_cancelled,
)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_booking(request):

    serializer = BookingCreateSerializer(
        data=request.data,
        context={
            "request": request,
        },
    )

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Serializer-এর create() customer set করবে
    booking = serializer.save()

    # =========================
    # HELPER NOTIFICATION
    # =========================

    notify_personal_booking_request(
        booking
    )

    # =========================
    # RESPONSE
    # =========================

    return Response(
        CustomerBookingSerializer(
            booking
        ).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def helper_booking_requests(request):

    if request.user.role != User.Role.HELPER:
        return Response(
            {
                "detail": (
                    "Only helpers can view "
                    "booking requests."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        helper_profile = (
            request.user.helper_profile
        )

    except HelperProfile.DoesNotExist:
        return Response(
            {
                "detail": (
                    "Helper profile not found."
                )
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    bookings = (
        Booking.objects
        .filter(
            helper=helper_profile
        )
        .select_related(
            "customer",
            "service",
            "helper__user",
            "retailer",
        )
        .order_by(
            "-created_at"
        )
    )

    serializer = HelperBookingSerializer(
        bookings,
        many=True,
    )

    return Response(
        serializer.data
    )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_booking_status(
    request,
    booking_id,
):

    # =========================
    # ONLY HELPER CAN UPDATE
    # =========================

    if request.user.role != User.Role.HELPER:
        return Response(
            {
                "detail": (
                    "Only helpers can update "
                    "booking status."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    # =========================
    # GET BOOKING
    # =========================

    try:
        booking = Booking.objects.get(
            id=booking_id,
            helper=request.user.helper_profile,
        )

    except Booking.DoesNotExist:
        return Response(
            {
                "detail": "Booking not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    # =========================
    # GET NEW STATUS
    # =========================

    new_status = request.data.get(
        "status"
    )

    if not new_status:
        return Response(
            {
                "detail":
                    "Status is required."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # =========================
    # PERSONAL BOOKING
    # REQUESTED
    # ↓
    # ACCEPTED / REJECTED
    # =========================

    if (
        booking.booking_model
        == Booking.BookingModel.PERSONAL
        and booking.status
        == Booking.Status.REQUESTED
    ):

        allowed_statuses = [
            Booking.Status.ACCEPTED,
            Booking.Status.REJECTED,
        ]

    # =========================
    # RETAILER BOOKING
    # ASSIGNED
    # ↓
    # IN_PROGRESS
    # =========================

    elif (
        booking.booking_model
        == Booking.BookingModel.RETAILER
        and booking.status
        == Booking.Status.ASSIGNED
    ):

        allowed_statuses = [
            Booking.Status.IN_PROGRESS,
        ]

    # =========================
    # PERSONAL ACCEPTED
    # ↓
    # IN_PROGRESS
    # =========================

    elif (
        booking.status
        == Booking.Status.ACCEPTED
    ):

        allowed_statuses = [
            Booking.Status.IN_PROGRESS,
        ]

    # =========================
    # IN_PROGRESS
    # ↓
    # COMPLETED
    # =========================

    elif (
        booking.status
        == Booking.Status.IN_PROGRESS
    ):

        allowed_statuses = [
            Booking.Status.COMPLETED,
        ]

    else:
        allowed_statuses = []

    # =========================
    # INVALID STATUS CHANGE
    # =========================

    if new_status not in allowed_statuses:

        return Response(
            {
                "detail": (
                    f"Cannot change booking "
                    f"from {booking.status} "
                    f"to {new_status}."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # =========================
    # SAVE NEW STATUS
    # =========================

    booking.status = new_status
    booking.save()

    # =========================
    # NOTIFICATIONS
    # =========================

    if (
        new_status
        == Booking.Status.ACCEPTED
    ):

        notify_booking_accepted(
            booking
        )

    elif (
        new_status
        == Booking.Status.REJECTED
    ):

        notify_booking_rejected(
            booking
        )

    elif (
        new_status
        == Booking.Status.IN_PROGRESS
    ):

        notify_work_started(
            booking
        )

    elif (
        new_status
        == Booking.Status.COMPLETED
    ):

        notify_work_completed(
            booking
        )

    # =========================
    # RESPONSE
    # =========================

    return Response(
        HelperBookingSerializer(
            booking
        ).data,
        status=status.HTTP_200_OK,
    )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def cancel_booking(
    request,
    booking_id,
):

    if request.user.role != User.Role.CUSTOMER:
        return Response(
            {
                "detail": (
                    "Only customers can "
                    "cancel bookings."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        booking = Booking.objects.get(
            id=booking_id,
            customer=request.user,
        )

    except Booking.DoesNotExist:
        return Response(
            {
                "detail": "Booking not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    if booking.status not in [
        Booking.Status.REQUESTED,
        Booking.Status.ACCEPTED,
        Booking.Status.ASSIGNED,
    ]:
        return Response(
            {
                "detail": (
                    "This booking cannot "
                    "be cancelled."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    booking.status = Booking.Status.CANCELLED
    booking.save()
    notify_booking_cancelled(
        booking
    )

    return Response(
        CustomerBookingSerializer(
            booking
        ).data
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_retailer_booking(request):

    if request.user.role != User.Role.CUSTOMER:
        return Response(
            {
                "detail": (
                    "Only customers can create "
                    "retailer bookings."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = RetailerBookingCreateSerializer(
        data=request.data,
        context={
            "request": request,
        },
    )

    if not serializer.is_valid():

        print(
            "RETAILER BOOKING DATA:",
            request.data
        )

        print(
            "RETAILER BOOKING ERRORS:",
            serializer.errors
        )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    booking = serializer.save()

    # =========================
    # RETAILER NOTIFICATION
    # =========================

    notify_retailer_booking_request(
        booking
    )

    # =========================
    # RESPONSE
    # =========================

    return Response(
        RetailerBookingSerializer(
            booking
        ).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def retailer_booking_requests(request):

    if request.user.role != User.Role.RETAILER:
        return Response(
            {
                "detail": (
                    "Only retailers can view "
                    "retailer requests."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        retailer = (
            request.user.retailer_profile
        )

    except RetailerProfile.DoesNotExist:
        return Response(
            {
                "detail": (
                    "Retailer profile not found."
                )
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    bookings = (
        Booking.objects
        .filter(
            retailer=retailer,
            booking_model=Booking.BookingModel.RETAILER,
        )
        .select_related(
            "customer",
            "service",
            "helper__user",
            "retailer",
        )
        .order_by(
            "-created_at"
        )
    )

    serializer = RetailerBookingSerializer(
        bookings,
        many=True,
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def assign_booking_helper(
    request,
    booking_id,
):

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

    try:
        retailer = (
            request.user.retailer_profile
        )

    except RetailerProfile.DoesNotExist:
        return Response(
            {
                "detail": (
                    "Retailer profile not found."
                )
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        booking = Booking.objects.get(
            id=booking_id,
            retailer=retailer,
            booking_model=Booking.BookingModel.RETAILER,
        )

    except Booking.DoesNotExist:
        return Response(
            {
                "detail": (
                    "Booking request not found."
                )
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    if booking.status != Booking.Status.REQUESTED:
        return Response(
            {
                "detail": (
                    "Only requested bookings "
                    "can be assigned."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    helper_id = request.data.get(
        "helper_id"
    )

    if not helper_id:
        return Response(
            {
                "detail": (
                    "helper_id is required."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        helper = HelperProfile.objects.get(
            id=helper_id,
            retailer=retailer,
            work_model=HelperProfile.WorkModel.RETAILER,
            availability=HelperProfile.Availability.AVAILABLE,
        )

    except HelperProfile.DoesNotExist:
        return Response(
            {
                "detail": (
                    "Available Helping Hand "
                    "not found."
                )
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    if not helper.skills.filter(
        id=booking.service_id
    ).exists():
        return Response(
            {
                "detail": (
                    "This Helping Hand does not "
                    "provide the requested service."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    booking.helper = helper
    booking.status = Booking.Status.ASSIGNED

    booking.save()

    # =========================
    # HELPER + CUSTOMER
    # NOTIFICATION
    # =========================

    notify_helper_assigned(
        booking
    )

    # =========================
    # RESPONSE
    # =========================

    return Response(
        RetailerBookingSerializer(
            booking
        ).data,
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def customer_bookings(request):

    bookings = (
        Booking.objects
        .filter(
            customer=request.user
        )
        .select_related(
            "helper",
            "helper__user",
            "retailer",
            "retailer__user",
            "service",
        )
        .order_by(
            "-created_at"
        )
    )

    serializer = (
        CustomerBookingSerializer(
            bookings,
            many=True,
        )
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )
