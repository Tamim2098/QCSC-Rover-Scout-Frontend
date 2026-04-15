import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.config";


// ── Auto-redirect success screen ──
const SuccessScreen = ({ onNavigate }) => {
  const [count, setCount] = React.useState(3);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        if (c <= 1) { clearInterval(interval); onNavigate(); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(5,9,8,0.97)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      zIndex:9999, animation:'fadeInFull 0.5s ease', padding:'24px',
    }}>
      <style>{`@keyframes fadeInFull{from{opacity:0}to{opacity:1}} @keyframes popIn{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
      <div style={{
        width:72, height:72, borderRadius:'50%',
        background:'rgba(240,165,0,0.1)', border:'1px solid rgba(240,165,0,0.3)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:32, animation:'popIn 0.5s 0.3s both',
      }}>✓</div>
      <p style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(1.3rem,5vw,1.8rem)', fontWeight:700, color:'#fff', marginTop:20, textAlign:'center' }}>
        Registration Submitted!
      </p>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:8, textAlign:'center', maxWidth:300, lineHeight:1.7 }}>
        We've received your application.<br/>We'll verify and contact you shortly.
      </p>
      {/* Countdown ring */}
      <div style={{ marginTop:28, position:'relative', width:56, height:56 }}>
        <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform:'rotate(-90deg)' }}>
          <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3"/>
          <circle cx="28" cy="28" r="24" fill="none" stroke="#f0a500" strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 24}`}
            strokeDashoffset={`${2 * Math.PI * 24 * (1 - count / 3)}`}
            style={{ transition:'stroke-dashoffset 0.9s linear' }}
          />
        </svg>
        <span style={{
          position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:"'Cinzel',serif", fontSize:18, fontWeight:700, color:'#f0a500',
        }}>{count}</span>
      </div>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:10, letterSpacing:'0.1em' }}>
        Redirecting to Home...
      </p>
    </div>
  );
};

const Join = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible]             = useState(false);
  const [submitted, setSubmitted]             = useState(false);
  const [focused, setFocused]                 = useState('');
  const [gender, setGender]                   = useState('');
  const [photo, setPhoto]                     = useState(null);
  const [photoFile, setPhotoFile]             = useState(null);
  const [loading, setLoading]                 = useState(false);
  const photoInputRef = useRef(null);
  const sectionRef    = useRef(null);

  const [formData, setFormData] = useState({
    name_bn: '', name_en: '', father: '', mother: '',
    dob: '', addr_present: '', addr_perm: '',
    class: '', section: '', roll: '',
    email: '', phone: '', guardian: '', relation: '',
    nid: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Upload photo to Cloudinary (Free)
  const uploadToCloudinary = async (file) => {
    const cloudName = "dac4g49sw";
    const uploadPreset = "rover_image";

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const json = await res.json();
    if (json.secure_url) return json.secure_url;
    throw new Error(json.error?.message || 'Cloudinary upload failed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gender) {
      alert('Please select your gender.');
      return;
    }

    setLoading(true);
    try {
      let photoUrl = '';
      if (photoFile) {
        try {
          photoUrl = await uploadToCloudinary(photoFile);
        } catch (imgErr) {
          console.error('Photo upload failed:', imgErr);
          const proceed = window.confirm('Photo upload failed. Submit without photo?');
          if (!proceed) { setLoading(false); return; }
        }
      }

      await addDoc(collection(db, 'registrations'), {
        ...formData,
        gender,
        photoUrl,
        status: 'pending',
        submittedAt: serverTimestamp(),
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Submission failed: ' + (err.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // ── Navigate to Home and scroll to very top ──
  const handleNavigateHome = () => {
    navigate('/', { replace: true });
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 50);
  };

  const inp = (name) => ({
    width: '100%',
    background: focused === name ? 'rgba(240,165,0,0.04)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused === name ? 'rgba(240,165,0,0.45)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '7px',
    padding: '11px 14px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border 0.2s, background 0.2s, box-shadow 0.2s',
    boxShadow: focused === name ? '0 0 0 3px rgba(240,165,0,0.07)' : 'none',
  });

  const lbl = {
    display: 'block',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px', fontWeight: 500,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)', marginBottom: '7px',
  };

  const sectionHeader = (title) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', marginTop: '4px' }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{title}</span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
    </div>
  );

  const dividerLine = (
    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '24px 0' }} />
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .join-root * { box-sizing: border-box; }
        .join-root input::placeholder,
        .join-root select::placeholder { color: rgba(255,255,255,0.18); }
        .join-root input, .join-root select, .join-root textarea { caret-color: #f0a500; }
        .join-root select option { background: #0d1a14; color: #fff; }

        .join-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(180,130,40,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,130,40,0.04) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%);
        }
        .join-orb-1 {
          position:absolute; width:280px; height:280px; border-radius:50%;
          background: radial-gradient(circle, rgba(20,90,55,0.22) 0%, transparent 70%);
          top:-60px; left:-80px; filter:blur(50px);
          animation: orbFloat 9s ease-in-out infinite;
        }
        .join-orb-2 {
          position:absolute; width:220px; height:220px; border-radius:50%;
          background: radial-gradient(circle, rgba(202,138,4,0.15) 0%, transparent 70%);
          bottom:-40px; right:-60px; filter:blur(55px);
          animation: orbFloat 12s ease-in-out infinite reverse;
        }
        @keyframes orbFloat {
          0%,100% { transform:translate(0,0); }
          50% { transform:translate(15px,18px); }
        }

        .j-reveal { opacity:0; transform:translateY(20px); transition: opacity 0.75s ease, transform 0.75s ease; }
        .j-reveal.show { opacity:1; transform:translateY(0); }
        .jd1{transition-delay:0.1s} .jd2{transition-delay:0.25s} .jd3{transition-delay:0.4s}

        .j-section-label {
          display:inline-flex; align-items:center; gap:8px;
          background: rgba(240,165,0,0.08); border: 1px solid rgba(240,165,0,0.25);
          border-radius: 100px; padding: 5px 14px;
          font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500;
          letter-spacing:0.18em; text-transform:uppercase; color:#f0a500;
        }
        .j-pulse { width:5px; height:5px; border-radius:50%; background:#f0a500; animation: jpulse 2s infinite; }
        @keyframes jpulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.3;transform:scale(0.7);} }

        .join-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5);
        }

        .join-letterhead {
          background: linear-gradient(135deg, rgba(10,35,20,0.9) 0%, rgba(5,15,10,0.95) 100%);
          border-bottom: 1px solid rgba(240,165,0,0.12);
          padding: 24px 20px 20px;
          text-align: center;
          position: relative; overflow: visible;
        }
        .join-letterhead::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(-55deg, transparent, transparent 30px, rgba(240,165,0,0.012) 30px, rgba(240,165,0,0.012) 31px);
          pointer-events: none; border-radius: inherit;
        }
        .join-letterhead::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(240,165,0,0.5), transparent);
        }
        @media (min-width:560px) { .join-letterhead { padding: 28px 32px 24px; } }

        .scout-logo-circle {
          width: 54px; height: 54px; border-radius: 50%;
          background: rgba(240,165,0,0.08); border: 1px solid rgba(240,165,0,0.25);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px; font-size: 26px;
        }

        .photo-box {
          position: absolute; top: 16px; right: 16px;
          width: 64px; height: 80px;
          border: 1px solid rgba(240,165,0,0.25);
          border-radius: 6px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: rgba(240,165,0,0.04);
          gap: 4px; cursor: pointer; overflow: hidden;
          transition: border-color 0.2s, background 0.2s;
          z-index: 2;
        }
        .photo-box:hover { border-color: rgba(240,165,0,0.5); background: rgba(240,165,0,0.08); }
        @media (min-width:560px) { .photo-box { width: 72px; height: 90px; top: 20px; right: 24px; } }

        .admission-label {
          display: inline-block;
          border: 1px solid rgba(240,165,0,0.3); border-radius: 4px;
          padding: 5px 16px; margin-top: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(240,165,0,0.7); position: relative; z-index: 1;
        }

        .join-form-body { padding: 24px 20px; }
        @media (min-width:560px) { .join-form-body { padding: 28px 32px; } }

        .gender-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .gender-opt {
          display: flex; align-items: center; gap: 7px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.5);
          padding: 9px 16px; border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);
          transition: all 0.2s; flex: 1; justify-content: center; min-width: 80px;
        }
        .gender-opt.selected { border-color: rgba(240,165,0,0.4); background: rgba(240,165,0,0.07); color: #f0a500; }
        .gender-dot {
          width: 14px; height: 14px; border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s; flex-shrink: 0;
        }
        .gender-opt.selected .gender-dot { border-color: #f0a500; }
        .gender-dot-fill {
          width: 7px; height: 7px; border-radius: 50%; background: #f0a500;
          transform: scale(0); transition: transform 0.2s;
        }
        .gender-opt.selected .gender-dot-fill { transform: scale(1); }

        .consent-box {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 14px 16px;
        }

        .submit-btn {
          width: 100%; background: #f0a500;
          border: none; border-radius: 8px; padding: 14px;
          font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: #000; cursor: pointer;
          transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
          box-shadow: 0 4px 20px rgba(240,165,0,0.25);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { background: #ffc107; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(240,165,0,0.4); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spin {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.3); border-top-color: #000;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .r2 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media(min-width:480px) { .r2 { grid-template-columns: 1fr 1fr; } }
        .r3 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media(min-width:480px) { .r3 { grid-template-columns: 1fr 1fr 1fr; } }
      `}</style>

      {/* ── SUCCESS SCREEN ── */}
      {submitted && <SuccessScreen onNavigate={handleNavigateHome} />}

      <div
        className="join-root"
        style={{ minHeight:'100svh', background:'#070c0a', position:'relative', overflow:'hidden', padding:'80px 16px 60px', display:'flex', alignItems:'center', justifyContent:'center' }}
        ref={sectionRef}
      >
        <div className="join-grid-bg" />
        <div className="join-orb-1" />
        <div className="join-orb-2" />

        <div style={{ width:'100%', maxWidth:'700px', position:'relative', zIndex:10 }}>

          {/* Header */}
          <div className={`j-reveal jd1 ${isVisible ? 'show' : ''}`} style={{ textAlign:'center', marginBottom:'28px' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:'14px' }}>
              <span className="j-section-label"><span className="j-pulse" />Become a Rover Scout</span>
            </div>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(1.5rem,5.5vw,2.4rem)', fontWeight:800, color:'#fff', margin:'0 0 5px', lineHeight:1.1 }}>
              Join the <span style={{color:'#f0a500'}}>Rover Scouts</span>
            </h2>
          </div>

          {/* Card */}
          <div className={`join-card j-reveal jd2 ${isVisible ? 'show' : ''}`}>

            {/* ── LETTERHEAD ── */}
            <div className="join-letterhead">
              <input type="file" accept="image/*" ref={photoInputRef} onChange={handlePhotoChange} style={{ display:'none' }} />

              <div className="photo-box" onClick={() => photoInputRef.current.click()} title="Click to upload photo">
                {photo ? (
                  <img src={photo} alt="passport" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(240,165,0,0.4)" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(240,165,0,0.3)" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'7px', color:'rgba(240,165,0,0.4)', letterSpacing:'0.04em', textAlign:'center', lineHeight:1.4 }}>Click to{'\n'}Upload</span>
                  </>
                )}
              </div>

              <div className="scout-logo-circle">⚜️</div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(255,255,255,0.3)', letterSpacing:'0.12em', marginBottom:'4px', position:'relative', zIndex:1 }}>বিসমিল্লাহির রাহমানির রাহিম</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'rgba(240,165,0,0.6)', letterSpacing:'0.05em', marginBottom:'6px', fontStyle:'italic', position:'relative', zIndex:1 }}>"এসো শিক্ষার জন্য, যাও সেবার জন্য"</p>
              <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(0.85rem,3.5vw,1.15rem)', fontWeight:700, color:'#fff', lineHeight:1.3, marginBottom:'2px', position:'relative', zIndex:1 }}>Qadirabad Cantonment Sapper College</h3>
              <p style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(0.8rem,3vw,1rem)', fontWeight:600, color:'#f0a500', lineHeight:1.3, marginBottom:'2px', position:'relative', zIndex:1 }}>Rover Scout Group</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'12px', color:'rgba(255,255,255,0.35)', position:'relative', zIndex:1 }}>কাদিরাবাদ সেনানিবাস, নাটোর</p>
              <div className="admission-label">যোগদানের জন্য অনুমতি পত্র</div>
            </div>

            {/* ── FORM ── */}
            <form onSubmit={handleSubmit} className="join-form-body">

              {sectionHeader('পূর্ণনাম — Full Name')}
              <div className="r2" style={{ marginBottom:'20px' }}>
                <div>
                  <label style={lbl}>বাংলায়</label>
                  <input type="text" name="name_bn" required placeholder="বাংলায় পূর্ণ নাম"
                    value={formData.name_bn} onChange={handleChange}
                    style={inp('name_bn')} onFocus={()=>setFocused('name_bn')} onBlur={()=>setFocused('')} />
                </div>
                <div>
                  <label style={lbl}>ইংরেজিতে</label>
                  <input type="text" name="name_en" required placeholder="Full Name in English"
                    value={formData.name_en} onChange={handleChange}
                    style={inp('name_en')} onFocus={()=>setFocused('name_en')} onBlur={()=>setFocused('')} />
                </div>
              </div>

              {dividerLine}

              {sectionHeader("Parents' Names")}
              <div className="r2" style={{ marginBottom:'20px' }}>
                <div>
                  <label style={lbl}>পিতার নাম — Father's Name</label>
                  <input type="text" name="father" required placeholder="Father's full name"
                    value={formData.father} onChange={handleChange}
                    style={inp('father')} onFocus={()=>setFocused('father')} onBlur={()=>setFocused('')} />
                </div>
                <div>
                  <label style={lbl}>মাতার নাম — Mother's Name</label>
                  <input type="text" name="mother" required placeholder="Mother's full name"
                    value={formData.mother} onChange={handleChange}
                    style={inp('mother')} onFocus={()=>setFocused('mother')} onBlur={()=>setFocused('')} />
                </div>
              </div>

              {dividerLine}

              {sectionHeader('Date of Birth & Gender')}
              <div className="r2" style={{ marginBottom:'20px' }}>
                <div>
                  <label style={lbl}>জন্ম তারিখ — Date of Birth</label>
                  <input type="date" name="dob" required
                    value={formData.dob} onChange={handleChange}
                    style={{ ...inp('dob'), colorScheme:'dark' }} onFocus={()=>setFocused('dob')} onBlur={()=>setFocused('')} />
                </div>
                <div>
                  <label style={lbl}>লিঙ্গ — Gender</label>
                  <div className="gender-row">
                    {['ছাত্র (Male)', 'ছাত্রী (Female)'].map((g) => (
                      <div key={g} className={`gender-opt ${gender === g ? 'selected' : ''}`} onClick={() => setGender(g)}>
                        <div className="gender-dot"><div className="gender-dot-fill" /></div>
                        <span style={{ fontSize:'12px' }}>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {dividerLine}

              {/* ── NID / Birth Registration ── */}
              {sectionHeader('পরিচয় নম্বর — Identity Number')}
              <div style={{ marginBottom:'20px' }}>
                <label style={lbl}>NID / জন্ম নিবন্ধন নম্বর — NID / Birth Registration No.</label>
                <input
                  type="text"
                  name="nid"
                  required
                  placeholder="NID নম্বর অথবা জন্ম নিবন্ধন নম্বর লিখুন"
                  value={formData.nid}
                  onChange={handleChange}
                  style={inp('nid')}
                  onFocus={()=>setFocused('nid')}
                  onBlur={()=>setFocused('')}
                />
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'rgba(255,255,255,0.2)', marginTop:'6px', lineHeight:1.6 }}>
                  * যাদের NID নেই তারা জন্ম নিবন্ধন নম্বর দিন।
                </p>
              </div>

              {dividerLine}

              {sectionHeader('Address')}
              <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'20px' }}>
                <div>
                  <label style={lbl}>বর্তমান ঠিকানা — Present Address</label>
                  <input type="text" name="addr_present" required placeholder="Village, Upazila, District"
                    value={formData.addr_present} onChange={handleChange}
                    style={inp('addr_present')} onFocus={()=>setFocused('addr_present')} onBlur={()=>setFocused('')} />
                </div>
                <div>
                  <label style={lbl}>স্থায়ী ঠিকানা — Permanent Address</label>
                  <input type="text" name="addr_perm" required placeholder="Village, Upazila, District"
                    value={formData.addr_perm} onChange={handleChange}
                    style={inp('addr_perm')} onFocus={()=>setFocused('addr_perm')} onBlur={()=>setFocused('')} />
                </div>
              </div>

              {dividerLine}

              {sectionHeader('Institution & Class Details')}
              <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'20px' }}>
                <div>
                  <label style={lbl}>প্রতিষ্ঠানের নাম — Institution</label>
                  <input type="text" name="institution"
                    defaultValue="Qadirabad Cantonment Sapper College"
                    onChange={handleChange}
                    style={inp('institution')} onFocus={()=>setFocused('institution')} onBlur={()=>setFocused('')} />
                </div>
                <div className="r3">
                  <div>
                    <label style={lbl}>শ্রেণী — Class</label>
                    <input type="text" name="class" required placeholder="e.g. একাদশ / ১১"
                      value={formData.class} onChange={handleChange}
                      style={inp('class')} onFocus={()=>setFocused('class')} onBlur={()=>setFocused('')} />
                  </div>
                  <div>
                    <label style={lbl}>সেকশন</label>
                    <input type="text" name="section" required placeholder="e.g. Science-A"
                      value={formData.section} onChange={handleChange}
                      style={inp('section')} onFocus={()=>setFocused('section')} onBlur={()=>setFocused('')} />
                  </div>
                  <div>
                    <label style={lbl}>রোল</label>
                    <input type="text" name="roll" required placeholder="Roll No."
                      value={formData.roll} onChange={handleChange}
                      style={inp('roll')} onFocus={()=>setFocused('roll')} onBlur={()=>setFocused('')} />
                  </div>
                </div>
              </div>

              {dividerLine}

              {sectionHeader('Contact Information')}
              <div className="r2" style={{ marginBottom:'20px' }}>
                <div>
                  <label style={lbl}>ই-মেইল — Email</label>
                  <input type="email" name="email" placeholder="your@email.com"
                    value={formData.email} onChange={handleChange}
                    style={inp('email')} onFocus={()=>setFocused('email')} onBlur={()=>setFocused('')} />
                </div>
                <div>
                  <label style={lbl}>মোবাইল — Phone</label>
                  <input type="tel" name="phone" required placeholder="01XXXXXXXXX"
                    value={formData.phone} onChange={handleChange}
                    style={inp('phone')} onFocus={()=>setFocused('phone')} onBlur={()=>setFocused('')} />
                </div>
              </div>

              {dividerLine}

              {sectionHeader('Guardian Consent — অভিভাবকের অনুমতি')}
              <div className="consent-box" style={{ marginBottom:'28px' }}>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'12px', color:'rgba(255,255,255,0.4)', lineHeight:1.8, marginBottom:'12px' }}>
                  আমি স্বজ্ঞানে আমার পুত্র/কন্যাকে কাদিরাবাদ ক্যান্টনমেন্ট স্যাপার কলেজ রোভার স্কাউট / গার্ল ইন রোভার স্কাউট গ্রুপে যোগদান করার অনুমতি প্রদান করছি।
                </p>
                <div className="r2">
                  <div>
                    <label style={lbl}>অভিভাবকের নাম — Guardian Name</label>
                    <input type="text" name="guardian" required placeholder="Guardian's full name"
                      value={formData.guardian} onChange={handleChange}
                      style={inp('guardian')} onFocus={()=>setFocused('guardian')} onBlur={()=>setFocused('')} />
                  </div>
                  <div>
                    <label style={lbl}>সম্পর্ক — Relation</label>
                    <input type="text" name="relation" required placeholder="e.g. Father / Mother"
                      value={formData.relation} onChange={handleChange}
                      style={inp('relation')} onFocus={()=>setFocused('relation')} onBlur={()=>setFocused('')} />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <><div className="spin" />Submitting...</>
                ) : (
                  'Submit Registration →'
                )}
              </button>

            </form>
          </div>

          <p className={`j-reveal jd3 ${isVisible ? 'show' : ''}`} style={{ textAlign:'center', marginTop:'18px', fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'rgba(255,255,255,0.18)', letterSpacing:'0.08em' }}>
            After submission, our team will verify your information and confirm within 24–48 hours.
          </p>
        </div>
      </div>
    </>
  );
};

export default Join;