// // src/routes/PrivateRoute.jsx
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";
// import { checkAuthAPI } from "../features/auth/authAPI";
// import { setUser } from "../features/auth/authSlice";

// export default function PrivateRoute({ children }) {
//   const dispatch = useDispatch();
//   const { user, isAuthenticated } = useSelector((state) => state.auth);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await checkAuthAPI();
//         dispatch(setUser(response.user));
//       } catch (error) {
//         console.error("Auth check failed:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // If user is not in state, try fetching from API
//     if (!user) {
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, [user, dispatch]);

//   if (loading) return <div>Loading...</div>;

//   return user ? children : <Navigate to="/login" replace />;
// }

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { checkAuthAPI } from "../features/auth/authAPI";
import { setUser } from "../features/auth/authSlice";

export default function PrivateRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Only check if user is undefined (initial load), not after logout
    const fetchUser = async () => {
      try {
        const response = await checkAuthAPI();
        dispatch(setUser(response.user));
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user === undefined) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user, dispatch]);

  // 🔁 Loading fallback
  if (loading) return <div>Loading...</div>;

  // ✅ Only allow access if user is present
  return user ? children : <Navigate to="/login" replace />;
}
