import { motion } from 'framer-motion';

function FloatingIcons() {
  const icons = ['💧', '👕', '👗', '👟', '🧥', '👔'];

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {icons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  );
}

export default FloatingIcons;
