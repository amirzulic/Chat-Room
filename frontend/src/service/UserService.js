import axios from "axios";

const default_url = "http://localhost:8080";

export const registerUser = async (user) => {
    return await axios.post(default_url + "/register", user);
}

export const loginUser = async (user) => {
    return await axios.post(default_url + "/login", user);
}

export const getUser = async (token) => {
    return await axios.get(default_url + "/user", {params: {token: token}});
}

export const updateUser = async (update) => {
    return await axios.post(default_url + "/update", update);
}

export const deactivateUser = async (id) => {
    return await axios.post(default_url + "/deactivate", id);
}

export const changePassword = async (passwordChange) => {
    return await axios.post(default_url + "/change-password", passwordChange);
}

export const resetPassword = async (passwordReset) => {
    return await axios.post(default_url + "/reset-password", passwordReset);
}
