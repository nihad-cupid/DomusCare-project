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
  createRetailerBooking,
  getRetailers,
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


type Retailer = {
  id: number;
  username?: string;
  business_name: string;
  phone?: string;
  address?: string;
  is_verified?: boolean;
};


const BOOKING_RATES: Record<
  BookingType,
  number
> = {
  HOURLY: 300,
  DAILY: 700,
  MONTHLY: 4500,
};


export default function RetailerBookingPage() {
  const router =
    useRouter();

  const params =
    useParams();

  const retailerId =
    Number(params.id);


  const [
    retailer,
    setRetailer,
  ] =
    useState<Retailer | null>(
      null
    );


  const [
    services,
    setServices,
  ] =
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
     LOAD RETAILER + SERVICES
  ========================= */

  useEffect(() => {
    async function loadPage() {
      try {
        const [
          retailerData,
          serviceData,
        ] =
          await Promise.all([
            getRetailers(),
            getServices(),
          ]);


        const retailerList =
          Array.isArray(
            retailerData
          )
            ? retailerData
            : Array.isArray(
                retailerData?.results
              )
            ? retailerData.results
            : [];


        const selectedRetailer =
          retailerList.find(
            (
              item: Retailer
            ) =>
              Number(
                item.id
              ) === retailerId
          );


        if (
          !selectedRetailer
        ) {
          throw new Error(
            "Retailer not found."
          );
        }


        setRetailer(
          selectedRetailer
        );


        const serviceList =
          Array.isArray(
            serviceData
          )
            ? serviceData
            : Array.isArray(
                serviceData?.results
              )
            ? serviceData.results
            : [];


        setServices(
          serviceList
        );


        if (
          serviceList.length >
          0
        ) {
          setServiceId(
            serviceList[0].id
          );
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
      retailerId &&
      !Number.isNaN(
        retailerId
      )
    ) {
      loadPage();

    } else {
      setMessage(
        "Invalid Retailer."
      );

      setLoading(false);
    }

  }, [retailerId]);


  /* =========================
     PRICE
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
   SUBMIT
========================= */

async function handleSubmit(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  setMessage("");

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

  if (!retailerId) {
    setMessage(
      "Invalid Retailer."
    );
    return;
  }

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

  if (!address.trim()) {
    setMessage(
      "Please enter the service address."
    );
    return;
  }

  const finalDuration =
    Number(safeDuration);

  if (
    Number.isNaN(
      finalDuration
    ) ||
    finalDuration < 1
  ) {
    setMessage(
      "Duration must be at least 1."
    );
    return;
  }

  setSubmitting(true);

  try {
    const bookingData = {
  retailer_id: Number(retailerId),
  service: Number(serviceId),
  booking_type: bookingType,
  booking_date: bookingDate,
  booking_time: bookingTime,
  duration: finalDuration,
  address: address.trim(),
  instructions: instructions.trim(),
};

    console.log(
      "RETAILER BOOKING DATA:",
      bookingData
    );

    const result =
      await createRetailerBooking(
        token,
        bookingData
      );

    console.log(
      "RETAILER BOOKING SUCCESS:",
      result
    );

    router.push(
      "/bookings"
    );

  } catch (error) {
    console.error(
      "RETAILER BOOKING ERROR:",
      error
    );

    if (
      error instanceof Error
    ) {
      setMessage(
        error.message
      );
    } else {
      setMessage(
        "Could not create Retailer booking."
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
          Loading Retailer booking...
        </p>
      </div>
    </main>
  );
}
  /* =========================
     NOT FOUND
  ========================= */

  if (!retailer) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center p-6">

        <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center max-w-md w-full">

          <div className="text-5xl">
            🏢
          </div>

          <h1 className="text-2xl font-bold mt-5">
            Retailer not found
          </h1>

          <p className="text-gray-500 mt-3">
            {message ||
              "We could not find this Retailer."}
          </p>

          <Link
            href="/retailer"
            className="inline-block mt-7 bg-gray-950 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Browse Retailers
          </Link>

        </div>

      </main>
    );
  }


  const businessName =
    retailer.business_name ||
    retailer.username ||
    "Retailer";


  const initials =
    businessName
      .split(" ")
      .filter(Boolean)
      .map(
        (
          part
        ) =>
          part[0]
      )
      .join("")
      .slice(
        0,
        2
      )
      .toUpperCase();


  return (
    <main className="min-h-screen bg-[#f7f8fb] text-gray-950">


      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black">
              D
            </div>

            <span className="text-xl font-extrabold">
              DomusCare
            </span>

          </Link>


          <Link
            href="/retailer"
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-sm font-medium"
          >
            ← Back to Retailers
          </Link>

        </div>

      </nav>



      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="absolute -top-32 -left-28 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl" />

        <div className="absolute top-0 right-0 w-[430px] h-[430px] bg-indigo-300/20 rounded-full blur-3xl" />


        <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-8">

          <span className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-full text-sm font-semibold text-violet-700">
            🏢 Retailer Booking
          </span>


          <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-5">

            Request service from

            <span className="block mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              {businessName}
            </span>

          </h1>


          <p className="text-gray-600 text-lg mt-4 max-w-2xl">

            Send your service request to this Retailer.
            They will review your request and assign
            a suitable Helping Hand from their team.

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



      {/* FORM */}

      <section className="max-w-7xl mx-auto px-6 py-10 pb-20">

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="grid lg:grid-cols-[1fr_390px] gap-7">


            {/* LEFT */}

            <div className="space-y-6">


              {/* RETAILER INFO */}

              <div className="bg-white border border-gray-200 rounded-3xl p-6">

                <div className="flex items-center gap-5">

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl">
                    {initials}
                  </div>


                  <div className="flex-1">

                    <div className="flex items-center gap-2">

                      <h2 className="text-xl font-black">
                        {businessName}
                      </h2>


                      {retailer.is_verified && (
                        <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-1 font-semibold">
                          ✓ Verified
                        </span>
                      )}

                    </div>


                    {retailer.username && (

                      <p className="text-sm text-gray-400 mt-1">
                        @{retailer.username}
                      </p>

                    )}


                    {retailer.address && (

                      <p className="text-sm text-gray-500 mt-2">
                        📍 {retailer.address}
                      </p>

                    )}

                  </div>

                </div>

              </div>



              {/* SERVICE */}

              <SectionCard
                step="Step 1"
                title="Select Service"
              >

                {services.length >
                0 ? (

                  <select
                    required
                    value={
                      serviceId
                    }
                    onChange={
                      (
                        event
                      ) =>
                        setServiceId(
                          Number(
                            event.target.value
                          )
                        )
                    }
                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                  >

                    {services.map(
                      (
                        service
                      ) => (

                        <option
                          key={
                            service.id
                          }
                          value={
                            service.id
                          }
                        >
                          {service.name}
                        </option>

                      )
                    )}

                  </select>

                ) : (

                  <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl">
                    No services available.
                  </div>

                )}

              </SectionCard>



              {/* BOOKING TYPE */}

              <SectionCard
                step="Step 2"
                title="Choose Booking Type"
              >

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
                    subtitle="Long-term"
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

              </SectionCard>



              {/* DURATION */}

              <SectionCard
                step="Step 3"
                title="Duration"
              >

                <label className="block text-sm font-semibold mb-2">
                  {getDurationLabel()}
                </label>


                <input
                  type="number"
                  min="1"
                  required
                  value={
                    duration
                  }
                  onChange={
                    (
                      event
                    ) => {

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

                    }
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500"
                />

              </SectionCard>



              {/* SCHEDULE */}

              <SectionCard
                step="Step 4"
                title="Schedule"
              >

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
                      onChange={
                        (
                          event
                        ) =>
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
                      onChange={
                        (
                          event
                        ) =>
                          setBookingTime(
                            event.target.value
                          )
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500"
                    />

                  </div>

                </div>

              </SectionCard>



              {/* ADDRESS */}

              <SectionCard
                step="Step 5"
                title="Service Location"
              >

                <textarea
                  required
                  rows={4}
                  value={
                    address
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setAddress(
                        event.target.value
                      )
                  }
                  placeholder="House, road, area, city..."
                  className="w-full resize-none border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500"
                />

              </SectionCard>



              {/* INSTRUCTIONS */}

              <SectionCard
                step="Optional"
                title="Additional Instructions"
              >

                <textarea
                  rows={4}
                  value={
                    instructions
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setInstructions(
                        event.target.value
                      )
                  }
                  placeholder="Describe the work or anything the Retailer should know..."
                  className="w-full resize-none border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500"
                />

              </SectionCard>

            </div>



            {/* RIGHT SUMMARY */}

            <aside>

              <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:sticky lg:top-24 shadow-sm">

                <p className="text-xs uppercase tracking-[0.18em] text-violet-600 font-bold">
                  Booking Summary
                </p>


                <h2 className="text-2xl font-black mt-2">
                  Estimated Cost
                </h2>


                <div className="space-y-5 mt-7">

                  <SummaryItem
                    label="Retailer"
                    value={
                      businessName
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

                  <div className="flex justify-between items-end">

                    <div>

                      <p className="text-sm text-gray-500">
                        Total
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {formatBDT(
                          rate
                        )}{" "}
                        ×{" "}
                        {safeDuration}
                      </p>

                    </div>


                    <p className="text-4xl font-black text-violet-700">
                      {formatBDT(
                        totalAmount
                      )}
                    </p>

                  </div>

                </div>



                {/* RETAILER FLOW INFO */}

                <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 mt-6">

                  <p className="font-bold text-violet-700 text-sm">
                    What happens next?
                  </p>


                  <div className="space-y-3 mt-4">

                    <MiniStep
                      number="1"
                      text="Retailer receives your request."
                    />

                    <MiniStep
                      number="2"
                      text="A suitable Helping Hand is assigned."
                    />

                    <MiniStep
                      number="3"
                      text="Assigned worker starts the service."
                    />

                  </div>

                </div>



                <button
                  type="submit"
                  disabled={
                    submitting ||
                    services.length ===
                      0
                  }
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl py-4 font-bold mt-6 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >

                  {submitting
                    ? "Sending Request..."
                    : `Confirm Request • ${formatBDT(
                        totalAmount
                      )}`}

                </button>


                <Link
                  href="/retailer"
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
   SECTION CARD
========================= */

function SectionCard({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {

  return (

    <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-7">

      <div className="mb-5">

        <p className="text-sm text-violet-600 font-semibold">
          {step}
        </p>

        <h2 className="text-2xl font-bold mt-1">
          {title}
        </h2>

      </div>


      {children}

    </div>

  );

}



/* =========================
   BOOKING TYPE
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
          : "border-gray-200 bg-white hover:border-violet-200"
      }`}
    >

      {active && (

        <span className="absolute top-3 right-3 w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs">
          ✓
        </span>

      )}


      <p className="font-bold text-lg">
        {title}
      </p>


      <p className="text-xs text-gray-400 mt-1">
        {subtitle}
      </p>


      <div className="mt-5">

        <span className={`text-xl font-black ${
          active
            ? "text-violet-700"
            : ""
        }`}>
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
   SUMMARY
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



/* =========================
   MINI STEP
========================= */

function MiniStep({
  number,
  text,
}: {
  number: string;
  text: string;
}) {

  return (

    <div className="flex items-start gap-3">

      <div className="w-6 h-6 shrink-0 rounded-lg bg-violet-600 text-white flex items-center justify-center text-xs font-bold">
        {number}
      </div>

      <p className="text-sm text-gray-600">
        {text}
      </p>

    </div>

  );

}