"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import {
  useRouter,
} from "next/navigation";

import {
  getCurrentUser,
} from "@/lib/api";
import NotificationBell from "@/components/NotificationBell";


type User = {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;

  role:
    | "CUSTOMER"
    | "HELPER"
    | "RETAILER"
    | "ADMIN";
};


export default function DashboardPage() {
  const router =
    useRouter();


  const [
    user,
    setUser,
  ] =
    useState<User | null>(
      null
    );


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


  useEffect(() => {
    loadDashboard();
  }, []);


async function loadDashboard() {
  const accessToken =
    localStorage.getItem("access");

  const refreshToken =
    localStorage.getItem("refresh");


  // Access + Refresh দুটোই না থাকলেই
  // user সত্যি সত্যি logged out
  if (
    !accessToken &&
    !refreshToken
  ) {
    router.push(
      "/login?next=/dashboard"
    );

    return;
  }


  // Access token না থাকলেও
  // refresh token থাকলে API নতুন access token বানাবে
  const token =
    accessToken ?? "";


    try {
      const data =
        await getCurrentUser(
          token
        );


      setUser(data);


    } catch (error) {
      localStorage.removeItem(
        "access"
      );

      localStorage.removeItem(
        "refresh"
      );


      if (
        error instanceof Error
      ) {
        setMessage(
          error.message
        );
      }


      router.push(
        "/login"
      );

    } finally {
      setLoading(false);
    }
  }


  function handleLogout() {
    localStorage.removeItem(
      "access"
    );

    localStorage.removeItem(
      "refresh"
    );

    router.push("/");
  }


  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Preparing your dashboard...
          </p>

        </div>

      </main>
    );
  }


  if (!user) {
    return null;
  }


  const fullName =
    `${user.first_name || ""} ${
      user.last_name || ""
    }`.trim() ||
    user.username;


  const firstName =
    user.first_name ||
    user.username;


  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map(
        (part) =>
          part[0]
      )
      .join("")
      .slice(
        0,
        2
      )
      .toUpperCase();


  return (
    <main className="min-h-screen bg-[#f7f8fb] text-gray-950">


      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">

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
                Smart Home Services
              </p>
            </div>

          </Link>


          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-500">


            <Link
              href="/dashboard"
              className="text-violet-700 font-bold"
            >
              Dashboard
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
              className="hover:text-gray-950 transition"
            >
              Retailers
            </Link>

          </div>


          <div className="flex items-center gap-3">

            {/* NotificationBell পরে এখানে বসাবো */}
            {/* NOTIFICATION */}
                      <NotificationBell />

            <Link
              href="/profile"
              className="hidden sm:flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition"
            >

              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                {initials}
              </div>

              <span className="text-sm font-semibold">
                {firstName}
              </span>

            </Link>


            <button
              type="button"
              onClick={
                handleLogout
              }
              className="px-4 py-2.5 rounded-xl bg-gray-950 text-white text-sm font-semibold hover:bg-gray-800 transition"
            >
              Logout
            </button>

          </div>

        </div>

      </nav>



      {/* =========================
          HERO
      ========================= */}

      <section className="relative overflow-hidden">

        <div className="absolute -top-32 -left-24 w-[420px] h-[420px] bg-violet-300/30 rounded-full blur-3xl" />

        <div className="absolute -top-16 right-0 w-[480px] h-[480px] bg-indigo-300/20 rounded-full blur-3xl" />


        <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-10">

          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-stretch">

            <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 text-white rounded-[36px] p-8 md:p-11 overflow-hidden relative">

              <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl" />


              <div className="relative">

                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-violet-100">

                  <span className="w-2 h-2 bg-green-400 rounded-full" />

                  {formatRole(
                    user.role
                  )} Account

                </span>


                <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-6 leading-tight">

                  Welcome back,
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300">
                    {firstName}.
                  </span>

                </h1>


                <p className="text-gray-400 text-lg leading-relaxed mt-5 max-w-2xl">

                  {getHeroText(
                    user.role
                  )}

                </p>


                <div className="flex flex-wrap gap-3 mt-8">

                  <PrimaryAction
                    role={
                      user.role
                    }
                  />

                  <Link
                    href="/profile"
                    className="px-6 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white font-semibold hover:bg-white/15 transition"
                  >
                    Manage Profile
                  </Link>

                </div>

              </div>

            </div>



            {/* ACCOUNT CARD */}

            <div className="bg-white border border-gray-200 rounded-[32px] p-7 shadow-sm flex flex-col justify-between">

              <div>

                <div className="flex items-center justify-between">

                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                    Account
                  </p>

                  <span className="text-xs font-semibold bg-green-50 border border-green-100 text-green-700 px-3 py-1 rounded-full">
                    Active
                  </span>

                </div>


                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-black mt-7 shadow-xl shadow-violet-200">
                  {initials}
                </div>


                <h2 className="text-2xl font-black mt-5">
                  {fullName}
                </h2>


                <p className="text-gray-400 mt-1">
                  @{user.username}
                </p>


                <div className="mt-6 bg-gray-50 rounded-2xl p-4">

                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Role
                  </p>

                  <p className="font-bold mt-1">
                    {formatRole(
                      user.role
                    )}
                  </p>

                </div>

              </div>


              <Link
                href="/profile"
                className="mt-6 w-full text-center border border-gray-200 rounded-xl py-3 font-semibold hover:bg-gray-50 transition"
              >
                View Profile →
              </Link>

            </div>

          </div>

        </div>

      </section>



      {/* =========================
          MESSAGE
      ========================= */}

      {message && (

        <div className="max-w-7xl mx-auto px-6">

          <div className="bg-red-50 text-red-700 border border-red-200 rounded-2xl p-4">
            {message}
          </div>

        </div>

      )}



      {/* =========================
          ROLE DASHBOARD
      ========================= */}

      <section className="max-w-7xl mx-auto px-6 py-10 pb-20">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">

          <div>

            <p className="text-sm uppercase tracking-[0.2em] text-violet-600 font-bold">
              Quick Access
            </p>

            <h2 className="text-3xl md:text-4xl font-black mt-2">
              What would you like to do?
            </h2>

          </div>


          <p className="text-gray-500 max-w-md">
            Everything you need for your DomusCare account in one place.
          </p>

        </div>


        {user.role ===
          "CUSTOMER" && (

          <CustomerDashboard />

        )}


        {user.role ===
          "HELPER" && (

          <HelperDashboard />

        )}


        {user.role ===
          "RETAILER" && (

          <RetailerDashboard />

        )}


        {user.role ===
          "ADMIN" && (

          <AdminDashboard />

        )}

      </section>



      {/* =========================
          BOTTOM CTA
      ========================= */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[32px] p-8 md:p-12 text-white">

          <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />


          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div className="max-w-2xl">

              <p className="text-violet-100 text-sm uppercase tracking-[0.2em] font-bold">
                DomusCare
              </p>

              <h2 className="text-3xl md:text-4xl font-black mt-3">
                Home services, made simpler.
              </h2>

              <p className="text-violet-100 mt-4 text-lg">
                Manage bookings, services and service providers from one smart platform.
              </p>

            </div>


            <Link
              href="/services"
              className="shrink-0 bg-white text-violet-700 px-7 py-3.5 rounded-xl font-bold hover:bg-violet-50 transition"
            >
              Explore Services →
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}



/* =========================
   CUSTOMER DASHBOARD
========================= */

function CustomerDashboard() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      <DashboardCard
        icon="✨"
        title="Book a Service"
        description="Choose the service you need and find the right provider."
        href="/services"
        accent
      />

      <DashboardCard
        icon="📅"
        title="My Bookings"
        description="Track current requests, active services and completed bookings."
        href="/bookings"
      />

      <DashboardCard
        icon="🧰"
        title="Find Helping Hand"
        description="Browse independent Helping Hands by skill and experience."
        href="/helpers"
      />

      <DashboardCard
        icon="🏢"
        title="Retailer Services"
        description="Send a service request and let a Retailer assign a suitable worker."
        href="/retailer"
      />

      <DashboardCard
        icon="🛠️"
        title="Browse Services"
        description="Explore all household services currently available on DomusCare."
        href="/services"
      />

      <DashboardCard
        icon="👤"
        title="My Profile"
        description="Update your personal information and service address."
        href="/profile"
      />

    </div>
  );
}



/* =========================
   HELPER DASHBOARD
========================= */

function HelperDashboard() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      <DashboardCard
        icon="📩"
        title="Booking Requests"
        description="Review new Personal booking requests and accept or reject them."
        href="/helpers/requests"
        accent
      />

      <DashboardCard
        icon="🛠️"
        title="My Jobs"
        description="Manage accepted Personal jobs and Retailer-assigned service jobs."
        href="/helpers/requests"
      />

      <DashboardCard
        icon="▶️"
        title="Active Work"
        description="Start active services and complete jobs when the work is finished."
        href="/helpers/requests"
      />

      <DashboardCard
        icon="🧰"
        title="Helping Hands"
        description="See how your public profile appears in the Helping Hand marketplace."
        href="/helpers"
      />

      <DashboardCard
        icon="🛠"
        title="Services"
        description="Explore available DomusCare service categories."
        href="/services"
      />

      <DashboardCard
        icon="👤"
        title="My Profile"
        description="Update your skills, experience, bio and account information."
        href="/profile"
      />

    </div>
  );
}



/* =========================
   RETAILER DASHBOARD
========================= */

function RetailerDashboard() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      <DashboardCard
        icon="📥"
        title="Service Requests"
        description="Review customer service requests and assign suitable team members."
        href="/retailer/requests"
        accent
      />

      <DashboardCard
        icon="👷"
        title="Helping Hands"
        description="Manage all Helping Hands currently attached to your Retailer team."
        href="/retailer/workers"
      />

      <DashboardCard
        icon="➕"
        title="Add Helping Hand"
        description="Add an existing Personal Helper or create a new team member."
        href="/retailer/workers/add"
      />

      <DashboardCard
        icon="📋"
        title="Assignments"
        description="Track assigned jobs and current Retailer booking requests."
        href="/retailer/requests"
      />

      <DashboardCard
        icon="🏢"
        title="Retailer Marketplace"
        description="View the customer-facing Retailer marketplace."
        href="/retailer"
      />

      <DashboardCard
        icon="👤"
        title="Business Profile"
        description="Manage business information, contact details and address."
        href="/profile"
      />

    </div>
  );
}



/* =========================
   ADMIN DASHBOARD
========================= */

function AdminDashboard() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      <DashboardCard
        icon="👥"
        title="Users"
        description="Manage DomusCare accounts through the Django administration panel."
        href="/"
        accent
      />

      <DashboardCard
        icon="🛠"
        title="Services"
        description="Review the service marketplace and available service categories."
        href="/services"
      />

      <DashboardCard
        icon="📊"
        title="Platform Overview"
        description="Monitor customers, Helping Hands, Retailers and service activity."
        href="/dashboard"
      />

    </div>
  );
}



/* =========================
   DASHBOARD CARD
========================= */

function DashboardCard({
  icon,
  title,
  description,
  href,
  accent = false,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-[28px] border p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        accent
          ? "bg-gradient-to-br from-violet-600 to-indigo-600 border-violet-500 text-white shadow-xl shadow-violet-100"
          : "bg-white border-gray-200 hover:border-violet-200 hover:shadow-violet-100/60"
      }`}
    >

      {accent && (
        <div className="absolute -right-14 -top-14 w-40 h-40 rounded-full bg-white/10" />
      )}


      <div
        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
          accent
            ? "bg-white/15 border border-white/10"
            : "bg-violet-50"
        }`}
      >
        {icon}
      </div>


      <div className="relative mt-6">

        <h3 className="text-xl font-black">
          {title}
        </h3>


        <p
          className={`mt-3 leading-relaxed min-h-[72px] ${
            accent
              ? "text-violet-100"
              : "text-gray-500"
          }`}
        >
          {description}
        </p>


        <div
          className={`mt-6 flex items-center gap-2 font-bold ${
            accent
              ? "text-white"
              : "text-violet-700"
          }`}
        >
          Open

          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>

        </div>

      </div>

    </Link>
  );
}



/* =========================
   PRIMARY ACTION
========================= */

function PrimaryAction({
  role,
}: {
  role: User["role"];
}) {

  if (
    role === "CUSTOMER"
  ) {
    return (
      <Link
        href="/helpers"
        className="px-6 py-3.5 rounded-xl bg-white text-gray-950 font-bold hover:bg-gray-100 transition"
      >
        Find Helping Hand
      </Link>
    );
  }


  if (
    role === "HELPER"
  ) {
    return (
      <Link
        href="/helpers/requests"
        className="px-6 py-3.5 rounded-xl bg-white text-gray-950 font-bold hover:bg-gray-100 transition"
      >
        View Jobs
      </Link>
    );
  }


  if (
    role === "RETAILER"
  ) {
    return (
      <Link
        href="/retailer/requests"
        className="px-6 py-3.5 rounded-xl bg-white text-gray-950 font-bold hover:bg-gray-100 transition"
      >
        Service Requests
      </Link>
    );
  }


  return (
    <Link
      href="/"
      className="px-6 py-3.5 rounded-xl bg-white text-gray-950 font-bold"
    >
      Home
    </Link>
  );
}



/* =========================
   HELPERS
========================= */

function formatRole(
  role: User["role"]
) {
  if (
    role === "CUSTOMER"
  ) {
    return "Customer";
  }

  if (
    role === "HELPER"
  ) {
    return "Helping Hand";
  }

  if (
    role === "RETAILER"
  ) {
    return "Retailer";
  }

  return "Administrator";
}


function getHeroText(
  role: User["role"]
) {

  if (
    role === "CUSTOMER"
  ) {
    return (
      "Find trusted Helping Hands, send service requests, "
      + "manage bookings and keep track of your household services."
    );
  }


  if (
    role === "HELPER"
  ) {
    return (
      "Manage booking requests, assigned jobs and your service "
      + "activity from one simple workspace."
    );
  }


  if (
    role === "RETAILER"
  ) {
    return (
      "Manage customer requests, your Helping Hand team and "
      + "service assignments from your Retailer workspace."
    );
  }


  return (
    "Manage and monitor the DomusCare platform."
  );
}