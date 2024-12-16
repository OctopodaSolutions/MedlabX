import { ErrorMessage } from "../../components/UI Components/AlertMessage";
import { clearToken, clearUser } from "../../store/userSlice";

import { signOutUser } from "./user_functions";

/**
 * Logs out the user by signing out and clearing user and token data from the state.
 * 
 * @param {Object} user - The user object representing the user to be signed out.
 * @param {Function} dispatch - The dispatch function from the Redux store used to dispatch actions.
 * @returns {Promise<void>} A promise that resolves when the user is successfully logged out or rejects if an error occurs.
 * 
 * @throws {Error} Throws an error if the sign-out process fails or if an error occurs during logout.
 */
export const logout = async (user, dispatch) => {
  return new Promise(async (resolve, reject) => {
      try {
          await signOutUser(user).then(() => {
              dispatch(clearUser());
              dispatch(clearToken());
              // navigate('/signin', { replace: true });
              // onNavigate();
              resolve();
          }).catch((err) => {
              ErrorMessage(err);
              reject();
          });  // Your API call to sign out the user

      } catch (err) {
          console.error(`Error logging out: ${err}`);
          reject();
      }
  });
};

  