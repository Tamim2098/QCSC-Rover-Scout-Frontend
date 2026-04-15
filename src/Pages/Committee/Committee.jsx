import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, doc } from "firebase/firestore";
import { db } from "../../firebase.config";

// Placeholder avatar with initials
const Avatar = ({ name, size = 80 }) => {
  const initials = name ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?';
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(240,165,0,0.15) 0%, rgba(20,80,50,0.3) 100%)',
      border: '1px solid rgba(240,165,0,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Cinzel', serif",
      fontSize: size * 0.28,
      fontWeight: 700,
      color: 'rgba(240,165,0,0.7)',
      flexShrink: 0,
      letterSpacing: '0.05em',
    }}>
      {initials}
    </div>
  );
};

const Committee = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState('2025 – 2026');
  const cardRefs = useRef({});

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // ── Firebase থেকে রিয়েল-টাইম ডাটা ফেচ করা ──
  useEffect(() => {
    const q = query(collection(db, 'committee'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCommittee(data);
      setLoading(false);
    });
    const unsubSession = onSnapshot(doc(db, 'settings', 'committee'), s => {
      if (s.exists() && s.data().session) setSession(s.data().session);
    });
    return () => { unsubscribe(); unsubSession(); };
  }, []);

  // ডাটা আলাদা করা (President এবং Members)
  const president = committee.find(m => m.type === 'president');
  const members = committee.filter(m => m.type === 'member');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, e.target.dataset.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    Object.values(cardRefs.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [members]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#070c0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, position: 'relative', overflow: 'hidden' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,90,55,0.18) 0%, transparent 70%)', top: -80, right: -80, filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(202,138,4,0.12) 0%, transparent 70%)', bottom: '8%', left: -60, filter: 'blur(60px)' }} />

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
          @keyframes cmteSpin { to { transform: rotate(360deg); } }
          @keyframes cmtePulseRing { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
          @keyframes cmteDotBlink { 0%,80%,100%{opacity:0;transform:scale(0.7)} 40%{opacity:1;transform:scale(1)} }
          .cmte-ld-dot { display:inline-block; width:5px; height:5px; border-radius:50%; background:rgba(240,165,0,0.5); animation:cmteDotBlink 1.4s ease-in-out infinite; }
          .cmte-ld-dot:nth-child(2){animation-delay:0.2s}
          .cmte-ld-dot:nth-child(3){animation-delay:0.4s}
        `}</style>

        {/* Spinner */}
        <div style={{ position: 'relative', width: 56, height: 56 }}>
          <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '1px solid rgba(240,165,0,0.1)', animation: 'cmtePulseRing 2s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(240,165,0,0.12)' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: 'rgba(240,165,0,0.7)', borderRightColor: 'rgba(240,165,0,0.2)', animation: 'cmteSpin 0.9s linear infinite' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -3, marginTop: -3, width: 6, height: 6, borderRadius: '50%', background: 'rgba(240,165,0,0.5)', animation: 'cmtePulseRing 1.8s ease-in-out infinite' }} />
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 700, color: 'rgba(240,165,0,0.55)', letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Loading Team
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>Fetching committee</span>
            <span className="cmte-ld-dot" />
            <span className="cmte-ld-dot" />
            <span className="cmte-ld-dot" />
          </div>
        </div>

        {/* Decorative divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.4 }}>
          <div style={{ width: 30, height: 1, background: 'linear-gradient(to right, transparent, rgba(240,165,0,0.3))' }} />
          <span style={{ color: 'rgba(240,165,0,0.4)', fontSize: 10 }}>⬧</span>
          <div style={{ width: 30, height: 1, background: 'linear-gradient(to left, transparent, rgba(240,165,0,0.3))' }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .cmte-root * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── PAGE ── */
        .cmte-page {
          min-height: 100svh;
          background: #070c0a;
          padding: 90px 16px 70px;
          position: relative; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        @media (min-width: 640px)  { .cmte-page { padding: 110px 24px 80px; } }
        @media (min-width: 1024px) { .cmte-page { padding: 120px 48px 100px; } }

        /* backgrounds */
        .cmte-grid-bg {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(180,130,40,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,130,40,0.04) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse 90% 60% at 50% 30%, black 20%, transparent 100%);
        }
        .cmte-orb-1 {
          position: absolute; width: 350px; height: 350px; border-radius: 50%;
          background: radial-gradient(circle, rgba(20,90,55,0.18) 0%, transparent 70%);
          top: -80px; right: -80px; filter: blur(60px); z-index: 0;
          animation: cmteOrbFloat 11s ease-in-out infinite;
        }
        .cmte-orb-2 {
          position: absolute; width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, rgba(202,138,4,0.12) 0%, transparent 70%);
          bottom: 8%; left: -60px; filter: blur(60px); z-index: 0;
          animation: cmteOrbFloat 14s ease-in-out infinite reverse;
        }
        @keyframes cmteOrbFloat {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(16px,20px); }
        }

        /* reveals */
        .cm-reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.75s ease, transform 0.75s ease; }
        .cm-reveal.show { opacity: 1; transform: translateY(0); }
        .crd1{transition-delay:0.08s} .crd2{transition-delay:0.2s} .crd3{transition-delay:0.32s}

        /* section label */
        .cmte-label {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(240,165,0,0.08); border: 1px solid rgba(240,165,0,0.2);
          border-radius: 100px; padding: 5px 14px;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase; color: #f0a500;
        }
        .cmte-pulse { width: 5px; height: 5px; border-radius: 50%; background: #f0a500; animation: cmtePulse 2s infinite; }
        @keyframes cmtePulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.3;transform:scale(0.7);} }

        /* divider */
        .cmte-divider { display: flex; align-items: center; gap: 12px; }
        .cmte-div-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.06)); }
        .cmte-div-line.rev { background: linear-gradient(to left, transparent, rgba(255,255,255,0.06)); }

        /* ── PRESIDENT CARD ── */
        .president-card {
          position: relative;
          background: linear-gradient(135deg, rgba(240,165,0,0.07) 0%, rgba(20,60,35,0.15) 50%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(240,165,0,0.2);
          border-radius: 20px;
          padding: 28px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          overflow: hidden;
          max-width: 520px;
          margin: 0 auto 48px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .president-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(240,165,0,0.7), transparent);
        }
        .president-card::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 60% at 30% 50%, rgba(240,165,0,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .president-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(240,165,0,0.15);
        }

        .president-photo-wrap {
          position: relative; flex-shrink: 0;
        }
        .president-photo-ring {
          position: absolute; inset: -5px; border-radius: 50%;
          border: 1px solid rgba(240,165,0,0.3);
          animation: presRing 4s linear infinite;
        }
        .president-photo-ring-2 {
          position: absolute; inset: -10px; border-radius: 50%;
          border: 1px solid rgba(240,165,0,0.1);
        }
        @keyframes presRing {
          0% { transform: rotate(0deg); border-color: rgba(240,165,0,0.3); }
          50% { border-color: rgba(240,165,0,0.6); }
          100% { transform: rotate(360deg); border-color: rgba(240,165,0,0.3); }
        }
        .president-photo {
          width: 80px; height: 80px; border-radius: 50%;
          object-fit: cover; display: block;
          border: 2px solid rgba(240,165,0,0.3);
        }

        .president-info { flex: 1; min-width: 0; }
        .president-badge {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #f0a500; background: rgba(240,165,0,0.1);
          border: 1px solid rgba(240,165,0,0.25);
          border-radius: 4px; padding: 3px 8px; margin-bottom: 6px;
        }
        .president-name {
          font-family: 'Cinzel', serif;
          font-size: clamp(1rem, 3.5vw, 1.3rem);
          font-weight: 700; color: #fff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .president-role {
          font-size: 12px; color: rgba(255,255,255,0.4);
          font-weight: 300; letter-spacing: 0.06em;
          margin-top: 3px;
        }
        .president-fb {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; color: rgba(24,119,242,0.7);
          text-decoration: none;
          transition: color 0.2s;
        }
        .president-fb:hover { color: #1877F2; }

        /* ── MEMBERS SECTION LABEL ── */
        .members-section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          text-align: center; margin-bottom: 20px;
        }

        /* ── MEMBERS GRID ── */
        .members-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        @media (min-width: 560px)  { .members-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; } }
        @media (min-width: 900px)  { .members-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; } }
        @media (min-width: 1100px) { .members-grid { grid-template-columns: repeat(5, 1fr); gap: 16px; } }

        /* Member card */
        .member-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 18px 14px 16px;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 10px;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.3s, background 0.3s, box-shadow 0.3s;
          cursor: default;
          position: relative; overflow: hidden;
        }
        .member-card::before {
          content: ''; position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(240,165,0,0.2), transparent);
          transition: opacity 0.3s;
        }
        .member-card.in-view { opacity: 1; transform: translateY(0); }
        .member-card:hover {
          border-color: rgba(240,165,0,0.2);
          background: rgba(240,165,0,0.03);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
          transform: translateY(-3px);
        }

        .member-photo {
          width: 52px; height: 52px; border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(240,165,0,0.2);
        }
        @media (min-width: 640px) { .member-photo { width: 60px; height: 60px; } }

        .member-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.8);
          line-height: 1.3;
        }
        @media (min-width: 640px) { .member-name { font-size: 13px; } }

        .member-role {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 400;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .member-fb {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(24,119,242,0.08);
          border: 1px solid rgba(24,119,242,0.2);
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          margin-top: 2px;
        }
        .member-fb:hover {
          background: rgba(24,119,242,0.2);
          border-color: rgba(24,119,242,0.5);
          transform: scale(1.1);
        }

        /* Session badge */
        .session-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px; padding: 8px 16px;
          margin: 32px auto 0;
          justify-content: center; max-width: fit-content;
        }
        .session-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; color: rgba(255,255,255,0.25);
          letter-spacing: 0.1em;
        }
        .session-year {
          font-family: 'Cinzel', serif;
          font-size: 12px; color: rgba(240,165,0,0.5);
          font-weight: 600;
        }
      `}</style>

      <div className="cmte-root">
        <div className="cmte-page">
          <div className="cmte-grid-bg" />
          <div className="cmte-orb-1" />
          <div className="cmte-orb-2" />

          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

            {/* ── HEADER ── */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div className={`cm-reveal crd1 ${isVisible ? 'show' : ''}`} style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                <span className="cmte-label">
                  <span className="cmte-pulse" />
                  Our Team
                </span>
              </div>
              <h2
                className={`cm-reveal crd2 ${isVisible ? 'show' : ''}`}
                style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(1.6rem,6vw,2.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '8px' }}
              >
                Scout <span style={{ color: '#f0a500' }}>Committee</span>
              </h2>
              <p
                className={`cm-reveal crd3 ${isVisible ? 'show' : ''}`}
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontWeight: 300, letterSpacing: '0.05em' }}
              >
                The dedicated leaders steering our Rover Scout Group
              </p>
              <div className="cmte-divider" style={{ maxWidth: '200px', margin: '14px auto 0' }}>
                <div className="cmte-div-line rev" />
                <span style={{ color: 'rgba(240,165,0,0.5)', fontSize: '14px' }}>⬧</span>
                <div className="cmte-div-line" />
              </div>
            </div>

            {/* ── PRESIDENT ── */}
            {president && (
              <div className={`cm-reveal crd3 ${isVisible ? 'show' : ''}`}>
                <div className="president-card">
                  <div className="president-photo-wrap">
                    <div className="president-photo-ring-2" />
                    <div className="president-photo-ring" />
                    {president.photo ? (
                      <img src={president.photo} alt={president.name} className="president-photo" />
                    ) : (
                      <Avatar name={president.name} size={80} />
                    )}
                  </div>
                  <div className="president-info">
                    <span className="president-badge">⭐ Leader</span>
                    <p className="president-name">{president.name}</p>
                    <p className="president-role">{president.role}</p>
                    {president.facebook && (
                      <a href={president.facebook} target="_blank" rel="noreferrer" className="president-fb">
                        <svg width="14" height="14" viewBox="0 0 24 24">
                          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" fill="#1877F2"/>
                        </svg>
                        Facebook Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── MEMBERS ── */}
            {members.length > 0 && (
              <>
                <p className="members-section-title">Committee Members</p>
                <div className="members-grid">
                  {members.map((member, idx) => (
                    <div
                      key={member.id}
                      className={`member-card ${visibleCards.has(member.id) ? 'in-view' : ''}`}
                      style={{ transitionDelay: `${(idx % 5) * 0.07}s` }}
                      data-id={member.id}
                      ref={(el) => { cardRefs.current[member.id] = el; }}
                    >
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="member-photo" />
                      ) : (
                        <Avatar name={member.name} size={52} />
                      )}
                      <div style={{ width: '100%' }}>
                        <p className="member-name">{member.name}</p>
                        <p className="member-role">{member.role}</p>
                      </div>
                      {member.facebook && (
                        <a href={member.facebook} target="_blank" rel="noreferrer" className="member-fb" title="Facebook">
                          <svg width="12" height="12" viewBox="0 0 24 24">
                            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" fill="#1877F2"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Empty state */}
            {committee.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.15)', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                <div style={{ fontSize: 22, marginBottom: 10, opacity: 0.2 }}>— —</div>
                No committee members added yet.
              </div>
            )}

            {/* Session info */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="session-badge">
                <span className="session-text">Session</span>
                <span className="session-year">{session}</span>
                <span className="session-text">·</span>
                <span className="session-text">{committee.length} Members</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Committee;