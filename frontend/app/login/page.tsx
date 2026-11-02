
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginUser } from "@/lib/api";


export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const data = await loginUser(
        username,
        password
      );

      localStorage.setItem(
        "access",
        data.access
      );

      localStorage.setItem(
        "refresh",
        data.refresh
      );

      router.push("/dashboard");

    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Login failed.");
      }

    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="min-h-screen bg-[#f7f8fb] text-black">

      <div className="min-h-screen grid lg:grid-cols-2">

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
                Welcome back
              </span>

              <h1 className="text-5xl font-black leading-tight mt-6">
                Your trusted home service network.
              </h1>

              <p className="text-gray-400 text-lg mt-6 leading-relaxed">
                Manage bookings, track services,
                connect with Helping Hands,
                and keep everything in one place.
              </p>


              <div className="grid grid-cols-2 gap-4 mt-10">

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-2xl font-bold">
                    Easy
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Service booking
                  </p>
                </div>


                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-2xl font-bold">
                    Trusted
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Helping Hands
                  </p>
                </div>

              </div>

            </div>


            <p className="text-sm text-gray-500">
              © 2026 DomusCare
            </p>

          </div>

        </section>


        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center p-6 md:p-10">

          <div className="w-full max-w-md">

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
              Welcome back
            </h2>

            <p className="text-gray-500 mt-3">
              Login to continue to your DomusCare account.
            </p>


            {message && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                {message}
              </div>
            )}


            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

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
                  placeholder="Enter your username"
                  className="w-full border border-gray-200 bg-white px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition"
                />

              </div>


              <div>

                <div className="flex justify-between mb-2">

                  <label className="text-sm font-semibold">
                    Password
                  </label>

                  <span className="text-sm text-violet-600">
                    Forgot password?
                  </span>

                </div>


                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 bg-white px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition"
                />

              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-950 hover:bg-gray-800 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-gray-200 disabled:opacity-50 transition"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>

            </form>


            <div className="flex items-center gap-4 my-8">

              <div className="h-px bg-gray-200 flex-1" />

              <span className="text-sm text-gray-400">
                New to DomusCare?
              </span>

              <div className="h-px bg-gray-200 flex-1" />

            </div>


            <Link
              href="/register"
              className="block w-full border border-gray-200 bg-white hover:bg-gray-50 py-3.5 rounded-xl text-center font-semibold transition"
            >
              Create an Account
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
}