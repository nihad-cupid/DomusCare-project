"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  getHelperBookingRequests,
  updateBookingStatus,
} from "@/lib/api";
import NotificationBell from "@/components/NotificationBell";


type Booking = {
  id: number;

  booking_model:
    | "PERSONAL"
    | "RETAILER";

  customer_username: string;
  customer_name: string;

  service: number;
  service_name: string;

  helper_name: string | null;

  booking_type: string;
  booking_date: string;
  booking_time: string;
  duration: number;

  address: string;
  instructions: string;

  status:
    | "REQUESTED"
    | "ACCEPTED"
    | "REJECTED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

  created_at: string;
  updated_at: string;
};


export default function HelperRequestsPage() {
  const router = useRouter();

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [
    processingId,
    setProcessingId,
  ] = useState<number | null>(null);


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
    setMessage("");

    const data =
      await getHelperBookingRequests(
        token
      );

    setBookings(data);

  } catch (error) {
    if (
      error instanceof Error
    ) {
      setMessage(
        error.message
      );
    } else {
      setMessage(
        "Could not load booking requests."
      );
    }

  } finally {
    setLoading(false);
  }
}


  async function handleStatusChange(
    bookingId: number,
    status:
      | "ACCEPTED"
      | "REJECTED"
      | "IN_PROGRESS"
      | "COMPLETED"
  ) {
    const token =
      localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return;
    }

    setProcessingId(bookingId);
    setMessage("");

    try {
      const updatedBooking =
        await updateBookingStatus(
          token,
          bookingId,
          status
        );

      setBookings(
        (current) =>
          current.map(
            (booking) =>
              booking.id === bookingId
                ? updatedBooking
                : booking
          )
      );

    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Could not update booking."
        );
      }

    } finally {
      setProcessingId(null);
    }
  }


  const stats = useMemo(() => {
    return {
      total:
        bookings.length,

      pending:
        bookings.filter(
          (booking) =>
            booking.status ===
              "REQUESTED" ||
            booking.status ===
              "ASSIGNED"
        ).length,

      active:
        bookings.filter(
          (booking) =>
            booking.status ===
              "ACCEPTED" ||
            booking.status ===
              "IN_PROGRESS"
        ).length,

      completed:
        bookings.filter(
          (booking) =>
            booking.status ===
            "COMPLETED"
        ).length,
    };
  }, [bookings]);


  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500 font-medium">
            Loading your jobs...
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

          <button
            type="button"
            onClick={() =>
              router.push("/")
            }
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black">
              D
            </div>

            <span className="text-xl font-black">
              DomusCare
            </span>
          </button>


          <div className="flex items-center gap-3">
            {/* NOTIFICATION */}
                                  <NotificationBell />

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/profile"
                )
              }
              className="hidden sm:inline-flex px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold hover:bg-gray-50 transition"
            >
              My Profile
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="px-4 py-2.5 rounded-xl bg-gray-950 text-white text-sm font-semibold hover:bg-gray-800 transition"
            >
              Dashboard
            </button>

          </div>

        </div>

      </nav>


      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="absolute -top-28 -left-28 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl" />

        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-indigo-300/20 rounded-full blur-3xl" />


        <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-10">

          <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-end">

            <div>

              <span className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-bold">
                🧰 Helping Hand Workspace
              </span>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-6 leading-tight">
                Manage your
                <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  jobs and requests.
                </span>
              </h1>

              <p className="text-gray-600 text-lg mt-5 max-w-2xl leading-relaxed">
                Review personal booking requests,
                manage retailer-assigned jobs,
                and keep every service updated
                from one place.
              </p>

            </div>


            <div className="grid grid-cols-2 gap-3">

              <StatCard
                label="Total Jobs"
                value={stats.total}
                icon="📋"
              />

              <StatCard
                label="Waiting"
                value={stats.pending}
                icon="⏳"
              />

              <StatCard
                label="Active"
                value={stats.active}
                icon="⚡"
              />

              <StatCard
                label="Completed"
                value={stats.completed}
                icon="✓"
              />

            </div>

          </div>

        </div>

      </section>


      <section className="max-w-7xl mx-auto px-6 pb-20">

        {/* ERROR */}

        {message && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4">

            <div className="w-9 h-9 shrink-0 rounded-xl bg-red-100 flex items-center justify-center">
              !
            </div>

            <div>
              <p className="font-bold">
                Something went wrong
              </p>

              <p className="text-sm mt-1">
                {message}
              </p>
            </div>

          </div>
        )}


        {/* EMPTY */}

        {bookings.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-[32px] p-12 md:p-16 text-center shadow-sm">

            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-4xl">
              🧰
            </div>

            <h2 className="text-3xl font-black mt-6">
              No Jobs Found
            </h2>

            <p className="text-gray-500 mt-3 max-w-md mx-auto leading-relaxed">
              You currently have no booking
              requests or retailer-assigned jobs.
              New jobs will appear here.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="mt-7 px-6 py-3 rounded-xl bg-gray-950 text-white font-bold hover:bg-violet-700 transition"
            >
              Back to Dashboard
            </button>

          </div>

        ) : (

          <div className="space-y-6">

            {bookings.map(
              (booking) => {
                const isProcessing =
                  processingId ===
                  booking.id;

                return (

                  <article
                    key={booking.id}
                    className="bg-white border border-gray-200 rounded-[30px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-100/50 transition"
                  >

                    {/* CARD HEADER */}

                    <div className="p-6 md:p-8 border-b border-gray-100">

                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                        <div className="flex items-start gap-4">

                          <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-violet-200">
                            {getServiceIcon(
                              booking.service_name
                            )}
                          </div>


                          <div>

                            <div className="flex flex-wrap items-center gap-2">

                              <h2 className="text-2xl md:text-3xl font-black">
                                {
                                  booking.service_name
                                }
                              </h2>

                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                  booking.booking_model ===
                                  "PERSONAL"
                                    ? "bg-violet-50 text-violet-700 border-violet-100"
                                    : "bg-indigo-50 text-indigo-700 border-indigo-100"
                                }`}
                              >
                                {booking.booking_model ===
                                "PERSONAL"
                                  ? "Personal Request"
                                  : "Retailer Job"}
                              </span>

                            </div>


                            <p className="text-gray-500 mt-2">
                              Booking #
                              {booking.id}
                            </p>

                          </div>

                        </div>


                        <StatusBadge
                          status={
                            booking.status
                          }
                        />

                      </div>

                    </div>


                    {/* CONTENT */}

                    <div className="p-6 md:p-8">

                      {/* CUSTOMER */}

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>

                          <p className="text-xs uppercase tracking-[0.18em] text-gray-400 font-bold">
                            Customer
                          </p>

                          <p className="text-xl font-black mt-2">
                            {booking.customer_name ||
                              booking.customer_username}
                          </p>

                          <p className="text-sm text-gray-400 mt-1">
                            @
                            {
                              booking.customer_username
                            }
                          </p>

                        </div>


                        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">

                          <span className="text-lg">
                            📅
                          </span>

                          <div>
                            <p className="text-xs text-gray-400">
                              Service Date
                            </p>

                            <p className="text-sm font-bold">
                              {formatDate(
                                booking.booking_date
                              )}
                            </p>
                          </div>

                        </div>

                      </div>


                      {/* INFO GRID */}

                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">

                        <InfoBox
                          icon="🧾"
                          label="Booking Type"
                          value={formatText(
                            booking.booking_type
                          )}
                        />

                        <InfoBox
                          icon="📅"
                          label="Date"
                          value={formatDate(
                            booking.booking_date
                          )}
                        />

                        <InfoBox
                          icon="🕐"
                          label="Time"
                          value={formatTime(
                            booking.booking_time
                          )}
                        />

                        <InfoBox
                          icon="⏱"
                          label="Duration"
                          value={getDurationText(
                            booking
                          )}
                        />

                      </div>


                      {/* ADDRESS + INSTRUCTIONS */}

                      <div className="grid lg:grid-cols-2 gap-4 mt-6">

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                          <div className="flex items-center gap-2">

                            <span>
                              📍
                            </span>

                            <p className="font-bold">
                              Service Address
                            </p>

                          </div>

                          <p className="text-gray-600 text-sm leading-relaxed mt-3">
                            {
                              booking.address
                            }
                          </p>

                        </div>


                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                          <div className="flex items-center gap-2">

                            <span>
                              📝
                            </span>

                            <p className="font-bold">
                              Instructions
                            </p>

                          </div>

                          <p className="text-gray-600 text-sm leading-relaxed mt-3">
                            {booking.instructions ||
                              "No additional instructions provided."}
                          </p>

                        </div>

                      </div>


                      {/* PERSONAL REQUEST */}

                      {booking.booking_model ===
                        "PERSONAL" &&
                        booking.status ===
                          "REQUESTED" && (

                          <ActionPanel
                            tone="amber"
                            title="New Booking Request"
                            description="A customer wants to book your service. Review the information above and respond to the request."
                          >

                            <button
                              type="button"
                              disabled={
                                isProcessing
                              }
                              onClick={() =>
                                handleStatusChange(
                                  booking.id,
                                  "ACCEPTED"
                                )
                              }
                              className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-50"
                            >
                              {isProcessing
                                ? "Processing..."
                                : "Accept Request"}
                            </button>


                            <button
                              type="button"
                              disabled={
                                isProcessing
                              }
                              onClick={() =>
                                handleStatusChange(
                                  booking.id,
                                  "REJECTED"
                                )
                              }
                              className="px-6 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold hover:bg-red-100 transition disabled:opacity-50"
                            >
                              Reject
                            </button>

                          </ActionPanel>

                        )}


                      {/* ACCEPTED */}

                      {booking.status ===
                        "ACCEPTED" && (

                        <ActionPanel
                          tone="blue"
                          title="Booking Accepted"
                          description="Start the job when you arrive at the customer's service location."
                        >

                          <button
                            type="button"
                            disabled={
                              isProcessing
                            }
                            onClick={() =>
                              handleStatusChange(
                                booking.id,
                                "IN_PROGRESS"
                              )
                            }
                            className="px-6 py-3 rounded-xl bg-gray-950 text-white font-bold hover:bg-violet-700 transition disabled:opacity-50"
                          >
                            {isProcessing
                              ? "Starting..."
                              : "Start Job"}
                          </button>

                        </ActionPanel>

                      )}


                      {/* RETAILER ASSIGNED */}

                      {booking.status ===
                        "ASSIGNED" && (

                        <ActionPanel
                          tone="blue"
                          title="Retailer Assigned Job"
                          description="Your retailer assigned this service to you. Review the details and start the job when ready."
                        >

                          <button
                            type="button"
                            disabled={
                              isProcessing
                            }
                            onClick={() =>
                              handleStatusChange(
                                booking.id,
                                "IN_PROGRESS"
                              )
                            }
                            className="px-6 py-3 rounded-xl bg-gray-950 text-white font-bold hover:bg-violet-700 transition disabled:opacity-50"
                          >
                            {isProcessing
                              ? "Starting..."
                              : "Start Job"}
                          </button>

                        </ActionPanel>

                      )}


                      {/* IN PROGRESS */}

                      {booking.status ===
                        "IN_PROGRESS" && (

                        <ActionPanel
                          tone="violet"
                          title="Job In Progress"
                          description="This service is currently active. Mark it as completed after finishing the work."
                        >

                          <button
                            type="button"
                            disabled={
                              isProcessing
                            }
                            onClick={() =>
                              handleStatusChange(
                                booking.id,
                                "COMPLETED"
                              )
                            }
                            className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-50"
                          >
                            {isProcessing
                              ? "Completing..."
                              : "Complete Job"}
                          </button>

                        </ActionPanel>

                      )}


                      {/* COMPLETED */}

                      {booking.status ===
                        "COMPLETED" && (

                        <StatusPanel
                          tone="green"
                          icon="✓"
                          title="Job Completed"
                          description="This service has been completed successfully."
                        />

                      )}


                      {/* REJECTED */}

                      {booking.status ===
                        "REJECTED" && (

                        <StatusPanel
                          tone="red"
                          icon="×"
                          title="Booking Rejected"
                          description="You rejected this booking request."
                        />

                      )}


                      {/* CANCELLED */}

                      {booking.status ===
                        "CANCELLED" && (

                        <StatusPanel
                          tone="gray"
                          icon="−"
                          title="Booking Cancelled"
                          description="This booking has been cancelled."
                        />

                      )}

                    </div>

                  </article>

                );
              }
            )}

          </div>

        )}

      </section>

    </main>
  );
}


function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="bg-white/80 backdrop-blur border border-white rounded-2xl p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-sm text-gray-500 font-semibold">
          {label}
        </p>

        <span className="text-lg">
          {icon}
        </span>

      </div>

      <p className="text-3xl font-black mt-2">
        {value}
      </p>

    </div>
  );
}


function InfoBox({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">

      <div className="flex items-center gap-2">

        <span>
          {icon}
        </span>

        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          {label}
        </p>

      </div>

      <p className="font-black mt-2">
        {value}
      </p>

    </div>
  );
}


function ActionPanel({
  tone,
  title,
  description,
  children,
}: {
  tone:
    | "amber"
    | "blue"
    | "violet";
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const styles = {
    amber:
      "bg-amber-50 border-amber-200",

    blue:
      "bg-blue-50 border-blue-200",

    violet:
      "bg-violet-50 border-violet-200",
  };

  return (
    <div
      className={`mt-7 border rounded-2xl p-5 ${styles[tone]}`}
    >

      <div className="flex items-start gap-3">

        <div className="w-10 h-10 shrink-0 rounded-xl bg-white/80 flex items-center justify-center">
          ⚡
        </div>

        <div>
          <p className="font-black text-lg">
            {title}
          </p>

          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        {children}
      </div>

    </div>
  );
}


function StatusPanel({
  tone,
  icon,
  title,
  description,
}: {
  tone:
    | "green"
    | "red"
    | "gray";
  icon: string;
  title: string;
  description: string;
}) {
  const styles = {
    green:
      "bg-green-50 border-green-200 text-green-700",

    red:
      "bg-red-50 border-red-200 text-red-700",

    gray:
      "bg-gray-50 border-gray-200 text-gray-600",
  };

  return (
    <div
      className={`mt-7 border rounded-2xl p-5 ${styles[tone]}`}
    >

      <div className="flex items-start gap-3">

        <div className="w-10 h-10 shrink-0 bg-white/70 rounded-xl flex items-center justify-center font-black">
          {icon}
        </div>

        <div>

          <p className="font-black">
            {title}
          </p>

          <p className="text-sm mt-1 opacity-80">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}


function StatusBadge({
  status,
}: {
  status: Booking["status"];
}) {
  let style =
    "bg-gray-100 text-gray-700 border-gray-200";

  if (
    status === "REQUESTED"
  ) {
    style =
      "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (
    status === "ACCEPTED"
  ) {
    style =
      "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (
    status === "ASSIGNED"
  ) {
    style =
      "bg-indigo-50 text-indigo-700 border-indigo-200";
  }

  if (
    status === "IN_PROGRESS"
  ) {
    style =
      "bg-violet-50 text-violet-700 border-violet-200";
  }

  if (
    status === "COMPLETED"
  ) {
    style =
      "bg-green-50 text-green-700 border-green-200";
  }

  if (
    status === "REJECTED"
  ) {
    style =
      "bg-red-50 text-red-700 border-red-200";
  }

  if (
    status === "CANCELLED"
  ) {
    style =
      "bg-gray-100 text-gray-600 border-gray-200";
  }

  return (
    <span
      className={`inline-flex px-4 py-2 rounded-full border text-sm font-bold ${style}`}
    >
      {formatText(status)}
    </span>
  );
}


function formatText(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter: string) =>
        letter.toUpperCase()
    );
}


function formatDate(
  value: string
) {
  const date =
    new Date(
      `${value}T00:00:00`
    );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}


function formatTime(
  value: string
) {
  const [
    hourString,
    minuteString,
  ] = value.split(":");

  const hour =
    Number(hourString);

  const minute =
    minuteString ?? "00";

  const suffix =
    hour >= 12
      ? "PM"
      : "AM";

  const displayHour =
    hour % 12 || 12;

  return `${displayHour}:${minute} ${suffix}`;
}


function getDurationText(
  booking: Booking
) {
  if (
    booking.booking_type ===
    "HOURLY"
  ) {
    return `${booking.duration} hour${
      booking.duration > 1
        ? "s"
        : ""
    }`;
  }

  if (
    booking.booking_type ===
    "DAILY"
  ) {
    return `${booking.duration} day${
      booking.duration > 1
        ? "s"
        : ""
    }`;
  }

  if (
    booking.booking_type ===
    "MONTHLY"
  ) {
    return `${booking.duration} month${
      booking.duration > 1
        ? "s"
        : ""
    }`;
  }

  return String(
    booking.duration
  );
}


function getServiceIcon(
  serviceName: string
) {
  const name =
    serviceName.toLowerCase();

  if (
    name.includes("clean")
  ) {
    return "🧹";
  }

  if (
    name.includes("electric")
  ) {
    return "⚡";
  }

  if (
    name.includes("plumb")
  ) {
    return "🔧";
  }

  if (
    name.includes("repair")
  ) {
    return "🛠️";
  }

  return "🧰";
}