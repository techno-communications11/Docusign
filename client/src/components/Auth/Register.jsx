import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../Styles/Register.css";

const Register = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

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

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      {success && (
        <div className="alert alert-success lite-alert" role="alert">
          {success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger lite-alert" role="alert">
          {error}
        </div>
      )}

      <section className="  mt-5 d-flex justify-content-center align-items-center m-auto">
        <div className="card lite-card ">
          <div className="card-body">
            <h2 className="card-title lite-title">Register New User</h2>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-12">
                  <label htmlFor="email" className="form-label lite-label">Email</label>
                  <input
                    type="email"
                    className="form-control lite-input"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div className="col-md-12 position-relative">
                  <label htmlFor="password" className="form-label lite-label">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control lite-input"
                    id="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="lite-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="col-md-12 position-relative">
                  <label htmlFor="confirmPassword" className="form-label lite-label">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control lite-input"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    className="lite-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn lite-btn-primary mt-3 w-100 text-white fw-bolder">
                Register
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export { Register };