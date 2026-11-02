
"use client";
import { useRouter } from "next/navigation";
import {
  hasLoginSession as isLoggedIn,
} from "@/lib/auth";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { getServices } from "@/lib/api";
import { hasLoginSession } from "@/lib/auth";
import NotificationBell from "@/components/NotificationBell";




type Service = {
  id: number;
  name: string;
  description: string;
  is_active?: boolean;
};


export default function ServicesPage() {
  const router = useRouter();

  const [loggedIn, setLoggedIn] =
  useState(false);

  useEffect(() => {
  setLoggedIn(
    hasLoginSession()
  );
}, []);

  const [
  showLoginModal,
  setShowLoginModal,
] = useState(false);

  const [services, setServices] =
    useState<Service[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const handleFindHelper = () => {
  if (!isLoggedIn()) {
    setShowLoginModal(true);
    return;
  }

  router.push("/helpers");
};


  useEffect(() => {
    async function loadServices() {
      try {
        const data =
          await getServices();

        setServices(data);

      } catch (error) {
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage(
            "Could not load services."
          );
        }

      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);


  const filteredServices =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return services;
      }

      return services.filter(
        (service) =>
          service.name
            .toLowerCase()
            .includes(keyword) ||
          service.description
            ?.toLowerCase()
            .includes(keyword)
      );
    }, [services, search]);


  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f8fb]">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-4">
            Loading services...
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
              className="text-violet-700 font-semibold"
            >
              Services
            </Link>

            <Link
              href="/helpers"
              className="hover:text-black"
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

        <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-300/30 blur-3xl rounded-full" />

        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-indigo-300/20 blur-3xl rounded-full" />


        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-14">

          <div className="max-w-3xl">

            <span className="inline-flex px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-sm font-semibold">
              Household Services
            </span>


            <h1 className="text-5xl md:text-6xl font-black tracking-tight mt-6 leading-tight">
              Find the right service
              <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                for your home.
              </span>
            </h1>


            <p className="text-gray-600 text-lg md:text-xl mt-5 leading-relaxed max-w-2xl">
              Browse available services first.
              When you find what you need,
              choose a Personal Helping Hand
              or a trusted Retailer.
            </p>

          </div>


          {/* SEARCH BOX */}
          <div className="mt-10 max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-xl shadow-violet-100/40 p-2 flex items-center gap-3">

            <div className="pl-3 text-gray-400 text-xl">
              ⌕
            </div>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search cleaning, plumbing, electrician..."
              className="flex-1 p-3 outline-none bg-transparent"
            />

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


      {/* SERVICE LIST */}
      <section className="max-w-7xl mx-auto px-6 py-14">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">

          <div>

            <p className="text-sm uppercase tracking-[0.2em] text-violet-600 font-bold">
              Explore
            </p>

            <h2 className="text-3xl md:text-4xl font-black mt-2">
              Available Services
            </h2>

          </div>


          <p className="text-gray-500">
            {filteredServices.length} service
            {filteredServices.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>

        </div>


        {filteredServices.length === 0 ? (

          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">

            <div className="text-5xl">
              🔍
            </div>

            <h3 className="text-2xl font-bold mt-5">
              No services found
            </h3>

            <p className="text-gray-500 mt-2">
              Try searching with a different keyword.
            </p>

          </div>

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredServices.map(
              (service, index) => (

                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                />

              )
            )}

          </div>

        )}

      </section>


      {/* CHOOSE PROVIDER */}
      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="bg-gray-950 text-white rounded-[32px] p-8 md:p-12">

          <div className="grid lg:grid-cols-2 gap-10 items-center">

            <div>

              <span className="text-violet-300 text-sm font-bold uppercase tracking-[0.2em]">
                Flexible Booking
              </span>

              <h2 className="text-4xl font-black mt-4">
                Choose how you want to get the job done.
              </h2>

              <p className="text-gray-400 mt-4 text-lg leading-relaxed">
                Hire an independent Helping Hand directly,
                or choose a Retailer and let them assign
                someone from their team.
              </p>

            </div>


            <div className="grid sm:grid-cols-2 gap-4">

              <Link
                href="/helpers"
                className="bg-white text-gray-950 rounded-2xl p-6 hover:-translate-y-1 transition"
              >

                <div className="text-3xl">
                  👤
                </div>

                <h3 className="text-xl font-bold mt-4">
                  Personal Helper
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                  Browse individual Helping Hands.
                </p>

                <p className="font-semibold mt-5">
                  Explore Helpers →
                </p>

              </Link>


              <Link
                href="/retailer"
                className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 hover:-translate-y-1 transition"
              >

                <div className="text-3xl">
                  🏢
                </div>

                <h3 className="text-xl font-bold mt-4">
                  Retailer
                </h3>

                <p className="text-violet-100 text-sm mt-2">
                  Let a Retailer assign their team.
                </p>

                <p className="font-semibold mt-5">
                  Explore Retailers →
                </p>

              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <p className="font-bold text-lg">
              DomusCare
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Better household services, all in one place.
            </p>

          </div>


          <div className="flex flex-wrap gap-5 text-sm text-gray-500">

            <Link href="/">
              Home
            </Link>

            <Link href="/helpers">
              Helping Hands
            </Link>

            <Link href="/retailer">
              Retailers
            </Link>

            <Link href="/login">
              Login
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}


function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const router = useRouter();

  const [
    showLoginModal,
    setShowLoginModal,
  ] = useState(false);

  const icons = [
    "🧹",
    "⚡",
    "🔧",
    "🛠️",
    "🧼",
    "🏠",
    "🪛",
    "🧰",
  ];

  const icon =
    icons[index % icons.length];

  const handleFindHelper = () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }

    router.push("/helpers");
  };

  const handleFindRetailer = () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }

    router.push("/retailer");
  };

  return (
    <>
      <div className="group bg-white border border-gray-200 rounded-3xl p-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-100 transition-all duration-300">

        <div className="flex items-start justify-between">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center text-2xl">
            {icon}
          </div>

          <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full">
            Available
          </span>

        </div>

        <h3 className="text-2xl font-bold mt-6">
          {service.name}
        </h3>

        <p className="text-gray-600 mt-3 leading-relaxed min-h-[72px]">
          {service.description ||
            "Professional household service available through DomusCare."}
        </p>

        <div className="border-t border-gray-100 mt-6 pt-5">

          <div className="flex items-center justify-between">

            <button
              type="button"
              onClick={handleFindHelper}
              className="text-sm font-semibold text-violet-700 hover:text-violet-900 transition"
            >
              Find Helper →
            </button>

            <button
              type="button"
              onClick={handleFindRetailer}
              className="text-sm font-semibold text-gray-700 hover:text-gray-950 transition"
            >
              Retailers →
            </button>

          </div>

        </div>

      </div>


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
              continuing with this action.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowLoginModal(false)
                }
                className="rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/login")
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