import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Styles/Home.css';

// Centralized constants for styles and data
const CARD_STYLES = {
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
};

const BUTTON_STYLES = {
  backgroundColor: '#0052CC',
  borderColor: '#0052CC',
  borderRadius: '8px',
  color: '#ffffff',
  fontWeight: '500',
  boxShadow: 'none',
};

const SERVICES = [
  {
    title: 'Texas Mobile PCS',
    description: 'Access document signing services for Texas Mobile PCS',
    logo: '/texas-logo.jpg',
    logoBg: '#DEEBFF',
    path: '/texasdocu',
  },
  {
    title: 'Techno Communications',
    description: 'Access document signing services for Techno Communications',
    logo: '/logoT.webp',
    logoBg: '#E6FCFF',
    path: '/technodocu',
  },
  {
    title: 'Activewireles',
    description: 'Access document signing services for Activewireles',
    logo:'/A.webp',
    logoBg: '#E6FCFF',
    path: '/activewireless',
  },
];

// Reusable ServiceCard component
const ServiceCard = ({ title, description, logo, logoBg, path }) => {
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      className="card border-0 h-100"
      variants={cardVariants}
      whileHover={{ y: -8, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)', transition: { duration: 0.3 } }}
      style={CARD_STYLES}
    >
      <div className="card-body p-5">
        <div className="d-flex align-items-center mb-4">
          <div className="me-3 p-2 rounded-circle" style={{ backgroundColor: logoBg }}>
            <img
              src={logo}
              alt={`${title} Logo`}
              className="img-fluid"
              style={{ width: '50px', height: '50px', objectFit: 'contain' }}
            />
          </div>
          <h3 className="card-title mb-0 fw-bold" style={{ color: '#172B4D' }}>
            {title}
          </h3>
        </div>
        <p className="card-text text-muted mb-4">{description}</p>
        <motion.button
          className="btn w-100 py-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={BUTTON_STYLES}
          onClick={() => navigate(path)}
        >
          Sign Document
        </motion.button>
      </div>
    </motion.div>
  );
};

// Main Home component
function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="container-fluid max-vh-100 mt-5 d-flex flex-column justify-content-center align-items-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="text-center mb-5" variants={headingVariants}>
        <h1 className="fw-bold mb-3" style={{ color: '#172B4D', fontSize: '2.5rem' }}>
          Welcome to Our Services
        </h1>
        <p className="text-muted lead" style={{ fontSize: '1.25rem' }}>
          Select a service to sign documents
        </p>
      </motion.div>

      {/* Cards */}
      <div className="row g-5 w-100 justify-content-center">
        {SERVICES.map((service, index) => (
          <div key={index} className="col-md-4 col-lg-4">
            <ServiceCard {...service} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Home;