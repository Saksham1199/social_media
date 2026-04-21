// import React, { useEffect } from "react";
// import { Routes, Route } from "react-router-dom";

// import SignupPage from "./pages/SignupPage.jsx";

// import HomePage from "./pages/home/HomePage.jsx";
// import LoginPage from "./pages/LoginPage.jsx";
// import Sidebar from "./components/common/SideBar.jsx";
// import RightPanel from "./components/common/RightPannel.jsx";
// import { Toaster } from "react-hot-toast";
// import NotificationPage from "./pages/notifications/NotificationPage.jsx";
// import ProfilePage from "./pages/profile/ProfilePage.jsx";
// import useAuthStore from "./store/auth.store.js";

// function App() {
//   const { checkAuth } = useAuthStore();

//   useEffect(() => {
//     checkAuth();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [checkAuth]); // Only run once on mount

//   return (
//     <div className="flex max-w-6xl mx-auto">
//       <Sidebar />
//       <Routes>
//         <Route path="/" element={ checkAuth ? <HomePage /> : <Navigate to="/login" />} />
//         <Route path="/signup" element={ checkAuth ? <SignupPage /> : <Navigate to="/login" />} />
//         <Route path="/login" element={ checkAuth ? <Navigate to="/" /> : <LoginPage />} />
//         <Route path="/notifications" element={ checkAuth ? <NotificationPage /> : <Navigate to="/login" />} />
//         <Route path="/profile/:username" element={ checkAuth ? <ProfilePage /> : <Navigate to="/login" />} />
//         <Route path="/profile" element={ checkAuth ? <ProfilePage /> : <Navigate to="/login" />} />
//       </Routes>
//       <RightPanel />
//       <Toaster />
//     </div>
//   );
// }

// export default App;





import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignupPage from "./pages/SignupPage.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Sidebar from "./components/common/SideBar.jsx";
import RightPanel from "./components/common/RightPannel.jsx";
import NotificationPage from "./pages/notifications/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";

import useAuthStore from "./store/auth.store.js";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);


  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
