import { motion } from 'framer-motion';

function BackgroundSlideshow() {
  const images = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop&crop=center"
  ];

  return (
    <div className="background-slideshow">
      {images.map((src, index) => (
        <img 
          key={index}
          src={src} 
          alt={`fashion ${index + 1}`}
          loading="lazy"
        />
      ))}
    </div>
  );
}

export default BackgroundSlideshow;
