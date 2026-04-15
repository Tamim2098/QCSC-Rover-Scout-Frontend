import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .footer-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .footer-wrap {
          position: relative;
          background: #070c0a;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* top border glow line */
        .footer-top-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(240,165,0,0.15) 30%, rgba(240,165,0,0.4) 50%, rgba(240,165,0,0.15) 70%, transparent 100%);
        }

        /* subtle grid bg */
        .footer-grid-bg {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(180,130,40,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,130,40,0.03) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse 80% 100% at 50% 100%, black 10%, transparent 100%);
        }

        /* orb */
        .footer-orb {
          position: absolute;
          width: 220px; height: 220px; border-radius: 50%;
          background: radial-gradient(circle, rgba(20,90,55,0.12) 0%, transparent 70%);
          bottom: -60px; left: 50%; transform: translateX(-50%);
          filter: blur(50px); z-index: 0;
        }

        .footer-inner {
          position: relative; z-index: 10;
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
        }

        /* divider with diamond */
        .footer-divider {
          display: flex; align-items: center; gap: 10px;
          width: 100%; max-width: 300px;
        }
        .footer-div-line {
          flex: 1; height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.05));
        }
        .footer-div-line.rev {
          background: linear-gradient(to left, transparent, rgba(255,255,255,0.05));
        }
        .footer-diamond {
          color: rgba(240,165,0,0.4);
          font-size: 10px;
          line-height: 1;
        }

        /* copyright text */
        .footer-copy {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 300;
          color: rgba(255,255,255,0.18);
          letter-spacing: 0.08em;
          text-align: center;
        }

        /* name */
        .footer-name {
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: linear-gradient(90deg, rgba(240,165,0,0.5), rgba(240,165,0,0.85), rgba(240,165,0,0.5));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* reveal */
        .footer-reveal {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .footer-reveal.show {
          opacity: 1;
          transform: translateY(0);
        }
        .fd1 { transition-delay: 0.1s; }
        .fd2 { transition-delay: 0.22s; }
        .fd3 { transition-delay: 0.34s; }
      `}</style>

      <div className="footer-root">
        <div className="footer-wrap">
          <div className="footer-top-line" />
          <div className="footer-grid-bg" />
          <div className="footer-orb" />

          <div className="footer-inner">

            <div className={`footer-reveal fd1 ${isVisible ? 'show' : ''}`}>
              <div className="footer-divider">
                <div className="footer-div-line rev" />
                <span className="footer-diamond">⬧</span>
                <div className="footer-div-line" />
              </div>
            </div>

            <p className={`footer-copy footer-reveal fd2 ${isVisible ? 'show' : ''}`}>
              © {year} · All Rights Reserved
            </p>

            <p className={`footer-name footer-reveal fd3 ${isVisible ? 'show' : ''}`}>
              Tamim Tajwar
            </p>

          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;