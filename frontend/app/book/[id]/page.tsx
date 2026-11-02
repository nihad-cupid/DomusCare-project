"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  createBooking,
  getHelperDetails,
  getServices,
} from "@/lib/api";


type BookingType =
  | "HOURLY"
  | "DAILY"
  | "MONTHLY";


type Service = {
  id: number;
  name: string;
  description?: string;
};


type Helper = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  availability: string;
  experience_years: number;
  bio?: string;
  skills: Service[];
};


const BOOKING_RATES: Record<
  BookingType,
  number
> = {
  HOURLY: 300,
  DAILY: 700,
  MONTHLY: 4500,
};


export default function PersonalBookingPage() {
  const router =
    useRouter();

  const params =
    useParams();

  const helperId =
    Number(params.id);


  const [helper, setHelper] =
    useState<Helper | null>(
      null
    );

  const [services, setServices] =
    useState<Service[]>([]);


  const [
    serviceId,
    setServiceId,
  ] =
    useState<number>(0);


  const [
    bookingType,
    setBookingType,
  ] =
    useState<BookingType>(
      "HOURLY"
    );


  const [
    duration,
    setDuration,
  ] =
    useState(1);


  const [
    bookingDate,
    setBookingDate,
  ] =
    useState("");


  const [
    bookingTime,
    setBookingTime,
  ] =
    useState("");


  const [
    address,
    setAddress,
  ] =
    useState("");


  const [
    instructions,
    setInstructions,
  ] =
    useState("");


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);


  const [
    message,
    setMessage,
  ] =
    useState("");


  /* =========================
     LOAD HELPER + SERVICES
  ========================= */

  useEffect(() => {
    async function loadPage() {
      try {
        const [
          helperData,
          serviceData,
        ] =
          await Promise.all([
            getHelperDetails(
              helperId
            ),

            getServices(),
          ]);


        setHelper(
          helperData
        );


        const helperSkills =
          Array.isArray(
            helperData.skills
          )
            ? helperData.skills
            : [];


        /*
          যদি Helper-এর skills থাকে,
          শুধু ওই skills দেখাবে।

          যদি skills না থাকে,
          fallback হিসেবে সব services দেখাবে।
        */

        if (
          helperSkills.length > 0
        ) {
          setServices(
            helperSkills
          );

          setServiceId(
            helperSkills[0].id
          );

        } else {
          setServices(
            Array.isArray(
              serviceData
            )
              ? serviceData
              : []
          );

          if (
            Array.isArray(
              serviceData
            ) &&
            serviceData.length > 0
          ) {
            setServiceId(
              serviceData[0].id
            );
          }
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
            "Could not load booking page."
          );
        }

      } finally {
        setLoading(false);
      }
    }


    if (
      helperId &&
      !Number.isNaN(
        helperId
      )
    ) {
      loadPage();
    } else {
      setMessage(
        "Invalid Helping Hand."
      );

      setLoading(false);
    }

  }, [helperId]);


  /* =========================
     PRICE CALCULATION
  ========================= */

  const rate =
    BOOKING_RATES[
      bookingType
    ];


  const safeDuration =
    Math.max(
      1,
      duration
    );


  const totalAmount =
    rate *
    safeDuration;


  function getUnit() {
    if (
      bookingType ===
      "HOURLY"
    ) {
      return "hour";
    }

    if (
      bookingType ===
      "DAILY"
    ) {
      return "day";
    }

    return "month";
  }


  function getDurationLabel() {
    if (
      bookingType ===
      "HOURLY"
    ) {
      return "How many hours?";
    }

    if (
      bookingType ===
      "DAILY"
    ) {
      return "How many days?";
    }

    return "How many months?";
  }


  function formatBDT(
    amount: number
  ) {
    return `৳${amount.toLocaleString(
      "en-BD"
    )}`;
  }


  const unit =
    getUnit();


  /* =========================
     SUBMIT BOOKING
  ========================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


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


    if (!serviceId) {
      setMessage(
        "Please select a service."
      );

      return;
    }


    if (!bookingDate) {
      setMessage(
        "Please select a booking date."
      );

      return;
    }


    if (!bookingTime) {
      setMessage(
        "Please select a booking time."
      );

      return;
    }


    if (
      !address.trim()
    ) {
      setMessage(
        "Please enter the service address."
      );

      return;
    }


    if (
      safeDuration <= 0
    ) {
      setMessage(
        "Duration must be greater than 0."
      );

      return;
    }


    setSubmitting(true);
    setMessage("");


    try {
      await createBooking(
  token,
  {
    helper:
      helperId,

    service:
      serviceId,

    booking_type:
      bookingType,

    booking_date:
      bookingDate,

    booking_time:
      bookingTime,

    duration:
      safeDuration,

    address:
      address.trim(),

    instructions:
      instructions.trim(),
  }
);


      router.push(
        "/bookings"
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
          "Could not create booking."
        );
      }

    } finally {
      setSubmitting(false);
    }
  }


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Loading booking page...
          </p>

        </div>

      </main>
    );
  }


  /* =========================
     ERROR / NOT FOUND
  ========================= */

  if (!helper) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center p-6">

        <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center max-w-md w-full">

          <div className="text-5xl">
            ⚠️
          </div>

          <h1 className="text-2xl font-bold mt-5">
            Helping Hand not found
          </h1>

          <p className="text-gray-500 mt-3">
            {message ||
              "We could not load this Helping Hand."}
          </p>

          <Link
            href="/helpers"
            className="inline-block mt-7 bg-gray-950 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Browse Helping Hands
          </Link>

        </div>

      </main>
    );
  }


  const helperName =
    `${helper.first_name || ""} ${
      helper.last_name || ""
    }`.trim() ||
    helper.username;


  const initials =
    helperName
      .split(" ")
      .filter(Boolean)
      .map(
        (name) =>
          name[0]
      )
      .join("")
      .slice(
        0,
        2
      )
      .toUpperCase();


  return (
    <main className="min-h-screen bg-[#f7f8fb] text-gray-950">


      {/* =========================
          NAVBAR
      ========================== */}

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


          <Link
            href={`/helpers/${helperId}`}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-sm font-medium"
          >
            ← Back to Profile
          </Link>

        </div>

      </nav>



      {/* =========================
          PAGE HEADER
      ========================== */}

      <section className="relative overflow-hidden">

        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-300/30 blur-3xl" />

        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-indigo-300/20 blur-3xl" />


        <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-8">

          <span className="inline-flex px-4 py-2 bg-violet-50 border border-violet-100 rounded-full text-sm font-semibold text-violet-700">
            Personal Booking
          </span>


          <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-5">
            Book{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              {helperName}
            </span>
          </h1>


          <p className="text-gray-600 text-lg mt-4 max-w-2xl">
            Choose the service,
            booking type and schedule.
            You&apos;ll see the estimated
            service cost before confirming.
          </p>

        </div>

      </section>



      {/* =========================
          ERROR
      ========================== */}

      {message && (
        <div className="max-w-7xl mx-auto px-6">

          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">
            {message}
          </div>

        </div>
      )}



      {/* =========================
          BOOKING FORM
      ========================== */}

      <section className="max-w-7xl mx-auto px-6 py-10 pb-20">

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="grid lg:grid-cols-[1fr_390px] gap-7">


            {/* =====================
                LEFT SIDE
            ====================== */}

            <div className="space-y-6">


              {/* HELPER CARD */}

              <div className="bg-white border border-gray-200 rounded-3xl p-6">

                <div className="flex items-center gap-5">

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl">
                    {initials}
                  </div>


                  <div className="flex-1">

                    <p className="text-sm text-gray-400">
                      Your Helping Hand
                    </p>

                    <h2 className="text-xl font-bold mt-1">
                      {helperName}
                    </h2>

                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">

                      <span>
                        @{helper.username}
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {
                          helper.experience_years
                        }{" "}
                        year
                        {helper.experience_years !==
                        1
                          ? "s"
                          : ""}{" "}
                        experience
                      </span>

                    </div>

                  </div>


                  <span className="hidden sm:inline-flex bg-green-50 text-green-700 border border-green-100 rounded-full px-3 py-1 text-xs font-semibold">
                    {helper.availability}
                  </span>

                </div>

              </div>



              {/* SERVICE */}

              <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-7">

                <div className="mb-5">

                  <p className="text-sm text-violet-600 font-semibold">
                    Step 1
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Select Service
                  </h2>

                </div>


                {services.length >
                0 ? (

                  <select
                    required
                    value={serviceId}
                    onChange={(event) =>
                      setServiceId(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                  >

                    {services.map(
                      (service) => (

                        <option
                          key={
                            service.id
                          }
                          value={
                            service.id
                          }
                        >
                          {
                            service.name
                          }
                        </option>

                      )
                    )}

                  </select>

                ) : (

                  <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl">
                    This Helping Hand currently has no services available.
                  </div>

                )}

              </div>



              {/* BOOKING TYPE */}

              <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-7">

                <div className="mb-5">

                  <p className="text-sm text-violet-600 font-semibold">
                    Step 2
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Choose Booking Type
                  </h2>

                </div>


                <div className="grid sm:grid-cols-3 gap-4">

                  <BookingTypeCard
                    title="Hourly"
                    subtitle="Short jobs"
                    price="৳300"
                    unit="/ hour"
                    active={
                      bookingType ===
                      "HOURLY"
                    }
                    onClick={() =>
                      setBookingType(
                        "HOURLY"
                      )
                    }
                  />


                  <BookingTypeCard
                    title="Daily"
                    subtitle="Full-day service"
                    price="৳700"
                    unit="/ day"
                    active={
                      bookingType ===
                      "DAILY"
                    }
                    onClick={() =>
                      setBookingType(
                        "DAILY"
                      )
                    }
                  />


                  <BookingTypeCard
                    title="Monthly"
                    subtitle="Long-term service"
                    price="৳4,500"
                    unit="/ month"
                    active={
                      bookingType ===
                      "MONTHLY"
                    }
                    onClick={() =>
                      setBookingType(
                        "MONTHLY"
                      )
                    }
                  />

                </div>

              </div>



              {/* DURATION */}

              <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-7">

                <div className="mb-5">

                  <p className="text-sm text-violet-600 font-semibold">
                    Step 3
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Duration
                  </h2>

                </div>


                <label className="block text-sm font-semibold mb-2">
                  {getDurationLabel()}
                </label>


                <input
                  type="number"
                  min="1"
                  required
                  value={duration}
                  onChange={(event) => {
                    const value =
                      Number(
                        event.target.value
                      );

                    setDuration(
                      Number.isNaN(
                        value
                      )
                        ? 1
                        : Math.max(
                            1,
                            value
                          )
                    );
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                />


                <p className="text-sm text-gray-400 mt-2">

                  {bookingType ===
                    "HOURLY" &&
                    "Enter how many hours you need the Helping Hand."}

                  {bookingType ===
                    "DAILY" &&
                    "Enter how many days you need the Helping Hand."}

                  {bookingType ===
                    "MONTHLY" &&
                    "Enter how many months you need the Helping Hand."}

                </p>

              </div>



              {/* DATE / TIME */}

              <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-7">

                <div className="mb-5">

                  <p className="text-sm text-violet-600 font-semibold">
                    Step 4
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Schedule
                  </h2>

                </div>


                <div className="grid md:grid-cols-2 gap-4">

                  <div>

                    <label className="block text-sm font-semibold mb-2">
                      Booking Date
                    </label>

                    <input
                      type="date"
                      required
                      value={
                        bookingDate
                      }
                      onChange={(event) =>
                        setBookingDate(
                          event.target.value
                        )
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500"
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-semibold mb-2">
                      Start Time
                    </label>

                    <input
                      type="time"
                      required
                      value={
                        bookingTime
                      }
                      onChange={(event) =>
                        setBookingTime(
                          event.target.value
                        )
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500"
                    />

                  </div>

                </div>

              </div>



              {/* ADDRESS */}

              <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-7">

                <div className="mb-5">

                  <p className="text-sm text-violet-600 font-semibold">
                    Step 5
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Service Location
                  </h2>

                </div>


                <label className="block text-sm font-semibold mb-2">
                  Address
                </label>

                <textarea
                  required
                  rows={4}
                  value={address}
                  onChange={(event) =>
                    setAddress(
                      event.target.value
                    )
                  }
                  placeholder="House, road, area, city..."
                  className="w-full resize-none border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                />

              </div>



              {/* INSTRUCTIONS */}

              <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-7">

                <div className="mb-5">

                  <p className="text-sm text-violet-600 font-semibold">
                    Optional
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Additional Instructions
                  </h2>

                </div>


                <textarea
                  rows={4}
                  value={
                    instructions
                  }
                  onChange={(event) =>
                    setInstructions(
                      event.target.value
                    )
                  }
                  placeholder="Describe the work or anything the Helping Hand should know..."
                  className="w-full resize-none border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                />

              </div>

            </div>



            {/* =====================
                RIGHT SUMMARY
            ====================== */}

            <aside>

              <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:sticky lg:top-24 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm uppercase tracking-[0.18em] text-violet-600 font-bold">
                      Summary
                    </p>

                    <h2 className="text-2xl font-black mt-1">
                      Booking Cost
                    </h2>

                  </div>


                  <div className="w-12 h-12 bg-violet-50 text-violet-700 rounded-2xl flex items-center justify-center font-black text-xl">
                    ৳
                  </div>

                </div>


                <div className="space-y-5 mt-7">

                  <SummaryItem
                    label="Helping Hand"
                    value={
                      helperName
                    }
                  />


                  <SummaryItem
                    label="Booking Type"
                    value={
                      bookingType ===
                      "HOURLY"
                        ? "Hourly"
                        : bookingType ===
                          "DAILY"
                        ? "Daily"
                        : "Monthly"
                    }
                  />


                  <SummaryItem
                    label="Rate"
                    value={`${formatBDT(
                      rate
                    )} / ${unit}`}
                  />


                  <SummaryItem
                    label="Duration"
                    value={`${safeDuration} ${unit}${
                      safeDuration >
                      1
                        ? "s"
                        : ""
                    }`}
                  />

                </div>


                <div className="border-t border-gray-200 mt-7 pt-6">

                  <div className="flex items-end justify-between gap-4">

                    <div>

                      <p className="text-sm text-gray-500">
                        Estimated Total
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {formatBDT(
                          rate
                        )}{" "}
                        ×{" "}
                        {
                          safeDuration
                        }
                      </p>

                    </div>


                    <p className="text-4xl font-black text-violet-700">
                      {formatBDT(
                        totalAmount
                      )}
                    </p>

                  </div>

                </div>


                <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 mt-6">

                  <p className="text-sm font-semibold text-violet-700">
                    Secure price calculation
                  </p>

                  <p className="text-xs text-gray-500 leading-relaxed mt-2">
                    This page shows an estimate.
                    The Django backend calculates
                    and saves the final rate and
                    total amount when the booking
                    is created.
                  </p>

                </div>


                <button
                  type="submit"
                  disabled={
                    submitting ||
                    services.length ===
                      0
                  }
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white rounded-xl py-4 font-bold mt-6 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >

                  {submitting
                    ? "Creating Booking..."
                    : `Confirm Booking • ${formatBDT(
                        totalAmount
                      )}`}

                </button>


                <Link
                  href={`/helpers/${helperId}`}
                  className="block w-full text-center border border-gray-200 rounded-xl py-3.5 font-semibold mt-3 hover:bg-gray-50 transition"
                >
                  Cancel
                </Link>

              </div>

            </aside>

          </div>

        </form>

      </section>

    </main>
  );
}


/* =========================
   BOOKING TYPE CARD
========================= */

function BookingTypeCard({
  title,
  subtitle,
  price,
  unit,
  active,
  onClick,
}: {
  title: string;
  subtitle: string;
  price: string;
  unit: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`relative text-left rounded-2xl border p-5 transition-all ${
        active
          ? "border-violet-500 bg-violet-50 ring-2 ring-violet-500/10"
          : "border-gray-200 bg-white hover:border-violet-200 hover:shadow-sm"
      }`}
    >

      {active && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs">
          ✓
        </div>
      )}


      <p className="font-bold text-lg">
        {title}
      </p>


      <p className="text-xs text-gray-400 mt-1">
        {subtitle}
      </p>


      <div className="mt-5">

        <span
          className={`text-xl font-black ${
            active
              ? "text-violet-700"
              : "text-gray-950"
          }`}
        >
          {price}
        </span>

        <span className="text-xs text-gray-400 ml-1">
          {unit}
        </span>

      </div>

    </button>
  );
}


/* =========================
   SUMMARY ITEM
========================= */

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-right">
        {value}
      </p>

    </div>
  );
}