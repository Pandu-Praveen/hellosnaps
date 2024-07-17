import axios, { AxiosError, type AxiosResponse } from "axios";
import { PUBLIC_SERVER_BASE_URL } from "$env/static/public";
import { refresh } from "./auth";

let firstTime = false;

const handleSuccess = (response: AxiosResponse) => {
	return response;
};

const handleFailure = (response: AxiosError) => {
	if (response.response?.status === 401 && !firstTime) {
		refresh();
		firstTime = true;
	}
	return response;
};

const api = axios.create({
	baseURL: PUBLIC_SERVER_BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json"
	}
});

api.interceptors.response.use(handleSuccess, handleFailure);

export default api;
