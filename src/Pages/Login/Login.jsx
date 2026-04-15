import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.config";

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused]   = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin-dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = (name) => ({
    width: '100%',
    background: focused === name ? 'rgba(240,165,0,0.04)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused === name ? 'rgba(240,165,0,0.5)' : error ? 'rgba(255,80,80,0.2)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '8px',
    padding: '13px 16px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border 0.25s, background 0.25s, box-shadow 0.25s',
    boxShadow: focused === name ? '0 0 0 3px rgba(240,165,0,0.07)' : 'none',
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .login-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .login-root input::placeholder { color: rgba(255,255,255,0.18); }
        .login-root input { caret-color: #f0a500; }

        /* ── PAGE ── */
        .login-page {
          min-height: 100svh;
          background: #070c0a;
          display: flex; align-items: center; justify-content: center;
          padding: 24px 16px;
          position: relative; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* grid bg */
        .login-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(180,130,40,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,130,40,0.04) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
        }

        /* orbs */
        .login-orb-1 {
          position: absolute; width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(20,90,55,0.2) 0%, transparent 70%);
          top: -80px; left: -80px; filter: blur(60px);
          animation: loginOrb 11s ease-in-out infinite;
        }
        .login-orb-2 {
          position: absolute; width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, rgba(202,138,4,0.13) 0%, transparent 70%);
          bottom: -60px; right: -60px; filter: blur(60px);
          animation: loginOrb 14s ease-in-out infinite reverse;
        }
        @keyframes loginOrb {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(18px,22px); }
        }

        /* reveal */
        .lg-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .lg-reveal.show { opacity: 1; transform: translateY(0); }
        .lgd1{transition-delay:0.08s} .lgd2{transition-delay:0.2s}
        .lgd3{transition-delay:0.32s} .lgd4{transition-delay:0.44s}

        /* ── CARD ── */
        .login-card {
          width: 100%; max-width: 420px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(240,165,0,0.04);
          position: relative; z-index: 10;
        }

        /* card top accent line */
        .login-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(240,165,0,0.5), transparent);
        }

        /* ── HEADER SECTION ── */
        .login-header {
          background: linear-gradient(135deg, rgba(10,35,20,0.9) 0%, rgba(5,15,10,0.95) 100%);
          border-bottom: 1px solid rgba(240,165,0,0.1);
          padding: 28px 28px 24px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .login-header::before {
          content: ''; position: absolute; inset: 0;
          background: repeating-linear-gradient(-55deg, transparent, transparent 30px, rgba(240,165,0,0.012) 30px, rgba(240,165,0,0.012) 31px);
        }

        /* Scout emblem */
        .login-emblem {
          width: 56px; height: 56px; border-radius: 50%;
          background: rgba(240,165,0,0.08); border: 1px solid rgba(240,165,0,0.25);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px; font-size: 26px;
          position: relative; z-index: 1;
          animation: emblemPulse 3s ease-in-out infinite;
        }
        @keyframes emblemPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(240,165,0,0); }
          50% { box-shadow: 0 0 0 8px rgba(240,165,0,0.06); }
        }

        /* ── FORM BODY ── */
        .login-body { padding: 28px; }

        /* password wrapper */
        .pass-wrap { position: relative; }
        .pass-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; padding: 4px;
          color: rgba(255,255,255,0.25); transition: color 0.2s;
        }
        .pass-toggle:hover { color: rgba(255,255,255,0.5); }

        /* error shake */
        .error-box {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,80,80,0.07);
          border: 1px solid rgba(255,80,80,0.2);
          border-radius: 8px; padding: 10px 14px;
          animation: errShake 0.4s ease;
        }
        @keyframes errShake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }

        /* submit btn */
        .login-btn {
          width: 100%; background: #f0a500;
          border: none; border-radius: 8px; padding: 14px;
          font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: #000;
          cursor: pointer; transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
          box-shadow: 0 4px 20px rgba(240,165,0,0.25);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .login-btn:hover:not(:disabled) {
          background: #ffc107; transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(240,165,0,0.4);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* spinner */
        .spin {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.3); border-top-color: #000;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* divider */
        .lg-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
        .lg-div-line { flex:1; height:1px; background: rgba(255,255,255,0.05); }

        /* back link */
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          color: rgba(255,255,255,0.2); text-decoration: none;
          letter-spacing: 0.08em;
          transition: color 0.2s;
          cursor: pointer; background: none; border: none;
        }
        .back-link:hover { color: rgba(255,255,255,0.5); }

        /* section label */
        .lg-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(240,165,0,0.08); border: 1px solid rgba(240,165,0,0.2);
          border-radius: 100px; padding: 4px 12px;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase; color: #f0a500;
          margin-bottom: 14px;
        }
        .lg-pulse { width:5px; height:5px; border-radius:50%; background:#f0a500; animation: lgPulse 2s infinite; }
        @keyframes lgPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.3;transform:scale(0.7);} }
      `}</style>

      <div className="login-root">
        <div className="login-page">
          <div className="login-grid-bg" />
          <div className="login-orb-1" />
          <div className="login-orb-2" />

          <div className={`login-card lg-reveal lgd1 ${isVisible ? 'show' : ''}`}>

            {/* ── HEADER ── */}
            <div className="login-header">
              <div className="login-emblem">⚜️</div>
              <div className="lg-pill" style={{ position: 'relative', zIndex: 1 }}>
                <span className="lg-pulse" />
                Admin Access
              </div>
              <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(1.1rem,4vw,1.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, position: 'relative', zIndex: 1, marginBottom: 4 }}>
                Rover Scout <span style={{ color: '#f0a500' }}>Portal</span>
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', position: 'relative', zIndex: 1 }}>
                Qadirabad Cantonment Sapper College
              </p>
            </div>

            {/* ── FORM ── */}
            <div className="login-body">

              {/* Error */}
              {error && (
                <div className="error-box" style={{ marginBottom: 20 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,80,80,0.8)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'rgba(255,120,120,0.9)' }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Email */}
                <div className={`lg-reveal lgd2 ${isVisible ? 'show' : ''}`}>
                  <label style={{ display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <input
                      type="email" required
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ ...inp('email'), paddingLeft: 42 }}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className={`lg-reveal lgd3 ${isVisible ? 'show' : ''}`}>
                  <label style={{ display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
                    Password
                  </label>
                  <div className="pass-wrap">
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    </div>
                    <input
                      type={showPass ? 'text' : 'password'} required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ ...inp('password'), paddingLeft: 42, paddingRight: 44 }}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused('')}
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                      {showPass ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className={`lg-reveal lgd4 ${isVisible ? 'show' : ''}`}>
                  <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? (
                      <><div className="spin" /> Signing In...</>
                    ) : (
                      'Sign In →'
                    )}
                  </button>
                </div>

              </form> 

              {/* Divider */}
              <div className="lg-divider">
                <div className="lg-div-line" />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Secure Login</span>
                <div className="lg-div-line" />
              </div>

              {/* Back to site */}
              <div style={{ textAlign: 'center' }}>
                <button className="back-link" onClick={() => navigate('/')}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                  Back to Main Site
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;