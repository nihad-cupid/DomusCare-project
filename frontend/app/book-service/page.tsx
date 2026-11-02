"use client";

import { useRouter } from "next/navigation";


export default function BookServicePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">

      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-3xl font-bold">
              Book a Service
            </h1>

            <p className="text-gray-600 mt-2">
              Choose how you want to hire
              a Helping Hand.
            </p>

          </div>


          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Dashboard
          </button>

        </div>


        <div className="grid md:grid-cols-2 gap-6">

          {/* PERSONAL */}

          <div className="bg-white p-8 rounded-xl shadow">

            <h2 className="text-2xl font-bold">
              Personal Helping Hand
            </h2>

            <p className="text-gray-600 mt-4">
              Find an individual Helping Hand
              and send a booking request directly.
            </p>


            <div className="mt-6 bg-gray-50 p-4 rounded">

              <p className="font-semibold">
                How it works
              </p>

              <div className="mt-3 space-y-2 text-gray-600">

                <p>
                  1. Select a Helping Hand
                </p>

                <p>
                  2. View profile and skills
                </p>

                <p>
                  3. Send booking request
                </p>

                <p>
                  4. Helper accepts or rejects
                </p>

              </div>

            </div>


            <button
              onClick={() =>
                router.push("/helpers")
              }
              className="w-full mt-8 bg-black text-white p-3 rounded"
            >
              Find Helping Hand
            </button>

          </div>


          {/* RETAILER */}

          <div className="bg-white p-8 rounded-xl shadow">

            <h2 className="text-2xl font-bold">
              Retailer Service
            </h2>

            <p className="text-gray-600 mt-4">
              Send a service request to a
              verified Retailer and let them
              assign a suitable Helping Hand.
            </p>


            <div className="mt-6 bg-gray-50 p-4 rounded">

              <p className="font-semibold">
                How it works
              </p>

              <div className="mt-3 space-y-2 text-gray-600">

                <p>
                  1. Select a Retailer
                </p>

                <p>
                  2. Select required service
                </p>

                <p>
                  3. Send service request
                </p>

                <p>
                  4. Retailer assigns a worker
                </p>

              </div>

            </div>


            <button
              onClick={() =>
                router.push("/retailer")
              }
              className="w-full mt-8 bg-black text-white p-3 rounded"
            >
              Find Retailer
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}