import { useContext, useEffect, useState } from "react";

import api from "../services/api";

import { AuthContext } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";


const Register = () => {

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await api.post(
        "/user/register",
        formData
      );

      navigate("/login");

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
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="border p-3 w-full mb-4"
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value
            })
          }
        />

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
          Register
        </button>

      </form>

    </div>
  );
};

export default Register;