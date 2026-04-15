import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './Styles/Home.css';

const SERVICES = [
  {
    title: 'Texas Mobile PCS',
    description: 'Access document signing services for Texas Mobile PCS',
    logo: '/texas-logo.jpg',
    category: 'Mobile PCS',
    path: '/texasdocu',
  },
  {
    title: 'Techno Communications',
    description: 'Access document signing services for Techno Communications',
    logo: '/logoT.webp',
    category: 'Communications',
    path: '/technodocu',
  },
  {
    title: 'Active Wireless',
    description: 'Access document signing services for Active Wireless',
    logo: '/A.webp',
    category: 'Wireless',
    path: '/activewireless',
  },
  {
    title: 'Techno CA',
    description: 'Access document signing services for Techno CA',
    logo: '/logoT.webp',
    category: 'CA',
    path: '/technoca',
  },
];



const ServiceCard = ({ title, description, logo, category, path }) => {
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
    <Motion.div
      className="home-service-card h-100"
      variants={cardVariants}
      whileHover={{ y: -10, transition: { duration: 0.25 } }}
    >
      <div className="home-card-accent" />
      <div className="home-card-body">
        <div className="d-flex align-items-start justify-content-between gap-3">
          <div className="home-logo-shell">
            <img
              src={logo}
              alt={`${title} Logo`}
              className="home-service-logo"
            />
          </div>
          <span className="home-card-chip">
            {category}
          </span>
        </div>

        <h3 className="home-card-title">{title}</h3>
        <p className="home-card-text">{description}</p>

        <Motion.button
          className="home-card-button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(path)}
        >
          Create Document <FaArrowRight />
        </Motion.button>
      </div>
    </Motion.div>
  );
};

function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <Motion.div
      className="home-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Motion.div className="home-hero" variants={headingVariants}>
        <span className="home-eyebrow">Document workspace</span>
        <h2>Choose a service and start a write-up</h2>
        <p>
          A focused signing hub for quickly preparing the right document for each
          company, location, and workflow.
        </p>

       
      </Motion.div>

      <div className="home-services-grid">
        {SERVICES.map((service) => (
          <Motion.div key={service.title} variants={containerVariants}>
            <ServiceCard {...service} />
          </Motion.div>
        ))}
      </div>
    </Motion.div>
  );
}

export default Home;
