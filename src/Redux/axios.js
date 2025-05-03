import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8765",
});

export default instance;