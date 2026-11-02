
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getRetailerWorkers,
  removeRetailerWorker,
} from "@/lib/api";


type Service = {
  id: number;
  name: string;
  description?: string;
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


export default function RetailerWorkersPage() {
  const router = useRouter();

  const [workers, setWorkers] =
    useState<Worker[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [processingId, setProcessingId] =
    useState<number | null>(null);


  useEffect(() => {
    loadWorkers();
  }, []);


  async function loadWorkers() {
    const token =
      localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const data =
        await getRetailerWorkers(token);

      setWorkers(data);

    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Could not load your Helping Hands."
        );
      }

    } finally {
      setLoading(false);
    }
  }


  async function handleRemoveWorker(
    helperId: number
  ) {
    const token =
      localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to remove this Helping Hand from your team?"
      );

    if (!confirmed) {
      return;
    }

    setProcessingId(helperId);
    setMessage("");

    try {
      await removeRetailerWorker(
        token,
        helperId
      );

      setWorkers(
        (current) =>
          current.filter(
            (worker) =>
              worker.id !== helperId
          )
      );

    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Could not remove Helping Hand."
        );
      }

    } finally {
      setProcessingId(null);
    }
  }


  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
        <p>
          Loading your Helping Hands...
        </p>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8 text-black">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              My Helping Hands
            </h1>

            <p className="text-gray-600 mt-2">
              Manage the Helping Hands working under your Retailer account.
            </p>
          </div>


          <div className="flex flex-wrap gap-3">

            {/* CREATE NEW TEAM MATE */}
            <button
              onClick={() =>
                router.push(
                  "/retailer/workers/create"
                )
              }
              className="bg-black text-white px-5 py-2 rounded-lg"
            >
              Create Team Mate
            </button>


            {/* ADD EXISTING HELPER */}
            <button
              onClick={() =>
                router.push(
                  "/retailer/workers/add"
                )
              }
              className="bg-gray-200 px-5 py-2 rounded-lg"
            >
              Add Existing Helper
            </button>


            {/* SERVICE REQUESTS */}
            <button
              onClick={() =>
                router.push(
                  "/retailer/requests"
                )
              }
              className="bg-gray-200 px-5 py-2 rounded-lg"
            >
              Service Requests
            </button>


            {/* DASHBOARD */}
            <button
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="bg-gray-200 px-5 py-2 rounded-lg"
            >
              Dashboard
            </button>

          </div>

        </div>


        {/* ERROR */}
        {message && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {message}
          </div>
        )}


        {/* EMPTY TEAM */}
        {workers.length === 0 ? (

          <div className="bg-white p-10 rounded-2xl shadow text-center">

            <h2 className="text-xl font-semibold">
              No Helping Hands in Your Team
            </h2>

            <p className="text-gray-600 mt-2">
              You can create a new Team Mate or add an existing Personal Helping Hand.
            </p>


            <div className="flex flex-wrap justify-center gap-3 mt-6">

              <button
                onClick={() =>
                  router.push(
                    "/retailer/workers/create"
                  )
                }
                className="bg-black text-white px-6 py-3 rounded-lg"
              >
                Create Team Mate
              </button>


              <button
                onClick={() =>
                  router.push(
                    "/retailer/workers/add"
                  )
                }
                className="bg-gray-200 px-6 py-3 rounded-lg"
              >
                Add Existing Helper
              </button>

            </div>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {workers.map((worker) => {

              const fullName =
                `${worker.first_name} ${worker.last_name}`.trim();

              const isProcessing =
                processingId === worker.id;


              return (
                <div
                  key={worker.id}
                  className="bg-white p-6 rounded-2xl shadow"
                >

                  <div className="flex justify-between items-start gap-3">

                    <div>

                      <h2 className="text-xl font-bold">
                        {fullName ||
                          worker.username}
                      </h2>

                      <p className="text-gray-500 text-sm mt-1">
                        @{worker.username}
                      </p>

                    </div>


                    <AvailabilityBadge
                      availability={
                        worker.availability
                      }
                    />

                  </div>


                  <div className="mt-5 space-y-3">

                    <InfoItem
                      label="Email"
                      value={
                        worker.email ||
                        "Not provided"
                      }
                    />

                    <InfoItem
                      label="Phone"
                      value={
                        worker.phone ||
                        "Not provided"
                      }
                    />

                    <InfoItem
                      label="Address"
                      value={
                        worker.address ||
                        "Not provided"
                      }
                    />

                    <InfoItem
                      label="Experience"
                      value={`${worker.experience_years} year${
                        worker.experience_years !== 1
                          ? "s"
                          : ""
                      }`}
                    />

                  </div>


                  {/* SKILLS */}
                  <div className="mt-5">

                    <p className="text-sm text-gray-500 mb-2">
                      Skills
                    </p>


                    {worker.skills &&
                    worker.skills.length > 0 ? (

                      <div className="flex flex-wrap gap-2">

                        {worker.skills.map(
                          (skill) => (
                            <span
                              key={skill.id}
                              className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                            >
                              {skill.name}
                            </span>
                          )
                        )}

                      </div>

                    ) : (

                      <p className="text-gray-500 text-sm">
                        No skills added
                      </p>

                    )}

                  </div>


                  {/* BIO */}
                  {worker.bio && (

                    <div className="mt-5">

                      <p className="text-sm text-gray-500">
                        Bio
                      </p>

                      <p className="text-gray-700 mt-1">
                        {worker.bio}
                      </p>

                    </div>

                  )}


                  {/* REMOVE */}
                  <button
                    disabled={isProcessing}
                    onClick={() =>
                      handleRemoveWorker(
                        worker.id
                      )
                    }
                    className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg disabled:opacity-50"
                  >
                    {isProcessing
                      ? "Removing..."
                      : "Remove from Team"}
                  </button>

                </div>
              );
            })}

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
    <div>

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-medium mt-1">
        {value}
      </p>

    </div>
  );
}


function AvailabilityBadge({
  availability,
}: {
  availability: string;
}) {
  let style =
    "bg-gray-100 text-gray-700";

  if (availability === "AVAILABLE") {
    style =
      "bg-green-100 text-green-700";
  }

  if (availability === "BUSY") {
    style =
      "bg-yellow-100 text-yellow-700";
  }

  if (availability === "UNAVAILABLE") {
    style =
      "bg-red-100 text-red-700";
  }


  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}
    >
      {availability}
    </span>
  );
}
