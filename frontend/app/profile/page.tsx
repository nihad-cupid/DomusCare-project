"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  getProfile,
  updateProfile,
  getServices,
} from "@/lib/api";
import NotificationBell from "@/components/NotificationBell";

type Service = {
  id: number;
  name: string;
};

type Skill = {
  id: number;
  name: string;
};


type ProfileData = {
  id?: number;

  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;

  role?: string;

  user?: {
    id?: number;
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: string;
  };

  profile?: {
    phone?: string;
    address?: string;

    experience_years?: number;
    bio?: string;

    business_name?: string;

    availability?: string;

    is_verified?: boolean;

    skills?: Skill[];

    work_model?: string;
  };
};


export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [
    experienceYears,
    setExperienceYears,
  ] = useState(0);

  const [
    businessName,
    setBusinessName,
  ] = useState("");

  const [
    availability,
    setAvailability,
  ] = useState("AVAILABLE");

  const [services, setServices] =
    useState<Service[]>([]);

  const [
    selectedSkills,
    setSelectedSkills,
  ] = useState<number[]>([]);


  useEffect(() => {
    async function loadProfile() {
      try {
        setMessage("");

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

        const data =
  await getProfile(
    accessToken || ""
  );

        setProfile(data);

        setFirstName(
          data.first_name ??
            data.user?.first_name ??
            ""
        );

        setLastName(
          data.last_name ??
            data.user?.last_name ??
            ""
        );

        setEmail(
          data.email ??
            data.user?.email ??
            ""
        );

        const profileDetails =
          data.profile ?? {};

        setPhone(
          profileDetails.phone ?? ""
        );

        setAddress(
          profileDetails.address ?? ""
        );

        setBio(
          profileDetails.bio ?? ""
        );

        setExperienceYears(
          Number(
            profileDetails.experience_years ??
              0
          )
        );

        setBusinessName(
          profileDetails.business_name ??
            ""
        );

        setAvailability(
          profileDetails.availability ??
            "AVAILABLE"
        );


        // Load existing helper skills
       setSelectedSkills(
  getSkillIds(
    profileDetails.skills ?? []
  )
);


        // Load all available services
        const serviceData =
          await getServices();

        setServices(
          serviceData
        );

      } catch (error) {
        if (
          error instanceof Error
        ) {
          setMessage(
            error.message
          );
        } else {
          setMessage(
            "Could not load profile."
          );
        }

      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);


  const role =
    profile?.role ??
    profile?.user?.role ??
    "CUSTOMER";


  const details =
    profile?.profile ?? {};


  const username =
    profile?.username ??
    profile?.user?.username ??
    "User";


  const fullName =
    `${firstName} ${lastName}`
      .trim() ||
    username;


  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map(
        (word: string) =>
          word[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();


  const skills =
  services.filter(
    (service) =>
      selectedSkills.includes(
        Number(service.id)
      )
  );


  const isVerified =
    Boolean(
      details.is_verified
    );


  const roleLabel =
    useMemo(() => {
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

      if (
        role === "ADMIN"
      ) {
        return "Administrator";
      }

      return "Customer";
    }, [role]);


  async function handleSave(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setSuccess("");

      const accessToken =
        localStorage.getItem(
          "access"
        );

      if (!accessToken) {
        router.push("/login");
        return;
      }


      const profilePayload:
        Record<
          string,
          string | number | number[]
        > = {
          phone,
          address,
        };


      if (
        role === "HELPER"
      ) {
        profilePayload.bio =
          bio;

        profilePayload.experience_years =
          experienceYears;

        profilePayload.availability =
          availability;

        const validSkillIds =
  selectedSkills.filter(
    (id) =>
      Number.isInteger(id) &&
      id > 0
  );

profilePayload.skills =
  validSkillIds;
      }


      if (
        role === "RETAILER"
      ) {
        profilePayload.business_name =
          businessName;
      }


      await updateProfile(
  accessToken,
  {
    user: {
      first_name: firstName,
      last_name: lastName,
      email,
    },

    profile:
      profilePayload,
  }
);


// SAVE করার পর fresh profile আবার load করব
const freshProfile =
  await getProfile(
    accessToken
  );

setProfile(
  freshProfile
);


const freshDetails =
  freshProfile.profile ?? {};


// Backend থেকে saved skills আবার নিয়ে আসবে

const freshSkillIds =
  getSkillIds(
    freshDetails.skills ?? []
  );

setSelectedSkills(
  freshSkillIds
);

// Other fields sync
setPhone(
  freshDetails.phone ?? ""
);

setAddress(
  freshDetails.address ?? ""
);

setBio(
  freshDetails.bio ?? ""
);

setExperienceYears(
  Number(
    freshDetails.experience_years ??
      0
  )
);

setAvailability(
  freshDetails.availability ??
    "AVAILABLE"
);


setSuccess(
  "Profile updated successfully."
);


      setSuccess(
        "Profile updated successfully."
      );

    } catch (error) {
      if (
        error instanceof Error
      ) {
        setMessage(
          error.message
        );
      } else {
        setMessage(
          "Could not update profile."
        );
      }

    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500 font-medium">
            Loading your profile...
          </p>

        </div>

      </main>
    );
  }


  if (!profile) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] flex items-center justify-center px-6">

        <div className="bg-white border border-gray-200 rounded-3xl p-10 max-w-lg w-full text-center">

          <div className="text-5xl">
            👤
          </div>

          <h1 className="text-2xl font-black mt-5">
            Profile unavailable
          </h1>

          <p className="text-gray-500 mt-2">
            {message ||
              "Could not load your profile."}
          </p>

          <Link
            href="/dashboard"
            className="inline-flex mt-6 bg-gray-950 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Dashboard
          </Link>

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
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black">
        D
      </div>

      <span className="text-xl font-black">
        DomusCare
      </span>
    </Link>


    <div className="flex items-center gap-3">

      {/* NOTIFICATION BELL */}
      <NotificationBell />

      <Link
        href="/dashboard"
        className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold hover:bg-gray-50 transition"
      >
        Dashboard
      </Link>

      <Link
        href="/bookings"
        className="hidden sm:inline-flex px-4 py-2.5 rounded-xl bg-gray-950 text-white text-sm font-semibold hover:bg-gray-800 transition"
      >
        My Bookings
      </Link>

    </div>

  </div>

</nav>


      <section className="relative overflow-hidden">

        <div className="absolute -top-40 -left-32 w-[420px] h-[420px] bg-violet-300/25 rounded-full blur-3xl" />

        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-indigo-300/20 rounded-full blur-3xl" />


        <div className="relative max-w-7xl mx-auto px-6 py-12">

          {/* PROFILE HEADER */}

          <div className="relative overflow-hidden rounded-[32px] bg-gray-950 text-white p-8 md:p-10">

            <div className="absolute -top-28 -right-20 w-80 h-80 bg-violet-600/30 rounded-full blur-3xl" />

            <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />


            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

              <div className="flex flex-col sm:flex-row sm:items-center gap-6">

                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl font-black shadow-2xl shadow-violet-950/40">
                  {initials}
                </div>


                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/10 text-violet-200">
                      {roleLabel}
                    </span>

                    {(role ===
                      "HELPER" ||
                      role ===
                        "RETAILER") && (
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                          isVerified
                            ? "bg-green-500/10 text-green-300 border-green-400/20"
                            : "bg-amber-500/10 text-amber-300 border-amber-400/20"
                        }`}
                      >
                        {isVerified
                          ? "✓ Verified"
                          : "Verification Pending"}
                      </span>
                    )}

                  </div>


                  <h1 className="text-3xl md:text-4xl font-black mt-4">
                    {fullName}
                  </h1>

                  <p className="text-gray-400 mt-2">
                    @{username}
                  </p>

                  {email && (
                    <p className="text-gray-400 text-sm mt-1">
                      {email}
                    </p>
                  )}

                </div>

              </div>


              {role ===
                "HELPER" && (

                <div className="grid grid-cols-2 gap-3 min-w-[260px]">

                  <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-4">

                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Experience
                    </p>

                    <p className="text-2xl font-black mt-2">
                      {experienceYears}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Years
                    </p>

                  </div>


                  <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-4">

                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Status
                    </p>

                    <p className="font-black mt-2 text-green-300">
                      {availability}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Availability
                    </p>

                  </div>

                </div>

              )}

            </div>

          </div>


          {/* MESSAGES */}

          {message && (

            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
              {message}
            </div>

          )}


          {success && (

            <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl">
              ✓ {success}
            </div>

          )}


          <div className="grid lg:grid-cols-[1fr_340px] gap-8 mt-8">

            {/* FORM */}

            <form
              onSubmit={handleSave}
              className="space-y-6"
            >

              {/* PERSONAL INFORMATION */}

              <section className="bg-white border border-gray-200 rounded-[28px] p-6 md:p-8 shadow-sm">

                <div className="flex items-start justify-between gap-4 mb-7">

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-violet-600 font-bold">
                      Profile
                    </p>

                    <h2 className="text-2xl font-black mt-2">
                      Personal Information
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Keep your personal information up to date.
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
                    👤
                  </div>

                </div>


                <div className="grid md:grid-cols-2 gap-5">

                  <Field
                    label="First Name"
                    value={firstName}
                    onChange={
                      setFirstName
                    }
                    placeholder="First name"
                  />

                  <Field
                    label="Last Name"
                    value={lastName}
                    onChange={
                      setLastName
                    }
                    placeholder="Last name"
                  />

                  <Field
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={
                      setEmail
                    }
                    placeholder="Email"
                  />

                  <Field
                    label="Phone Number"
                    value={phone}
                    onChange={
                      setPhone
                    }
                    placeholder="Phone number"
                  />

                </div>


                <div className="mt-5">

                  <label className="text-sm font-bold text-gray-700">
                    Address
                  </label>

                  <textarea
                    value={address}
                    onChange={(event) =>
                      setAddress(
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Your address"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition resize-none"
                  />

                </div>

              </section>


             {/* HELPER FIELDS */}

{role === "HELPER" && (

  <section className="bg-white border border-gray-200 rounded-[28px] p-6 md:p-8 shadow-sm">

    <div className="flex items-start justify-between gap-4 mb-7">

      <div>

        <p className="text-xs uppercase tracking-[0.2em] text-violet-600 font-bold">
          Helping Hand
        </p>

        <h2 className="text-2xl font-black mt-2">
          Professional Details
        </h2>

        <p className="text-gray-500 mt-2">
          Manage your work information,
          availability and service skills.
        </p>

      </div>

      <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
        🧰
      </div>

    </div>


    {/* EXPERIENCE + AVAILABILITY */}

    <div className="grid md:grid-cols-2 gap-5">

      <div>

        <label className="text-sm font-bold text-gray-700">
          Experience
        </label>

        <input
          type="number"
          min={0}
          value={experienceYears}
          onChange={(event) =>
            setExperienceYears(
              Number(
                event.target.value
              )
            )
          }
          className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition"
        />

        <p className="text-xs text-gray-400 mt-2">
          Number of years you have worked
          as a Helping Hand.
        </p>

      </div>


      <div>

        <label className="text-sm font-bold text-gray-700">
          Availability
        </label>

        <select
          value={availability}
          onChange={(event) =>
            setAvailability(
              event.target.value
            )
          }
          className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition"
        >

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

        <p className="text-xs text-gray-400 mt-2">
          Customers can see your current
          work availability.
        </p>

      </div>

    </div>


    {/* BIO */}

    <div className="mt-6">

      <label className="text-sm font-bold text-gray-700">
        Bio
      </label>

      <textarea
        value={bio}
        onChange={(event) =>
          setBio(
            event.target.value
          )
        }
        rows={5}
        placeholder="Tell customers about your experience, work style and expertise..."
        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition resize-none"
      />

    </div>


   {/* SKILLS */}

<div className="mt-7 pt-7 border-t border-gray-100">

  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

    <div>
      <label className="text-sm font-bold text-gray-700">
        Service Skills
      </label>

      <p className="text-sm text-gray-400 mt-1">
        Select the services you can provide.
      </p>
    </div>

    <span className="w-fit text-xs font-bold text-violet-700 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full">
      {selectedSkills.length} selected
    </span>

  </div>


  {/* AVAILABLE SKILLS */}

  {services.filter(
    (service) =>
      !selectedSkills.includes(
        Number(service.id)
      )
  ).length > 0 ? (

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">

      {services
        .filter(
          (service) =>
            !selectedSkills.includes(
              Number(service.id)
            )
        )
        .map(
          (service) => {

            const serviceId =
              Number(service.id);

            if (
              !Number.isInteger(serviceId) ||
              serviceId <= 0
            ) {
              return null;
            }

            return (
              <button
                key={serviceId}
                type="button"
                onClick={() =>
                  setSelectedSkills(
                    (current) => [
                      ...current,
                      serviceId,
                    ]
                  )
                }
                className="group flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-left transition-all hover:bg-violet-50 hover:border-violet-200"
              >

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                    🛠️
                  </div>

                  <span className="font-semibold text-sm text-gray-700">
                    {service.name}
                  </span>

                </div>

                <span className="w-7 h-7 shrink-0 rounded-lg bg-white border border-gray-200 text-violet-600 flex items-center justify-center text-sm font-black group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition">
                  +
                </span>

              </button>
            );
          }
        )}

    </div>

  ) : (

    <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">

      <p className="font-semibold text-green-700">
        ✓ All available skills selected
      </p>

      <p className="text-sm text-green-600 mt-1">
        You have added all available services.
      </p>

    </div>

  )}


  {/* SELECTED SKILLS */}

  {selectedSkills.length > 0 && (

    <div className="mt-6 rounded-2xl bg-violet-50 border border-violet-100 p-5">

      <p className="text-xs uppercase tracking-wider font-bold text-violet-600">
        Selected Skills
      </p>

      <p className="text-sm text-violet-500 mt-1">
        These skills will appear on your profile after saving.
      </p>


      <div className="flex flex-wrap gap-2 mt-4">

        {services
          .filter(
            (service) =>
              selectedSkills.includes(
                Number(service.id)
              )
          )
          .map(
            (service) => {

              const serviceId =
                Number(service.id);

              if (
                !Number.isInteger(serviceId) ||
                serviceId <= 0
              ) {
                return null;
              }

              return (
                <span
                  key={serviceId}
                  className="inline-flex items-center gap-2 bg-white border border-violet-100 text-violet-700 px-3 py-2 rounded-full text-xs font-bold"
                >

                  {service.name}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedSkills(
                        (current) =>
                          current.filter(
                            (id) =>
                              id !== serviceId
                          )
                      )
                    }
                    className="w-5 h-5 rounded-full bg-violet-100 text-violet-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition"
                    title="Remove skill"
                  >
                    ×
                  </button>

                </span>
              );
            }
          )}

      </div>

    </div>

  )}

</div>

</section>

)}

              {/* RETAILER FIELDS */}

              {role ===
                "RETAILER" && (

                <section className="bg-white border border-gray-200 rounded-[28px] p-6 md:p-8 shadow-sm">

                  <div className="flex items-start justify-between gap-4 mb-7">

                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-violet-600 font-bold">
                        Retailer
                      </p>

                      <h2 className="text-2xl font-black mt-2">
                        Business Information
                      </h2>

                      <p className="text-gray-500 mt-2">
                        Keep your retailer information accurate.
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
                      🏢
                    </div>

                  </div>


                  <Field
                    label="Business Name"
                    value={businessName}
                    onChange={
                      setBusinessName
                    }
                    placeholder="Business name"
                  />

                </section>

              )}


              {/* SAVE */}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">

                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 rounded-xl border border-gray-200 bg-white font-bold text-center hover:bg-gray-50 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-violet-200 hover:opacity-90 transition disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>


            {/* RIGHT SIDEBAR */}

            <aside className="space-y-6">

              <div className="bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm">

                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                  Account
                </p>

                <h3 className="text-xl font-black mt-2">
                  Profile Summary
                </h3>


                <div className="mt-6 space-y-4">

                  <SummaryItem
                    label="Username"
                    value={`@${username}`}
                  />

                  <SummaryItem
                    label="Role"
                    value={
                      roleLabel
                    }
                  />

                  <SummaryItem
                    label="Status"
                    value={
                      isVerified
                        ? "Verified"
                        : role ===
                            "CUSTOMER"
                        ? "Active"
                        : "Pending"
                    }
                  />

                  {details.work_model && (
                    <SummaryItem
                      label="Work Model"
                      value={
                        details.work_model
                      }
                    />
                  )}

                </div>

              </div>


              {role === "HELPER" && (

                <div className="bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm">

                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                    Skills
                  </p>

                  <h3 className="text-xl font-black mt-2">
                    Your Expertise
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-5">

                    {skills.length >
                    0 ? (

                      skills.map(
                        (skill) => (

                          <span
                            key={
                              skill.id
                            }
                            className="bg-violet-50 text-violet-700 border border-violet-100 rounded-full px-3 py-1.5 text-xs font-bold"
                          >
                            {skill.name}
                          </span>

                        )
                      )

                    ) : (

                      <p className="text-sm text-gray-400">
                        No skills added yet.
                      </p>

                    )}

                  </div>

                </div>

              )}


              <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[28px] p-6 text-white shadow-xl shadow-violet-100">

                <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                  🔒
                </div>

                <h3 className="text-xl font-black mt-5">
                  Account Security
                </h3>

                <p className="text-violet-100 text-sm leading-relaxed mt-2">
                  Keep your password private and update it regularly.
                </p>

                <Link
                  href="/dashboard"
                  className="inline-flex mt-5 bg-white text-violet-700 px-4 py-2.5 rounded-xl text-sm font-bold"
                >
                  Back to Dashboard
                </Link>

              </div>

            </aside>

          </div>

        </div>

      </section>

    </main>
  );
}

function getSkillIds(
  skills: (Skill | number)[] = []
): number[] {
  return skills
    .map((skill) => {
      if (typeof skill === "number") {
        return skill;
      }

      return Number(skill.id);
    })
    .filter(
      (id) =>
        Number.isInteger(id) &&
        id > 0
    );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange:
    (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>

      <label className="text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition"
      />

    </div>
  );
}


function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">

      <span className="text-sm text-gray-400">
        {label}
      </span>

      <span className="text-sm font-bold text-gray-800 text-right">
        {value}
      </span>

    </div>
  );
}