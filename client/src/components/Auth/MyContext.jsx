// import { createContext, useContext, useState } from "react";

// const MyContext = createContext(null);

// export function MyProvider({ children }) {
//   const [users, setUsers] = useState([]);

//   // authState driven ONLY by /login response
//   const [authState, setAuthState] = useState({
//     isAuthenticated: false,
//     user: null, // e.g. { id, role, email, ... }
//     error: null,
//   });

//   const addUser = (newUsers) => {
//     setUsers(newUsers);
//   };

//   // userData is the full user object from /login
//   const updateAuth = (userData) => {
//     if (userData) {
//       setAuthState({
//         isAuthenticated: true,
//         user: userData,
//         error: null,
//       });
//     } else {
//       setAuthState({
//         isAuthenticated: false,
//         user: null,
//         error: null,
//       });
//     }
//   };

//   const logout = async () => {
//     try {
//       await fetch("/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//     } catch (err) {
//       console.error("Logout failed:", err);
//     } finally {
//       updateAuth(null);
//     }
//   };

//   const value = {
//     users,
//     authState,
//     addUser,
//     updateAuth,
//     logout,
//   };

//   return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
// }

// export function useMyContext() {
//   const ctx = useContext(MyContext);
//   if (!ctx) {
//     throw new Error("useMyContext must be used within MyProvider");
//   }
//   return ctx;
// }
