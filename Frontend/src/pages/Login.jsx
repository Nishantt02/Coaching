import { useContext, useEffect, useState } from "react";

import api from "../services/api";

import { AuthContext } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";


const Login = () => {

  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const { data } = await api.post(
        "/user/login",
        formData
      );

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      setUser(data);

      navigate("/admin");

    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="flex justify-center mt-20">

      <form
        onSubmit={handleSubmit}
        className="w-96 border p-6 rounded"
      >

        <h1 className="text-2xl mb-5">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full mb-4"
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-4"
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value
            })
          }
        />

        <button className="bg-black text-white px-5 py-3 rounded w-full">
          Login
        </button>

      </form>

    </div>
  );
};

export default Login;