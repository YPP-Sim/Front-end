import axiosAuth from "../axios-config";

export function getNewAccessToken() {
  return new Promise((resolve, reject) => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      reject("No refresh token");
      return;
    }
    axiosAuth
      .post("/auth/refresh", { refreshToken })
      .then((response) => {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        resolve(response.data.accessToken);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function clear() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export function setAccessToken(token) {
  localStorage.setItem("accessToken", token);
  axiosAuth.defaults.headers["Authorization"] = `Bearer ${token}`;
}

export function setRefreshToken(token) {
  localStorage.setItem("refreshToken", token);
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}
