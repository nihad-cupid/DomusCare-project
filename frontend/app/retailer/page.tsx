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
  getRetailers,
} from "@/lib/api";


type Retailer = {
  id: number;

  username?: string;

  first_name?: string;
  last_name?: string;

  business_name: string;

  phone?: string;

  address?: string;

  is_verified?: boolean;

  helper_count?: number;

  service_count?: number;
};


export default function RetailerMarketplacePage() {
  const [
    retailers,
    setRetailers,
  ] = useState<Retailer[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    loggedIn,
    setLoggedIn,
  ] = useState(false);

  const [
    verifiedOnly,
    setVerifiedOnly,
  ] = useState(false);


  useEffect(() => {
    setLoggedIn(
      hasLoginSession()
    );
  }, []);


  useEffect(() => {
    async function loadRetailers() {
      try {
        const data =
          await getRetailers();

        if (
          Array.isArray(data)
        ) {
          setRetailers(
            data
          );

        } else if (
          Array.isArray(
            data?.results
          )
        ) {
          setRetailers(
            data.results
          );

        } else {
          setRetailers([]);
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
            "Could not load Retailers."
          );
        }

      } finally {
        setLoading(false);
      }
    }

    loadRetailers();
  }, []);


  const filteredRetailers =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return retailers.filter(
        (retailer) => {
          const businessName =
            retailer.business_name
              ?.toLowerCase() ||
            "";

          const address =
            retailer.address
              ?.toLowerCase() ||
            "";

          const username =
            retailer.username
              ?.toLowerCase() ||
            "";

          const matchesSearch =
            !keyword ||
            businessName.includes(
              keyword
            ) ||
            address.includes(
              keyword
            ) ||
            username.includes(
              keyword
            );

          const matchesVerified =
            !verifiedOnly ||
            retailer.is_verified ===
              true;

          return (
            matchesSearch &&
            matchesVerified
          );
        }
      );
    }, [
      retailers,
      search,
      verifiedOnly,
    ]);
  if (loading) {

    return (

      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Finding trusted Retailers...
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
        <p className="text-xl font-black leading-none">
          DomusCare
        </p>

        <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mt-1">
          Smart Home Services
        </p>
      </div>
    </Link>


    <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">

      <Link
        href="/"
        className="hover:text-gray-950 transition"
      >
        Home
      </Link>

      <Link
        href="/services"
        className="hover:text-gray-950 transition"
      >
        Services
      </Link>

      <Link
        href="/helpers"
        className="hover:text-gray-950 transition"
      >
        Helping Hands
      </Link>

      <Link
        href="/retailer"
        className="text-violet-700 font-bold"
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
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/profile"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-gray-950 text-white hover:bg-gray-800 transition"
          >
            Profile
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-gray-950 text-white hover:bg-gray-800 transition"
          >
            Get Started
          </Link>
        </>
      )}

    </div>

  </div>
</nav>

      {/* =========================
          HERO
      ========================= */}

      <section className="relative overflow-hidden">

        <div className="absolute -top-28 -left-28 w-[420px] h-[420px] bg-violet-300/30 rounded-full blur-3xl" />

        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-indigo-300/20 rounded-full blur-3xl" />


        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-14">

          <div className="grid lg:grid-cols-[1fr_430px] gap-10 items-center">


            {/* LEFT */}

            <div className="max-w-3xl">

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-sm font-semibold">

                <span className="w-2 h-2 rounded-full bg-green-500" />

                Managed Service Teams

              </span>


              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mt-6">

                Let a trusted Retailer

                <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  handle the right worker.
                </span>

              </h1>


              <p className="text-gray-600 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">

                Send your household service request
                to a Retailer and let them assign
                a suitable Helping Hand from their team.

              </p>


              <div className="grid sm:grid-cols-3 gap-4 mt-9">

                <HeroStat
                  value={`${retailers.length}+`}
                  label="Retailers"
                />

                <HeroStat
                  value="3"
                  label="Booking Plans"
                />

                <HeroStat
                  value="1"
                  label="Managed Flow"
                />

              </div>

            </div>



            {/* HERO VISUAL */}

            <div className="relative">

              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 blur-3xl rounded-full" />


              <div className="relative bg-gray-950 text-white rounded-[36px] p-7 shadow-2xl shadow-violet-200">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-violet-300 text-xs uppercase tracking-[0.2em] font-bold">
                      Retailer Model
                    </p>

                    <h2 className="text-2xl font-black mt-2">
                      Simple assignment flow
                    </h2>

                  </div>


                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-2xl">
                    🏢
                  </div>

                </div>


                <div className="mt-8 space-y-4">

                  <FlowItem
                    step="01"
                    title="Send Request"
                    description="Choose a Retailer and submit your service requirement."
                  />

                  <FlowItem
                    step="02"
                    title="Worker Assigned"
                    description="The Retailer selects a suitable Helping Hand."
                  />

                  <FlowItem
                    step="03"
                    title="Service Completed"
                    description="Track the assigned job until completion."
                  />

                </div>

              </div>

            </div>

          </div>



          {/* SEARCH */}

          <div className="mt-12 bg-white border border-gray-200 shadow-xl shadow-violet-100/30 rounded-3xl p-4 md:p-5">

            <div className="grid md:grid-cols-[1fr_auto] gap-4">

              <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4">

                <span className="text-gray-400 text-xl">
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={
                    (
                      event
                    ) =>
                      setSearch(
                        event.target.value
                      )
                  }
                  placeholder="Search by business name, username or location..."
                  className="w-full py-4 outline-none bg-transparent"
                />

              </div>


              <button
                type="button"
                onClick={
                  () =>
                    setVerifiedOnly(
                      (
                        current
                      ) =>
                        !current
                    )
                }
                className={`px-5 py-4 rounded-2xl border font-semibold transition ${
                  verifiedOnly
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                ✓ Verified Only
              </button>

            </div>

          </div>

        </div>

      </section>



      {/* =========================
          ERROR
      ========================= */}

      {message && (

        <div className="max-w-7xl mx-auto px-6">

          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
            {message}
          </div>

        </div>

      )}



      {/* =========================
          RETAILER LIST
      ========================= */}

      <section className="max-w-7xl mx-auto px-6 py-14">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">

          <div>

            <p className="text-sm uppercase tracking-[0.2em] text-violet-600 font-bold">
              Retailer Network
            </p>

            <h2 className="text-3xl md:text-4xl font-black mt-2">
              Choose a service team
            </h2>

            <p className="text-gray-500 mt-3 max-w-xl">
              Select a Retailer and submit a service request.
              The Retailer will assign an appropriate Helping Hand.
            </p>

          </div>


          <p className="text-gray-500">
            {filteredRetailers.length} Retailer
            {filteredRetailers.length !==
            1
              ? "s"
              : ""}{" "}
            found
          </p>

        </div>



        {filteredRetailers.length ===
        0 ? (

          <div className="bg-white border border-gray-200 rounded-[32px] p-14 text-center">

            <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center text-4xl mx-auto">
              🏢
            </div>

            <h3 className="text-2xl font-black mt-6">
              No Retailers found
            </h3>

            <p className="text-gray-500 mt-3">
              Try changing your search or verification filter.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredRetailers.map(
              (
                retailer
              ) => (

                <RetailerCard
                  key={
                    retailer.id
                  }
                  retailer={
                    retailer
                  }
                />

              )
            )}

          </div>

        )}

      </section>



      {/* =========================
          PERSONAL ALTERNATIVE
      ========================= */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="bg-gray-950 text-white rounded-[36px] p-8 md:p-12 overflow-hidden relative">

          <div className="absolute -right-20 -top-20 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />


          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div className="max-w-2xl">

              <p className="text-violet-300 uppercase tracking-[0.2em] text-sm font-bold">
                Prefer direct hiring?
              </p>

              <h2 className="text-3xl md:text-4xl font-black mt-3">
                Choose a Personal Helping Hand yourself.
              </h2>

              <p className="text-gray-400 text-lg mt-4 leading-relaxed">
                Browse independent Helping Hands,
                compare their skills and experience,
                then send a booking request directly.
              </p>

            </div>


            <Link
              href="/helpers"
              className="shrink-0 bg-white text-gray-950 px-7 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition"
            >
              Explore Helping Hands →
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}



/* =========================
   RETAILER CARD
========================= */

function RetailerCard({
  retailer,
}: {
  retailer: Retailer;
}) {
  const router = useRouter();

  const [
    showLoginModal,
    setShowLoginModal,
  ] = useState(false);

  const businessName =
    retailer.business_name ||
    retailer.username ||
    "Retailer";

  const initials =
    businessName
      .split(" ")
      .filter(Boolean)
      .map(
        (word) =>
          word[0]
      )
      .join("")
      .slice(
        0,
        2
      )
      .toUpperCase();

 const handleBookRetailer = (
  retailerId: number
) => {
  if (!hasLoginSession()) {
    setShowLoginModal(true);
    return;
  }

  router.push(
    `/retailer/${retailerId}/book`
  );
};

  return (
    <>
      <article className="group bg-white border border-gray-200 rounded-[28px] p-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-100/70 hover:border-violet-200 transition-all duration-300">

        {/* TOP */}

        <div className="flex items-start justify-between gap-4">

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-violet-200">
            {initials}
          </div>

          {retailer.is_verified ? (

            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-100 rounded-full px-3 py-1.5 text-xs font-bold">
              ✓ Verified
            </span>

          ) : (

            <span className="bg-gray-100 text-gray-500 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-semibold">
              Retailer
            </span>

          )}

        </div>


        {/* BUSINESS */}

        <div className="mt-5">

          <h3 className="text-2xl font-black leading-tight">
            {businessName}
          </h3>

          {retailer.username && (

            <p className="text-sm text-gray-400 mt-1">
              @{retailer.username}
            </p>

          )}

        </div>


        {/* STATS */}

        <div className="grid grid-cols-2 gap-3 mt-6">

          <div className="bg-gray-50 rounded-2xl p-4">

            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Team
            </p>

            <p className="text-lg font-black mt-1">
              {retailer.helper_count ??
                "Managed"}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Helping Hands
            </p>

          </div>


          <div className="bg-gray-50 rounded-2xl p-4">

            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Model
            </p>

            <p className="text-lg font-black mt-1">
              Retailer
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Assignment based
            </p>

          </div>

        </div>


        {/* ADDRESS */}

        <div className="mt-5 border border-gray-100 rounded-2xl p-4">

          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Service Area
          </p>

          <p className="text-gray-600 text-sm mt-2 leading-relaxed min-h-[42px]">
            {retailer.address ||
              "Service area information not provided yet."}
          </p>

        </div>


        {/* PHONE */}

        {retailer.phone && (

          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">

            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
              ☎
            </div>

            <span>
              {retailer.phone}
            </span>

          </div>

        )}


        {/* PROCESS */}

        <div className="mt-6 bg-violet-50 border border-violet-100 rounded-2xl p-4">

          <p className="text-xs uppercase tracking-[0.15em] text-violet-600 font-bold">
            How it works
          </p>

          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Send your request → Retailer reviews it → suitable Helping Hand gets assigned.
          </p>

        </div>


        {/* ACTION */}

        <div className="border-t border-gray-100 mt-6 pt-5">

          <button
            type="button"
            onClick={() =>
              handleBookRetailer(
                retailer.id
              )
            }
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 bg-gray-950 text-white font-bold hover:bg-violet-700 transition"
          >
            Book Service

            <span>
              →
            </span>
          </button>

        </div>

      </article>


      {/* LOGIN REQUIRED POPUP */}

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
              booking a Retailer service.
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



/* =========================
   HERO STAT
========================= */

function HeroStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {

  return (

    <div className="bg-white/70 backdrop-blur border border-white rounded-2xl p-4">

      <p className="text-2xl font-black text-gray-950">
        {value}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        {label}
      </p>

    </div>

  );

}



/* =========================
   FLOW ITEM
========================= */

function FlowItem({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {

  return (

    <div className="flex items-start gap-4 bg-white/[0.06] border border-white/10 rounded-2xl p-4">

      <div className="w-10 h-10 shrink-0 rounded-xl bg-violet-500/20 text-violet-200 flex items-center justify-center text-sm font-black">
        {step}
      </div>

      <div>

        <p className="font-bold">
          {title}
        </p>

        <p className="text-sm text-gray-400 leading-relaxed mt-1">
          {description}
        </p>

      </div>

    </div>

  );

}