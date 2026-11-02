
"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  assignRetailerWorker,
  createRetailerWorker,
  getAvailableWorkersForRetailer,
  getServices,
} from "@/lib/api";


type Service = {
  id: number;
  name: string;
};


type Worker = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  experience_years: number;
  bio: string;
  availability: string;
  skills: Service[];
};


export default function AddHelpingHandPage() {
  const router = useRouter();

  const [mode, setMode] =
    useState<"EXISTING" | "CREATE">("EXISTING");

  const [workers, setWorkers] =
    useState<Worker[]>([]);

  const [services, setServices] =
    useState<Service[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [processingId, setProcessingId] =
    useState<number | null>(null);

  const [submitting, setSubmitting] =
    useState(false);


  /* CREATE TEAM MATE FORM */

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

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [experienceYears, setExperienceYears] =
    useState(0);

  const [bio, setBio] =
    useState("");

  const [selectedSkills, setSelectedSkills] =
    useState<number[]>([]);


  useEffect(() => {
    loadData();
  }, []);


  async function loadData() {
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

    try {
      const [
        workerData,
        serviceData,
      ] = await Promise.all([
        getAvailableWorkersForRetailer(token),
        getServices(),
      ]);

      setWorkers(workerData);
      setServices(serviceData);

    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Could not load page data."
        );
      }

    } finally {
      setLoading(false);
    }
  }


  /* ================================
     ADD EXISTING HELPER
  ================================= */

  async function handleAddExisting(
    helperId: number
  ) {
    const token =
      localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return;
    }

    setProcessingId(helperId);
    setMessage("");
    setSuccessMessage("");

    try {
      await assignRetailerWorker(
        token,
        helperId
      );

      setWorkers((current) =>
        current.filter(
          (worker) =>
            worker.id !== helperId
        )
      );

      setSuccessMessage(
        "Helping Hand added to your team successfully."
      );

    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Could not add Helping Hand."
        );
      }

    } finally {
      setProcessingId(null);
    }
  }


  /* ================================
     SKILL SELECT
  ================================= */

  function toggleSkill(
    serviceId: number
  ) {
    setSelectedSkills(
      (current) =>
        current.includes(serviceId)
          ? current.filter(
              (id) =>
                id !== serviceId
            )
          : [
              ...current,
              serviceId,
            ]
    );
  }


  /* ================================
     CREATE NEW TEAM MATE
  ================================= */

  async function handleCreateTeamMate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token =
      localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return;
    }

    if (selectedSkills.length === 0) {
      setMessage(
        "Please select at least one skill."
      );
      return;
    }

    setSubmitting(true);
    setMessage("");
    setSuccessMessage("");

    try {
      await createRetailerWorker(
        token,
        {
          username,
          email,
          password,

          first_name:
            firstName,

          last_name:
            lastName,

          phone,
          address,

          experience_years:
            experienceYears,

          bio,

          skills:
            selectedSkills,
        }
      );

      setSuccessMessage(
        "Team Mate created and added to your team successfully."
      );


      /* RESET FORM */

      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setPhone("");
      setAddress("");
      setExperienceYears(0);
      setBio("");
      setSelectedSkills([]);


      setTimeout(() => {
        router.push(
          "/retailer/workers"
        );
      }, 700);

    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Could not create Team Mate."
        );
      }

    } finally {
      setSubmitting(false);
    }
  }


  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
        <p>
          Loading Helping Hands...
        </p>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8 text-black">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-3xl font-bold">
              Add Helping Hand
            </h1>

            <p className="text-gray-600 mt-2">
              Add an existing Helper or create
              a new Team Mate for your Retailer.
            </p>

          </div>


          <div className="flex gap-3">

            <button
              onClick={() =>
                router.push(
                  "/retailer/workers"
                )
              }
              className="bg-black text-white px-5 py-2 rounded-lg"
            >
              My Team
            </button>


            <button
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="bg-gray-200 px-5 py-2 rounded-lg"
            >
              Dashboard
            </button>

          </div>

        </div>


        {/* ERROR */}

        {message && (

          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {message}
          </div>

        )}


        {/* SUCCESS */}

        {successMessage && (

          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl">
            {successMessage}
          </div>

        )}


        {/* MODE BUTTONS */}

        <div className="bg-white rounded-2xl shadow p-4 mb-8">

          <div className="grid md:grid-cols-2 gap-3">

            <button
              onClick={() =>
                setMode("EXISTING")
              }
              className={`p-4 rounded-xl font-semibold ${
                mode === "EXISTING"
                  ? "bg-black text-white"
                  : "bg-gray-100"
              }`}
            >
              Add Existing Helper
            </button>


            <button
              onClick={() =>
                setMode("CREATE")
              }
              className={`p-4 rounded-xl font-semibold ${
                mode === "CREATE"
                  ? "bg-black text-white"
                  : "bg-gray-100"
              }`}
            >
              Create New Team Mate
            </button>

          </div>

        </div>


        {/* ==================================
            EXISTING HELPER SECTION
        ================================== */}

        {mode === "EXISTING" && (

          <section>

            <div className="mb-6">

              <h2 className="text-2xl font-bold">
                Available Helping Hands
              </h2>

              <p className="text-gray-600 mt-1">
                Add an existing Personal Helping Hand
                to your Retailer team.
              </p>

            </div>


            {workers.length === 0 ? (

              <div className="bg-white p-10 rounded-2xl shadow text-center">

                <h3 className="text-xl font-semibold">
                  No Available Helping Hand
                </h3>

                <p className="text-gray-600 mt-2">
                  There are currently no Personal
                  Helping Hands available.
                </p>


                <button
                  onClick={() =>
                    setMode("CREATE")
                  }
                  className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
                >
                  Create New Team Mate
                </button>

              </div>

            ) : (

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {workers.map(
                  (worker) => {

                    const fullName =
                      `${worker.first_name} ${worker.last_name}`.trim();

                    const isProcessing =
                      processingId ===
                      worker.id;


                    return (

                      <div
                        key={worker.id}
                        className="bg-white p-6 rounded-2xl shadow"
                      >

                        <h3 className="text-xl font-bold">
                          {fullName ||
                            worker.username}
                        </h3>

                        <p className="text-gray-500 text-sm">
                          @{worker.username}
                        </p>


                        <div className="mt-4">

                          <p className="text-sm text-gray-500">
                            Experience
                          </p>

                          <p>
                            {
                              worker.experience_years
                            }{" "}
                            year(s)
                          </p>

                        </div>


                        <div className="mt-4">

                          <p className="text-sm text-gray-500 mb-2">
                            Skills
                          </p>


                          {worker.skills.length >
                          0 ? (

                            <div className="flex flex-wrap gap-2">

                              {worker.skills.map(
                                (skill) => (

                                  <span
                                    key={skill.id}
                                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                                  >
                                    {skill.name}
                                  </span>

                                )
                              )}

                            </div>

                          ) : (

                            <p className="text-gray-500 text-sm">
                              No skills
                            </p>

                          )}

                        </div>


                        <button
                          disabled={
                            isProcessing
                          }
                          onClick={() =>
                            handleAddExisting(
                              worker.id
                            )
                          }
                          className="w-full mt-6 bg-black text-white p-3 rounded-lg disabled:opacity-50"
                        >
                          {isProcessing
                            ? "Adding..."
                            : "Add to My Team"}
                        </button>

                      </div>

                    );
                  }
                )}

              </div>

            )}

          </section>

        )}


        {/* ==================================
            CREATE NEW TEAM MATE FORM
        ================================== */}

        {mode === "CREATE" && (

          <section className="bg-white rounded-2xl shadow p-6 md:p-8">

            <h2 className="text-2xl font-bold">
              Create New Team Mate
            </h2>

            <p className="text-gray-600 mt-2">
              Create a new Helping Hand account.
              The account will automatically
              belong to your Retailer team.
            </p>


            <form
              onSubmit={
                handleCreateTeamMate
              }
              className="mt-8 space-y-6"
            >

              {/* NAME */}

              <div className="grid md:grid-cols-2 gap-4">

                <div>

                  <label className="block font-semibold mb-2">
                    First Name
                  </label>

                  <input
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(
                        e.target.value
                      )
                    }
                    className="w-full border p-3 rounded-lg"
                  />

                </div>


                <div>

                  <label className="block font-semibold mb-2">
                    Last Name
                  </label>

                  <input
                    value={lastName}
                    onChange={(e) =>
                      setLastName(
                        e.target.value
                      )
                    }
                    className="w-full border p-3 rounded-lg"
                  />

                </div>

              </div>


              {/* USERNAME */}

              <div>

                <label className="block font-semibold mb-2">
                  Username
                </label>

                <input
                  required
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }
                  className="w-full border p-3 rounded-lg"
                />

              </div>


              {/* EMAIL */}

              <div>

                <label className="block font-semibold mb-2">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full border p-3 rounded-lg"
                />

              </div>


              {/* PASSWORD */}

              <div>

                <label className="block font-semibold mb-2">
                  Temporary Password
                </label>

                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full border p-3 rounded-lg"
                />

                <p className="text-sm text-gray-500 mt-2">
                  Give this username and password
                  to the Team Mate so they can
                  log in.
                </p>

              </div>


              {/* PHONE + EXPERIENCE */}

              <div className="grid md:grid-cols-2 gap-4">

                <div>

                  <label className="block font-semibold mb-2">
                    Phone
                  </label>

                  <input
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    className="w-full border p-3 rounded-lg"
                  />

                </div>


                <div>

                  <label className="block font-semibold mb-2">
                    Experience Years
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={experienceYears}
                    onChange={(e) =>
                      setExperienceYears(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full border p-3 rounded-lg"
                  />

                </div>

              </div>


              {/* ADDRESS */}

              <div>

                <label className="block font-semibold mb-2">
                  Address
                </label>

                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  className="w-full border p-3 rounded-lg"
                />

              </div>


              {/* BIO */}

              <div>

                <label className="block font-semibold mb-2">
                  Bio
                </label>

                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) =>
                    setBio(
                      e.target.value
                    )
                  }
                  className="w-full border p-3 rounded-lg"
                />

              </div>


              {/* SKILLS */}

              <div>

                <label className="block font-semibold mb-3">
                  Skills
                </label>


                <div className="grid sm:grid-cols-2 gap-3">

                  {services.map(
                    (service) => (

                      <label
                        key={service.id}
                        className="border p-4 rounded-lg flex items-center gap-3 cursor-pointer"
                      >

                        <input
                          type="checkbox"
                          checked={
                            selectedSkills.includes(
                              service.id
                            )
                          }
                          onChange={() =>
                            toggleSkill(
                              service.id
                            )
                          }
                        />

                        <span>
                          {service.name}
                        </span>

                      </label>

                    )
                  )}

                </div>

              </div>


              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white p-3 rounded-lg disabled:opacity-50"
              >
                {submitting
                  ? "Creating..."
                  : "Create Team Mate"}
              </button>

            </form>

          </section>

        )}

      </div>

    </main>
  );
}
