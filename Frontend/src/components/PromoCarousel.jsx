import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Purely decorative/promotional content — no backend or product data involved.
const SLIDES = [
  {
    id: 1,
    eyebrow: "New Arrivals",
    title: "Fresh Finds, Every Week",
    subtitle: "Hand-picked listings from sellers across the community.",
    cta: "Explore now",
    theme: "slide-coral",
  },
  {
    id: 2,
    eyebrow: "Community Favorites",
    title: "Loved By Shoppers Like You",
    subtitle: "Check out the products everyone's adding to their cart.",
    cta: "See what's trending",
    theme: "slide-forest",
  },
  {
    id: 3,
    eyebrow: "Sell With Us",
    title: "Turn Your Stuff Into Sales",
    subtitle: "List your own products in minutes and reach new buyers.",
    cta: "Start selling",
    theme: "slide-plum",
  },
];

const PromoCarousel = ({ onCta }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const goTo = (i) => setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  return (
    <div
      className="promo-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="promo-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div key={slide.id} className={`promo-slide ${slide.theme}`}>
            <div className="promo-slide-content">
              <span className="promo-eyebrow">{slide.eyebrow}</span>
              <h2 className="promo-title">{slide.title}</h2>
              <p className="promo-subtitle">{slide.subtitle}</p>
              <button className="promo-cta" onClick={onCta}>{slide.cta} →</button>
            </div>
            <div className="promo-slide-decor" aria-hidden="true">
              <span className="promo-blob promo-blob-a" />
              <span className="promo-blob promo-blob-b" />
              <span className="promo-blob promo-blob-c" />
            </div>
          </div>
        ))}
      </div>

      <button className="promo-arrow promo-arrow-left" onClick={prev} aria-label="Previous slide">
        <FaChevronLeft />
      </button>
      <button className="promo-arrow promo-arrow-right" onClick={next} aria-label="Next slide">
        <FaChevronRight />
      </button>

      <div className="promo-dots">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            className={`promo-dot ${i === index ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoCarousel;
