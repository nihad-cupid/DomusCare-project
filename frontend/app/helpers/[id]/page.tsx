"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import {
  useParams,
} from "next/navigation";

import {
  getHelperDetails,
  getHelperReviews,
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


type Review = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;

  customer?: {
    username?: string;
    first_name?: string;
    last_name?: string;
  };
};


export default function HelperDetailsPage() {
  const params =
    useParams();

  const helperId =
    Number(params.id);


  const [helper, setHelper] =
    useState<Helper | null>(null);

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");


  useEffect(() => {
    async function loadPage() {
      try {
        const [
          helperData,
          reviewData,
        ] = await Promise.all([
          getHelperDetails(
            helperId
          ),

          getHelperReviews(
            helperId
          ),
        ]);


        setHelper(
          helperData
        );


        /*
          IMPORTANT FIX

          Backend direct array দিলে:
          [...]

          অথবা pagination দিলে:
          {
            count: 2,
            results: [...]
          }

          অথবা:
          {
            reviews: [...]
          }

          সব handle করবে।
        */

        if (
          Array.isArray(
            reviewData
          )
        ) {
          setReviews(
            reviewData
          );

        } else if (
          Array.isArray(
            reviewData?.results
          )
        ) {
          setReviews(
            reviewData.results
          );

        } else if (
          Array.isArray(
            reviewData?.reviews
          )
        ) {
          setReviews(
            reviewData.reviews
          );

        } else {
          setReviews([]);
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
            "Could not load Helping Hand."
          );
        }

      } finally {
        setLoading(false);
      }
    }


    if (helperId) {
      loadPage();
    }

  }, [helperId]);


  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-4">
            Loading profile...
          </p>

        </div>

      </main>
    );
  }


  if (
    message ||
    !helper
  ) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center p-6">

        <div className="bg-white border border-gray-200 rounded-3xl p-10 max-w-lg w-full text-center shadow-sm">

          <div className="text-5xl">
            ⚠️
          </div>

          <h1 className="text-2xl font-bold mt-5">
            Could not load profile
          </h1>

          <p className="text-gray-500 mt-3">
            {message ||
              "Helping Hand not found."}
          </p>

          <Link
            href="/helpers"
            className="inline-block mt-7 bg-gray-950 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Helping Hands
          </Link>

        </div>

      </main>
    );
  }


  const fullName =
    `${helper.first_name || ""} ${helper.last_name || ""}`
      .trim();


  const initials =
    fullName
      ? fullName
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
          .toUpperCase()
      : helper.username
          .slice(
            0,
            2
          )
          .toUpperCase();


  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (
            sum,
            review
          ) =>
            sum +
            Number(
              review.rating
            ),
          0
        ) /
        reviews.length
      : Number(
          helper.average_rating ||
          0
        );


  const availabilityStyle =
    helper.availability ===
    "AVAILABLE"
      ? "bg-green-50 text-green-700 border-green-200"

      : helper.availability ===
        "BUSY"
      ? "bg-amber-50 text-amber-700 border-amber-200"

      : "bg-gray-100 text-gray-600 border-gray-200";


  return (
    <main className="min-h-screen bg-[#f7f8fb] text-gray-950">


      {/* =========================
          NAVBAR
      ========================== */}

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

          </div>

        </div>

      </nav>



      {/* =========================
          PROFILE HERO
      ========================== */}

      <section className="relative overflow-hidden">

        <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-300/30 blur-3xl rounded-full" />

        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-indigo-300/20 blur-3xl rounded-full" />


        <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-10">

          <Link
            href="/helpers"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
          >
            ← Back to Helping Hands
          </Link>


          <div className="mt-8 bg-white border border-gray-200 rounded-[32px] shadow-xl shadow-violet-100/30 p-7 md:p-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">


              {/* PROFILE INFO */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-6">

                <div className="w-28 h-28 shrink-0 rounded-[28px] bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-4xl font-black shadow-xl shadow-violet-200">
                  {initials}
                </div>


                <div>

                  <div className="flex flex-wrap items-center gap-3">

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                      {fullName ||
                        helper.username}
                    </h1>


                    <span
                      className={`text-xs px-3 py-1.5 rounded-full border font-semibold ${availabilityStyle}`}
                    >
                      {helper.availability}
                    </span>

                  </div>


                  <p className="text-gray-400 mt-2">
                    @{helper.username}
                  </p>


                  <div className="flex flex-wrap gap-3 mt-5">

                    <span className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm">
                      ⭐{" "}
                      {averageRating > 0
                        ? averageRating.toFixed(
                            1
                          )
                        : "New"}
                    </span>


                    <span className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm">
                      🧰{" "}
                      {
                        helper.experience_years
                      }{" "}
                      year
                      {helper.experience_years !==
                      1
                        ? "s"
                        : ""}{" "}
                      experience
                    </span>


                    <span className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm">
                      💬{" "}
                      {reviews.length}{" "}
                      review
                      {reviews.length !==
                      1
                        ? "s"
                        : ""}
                    </span>

                  </div>

                </div>

              </div>



              {/* BOOKING BUTTON */}

              <div className="lg:text-right">

                {helper.availability ===
                "AVAILABLE" ? (

                  <Link
                    href={`/book/${helper.id}`}
                    className="inline-flex justify-center bg-gray-950 text-white px-7 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition shadow-xl shadow-gray-200"
                  >
                    Book This Helping Hand
                  </Link>

                ) : (

                  <button
                    disabled
                    className="bg-gray-200 text-gray-400 px-7 py-4 rounded-2xl font-semibold cursor-not-allowed"
                  >
                    Currently Unavailable
                  </button>

                )}


                <p className="text-xs text-gray-400 mt-3">
                  Login is required when booking.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* =========================
          MAIN CONTENT
      ========================== */}

      <section className="max-w-7xl mx-auto px-6 py-8 pb-20">

        <div className="grid lg:grid-cols-[1fr_360px] gap-7">


          {/* ======================
              LEFT CONTENT
          ======================= */}

          <div className="space-y-7">


            {/* ABOUT */}

            <div className="bg-white border border-gray-200 rounded-3xl p-7">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 bg-violet-50 text-violet-700 rounded-xl flex items-center justify-center">
                  👤
                </div>

                <div>

                  <p className="text-sm text-gray-400">
                    Profile
                  </p>

                  <h2 className="text-2xl font-bold">
                    About
                  </h2>

                </div>

              </div>


              <p className="text-gray-600 leading-relaxed mt-6 text-[15px]">

                {helper.bio ||
                  "This Helping Hand has not added a profile description yet."}

              </p>

            </div>



            {/* SKILLS */}

            <div className="bg-white border border-gray-200 rounded-3xl p-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-400">
                    Expertise
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Skills & Services
                  </h2>

                </div>


                <div className="w-11 h-11 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center">
                  🧰
                </div>

              </div>


              {Array.isArray(
                helper.skills
              ) &&
              helper.skills.length > 0 ? (

                <div className="grid sm:grid-cols-2 gap-3 mt-6">

                  {helper.skills.map(
                    (
                      skill
                    ) => (

                      <div
                        key={
                          skill.id
                        }
                        className="border border-gray-200 rounded-2xl p-4 flex items-center gap-3 hover:border-violet-200 hover:bg-violet-50/40 transition"
                      >

                        <div className="w-9 h-9 shrink-0 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                          ✓
                        </div>

                        <span className="font-semibold">
                          {
                            skill.name
                          }
                        </span>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mt-6">

                  <p className="text-gray-500">
                    No skills have been added yet.
                  </p>

                </div>

              )}

            </div>



            {/* REVIEWS */}

            <div className="bg-white border border-gray-200 rounded-3xl p-7">

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

                <div>

                  <p className="text-sm text-gray-400">
                    Customer feedback
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Reviews
                  </h2>

                </div>


                <div className="flex items-center gap-2">

                  <span className="text-yellow-400 text-xl">
                    ★
                  </span>

                  <span className="text-2xl font-black">

                    {averageRating > 0
                      ? averageRating.toFixed(
                          1
                        )
                      : "—"}

                  </span>

                  <span className="text-gray-400 text-sm">
                    ({reviews.length})
                  </span>

                </div>

              </div>



              {/* NO REVIEWS */}

              {reviews.length ===
              0 ? (

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center mt-6">

                  <div className="text-4xl">
                    💬
                  </div>

                  <h3 className="font-bold mt-4">
                    No reviews yet
                  </h3>

                  <p className="text-gray-500 text-sm mt-2">
                    This Helping Hand has not received any customer reviews yet.
                  </p>

                </div>

              ) : (

                /*
                  reviews এখন নিশ্চিত array,
                  তাই map safe.
                */

                <div className="space-y-4 mt-6">

                  {reviews.map(
                    (
                      review
                    ) => (

                      <ReviewCard
                        key={
                          review.id
                        }
                        review={
                          review
                        }
                      />

                    )
                  )}

                </div>

              )}

            </div>

          </div>



          {/* ======================
              RIGHT SIDEBAR
          ======================= */}

          <aside className="space-y-6">

            <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:sticky lg:top-24">

              <p className="text-sm text-gray-400">
                Quick overview
              </p>

              <h3 className="text-xl font-bold mt-1">
                Helping Hand Details
              </h3>


              <div className="space-y-5 mt-7">


                <InfoItem
                  label="Experience"
                  value={`${helper.experience_years} year${
                    helper.experience_years !==
                    1
                      ? "s"
                      : ""
                  }`}
                />


                <InfoItem
                  label="Availability"
                  value={
                    helper.availability
                  }
                />


                <InfoItem
                  label="Skills"
                  value={`${Array.isArray(
                    helper.skills
                  )
                    ? helper.skills.length
                    : 0
                  } service${
                    Array.isArray(
                      helper.skills
                    ) &&
                    helper.skills.length ===
                      1
                      ? ""
                      : "s"
                  }`}
                />


                <InfoItem
                  label="Customer Rating"
                  value={
                    averageRating >
                    0
                      ? `${averageRating.toFixed(
                          1
                        )} / 5`
                      : "Not rated yet"
                  }
                />


                <InfoItem
                  label="Reviews"
                  value={`${reviews.length}`}
                />

              </div>


              <div className="h-px bg-gray-100 my-7" />


              {/* BOOK */}

              {helper.availability ===
              "AVAILABLE" ? (

                <Link
                  href={`/book/${helper.id}`}
                  className="block w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-center py-3.5 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-violet-100"
                >
                  Book Now
                </Link>

              ) : (

                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 py-3.5 rounded-xl font-semibold cursor-not-allowed"
                >
                  Not Available
                </button>

              )}


              <Link
                href="/helpers"
                className="block w-full border border-gray-200 text-center py-3.5 rounded-xl font-semibold mt-3 hover:bg-gray-50 transition"
              >
                Browse Other Helping Hands
              </Link>


              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 mt-6">

                <p className="text-xs uppercase tracking-wider text-violet-600 font-bold">
                  DomusCare Tip
                </p>

                <p className="text-sm text-gray-600 leading-relaxed mt-2">
                  Check the Helping Hand&apos;s skills,
                  experience and customer reviews
                  before sending your booking request.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================== */}

      <footer className="bg-white border-t border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <Link
              href="/"
              className="flex items-center gap-3"
            >

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                D
              </div>

              <div>

                <p className="font-bold">
                  DomusCare
                </p>

                <p className="text-xs text-gray-400">
                  Better home services
                </p>

              </div>

            </Link>


            <div className="flex flex-wrap gap-5 text-sm text-gray-500">

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

          </div>

        </div>

      </footer>

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
    <div className="flex items-center justify-between gap-5">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-right">
        {value}
      </p>

    </div>
  );
}



function ReviewCard({
  review,
}: {
  review: Review;
}) {

  const firstName =
    review.customer
      ?.first_name ||
    "";

  const lastName =
    review.customer
      ?.last_name ||
    "";


  const customerName =
    `${firstName} ${lastName}`
      .trim() ||
    review.customer
      ?.username ||
    "DomusCare Customer";


  const safeRating =
    Math.min(
      5,
      Math.max(
        0,
        Number(
          review.rating
        ) || 0
      )
    );


  return (
    <div className="border border-gray-200 rounded-2xl p-5 hover:border-violet-200 transition">

      <div className="flex items-start justify-between gap-5">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 shrink-0 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 rounded-full flex items-center justify-center font-bold text-sm">

            {customerName
              .slice(
                0,
                1
              )
              .toUpperCase()}

          </div>


          <div>

            <p className="font-semibold">
              {customerName}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Verified Customer
            </p>

          </div>

        </div>


        <div className="text-sm whitespace-nowrap">

          <span className="text-yellow-400">
            {"★".repeat(
              safeRating
            )}
          </span>

          <span className="text-gray-200">
            {"★".repeat(
              5 -
                safeRating
            )}
          </span>

        </div>

      </div>


      {review.comment ? (

        <p className="text-gray-600 mt-4 leading-relaxed">
          {review.comment}
        </p>

      ) : (

        <p className="text-gray-400 italic mt-4 text-sm">
          No written comment.
        </p>

      )}


      {review.created_at && (

        <p className="text-xs text-gray-400 mt-4">

          {new Date(
            review.created_at
          ).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          )}

        </p>

      )}

    </div>
  );
}