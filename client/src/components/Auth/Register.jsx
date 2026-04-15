import { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUserShield } from "react-icons/fa";
import "../Styles/Register.css";

const Register = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
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

    if (!userData.role) {
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
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess("Registration successful! User added.");
        setUserData({
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
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
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="" >Select role</option>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
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
