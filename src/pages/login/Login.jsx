import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const { email, password } = form;

  //   if (!email || !password) {
  //     setFormError("All fields are required.");
  //     return;
  //   }

  //   try {
  //     const response = await dispatch(loginUser({ email, password })).unwrap();

  //     // Save token (optional)
  //     localStorage.setItem("auth-token", response.token);

  //     // Navigate to dashboard based on role (defaulting to admin)
  //     const role = (response.user?.role || "admin").toLowerCase();
  //     navigate(`/${role}/dashboard`);
  //   } catch (err) {
  //     console.log("Login error:", err);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = form;

    if (!email || !password) {
      setFormError("All fields are required.");
      return;
    }

    try {
      const response = await dispatch(loginUser({ email, password })).unwrap();
      console.log("Notification login");

      // Optional: store token
      localStorage.setItem("auth-token", response.token);

      // 🔥 FIXED: lowercase role
      const role = (response.user?.role || "admin").toLowerCase();
      navigate(`/${role}/dashboard`);
    } catch (err) {
      console.log("Login error:", err);
    }
  };
  const user = useSelector((state) => state.auth.user);

  console.log(user);
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-blue-600 text-center">
          EdgeProp Login
        </h2>

        {/* Local form validation error */}
        {formError && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded">
            {formError}
          </div>
        )}

        {/* API error */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Email / Username</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            className="w-full border px-4 py-2 rounded focus:outline-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="w-full border px-4 py-2 rounded focus:outline-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
