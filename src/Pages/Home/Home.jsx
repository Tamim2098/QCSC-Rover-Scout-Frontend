import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import About from '../About/About';
import bgImage from '../../assets/college.jpg';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        :root {
          --gold: #f0a500;
          --gold-dim: rgba(240,165,0,0.15);
          --dark: #050908;
        }

        .home-root * { box-sizing: border-box; }

        /* ── HERO ── */
        .hero-section {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: var(--dark);
        }

        /* Parallax BG */
        .hero-bg {
          position: absolute;
          inset: -10%;
          background-image: url("${bgImage}");
          background-size: cover;
          background-position: center 30%;
          will-change: transform;
          transition: transform 0.1s linear;
        }

        /* Multi-layer cinematic overlays */
        .hero-overlay-base {
          position: absolute; inset: 0;
          background: linear-gradient(
            180deg,
            rgba(5,9,8,0.3) 0%,
            rgba(5,9,8,0.55) 40%,
            rgba(5,9,8,0.85) 80%,
            rgba(5,9,8,1) 100%
          );
          z-index: 1;
        }
        .hero-overlay-side {
          position: absolute; inset: 0;
          background: linear-gradient(
            90deg,
            rgba(5,9,8,0.6) 0%,
            transparent 40%,
            transparent 60%,
            rgba(5,9,8,0.6) 100%
          );
          z-index: 1;
        }

        /* Noise texture overlay */
        .hero-noise {
          position: absolute; inset: 0; z-index: 2;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px 128px;
        }

        /* Animated gold vignette corners */
        .hero-corner-tl {
          position: absolute; top: 0; left: 0; z-index: 3;
          width: 180px; height: 180px;
          background: radial-gradient(circle at 0% 0%, rgba(240,165,0,0.12) 0%, transparent 70%);
        }
        .hero-corner-br {
          position: absolute; bottom: 0; right: 0; z-index: 3;
          width: 200px; height: 200px;
          background: radial-gradient(circle at 100% 100%, rgba(20,90,60,0.2) 0%, transparent 70%);
        }

        /* Content */
        .hero-content {
          position: relative; z-index: 10;
          text-align: center;
          padding: 100px 20px 60px;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        /* Stagger reveal animations */
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.show { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.15s; }
        .d2 { transition-delay: 0.35s; }
        .d3 { transition-delay: 0.5s; }
        .d4 { transition-delay: 0.65s; }
        .d5 { transition-delay: 0.8s; }
        .d6 { transition-delay: 0.95s; }

        /* Tag line */
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(9px, 2.5vw, 11px);
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 20px;
        }
        .hero-eyebrow-line {
          display: block;
          height: 1px;
          width: 28px;
          background: var(--gold);
          opacity: 0.7;
        }
        .hero-eyebrow-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--gold);
          animation: blink 2s infinite;
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.2; }
        }

        /* Main heading */
        .hero-h1 {
          font-family: 'Cinzel', serif;
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.01em;
          color: #fff;
          margin: 0 0 8px;
          font-size: clamp(2.2rem, 9vw, 5rem);
        }
        .hero-h1-sub {
          font-family: 'Cinzel', serif;
          font-weight: 600;
          color: var(--gold);
          font-size: clamp(1rem, 4.5vw, 2.2rem);
          display: block;
          margin-top: 6px;
          letter-spacing: 0.02em;
        }
        .hero-h1-sub2 {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-style: italic;
          color: rgba(255,255,255,0.55);
          font-size: clamp(0.9rem, 3.5vw, 1.5rem);
          display: block;
          margin-top: 6px;
          letter-spacing: 0.04em;
        }

        /* Divider */
        .hero-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 20px 0;
        }
        .hero-divider-line {
          height: 1px;
          width: 40px;
          background: linear-gradient(to right, transparent, rgba(240,165,0,0.5));
        }
        .hero-divider-line.rev {
          background: linear-gradient(to left, transparent, rgba(240,165,0,0.5));
        }
        .hero-divider-icon {
          color: rgba(240,165,0,0.6);
          font-size: 14px;
        }

        /* Sub text */
        .hero-subtext {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(13px, 3.5vw, 16px);
          font-weight: 300;
          color: rgba(255,255,255,0.45);
          line-height: 1.8;
          max-width: 500px;
          margin: 0 auto 32px;
        }

        /* CTA Buttons */
        .hero-btns {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
        }
        @media (min-width: 480px) {
          .hero-btns { flex-direction: row; justify-content: center; gap: 14px; }
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          color: #000;
          background: var(--gold);
          padding: 14px 28px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
          width: 100%;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(240,165,0,0.25);
        }
        @media (min-width: 480px) { .btn-primary { width: auto; } }
        .btn-primary:hover {
          background: #ffc107;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(240,165,0,0.35);
        }
        .btn-primary .arrow {
          font-size: 16px;
          transition: transform 0.2s;
        }
        .btn-primary:hover .arrow { transform: translateX(4px); }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(255,255,255,0.65);
          background: transparent;
          padding: 13px 28px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.15);
          cursor: pointer;
          transition: color 0.25s, border-color 0.25s, background 0.25s, transform 0.2s;
          width: 100%;
          justify-content: center;
        }
        @media (min-width: 480px) { .btn-secondary { width: auto; } }
        .btn-secondary:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.04);
          transform: translateY(-2px);
        }

        /* Scroll indicator */
        .scroll-hint {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0.4;
          animation: fadeUpDown 2.5s ease-in-out infinite;
        }
        @keyframes fadeUpDown {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) translateY(0); }
          50% { opacity: 0.7; transform: translateX(-50%) translateY(5px); }
        }
        .scroll-hint-line {
          width: 1px;
          height: 36px;
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.5));
        }
        .scroll-hint-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          writing-mode: horizontal-tb;
        }

        /* Slim gold bar at very bottom of hero */
        .hero-bottom-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(240,165,0,0.5) 50%, transparent);
          z-index: 10;
        }

        /* Floating badge — desktop only */
        .hero-badge {
          display: none;
        }
        @media (min-width: 1024px) {
          .hero-badge {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            right: 40px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            gap: 6px;
          }
          .hero-badge-inner {
            width: 70px; height: 70px;
            border-radius: 50%;
            border: 1px solid rgba(240,165,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(240,165,0,0.05);
            animation: rotateBadge 20s linear infinite;
          }
          @keyframes rotateBadge {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .hero-badge-text {
            font-family: 'Cinzel', serif;
            font-size: 7px;
            letter-spacing: 0.25em;
            color: rgba(240,165,0,0.5);
            text-transform: uppercase;
            text-align: center;
          }
        }

      `}</style>

      <div className="home-root relative overflow-hidden">

        {/* ══════════════ HERO SECTION ══════════════ */}
        <div className="hero-section" ref={heroRef}>

          {/* Parallax background */}
          <div
            className="hero-bg"
            style={{ transform: `translateY(${scrollY * 0.25}px)` }}
          />

          {/* Layered overlays */}
          <div className="hero-overlay-base" />
          <div className="hero-overlay-side" />
          <div className="hero-noise" />
          <div className="hero-corner-tl" />
          <div className="hero-corner-br" />

          {/* Main content */}
          <div className="hero-content">

            {/* Eyebrow */}
            <div className={`reveal d1 ${loaded ? 'show' : ''}`} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <span className="hero-eyebrow">
                <span className="hero-eyebrow-line" />
                <span className="hero-eyebrow-dot" />
                Qadirabad Cantonment Sapper College
                <span className="hero-eyebrow-dot" />
                <span className="hero-eyebrow-line rev" />
              </span>
            </div>

            {/* Heading */}
            <div className={`reveal d2 ${loaded ? 'show' : ''}`}>
              <h1 className="hero-h1">
                Rover Scout Group
                <span className="hero-h1-sub">Forging Elite Leaders.</span>
                <span className="hero-h1-sub2">Serving Humanity with Honor.</span>
              </h1>
            </div>

            {/* Divider */}
            <div className={`hero-divider reveal d3 ${loaded ? 'show' : ''}`}>
              <span className="hero-divider-line rev" />
              <span className="hero-divider-icon">⬧</span>
              <span className="hero-divider-line" />
            </div>

            {/* Sub text */}
            <p className={`hero-subtext reveal d4 ${loaded ? 'show' : ''}`}>
              Embark on a journey of discipline, duty, and determination. We train the best to serve the nation with honor and skill.
            </p>

            {/* CTA Buttons */}
            <div className={`hero-btns reveal d5 ${loaded ? 'show' : ''}`}>
              <Link to="/join" className="btn-primary">
                Join Rover Scout
                <span className="arrow">→</span>
              </Link>
              <a href="#about" className="btn-secondary">
                Explore Activities
              </a>
            </div>

          </div>

          {/* Scroll indicator */}
          <div className="scroll-hint">
            <span className="scroll-hint-text">Scroll</span>
            <span className="scroll-hint-line" />
          </div>

          {/* Bottom gold bar */}
          <div className="hero-bottom-bar" />

        </div>

        {/* ══════════════ ABOUT SECTION ══════════════ */}
        <About />

      </div>
    </>
  );
};

export default Home;
