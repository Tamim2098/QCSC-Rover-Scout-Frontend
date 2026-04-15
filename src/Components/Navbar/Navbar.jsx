import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // স্ক্রল ইভেন্ট লিসেনার
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // রাউট বা হ্যাশ চেঞ্জ হলে মেনু বন্ধ করা এবং অন্য পেজ থেকে About-এ আসার স্মুথ স্ক্রল
  useEffect(() => {
    setMenuOpen(false);

    if (location.hash) {
      // অন্য পেজ থেকে আসলে DOM লোড হওয়ার জন্য একটু সময় দিতে হয়
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/#about' },
    { label: 'COMMITTEE', to: '/Committee' },
    { label: 'Gallery', to: '/Gallery' },
    { label: 'Contact', to: '/Contact' },
  ];

  // Active state চেকার আপডেট করা হয়েছে, যাতে Home এবং About একসাথে Active না দেখায়
  const isActive = (to) => {
    if (to === '/') return location.pathname === '/' && !location.hash;
    if (to.includes('#')) return location.pathname + location.hash === to;
    return location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  };

  // Smooth Scrolling এবং Navigation হ্যান্ডলার
  const handleNavClick = (e, to) => {
    // যদি Home এ ক্লিক করা হয়
    if (to === '/') {
      if (location.pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate('/'); // URL থেকে হ্যাশ রিমুভ করার জন্য
      }
    } 
    // যদি About (বা যেকোনো Hash) এ ক্লিক করা হয়
    else if (to.startsWith('/#')) {
      const targetId = to.split('#')[1];
      
      // যদি হোমপেজেই থাকি, তাহলে স্মুথ স্ক্রল করবে
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          navigate(to); // URL আপডেট করার জন্য
        }
      } 
      // অন্য পেজে থাকলে ডিফল্ট লিংক কাজ করবে এবং উপরের useEffect স্ক্রল হ্যান্ডেল করবে
    }
    setMenuOpen(false); // মোবাইল মেনু বন্ধ করার জন্য
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .nav-root * { box-sizing: border-box; }

        /* ── NAV BAR ── */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, padding 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .navbar.transparent {
          background: transparent;
          border-bottom: 1px solid transparent;
          box-shadow: none;
          padding: 0;
        }
        .navbar.solid {
          background: rgba(5, 9, 8, 0.92);
          border-bottom: 1px solid rgba(240, 165, 0, 0.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 0;
        }

        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          height: 64px;
          transition: height 0.3s ease;
        }
        .navbar.solid .nav-inner { height: 58px; }

        /* ── LOGO ── */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nav-logo-badge {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: rgba(240,165,0,0.1);
          border: 1px solid rgba(240,165,0,0.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif;
          font-size: 14px; font-weight: 700;
          color: #f0a500;
          transition: background 0.25s, box-shadow 0.25s;
          flex-shrink: 0;
        }
        .nav-logo:hover .nav-logo-badge {
          background: rgba(240,165,0,0.18);
          box-shadow: 0 0 16px rgba(240,165,0,0.2);
        }
        .nav-logo-text {
          display: flex; flex-direction: column; gap: 0px;
        }
        .nav-logo-title {
          font-family: 'Cinzel', serif;
          font-size: 13px; font-weight: 700;
          color: #fff; letter-spacing: 0.02em;
          line-height: 1.1;
        }
        .nav-logo-sub {
          font-size: 9px; font-weight: 400;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          line-height: 1;
        }

        /* ── DESKTOP LINKS ── */
        .nav-links {
          display: none;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0; padding: 0;
        }
        @media (min-width: 768px) { .nav-links { display: flex; } }

        .nav-link-item a {
          position: relative;
          font-size: 12px; font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(255,255,255,0.45);
          padding: 6px 12px;
          border-radius: 6px;
          transition: color 0.25s, background 0.25s;
          display: block;
        }
        .nav-link-item a::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 12px; right: 12px;
          height: 1px;
          background: #f0a500;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.3s ease;
        }
        .nav-link-item a:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.04);
        }
        .nav-link-item a.active {
          color: #f0a500;
        }
        .nav-link-item a.active::after,
        .nav-link-item a:hover::after {
          transform: scaleX(1);
        }

        /* ── JOIN BUTTON ── */
        .nav-join-btn {
          display: none;
          align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          text-decoration: none;
          color: #000;
          background: #f0a500;
          padding: 9px 20px;
          border-radius: 6px;
          transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
          box-shadow: 0 2px 12px rgba(240,165,0,0.2);
          white-space: nowrap;
        }
        @media (min-width: 768px) { .nav-join-btn { display: inline-flex; } }
        .nav-join-btn:hover {
          background: #ffc107;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(240,165,0,0.35);
        }
        .nav-join-arrow { font-size: 13px; transition: transform 0.2s; }
        .nav-join-btn:hover .nav-join-arrow { transform: translateX(3px); }

        /* ── MOBILE HAMBURGER ── */
        .nav-hamburger {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 5px;
          width: 40px; height: 40px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          cursor: pointer;
          padding: 0;
          transition: background 0.25s, border-color 0.25s;
          flex-shrink: 0;
        }
        @media (min-width: 768px) { .nav-hamburger { display: none; } }
        .nav-hamburger:hover {
          background: rgba(240,165,0,0.08);
          border-color: rgba(240,165,0,0.2);
        }
        .ham-line {
          display: block;
          height: 1.5px; border-radius: 2px;
          background: rgba(255,255,255,0.7);
          transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
        }
        .ham-line-1 { width: 18px; }
        .ham-line-2 { width: 14px; }
        .ham-line-3 { width: 18px; }
        .nav-hamburger.open .ham-line-1 { transform: translateY(6.5px) rotate(45deg); width: 18px; }
        .nav-hamburger.open .ham-line-2 { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open .ham-line-3 { transform: translateY(-6.5px) rotate(-45deg); width: 18px; }

        /* ── MOBILE MENU ── */
        .mobile-menu {
          position: fixed;
          top: 0; right: 0;
          width: min(80vw, 300px);
          height: 100svh;
          background: rgba(5,9,8,0.97);
          border-left: 1px solid rgba(240,165,0,0.1);
          z-index: 999;
          display: flex; flex-direction: column;
          padding: 80px 28px 40px;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .mobile-menu.open { transform: translateX(0); }

        .mobile-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 998;
          opacity: 0; pointer-events: none;
          transition: opacity 0.35s ease;
          backdrop-filter: blur(2px);
        }
        .mobile-backdrop.open { opacity: 1; pointer-events: all; }

        .mobile-nav-links {
          list-style: none; margin: 0; padding: 0;
          display: flex; flex-direction: column; gap: 4px;
          flex: 1;
        }
        .mobile-nav-links li a {
          display: flex; align-items: center; justify-content: space-between;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 400;
          letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none;
          color: rgba(255,255,255,0.45);
          padding: 14px 16px;
          border-radius: 8px;
          border: 1px solid transparent;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
        }
        .mobile-nav-links li a:hover {
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.06);
        }
        .mobile-nav-links li a.active {
          color: #f0a500;
          background: rgba(240,165,0,0.06);
          border-color: rgba(240,165,0,0.15);
        }
        .mobile-link-arrow {
          font-size: 16px;
          opacity: 0.3;
          transition: opacity 0.2s, transform 0.2s;
        }
        .mobile-nav-links li a:hover .mobile-link-arrow,
        .mobile-nav-links li a.active .mobile-link-arrow {
          opacity: 0.7;
          transform: translateX(3px);
        }

        .mobile-join-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Cinzel', serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          text-decoration: none;
          color: #000; background: #f0a500;
          padding: 14px;
          border-radius: 8px;
          margin-top: 24px;
          box-shadow: 0 4px 20px rgba(240,165,0,0.25);
          transition: background 0.25s, box-shadow 0.25s;
        }
        .mobile-join-btn:hover {
          background: #ffc107;
          box-shadow: 0 8px 28px rgba(240,165,0,0.4);
        }

        .mobile-menu-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          margin-bottom: 16px;
          padding-left: 16px;
        }

        .mobile-menu-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(240,165,0,0.3), transparent);
          margin: 20px 0;
        }

        .nav-right {
          display: flex; align-items: center; gap: 10px;
        }
      `}</style>

      <div className="nav-root">

        {/* ── BACKDROP ── */}
        <div
          className={`mobile-backdrop ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* ── MOBILE SLIDE MENU ── */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <p className="mobile-menu-label">Navigation</p>
          <ul className="mobile-nav-links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={isActive(link.to) ? 'active' : ''}
                  onClick={(e) => handleNavClick(e, link.to)}
                >
                  {link.label}
                  <span className="mobile-link-arrow">›</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-menu-divider" />
          <Link to="/join" className="mobile-join-btn" onClick={() => setMenuOpen(false)}>
            Join Now →
          </Link>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(255,255,255,0.15)', textAlign:'center', marginTop:'16px', letterSpacing:'0.05em' }}>
            Rover Scout Group · QCSC
          </p>
        </div>

        {/* ── MAIN NAVBAR ── */}
        <nav className={`navbar ${scrolled ? 'solid' : 'transparent'}`}>
          <div className="nav-inner">

            {/* Logo */}
            <Link to="/" className="nav-logo" onClick={(e) => handleNavClick(e, '/')}>
              <div className="nav-logo-badge">RS</div>
              <div className="nav-logo-text">
                <span className="nav-logo-title">Rover Scout</span>
                <span className="nav-logo-sub">QCSC</span>
              </div>
            </Link>

            {/* Desktop Links */}
            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.to} className="nav-link-item">
                  <Link
                    to={link.to}
                    className={isActive(link.to) ? 'active' : ''}
                    onClick={(e) => handleNavClick(e, link.to)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right side */}
            <div className="nav-right">
              <Link to="/join" className="nav-join-btn" onClick={() => setMenuOpen(false)}>
                Join Now
                <span className="nav-join-arrow">→</span>
              </Link>
              <button
                className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span className="ham-line ham-line-1" />
                <span className="ham-line ham-line-2" />
                <span className="ham-line ham-line-3" />
              </button>
            </div>

          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;