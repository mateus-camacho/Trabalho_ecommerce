import axios from "axios";

export function useApi() {
  let url = null;

  try {
    url = process.env.API_URL;
  } catch (error) {
    console.log(error);
  }

  const api = axios.create({
    baseURL: url ?? "https://nosql-trab.vercel.app",
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });

  return api;
}
