"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  createReview,
} from "@/lib/api";


export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();

  const bookingId = Number(params.id);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const accessToken =
  localStorage.getItem("access");

const refreshToken =
  localStorage.getItem("refresh");

if (
  !accessToken &&
  !refreshToken
) {
  router.push("/login");
  return;
}

const token =
  accessToken || "";

    setSubmitting(true);
    setMessage("");

    try {
      await createReview(
        token,
        {
          booking: bookingId,
          rating,
          comment,
        }
      );

      setMessage(
        "Review submitted successfully."
      );

    } catch (error) {
      if (error instanceof Error) {
        setMessage(
          error.message
        );
      }

    } finally {
      setSubmitting(false);
    }
  }


  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">

      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold">
          Rate Your Experience
        </h1>


        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >

          <div className="mb-5">

            <label className="block mb-2 font-semibold">
              Rating
            </label>

            <select
              value={rating}
              onChange={(event) =>
                setRating(
                  Number(
                    event.target.value
                  )
                )
              }
              className="w-full border p-3 rounded"
            >

              <option value={5}>
                ⭐⭐⭐⭐⭐ - Excellent
              </option>

              <option value={4}>
                ⭐⭐⭐⭐ - Good
              </option>

              <option value={3}>
                ⭐⭐⭐ - Average
              </option>

              <option value={2}>
                ⭐⭐ - Poor
              </option>

              <option value={1}>
                ⭐ - Very Poor
              </option>

            </select>

          </div>


          <div className="mb-6">

            <label className="block mb-2 font-semibold">
              Review
            </label>

            <textarea
              value={comment}
              onChange={(event) =>
                setComment(
                  event.target.value
                )
              }
              rows={5}
              placeholder="Tell us about your experience..."
              className="w-full border p-3 rounded"
            />

          </div>


          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white p-3 rounded disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : "Submit Review"}
          </button>


          {message && (
            <p className="mt-4 text-center">
              {message}
            </p>
          )}

        </form>

      </div>

    </main>
  );
}