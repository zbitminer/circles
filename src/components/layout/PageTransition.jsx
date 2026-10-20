import { useEffect, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function PageTransition({ children }) {
  const location = useLocation();
  const navType = useNavigationType();
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    setDirection(navType === 'POP' ? -1 : 1);
  }, [location.pathname, navType]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: direction * 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * -24 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}