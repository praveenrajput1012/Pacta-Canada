import axios from "axios";

const API = axios.create({
  baseURL: "https://pacta-canada-2.onrender.com", // ✅ live backend URL
});

export default API;
