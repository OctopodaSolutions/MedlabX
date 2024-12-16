import React, { createContext, useContext, useState } from 'react';

/**
 * Context for authentication state and methods.
 * 
 * @type {React.Context<{
*   user: Object | null,
*   login: (userData: Object) => void,
*   logout: () => void
* }>}
*/
const AuthContext = createContext(null);

/**
* Custom hook to use the AuthContext.
* 
* @returns {{
*   user: Object | null,
*   login: (userData: Object) => void,
*   logout: () => void
* }}
*/
export const useAuth = () => useContext(AuthContext);

/**
* Provider component to manage authentication state.
* 
* @param {Object} props - The component props.
* @param {React.ReactNode} props.children - The child components.
* 
* @returns {React.ReactElement} - The rendered AuthProvider component.
*/
export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 const navigate = useNavigate();

 /**
  * Logs in a user with provided data.
  * 
  * @param {Object} userData - The user data including email and password.
  * @param {string} userData.email - The email of the user.
  * @param {string} userData.password - The password of the user.
  */
 const login = (userData) => {
   // Perform login logic and set user
   try {
     verifyUserLogin(userData.email, userData.password)
       .then((res) => {
         console.log("Result from Login", res);
         try {
           const decodedToken = jwtDecode(res.data.token);
           setToken(res.data.token);
           setUser(res.data.user);
           setLogin(res);
           navigate('/dashboard');
         } catch (err) {
           console.error('Error decoding token:', err);
         }
       })
       .catch((err) => {
         console.error('Login error:', err);
       });
   } catch (err) {
     console.log(err);
     toast.error('Unauthorized Access For The User !!!', {
       position: toast.POSITION.TOP_CENTER,
       autoClose: 3000,
       className: 'custom-toast-error',
     });
   }
   setUser(userData);
 };

 /**
  * Logs out the current user.
  */
 const logout = () => {
   // Perform logout logic
   setUser(null);
 };

 return (
   <AuthContext.Provider value={{ user, login, logout }}>
     {children}
   </AuthContext.Provider>
 );
};
