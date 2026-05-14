import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/register");
  };

  return (
    <div className="bg-black text-white px-6 py-4 flex justify-between">

      <h1 className="text-2xl font-bold">
        CoachingHub
      </h1>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/admin">Admin</Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-white underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>

    </div>
  );
};

export default Navbar;