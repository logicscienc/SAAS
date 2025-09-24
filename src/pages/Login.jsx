import React, {useState} from 'react'
import office from "../image/office.jpg";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { setToken, setUser, setLoading } from "../slices/authSlice";
import { apiConnector } from "../services/apiConnector";
import { endpoints } from "../services/apis";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {

    const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
  e.preventDefault();
  const toastId = toast.loading("Logging in...");
  dispatch(setLoading(true));

  try {
    const response = await apiConnector("post", endpoints.LOGIN_API, {
      email,
      password,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    // Save token & user in Redux and localStorage
    dispatch(setToken(response.data.token)); // store plain token
    dispatch(setUser(response.data.user));
    localStorage.setItem("token", response.data.token); // remove JSON.stringify
    localStorage.setItem("user", JSON.stringify(response.data.user));

    toast.success("Login successful!");
    navigate("/notes"); // redirect to Notes page
  } catch (error) {
    console.log("Login error:", error);
    toast.error(error.message || "Something went wrong");
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:`url(${office})`
      }}
    >
      {/* Glassmorphic Box */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 w-full max-w-md shadow-lg text-white">
        {/* Welcome message */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Welcome!</h1>
          <p className="mt-2 text-sm text-white/80">
            Multi-tenant Notes App for Teams
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="p-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
    required
  />
  <span
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-3 top-3 z-10 cursor-pointer"
  >
    {showPassword ? (
      <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
    ) : (
      <AiOutlineEye fontSize={24} fill="#AFB2BF" />
    )}
  </span>
</div>

          <button
            type="submit"
            className="bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-xl transition"
          >
            Login
          </button>
        </form>

       
        <p className="mt-4 text-center text-white/70 text-sm">
          Use your predefined accounts to login.
        </p>
      </div>
    </div>
  )
}

export default Login
