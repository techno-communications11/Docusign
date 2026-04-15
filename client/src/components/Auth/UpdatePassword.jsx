import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { motion as Motion } from 'framer-motion';
import axios from 'axios';

const UpdatePassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/reset-password', {
        token,
        newPassword: password,
      });

      if (response.status === 200) {
        setSuccess('Password reset successfully!');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.response?.data || err.message || 'Password reset failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="container-fluid min-vh-100 d-flex flex-column justify-content-center position-relative"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f3e7e9 100%)',
        overflow: 'hidden',
      }}
    >
      <div
        className="position-absolute"
        style={{
          top: '-10%',
          left: '-10%',
          width: '300px',
          height: '300px',
          background: 'rgba(225, 1, 116, 0.1)',
          borderRadius: '50%',
          transform: 'rotate(45deg)',
        }}
      />
      <div
        className="position-absolute"
        style={{
          bottom: '-10%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'rgba(225, 1, 116, 0.05)',
          borderRadius: '50%',
          transform: 'rotate(-45deg)',
        }}
      />

      <Motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-5"
        style={{
          color: '#E10174',
          fontWeight: 'bold',
          fontSize: '4rem',
          letterSpacing: '2px',
          textShadow: '2px 2px 4px rgba(225, 1, 116, 0.1)',
        }}
      >
        New Password
      </Motion.h1>

      <div className="row w-100 m-0">
        <Motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-md-6 d-flex justify-content-center align-items-center"
        >
          <Motion.img
            transition={{ type: 'spring', stiffness: 300 }}
            src="/logoT.webp"
            alt="Logo"
            className="img-fluid w-75"
          />
        </Motion.div>

        <Motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-md-6 d-flex justify-content-center align-items-center p-2 p-lg-5"
        >
          <div
            className="card shadow-lg col-12 col-md-8 col-lg-10 border-0 rounded-4"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(225, 1, 116, 0.1)',
            }}
          >
            <div className="card-body p-5">
              {success && (
                <Motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="alert alert-success rounded-3"
                >
                  {success}
                </Motion.div>
              )}
              {error && (
                <Motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="alert alert-danger rounded-3"
                  style={{ borderColor: '#E10174' }}
                >
                  {error}
                </Motion.div>
              )}

              <form onSubmit={handlePasswordReset}>
                <div className="text-center mb-4">
                  <FaLock size={28} color="#E10174" />
                  <h4 className="fw-bold mt-2 mb-2" style={{ color: '#E10174' }}>
                    Set new password
                  </h4>
                  <p className="text-muted small mb-0">
                    Choose a strong password for your account.
                  </p>
                </div>

                <div className="mb-3 position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control shadow-none rounded-pill text-center"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      borderColor: '#E10174',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    }}
                  />
                  <FaLock
                    className="position-absolute start-0 top-50 translate-middle-y ms-3"
                    size={18}
                    color="#E10174"
                  />
                  <Motion.span
                    whileHover={{ scale: 1.2 }}
                    className="position-absolute end-0 me-3 top-50 translate-middle-y"
                    style={{ cursor: 'pointer', color: '#E10174' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Motion.span>
                </div>

                <div className="mb-2 position-relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-control shadow-none rounded-pill text-center ${
                      confirmPassword
                        ? password === confirmPassword
                          ? 'is-valid'
                          : 'is-invalid'
                        : ''
                    }`}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{
                      borderColor: '#E10174',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    }}
                  />
                  <FaLock
                    className="position-absolute start-0 top-50 translate-middle-y ms-3"
                    size={18}
                    color="#E10174"
                  />
                  <Motion.span
                    whileHover={{ scale: 1.2 }}
                    className="position-absolute end-0 me-3 top-50 translate-middle-y"
                    style={{ cursor: 'pointer', color: '#E10174' }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </Motion.span>
                </div>

                {confirmPassword && password !== confirmPassword && (
                  <div className="text-danger small text-center mb-3">Passwords do not match.</div>
                )}
                {confirmPassword && password === confirmPassword && (
                  <div className="text-success small text-center mb-3">Passwords match!</div>
                )}

                <Motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn text-white w-100 mt-3 rounded-pill"
                  disabled={isSubmitting || password !== confirmPassword}
                  style={{
                    backgroundColor: '#E10174',
                    borderColor: '#E10174',
                    padding: '12px',
                    boxShadow: '0 10px 20px rgba(225, 1, 116, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Processing...
                    </>
                  ) : (
                    'Reset password'
                  )}
                </Motion.button>

                <div className="text-center mt-3">
                  <Link to="/" style={{ color: '#E10174', fontWeight: '600' }}>
                    Back to login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </Motion.div>
      </div>
    </Motion.div>
  );
};

export default UpdatePassword;
