import axios from "axios";
import { SERVER_ENDPOINT } from "./config";

const instance = axios.create({
  baseURL: SERVER_ENDPOINT,
  timeout: 5000,
});

export default instance;
