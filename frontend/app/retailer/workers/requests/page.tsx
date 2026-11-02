"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  assignBookingHelper,
  getRetailerBookingRequests,
  getRetailerWorkers,
} from "@/lib/api";


type Service = {
  id: number;
  name: string;
  description: string;
};


type Worker = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  experience_years: number;
  bio: string;
  is_verified: boolean;
  availability: string;
  work_model: string;
  skills: Service[];
};


type RetailerBooking = {
  id: number;
  customer_username: string;
  customer_name: string;
  retailer: number;
  retailer_name: string;
  service: number;
  service_name: string;
  helper: number | null;
  helper_name: string | null;
  booking_model: string;
  booking_type: string;
  booking_date: string;
  booking_time: string;
  duration: number;
  address: string;
  instructions: string;
  status: string;
  created_at: string;
  updated_at: string;
};


export default function RetailerRequestsPage() {
  const router = useRouter();

  const [
    bookings,
    setBookings,
  ] = useState<RetailerBooking[]>([]);

  const [
    workers,
    setWorkers,
  ] = useState<Worker[]>([]);

  const [
    selectedWorkers,
    setSelectedWorkers,
  ] = useState<Record<number, number | "">>({});

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    processingId,
    setProcessingId,
  ] = useState<number | null>(null);


  useEffect(() => {
    async function loadData() {
      const token =
        localStorage.getItem("access");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const [
          bookingData,
          workerData,
        ] = await Promise.all([
          getRetailerBookingRequests(
            token
          ),

          getRetailerWorkers(
            token
          ),
        ]);

        setBookings(
          bookingData
        );

        setWorkers(
          workerData
        );

      } catch (error) {
        if (error instanceof Error) {
          setMessage(
            error.message
          );
        } else {
          setMessage(
            "Could not load retailer requests."
          );
        }

      } finally {
        setLoading(false);
      }
    }

    loadData();

  }, [router]);


  function handleWorkerSelect(
    bookingId: number,
    helperId: string
  ) {
    setSelectedWorkers(
      (current) => ({
        ...current,

        [bookingId]:
          helperId === ""
            ? ""
            : Number(helperId),
      })
    );
  }


  async function handleAssign(
    bookingId: number
  ) {
    const token =
      localStorage.getItem("access");

    if (!token) {
      router.push("/login");
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

    setProcessingId(
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
        (currentBookings) =>
          currentBookings.map(
            (booking) =>
              booking.id === bookingId
                ? updatedBooking
                : booking
          )
      );

      setSuccessMessage(
        "Helping Hand assigned successfully."
      );

    } catch (error) {
      if (error instanceof Error) {
        setMessage(
          error.message
        );
      } else {
        setMessage(
          "Could not assign Helping Hand."
        );
      }

    } finally {
      setProcessingId(null);
    }
  }


  function handleLogout() {
    localStorage.removeItem(
      "access"
    );

    localStorage.removeItem(
      "refresh"
    );

    router.push(
      "/login"
    );
  }


  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 text-black">

        <p>
          Loading service requests...
        </p>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-3xl font-bold">
              Service Requests
            </h1>

            <p className="text-gray-600 mt-2">
              View customer requests and assign
              one of your Helping Hands.
            </p>

          </div>


          <div className="flex flex-wrap gap-3">

            <button
              onClick={() =>
                router.push(
                  "/retailer/workers"
                )
              }
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Helping Hands
            </button>


            <button
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Dashboard
            </button>


            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Logout
            </button>

          </div>

        </div>


        {/* Error */}
        {message && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            {message}
          </div>
        )}


        {/* Success */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded">
            {successMessage}
          </div>
        )}


        {/* Empty */}
        {bookings.length === 0 ? (

          <div className="bg-white p-8 rounded-xl shadow text-center">

            <h2 className="text-xl font-semibold">
              No Service Requests
            </h2>

            <p className="text-gray-600 mt-2">
              No customer has sent a Retailer
              service request yet.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {bookings.map(
              (booking) => {

                const isProcessing =
                  processingId === booking.id;

                const eligibleWorkers =
                  workers.filter(
                    (worker) =>
                      worker.availability === "AVAILABLE"
                      &&
                      worker.skills.some(
                        (service) =>
                          service.id
                          === booking.service
                      )
                  );


                return (

                  <div
                    key={booking.id}
                    className="bg-white p-6 rounded-xl shadow"
                  >

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                      <div>

                        <h2 className="text-2xl font-bold">
                          {booking.service_name}
                        </h2>


                        <p className="text-gray-600 mt-1">
                          Customer:{" "}
                          {
                            booking.customer_name
                            ||
                            booking.customer_username
                          }
                        </p>


                        <p className="text-sm text-gray-500">
                          @{booking.customer_username}
                        </p>

                      </div>


                      <StatusBadge
                        status={
                          booking.status
                        }
                      />

                    </div>


                    {/* Info */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

                      <InfoItem
                        label="Booking Type"
                        value={
                          booking.booking_type
                        }
                      />

                      <InfoItem
                        label="Date"
                        value={
                          booking.booking_date
                        }
                      />

                      <InfoItem
                        label="Time"
                        value={
                          booking.booking_time
                        }
                      />

                      <InfoItem
                        label="Duration"
                        value={
                          String(
                            booking.duration
                          )
                        }
                      />

                    </div>


                    {/* Address */}
                    <div className="mt-5">

                      <p className="font-semibold">
                        Service Address
                      </p>

                      <p className="text-gray-600 mt-1">
                        {booking.address}
                      </p>

                    </div>


                    {/* Instructions */}
                    {booking.instructions && (

                      <div className="mt-5">

                        <p className="font-semibold">
                          Customer Instructions
                        </p>

                        <p className="text-gray-600 mt-1">
                          {
                            booking.instructions
                          }
                        </p>

                      </div>

                    )}


                    {/* REQUESTED */}
                    {booking.status === "REQUESTED" && (

                      <div className="mt-6 border-t pt-6">

                        <h3 className="font-semibold text-lg">
                          Assign Helping Hand
                        </h3>


                        {eligibleWorkers.length === 0 ? (

                          <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded">

                            <p className="text-yellow-700">
                              No available Helping Hand
                              with the required skill.
                            </p>

                            <button
                              onClick={() =>
                                router.push(
                                  "/retailer/workers"
                                )
                              }
                              className="mt-3 text-sm underline"
                            >
                              Manage Helping Hands
                            </button>

                          </div>

                        ) : (

                          <div className="mt-4 flex flex-col md:flex-row gap-3">

                            <select
                              value={
                                selectedWorkers[
                                  booking.id
                                ]
                                ?? ""
                              }
                              onChange={(event) =>
                                handleWorkerSelect(
                                  booking.id,
                                  event.target.value
                                )
                              }
                              className="flex-1 border p-3 rounded"
                            >

                              <option value="">
                                Select Helping Hand
                              </option>


                              {eligibleWorkers.map(
                                (worker) => {

                                  const name =
                                    `${worker.first_name} ${worker.last_name}`.trim()
                                    ||
                                    worker.username;

                                  return (

                                    <option
                                      key={worker.id}
                                      value={worker.id}
                                    >
                                      {name}
                                      {" - "}
                                      {worker.experience_years}
                                      {" year(s)"}
                                    </option>

                                  );
                                }
                              )}

                            </select>


                            <button
                              disabled={
                                isProcessing
                              }
                              onClick={() =>
                                handleAssign(
                                  booking.id
                                )
                              }
                              className="bg-black text-white px-6 py-3 rounded disabled:opacity-50"
                            >
                              {isProcessing
                                ? "Assigning..."
                                : "Assign Helping Hand"}
                            </button>

                          </div>

                        )}

                      </div>

                    )}


                    {/* ASSIGNED */}
                    {booking.status === "ASSIGNED" && (

                      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded">

                        <p className="font-semibold text-blue-700">
                          Helping Hand Assigned
                        </p>

                        <p className="text-blue-700 mt-1">
                          Assigned to:{" "}
                          <strong>
                            {
                              booking.helper_name
                              || "Helping Hand"
                            }
                          </strong>
                        </p>

                      </div>

                    )}


                    {/* IN PROGRESS */}
                    {booking.status === "IN_PROGRESS" && (

                      <div className="mt-6 bg-purple-50 border border-purple-200 p-4 rounded">

                        <p className="font-semibold text-purple-700">
                          Job In Progress
                        </p>

                        <p className="text-purple-700 mt-1">
                          Helping Hand:{" "}
                          {
                            booking.helper_name
                            || "-"
                          }
                        </p>

                      </div>

                    )}


                    {/* COMPLETED */}
                    {booking.status === "COMPLETED" && (

                      <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded">

                        <p className="font-semibold text-green-700">
                          Job Completed
                        </p>

                        <p className="text-green-700 mt-1">
                          Helping Hand:{" "}
                          {
                            booking.helper_name
                            || "-"
                          }
                        </p>

                      </div>

                    )}


                    {/* CANCELLED */}
                    {booking.status === "CANCELLED" && (

                      <div className="mt-6 bg-gray-100 p-4 rounded">

                        <p className="font-semibold text-gray-600">
                          Booking Cancelled
                        </p>

                      </div>

                    )}

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>

    </main>
  );
}


function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold mt-1">
        {value}
      </p>

    </div>
  );
}


function StatusBadge({
  status,
}: {
  status: string;
}) {
  let style =
    "bg-gray-100 text-gray-700";


  if (status === "REQUESTED") {
    style =
      "bg-yellow-100 text-yellow-700";
  }


  if (status === "ASSIGNED") {
    style =
      "bg-blue-100 text-blue-700";
  }


  if (status === "IN_PROGRESS") {
    style =
      "bg-purple-100 text-purple-700";
  }


  if (status === "COMPLETED") {
    style =
      "bg-green-100 text-green-700";
  }


  if (status === "CANCELLED") {
    style =
      "bg-gray-200 text-gray-600";
  }


  return (
    <span
      className={
        `px-4 py-2 rounded-full text-sm font-semibold ${style}`
      }
    >
      {status.replaceAll(
        "_",
        " "
      )}
    </span>
  );
}