
"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerUser } from "@/lib/api";


type Role =
  | "CUSTOMER"
  | "HELPER"
  | "RETAILER";


export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] =
    useState<Role>("CUSTOMER");

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    if (password !== confirmPassword) {
      setMessage(
        "Passwords do not match."
      );
      return;
    }

    if (password.length < 6) {
      setMessage(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role,
      });

      router.push("/login");

    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Registration failed."
        );
      }

    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="min-h-screen bg-[#f7f8fb] text-black">

      <div className="min-h-screen grid lg:grid-cols-[0.9fr_1.1fr]">

        {/* LEFT SIDE */}
        <section className="hidden lg:flex relative overflow-hidden bg-gray-950 text-white p-12">

          <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" />

          <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-indigo-500/20 rounded-full blur-3xl" />


          <div className="relative z-10 flex flex-col justify-between w-full">

            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                D
              </div>

              <div>
                <p className="text-xl font-bold">
                  DomusCare
                </p>

                <p className="text-xs text-gray-400">
                  Home Services
                </p>
              </div>
            </Link>


            <div className="max-w-xl">

              <span className="inline-flex bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm">
                Join DomusCare
              </span>

              <h1 className="text-5xl font-black leading-tight mt-6">
                One platform.
                <br />
                Different ways to belong.
              </h1>

              <p className="text-gray-400 text-lg mt-6 leading-relaxed">
                Book household services, work as a Helping Hand,
                or manage your own service team as a Retailer.
              </p>


              <div className="space-y-4 mt-10">

                <FeatureLine
                  title="Customers"
                  description="Book trusted household services."
                />

                <FeatureLine
                  title="Helping Hands"
                  description="Receive jobs and provide services."
                />

                <FeatureLine
                  title="Retailers"
                  description="Build your team and manage service requests."
                />

              </div>

            </div>


            <p className="text-sm text-gray-500">
              © 2026 DomusCare
            </p>

          </div>

        </section>


        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center p-6 md:p-10 lg:p-14">

          <div className="w-full max-w-2xl">

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8"
            >
              ← Back to Home
            </Link>


            <div className="lg:hidden flex items-center gap-3 mb-8">

              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl text-white flex items-center justify-center font-bold">
                D
              </div>

              <p className="text-xl font-bold">
                DomusCare
              </p>

            </div>


            <h2 className="text-4xl font-black">
              Create your account
            </h2>

            <p className="text-gray-500 mt-3">
              Choose how you want to use DomusCare.
            </p>


            {/* ROLE SELECT */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">

              <RoleCard
                active={
                  role === "CUSTOMER"
                }
                icon="🏠"
                title="Customer"
                description="Book services"
                onClick={() =>
                  setRole("CUSTOMER")
                }
              />

              <RoleCard
                active={
                  role === "HELPER"
                }
                icon="🧰"
                title="Helping Hand"
                description="Provide services"
                onClick={() =>
                  setRole("HELPER")
                }
              />

              <RoleCard
                active={
                  role === "RETAILER"
                }
                icon="🏢"
                title="Retailer"
                description="Manage a team"
                onClick={() =>
                  setRole("RETAILER")
                }
              />

            </div>


            {message && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                {message}
              </div>
            )}


            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* NAME */}
              <div className="grid md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    First Name
                  </label>

                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value
                      )
                    }
                    placeholder="First name"
                    className="w-full border border-gray-200 bg-white px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition"
                  />

                </div>


                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value
                      )
                    }
                    placeholder="Last name"
                    className="w-full border border-gray-200 bg-white px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition"
                  />

                </div>

              </div>


              {/* USERNAME */}
              <div>

                <label className="block text-sm font-semibold mb-2">
                  Username
                </label>

                <input
                  type="text"
                  required
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  placeholder="Choose a username"
                  className="w-full border border-gray-200 bg-white px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition"
                />

              </div>


              {/* EMAIL */}
              <div>

                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 bg-white px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition"
                />

              </div>


              {/* PASSWORDS */}
              <div className="grid md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Minimum 6 characters"
                    className="w-full border border-gray-200 bg-white px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition"
                  />

                </div>


                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Repeat password"
                    className="w-full border border-gray-200 bg-white px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition"
                  />

                </div>

              </div>


              {/* SELECTED ROLE SUMMARY */}
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4">

                <p className="text-sm text-violet-700 font-semibold">
                  Registering as
                </p>

                <p className="font-bold mt-1">
                  {role === "CUSTOMER" &&
                    "Customer"}

                  {role === "HELPER" &&
                    "Helping Hand"}

                  {role === "RETAILER" &&
                    "Retailer"}
                </p>

              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-950 hover:bg-gray-800 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-gray-200 disabled:opacity-50 transition"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>


            <div className="flex items-center gap-4 my-8">

              <div className="h-px bg-gray-200 flex-1" />

              <span className="text-sm text-gray-400">
                Already have an account?
              </span>

              <div className="h-px bg-gray-200 flex-1" />

            </div>


            <Link
              href="/login"
              className="block w-full border border-gray-200 bg-white hover:bg-gray-50 py-3.5 rounded-xl text-center font-semibold transition"
            >
              Sign In
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
}


function RoleCard({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl p-4 border transition ${
        active
          ? "border-violet-500 bg-violet-50 ring-2 ring-violet-500/10"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >

      <div className="text-2xl">
        {icon}
      </div>

      <p className="font-bold mt-3">
        {title}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {description}
      </p>

      {active && (
        <p className="text-xs font-semibold text-violet-600 mt-3">
          ✓ Selected
        </p>
      )}

    </button>
  );
}


function FeatureLine({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="w-8 h-8 shrink-0 bg-violet-500/20 text-violet-300 rounded-lg flex items-center justify-center">
        ✓
      </div>

      <div>
        <p className="font-semibold">
          {title}
        </p>

        <p className="text-sm text-gray-400 mt-1">
          {description}
        </p>
      </div>

    </div>
  );
}
