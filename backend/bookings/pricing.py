from decimal import Decimal


BOOKING_RATES = {
    "HOURLY": Decimal("300.00"),
    "DAILY": Decimal("700.00"),
    "MONTHLY": Decimal("4500.00"),
}


def calculate_booking_price(booking_type, duration):
    if booking_type not in BOOKING_RATES:
        raise ValueError("Invalid booking type.")

    if duration is None:
        raise ValueError("Duration is required.")

    if duration <= 0:
        raise ValueError(
            "Duration must be greater than 0."
        )

    rate = BOOKING_RATES[booking_type]

    total_amount = (
        rate * Decimal(str(duration))
    )

    return rate, total_amount
