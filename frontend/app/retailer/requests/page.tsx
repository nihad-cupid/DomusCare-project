"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  assignBookingHelper,
  getAvailableWorkersForRetailer,
  getRetailerBookingRequests,
} from "@/lib/api";
import NotificationBell from "@/components/NotificationBell";

type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "REJECTED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";


type BookingType =
  | "HOURLY"
  | "DAILY"
  | "MONTHLY";


type Booking = {
  id: number;

  booking_model?: string;

  customer_username?: string;
  customer_name?: string;

  service: number;
  service_name?: string;

  helper?: number | null;
  helper_name?: string | null;

  retailer?: number | null;

  booking_type: BookingType;

  booking_date: string;
  booking_time: string;

  duration: number;

  address: string;
  instructions?: string;

  status: BookingStatus;

  rate?: string | number;
  total_amount?: string | number;

  created_at?: string;
  updated_at?: string;
};


type Skill = {
  id: number;
  name: string;
};


type Worker = {
  id: number;

  username?: string;

  first_name?: string;
  last_name?: string;

  user?: {
    id?: number;
    username?: string;
    first_name?: string;
    last_name?: string;
  };

  availability?: string;

  experience_years?: number;

  skills?: Skill[];

  bio?: string;
};


export default function RetailerRequestsPage() {
  const router =
    useRouter();


  const [
    bookings,
    setBookings,
  ] =
    useState<Booking[]>([]);


  const [
    workers,
    setWorkers,
  ] =
    useState<Worker[]>([]);


  const [
    selectedWorkers,
    setSelectedWorkers,
  ] =
    useState<
      Record<number, number>
    >({});


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
    successMessage,
    setSuccessMessage,
  ] =
    useState("");


  const [
    assigningId,
    setAssigningId,
  ] =
    useState<number | null>(
      null
    );


  const [
    filter,
    setFilter,
  ] =
    useState<
      "ALL" | BookingStatus
    >("ALL");


  useEffect(() => {
    loadPage();
  }, []);


  async function loadPage() {
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
      setMessage("");


      const [
        bookingData,
        workerData,
      ] =
        await Promise.all([
          getRetailerBookingRequests(
            token
          ),

          getAvailableWorkersForRetailer(
            token
          ),
        ]);


      const bookingList =
        Array.isArray(
          bookingData
        )
          ? bookingData
          : Array.isArray(
              bookingData?.results
            )
          ? bookingData.results
          : [];


      const workerList =
        Array.isArray(
          workerData
        )
          ? workerData
          : Array.isArray(
              workerData?.results
            )
          ? workerData.results
          : [];


      setBookings(
        bookingList
      );


      setWorkers(
        workerList
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
          "Could not load Retailer requests."
        );
      }

    } finally {
      setLoading(false);
    }
  }


  async function handleAssign(
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


    const helperId =
      selectedWorkers[
        bookingId
      ];


    if (!helperId) {
      setMessage(
        "Please select a Helping Hand first."
      );

      return;
    }


    setAssigningId(
      bookingId
    );

    setMessage("");
    setSuccessMessage("");


    try {
      const updatedBooking =
        await assignBookingHelper(
          token,
          bookingId,
          helperId
        );


      setBookings(
        (
          current
        ) =>
          current.map(
            (
              booking
            ) =>
              booking.id ===
              bookingId
                ? {
                    ...booking,
                    ...updatedBooking,
                    status:
                      "ASSIGNED",
                    helper:
                      helperId,

                    helper_name:
                      updatedBooking?.helper_name ||
                      getWorkerName(
                        workers.find(
                          (
                            worker
                          ) =>
                            worker.id ===
                            helperId
                        )
                      ),
                  }
                : booking
          )
      );


      setSuccessMessage(
        "Helping Hand assigned successfully."
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
          "Could not assign Helping Hand."
        );
      }

    } finally {
      setAssigningId(
        null
      );
    }
  }


  const filteredBookings =
    useMemo(() => {

      if (
        filter === "ALL"
      ) {
        return bookings;
      }


      return bookings.filter(
        (
          booking
        ) =>
          booking.status ===
          filter
      );

    }, [
      bookings,
      filter,
    ]);


  const requestCount =
    bookings.filter(
      (
        booking
      ) =>
        booking.status ===
        "REQUESTED"
    ).length;


  const assignedCount =
    bookings.filter(
      (
        booking
      ) =>
        booking.status ===
        "ASSIGNED"
    ).length;


  const activeCount =
    bookings.filter(
      (
        booking
      ) =>
        booking.status ===
          "IN_PROGRESS"
    ).length;


  const completedCount =
    bookings.filter(
      (
        booking
      ) =>
        booking.status ===
        "COMPLETED"
    ).length;


  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Loading service requests...
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#f7f8fb] text-gray-950">


      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-violet-200">
              D
            </div>


            <div>

              <p className="font-black text-xl leading-none">
                DomusCare
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mt-1">
                Retailer Workspace
              </p>

            </div>

          </Link>


          <div className="flex items-center gap-3">
            <NotificationBell />

            <Link
              href="/retailer/workers"
              className="hidden sm:inline-flex px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-semibold text-sm hover:bg-gray-50 transition"
            >
              My Team
            </Link>


            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-gray-950 text-white font-semibold text-sm hover:bg-gray-800 transition"
            >
              Dashboard
            </Link>

          </div>

        </div>

      </nav>



      {/* =========================
          HEADER
      ========================= */}

      <section className="relative overflow-hidden">

        <div className="absolute -top-32 -left-24 w-[420px] h-[420px] bg-violet-300/30 rounded-full blur-3xl" />

        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-indigo-300/20 rounded-full blur-3xl" />


        <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-10">

          <span className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 rounded-full px-4 py-2 text-sm font-semibold">

            <span className="w-2 h-2 rounded-full bg-green-500" />

            Retailer Control Center

          </span>


          <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-5">

            Manage your

            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}service requests.
            </span>

          </h1>


          <p className="text-gray-600 text-lg mt-4 max-w-2xl">
            Review incoming customer requests,
            assign suitable Helping Hands and monitor
            service progress from one place.
          </p>



          {/* STATS */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">

            <StatCard
              icon="📥"
              label="New Requests"
              value={
                requestCount
              }
            />

            <StatCard
              icon="👷"
              label="Assigned"
              value={
                assignedCount
              }
            />

            <StatCard
              icon="🛠️"
              label="In Progress"
              value={
                activeCount
              }
            />

            <StatCard
              icon="✅"
              label="Completed"
              value={
                completedCount
              }
            />

          </div>

        </div>

      </section>



      {/* =========================
          MESSAGES
      ========================= */}

      <section className="max-w-7xl mx-auto px-6">

        {message && (

          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-4">
            {message}
          </div>

        )}


        {successMessage && (

          <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 mb-4">
            {successMessage}
          </div>

        )}

      </section>



      {/* =========================
          FILTER
      ========================= */}

      <section className="max-w-7xl mx-auto px-6 py-8">

        <div className="bg-white border border-gray-200 rounded-2xl p-3 flex flex-wrap gap-2">

          <FilterButton
            active={
              filter === "ALL"
            }
            label={`All (${bookings.length})`}
            onClick={() =>
              setFilter(
                "ALL"
              )
            }
          />


          <FilterButton
            active={
              filter ===
              "REQUESTED"
            }
            label={`Requests (${requestCount})`}
            onClick={() =>
              setFilter(
                "REQUESTED"
              )
            }
          />


          <FilterButton
            active={
              filter ===
              "ASSIGNED"
            }
            label={`Assigned (${assignedCount})`}
            onClick={() =>
              setFilter(
                "ASSIGNED"
              )
            }
          />


          <FilterButton
            active={
              filter ===
              "IN_PROGRESS"
            }
            label={`Active (${activeCount})`}
            onClick={() =>
              setFilter(
                "IN_PROGRESS"
              )
            }
          />


          <FilterButton
            active={
              filter ===
              "COMPLETED"
            }
            label={`Completed (${completedCount})`}
            onClick={() =>
              setFilter(
                "COMPLETED"
              )
            }
          />

        </div>

      </section>



      {/* =========================
          REQUESTS
      ========================= */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        {filteredBookings.length ===
        0 ? (

          <div className="bg-white border border-gray-200 rounded-[32px] p-14 text-center">

            <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center text-4xl mx-auto">
              📭
            </div>


            <h2 className="text-2xl font-black mt-6">
              No service requests
            </h2>


            <p className="text-gray-500 mt-3 max-w-md mx-auto">
              There are no bookings matching this status right now.
            </p>


            <Link
              href="/dashboard"
              className="inline-flex mt-7 bg-gray-950 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Back to Dashboard
            </Link>

          </div>

        ) : (

          <div className="space-y-6">

            {filteredBookings.map(
              (
                booking
              ) => (

                <RequestCard
                  key={
                    booking.id
                  }
                  booking={
                    booking
                  }
                  workers={
                    workers
                  }
                  selectedWorker={
                    selectedWorkers[
                      booking.id
                    ] || 0
                  }
                  assigning={
                    assigningId ===
                    booking.id
                  }
                  onSelectWorker={
                    (
                      helperId
                    ) =>
                      setSelectedWorkers(
                        (
                          current
                        ) => ({
                          ...current,

                          [booking.id]:
                            helperId,
                        })
                      )
                  }
                  onAssign={
                    handleAssign
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



/* =========================
   REQUEST CARD
========================= */

function RequestCard({
  booking,
  workers,
  selectedWorker,
  assigning,
  onSelectWorker,
  onAssign,
}: {
  booking: Booking;
  workers: Worker[];
  selectedWorker: number;
  assigning: boolean;

  onSelectWorker: (
    id: number
  ) => void;

  onAssign: (
    bookingId: number
  ) => void;
}) {

  const rate =
    Number(
      booking.rate || 0
    );


  const total =
    Number(
      booking.total_amount ||
        0
    );


  const unit =
    getBookingUnit(
      booking.booking_type
    );

const eligibleWorkers =
  workers.filter(
    (worker) =>
      worker.availability === "AVAILABLE" &&
      worker.skills?.some(
        (skill) =>
          Number(skill.id) ===
          Number(booking.service)
      )
  );


  return (
    <article className="bg-white border border-gray-200 rounded-[30px] overflow-hidden shadow-sm">


      {/* TOP */}

      <div className="p-6 md:p-8">

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">


          <div>

            <div className="flex flex-wrap items-center gap-3">

              <StatusBadge
                status={
                  booking.status
                }
              />


              <span className="bg-violet-50 text-violet-700 border border-violet-100 rounded-full px-3 py-1.5 text-xs font-bold">
                Retailer Booking
              </span>

            </div>


            <h2 className="text-2xl md:text-3xl font-black mt-4">

              {booking.service_name ||
                `Service #${booking.service}`}

            </h2>


            <p className="text-gray-400 text-sm mt-1">
              Booking #
              {booking.id}
            </p>

          </div>


          <div className="lg:text-right">

            <p className="text-sm text-gray-400">
              Total Service Cost
            </p>

            <p className="text-3xl font-black text-violet-700 mt-1">
              {formatMoney(
                total
              )}
            </p>

          </div>

        </div>



        {/* CUSTOMER */}

        <div className="mt-7 bg-gray-950 text-white rounded-2xl p-5">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 shrink-0 bg-white/10 rounded-xl flex items-center justify-center text-xl">
              👤
            </div>


            <div>

              <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold">
                Customer
              </p>

              <p className="font-bold mt-1">
                {booking.customer_name ||
                  booking.customer_username ||
                  "Customer"}
              </p>


              {booking.customer_username && (

                <p className="text-xs text-gray-400 mt-1">
                  @{booking.customer_username}
                </p>

              )}

            </div>

          </div>

        </div>



        {/* BOOKING DETAILS */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

          <InfoBox
            label="Booking Type"
            value={
              formatBookingType(
                booking.booking_type
              )
            }
          />


          <InfoBox
            label="Date"
            value={
              formatDate(
                booking.booking_date
              )
            }
          />


          <InfoBox
            label="Time"
            value={
              formatTime(
                booking.booking_time
              )
            }
          />


          <InfoBox
            label="Duration"
            value={`${booking.duration} ${unit}${
              booking.duration !==
              1
                ? "s"
                : ""
            }`}
          />

        </div>



        {/* ADDRESS + INSTRUCTIONS */}

        <div className="grid md:grid-cols-2 gap-4 mt-6">

          <div className="border border-gray-200 rounded-2xl p-5">

            <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-bold">
              Service Address
            </p>

            <p className="text-gray-700 leading-relaxed mt-2">
              {booking.address}
            </p>

          </div>


          <div className="border border-gray-200 rounded-2xl p-5">

            <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-bold">
              Instructions
            </p>

            <p className="text-gray-700 leading-relaxed mt-2">
              {booking.instructions ||
                "No additional instructions."}
            </p>

          </div>

        </div>



        {/* PRICE */}

        <div className="mt-6 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-5">

          <p className="text-xs uppercase tracking-[0.18em] text-violet-600 font-black">
            Price Summary
          </p>


          <div className="grid sm:grid-cols-3 gap-4 mt-4">

            <PriceBox
              label="Rate"
              value={`${formatMoney(
                rate
              )} / ${unit}`}
            />


            <PriceBox
              label="Duration"
              value={`${booking.duration} ${unit}${
                booking.duration !==
                1
                  ? "s"
                  : ""
              }`}
            />


            <PriceBox
              label="Total"
              value={
                formatMoney(
                  total
                )
              }
              highlight
            />

          </div>


          {(rate === 0 ||
            total === 0) && (

            <p className="text-xs text-amber-700 mt-4">
              This booking may have been created before pricing was added.
            </p>

          )}

        </div>



        {/* REQUESTED -> ASSIGN */}

        {booking.status ===
          "REQUESTED" && (

          <div className="mt-7 border-t border-gray-100 pt-7">

            <div className="flex flex-col lg:flex-row lg:items-end gap-4">


              <div className="flex-1">

                <label className="text-sm font-bold block mb-2">
                  Assign Helping Hand
                </label>


                {eligibleWorkers.length >
                0 ? (

                  <select
                    value={
                      selectedWorker ||
                      ""
                    }
                    onChange={
                      (
                        event
                      ) =>
                        onSelectWorker(
                          Number(
                            event.target.value
                          )
                        )
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-white outline-none focus:border-violet-500"
                  >

                    <option value="">
                      Select a suitable team member
                    </option>


                    {eligibleWorkers.map(
                      (
                        worker
                      ) => (

                        <option
                          key={
                            worker.id
                          }
                          value={
                            worker.id
                          }
                        >
                          {getWorkerName(
                            worker
                          )}
                          {" — "}
                          {worker.experience_years ??
                            0}
                          {" yr experience"}
                        </option>

                      )
                    )}

                  </select>

                ) : (

                  <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-4">
                    No available Helping Hand matches this service.
                  </div>

                )}

              </div>


              <button
                type="button"
                disabled={
                  assigning ||
                  !selectedWorker ||
                  eligibleWorkers.length ===
                    0
                }
                onClick={() =>
                  onAssign(
                    booking.id
                  )
                }
                className="lg:w-[220px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl px-6 py-3.5 font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {assigning
                  ? "Assigning..."
                  : "Assign Helping Hand"}
              </button>

            </div>


            <p className="text-xs text-gray-400 mt-3">
              Only available team members matching the requested service are shown.
            </p>

          </div>

        )}



        {/* ASSIGNED */}

        {booking.status ===
          "ASSIGNED" && (

          <div className="mt-7 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">

            <p className="text-xs uppercase tracking-[0.15em] text-indigo-600 font-bold">
              Assigned Helping Hand
            </p>

            <p className="font-black text-lg mt-2">
              {booking.helper_name ||
                "Helping Hand assigned"}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Waiting for the Helping Hand to start the service.
            </p>

          </div>

        )}



        {/* IN PROGRESS */}

        {booking.status ===
          "IN_PROGRESS" && (

          <div className="mt-7 bg-amber-50 border border-amber-100 rounded-2xl p-5">

            <p className="font-bold text-amber-700">
              🛠 Service in progress
            </p>

            <p className="text-sm text-gray-600 mt-2">
              The assigned Helping Hand is currently working on this service.
            </p>

          </div>

        )}



        {/* COMPLETED */}

        {booking.status ===
          "COMPLETED" && (

          <div className="mt-7 bg-green-50 border border-green-100 rounded-2xl p-5">

            <p className="font-bold text-green-700">
              ✓ Service completed
            </p>

            <p className="text-sm text-gray-600 mt-2">
              This Retailer service request has been completed successfully.
            </p>

          </div>

        )}



        {/* CANCELLED */}

        {booking.status ===
          "CANCELLED" && (

          <div className="mt-7 bg-gray-100 border border-gray-200 rounded-2xl p-5">

            <p className="font-bold text-gray-600">
              Booking cancelled
            </p>

          </div>

        )}

      </div>

    </article>
  );
}



/* =========================
   STAT
========================= */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {

  return (

    <div className="bg-white/80 backdrop-blur border border-white rounded-2xl p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {label}
          </p>

          <p className="text-3xl font-black mt-2">
            {value}
          </p>

        </div>


        <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-xl">
          {icon}
        </div>

      </div>

    </div>

  );
}



/* =========================
   FILTER
========================= */

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {

  return (

    <button
      type="button"
      onClick={
        onClick
      }
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
        active
          ? "bg-gray-950 text-white"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-950"
      }`}
    >
      {label}
    </button>

  );
}



/* =========================
   INFO BOX
========================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div className="border border-gray-200 rounded-2xl p-4">

      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
        {label}
      </p>

      <p className="font-bold mt-2">
        {value}
      </p>

    </div>

  );
}



/* =========================
   PRICE BOX
========================= */

function PriceBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {

  return (

    <div className="bg-white/80 rounded-xl p-4">

      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
        {label}
      </p>

      <p
        className={`font-black mt-2 ${
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



/* =========================
   STATUS BADGE
========================= */

function StatusBadge({
  status,
}: {
  status: BookingStatus;
}) {

  const styles:
    Record<
      BookingStatus,
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


  return (

    <span
      className={`border px-3 py-1.5 rounded-full text-xs font-bold ${
        styles[
          status
        ]
      }`}
    >
      {formatStatus(
        status
      )}
    </span>

  );
}



/* =========================
   HELPERS
========================= */

function getWorkerName(
  worker?: Worker
) {

  if (!worker) {
    return "Helping Hand";
  }


  const firstName =
    worker.first_name ||
    worker.user
      ?.first_name ||
    "";


  const lastName =
    worker.last_name ||
    worker.user
      ?.last_name ||
    "";


  const fullName =
    `${firstName} ${lastName}`
      .trim();


  return (
    fullName ||
    worker.username ||
    worker.user
      ?.username ||
    `Helping Hand #${worker.id}`
  );
}


function getBookingUnit(
  type: BookingType
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
  type: BookingType
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


function formatStatus(
  status: string
) {

  return status
    .replaceAll(
      "_",
      " "
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (
        letter
      ) =>
        letter.toUpperCase()
    );
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


  const [
    hourPart,
    minutePart,
  ] =
    value.split(":");


  const hour =
    Number(
      hourPart
    );


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


  return `${displayHour}:${minutePart || "00"} ${period}`;
}