import { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUserShield } from "react-icons/fa";
import "../Styles/Register.css";
import { useMyContext } from "./useMyContext";

const ROLE_OPTIONS = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
];

const Register = () => {
  const { authState } = useMyContext();
  const currentPortal = authState.roles.find((role) => role?.portal)?.portal || "";
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    roleName: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!currentPortal) {
      setError("Unable to detect the current user's portal.");
      setLoading(false);
      return;
    }

    if (!userData.roleName) {
      setError("Please select a role");
      setLoading(false);
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: userData.email.trim().toLowerCase(),
          password: userData.password,
          role: {
            portal: currentPortal,
            name: userData.roleName,
          },
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : { message: "Registration failed" };

      if (response.status === 201) {
        const createdRole = ROLE_OPTIONS.find((option) => option.value === userData.roleName);
        setSuccess(
          `Registration successful! ${data.user?.email || userData.email.trim().toLowerCase()} was added as ${createdRole?.label || "a user"} in ${currentPortal}.`
        );
        setUserData({
          email: "",
          password: "",
          confirmPassword: "",
          roleName: "",
        });
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <section className="register-shell">
        <div className="register-heading">
          <span>Admin</span>
          <h2>Register New User</h2>
          <p>Create a secure account and assign the correct access role.</p>
        </div>

        <div className="register-card">
          {success && (
            <div className="alert alert-success register-alert" role="alert">
              {success}
            </div>
          )}
          {error && (
            <div className="alert alert-danger register-alert" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3 ">
              <div className="col-12 ">
                <label htmlFor="email" className="form-label register-label ">Email address</label>
                <div className="register-input-wrap">
                  <FaEnvelope />
                  <input
                    type="email"
                    className="form-control register-input text-center"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>

              <div className="col-12">
                <label htmlFor="role" className="form-label register-label">Role</label>
                <div className="register-input-wrap ">
                  <FaUserShield />
                  <select
                    className="form-select register-input text-center"
                    id="role"
                    name="roleName"
                    value={userData.roleName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select role</option>
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} ({option.value})
                      </option>
                    ))}
                  </select>
                </div>
                <small className="text-muted d-block mt-2 text-center">
                  New users are created in the current portal: `{currentPortal || "Unavailable"}`.
                </small>
              </div>

              <div className="col-md-6">
                <label htmlFor="password" className="form-label register-label">Password</label>
                <div className="register-input-wrap">
                  <FaLock />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control register-input text-center"
                    id="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="register-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="col-md-6">
                <label htmlFor="confirmPassword" className="form-label register-label">Confirm password</label>
                <div className="register-input-wrap">
                  <FaLock />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control register-input text-center"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    className="register-toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="register-submit" disabled={loading}>
              {loading ? "Creating user..." : "Create user"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export { Register };
