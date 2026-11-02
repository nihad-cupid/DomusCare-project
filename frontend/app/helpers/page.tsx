"use client";
import { useRouter } from "next/navigation";
import { hasLoginSession } from "@/lib/auth";
import NotificationBell from "@/components/NotificationBell";


import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  getAvailableHelpers,
} from "@/lib/api";


type Skill = {
  id: number;
  name: string;
};


type Helper = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  experience_years: number;
  bio?: string;
  availability: string;
  work_model?: string;
  skills: Skill[];
  average_rating?: number | null;
};


export default function HelpersPage() {
  const [loggedIn, setLoggedIn] =
  useState(false);

  const [helpers, setHelpers] =
    useState<Helper[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [availability, setAvailability] =
    useState("ALL");


    useEffect(() => {
  setLoggedIn(
    hasLoginSession()
  );
}, []);

  useEffect(() => {
    async function loadHelpers() {
      try {
        const data =
          await getAvailableHelpers();

        setHelpers(data);

      } catch (error) {
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage(
            "Could not load Helping Hands."
          );
        }

      } finally {
        setLoading(false);
      }
    }

    loadHelpers();
  }, []);


  const filteredHelpers =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return helpers.filter(
        (helper) => {
          const fullName =
            `${helper.first_name} ${helper.last_name}`
              .trim()
              .toLowerCase();

          const matchesSearch =
            !keyword ||
            helper.username
              .toLowerCase()
              .includes(keyword) ||
            fullName.includes(keyword) ||
            helper.skills.some(
              (skill) =>
                skill.name
                  .toLowerCase()
                  .includes(keyword)
            );

          const matchesAvailability =
            availability === "ALL" ||
            helper.availability ===
              availability;

          return (
            matchesSearch &&
            matchesAvailability
          );
        }
      );
    }, [
      helpers,
      search,
      availability,
    ]);


  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Finding Helping Hands...
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


          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">

            <Link
              href="/"
              className="hover:text-black"
            >
              Home
            </Link>

            <Link
              href="/services"
              className="hover:text-black"
            >
              Services
            </Link>

            <Link
              href="/helpers"
              className="text-violet-700 font-semibold"
            >
              Helping Hands
            </Link>

            <Link
              href="/retailer"
              className="hover:text-black"
            >
              Retailers
            </Link>

          </div>


          <div className="flex items-center gap-3">
  {loggedIn ? (
    <>
    {/* NOTIFICATION */}
              <NotificationBell />
      <Link
        href="/dashboard"
        className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
      >
        Dashboard
      </Link>

      <Link
        href="/profile"
        className="px-4 py-2 rounded-xl bg-gray-950 text-white hover:bg-gray-800"
      >
        Profile
      </Link>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="px-4 py-2 rounded-xl border border-gray-200 bg-white"
      >
        Login
      </Link>

      <Link
        href="/register"
        className="px-4 py-2 rounded-xl bg-gray-950 text-white"
      >
        Get Started
      </Link>
    </>
  )}
</div>

        </div>

      </nav>


      {/* HERO */}
      <section className="relative overflow-hidden">

        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-violet-300/30 blur-3xl" />

        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-indigo-300/20 blur-3xl" />


        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-14">

          <div className="max-w-3xl">

            <span className="inline-flex px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-sm font-semibold">
              Trusted Helping Hands
            </span>


            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mt-6">
              Find someone you can
              <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                trust with your home.
              </span>
            </h1>


            <p className="text-gray-600 text-lg md:text-xl mt-5 leading-relaxed max-w-2xl">
              Browse skilled independent Helping Hands,
              explore their experience and skills,
              and choose the right person for your service.
            </p>

          </div>


          {/* FILTER CARD */}
          <div className="mt-10 bg-white border border-gray-200 shadow-xl shadow-violet-100/40 rounded-3xl p-4 md:p-5">

            <div className="grid md:grid-cols-[1fr_220px] gap-3">

              <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4">

                <span className="text-gray-400">
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search by name, username or skill..."
                  className="w-full py-3.5 outline-none bg-transparent"
                />

              </div>


              <select
                value={availability}
                onChange={(event) =>
                  setAvailability(
                    event.target.value
                  )
                }
                className="border border-gray-200 bg-white rounded-2xl px-4 py-3.5 outline-none"
              >
                <option value="ALL">
                  All Availability
                </option>

                <option value="AVAILABLE">
                  Available
                </option>

                <option value="BUSY">
                  Busy
                </option>

                <option value="UNAVAILABLE">
                  Unavailable
                </option>

              </select>

            </div>

          </div>

        </div>

      </section>


      {/* ERROR */}
      {message && (
        <div className="max-w-7xl mx-auto px-6">

          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {message}
          </div>

        </div>
      )}


      {/* HELPERS */}
      <section className="max-w-7xl mx-auto px-6 py-14">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">

          <div>

            <p className="text-sm uppercase tracking-[0.2em] text-violet-600 font-bold">
              Helping Hands
            </p>

            <h2 className="text-3xl md:text-4xl font-black mt-2">
              Available professionals
            </h2>

          </div>


          <p className="text-gray-500">
            {filteredHelpers.length} Helping Hand
            {filteredHelpers.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>

        </div>


        {filteredHelpers.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center">

            <div className="text-5xl">
              🧰
            </div>

            <h3 className="text-2xl font-bold mt-5">
              No Helping Hands found
            </h3>

            <p className="text-gray-500 mt-2">
              Try changing your search or availability filter.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredHelpers.map(
              (helper) => (

                <HelperCard
                  key={helper.id}
                  helper={helper}
                />

              )
            )}

          </div>

        )}

      </section>


      {/* ALTERNATIVE */}
      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="bg-gray-950 text-white rounded-[32px] p-8 md:p-12">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div className="max-w-2xl">

              <p className="text-violet-300 font-bold text-sm uppercase tracking-[0.2em]">
                Need another option?
              </p>

              <h2 className="text-3xl md:text-4xl font-black mt-3">
                Let a Retailer choose the right person for you.
              </h2>

              <p className="text-gray-400 mt-4 text-lg">
                Submit your service request to a Retailer,
                and they can assign one of their suitable
                team members to your job.
              </p>

            </div>


            <Link
              href="/retailer"
              className="shrink-0 bg-white text-gray-950 px-7 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Explore Retailers →
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}


function HelperCard({
  helper,
}: {
  helper: Helper;
}) {
  const router = useRouter();

  const [
    showLoginModal,
    setShowLoginModal,
  ] = useState(false);

  const handleViewProfile = (
    helperId: number
  ) => {
    if (
      !hasLoginSession()
    ) {
      setShowLoginModal(true);
      return;
    }

    router.push(
      `/helpers/${helperId}`
    );
  };

  const handleBookNow = (
    helperId: number
  ) => {
    if (
      !hasLoginSession()
    ) {
      setShowLoginModal(true);
      return;
    }

    router.push(
      `/book/${helperId}`
    );
  };

  const fullName =
    `${helper.first_name} ${helper.last_name}`
      .trim();

  const initials =
    fullName
      ? fullName
          .split(" ")
          .map(
            (part) => part[0]
          )
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : helper.username
          .slice(0, 2)
          .toUpperCase();

  const availabilityStyle =
    helper.availability ===
    "AVAILABLE"
      ? "bg-green-50 text-green-700 border-green-100"
      : helper.availability ===
        "BUSY"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <>
      <div className="group bg-white border border-gray-200 rounded-3xl p-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-100 transition-all duration-300">

        <div className="flex items-start justify-between">

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-violet-200">
            {initials}
          </div>

          <span
            className={`text-xs px-3 py-1.5 rounded-full border font-medium ${availabilityStyle}`}
          >
            {helper.availability}
          </span>

        </div>

        <div className="mt-5">
          <h3 className="text-2xl font-bold">
            {fullName ||
              helper.username}
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            @{helper.username}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">
              Experience
            </p>

            <p className="font-bold mt-1">
              {helper.experience_years} year
              {helper.experience_years !== 1
                ? "s"
                : ""}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">
              Rating
            </p>

            <p className="font-bold mt-1">
              {helper.average_rating
                ? `${Number(
                    helper.average_rating
                  ).toFixed(1)} ★`
                : "New"}
            </p>
          </div>

        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Skills
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {helper.skills?.length > 0 ? (
              helper.skills
                .slice(0, 4)
                .map(
                  (skill) => (
                    <span
                      key={skill.id}
                      className="bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {skill.name}
                    </span>
                  )
                )
            ) : (
              <span className="text-sm text-gray-400">
                No skills listed
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">

          <button
            type="button"
            onClick={() =>
              handleViewProfile(
                helper.id
              )
            }
            className="border border-gray-200 rounded-xl py-3 text-center font-semibold hover:bg-gray-50 transition"
          >
            View Profile
          </button>

          <button
            type="button"
            onClick={() =>
              handleBookNow(
                helper.id
              )
            }
            disabled={
              helper.availability !==
              "AVAILABLE"
            }
            className={`rounded-xl py-3 text-center font-semibold transition ${
              helper.availability ===
              "AVAILABLE"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Book Now
          </button>

        </div>

      </div>


      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl border border-gray-100">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-3xl">
              🔐
            </div>

            <h2 className="mt-5 text-center text-2xl font-bold text-gray-950">
              Login First
            </h2>

            <p className="mt-3 text-center text-gray-500 leading-relaxed">
              You need to login before
              continuing with this action.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowLoginModal(
                    false
                  )
                }
                className="rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/login"
                  )
                }
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 font-semibold text-white hover:opacity-90 transition"
              >
                Login
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}