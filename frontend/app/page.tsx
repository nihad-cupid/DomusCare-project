"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  hasLoginSession,
} from "@/lib/auth";
import NotificationBell from "@/components/NotificationBell";


const services = [
  {
    icon: "🧹",
    title: "Home Cleaning",
    description:
      "Regular, deep, and move-in cleaning services for a spotless home.",
    tag: "Popular",
  },
  {
    icon: "⚡",
    title: "Electrician",
    description:
      "Skilled electrical support for repairs, installations, and maintenance.",
    tag: "Fast Booking",
  },
  {
    icon: "🔧",
    title: "Plumbing",
    description:
      "Reliable plumbing solutions for leaks, fittings, and water systems.",
    tag: "Trusted",
  },
  {
    icon: "🛠️",
    title: "Home Assistance",
    description:
      "Flexible helping hands for everyday household tasks and support.",
    tag: "Flexible",
  },
];


const benefits = [
  {
    icon: "✓",
    title: "Verified Providers",
    description:
      "Choose from reviewed Helping Hands and trusted service Retailers.",
  },
  {
    icon: "⚡",
    title: "Quick Booking",
    description:
      "Find the right service and send a booking request in just a few steps.",
  },
  {
    icon: "★",
    title: "Ratings & Reviews",
    description:
      "See real feedback before choosing the right Helping Hand.",
  },
  {
    icon: "◎",
    title: "Track Your Job",
    description:
      "Follow your service from request to assignment and completion.",
  },
];


const steps = [
  {
    number: "01",
    title: "Explore",
    description:
      "Browse services, Helping Hands, and Retailers before creating an account.",
  },
  {
    number: "02",
    title: "Choose",
    description:
      "Compare skills, experience, ratings, and service options.",
  },
  {
    number: "03",
    title: "Book",
    description:
      "Login when you are ready and submit your service request.",
  },
  {
    number: "04",
    title: "Relax",
    description:
      "Track your job, get it completed, then leave a review.",
  },
];


export default function HomePage() {
  const [
    loggedIn,
    setLoggedIn,
  ] = useState(false);

  useEffect(() => {
    setLoggedIn(
      hasLoginSession()
    );
  }, []);
  
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-[#111827] overflow-hidden">

     {/* =========================
    NAVBAR
========================== */}

<nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl">

  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

    {/* LOGO */}
    <Link
      href="/"
      className="flex items-center gap-3"
    >
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-violet-200">
        D
      </div>

      <div>
        <h1 className="text-xl font-extrabold tracking-tight">
          DomusCare
        </h1>

        <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
          Home Services
        </p>
      </div>
    </Link>


    {/* CENTER NAV */}
    <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">

      <Link
        href="/"
        className="hover:text-black transition"
      >
        Home
      </Link>

      <Link
        href="/services"
        className="hover:text-black transition"
      >
        Services
      </Link>

      <Link
        href="/helpers"
        className="hover:text-black transition"
      >
        Helping Hands
      </Link>

      <Link
        href="/retailer"
        className="hover:text-black transition"
      >
        Retailers
      </Link>

      <a
        href="#how-it-works"
        className="hover:text-black transition"
      >
        How It Works
      </a>

    </div>


    {/* RIGHT SIDE */}
    <div className="flex items-center gap-3">
  {loggedIn ? (
    <>
      <NotificationBell />

      <Link
        href="/dashboard"
        className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
      >
        Dashboard
      </Link>

      <Link
        href="/profile"
        className="px-4 py-2 rounded-xl bg-gray-950 text-white hover:bg-gray-800 transition"
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
        className="px-4 py-2 rounded-xl bg-gray-950 text-white hover:bg-gray-800 transition"
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
      ========================== */}
      <section className="relative pt-32 md:pt-40 pb-24">

        {/* Decorative background */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute top-10 right-0 w-[430px] h-[430px] rounded-full bg-indigo-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-cyan-200/20 blur-3xl" />


        <div className="relative max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-violet-100 shadow-sm">

                <span className="w-2 h-2 rounded-full bg-green-500" />

                <span className="text-sm font-medium text-gray-600">
                  Trusted help for every home
                </span>

              </div>


              <h1 className="mt-7 text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">

                Home services,

                <span className="block bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  made effortless.
                </span>

              </h1>


              <p className="mt-7 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">

                Discover skilled Helping Hands and trusted Retailers
                for cleaning, repairs, maintenance and everyday
                household assistance — all in one platform.

              </p>


              <div className="flex flex-wrap gap-4 mt-9">

                <Link
                  href="/services"
                  className="px-7 py-4 rounded-2xl bg-gray-950 text-white font-semibold hover:bg-gray-800 transition shadow-xl shadow-gray-300"
                >
                  Explore Services
                </Link>


                <Link
                  href="/helpers"
                  className="px-7 py-4 rounded-2xl bg-white border border-gray-200 font-semibold hover:border-gray-300 hover:shadow-md transition"
                >
                  Find Helping Hands
                </Link>

              </div>


              <div className="flex flex-wrap items-center gap-7 mt-9 text-sm text-gray-500">

                <div className="flex items-center gap-2">
                  <span className="text-green-500">
                    ✓
                  </span>
                  Browse before login
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-green-500">
                    ✓
                  </span>
                  Trusted providers
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-green-500">
                    ✓
                  </span>
                  Easy booking
                </div>

              </div>

            </div>


            {/* RIGHT VISUAL */}
            <div className="relative">

              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/10 rounded-[40px] blur-2xl" />

              <div className="relative bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-2xl shadow-indigo-100 p-6 md:p-8">

                {/* Top card */}
                <div className="flex items-center justify-between mb-7">

                  <div>
                    <p className="text-sm text-gray-500">
                      Find the right help
                    </p>

                    <h3 className="text-2xl font-bold mt-1">
                      What do you need today?
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center text-xl">
                    ✦
                  </div>

                </div>


                {/* Fake search */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-3">

                  <span className="text-gray-400">
                    ⌕
                  </span>

                  <span className="text-gray-500">
                    Search cleaning, plumbing, electrician...
                  </span>

                </div>


                {/* Service mini cards */}
                <div className="grid grid-cols-2 gap-4 mt-5">

                  <MiniService
                    icon="🧹"
                    title="Cleaning"
                    subtitle="Available today"
                  />

                  <MiniService
                    icon="⚡"
                    title="Electrician"
                    subtitle="Skilled helpers"
                  />

                  <MiniService
                    icon="🔧"
                    title="Plumbing"
                    subtitle="Quick support"
                  />

                  <MiniService
                    icon="🛠️"
                    title="Home Help"
                    subtitle="Flexible booking"
                  />

                </div>


                {/* Floating provider card */}
                <div className="mt-6 bg-gray-950 text-white rounded-2xl p-5 flex items-center justify-between">

                  <div>

                    <p className="text-sm text-gray-400">
                      Top rated Helping Hand
                    </p>

                    <p className="font-bold mt-1">
                      Available near you
                    </p>

                  </div>

                  <div className="flex items-center gap-1 text-yellow-300">
                    ★ 4.9
                  </div>

                </div>

              </div>


              {/* Floating badges */}
              <div className="hidden md:block absolute -left-10 top-16 bg-white rounded-2xl shadow-xl border p-4">

                <p className="text-xs text-gray-400">
                  Booking Success
                </p>

                <p className="text-xl font-bold mt-1">
                  98%
                </p>

              </div>


              <div className="hidden md:block absolute -right-8 bottom-20 bg-white rounded-2xl shadow-xl border p-4">

                <p className="text-xs text-gray-400">
                  Customer Rating
                </p>

                <p className="text-xl font-bold mt-1">
                  4.8 ★
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          TRUST STATS
      ========================== */}
      <section className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

          <Stat
            number="50+"
            label="Service Providers"
          />

          <Stat
            number="20+"
            label="Household Services"
          />

          <Stat
            number="4.8/5"
            label="Average Rating"
          />

          <Stat
            number="24/7"
            label="Easy Access"
          />

        </div>

      </section>


      {/* =========================
          SERVICES
      ========================== */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

          <div>

            <span className="text-sm uppercase tracking-[0.2em] font-bold text-violet-600">
              Popular Services
            </span>

            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">
              Everything your home needs.
            </h2>

            <p className="text-gray-600 mt-4 max-w-2xl text-lg">
              Get trusted professionals for everyday household
              tasks, maintenance and repairs.
            </p>

          </div>


          <Link
            href="/services"
            className="font-semibold text-violet-700 hover:underline"
          >
            Explore all services →
          </Link>

        </div>


        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

          {services.map(
            (service) => (

              <div
                key={service.title}
                className="group bg-white border border-gray-200 rounded-3xl p-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-100 transition-all duration-300"
              >

                <div className="flex justify-between items-start">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center text-2xl">
                    {service.icon}
                  </div>

                  <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                    {service.tag}
                  </span>

                </div>


                <h3 className="text-xl font-bold mt-6">
                  {service.title}
                </h3>

                <p className="text-gray-600 mt-3 leading-relaxed">
                  {service.description}
                </p>


                <Link
                  href="/services"
                  className="inline-flex mt-6 font-semibold text-sm text-violet-700"
                >
                  View service →
                </Link>

              </div>

            )
          )}

        </div>

      </section>


      {/* =========================
          WHY DOMUSCARE
      ========================== */}
      <section className="bg-gray-950 text-white">

        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>

              <span className="text-sm uppercase tracking-[0.2em] font-bold text-violet-300">
                Why DomusCare
              </span>

              <h2 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
                One platform.
                <br />
                Two ways to get help.
              </h2>

              <p className="text-gray-400 text-lg mt-5 leading-relaxed max-w-xl">
                Choose independent Helping Hands directly
                or request services through Retailers that
                manage their own teams.
              </p>


              <div className="grid sm:grid-cols-2 gap-5 mt-10">

                {benefits.map(
                  (item) => (

                    <div
                      key={item.title}
                      className="bg-white/5 border border-white/10 rounded-2xl p-5"
                    >

                      <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold">
                        {item.icon}
                      </div>

                      <h3 className="font-bold mt-4">
                        {item.title}
                      </h3>

                      <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                        {item.description}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>


            <div className="space-y-6">

              {/* PERSONAL */}
              <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8">

                <div className="flex items-center justify-between">

                  <span className="px-3 py-1 text-xs rounded-full bg-white/15">
                    PERSONAL
                  </span>

                  <span className="text-2xl">
                    👤
                  </span>

                </div>


                <h3 className="text-3xl font-bold mt-6">
                  Hire a Helping Hand directly
                </h3>

                <p className="text-violet-100 mt-4 leading-relaxed">
                  Browse individual Helping Hands,
                  compare their skills and ratings,
                  then send a booking request directly.
                </p>


                <Link
                  href="/helpers"
                  className="inline-block mt-7 bg-white text-gray-950 px-6 py-3 rounded-xl font-semibold"
                >
                  Browse Helping Hands
                </Link>

              </div>


              {/* RETAILER */}
              <div className="bg-white text-gray-950 rounded-3xl p-8">

                <div className="flex items-center justify-between">

                  <span className="px-3 py-1 text-xs rounded-full bg-gray-100">
                    RETAILER
                  </span>

                  <span className="text-2xl">
                    🏢
                  </span>

                </div>


                <h3 className="text-3xl font-bold mt-6">
                  Let a Retailer handle it
                </h3>

                <p className="text-gray-600 mt-4 leading-relaxed">
                  Request the service you need and
                  let the Retailer assign a suitable
                  Helping Hand from their team.
                </p>


                <Link
                  href="/retailer"
                  className="inline-block mt-7 bg-gray-950 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Browse Retailers
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          HOW IT WORKS
      ========================== */}
      <section
        id="how-it-works"
        className="max-w-7xl mx-auto px-6 py-24"
      >

        <div className="text-center max-w-3xl mx-auto">

          <span className="text-sm uppercase tracking-[0.2em] font-bold text-violet-600">
            Simple Process
          </span>

          <h2 className="text-4xl md:text-5xl font-black mt-4">
            From search to service,
            in just a few steps.
          </h2>

          <p className="text-gray-600 text-lg mt-4">
            Browse freely, choose confidently,
            and login only when you are ready to book.
          </p>

        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">

          {steps.map(
            (step) => (

              <div
                key={step.number}
                className="relative bg-white border border-gray-200 rounded-3xl p-7"
              >

                <div className="text-5xl font-black text-gray-100">
                  {step.number}
                </div>

                <h3 className="text-xl font-bold mt-4">
                  {step.title}
                </h3>

                <p className="text-gray-600 mt-3 leading-relaxed">
                  {step.description}
                </p>

              </div>

            )
          )}

        </div>

      </section>


      {/* =========================
          TESTIMONIAL
      ========================== */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 border border-violet-100 rounded-[36px] p-8 md:p-14">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>

              <span className="text-sm uppercase tracking-[0.2em] font-bold text-violet-600">
                Built for Trust
              </span>

              <h2 className="text-4xl font-black mt-4">
                A better way to manage everyday home services.
              </h2>

              <p className="text-gray-600 mt-5 text-lg leading-relaxed">
                DomusCare brings customers, independent
                Helping Hands and Retailers into one
                connected service ecosystem.
              </p>

            </div>


            <div className="bg-white rounded-3xl p-7 shadow-xl shadow-violet-100">

              <div className="text-yellow-400 text-xl">
                ★ ★ ★ ★ ★
              </div>

              <p className="text-xl font-medium leading-relaxed mt-5">
                “Finding the right service should feel
                simple, transparent and reliable.
                That is exactly what DomusCare is designed for.”
              </p>

              <div className="flex items-center gap-4 mt-7">

                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600" />

                <div>
                  <p className="font-bold">
                    DomusCare
                  </p>

                  <p className="text-sm text-gray-500">
                    Better home services
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          CTA
      ========================== */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="relative overflow-hidden bg-gray-950 rounded-[36px] p-10 md:p-16 text-white text-center">

          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-violet-600/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-indigo-500/30 blur-3xl" />


          <div className="relative">

            <span className="inline-flex px-4 py-2 rounded-full bg-white/10 text-sm">
              Ready when you are
            </span>

            <h2 className="text-4xl md:text-5xl font-black mt-6">
              Your next Helping Hand
              is just a few clicks away.
            </h2>

            <p className="text-gray-400 text-lg mt-5 max-w-2xl mx-auto">
              Explore providers freely and create
              your account only when you are ready
              to request a service.
            </p>


            <div className="flex flex-wrap justify-center gap-4 mt-8">

              <Link
                href="/register"
                className="bg-white text-black px-7 py-3.5 rounded-xl font-semibold"
              >
                Create Free Account
              </Link>

              <Link
                href="/services"
                className="border border-white/20 bg-white/5 px-7 py-3.5 rounded-xl font-semibold"
              >
                Browse Services
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================== */}
      <footer className="bg-white border-t border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-14">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

            <div>

              <Link
                href="/"
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                  D
                </div>

                <span className="text-xl font-bold">
                  DomusCare
                </span>
              </Link>

              <p className="text-gray-500 mt-4 leading-relaxed">
                Connecting households with skilled
                Helping Hands and trusted Retailers.
              </p>

            </div>


            <FooterColumn
              title="Explore"
              links={[
                ["Services", "/services"],
                ["Helping Hands", "/helpers"],
                ["Retailers", "/retailer"],
              ]}
            />


            <FooterColumn
              title="Account"
              links={[
                ["Login", "/login"],
                ["Register", "/register"],
                ["Dashboard", "/dashboard"],
              ]}
            />


            <div>

              <h4 className="font-bold">
                DomusCare
              </h4>

              <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                An intelligent helping hand platform
                for modern household service management.
              </p>

            </div>

          </div>


          <div className="border-t border-gray-200 mt-12 pt-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-gray-500">

            <p>
              © 2026 DomusCare. All rights reserved.
            </p>

            <p>
              Built for better home services.
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}


function MiniService({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:bg-white hover:shadow-md transition">

      <div className="text-2xl">
        {icon}
      </div>

      <p className="font-bold mt-3">
        {title}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {subtitle}
      </p>

    </div>
  );
}


function Stat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="p-7 md:p-8 text-center border-r border-b lg:border-b-0 border-gray-100 last:border-r-0">

      <p className="text-3xl font-black">
        {number}
      </p>

      <p className="text-sm text-gray-500 mt-2">
        {label}
      </p>

    </div>
  );
}


function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>

      <h4 className="font-bold">
        {title}
      </h4>

      <div className="space-y-3 mt-4">

        {links.map(([label, href]) => (

          <Link
            key={label}
            href={href}
            className="block text-gray-500 hover:text-black transition"
          >
            {label}
          </Link>

        ))}

      </div>

    </div>
  );
}