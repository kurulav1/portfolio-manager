// utils/axiosConfig.js
import axios from 'axios';
import { store } from '../store'; // import your store
import { logoutUser } from '../slices/userSlice'; // import the logoutUser action

const configureAxios = () => {
  // Set up response interceptor
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid
        store.dispatch(logoutUser());
        // Optionally redirect to login page
      }
      return Promise.reject(error);
    }
  );

  // Any other Axios defaults can be set here
};

export default configureAxios;


export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
