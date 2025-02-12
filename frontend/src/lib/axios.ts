import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 401) {
			// Handle unauthorized
			window.location.href = "/";
		}
		return Promise.reject(error);
	}
);
