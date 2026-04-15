import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase.config"; 

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const itemRefs = useRef({});

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const images = snapshot.docs.map(doc => doc.data().url);
      setGalleryImages(images);
      setLoading(false);
    });
    const t = setTimeout(() => setIsVisible(true), 80);
    return () => {
      unsubscribe();
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (galleryImages.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, Number(entry.target.dataset.index)]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    Object.values(itemRefs.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [galleryImages]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((p) => (p + 1) % galleryImages.length);
      if (e.key === 'ArrowLeft') setLightbox((p) => (p - 1 + galleryImages.length) % galleryImages.length);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightbox, galleryImages.length]);

  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      setLightbox((p) => diff > 0 ? (p + 1) % galleryImages.length : (p - 1 + galleryImages.length) % galleryImages.length);
    }
    touchStart.current = null;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .gallery-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .gallery-page { min-height: 100svh; background: #070c0a; padding: 90px 16px 60px; position: relative; overflow: hidden; font-family: 'DM Sans', sans-serif; }
        .g-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(180,130,40,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(180,130,40,0.04) 1px, transparent 1px); background-size: 44px 44px; mask-image: radial-gradient(ellipse 90% 60% at 50% 30%, black 20%, transparent 100%); }
        .g-orb-1 { position:absolute; width:320px; height:320px; border-radius:50%; background: radial-gradient(circle, rgba(20,90,55,0.18) 0%, transparent 70%); top:-80px; right:-60px; filter:blur(60px); animation: gOrbFloat 10s ease-in-out infinite; }
        .g-orb-2 { position:absolute; width:240px; height:240px; border-radius:50%; background: radial-gradient(circle, rgba(202,138,4,0.12) 0%, transparent 70%); bottom:10%; left:-60px; filter:blur(60px); animation: gOrbFloat 13s ease-in-out infinite reverse; }
        @keyframes gOrbFloat { 0%,100% { transform:translate(0,0); } 50% { transform:translate(16px,20px); } }
        @keyframes galSpin { to { transform: rotate(360deg); } }
        @keyframes galPulseRing { 0%,100% { opacity:0.4; transform:scale(1); } 50% { opacity:1; transform:scale(1.08); } }
        @keyframes galDotBlink { 0%,80%,100%{opacity:0;transform:scale(0.7)} 40%{opacity:1;transform:scale(1)} }
        .g-reveal { opacity:0; transform:translateY(20px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .g-reveal.show { opacity:1; transform:translateY(0); }
        .gd1{transition-delay:0.1s} .gd2{transition-delay:0.25s} .gd3{transition-delay:0.4s}
        .g-section-label { display:inline-flex; align-items:center; gap:8px; background: rgba(240,165,0,0.08); border: 1px solid rgba(240,165,0,0.2); border-radius:100px; padding:5px 14px; font-size:10px; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; color:#f0a500; }
        .g-pulse { width:5px; height:5px; border-radius:50%; background:#f0a500; animation:gPulse 2s infinite; }
        @keyframes gPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.3;transform:scale(0.7);} }
        .g-masonry { columns: 2; column-gap: 10px; }
        @media(min-width:640px) { .g-masonry { columns: 3; column-gap: 12px; } }
        @media(min-width:1024px) { .g-masonry { columns: 4; column-gap: 14px; } }
        .g-masonry-item { break-inside: avoid; margin-bottom: 10px; border-radius: 12px; overflow: hidden; position: relative; cursor: pointer; opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease; }
        .g-masonry-item.visible { opacity:1; transform:translateY(0); }
        .g-masonry-item:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
        .img-wrap { position:relative; width:100%; overflow:hidden; border-radius:12px; }
        .img-wrap img { width:100%; height:100%; object-fit:cover; display:block; transition: transform 0.5s ease; }
        .g-masonry-item:hover .img-wrap img { transform:scale(1.05); }
        .img-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(5,9,8,0.85) 0%, transparent 55%); opacity:0; transition:opacity 0.3s ease; display:flex; flex-direction:column; justify-content:flex-end; padding:14px; border-radius:12px; }
        .g-masonry-item:hover .img-overlay { opacity:1; }
        .lightbox-backdrop { position:fixed; inset:0; background:rgba(5,9,8,0.97); z-index:2000; display:flex; align-items:center; justify-content:center; animation:lbFadeIn 0.2s ease; padding:16px; }
        @keyframes lbFadeIn { from{opacity:0} to{opacity:1} }
        .lightbox-img-wrap { position:relative; max-width:min(92vw, 900px); max-height:85svh; border-radius:16px; overflow:hidden; box-shadow:0 40px 80px rgba(0,0,0,0.8); animation:lbSlideIn 0.25s ease; }
        @keyframes lbSlideIn { from{transform:scale(0.95);opacity:0} to{transform:scale(1);opacity:1} }
        .lightbox-img-wrap img { display:block; max-width:100%; max-height:85svh; object-fit:contain; border-radius:16px; }
        .lb-close { position:fixed; top:20px; right:20px; width:40px; height:40px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; color:rgba(255,255,255,0.7); z-index:2001; }
        .lb-nav-btn { position:fixed; top:50%; transform:translateY(-50%); width:44px; height:44px; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; color:rgba(255,255,255,0.6); font-size:20px; z-index:2001; user-select:none; }
        .lb-prev { left:12px; } .lb-next { right:12px; }
        .lb-info { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); z-index:2001; }
        .lb-counter { font-family:'DM Sans',sans-serif; font-size:11px; color:rgba(255,255,255,0.3); }
        .g-divider { display:flex; align-items:center; gap:12px; margin:6px 0; }
        .g-divider-line { flex:1; height:1px; background:linear-gradient(to right, transparent, rgba(255,255,255,0.06)); }
        .g-divider-line.rev { background:linear-gradient(to left, transparent, rgba(255,255,255,0.06)); }

        /* Loading dots */
        .g-loading-dot { display:inline-block; width:5px; height:5px; border-radius:50%; background:rgba(240,165,0,0.5); animation: galDotBlink 1.4s ease-in-out infinite; }
        .g-loading-dot:nth-child(2) { animation-delay:0.2s; }
        .g-loading-dot:nth-child(3) { animation-delay:0.4s; }
      `}</style>

      <div className="gallery-root">
        {lightbox !== null && (
          <div className="lightbox-backdrop" onClick={() => setLightbox(null)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
            <button className="lb-nav-btn lb-prev" onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p - 1 + galleryImages.length) % galleryImages.length); }}>‹</button>
            <div className="lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
              <img src={galleryImages[lightbox]} alt="Memories" />
            </div>
            <button className="lb-nav-btn lb-next" onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p + 1) % galleryImages.length); }}>›</button>
            <div className="lb-info"><span className="lb-counter">{lightbox + 1} / {galleryImages.length}</span></div>
          </div>
        )}

        <div className="gallery-page" ref={sectionRef}>
          <div className="g-grid-bg" /><div className="g-orb-1" /><div className="g-orb-2" />
          <div style={{ maxWidth:'1200px', margin:'0 auto', position:'relative', zIndex:10 }}>

            {/* Header */}
            <div style={{ textAlign:'center', marginBottom:'32px' }}>
              <div className={`g-reveal gd1 ${isVisible ? 'show' : ''}`} style={{ display:'flex', justifyContent:'center', marginBottom:'14px' }}>
                <span className="g-section-label"><span className="g-pulse" />Our Memories</span>
              </div>
              <h2 className={`g-reveal gd2 ${isVisible ? 'show' : ''}`} style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(1.6rem,6vw,2.8rem)', fontWeight:800, color:'#fff', marginBottom:'8px' }}>
                Photo <span style={{color:'#f0a500'}}>Gallery</span>
              </h2>
              <p className={`g-reveal gd3 ${isVisible ? 'show' : ''}`} style={{ fontSize:'13px', color:'rgba(255,255,255,0.3)' }}>
                Moments captured from our activities &amp; events
              </p>
              <div className="g-divider" style={{ maxWidth:'200px', margin:'14px auto 0' }}>
                <div className="g-divider-line rev" />
                <span style={{ color:'rgba(240,165,0,0.5)' }}>⬧</span>
                <div className="g-divider-line" />
              </div>
            </div>

            {/* ── Loading State ── */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: 20 }}>

                {/* Spinner rings */}
                <div style={{ position: 'relative', width: 56, height: 56 }}>
                  {/* Outer pulse ring */}
                  <div style={{
                    position: 'absolute', inset: -6, borderRadius: '50%',
                    border: '1px solid rgba(240,165,0,0.1)',
                    animation: 'galPulseRing 2s ease-in-out infinite',
                  }} />
                  {/* Static ring */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: '1px solid rgba(240,165,0,0.12)',
                  }} />
                  {/* Spinning arc */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: '2px solid transparent',
                    borderTopColor: 'rgba(240,165,0,0.7)',
                    borderRightColor: 'rgba(240,165,0,0.2)',
                    animation: 'galSpin 0.9s linear infinite',
                  }} />
                  {/* Inner dot */}
                  <div style={{
                    position: 'absolute', inset: '50%', marginLeft: -3, marginTop: -3,
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'rgba(240,165,0,0.5)',
                    animation: 'galPulseRing 1.8s ease-in-out infinite',
                  }} />
                </div>

                {/* Text */}
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '12px', fontWeight: 700,
                    color: 'rgba(240,165,0,0.55)',
                    letterSpacing: '0.25em', textTransform: 'uppercase',
                    margin: '0 0 8px',
                  }}>
                    Loading Gallery
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '11px', color: 'rgba(255,255,255,0.18)',
                      letterSpacing: '0.06em',
                    }}>Fetching memories</span>
                    <span className="g-loading-dot" />
                    <span className="g-loading-dot" />
                    <span className="g-loading-dot" />
                  </div>
                </div>

                {/* Decorative divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, opacity: 0.4 }}>
                  <div style={{ width: 30, height: 1, background: 'linear-gradient(to right, transparent, rgba(240,165,0,0.3))' }} />
                  <span style={{ color: 'rgba(240,165,0,0.4)', fontSize: 10 }}>⬧</span>
                  <div style={{ width: 30, height: 1, background: 'linear-gradient(to left, transparent, rgba(240,165,0,0.3))' }} />
                </div>

              </div>
            ) : (
              <div className="g-masonry">
                {galleryImages.map((src, idx) => (
                  <div
                    key={idx}
                    className={`g-masonry-item ${visibleItems.has(idx) ? 'visible' : ''}`}
                    style={{ transitionDelay: `${(idx % 8) * 0.06}s` }}
                    data-index={idx}
                    ref={(el) => { itemRefs.current[idx] = el; }}
                    onClick={() => setLightbox(idx)}
                  >
                    <div className="img-wrap">
                      <img src={src} alt="Gallery Item" loading="lazy" style={{ aspectRatio: idx % 4 === 0 ? '3/4' : '1/1' }} />
                      <div className="img-overlay">
                        <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)' }}>Tap to expand ↗</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;