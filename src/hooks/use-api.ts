import axios from "axios";
// import { useAuth } from "./useAuth";

export function useApi() {
  //   const { token } = useAuth();
  const api = axios.create({
    baseURL: process.env.API_URL || "http://localhost:3000",
    headers: {
      //   Authorization: `Bearer ${token}`,
    },
  });

  return api;
}
