import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.config";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [focused, setFocused] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', subject: '', message: '' });

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // ✅ FIXED: 'messages' collection use করা হচ্ছে (admin dashboard এর সাথে match)
      await addDoc(collection(db, "messages"), {
        name: formData.name,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        read: false,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("দুঃখিত, মেসেজ পাঠানো যায়নি। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Premium SVG Icons ──────────────────────────────────────────
  const LocationIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C7.58 2 4 5.58 4 10c0 6.56 7.28 11.5 7.58 11.7.13.09.28.13.42.13s.29-.04.42-.13C12.72 21.5 20 16.56 20 10c0-4.42-3.58-8-8-8z" fill="rgba(240,165,0,0.15)" stroke="#f0a500" strokeWidth="1.5"/>
      <circle cx="12" cy="10" r="3" fill="rgba(240,165,0,0.3)" stroke="#f0a500" strokeWidth="1.5"/>
    </svg>
  );

  const PhoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="2" width="14" height="20" rx="3" fill="rgba(240,165,0,0.1)" stroke="#f0a500" strokeWidth="1.5"/>
      <circle cx="12" cy="17.5" r="1.2" fill="#f0a500"/>
      <path d="M9 5.5h6" stroke="#f0a500" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const EmailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" fill="rgba(240,165,0,0.1)" stroke="#f0a500" strokeWidth="1.5"/>
      <path d="M3 7l9 6 9-6" stroke="#f0a500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ClockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="rgba(240,165,0,0.1)" stroke="#f0a500" strokeWidth="1.5"/>
      <path d="M12 7v5l3 3" stroke="#f0a500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="1.2" fill="#f0a500"/>
    </svg>
  );

  const SendIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22l-4-9-9-4 20-7z" fill="currentColor" opacity="0.9"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17l-5-5" stroke="#f0a500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const FbIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" fill="#1877F2"/>
    </svg>
  );

  const contactInfo = [
    { icon: <LocationIcon />, label: 'Address', value: 'Qadirabad Cantonment Sapper College, Natore, Bangladesh' },
    { icon: <PhoneIcon />,    label: 'Phone',   value: '+880 1309-123887' },
    { icon: <EmailIcon />,    label: 'Email',   value: 'roverscout@qcsc.edu.bd' },
    { icon: <ClockIcon />,    label: 'Active Hours', value: 'Sat – Thu, 9:00 AM – 4:00 PM' },
  ];

  const inputStyle = (name) => ({
    width: '100%',
    background: focused === name ? 'rgba(240,165,0,0.04)' : 'rgba(255,255,255,0.025)',
    border: `1px solid ${focused === name ? 'rgba(240,165,0,0.55)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '10px',
    padding: '13px 16px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border 0.25s, background 0.25s, box-shadow 0.25s',
    boxShadow: focused === name ? '0 0 0 4px rgba(240,165,0,0.06), inset 0 1px 0 rgba(255,255,255,0.04)' : 'inset 0 1px 0 rgba(255,255,255,0.02)',
    resize: 'none',
    letterSpacing: '0.01em',
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        .contact-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .contact-root input::placeholder,
        .contact-root textarea::placeholder { color: rgba(255,255,255,0.16); font-style: italic; }
        .contact-root input, .contact-root textarea { caret-color: #f0a500; }
        .contact-root input:-webkit-autofill,
        .contact-root textarea:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 30px #0d1a15 inset !important;
          -webkit-text-fill-color: #fff !important;
        }

        /* ── Page shell ─────────────────────────────────────── */
        .contact-page {
          min-height: 100svh;
          background: #070c0a;
          padding: 90px 16px 60px;
          position: relative; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        @media (min-width:640px)  { .contact-page { padding: 110px 24px 80px; } }
        @media (min-width:1024px) { .contact-page { padding: 120px 48px 100px; } }

        /* ── Ambient BG ─────────────────────────────────────── */
        .contact-noise {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          opacity: 0.6;
        }
        .c-grid-bg {
          position: absolute; inset: 0; z-index: 1;
          background-image:
            linear-gradient(rgba(180,130,40,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,130,40,0.035) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 20%, black 10%, transparent 100%);
        }
        .c-orb-1 {
          position: absolute; width: 380px; height: 380px; border-radius: 50%;
          background: radial-gradient(circle, rgba(15,80,45,0.22) 0%, transparent 70%);
          top: -100px; left: -100px; filter: blur(60px); z-index: 1;
          animation: cOrbFloat 11s ease-in-out infinite;
        }
        .c-orb-2 {
          position: absolute; width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(200,130,0,0.12) 0%, transparent 70%);
          bottom: 8%; right: -60px; filter: blur(60px); z-index: 1;
          animation: cOrbFloat 14s ease-in-out infinite reverse;
        }
        .c-orb-3 {
          position: absolute; width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(30,100,60,0.1) 0%, transparent 70%);
          top: 40%; left: 45%; filter: blur(50px); z-index: 1;
          animation: cOrbFloat 9s ease-in-out infinite 3s;
        }
        @keyframes cOrbFloat {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(16px,20px); }
        }

        /* ── Reveal animations ──────────────────────────────── */
        .c-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.75s cubic-bezier(.16,1,.3,1), transform 0.75s cubic-bezier(.16,1,.3,1); }
        .c-reveal.show { opacity: 1; transform: translateY(0); }
        .cd1{transition-delay:0.08s} .cd2{transition-delay:0.2s}
        .cd3{transition-delay:0.35s} .cd4{transition-delay:0.5s}

        /* ── Header elements ────────────────────────────────── */
        .c-section-label {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(240,165,0,0.07); border: 1px solid rgba(240,165,0,0.18);
          border-radius: 100px; padding: 6px 16px;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase; color: #f0a500;
          backdrop-filter: blur(6px);
        }
        .c-pulse {
          width: 5px; height: 5px; border-radius: 50%; background: #f0a500;
          box-shadow: 0 0 0 0 rgba(240,165,0,0.5);
          animation: cPulse 2.2s infinite;
        }
        @keyframes cPulse {
          0%   { box-shadow: 0 0 0 0 rgba(240,165,0,0.5); }
          60%  { box-shadow: 0 0 0 6px rgba(240,165,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(240,165,0,0); }
        }
        .c-divider { display: flex; align-items: center; gap: 12px; }
        .c-divider-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(240,165,0,0.2)); }
        .c-divider-line.rev { background: linear-gradient(to left, transparent, rgba(240,165,0,0.2)); }

        /* ── Main grid ──────────────────────────────────────── */
        .contact-grid {
          display: grid; grid-template-columns: 1fr; gap: 20px;
        }
        @media (min-width:1024px) {
          .contact-grid { grid-template-columns: 1fr 1.6fr; gap: 36px; align-items: start; }
        }

        /* ── Info card ──────────────────────────────────────── */
        .info-card {
          background: rgba(255,255,255,0.018);
          border: 1px solid rgba(255,255,255,0.065);
          border-radius: 20px; padding: 26px 22px;
          position: relative; overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        @media (min-width:640px) { .info-card { padding: 32px 28px; } }
        .info-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 5%, rgba(240,165,0,0.5) 50%, transparent 95%);
        }
        .info-card::after {
          content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 1px;
          background: linear-gradient(180deg, rgba(240,165,0,0.4) 0%, transparent 60%);
        }

        .info-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: all 0.25s ease;
        }
        .info-item:hover { transform: translateX(4px); }
        .info-item:last-of-type { border-bottom: none; padding-bottom: 0; }

        .info-icon-wrap {
          width: 42px; height: 42px; flex-shrink: 0; border-radius: 12px;
          background: linear-gradient(135deg, rgba(240,165,0,0.12), rgba(240,165,0,0.04));
          border: 1px solid rgba(240,165,0,0.18);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 12px rgba(240,165,0,0.08), inset 0 1px 0 rgba(255,255,255,0.05);
          transition: all 0.25s ease;
        }
        .info-item:hover .info-icon-wrap {
          background: linear-gradient(135deg, rgba(240,165,0,0.2), rgba(240,165,0,0.08));
          border-color: rgba(240,165,0,0.35);
          box-shadow: 0 4px 20px rgba(240,165,0,0.15);
        }
        .info-label {
          font-size: 9.5px; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; color: rgba(240,165,0,0.55); margin-bottom: 4px;
          font-family: 'DM Sans', sans-serif;
        }
        .info-value {
          font-size: 13px; color: rgba(255,255,255,0.6);
          line-height: 1.6; font-family: 'DM Sans', sans-serif; font-weight: 400;
        }
        @media (min-width:640px) { .info-value { font-size: 13.5px; } }

        /* ── FB button ──────────────────────────────────────── */
        .fb-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          text-decoration: none; color: rgba(255,255,255,0.7);
          background: rgba(24,119,242,0.08);
          border: 1px solid rgba(24,119,242,0.2);
          padding: 12px 20px; border-radius: 10px;
          transition: all 0.3s ease;
          margin-top: 18px;
          position: relative; overflow: hidden;
        }
        .fb-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(24,119,242,0.1) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .fb-btn:hover { background: rgba(24,119,242,0.14); border-color: rgba(24,119,242,0.4); color: #fff; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(24,119,242,0.15); }
        .fb-btn:hover::before { opacity: 1; }

        /* ── Map ────────────────────────────────────────────── */
        .map-wrap {
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.065);
          margin-top: 18px; height: 155px; position: relative;
          box-shadow: 0 4px 24px rgba(0,0,0,0.35);
        }
        @media (min-width:640px) { .map-wrap { height: 175px; } }
        .map-wrap iframe { width: 100%; height: 100%; border: none; display: block; filter: saturate(0.7) brightness(0.85); }
        .map-overlay-label {
          position: absolute; top: 10px; left: 10px; z-index: 2;
          background: rgba(5,10,8,0.9); border: 1px solid rgba(240,165,0,0.25);
          border-radius: 6px; padding: 4px 11px;
          font-size: 10px; letter-spacing: 0.14em;
          text-transform: uppercase; color: #f0a500;
          backdrop-filter: blur(6px); font-family: 'DM Sans', sans-serif; font-weight: 500;
        }

        /* ── Form card ──────────────────────────────────────── */
        .form-card {
          background: rgba(255,255,255,0.018);
          border: 1px solid rgba(255,255,255,0.065);
          border-radius: 20px; padding: 26px 22px;
          position: relative; overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        @media (min-width:640px) { .form-card { padding: 36px 32px; } }
        .form-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 5%, rgba(240,165,0,0.45) 50%, transparent 95%);
        }
        .form-card::after {
          content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 1px;
          background: linear-gradient(180deg, rgba(240,165,0,0.35) 0%, transparent 60%);
        }

        .form-2col { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width:500px) { .form-2col { grid-template-columns: 1fr 1fr; } }

        .field-label {
          display: block; font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); margin-bottom: 8px;
        }

        /* ── Submit button ──────────────────────────────────── */
        .c-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #f0a500 0%, #d4920a 100%);
          border: none; border-radius: 10px; padding: 15px;
          font-family: 'Cinzel', serif; font-size: 11.5px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase; color: #000;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 9px;
          transition: all 0.3s cubic-bezier(.16,1,.3,1);
          box-shadow: 0 4px 20px rgba(240,165,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2);
          margin-top: 6px; position: relative; overflow: hidden;
        }
        .c-submit-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
          opacity: 0; transition: opacity 0.3s;
        }
        .c-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(240,165,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
          background: linear-gradient(135deg, #ffc107 0%, #f0a500 100%);
        }
        .c-submit-btn:hover::before { opacity: 1; }
        .c-submit-btn:active { transform: translateY(0); }
        .c-submit-btn:disabled {
          background: linear-gradient(135deg, #555 0%, #444 100%);
          cursor: not-allowed; box-shadow: none; transform: none;
          color: rgba(0,0,0,0.5);
        }

        /* ── Spinner ────────────────────────────────────────── */
        .c-spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #000;
          animation: cSpin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes cSpin { to { transform: rotate(360deg); } }

        /* ── Success state ──────────────────────────────────── */
        .c-success {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 50px 20px 42px;
          text-align: center; animation: cSuccessFade 0.5s cubic-bezier(.16,1,.3,1);
        }
        @keyframes cSuccessFade { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .c-success-ring {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(240,165,0,0.15), rgba(240,165,0,0.05));
          border: 1px solid rgba(240,165,0,0.3);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 0 0 8px rgba(240,165,0,0.05), 0 8px 32px rgba(240,165,0,0.12);
          animation: cSuccessRing 0.5s 0.15s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes cSuccessRing {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }

        /* ── Card heading ───────────────────────────────────── */
        .card-heading {
          font-family: 'Cinzel', serif;
          font-size: clamp(1rem, 3.5vw, 1.2rem);
          font-weight: 700; color: #fff; margin-bottom: 5px; letter-spacing: 0.02em;
        }
        .card-sub {
          font-size: 12px; color: rgba(255,255,255,0.28); font-weight: 300;
          letter-spacing: 0.05em; margin-bottom: 22px; font-family: 'DM Sans', sans-serif;
        }

        /* ── Decorative corner ──────────────────────────────── */
        .corner-deco {
          position: absolute; bottom: -1px; right: -1px; width: 40px; height: 40px;
          border-right: 1px solid rgba(240,165,0,0.2); border-bottom: 1px solid rgba(240,165,0,0.2);
          border-radius: 0 0 18px 0; pointer-events: none;
        }
      `}</style>

      <div className="contact-root">
        <div className="contact-page">

          {/* Background layers */}
          <div className="contact-noise" />
          <div className="c-grid-bg" />
          <div className="c-orb-1" />
          <div className="c-orb-2" />
          <div className="c-orb-3" />

          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

            {/* ── Header ──────────────────────────────────────── */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div className={`c-reveal cd1 ${isVisible ? 'show' : ''}`} style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <span className="c-section-label"><span className="c-pulse" />Get In Touch</span>
              </div>
              <h2 className={`c-reveal cd2 ${isVisible ? 'show' : ''}`}
                style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(1.7rem,6vw,3rem)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:'10px', letterSpacing:'-0.01em' }}>
                Contact <span style={{ color:'#f0a500', textShadow:'0 0 40px rgba(240,165,0,0.3)' }}>Us</span>
              </h2>
              <p className={`c-reveal cd3 ${isVisible ? 'show' : ''}`}
                style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', color:'rgba(255,255,255,0.28)', fontWeight:300, letterSpacing:'0.06em' }}>
                We'd love to hear from you — reach out anytime
              </p>
              <div className="c-divider" style={{ maxWidth:'180px', margin:'16px auto 0' }}>
                <div className="c-divider-line rev" />
                <span style={{ color:'rgba(240,165,0,0.45)', fontSize:'13px' }}>⬧</span>
                <div className="c-divider-line" />
              </div>
            </div>

            {/* ── Grid ─────────────────────────────────────────── */}
            <div className="contact-grid">

              {/* LEFT — Info */}
              <div className={`c-reveal cd3 ${isVisible ? 'show' : ''}`}>
                <div className="info-card">
                  <div className="corner-deco" />
                  <p className="card-heading">Our Information</p>
                  <p className="card-sub">Find us or drop a message</p>

                  {contactInfo.map((item, i) => (
                    <div className="info-item" key={i}>
                      <div className="info-icon-wrap">{item.icon}</div>
                      <div>
                        <p className="info-label">{item.label}</p>
                        <p className="info-value">{item.value}</p>
                      </div>
                    </div>
                  ))}

                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="fb-btn">
                    <FbIcon />
                    Follow us on Facebook
                  </a>

                  <div className="map-wrap">
                    <iframe
                      title="QCSC Location"
                      src="https://maps.google.com/maps?q=Qadirabad+Cantonment+Sapper+College+Natore+Bangladesh&output=embed&z=15"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="map-overlay-label">QCSC · Natore</div>
                  </div>
                </div>
              </div>

              {/* RIGHT — Form */}
              <div className={`c-reveal cd4 ${isVisible ? 'show' : ''}`}>
                <div className="form-card">
                  <div className="corner-deco" />
                  {submitted ? (
                    <div className="c-success">
                      <div className="c-success-ring"><CheckIcon /></div>
                      <p style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(1.1rem,4vw,1.45rem)', fontWeight:700, color:'#fff', marginBottom:'10px', letterSpacing:'0.02em' }}>
                        Message Sent!
                      </p>
                      <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.35)', lineHeight:1.8, maxWidth:'290px', fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>
                        Thank you for reaching out. We'll get back to you as soon as possible.
                      </p>
                      <button
                        onClick={() => { setSubmitted(false); setFormData({ name:'', phone:'', subject:'', message:'' }); }}
                        style={{ marginTop:'24px', background:'transparent', border:'1px solid rgba(255,255,255,0.09)', borderRadius:'8px', padding:'10px 22px', color:'rgba(255,255,255,0.35)', fontFamily:"'DM Sans',sans-serif", fontSize:'10.5px', letterSpacing:'0.14em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.2s' }}>
                        Send Another
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="card-heading">Send a Message</p>
                      <p className="card-sub">We'll respond within 24 hours</p>
                      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                        <div className="form-2col">
                          <div>
                            <label className="field-label">Full Name</label>
                            <input name="name" type="text" required placeholder="Your name"
                              value={formData.name} onChange={handleChange}
                              style={inputStyle('name')}
                              onFocus={() => setFocused('name')} onBlur={() => setFocused('')} />
                          </div>
                          <div>
                            <label className="field-label">Phone</label>
                            <input name="phone" type="tel" required placeholder="01XXXXXXXXX"
                              value={formData.phone} onChange={handleChange}
                              style={inputStyle('phone')}
                              onFocus={() => setFocused('phone')} onBlur={() => setFocused('')} />
                          </div>
                        </div>
                        <div>
                          <label className="field-label">Subject</label>
                          <input name="subject" type="text" required placeholder="What's this about?"
                            value={formData.subject} onChange={handleChange}
                            style={inputStyle('subject')}
                            onFocus={() => setFocused('subject')} onBlur={() => setFocused('')} />
                        </div>
                        <div>
                          <label className="field-label">Message</label>
                          <textarea name="message" required rows={5} placeholder="Write your message here..."
                            value={formData.message} onChange={handleChange}
                            style={inputStyle('message')}
                            onFocus={() => setFocused('message')} onBlur={() => setFocused('')} />
                        </div>
                        <button type="submit" className="c-submit-btn" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <><span className="c-spinner" /> Sending...</>
                          ) : (
                            <><SendIcon /> Send Message</>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;