"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import {
  useRouter,
} from "next/navigation";

import {
  cancelBooking,
  getMyBookings,
} from "@/lib/api";
import NotificationBell from "@/components/NotificationBell";


type Service = {
  id: number;
  name: string;
};


type Helper = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
};


type Retailer = {
  id: number;
  business_name?: string;
};


type Booking = {
  id: number;

  booking_model:
    | "PERSONAL"
    | "RETAILER";

  booking_type:
    | "HOURLY"
    | "DAILY"
    | "MONTHLY";

  status:
    | "REQUESTED"
    | "ACCEPTED"
    | "REJECTED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

  service:
    | number
    | Service;

  helper:
    | number
    | Helper
    | null;

  retailer:
    | number
    | Retailer
    | null;

  booking_date: string;
  booking_time: string;

  duration: number;

  address: string;
  instructions?: string;

  rate:
    | string
    | number;

  total_amount:
    | string
    | number;

  has_review?: boolean;

  created_at?: string;
};


export default function MyBookingsPage() {
  const router =
    useRouter();

  const [
    bookings,
    setBookings,
  ] =
    useState<Booking[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    cancellingId,
    setCancellingId,
  ] =
    useState<number | null>(
      null
    );


  useEffect(() => {
    loadBookings();
  }, []);


  async function loadBookings() {
    const accessToken =
  localStorage.getItem("access");

const refreshToken =
  localStorage.getItem("refresh");

if (
  !accessToken &&
  !refreshToken
) {
  router.push("/login");
  return;
}

const token =
  accessToken || "";


    try {
      const data =
        await getMyBookings(
          token
        );


      if (
        Array.isArray(data)
      ) {
        setBookings(
          data
        );

      } else if (
        Array.isArray(
          data?.results
        )
      ) {
        setBookings(
          data.results
        );

      } else {
        setBookings([]);
      }


    } catch (error) {
      if (
        error instanceof Error
      ) {
        setMessage(
          error.message
        );
      } else {
        setMessage(
          "Could not load bookings."
        );
      }

    } finally {
      setLoading(false);
    }
  }


  async function handleCancel(
    bookingId: number
  ) {
    const token =
      localStorage.getItem(
        "access"
      );

    if (!token) {
      router.push(
        "/login"
      );

      return;
    }


    setCancellingId(
      bookingId
    );

    setMessage("");


    try {
      await cancelBooking(
        token,
        bookingId
      );


      setBookings(
        (
          currentBookings
        ) =>
          currentBookings.map(
            (booking) =>
              booking.id ===
              bookingId
                ? {
                    ...booking,
                    status:
                      "CANCELLED",
                  }
                : booking
          )
      );


    } catch (error) {
      if (
        error instanceof Error
      ) {
        setMessage(
          error.message
        );
      } else {
        setMessage(
          "Could not cancel booking."
        );
      }

    } finally {
      setCancellingId(
        null
      );
    }
  }


  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-4">
            Loading bookings...
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#f7f8fb] text-gray-950">


      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold">
              D
            </div>

            <span className="text-xl font-extrabold">
              DomusCare
            </span>

          </Link>


          <div className="flex items-center gap-3">
            
            {/* NOTIFICATION */}
                      <NotificationBell />

            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
            >
              Dashboard
            </Link>


            <Link
              href="/services"
              className="px-4 py-2 rounded-xl bg-gray-950 text-white hover:bg-gray-800 transition"
            >
              Book Service
            </Link>

          </div>

        </div>

      </nav>



      {/* PAGE HEADER */}

      <section className="relative overflow-hidden">

        <div className="absolute -top-28 -left-28 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl" />

        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-indigo-300/20 rounded-full blur-3xl" />


        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10">

          <span className="inline-flex px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-sm font-semibold">
            Booking History
          </span>


          <h1 className="text-4xl md:text-5xl font-black mt-5">
            My Bookings
          </h1>


          <p className="text-gray-600 mt-4 max-w-2xl text-lg">
            Track Personal and Retailer bookings,
            service progress and total service cost.
          </p>

        </div>

      </section>



      {/* ERROR */}

      {message && (
        <div className="max-w-7xl mx-auto px-6">

          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">
            {message}
          </div>

        </div>
      )}



      {/* BOOKINGS */}

      <section className="max-w-7xl mx-auto px-6 py-10 pb-20">

        {bookings.length ===
        0 ? (

          <div className="bg-white border border-gray-200 rounded-[32px] p-12 text-center">

            <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center text-4xl mx-auto">
              📅
            </div>


            <h2 className="text-2xl font-bold mt-6">
              No bookings yet
            </h2>


            <p className="text-gray-500 mt-3 max-w-md mx-auto">
              You haven&apos;t booked any DomusCare services yet.
              Browse Helping Hands or Retailers to get started.
            </p>


            <div className="flex flex-wrap justify-center gap-3 mt-7">

              <Link
                href="/helpers"
                className="bg-gray-950 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Find Helping Hands
              </Link>


              <Link
                href="/retailer"
                className="border border-gray-200 px-6 py-3 rounded-xl font-semibold"
              >
                Browse Retailers
              </Link>

            </div>

          </div>

        ) : (

          <div className="space-y-6">

            {bookings.map(
              (booking) => (

                <BookingCard
                  key={
                    booking.id
                  }
                  booking={
                    booking
                  }
                  cancelling={
                    cancellingId ===
                    booking.id
                  }
                  onCancel={
                    handleCancel
                  }
                />

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}



function BookingCard({
  booking,
  cancelling,
  onCancel,
}: {
  booking: Booking;
  cancelling: boolean;
  onCancel: (
    id: number
  ) => void;
}) {

  const serviceName =
    typeof booking.service ===
    "object"
      ? booking.service.name
      : `Service #${booking.service}`;


  const helperName =
    getHelperName(
      booking.helper
    );


  const retailerName =
    getRetailerName(
      booking.retailer
    );


  const rate =
    Number(
      booking.rate || 0
    );


  const totalAmount =
    Number(
      booking.total_amount ||
        0
    );


  const unit =
    getBookingUnit(
      booking.booking_type
    );


  /*
    Personal booking:
    REQUESTED / ACCEPTED cancel করা যাবে

    Retailer booking:
    শুধু REQUESTED অবস্থায় cancel
  */

  const canCancel =
    booking.booking_model ===
    "PERSONAL"
      ? booking.status ===
          "REQUESTED" ||
        booking.status ===
          "ACCEPTED"
      : booking.status ===
        "REQUESTED";


  return (
    <article className="bg-white border border-gray-200 rounded-[28px] overflow-hidden shadow-sm">

      {/* TOP */}

      <div className="p-6 md:p-7">

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">


          <div>

            <div className="flex flex-wrap items-center gap-3">

              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  booking.booking_model ===
                  "PERSONAL"
                    ? "bg-violet-50 text-violet-700 border border-violet-100"
                    : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                }`}
              >
                {booking.booking_model ===
                "PERSONAL"
                  ? "PERSONAL"
                  : "RETAILER"}
              </span>


              <StatusBadge
                status={
                  booking.status
                }
              />

            </div>


            <h2 className="text-2xl font-bold mt-4">
              {serviceName}
            </h2>


            <p className="text-gray-400 text-sm mt-1">
              Booking #
              {booking.id}
            </p>

          </div>


          <div className="lg:text-right">

            <p className="text-sm text-gray-400">
              Total Amount
            </p>

            <p className="text-3xl font-black text-violet-700 mt-1">
              {formatMoney(
                totalAmount
              )}
            </p>

          </div>

        </div>



        {/* DETAILS */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">


          <DetailCard
            label="Date"
            value={
              formatDate(
                booking.booking_date
              )
            }
          />


          <DetailCard
            label="Start Time"
            value={
              formatTime(
                booking.booking_time
              )
            }
          />


          <DetailCard
            label="Booking Type"
            value={
              formatBookingType(
                booking.booking_type
              )
            }
          />


          <DetailCard
            label="Duration"
            value={`${booking.duration} ${unit}${
              booking.duration !==
              1
                ? "s"
                : ""
            }`}
          />

        </div>



        {/* PROVIDER */}

        <div className="mt-6 bg-gray-50 border border-gray-100 rounded-2xl p-5">

          {booking.booking_model ===
          "PERSONAL" ? (

            <div>

              <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold">
                Helping Hand
              </p>

              <p className="font-bold mt-2">
                {helperName ||
                  "Helping Hand unavailable"}
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold">
                  Retailer
                </p>

                <p className="font-bold mt-2">
                  {retailerName ||
                    "Retailer"}
                </p>

              </div>


              <div>

                <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold">
                  Assigned Helping Hand
                </p>


                {helperName ? (

                  <p className="font-bold mt-2">
                    {helperName}
                  </p>

                ) : (

                  <div className="mt-2">

                    <p className="font-semibold text-amber-700">
                      Waiting for assignment
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      The Retailer will assign a suitable Helping Hand.
                    </p>

                  </div>

                )}

              </div>

            </div>

          )}

        </div>



        {/* LOCATION */}

        <div className="grid md:grid-cols-2 gap-4 mt-6">

          <div className="border border-gray-200 rounded-2xl p-5">

            <p className="text-xs text-gray-400 uppercase tracking-[0.15em] font-semibold">
              Service Address
            </p>

            <p className="text-gray-700 mt-2 leading-relaxed">
              {booking.address}
            </p>

          </div>


          <div className="border border-gray-200 rounded-2xl p-5">

            <p className="text-xs text-gray-400 uppercase tracking-[0.15em] font-semibold">
              Instructions
            </p>

            <p className="text-gray-700 mt-2 leading-relaxed">
              {booking.instructions ||
                "No additional instructions."}
            </p>

          </div>

        </div>



        {/* PRICE SUMMARY */}

        <div className="mt-6 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.18em] text-violet-600 font-bold">
                Price Summary
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Service charge
              </p>

            </div>


            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-violet-700 font-black shadow-sm">
              ৳
            </div>

          </div>


          <div className="grid sm:grid-cols-3 gap-4 mt-5">

            <PriceItem
              label="Rate"
              value={`${formatMoney(
                rate
              )} / ${unit}`}
            />


            <PriceItem
              label="Duration"
              value={`${booking.duration} ${unit}${
                booking.duration !==
                1
                  ? "s"
                  : ""
              }`}
            />


            <PriceItem
              label="Total"
              value={
                formatMoney(
                  totalAmount
                )
              }
              highlight
            />

          </div>


          {rate === 0 ||
          totalAmount === 0 ? (

            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3 mt-4">
              This may be an older booking created before pricing was added.
            </p>

          ) : null}

        </div>



        {/* ACTIONS */}

        <div className="flex flex-wrap gap-3 mt-7">


          {canCancel && (
            <button
              type="button"
              disabled={
                cancelling
              }
              onClick={() =>
                onCancel(
                  booking.id
                )
              }
              className="px-5 py-3 rounded-xl bg-red-50 text-red-700 border border-red-100 font-semibold hover:bg-red-100 disabled:opacity-50 transition"
            >
              {cancelling
                ? "Cancelling..."
                : "Cancel Booking"}
            </button>
          )}


          {booking.status ===
            "COMPLETED" &&
            !booking.has_review &&
            booking.helper && (

              <Link
                href={`/review/${booking.id}`}
                className="px-5 py-3 rounded-xl bg-gray-950 text-white font-semibold hover:bg-gray-800 transition"
              >
                Leave Review
              </Link>

            )}


          {booking.status ===
            "COMPLETED" &&
            booking.has_review && (

              <span className="px-5 py-3 rounded-xl bg-green-50 text-green-700 border border-green-100 font-semibold">
                ✓ Reviewed
              </span>

            )}


          {booking.booking_model ===
            "PERSONAL" &&
            booking.helper &&
            typeof booking.helper ===
              "object" && (

              <Link
                href={`/helpers/${booking.helper.id}`}
                className="px-5 py-3 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50 transition"
              >
                View Helping Hand
              </Link>

            )}

        </div>

      </div>

    </article>
  );
}



function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-gray-200 rounded-2xl p-4">

      <p className="text-xs text-gray-400 uppercase tracking-wider">
        {label}
      </p>

      <p className="font-semibold mt-2">
        {value}
      </p>

    </div>
  );
}



function PriceItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white/80 border border-white rounded-xl p-4">

      <p className="text-xs text-gray-400 uppercase tracking-wider">
        {label}
      </p>

      <p
        className={`font-bold mt-2 ${
          highlight
            ? "text-xl text-violet-700"
            : ""
        }`}
      >
        {value}
      </p>

    </div>
  );
}



function StatusBadge({
  status,
}: {
  status: Booking["status"];
}) {

  const styles: Record<
    Booking["status"],
    string
  > = {
    REQUESTED:
      "bg-blue-50 text-blue-700 border-blue-100",

    ACCEPTED:
      "bg-cyan-50 text-cyan-700 border-cyan-100",

    REJECTED:
      "bg-red-50 text-red-700 border-red-100",

    ASSIGNED:
      "bg-indigo-50 text-indigo-700 border-indigo-100",

    IN_PROGRESS:
      "bg-amber-50 text-amber-700 border-amber-100",

    COMPLETED:
      "bg-green-50 text-green-700 border-green-100",

    CANCELLED:
      "bg-gray-100 text-gray-600 border-gray-200",
  };


  const text =
    status
      .replace(
        "_",
        " "
      )
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );


  return (
    <span
      className={`text-xs font-bold px-3 py-1.5 rounded-full border ${styles[status]}`}
    >
      {text}
    </span>
  );
}



function getHelperName(
  helper:
    | number
    | Helper
    | null
) {
  if (!helper) {
    return "";
  }


  if (
    typeof helper ===
    "number"
  ) {
    return `Helping Hand #${helper}`;
  }


  const name =
    `${helper.first_name || ""} ${
      helper.last_name || ""
    }`.trim();


  return (
    name ||
    helper.username
  );
}



function getRetailerName(
  retailer:
    | number
    | Retailer
    | null
) {
  if (!retailer) {
    return "";
  }


  if (
    typeof retailer ===
    "number"
  ) {
    return `Retailer #${retailer}`;
  }


  return (
    retailer.business_name ||
    `Retailer #${retailer.id}`
  );
}



function getBookingUnit(
  type:
    Booking["booking_type"]
) {
  if (
    type === "HOURLY"
  ) {
    return "hour";
  }

  if (
    type === "DAILY"
  ) {
    return "day";
  }

  return "month";
}



function formatBookingType(
  type:
    Booking["booking_type"]
) {
  if (
    type === "HOURLY"
  ) {
    return "Hourly";
  }

  if (
    type === "DAILY"
  ) {
    return "Daily";
  }

  return "Monthly";
}



function formatMoney(
  amount: number
) {
  return `৳${amount.toLocaleString(
    "en-BD"
  )}`;
}



function formatDate(
  value: string
) {
  if (!value) {
    return "—";
  }


  const date =
    new Date(
      `${value}T00:00:00`
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }


  return date.toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}



function formatTime(
  value: string
) {
  if (!value) {
    return "—";
  }


  const parts =
    value.split(":");


  const hour =
    Number(parts[0]);

  const minute =
    parts[1] || "00";


  if (
    Number.isNaN(hour)
  ) {
    return value;
  }


  const period =
    hour >= 12
      ? "PM"
      : "AM";


  const displayHour =
    hour % 12 || 12;


  return `${displayHour}:${minute} ${period}`;
}