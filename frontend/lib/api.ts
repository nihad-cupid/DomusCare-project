const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

  async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
  providedToken?: string
) {
  let accessToken =
    providedToken ||
    localStorage.getItem("access");

  if (!accessToken) {
    accessToken =
      await getNewAccessToken();
  }

  const sendRequest = async (
    token: string
  ) => {
    const headers =
      new Headers(options.headers);

    headers.set(
      "Authorization",
      `Bearer ${token}`
    );

    return fetch(url, {
      ...options,
      headers,
    });
  };

  let response =
    await sendRequest(
      accessToken
    );

  if (response.status === 401) {
    accessToken =
      await getNewAccessToken();

    response =
      await sendRequest(
        accessToken
      );
  }

  return response;
}


/* =========================
   REFRESH ACCESS TOKEN
========================= */

async function getNewAccessToken(): Promise<string> {
  const refreshToken =
    localStorage.getItem("refresh");

  if (!refreshToken) {
    localStorage.removeItem("access");

    throw new Error(
      "Session expired. Please login again."
    );
  }

  const response = await fetch(
    `${API_URL}/api/auth/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    }
  );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (
    !response.ok ||
    !data.access
  ) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    throw new Error(
      "Session expired. Please login again."
    );
  }

  localStorage.setItem(
    "access",
    data.access
  );

  if (data.refresh) {
    localStorage.setItem(
      "refresh",
      data.refresh
    );
  }

  return data.access;
}


/* =========================
   AUTH FETCH
========================= */

async function authFetch(
  url: string,
  options: RequestInit = {},
  providedToken?: string
) {
  let accessToken =
    providedToken ||
    localStorage.getItem("access");

  if (!accessToken) {
    throw new Error(
      "Please login again."
    );
  }

  const sendRequest = async (
    token: string
  ) => {
    const headers =
      new Headers(
        options.headers
      );

    headers.set(
      "Authorization",
      `Bearer ${token}`
    );

    return fetch(
      url,
      {
        ...options,
        headers,
      }
    );
  };


  let response =
    await sendRequest(
      accessToken
    );


  if (
    response.status === 401
  ) {
    accessToken =
      await getNewAccessToken();

    response =
      await sendRequest(
        accessToken
      );
  }


  return response;
}


/* =========================
   LOGIN
========================= */

export async function loginUser(
  username: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/api/auth/login/`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Login failed"
    );
  }

  return data;
}


/* =========================
   CURRENT USER
========================= */

export async function getCurrentUser(
  accessToken: string
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/auth/me/`,
      {
        method: "GET",
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not load user"
    );
  }

  return data;
}


/* =========================
   REGISTER
========================= */

export async function registerUser(
  userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
  }
) {
  const response = await fetch(
    `${API_URL}/api/auth/register/`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        userData
      ),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    let message =
      "Registration failed";

    if (data.username) {
      message =
        data.username.join(" ");
    } else if (data.email) {
      message =
        data.email.join(" ");
    } else if (data.password) {
      message =
        data.password.join(" ");
    } else if (data.role) {
      message =
        data.role.join(" ");
    } else if (data.detail) {
      message =
        data.detail;
    }

    throw new Error(
      message
    );
  }

  return data;
}


/* =========================
   GET PROFILE
========================= */

export async function getProfile(
  accessToken: string
) {
  const response =
    await authFetch(
      `${API_URL}/api/auth/profile/`,
      {
        method: "GET",
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not load profile"
    );
  }

  return data;
}


/* =========================
   UPDATE PROFILE
========================= */

export async function updateProfile(
  accessToken: string,
  profileData: {
    user?: {
      first_name?: string;
      last_name?: string;
      email?: string;
    };

    profile?: {
      phone?: string;
      address?: string;
      experience_years?: number;
      bio?: string;
      business_name?: string;
      skills?: number[];
      availability?: string;
    };
  }
) {
  const response =
    await authFetch(
      `${API_URL}/api/auth/profile/`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          profileData
        ),
      },
      accessToken
    );


  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }


  console.log(
    "PROFILE UPDATE REQUEST:",
    profileData
  );

  console.log(
    "PROFILE UPDATE RESPONSE:",
    data
  );


  if (!response.ok) {
    const getErrorMessage = (
      value: any
    ): string => {
      if (
        typeof value === "string"
      ) {
        return value;
      }

      if (
        Array.isArray(value)
      ) {
        return value
          .map(
            getErrorMessage
          )
          .join(" ");
      }

      if (
        value &&
        typeof value === "object"
      ) {
        return Object.entries(
          value
        )
          .map(
            ([key, error]) =>
              `${key}: ${getErrorMessage(
                error
              )}`
          )
          .join(" | ");
      }

      return String(value);
    };


    throw new Error(
      getErrorMessage(data) ||
        "Could not update profile"
    );
  }


  return data;
}
export async function getServices() {
  const response = await fetch(
    `${API_URL}/api/services/`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      "Could not load services"
    );
  }

  return data;
}
export async function getAvailableHelpers(
  serviceId?: number
) {
  let url = `${API_URL}/api/auth/helpers/available/`;

  if (serviceId) {
    url += `?service=${serviceId}`;
  }

  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Could not load helpers"
    );
  }

  return data;
}
export async function getHelperDetails(
  helperId: number
) {
  const response = await fetch(
    `${API_URL}/api/auth/helpers/${helperId}/`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Could not load helper"
    );
  }

  return data;
}
export async function createBooking(
  accessToken: string,
  bookingData: {
    helper: number;
    service: number;
    booking_type: string;
    booking_date: string;
    booking_time: string;
    duration: number;
    address: string;
    instructions: string;
  }
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/bookings/`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          bookingData
        ),
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.helper?.[0] ||
        data.service?.[0] ||
        "Could not create booking"
    );
  }

  return data;
}
export async function getMyBookings(
  accessToken: string
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/bookings/my/`,
      {
        method: "GET",
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not load bookings"
    );
  }

  return data;
}


export async function cancelBooking(
  accessToken: string,
  bookingId: number
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/bookings/${bookingId}/cancel/`,
      {
        method: "PATCH",
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not cancel booking"
    );
  }

  return data;
}

export async function getHelperBookingRequests(
  accessToken: string
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/bookings/helper/requests/`,
      {
        method: "GET",
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not load requests"
    );
  }

  return data;
}


export async function updateBookingStatus(
  accessToken: string,
  bookingId: number,
  status:
    | "ACCEPTED"
    | "REJECTED"
    | "IN_PROGRESS"
    | "COMPLETED"
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/bookings/${bookingId}/status/`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          status,
        }),
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not update booking"
    );
  }

  return data;
}

export async function createReview(
  accessToken: string,
  reviewData: {
    booking: number;
    rating: number;
    comment: string;
  }
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/reviews/`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          reviewData
        ),
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message =
      data.detail ||
      data.booking?.[0] ||
      data.rating?.[0] ||
      "Could not submit review";

    throw new Error(message);
  }

  return data;
}

export async function getHelperReviews(
  helperId: number
) {
  const response = await fetch(
    `${API_URL}/api/reviews/helper/${helperId}/`
  );

  const contentType =
    response.headers.get(
      "content-type"
    );

  if (
    !contentType ||
    !contentType.includes(
      "application/json"
    )
  ) {
    const text =
      await response.text();

    console.error(
      "Review API non-JSON response:",
      text
    );

    throw new Error(
      `Could not load reviews. Backend returned ${response.status}.`
    );
  }


  const data =
    await response.json();


  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Could not load reviews."
    );
  }


  // Direct array response
  if (
    Array.isArray(data)
  ) {
    return data;
  }


  // DRF pagination
  if (
    Array.isArray(
      data.results
    )
  ) {
    return data.results;
  }


  // Custom backend response
  if (
    Array.isArray(
      data.reviews
    )
  ) {
    return data.reviews;
  }


  return [];
}


export async function getRetailerWorkers(
  accessToken: string
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/auth/retailer/workers/`,
      {
        method: "GET",
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not load Helping Hands"
    );
  }

  return data;
}


export async function assignRetailerWorker(
  accessToken: string,
  helperId: number
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/auth/retailer/workers/assign/`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          helper_id: helperId,
        }),
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.helper_id?.[0] ||
        "Could not assign Helping Hand"
    );
  }

  return data;
}



export async function removeRetailerWorker(
  accessToken: string,
  helperId: number
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/auth/retailer/workers/${helperId}/remove/`,
      {
        method: "DELETE",
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not remove Helping Hand"
    );
  }

  return data;
}


export async function getAvailableWorkersForRetailer(
  accessToken: string
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/auth/retailer/workers/available/`,
      {
        method: "GET",
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not load available Helping Hands"
    );
  }

  return data;
}
export async function getRetailers() {
  const response = await fetch(
    `${API_URL}/api/auth/retailers/`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Could not load retailers"
    );
  }

  return data;
}


async function refreshAccessToken(): Promise<string> {
  const refreshToken =
    localStorage.getItem("refresh");

  if (!refreshToken) {
    localStorage.removeItem("access");

    throw new Error(
      "Your session has expired. Please login again."
    );
  }

  const response = await fetch(
    `${API_URL}/api/auth/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    }
  );

  let data: any = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (
    !response.ok ||
    !data.access
  ) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    throw new Error(
      data.detail ||
      "Your session has expired. Please login again."
    );
  }

  localStorage.setItem(
    "access",
    data.access
  );

  // যদি backend rotated refresh token পাঠায়
  if (data.refresh) {
    localStorage.setItem(
      "refresh",
      data.refresh
    );
  }

  return data.access;
}

export async function createRetailerBooking(
  accessToken: string,
  bookingData: {
    retailer_id: number;
    service: number;
    booking_type: string;
    booking_date: string;
    booking_time: string;
    duration: number;
    address: string;
    instructions: string;
  }
) {
  const response = await authenticatedFetch(
    `${API_URL}/api/bookings/retailer/create/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    },
    accessToken
  );

  const data = await response.json();

  if (!response.ok) {
    console.log(
      "RETAILER BOOKING BACKEND ERROR:",
      data
    );

    const message =
      data.detail ||
      data.retailer_id?.[0] ||
      data.retailer?.[0] ||
      data.service?.[0] ||
      data.booking_type?.[0] ||
      data.booking_date?.[0] ||
      data.booking_time?.[0] ||
      data.duration?.[0] ||
      data.address?.[0] ||
      data.instructions?.[0] ||
      "Could not create retailer booking";

    throw new Error(message);
  }

  return data;
}


export async function getRetailerBookingRequests(
  accessToken: string
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/bookings/retailer/requests/`,
      {
        method: "GET",
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not load retailer requests"
    );
  }

  return data;
}


export async function assignBookingHelper(
  accessToken: string,
  bookingId: number,
  helperId: number
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/bookings/retailer/${bookingId}/assign/`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          helper_id: helperId,
        }),
      },
      accessToken
    );

  let data: any = {};

  try {
    data =
      await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.helper_id?.[0] ||
        "Could not assign Helping Hand"
    );
  }

  return data;
}

export async function createRetailerWorker(
  accessToken: string,
  workerData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    experience_years: number;
    bio: string;
    skills: number[];
  }
) {
  const response = await fetch(
    `${API_URL}/api/auth/retailer/workers/create/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify(
        workerData
      ),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    const message =
      data.detail ||
      data.username?.[0] ||
      data.email?.[0] ||
      data.password?.[0] ||
      "Could not create team member.";

    throw new Error(message);
  }

  return data;
}

export function isLoggedIn() {
  if (typeof window === "undefined") {
    return false;
  }

  const access =
    localStorage.getItem("access");

  const refresh =
    localStorage.getItem("refresh");

  return Boolean(access || refresh);
}

export async function getNotifications(
  accessToken: string
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/notifications/`,
      {
        method: "GET",
      },
      accessToken
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not load notifications"
    );
  }

  return data;
}


export async function getUnreadNotificationCount(
  accessToken: string
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/notifications/unread-count/`,
      {
        method: "GET",
      },
      accessToken
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not load unread count"
    );
  }

  return data;
}


export async function markNotificationRead(
  accessToken: string,
  notificationId: number
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/notifications/${notificationId}/read/`,
      {
        method: "PATCH",
      },
      accessToken
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not mark notification as read"
    );
  }

  return data;
}


export async function markAllNotificationsRead(
  accessToken: string
) {
  const response =
    await authenticatedFetch(
      `${API_URL}/api/notifications/read-all/`,
      {
        method: "PATCH",
      },
      accessToken
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Could not mark notifications as read"
    );
  }

  return data;
}