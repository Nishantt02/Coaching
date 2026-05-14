// // import { Routes, Route } from "react-router-dom";

// // import Navbar from "./components/Navbar";

// // import Home from "./pages/Home";

// // import Login from "./pages/Login";

// // import Register from "./pages/Register";

// // import AdminDashboard from "./pages/AdminDashboard";

// // import ProtectedRoute from "./components/ProtectedRoute";


// // function App() {

// //   return (
// //     <>

// //       <Navbar />

// //       <Routes>

// //         <Route path="/" element={<Home />} />

// //         <Route path="/login" element={<Login />} />

// //         <Route path="/register" element={<Register />} />

// //         <Route
// //           path="/admin"
// //           element={
// //             <ProtectedRoute>
// //               <AdminDashboard />
// //             </ProtectedRoute>
// //           }
// //         />

// //       </Routes>

// //     </>
// //   );
// // }

// // export default App;




// import { Routes, Route, Navigate } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AdminDashboard from "./pages/AdminDashboard";
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <>
//       <Navbar />

//       <Routes>
//         {/* ── Default: redirect root → /register ── */}
//         <Route path="/" element={<Navigate to="/register" replace />} />

//         <Route path="/"     element={<Home/>} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login"    element={<Login />} />

//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* ── Catch-all: unknown routes → /register ── */}
//         <Route path="*" element={<Navigate to="/register" replace />} />
//       </Routes>
//     </>
//   );
// }

// export default App;


import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={user ? "/home" : "/register"} replace />
          }
        />

        <Route path="/home" element={<Home />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/admin" replace /> : <Register />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/admin" replace /> : <Login />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={user ? "/home" : "/register"} replace />}
        />
      </Routes>
    </>
  );
}

export default App;