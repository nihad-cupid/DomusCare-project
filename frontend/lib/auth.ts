export function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access");
}


export function getStoredRefreshToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("refresh");
}


export function hasLoginSession() {
  if (typeof window === "undefined") {
    return false;
  }

  const access =
    localStorage.getItem("access");

  const refresh =
    localStorage.getItem("refresh");

  return Boolean(access || refresh);
}


export function logoutUser() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}