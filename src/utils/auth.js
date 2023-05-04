import axios from "axios";
import {host} from "../settings";

export const signInWithCredentials = async (email, password) => {
  const response = await axios.post(host + '/auth/signin/credentials', {email, password})
  return response.data
}

export const signInWithToken = async (token) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  const response = await axios.post(host + '/auth/signin/token', null, config);
  return response.data
}