import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';

export default function FloatingDietician() {
  const { pathname } = useLocation();
  if (pathname === '/dieteticien') return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.4, type: 'spring', stiffness: 280, damping: 22 }}
      className="fixed bottom-24 right-4 sm:bottom-8 sm:right-6 z-40 group"
    >
      <Link to="/dieteticien" aria-label="Consultation diététicien">

        {/* Tooltip */}
        <span className="
          absolute right-full mr-3 top-1/2 -translate-y-1/2
          whitespace-nowrap font-body text-xs uppercase tracking-[0.12em]
          bg-foreground text-background px-3 py-2 rounded-xl shadow-elevated
          opacity-0 translate-x-2
          group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-200 pointer-events-none
        ">
          Diététicien
        </span>

        {/* Bouton */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="
            w-14 h-14 rounded-full
            bg-primary text-primary-foreground
            shadow-warm hover:shadow-elevated
            flex items-center justify-center
            transition-shadow duration-200
          "
        >
          <Stethoscope className="w-6 h-6" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
