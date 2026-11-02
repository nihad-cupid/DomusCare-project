"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  getRetailerWorkers,
  removeRetailerWorker,
} from "@/lib/api";

import NotificationBell from "@/components/NotificationBell";


type Skill = {
  id: number;
  name: string;
};


type Worker = {
  id: number;

  username: string;
  email?: string;

  first_name: string;
  last_name: string;

  phone?: string;
  address?: string;

  experience_years?: number;
  bio?: string;

  availability:
    | "AVAILABLE"
    | "BUSY"
    | "UNAVAILABLE";

  skills: Skill[];
};


export default function RetailerWorkersPage() {
  const router = useRouter();

  const [workers, setWorkers] =
    useState<Worker[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [
    removingId,
    setRemovingId,
  ] = useState<number | null>(
    null
  );


  useEffect(() => {
    loadWorkers();
  }, []);


  async function loadWorkers() {
    const accessToken =
      localStorage.getItem(
        "access"
      );

    const refreshToken =
      localStorage.getItem(
        "refresh"
      );

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
      setLoading(true);
      setMessage("");

      const data =
        await getRetailerWorkers(
          token
        );

      setWorkers(
        Array.isArray(data)
          ? data
          : []
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
          "Could not load your team."
        );
      }

    } finally {
      setLoading(false);
    }
  }


  async function handleRemove(
    workerId: number
  ) {
    const confirmed =
      window.confirm(
        "Remove this Helping Hand from your team?"
      );

    if (!confirmed) {
      return;
    }

    const accessToken =
      localStorage.getItem(
        "access"
      );

    const refreshToken =
      localStorage.getItem(
        "refresh"
      );

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
      setRemovingId(
        workerId
      );

      setMessage("");

      await removeRetailerWorker(
        token,
        workerId
      );

      setWorkers(
        (current) =>
          current.filter(
            (worker) =>
              worker.id !==
              workerId
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
          "Could not remove team member."
        );
      }

    } finally {
      setRemovingId(null);
    }
  }


  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Loading your team...
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

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black">
              D
            </div>

            <div>
              <p className="text-xl font-black leading-none">
                DomusCare
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mt-1">
                Retailer
              </p>
            </div>

          </Link>


          <div className="flex items-center gap-3">

            <NotificationBell />

            <Link
              href="/retailer/requests"
              className="hidden sm:inline-flex px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold hover:bg-gray-50 transition"
            >
              Requests
            </Link>

            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-gray-950 text-white text-sm font-semibold hover:bg-gray-800 transition"
            >
              Dashboard
            </Link>

          </div>

        </div>

      </nav>


      {/* PAGE */}

      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

          <div>

            <span className="inline-flex px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-sm font-semibold">
              Retailer Team
            </span>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-5">
              My Team
            </h1>

            <p className="text-gray-500 text-lg mt-3 max-w-2xl">
              Manage Helping Hands
              connected to your
              Retailer account.
            </p>

          </div>


          <Link
            href="/retailer/workers/add"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-violet-200 hover:opacity-90 transition"
          >
            + Add Team Member
          </Link>

        </div>


        {/* MESSAGE */}

        {message && (
          <div className="mt-8 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
            {message}
          </div>
        )}


        {/* EMPTY */}

        {workers.length === 0 ? (

          <div className="mt-10 bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">

            <div className="w-16 h-16 rounded-2xl bg-violet-50 text-3xl flex items-center justify-center mx-auto">
              👥
            </div>

            <h2 className="text-2xl font-black mt-5">
              No team members yet
            </h2>

            <p className="text-gray-500 mt-2">
              Add your first Helping
              Hand to start building
              your team.
            </p>

            <Link
              href="/retailer/workers/add"
              className="inline-flex mt-6 px-6 py-3 rounded-xl bg-gray-950 text-white font-semibold hover:bg-gray-800 transition"
            >
              Create Team Member
            </Link>

          </div>

        ) : (

          /* TEAM GRID */

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">

            {workers.map(
              (worker) => {

                const fullName =
                  `${worker.first_name || ""} ${worker.last_name || ""}`
                    .trim();

                const initials =
                  fullName
                    ? fullName
                        .split(" ")
                        .map(
                          (part) =>
                            part[0]
                        )
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : worker.username
                        .slice(0, 2)
                        .toUpperCase();


                const availabilityStyle =
                  worker.availability ===
                  "AVAILABLE"
                    ? "bg-green-50 text-green-700 border-green-100"
                    : worker.availability ===
                      "BUSY"
                    ? "bg-amber-50 text-amber-700 border-amber-100"
                    : "bg-gray-100 text-gray-600 border-gray-200";


                return (
                  <div
                    key={
                      worker.id
                    }
                    className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 transition"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-violet-200">
                        {
                          initials
                        }
                      </div>

                      <span
                        className={`text-xs px-3 py-1.5 rounded-full border font-semibold ${availabilityStyle}`}
                      >
                        {
                          worker.availability
                        }
                      </span>

                    </div>


                    <div className="mt-5">

                      <h2 className="text-xl font-black">
                        {fullName ||
                          worker.username}
                      </h2>

                      <p className="text-sm text-gray-400 mt-1">
                        @
                        {
                          worker.username
                        }
                      </p>

                      {worker.email && (
                        <p className="text-sm text-gray-500 mt-2">
                          {
                            worker.email
                          }
                        </p>
                      )}

                    </div>


                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">

                        <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                          Experience
                        </p>

                        <p className="font-bold mt-1">
                          {worker.experience_years ??
                            0}{" "}
                          years
                        </p>

                      </div>


                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">

                        <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                          Skills
                        </p>

                        <p className="font-bold mt-1">
                          {
                            worker.skills
                              ?.length ??
                            0
                          }
                        </p>

                      </div>

                    </div>


                    {worker.skills &&
                      worker.skills.length >
                        0 && (

                      <div className="mt-5 flex flex-wrap gap-2">

                        {worker.skills.map(
                          (skill) => (

                            <span
                              key={
                                skill.id
                              }
                              className="px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-100"
                            >
                              {
                                skill.name
                              }
                            </span>

                          )
                        )}

                      </div>
                    )}


                    {worker.phone && (
                      <div className="mt-5">

                        <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                          Phone
                        </p>

                        <p className="text-sm font-semibold mt-1">
                          {
                            worker.phone
                          }
                        </p>

                      </div>
                    )}


                    <div className="border-t border-gray-100 mt-6 pt-5 flex items-center justify-between gap-3">

                      <span className="text-sm text-gray-400">
                        Team Member
                      </span>

                      <button
                        type="button"
                        disabled={
                          removingId ===
                          worker.id
                        }
                        onClick={() =>
                          handleRemove(
                            worker.id
                          )
                        }
                        className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 disabled:opacity-50 transition"
                      >
                        {removingId ===
                        worker.id
                          ? "Removing..."
                          : "Remove"}
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </section>

    </main>
  );
}