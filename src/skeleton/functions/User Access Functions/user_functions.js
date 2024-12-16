import { addNewUser, change_membership, change_password, delete_user, get_users, logout_user, verifyUserLogin } from "../API Calls/database_calls";
import { v4 as uuidv4 } from 'uuid';

/**
 * Signs out a user by calling the `logout_user` function.
 * 
 * @param {string} uid - The user ID of the user to be signed out.
 * @returns {Promise} - A promise that resolves with the result of the sign-out operation.
 */
export function signOutUser(uid) {
    return new Promise((resolve, reject) => {
        logout_user(uid)
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
}

/**
 * Performs user sign-in by verifying the username and password.
 * 
 * @param {string} uname - The username of the user.
 * @param {string} pass - The password of the user.
 * @returns {Promise} - A promise that resolves with the result of the sign-in operation.
 */
export function performSignIn(uname, pass) {
    return new Promise((resolve, reject) => {
        verifyUserLogin(uname, pass)
            .then(res => resolve(res))
            .catch(err => {
                console.log("Error from Login", err);
                reject(err);
            });
    });
}

/**
 * Performs user sign-up by adding a new user with the given details.
 * 
 * @param {string} name - The name of the new user.
 * @param {string} pass - The password for the new user.
 * @param {string} mem - Additional membership information.
 * @param {number} access_level - The access level of the new user.
 * @param {string} designation - The designation of the new user.
 * @param {string} email - The email address of the new user.
 * @returns {Promise} - A promise that resolves with the result of the sign-up operation.
 */
export function performUserSignUp(name, pass, mem, access_level, designation, email) {
    return new Promise((resolve, reject) => {
        addNewUser(name, pass, uuidv4(), 0, access_level, designation, email)
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
}

/**
 * Sets user variables by updating the token.
 * 
 * @param {Object} param0 - An object containing the `setToken` function.
 * @param {Object} user - The user object to be set.
 */
export function setUserVariables({ setToken }, user) {
    console.log("Set user Variables", user);
    setToken(user);
}

/**
 * Retrieves the avatar name from local storage.
 * 
 * @returns {string} - The avatar name, or "Noki Xtract" if not found.
 */
export function returnAvatarName() {
    try {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            if (userData && userData.user_id !== undefined) {
                return userData.user_id;
            }
        }
    } catch (error) {
        console.error('Error retrieving name:', error);
    }
    return "Noki Xtract";
}

/**
 * Retrieves all users by calling the `get_users` function.
 * 
 * @returns {Promise} - A promise that resolves with the list of users.
 */
export function getAllUsers() {
    return new Promise((resolve, reject) => {
        get_users()
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
}

/**
 * Changes the membership status of a user.
 * 
 * @param {Object} user - The user object containing UID, membership, and action.
 * @param {string} user.UID - The user ID of the user whose membership is to be changed.
 * @param {string} user.membership - The new membership status.
 * @param {string} user.action - The action to perform (e.g., "add" or "remove").
 * @returns {Promise} - A promise that resolves with the result of the membership change operation.
 */
export function changeUserMembership(user) {
    return new Promise((resolve, reject) => {
        change_membership({ UID: user.UID, membership: user.membership, action: user.action })
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
}

/**
 * Changes the password of a user.
 * 
 * @param {string} uname - The username of the user whose password is to be changed.
 * @param {string} pass - The new password for the user.
 * @returns {Promise} - A promise that resolves with the result of the password change operation.
 */
export function userPasswordChange(uname, pass) {
    return new Promise((resolve, reject) => {
        change_password(uname, pass)
            .then(res => {
                console.log(res);
                if (res.success) resolve(res);
                else reject(res);
            })
            .catch(err => reject(err));
    });
}

/**
 * Deletes a user by their ID.
 * 
 * @param {string} uid - The user ID of the user to be deleted.
 * @returns {Promise} - A promise that resolves with the result of the delete operation.
 */
export function deleteUser(uid) {
    return new Promise((resolve, reject) => {
        delete_user(uid)
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
}