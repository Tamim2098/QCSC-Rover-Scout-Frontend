import React, { useState, useEffect, useRef } from 'react';
import activity1 from '../../assets/activity1.jpg';
import activity2 from '../../assets/activity2.jpg';
import activity3 from '../../assets/activity3.jpg';
import activity4 from '../../assets/activity4.jpg';
import activity5 from '../../assets/activity5.jpg';
import activity6 from '../../assets/activity6.jpg';
import activity7 from '../../assets/activity7.jpg';
import activity8 from '../../assets/activity8.jpg';
import activity9 from '../../assets/activity9.jpg';
import activity10 from '../../assets/activity10.jpg';

const About = () => {
  const activityImages = [
    activity1,
    activity2,
    activity3,
    activity4,
    activity5,
    activity6,
    activity7,
    activity8,
    activity9,
    activity10
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % activityImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        #about * { box-sizing: border-box; }

        .about-section {
          font-family: 'DM Sans', sans-serif;
          background: #070c0a;
          position: relative;
          overflow: hidden;
        }

        .about-title-font {
          font-family: 'Cinzel', serif;
        }

        /* Animated grid background */
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(180,130,40,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,130,40,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%);
        }

        .orb-1 {
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(202,138,4,0.18) 0%, transparent 70%);
          top: -80px; left: -80px;
          filter: blur(40px);
          animation: floatOrb 8s ease-in-out infinite;
        }
        .orb-2 {
          position: absolute;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,80,50,0.25) 0%, transparent 70%);
          bottom: 10%; right: -60px;
          filter: blur(50px);
          animation: floatOrb 10s ease-in-out infinite reverse;
        }
        @keyframes floatOrb {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(20px, 20px); }
        }

        /* Slide-in animation */
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.25s; }
        .delay-3 { transition-delay: 0.4s; }

        /* Section label */
        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(202,138,4,0.1);
          border: 1px solid rgba(202,138,4,0.3);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #f59e0b;
        }
        .section-label::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #f59e0b;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* Image slider */
        .slider-wrapper {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: #111;
          height: 280px;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 0 0 1px rgba(202,138,4,0.1), 0 30px 60px rgba(0,0,0,0.5);
        }
        @media (min-width: 480px) { .slider-wrapper { height: 340px; } }
        @media (min-width: 1024px) { .slider-wrapper { height: 480px; } }

        .slider-img {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          transition: opacity 1.2s ease, transform 1.5s ease;
        }
        .slider-img.active { opacity: 1; transform: scale(1.03); }
        .slider-img.inactive { opacity: 0; transform: scale(1.1); pointer-events: none; }

        .slider-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 40%,
            rgba(7,12,10,0.6) 75%,
            rgba(7,12,10,0.95) 100%
          );
        }

        /* Counter dots */
        .dot-nav {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 10;
        }
        .dot {
          height: 3px;
          border-radius: 3px;
          background: rgba(255,255,255,0.3);
          transition: width 0.5s ease, background 0.5s ease;
          cursor: pointer;
        }
        .dot.active-dot { width: 28px; background: #f59e0b; }
        .dot.inactive-dot { width: 8px; }

        /* Quote block */
        .quote-block {
          position: relative;
          background: linear-gradient(135deg, rgba(202,138,4,0.06) 0%, rgba(202,138,4,0.02) 100%);
          border: 1px solid rgba(202,138,4,0.15);
          border-radius: 14px;
          padding: 20px 20px 20px 24px;
          overflow: hidden;
        }
        .quote-block::before {
          content: '"';
          position: absolute;
          top: -10px;
          left: 12px;
          font-family: 'Cinzel', serif;
          font-size: 80px;
          color: rgba(202,138,4,0.12);
          line-height: 1;
        }
        .quote-line {
          position: absolute;
          left: 0;
          top: 14px;
          bottom: 14px;
          width: 3px;
          background: linear-gradient(to bottom, #f59e0b, rgba(245,158,11,0.2));
          border-radius: 3px;
        }
        @media (min-width: 640px) {
          .quote-block { padding: 24px 28px 24px 32px; }
        }

        /* Body text */
        .body-text {
          color: rgba(255,255,255,0.55);
          font-size: 14px;
          line-height: 1.8;
          font-weight: 300;
        }
        @media (min-width: 640px) {
          .body-text { font-size: 15px; }
        }
        @media (min-width: 1024px) {
          .body-text { font-size: 16px; }
        }

        /* Divider */
        .gold-divider {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .gold-divider::before, .gold-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(202,138,4,0.4), transparent);
        }
      `}</style>

      <div id="about" className="about-section min-h-screen py-16 lg:py-24 px-5 sm:px-8 lg:px-16" ref={sectionRef}>

        {/* Backgrounds */}
        <div className="grid-bg" />
        <div className="orb-1" />
        <div className="orb-2" />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

          {/* ── Header ── */}
          <div className={`text-center mb-10 sm:mb-14 fade-up ${isVisible ? 'visible' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <span className="section-label">Who We Are</span>
            </div>
            <h2 className="about-title-font" style={{
              fontSize: 'clamp(1.7rem, 5.5vw, 3.2rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.15,
              marginBottom: '8px',
              letterSpacing: '-0.01em'
            }}>
              About Our{' '}
              <span style={{ color: '#f59e0b', display: 'inline-block' }}>
                Rover Scout Group
              </span>
            </h2>
            <div className="gold-divider" style={{ marginTop: '16px', maxWidth: '200px', margin: '16px auto 0' }}>
              <span style={{ color: 'rgba(245,158,11,0.6)', fontSize: '18px' }}>⬧</span>
            </div>
          </div>

          {/* ── Main Grid ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '32px',
          }}
            className="lg-grid"
          >

            {/* IMAGE — always first on mobile */}
            <div className={`fade-up delay-1 ${isVisible ? 'visible' : ''}`}>
              <div className="slider-wrapper">
                {activityImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Scout Activity ${i + 1}`}
                    className={`slider-img ${i === currentImage ? 'active' : 'inactive'}`}
                  />
                ))}
                <div className="slider-overlay" />

                {/* Bottom label */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '20px 20px 44px',
                  zIndex: 5
                }}>
                  <p style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,158,11,0.8)',
                    margin: 0
                  }}>Our Activities</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '3px 0 0', fontWeight: 300 }}>
                    {currentImage + 1} / {activityImages.length}
                  </p>
                </div>

                {/* Dot navigation */}
                <div className="dot-nav">
                  {activityImages.map((_, i) => (
                    <div
                      key={i}
                      className={`dot ${i === currentImage ? 'active-dot' : 'inactive-dot'}`}
                      onClick={() => setCurrentImage(i)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* TEXT CONTENT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Intro text */}
              <div className={`fade-up delay-2 ${isVisible ? 'visible' : ''}`}>
                <p className="body-text">
                  Welcome to the{' '}
                  <strong style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                    Qadirabad Cantonment Sapper College Rover Scout Group
                  </strong>.
                  Founded on the core principles of discipline, leadership, and service to humanity,
                  our unit has been a beacon of character development for the youth.
                </p>
                <p className="body-text" style={{ marginTop: '14px' }}>
                  Our mission is to contribute to the education of young people through a value system
                  based on the Scout Promise and Law, helping build a better world where people are
                  self-fulfilled and play a constructive role in society.
                </p>
              </div>

              {/* Quote */}
              <div className={`quote-block fade-up delay-3 ${isVisible ? 'visible' : ''}`}>
                <div className="quote-line" />
                <p style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: 'clamp(13px, 3.5vw, 15px)',
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  margin: 0,
                  fontWeight: 300,
                  position: 'relative',
                  zIndex: 1
                }}>
                  "Be Prepared... a Scout must prepare himself by previous thinking out and practicing
                  how to act on any emergency so that he is never taken by surprise."
                </p>
                <p style={{
                  marginTop: '12px',
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#f59e0b',
                  fontWeight: 600,
                  position: 'relative',
                  zIndex: 1
                }}>
                  — Lord Baden-Powell
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Inline responsive override for lg grid */}
        <style>{`
          @media (min-width: 1024px) {
            .lg-grid {
              grid-template-columns: 1fr 1fr !important;
              gap: 56px !important;
              align-items: center;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default About;