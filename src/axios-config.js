import axios from "axios";
import config from "./config";

console.log("Config: ", config);
const { SERVER_ENDPOINT } = config;

const instance = axios.create({
  baseURL: SERVER_ENDPOINT,
  timeout: 5000,
});

export default instance;
