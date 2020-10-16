import axiosConfig from "../axios-config";
import { clear, getNewAccessToken } from "./TokenStorage";

export default () => {
  axiosConfig.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status !== 401) {
        return new Promise((resolve, reject) => reject(error));
      }

      if (error.config.url === "/auth/refresh") {
        // The refresh route did not work.
        // Clears token storage
        clear();
        // Redirect user to login
        window.location.replace("/login");
        return new Promise((resolve, reject) => reject(error));
      }

      return getNewAccessToken()
        .then((token) => {
          const config = error.config;
          config.headers["Authorization"] = `Bearer ${token}`;
          console.log("Got new token");
          return new Promise((resolve, reject) => {
            axiosConfig
              .request(config)
              .then((response) => {
                resolve(response);
              })
              .catch((err) => {
                reject(err);
              });
          });
        })
        .catch((err) => {
          if (err === "No refresh token") {
            window.location.replace("/login");
          }
        });
    }
  );
};
