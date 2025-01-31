import axios from 'axios';
// import { store } from '../../store/store';
import { ErrorMessage } from '../../components/UI Components/AlertMessage';
import { store } from '../../store/fallbackStore';


/**
 * Creates an instance of axios with default configuration.
 * 
 * @constant {axios.AxiosInstance} axiosInstance - The configured axios instance.
 */
export const axiosInstance = axios.create({
  // Optional: base URL of your API
  baseURL: 'https://localhost:444',
  withCredentials: true // Include credentials with cross-origin requests
});

/**
 * Interceptor to handle requests before they are sent.
 * 
 * @function
 * @param {axios.AxiosRequestConfig} config - The configuration of the request.
 * @returns {axios.AxiosRequestConfig} The updated configuration of the request.
 * @throws {Promise<Error>} If an error occurs during configuration, it will be rejected.
 */
axiosInstance.interceptors.request.use(
  config => {
    // Retrieve the token from the Redux store (or another source)
    const token = store.getState().auth.token;
    if (token) {
      console.log("Adding Interceptor token");
      config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config; // Return the updated request configuration
  },
  error => {
    // Return a rejected promise if there is an error
    return Promise.reject(error);
  }
);

/**
 * Interceptor to handle responses before they are processed.
 * 
 * @function
 * @param {axios.AxiosResponse} response - The response from the server.
 * @returns {axios.AxiosResponse} The response if no errors are present.
 * @throws {Promise<Error>} If there is an error, it will be rejected.
 */
axiosInstance.interceptors.response.use(
  (response) => response, // Return response if no errors
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      // Log the specific error
      if (status === 403) {
        console.log('Forbidden request detected: ', error.response);
        ErrorMessage(data?.message || 'Forbidden request detected.');
      } else if (status === 401) {
        console.log('Unauthorized request detected: ', error.response);
        ErrorMessage(data?.message || 'Unauthorized request detected.');
      }
      // Pass the error for further handling in the caller
      return Promise.reject(error);
    }
    // For network or other unknown errors
    ErrorMessage('Network error occurred.');
    return Promise.reject(new Error('Network error occurred.'));
  }
);