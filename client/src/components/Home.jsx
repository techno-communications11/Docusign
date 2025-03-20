import React from 'react';
import { motion } from 'framer-motion';
import './Styles/Home.css'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate=useNavigate();
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  // Animation variants for the heading
  const headingVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="container-fluid max-vh-100 mt-5 d-flex flex-column justify-content-center align-items-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      
    >
      {/* Header */}
      <motion.div
        className="text-center mb-5"
        variants={headingVariants}
      >
        <h1 className="fw-bold mb-3" style={{ color: '#172B4D', fontSize: '2.5rem' }}>
          Welcome to Our Services
        </h1>
        <p className="text-muted lead" style={{ fontSize: '1.25rem' }}>
          Select a service to sign documents
        </p>
      </motion.div>

      {/* Cards */}
      <div className="row g-5 w-100 justify-content-center">
        {/* Texas Mobile PCS Card */}
        <div className="col-md-6 col-lg-5">
          <motion.div
            className="card border-0 h-100"
            variants={cardVariants}
            whileHover={{ 
              y: -8,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              transition: { duration: 0.3 }
            }}
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
            }}
          >
            <div className="card-body p-5">
              <div className="d-flex align-items-center mb-4">
                <div className="me-3 p-2 rounded-circle" style={{ backgroundColor: '#DEEBFF' }}>
                  <img
                    src="/texas-logo.jpg"
                    alt="Texas Mobile PCS Logo"
                    className="img-fluid"
                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                  />
                </div>
                <h3 className="card-title mb-0 fw-bold" style={{ color: '#172B4D' }}>Texas Mobile PCS</h3>
              </div>
              <p className="card-text text-muted mb-4">
                Access document signing services for Texas Mobile PCS
              </p>
              <motion.button
                className="btn w-100 py-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ 
                  backgroundColor: '#0052CC',
                  borderColor: '#0052CC',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontWeight: '500',
                  boxShadow: 'none',
                }}
                onClick={() => navigate('/texasdocu')}
              >
                Sign Document
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Techno Communications Card */}
        <div className="col-md-6 col-lg-5">
          <motion.div
            className="card border-0 h-100"
            variants={cardVariants}
            whileHover={{ 
              y: -8,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              transition: { duration: 0.3 }
            }}
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
            }}
          >
            <div className="card-body p-5">
              <div className="d-flex align-items-center mb-4">
                <div className="me-3 p-2 rounded-circle" style={{ backgroundColor: '#E6FCFF' }}>
                  <img
                    src="/logoT.webp"
                    alt="Techno Communications Logo"
                    className="img-fluid"
                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                  />
                </div>
                <h3 className="card-title mb-0 fw-bold" style={{ color: '#172B4D' }}>Techno Communications</h3>
              </div>
              <p className="card-text text-muted mb-4">
                Access document signing services for Techno Communications
              </p>
              <motion.button
             onClick={() => navigate('/technodocu')}
                className="btn w-100 py-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ 
                  backgroundColor: '#0052CC',
                  borderColor: '#0052CC',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontWeight: '500',
                  boxShadow: 'none',
                }}
              >
                Sign Document
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;