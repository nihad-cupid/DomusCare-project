"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  createRetailerBooking,
  getServices,
} from "@/lib/api";


type Service = {
  id: number;
  name: string;
  description: string;
};


export default function RetailerBookingPage() {
  const params = useParams();
  const router = useRouter();

  const retailerId =
    Number(params.id);


  const [services, setServices] =
    useState<Service[]>([]);

  const [service, setService] =
    useState("");

  const [bookingType, setBookingType] =
    useState("HOURLY");

  const [bookingDate, setBookingDate] =
    useState("");

  const [bookingTime, setBookingTime] =
    useState("");

  const [duration, setDuration] =
    useState(1);

  const [address, setAddress] =
    useState("");

  const [instructions, setInstructions] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);


  useEffect(() => {
    async function loadServices() {
      try {
        const data =
          await getServices();

        setServices(data);

      } catch (error) {
        if (error instanceof Error) {
          setMessage(
            error.message
          );
        }
      }
    }

    loadServices();

  }, []);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token =
      localStorage.getItem(
        "access"
      );

    if (!token) {
      router.push("/login");
      return;
    }

    if (!service) {
      setMessage(
        "Please select a service."
      );
      return;
    }


    setSubmitting(true);
    setMessage("");


    try {
      const booking =
        await createRetailerBooking(
          token,
          {
            retailer: retailerId,
            service: Number(service),
            booking_type: bookingType,
            booking_date: bookingDate,
            booking_time: bookingTime,
            duration,
            address,
            instructions,
          }
        );


      setMessage(
        `Booking request #${booking.id} created successfully.`
      );

    } catch (error) {
      if (error instanceof Error) {
        setMessage(
          error.message
        );
      }

    } finally {
      setSubmitting(false);
    }
  }


  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold">
          Retailer Service Request
        </h1>


        <p className="text-gray-600 mt-2">
          The Retailer will assign a
          suitable Helping Hand.
        </p>


        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>

            <label className="block font-semibold mb-2">
              Service
            </label>

            <select
              required
              value={service}
              onChange={(event) =>
                setService(
                  event.target.value
                )
              }
              className="w-full border p-3 rounded"
            >

              <option value="">
                Select Service
              </option>

              {services.map(
                (item) => (

                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>

                )
              )}

            </select>

          </div>


          <div>

            <label className="block font-semibold mb-2">
              Booking Type
            </label>

            <select
              value={bookingType}
              onChange={(event) =>
                setBookingType(
                  event.target.value
                )
              }
              className="w-full border p-3 rounded"
            >

              <option value="HOURLY">
                Hourly
              </option>

              <option value="DAILY">
                Daily
              </option>

              <option value="MONTHLY">
                Monthly
              </option>

            </select>

          </div>


          <div className="grid md:grid-cols-2 gap-4">

            <div>

              <label className="block font-semibold mb-2">
                Date
              </label>

              <input
                type="date"
                required
                value={bookingDate}
                onChange={(event) =>
                  setBookingDate(
                    event.target.value
                  )
                }
                className="w-full border p-3 rounded"
              />

            </div>


            <div>

              <label className="block font-semibold mb-2">
                Time
              </label>

              <input
                type="time"
                required
                value={bookingTime}
                onChange={(event) =>
                  setBookingTime(
                    event.target.value
                  )
                }
                className="w-full border p-3 rounded"
              />

            </div>

          </div>


          <div>

            <label className="block font-semibold mb-2">
              Duration
            </label>

            <input
              type="number"
              min="1"
              required
              value={duration}
              onChange={(event) =>
                setDuration(
                  Number(
                    event.target.value
                  )
                )
              }
              className="w-full border p-3 rounded"
            />

          </div>


          <div>

            <label className="block font-semibold mb-2">
              Service Address
            </label>

            <textarea
              required
              value={address}
              onChange={(event) =>
                setAddress(
                  event.target.value
                )
              }
              className="w-full border p-3 rounded"
              rows={3}
            />

          </div>


          <div>

            <label className="block font-semibold mb-2">
              Instructions
            </label>

            <textarea
              value={instructions}
              onChange={(event) =>
                setInstructions(
                  event.target.value
                )
              }
              className="w-full border p-3 rounded"
              rows={4}
            />

          </div>


          <button
            disabled={submitting}
            className="w-full bg-black text-white p-3 rounded disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : "Send Service Request"}
          </button>


          {message && (
            <p className="text-center mt-4">
              {message}
            </p>
          )}

        </form>

      </div>

    </main>
  );
}