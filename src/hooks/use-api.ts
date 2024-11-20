import axios from "axios";
// import { useAuth } from "./useAuth";

export function useApi() {
  //   const { token } = useAuth();
  const api = axios.create({
    baseURL: "https://nosql-trab.vercel.app",
    headers: {
      //   Authorization: `Bearer ${token}`,
    },
  });

  return api;
}
