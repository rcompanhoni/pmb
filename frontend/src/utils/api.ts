import axios from "axios";

const baseURL = import.meta.env.VITE_MINI_BLOG_API_URL;
if (!baseURL) {
  throw new Error("The environment variable VITE_MINI_BLOG_API_URL is not set");
}

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
