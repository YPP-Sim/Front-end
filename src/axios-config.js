import axios from "axios";
import config from "./config";
import { getAccessToken } from "./util/TokenStorage";

const { SERVER_ENDPOINT } = config;

const configOptions = {
  baseURL: SERVER_ENDPOINT,
  timeout: 5000,
  headers: {},
};

const accessToken = getAccessToken();

if (accessToken)
  configOptions.headers["Authorization"] = `Bearer ${accessToken}`;

const instance = axios.create(configOptions);

export default instance;
