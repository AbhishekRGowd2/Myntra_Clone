import axios from "axios";

const API = axios.create({
  baseURL: "https://myntra-clone-ulcv.onrender.com/api", // your backend URL
});

export default API;
