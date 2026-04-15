import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import {
  collection, doc, deleteDoc, setDoc,
  updateDoc, onSnapshot, query, orderBy, addDoc, serverTimestamp
} from "firebase/firestore";
import { auth, db } from "../../firebase.config";
import {
  LayoutDashboard, Users, MessageSquare, Images,
  LogOut, Menu, X, Upload, Check, Trash2, Eye,
  Bell, Shield, Clock, CheckCircle2, Mail, Phone,
  Loader2, ChevronUp, Image, Pencil
} from 'lucide-react';

// ── Cloudinary upload ──
const uploadToCloudinary = async (file) => {
  const cloudName = "dac4g49sw";
  const uploadPreset = "rover_image";
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
  const json = await res.json();
  if (json.secure_url) return json.secure_url;
  throw new Error(json.error?.message || 'Cloudinary upload failed');
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile;
};

// ── Committee Icon ──
const IcCommittee = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
    <path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const NAV = [
  { id: 'overview',      label: 'Overview',      Icon: LayoutDashboard },
  { id: 'registrations', label: 'Registrations', Icon: Users },
  { id: 'messages',      label: 'Messages',       Icon: MessageSquare },
  { id: 'gallery',       label: 'Gallery',        Icon: Images },
  { id: 'committee',     label: 'Committee',      Icon: IcCommittee },
];

// ─── Design tokens ───
const GOLD      = '#f0a500';
const GOLDFAINT = 'rgba(240,165,0,0.08)';
const BORDER    = 'rgba(255,255,255,0.07)';
const BG_CARD   = 'rgba(255,255,255,0.025)';

// ─── Status Badge ───
const StatusBadge = ({ v }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: '3px 10px', borderRadius: 100,
    background: v === 'approved' ? 'rgba(34,197,94,0.08)' : GOLDFAINT,
    border: `1px solid ${v === 'approved' ? 'rgba(34,197,94,0.25)' : 'rgba(240,165,0,0.25)'}`,
    color: v === 'approved' ? '#4ade80' : GOLD,
  }}>
    {v === 'approved' ? <CheckCircle2 size={9} /> : <Clock size={9} />}
    {v === 'approved' ? 'Approved' : 'Pending'}
  </span>
);

// ─── Avatar ───
const Avatar = ({ url, name = '?', size = 44, onClick }) => {
  const ini = name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return url
    ? <img src={url} alt={name} onClick={onClick} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(240,165,0,0.2)', flexShrink: 0, cursor: onClick ? 'pointer' : 'default', transition: 'border-color 0.2s, transform 0.2s' }}
        onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = 'rgba(240,165,0,0.5)'; e.currentTarget.style.transform = 'scale(1.05)'; } }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(240,165,0,0.2)'; e.currentTarget.style.transform = 'scale(1)'; }} />
    : <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(20,70,40,0.7),rgba(5,15,10,0.9))', border: '2px solid rgba(240,165,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel',serif", fontSize: size * 0.3, fontWeight: 700, color: 'rgba(240,165,0,0.45)', flexShrink: 0 }}>{ini}</div>;
};

// ─── Action Button ───
const Btn = ({ children, onClick, color = GOLD, disabled = false }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: `${color}08`, border: `1px solid ${color}25`,
    borderRadius: 7, padding: '6px 12px', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, color,
    display: 'inline-flex', alignItems: 'center', gap: 5,
    transition: 'all 0.2s', whiteSpace: 'nowrap', opacity: disabled ? 0.5 : 1,
  }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
    onMouseLeave={e => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.borderColor = `${color}25`; e.currentTarget.style.transform = 'translateY(0)'; }}
  >{children}</button>
);

// ─── Section Header ───
const SectionHdr = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, marginTop: 4 }}>
    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', whiteSpace: 'nowrap' }}>{children}</span>
    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
  </div>
);

// ─── Section Label Pill ───
const SectionPill = ({ children }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GOLDFAINT, border: '1px solid rgba(240,165,0,0.25)', borderRadius: 100, padding: '5px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD }}>
    <span style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD, animation: 'jpulse 2s infinite', display: 'inline-block' }} />
    {children}
  </span>
);

// ─── Page Title ───
const PageTitle = ({ pill, title, accent }) => (
  <div style={{ marginBottom: 26 }}>
    <div style={{ display: 'flex', marginBottom: 12 }}>
      <SectionPill>{pill}</SectionPill>
    </div>
    <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(1.3rem,4vw,1.9rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, margin: 0 }}>
      {title}{accent && <> <span style={{ color: GOLD }}>{accent}</span></>}
    </h1>
  </div>
);

// ─── Loading ───
const Load = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
    <Loader2 size={24} color={GOLD} style={{ animation: 'adSpin 0.8s linear infinite' }} />
  </div>
);

// ─── Empty ───
const None = ({ t }) => (
  <div style={{ textAlign: 'center', padding: '56px 20px', color: 'rgba(255,255,255,0.14)', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
    <div style={{ fontSize: 24, marginBottom: 10, opacity: 0.22 }}>— —</div>{t}
  </div>
);

// ─── Lightbox ───
const Lightbox = ({ url, name, onClose }) => {
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,9,8,0.97)', backdropFilter: 'blur(22px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeInFull 0.3s ease' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, width: 40, height: 40, borderRadius: '50%', background: GOLDFAINT, border: '1px solid rgba(240,165,0,0.2)', color: GOLD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,165,0,0.15)'}
        onMouseLeave={e => e.currentTarget.style.background = GOLDFAINT}
      ><X size={16} /></button>
      <img src={url} alt={name} onClick={e => e.stopPropagation()} style={{ maxWidth: '88vw', maxHeight: '78vh', objectFit: 'contain', borderRadius: 14, border: '1px solid rgba(240,165,0,0.25)', boxShadow: '0 24px 80px rgba(0,0,0,0.9)' }} />
      {name && <p style={{ marginTop: 16, fontFamily: "'Cinzel',serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>{name}</p>}
    </div>
  );
};

// ── Member Type Badge ──
const TypeBadge = ({ type }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: '3px 10px', borderRadius: 100,
    background: type === 'president' ? 'rgba(240,165,0,0.1)' : 'rgba(96,165,250,0.08)',
    border: `1px solid ${type === 'president' ? 'rgba(240,165,0,0.3)' : 'rgba(96,165,250,0.25)'}`,
    color: type === 'president' ? GOLD : '#60a5fa',
  }}>
    {type === 'president' ? '★ Leader' : 'Member'}
  </span>
);

// ══ TOAST SYSTEM ══════════════════════════════════════════════════
const Toast = ({ toasts }) => (
  <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9998, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(7,12,10,0.97)',
        border: `1px solid ${t.type === 'success' ? 'rgba(74,222,128,0.3)' : t.type === 'error' ? 'rgba(248,113,113,0.3)' : 'rgba(240,165,0,0.3)'}`,
        borderLeft: `3px solid ${t.type === 'success' ? '#4ade80' : t.type === 'error' ? '#f87171' : GOLD}`,
        borderRadius: 12, padding: '12px 16px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        animation: 'toastIn 0.3s cubic-bezier(.34,1.56,.64,1)',
        pointerEvents: 'auto', minWidth: 220, maxWidth: 320,
      }}>
        <span style={{ fontSize: 15, flexShrink: 0 }}>
          {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.4 }}>{t.msg}</p>
      </div>
    ))}
  </div>
);

// ══ CONFIRM DIALOG ══════════════════════════════════════════════
const ConfirmDialog = ({ open, msg, onOk, onCancel }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9990, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', animation: 'fadeInFull 0.18s ease' }}>
      <div style={{ background: 'rgba(10,18,14,0.98)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '28px 28px 22px', maxWidth: 360, width: '90%', boxShadow: '0 32px 80px rgba(0,0,0,0.8)', animation: 'slideDown 0.22s ease' }}>
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '20px 20px 0 0', background: 'linear-gradient(90deg,transparent,rgba(248,113,113,0.5),transparent)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Trash2 size={16} color="#f87171" />
          </div>
          <p style={{ fontFamily: "'Cinzel',serif", fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Confirm Delete</p>
        </div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 22px', lineHeight: 1.6 }}>{msg}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '9px 20px', borderRadius: 9, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
          >Cancel</button>
          <button onClick={onOk} style={{ padding: '9px 20px', borderRadius: 9, background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.22)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.12)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; }}
          ><Trash2 size={12} /> Delete</button>
        </div>
      </div>
    </div>
  );
};

// ══ COMMITTEE PANEL ══
const CommitteePanel = ({ committee, ld, isMobile, newMember, setNewMember, memberPhoto, setMemberPhoto, memberUploading, handleAddMember, memberFileRef, del, setLb, session, sessionDraft, setSessionDraft, sessionSaving, handleSaveSession, handleEditMember }) => {
  const [editMember, setEditMember] = useState(null);
  const [editDraft, setEditDraft]   = useState({});
  const [editPhoto, setEditPhoto]   = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const editFileRef = useRef(null);

  const openEdit = (m) => {
    setEditMember(m);
    setEditDraft({ name: m.name, role: m.role || '', facebook: m.facebook || '', type: m.type });
    setEditPhoto(null);
  };
  const closeEdit = () => { setEditMember(null); setEditPhoto(null); };
  const saveEdit  = async () => {
    if (!editDraft.name.trim()) return;
    setEditSaving(true);
    await handleEditMember(editMember.id, editDraft, editPhoto);
    setEditSaving(false);
    closeEdit();
  };

  const inputStyle = { width: '100%', padding: '10px 13px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', color: '#fff', border: `1px solid ${BORDER}`, fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: 'none', transition: 'border-color 0.2s' };

  return (
  <div>
    <PageTitle pill="Management" title="Manage" accent="Committee" />

    {/* ── Session Settings ── */}
    <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '16px 22px', marginBottom: 18, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.4),transparent)' }} />
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 10px' }}>Session Year</p>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          value={sessionDraft}
          onChange={e => setSessionDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSaveSession(); }}
          placeholder="e.g. 2025 – 2026"
          style={{ flex: 1, minWidth: 140, padding: '9px 13px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', color: '#fff', border: `1px solid ${BORDER}`, fontFamily: "'Cinzel',sans-serif", fontSize: 13, outline: 'none', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.4)'}
          onBlur={e => e.target.style.borderColor = BORDER}
        />
        <button
          onClick={handleSaveSession}
          disabled={sessionSaving || sessionDraft.trim() === session}
          style={{
            background: (sessionSaving || sessionDraft.trim() === session) ? 'rgba(96,165,250,0.06)' : 'rgba(96,165,250,0.12)',
            border: '1px solid rgba(96,165,250,0.25)', borderRadius: 8,
            padding: '9px 18px', cursor: (sessionSaving || sessionDraft.trim() === session) ? 'not-allowed' : 'pointer',
            fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500, color: '#60a5fa',
            display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', flexShrink: 0,
            opacity: (sessionSaving || sessionDraft.trim() === session) ? 0.5 : 1,
          }}
          onMouseEnter={e => { if (!sessionSaving && sessionDraft.trim() !== session) { e.currentTarget.style.background = 'rgba(96,165,250,0.2)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'; } }}
          onMouseLeave={e => { e.currentTarget.style.background = (sessionSaving || sessionDraft.trim() === session) ? 'rgba(96,165,250,0.06)' : 'rgba(96,165,250,0.12)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.25)'; }}
        >
          {sessionSaving
            ? <><Loader2 size={12} style={{ animation: 'adSpin 0.8s linear infinite' }} /> Saving…</>
            : <><Check size={12} /> Save</>}
        </button>
        {session && sessionDraft.trim() === session && (
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={11} /> Live: <strong style={{ fontFamily: "'Cinzel',serif", marginLeft: 3 }}>{session}</strong>
          </span>
        )}
      </div>
    </div>

    {/* Add New Member Form */}
    <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: '20px 22px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${GOLD}55,transparent)` }} />
      <SectionHdr>Add New Member</SectionHdr>
      <form onSubmit={handleAddMember} style={{ display: 'grid', gap: 12, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
        <input
          type="text" placeholder="Full Name" required
          value={newMember.name}
          onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))}
          style={{ padding: '11px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', color: '#fff', border: `1px solid ${BORDER}`, fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: 'none', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = 'rgba(240,165,0,0.35)'}
          onBlur={e => e.target.style.borderColor = BORDER}
        />
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder={newMember.type === 'president' ? 'Role (Optional for Leader)' : 'Role (e.g. Secretary)'}
            required={newMember.type !== 'president'}
            value={newMember.role}
            onChange={e => setNewMember(p => ({ ...p, role: e.target.value }))}
            style={{ width: '100%', padding: '11px 14px', paddingRight: newMember.type === 'president' ? 80 : 14, borderRadius: 9, background: 'rgba(255,255,255,0.04)', color: '#fff', border: `1px solid ${newMember.type === 'president' ? 'rgba(240,165,0,0.2)' : BORDER}`, fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: 'none', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = 'rgba(240,165,0,0.35)'}
            onBlur={e => e.target.style.borderColor = newMember.type === 'president' ? 'rgba(240,165,0,0.2)' : BORDER}
          />
          {newMember.type === 'president' && (
            <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, background: 'rgba(240,165,0,0.08)', border: '1px solid rgba(240,165,0,0.2)', borderRadius: 4, padding: '2px 7px', pointerEvents: 'none' }}>
              Optional
            </span>
          )}
        </div>
        <input
          type="url" placeholder="Facebook URL (Optional)"
          value={newMember.facebook}
          onChange={e => setNewMember(p => ({ ...p, facebook: e.target.value }))}
          style={{ padding: '11px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', color: '#fff', border: `1px solid ${BORDER}`, fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: 'none', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = 'rgba(240,165,0,0.35)'}
          onBlur={e => e.target.style.borderColor = BORDER}
        />
        <select
          value={newMember.type}
          onChange={e => setNewMember(p => ({ ...p, type: e.target.value }))}
          style={{ padding: '11px 14px', borderRadius: 9, background: 'rgba(18,24,20,0.95)', color: '#fff', border: `1px solid ${BORDER}`, fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: 'none', transition: 'border-color 0.2s', cursor: 'pointer' }}
          onFocus={e => e.target.style.borderColor = 'rgba(240,165,0,0.35)'}
          onBlur={e => e.target.style.borderColor = BORDER}
        >
          <option value="president">President / Leader</option>
          <option value="member">General Member</option>
        </select>

        <div style={{ gridColumn: isMobile ? '1' : '1 / -1', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => memberFileRef.current?.click()} style={{
            background: GOLDFAINT, border: '1px solid rgba(240,165,0,0.25)', borderRadius: 9,
            padding: '10px 16px', cursor: 'pointer', color: GOLD,
            fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
            maxWidth: '100%', overflow: 'hidden',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(240,165,0,0.14)'; e.currentTarget.style.borderColor = 'rgba(240,165,0,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = GOLDFAINT; e.currentTarget.style.borderColor = 'rgba(240,165,0,0.25)'; }}
          >
            <Upload size={13} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
              {memberPhoto ? memberPhoto.name : 'Choose Photo'}
            </span>
          </button>
          <input type="file" accept="image/*" hidden ref={memberFileRef} onChange={e => setMemberPhoto(e.target.files[0])} />
          {memberPhoto && (
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <CheckCircle2 size={12} /> Photo selected
            </span>
          )}
        </div>

        <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
          <button type="submit" disabled={memberUploading} style={{
            background: memberUploading ? GOLDFAINT : GOLD,
            border: memberUploading ? '1px solid rgba(240,165,0,0.3)' : 'none',
            borderRadius: 9, padding: '12px 28px',
            cursor: memberUploading ? 'not-allowed' : 'pointer',
            fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: memberUploading ? GOLD : '#000',
            display: 'inline-flex', alignItems: 'center', gap: 7,
            opacity: memberUploading ? 0.7 : 1,
            boxShadow: memberUploading ? 'none' : '0 4px 20px rgba(240,165,0,0.28)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { if (!memberUploading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(240,165,0,0.42)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = memberUploading ? 'none' : '0 4px 20px rgba(240,165,0,0.28)'; }}
          >
            {memberUploading
              ? <><Loader2 size={13} style={{ animation: 'adSpin 0.8s linear infinite' }} /> Adding…</>
              : <><Users size={13} /> Add Member</>}
          </button>
        </div>
      </form>
    </div>

    {/* Member List */}
    <SectionHdr>Current Members ({committee.length})</SectionHdr>
    {ld.c ? <Load /> : committee.length === 0 ? <None t="No committee members yet." /> : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {committee.map(member => (
          <div key={member.id}
            style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', transition: 'border-color 0.2s, transform 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(240,165,0,0.18)'; e.currentTarget.style.transform = 'translateX(2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = 'translateX(0)'; }}
          >
            <Avatar
              url={member.photo}
              name={member.name}
              size={48}
              onClick={member.photo ? () => setLb({ url: member.photo, name: member.name }) : undefined}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 4 }}>
                <p style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>{member.name}</p>
                <TypeBadge type={member.type} />
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{member.role}</p>
              {member.facebook && (
                <a href={member.facebook} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, color: '#60a5fa', textDecoration: 'none', marginTop: 3, display: 'inline-block' }}>Facebook ↗</a>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <Btn onClick={() => openEdit(member)} color="#60a5fa"><Pencil size={12} /> Edit</Btn>
              <Btn onClick={() => del('committee', member.id)} color="#f87171"><Trash2 size={12} /> Delete</Btn>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* ── Edit Modal ── */}
    {editMember && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9990, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', animation: 'fadeInFull 0.18s ease', padding: 16 }}>
        <div style={{ background: 'rgba(10,18,14,0.99)', border: `1px solid ${BORDER}`, borderRadius: 20, padding: '24px 22px', width: '100%', maxWidth: 420, boxShadow: '0 32px 80px rgba(0,0,0,0.8)', animation: 'slideDown 0.22s ease', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '20px 20px 0 0', background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.5),transparent)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pencil size={15} color="#60a5fa" />
              </div>
              <p style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Edit Member</p>
            </div>
            <button onClick={closeEdit} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
            ><X size={13} /></button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, borderRadius: 12 }}>
            <Avatar url={editPhoto ? URL.createObjectURL(editPhoto) : editMember.photo} name={editDraft.name} size={52} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Profile Photo</p>
              <button type="button" onClick={() => editFileRef.current?.click()} style={{ background: GOLDFAINT, border: '1px solid rgba(240,165,0,0.2)', borderRadius: 7, padding: '7px 12px', cursor: 'pointer', color: GOLD, fontFamily: "'DM Sans',sans-serif", fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 5, transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,165,0,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = GOLDFAINT}
              >
                <Upload size={11} />
                <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {editPhoto ? editPhoto.name : 'Change Photo'}
                </span>
              </button>
            </div>
            <input type="file" accept="image/*" hidden ref={editFileRef} onChange={e => setEditPhoto(e.target.files[0])} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              placeholder="Full Name" required value={editDraft.name}
              onChange={e => setEditDraft(p => ({ ...p, name: e.target.value }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.4)'}
              onBlur={e => e.target.style.borderColor = BORDER}
            />
            <div style={{ position: 'relative' }}>
              <input
                placeholder={editDraft.type === 'president' ? 'Role (Optional for Leader)' : 'Role'}
                value={editDraft.role}
                onChange={e => setEditDraft(p => ({ ...p, role: e.target.value }))}
                style={{ ...inputStyle, paddingRight: editDraft.type === 'president' ? 80 : 13 }}
                onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.4)'}
                onBlur={e => e.target.style.borderColor = BORDER}
              />
              {editDraft.type === 'president' && (
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, background: 'rgba(240,165,0,0.08)', border: '1px solid rgba(240,165,0,0.2)', borderRadius: 4, padding: '2px 7px', pointerEvents: 'none' }}>Optional</span>
              )}
            </div>
            <input
              type="url" placeholder="Facebook URL (Optional)" value={editDraft.facebook}
              onChange={e => setEditDraft(p => ({ ...p, facebook: e.target.value }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.4)'}
              onBlur={e => e.target.style.borderColor = BORDER}
            />
            <select value={editDraft.type} onChange={e => setEditDraft(p => ({ ...p, type: e.target.value }))}
              style={{ ...inputStyle, background: 'rgba(18,24,20,0.95)', cursor: 'pointer' }}
              onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.4)'}
              onBlur={e => e.target.style.borderColor = BORDER}
            >
              <option value="president">President / Leader</option>
              <option value="member">General Member</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
            <button onClick={closeEdit} style={{ padding: '9px 18px', borderRadius: 9, background: 'transparent', border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans',sans-serif", fontSize: 12, cursor: 'pointer', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
            >Cancel</button>
            <button onClick={saveEdit} disabled={editSaving || !editDraft.name.trim()} style={{ padding: '9px 20px', borderRadius: 9, background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, cursor: editSaving ? 'not-allowed' : 'pointer', transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 6, opacity: editSaving ? 0.6 : 1 }}
              onMouseEnter={e => { if (!editSaving) { e.currentTarget.style.background = 'rgba(96,165,250,0.22)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.12)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)'; }}
            >
              {editSaving ? <><Loader2 size={12} style={{ animation: 'adSpin 0.8s linear infinite' }} /> Saving…</> : <><Check size={12} /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

// ══ MAIN ══════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [tab, setTab]       = useState('overview');
  const [drawer, setDrawer] = useState(false);
  const [regs, setRegs]     = useState([]);
  const [msgs, setMsgs]     = useState([]);
  const [gals, setGals]     = useState([]);
  const [committee, setCommittee] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', role: '', facebook: '', type: 'member' });
  const [memberPhoto, setMemberPhoto] = useState(null);
  const [memberUploading, setMemberUploading] = useState(false);
  const [session, setSession] = useState('2025 – 2026');
  const [sessionDraft, setSessionDraft] = useState('');
  const [sessionSaving, setSessionSaving] = useState(false);
  const [ld, setLd]         = useState({ r: true, m: true, g: true, c: true });
  const [uploading, setUp]  = useState(false);
  const [exp, setExp]       = useState(null);
  const [lb, setLb]         = useState(null);
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const fileRef = useRef(null);

  const toast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };

  const confirmDel = (msg, onOk) => setConfirm({ msg, onOk });

  useEffect(() => {
    const u1 = onSnapshot(query(collection(db, 'registrations'), orderBy('submittedAt', 'desc')), s => { setRegs(s.docs.map(d => ({ id: d.id, ...d.data() }))); setLd(p => ({ ...p, r: false })); });
    const u2 = onSnapshot(query(collection(db, 'messages'), orderBy('createdAt', 'desc')), s => { setMsgs(s.docs.map(d => ({ id: d.id, ...d.data() }))); setLd(p => ({ ...p, m: false })); });
    const u3 = onSnapshot(query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc')), s => { setGals(s.docs.map(d => ({ id: d.id, ...d.data() }))); setLd(p => ({ ...p, g: false })); });
    const u4 = onSnapshot(query(collection(db, 'committee'), orderBy('createdAt', 'asc')), s => { setCommittee(s.docs.map(d => ({ id: d.id, ...d.data() }))); setLd(p => ({ ...p, c: false })); });
    const u5 = onSnapshot(doc(db, 'settings', 'committee'), s => { if (s.exists() && s.data().session) { setSession(s.data().session); setSessionDraft(s.data().session); } });
    return () => { u1(); u2(); u3(); u4(); u5(); };
  }, []);

  const logout  = async () => { await signOut(auth); navigate('/login'); };
  const del     = (col, id) => confirmDel('This item will be permanently deleted. Are you sure?', async () => { await deleteDoc(doc(db, col, id)); toast('Item deleted successfully.'); });
  const approve = id => updateDoc(doc(db, 'registrations', id), { status: 'approved' });
  const markR   = id => updateDoc(doc(db, 'messages', id), { read: true });
  const go      = id => { setTab(id); setDrawer(false); };

  const handleUpload = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUp(true);
    let ok = 0, fail = 0;
    for (const f of files) {
      try { const url = await uploadToCloudinary(f); await addDoc(collection(db, 'gallery'), { url, uploadedAt: serverTimestamp() }); ok++; }
      catch (err) { console.error(err); fail++; }
    }
    setUp(false); e.target.value = '';
    if (ok) toast(`${ok} photo(s) uploaded successfully!`, 'success');
    if (fail) toast(`${fail} photo(s) failed to upload.`, 'error');
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberUploading(true);
    try {
      let photoUrl = null;
      if (memberPhoto) photoUrl = await uploadToCloudinary(memberPhoto);
      await addDoc(collection(db, 'committee'), {
        ...newMember,
        photo: photoUrl,
        createdAt: serverTimestamp()
      });
      toast('Member added successfully!', 'success');
      setNewMember({ name: '', role: '', facebook: '', type: 'member' });
      setMemberPhoto(null);
      if (memberFileRef.current) memberFileRef.current.value = '';
    } catch (error) {
      toast('Error: ' + error.message, 'error');
    } finally {
      setMemberUploading(false);
    }
  };

  const memberFileRef = useRef(null);

  const handleSaveSession = async () => {
    if (!sessionDraft.trim()) return;
    setSessionSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'committee'), { session: sessionDraft.trim() }, { merge: true });
      toast('Session year saved!', 'success');
    } catch (e) { toast('Error saving session: ' + e.message, 'error'); }
    finally { setSessionSaving(false); }
  };

  const handleEditMember = async (id, draft, newPhoto) => {
    try {
      let photoUrl = committee.find(m => m.id === id)?.photo || null;
      if (newPhoto) photoUrl = await uploadToCloudinary(newPhoto);
      await updateDoc(doc(db, 'committee', id), {
        name: draft.name.trim(),
        role: draft.role.trim(),
        facebook: draft.facebook.trim(),
        type: draft.type,
        ...(newPhoto ? { photo: photoUrl } : {}),
      });
      toast('Member updated successfully!', 'success');
    } catch (e) { toast('Error updating: ' + e.message, 'error'); }
  };

  const pending = regs.filter(r => r.status !== 'approved').length;
  const unread  = msgs.filter(m => !m.read).length;

  // ─── OVERVIEW ───
  const Overview = () => (
    <div>
      <PageTitle pill="Control Center" title="Dashboard" accent="Overview" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(145px,1fr))', gap: 10, marginBottom: 32 }}>
        {[
          { label: 'Total Regs',  value: regs.length,                                      Icon: Users,         color: GOLD },
          { label: 'Pending',     value: pending,                                           Icon: Clock,         color: '#fb923c' },
          { label: 'Approved',    value: regs.filter(r => r.status === 'approved').length,  Icon: CheckCircle2,  color: '#4ade80' },
          { label: 'Messages',    value: msgs.length,                                      Icon: MessageSquare, color: '#60a5fa' },
          { label: 'Unread',      value: unread,                                           Icon: Bell,          color: '#f472b6' },
          { label: 'Photos',      value: gals.length,                                      Icon: Image,         color: '#a78bfa' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 15px', position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s, transform 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${color}55,transparent)` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9.5, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>{label}</p>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}10`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={13} color={color} />
              </div>
            </div>
            <p style={{ fontFamily: "'Cinzel',serif", fontSize: 30, fontWeight: 800, color, lineHeight: 1, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      <SectionHdr>Recent Registrations</SectionHdr>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {regs.slice(0, 6).map(r => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 13, background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 13, padding: '12px 15px', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(240,165,0,0.18)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
          >
            <Avatar url={r.photoUrl} name={r.name_en} size={40} onClick={r.photoUrl ? () => setLb({ url: r.photoUrl, name: r.name_en }) : undefined} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 500, color: 'rgba(255,255,255,0.82)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name_en}</p>
              {r.institution && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, color: 'rgba(255,255,255,0.28)', margin: '2px 0 0' }}>{r.institution}</p>}
            </div>
            <StatusBadge v={r.status} />
          </div>
        ))}
        {!ld.r && regs.length === 0 && <None t="No registrations yet." />}
      </div>
    </div>
  );

  // ─── REGISTRATIONS ───
  const Registrations = () => (
    <div>
      <PageTitle pill="Management" title="Registrations" />
      {ld.r ? <Load /> : regs.length === 0 ? <None t="No registrations yet." /> : regs.map(r => (
        <div key={r.id} style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 18, marginBottom: 10, overflow: 'hidden', transition: 'border-color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(240,165,0,0.15)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
        >
          <div style={{ padding: '15px 18px' }}>
            {/* Top row: avatar + name + status + buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <Avatar url={r.photoUrl} name={r.name_en} size={52} onClick={r.photoUrl ? () => setLb({ url: r.photoUrl, name: r.name_en }) : undefined} />
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                  <p style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>{r.name_en}</p>
                  <StatusBadge v={r.status} />
                </div>
                {r.institution && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{r.institution}{r.class ? ` · Class ${r.class}` : ''}</p>}
              </div>
              <div style={{ display: 'flex', gap: 7, flexShrink: 0, flexWrap: 'wrap' }}>
                <Btn onClick={() => setExp(exp === r.id ? null : r.id)}>
                  {exp === r.id ? <><ChevronUp size={12} /> Close</> : <><Eye size={12} /> Details</>}
                </Btn>
                {r.status !== 'approved' && <Btn onClick={() => approve(r.id)} color="#4ade80"><Check size={12} /> Approve</Btn>}
                <Btn onClick={() => del('registrations', r.id)} color="#f87171"><Trash2 size={12} /> Delete</Btn>
              </div>
            </div>
          </div>

          {exp === r.id && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.055)', padding: '18px 18px', background: 'rgba(0,0,0,0.22)', animation: 'slideDown 0.25s ease' }}>
              {[
                { sec: 'পূর্ণনাম — Full Name',                      fields: [['বাংলা নাম', r.name_bn], ['ইংরেজি নাম', r.name_en]] },
                { sec: "Parents' Names",                              fields: [["পিতার নাম — Father's Name", r.father], ["মাতার নাম — Mother's Name", r.mother]] },
                { sec: 'Date of Birth & Gender',                      fields: [['জন্ম তারিখ — Date of Birth', r.dob], ['লিঙ্গ — Gender', r.gender]] },
                { sec: 'পরিচয় নম্বর — Identity Number',             fields: [['NID / জন্ম নিবন্ধন নম্বর', r.nid]] },
                { sec: 'Address',                                     fields: [['বর্তমান ঠিকানা — Present Address', r.addr_present], ['স্থায়ী ঠিকানা — Permanent Address', r.addr_perm]] },
                { sec: 'Institution & Class Details',                 fields: [['প্রতিষ্ঠান — Institution', r.institution], ['শ্রেণী — Class', r.class], ['সেকশন — Section', r.section], ['রোল — Roll No.', r.roll]] },
                { sec: 'Contact Information',                         fields: [['ই-মেইল — Email', r.email], ['মোবাইল — Phone', r.phone]] },
                { sec: 'Guardian Consent — অভিভাবকের অনুমতি',       fields: [['অভিভাবকের নাম — Guardian Name', r.guardian], ['সম্পর্ক — Relation', r.relation]] },
              ].map(({ sec, fields }) => {
                const valid = fields.filter(([, v]) => v);
                if (!valid.length) return null;
                return (
                  <div key={sec} style={{ marginBottom: 18 }}>
                    <SectionHdr>{sec}</SectionHdr>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                      {valid.map(([k, v]) => (
                        <div key={k} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '9px 12px' }}>
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8.5, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px' }}>{k}</p>
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.72)', margin: 0, lineHeight: 1.5, wordBreak: 'break-word' }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ─── MESSAGES ───
  const Messages = () => (
    <div>
      <PageTitle pill="Inbox" title="Messages" />
      {ld.m ? <Load /> : msgs.length === 0 ? <None t="No messages yet." /> : msgs.map(m => (
        <div key={m.id} style={{
          background: BG_CARD,
          border: `1px solid ${m.read ? BORDER : 'rgba(96,165,250,0.25)'}`,
          borderLeft: `3px solid ${m.read ? 'rgba(255,255,255,0.06)' : '#60a5fa'}`,
          borderRadius: 14, marginBottom: 10, padding: '16px 18px', transition: 'all 0.2s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5, flexWrap: 'wrap' }}>
                <p style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>{m.name}</p>
                {!m.read && (
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.22)', borderRadius: 100, padding: '2px 8px', color: '#60a5fa', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Bell size={8} /> New
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {m.phone && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.28)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={10} /> {m.phone}</p>}
                {m.email && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.28)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={10} /> {m.email}</p>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
              {!m.read && <Btn onClick={() => markR(m.id)} color="#60a5fa"><Eye size={12} /> Mark Read</Btn>}
              <Btn onClick={() => del('messages', m.id)} color="#f87171"><Trash2 size={12} /> Delete</Btn>
            </div>
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.48)', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: 9, margin: 0, lineHeight: 1.7, borderLeft: '2px solid rgba(255,255,255,0.05)' }}>{m.message}</p>
        </div>
      ))}
    </div>
  );

  // ─── GALLERY ───
  const GalleryGrid = React.memo(({ gals, onOpen, onDel }) => {
    const [visibleIds, setVisibleIds] = useState(new Set());
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 24;
    const loaderRef = useRef(null);
    const shown = gals.slice(0, page * PAGE_SIZE);

    useEffect(() => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setVisibleIds(p => new Set([...p, e.target.dataset.id]));
        });
      }, { threshold: 0.05, rootMargin: '100px' });
      document.querySelectorAll('.gal-item').forEach(el => obs.observe(el));
      return () => obs.disconnect();
    }, [shown.length]);

    useEffect(() => {
      if (!loaderRef.current) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && shown.length < gals.length) setPage(p => p + 1);
      }, { threshold: 1 });
      obs.observe(loaderRef.current);
      return () => obs.disconnect();
    }, [shown.length, gals.length]);

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(118px,1fr))', gap: 10 }}>
          {shown.map((g, idx) => (
            <div
              key={g.id}
              className="gal-card gal-item"
              data-id={g.id}
              style={{
                position: 'relative', borderRadius: 13, overflow: 'hidden',
                aspectRatio: '1/1', border: `1px solid ${BORDER}`, cursor: 'pointer',
                background: BG_CARD, transition: 'border-color 0.2s, transform 0.2s, opacity 0.4s',
                opacity: visibleIds.has(g.id) ? 1 : 0,
                transform: visibleIds.has(g.id) ? 'translateY(0)' : 'translateY(10px)',
                transitionDelay: `${(idx % 8) * 0.03}s`,
              }}
              onClick={() => onOpen(g)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(240,165,0,0.3)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = visibleIds.has(g.id) ? 'translateY(0)' : 'translateY(10px)'; }}
            >
              {visibleIds.has(g.id) ? (
                <img
                  src={g.url} alt=""
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.02)' }} />
              )}
              <button
                className="gal-del"
                onClick={e => { e.stopPropagation(); onDel(g.id); }}
                style={{ position: 'absolute', top: 7, right: 7, width: 28, height: 28, borderRadius: 8, background: 'rgba(0,0,0,0.72)', border: '1px solid rgba(248,113,113,0.35)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1, transition: 'all 0.2s', backdropFilter: 'blur(6px)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.2)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.6)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.72)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
        {shown.length < gals.length && (
          <div ref={loaderRef} style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', gap: 6 }}>
            <Loader2 size={18} color="rgba(240,165,0,0.35)" style={{ animation: 'adSpin 0.8s linear infinite' }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Loading more…</span>
          </div>
        )}
        {shown.length >= gals.length && gals.length > PAGE_SIZE && (
          <p style={{ textAlign: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.1)', letterSpacing: '0.1em', padding: '12px 0' }}>All {gals.length} photos loaded</p>
        )}
      </>
    );
  });

  const Gallery = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
        <PageTitle pill="Media" title="Photo Gallery" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
          {gals.length > 0 && (
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 6, padding: '5px 10px' }}>
              {gals.length} photo{gals.length !== 1 ? 's' : ''}
            </span>
          )}
          <button onClick={() => fileRef.current.click()} disabled={uploading} style={{
            background: uploading ? GOLDFAINT : GOLD,
            border: uploading ? '1px solid rgba(240,165,0,0.3)' : 'none',
            borderRadius: 8, padding: '11px 20px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: uploading ? GOLD : '#000',
            display: 'flex', alignItems: 'center', gap: 7,
            opacity: uploading ? 0.7 : 1,
            boxShadow: uploading ? 'none' : '0 4px 20px rgba(240,165,0,0.28)',
            transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
          }}
            onMouseEnter={e => { if (!uploading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(240,165,0,0.42)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = uploading ? 'none' : '0 4px 20px rgba(240,165,0,0.28)'; }}
          >
            {uploading ? <><Loader2 size={13} style={{ animation: 'adSpin 0.8s linear infinite' }} /> Uploading…</> : <><Upload size={13} /> Upload Photo</>}
          </button>
        </div>
        <input type="file" multiple accept="image/*" hidden ref={fileRef} onChange={handleUpload} />
      </div>
      {ld.g ? <Load /> : gals.length === 0
        ? <None t="No photos yet — click Upload Photo to get started." />
        : <GalleryGrid
            gals={gals}
            onOpen={g => setLb({ url: g.url, name: 'Gallery Photo' })}
            onDel={id => del('gallery', id)}
          />
      }
    </div>
  );

  const CONTENT = {
    overview: <Overview />,
    registrations: <Registrations />,
    messages: <Messages />,
    gallery: <Gallery />,
    committee: <CommitteePanel
      committee={committee} ld={ld} isMobile={isMobile}
      newMember={newMember} setNewMember={setNewMember}
      memberPhoto={memberPhoto} setMemberPhoto={setMemberPhoto}
      memberUploading={memberUploading}
      handleAddMember={handleAddMember}
      memberFileRef={memberFileRef}
      del={del} setLb={setLb}
      session={session} sessionDraft={sessionDraft} setSessionDraft={setSessionDraft}
      sessionSaving={sessionSaving} handleSaveSession={handleSaveSession}
      handleEditMember={handleEditMember}
    />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#070c0a;}

        @keyframes adSpin    { to{transform:rotate(360deg)} }
        @keyframes fadeIn    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInFull{ from{opacity:0} to{opacity:1} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes jpulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
        @keyframes toastIn   { from{opacity:0;transform:translateX(24px) scale(0.95)} to{opacity:1;transform:translateX(0) scale(1)} }

        @keyframes cmteOrbFloat {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(16px, 20px); }
        }

        .page-in { animation: fadeIn 0.25s ease; }

        .ad-sc::-webkit-scrollbar       { width: 4px; }
        .ad-sc::-webkit-scrollbar-track { background: transparent; }
        .ad-sc::-webkit-scrollbar-thumb { background: rgba(240,165,0,0.1); border-radius: 10px; }

        .nav-btn:hover { background: rgba(240,165,0,0.06) !important; color: rgba(255,255,255,0.7) !important; }

        input::placeholder { color: rgba(255,255,255,0.2); }
        select option { background: #0e1a14; }

        .ad-grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(180,130,40,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,130,40,0.04) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse 90% 60% at 50% 30%, black 20%, transparent 100%);
        }

        .ad-orb-1 {
          position: fixed;
          width: 350px; height: 350px;
          border-radius: 50%;
          pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(20,90,55,0.18) 0%, transparent 70%);
          top: -80px; right: -80px;
          filter: blur(60px);
          animation: cmteOrbFloat 11s ease-in-out infinite;
        }

        .ad-orb-2 {
          position: fixed;
          width: 260px; height: 260px;
          border-radius: 50%;
          pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(202,138,4,0.12) 0%, transparent 70%);
          bottom: 8%; left: -60px;
          filter: blur(60px);
          animation: cmteOrbFloat 14s ease-in-out infinite reverse;
        }
      `}</style>

      {/* Background layers */}
      <div className="ad-grid-bg" />
      <div className="ad-orb-1" />
      <div className="ad-orb-2" />

      <div style={{ display: 'flex', height: '100dvh', background: '#070c0a', overflow: 'hidden', fontFamily: "'DM Sans',sans-serif", position: 'relative' }}>

        {/* ── Mobile Header ── */}
        {isMobile && (
          <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: 56, background: 'rgba(7,12,10,0.97)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: GOLDFAINT, border: '1px solid rgba(240,165,0,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚜️</div>
              <span style={{ fontFamily: "'Cinzel',serif", fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: '0.08em' }}>Admin Panel</span>
            </div>
            <button onClick={() => setDrawer(d => !d)} style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.55)', transition: 'all 0.2s' }}>
              {drawer ? <X size={16} /> : <Menu size={16} />}
            </button>
          </header>
        )}

        {/* Overlay */}
        {isMobile && drawer && <div onClick={() => setDrawer(false)} style={{ position: 'fixed', top: 56, left: 0, right: 0, bottom: 0, zIndex: 198, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }} />}

        {/* ── Sidebar ── */}
        <aside style={{
          width: isMobile ? '72vw' : 224, maxWidth: isMobile ? 244 : 224, flexShrink: 0,
          height: isMobile ? 'calc(100dvh - 56px)' : '100dvh',
          background: 'rgba(7,12,10,0.98)', borderRight: `1px solid ${BORDER}`,
          display: 'flex', flexDirection: 'column',
          position: isMobile ? 'fixed' : 'relative',
          left: isMobile ? (drawer ? 0 : '-80vw') : 0,
          top: isMobile ? 56 : 0, zIndex: 199,
          transition: 'left 0.3s cubic-bezier(.4,0,.2,1)',
          boxShadow: isMobile && drawer ? '8px 0 40px rgba(0,0,0,0.7)' : 'none',
        }}>

          {/* Logo */}
          {!isMobile && (
            <div style={{ padding: '22px 18px 18px', borderBottom: `1px solid ${BORDER}`, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,rgba(10,35,20,0.6) 0%,rgba(5,15,10,0.8) 100%)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(240,165,0,0.5),transparent)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(-55deg,transparent,transparent 30px,rgba(240,165,0,0.012) 30px,rgba(240,165,0,0.012) 31px)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, position: 'relative', zIndex: 1 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: GOLDFAINT, border: '1px solid rgba(240,165,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⚜️</div>
                <div>
                  <p style={{ fontFamily: "'Cinzel',serif", fontSize: 12.5, fontWeight: 700, color: GOLD, letterSpacing: '0.06em', margin: 0 }}>Admin Panel</p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9.5, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '2px 0 0', fontStyle: 'italic' }}>Control Center</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '4px 10px 8px', margin: 0 }}>Navigation</p>
            {NAV.map(n => {
              const active = tab === n.id;
              const badge  = n.id === 'registrations' ? pending : n.id === 'messages' ? unread : 0;
              return (
                <button key={n.id} className="nav-btn" onClick={() => go(n.id)} style={{
                  width: '100%',
                  background: active ? GOLDFAINT : 'transparent',
                  border: `1px solid ${active ? 'rgba(240,165,0,0.22)' : 'transparent'}`,
                  borderRadius: 10, padding: '10px 12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  color: active ? GOLD : 'rgba(255,255,255,0.33)',
                  transition: 'all 0.16s', textAlign: 'left',
                }}>
                  <n.Icon size={15} color={active ? GOLD : 'rgba(255,255,255,0.3)'} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: active ? 500 : 400, flex: 1 }}>{n.label}</span>
                  {badge > 0 && (
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9.5, fontWeight: 600, background: n.id === 'messages' ? 'rgba(96,165,250,0.12)' : GOLDFAINT, border: `1px solid ${n.id === 'messages' ? 'rgba(96,165,250,0.28)' : 'rgba(240,165,0,0.28)'}`, color: n.id === 'messages' ? '#60a5fa' : GOLD, borderRadius: 100, padding: '1px 7px', minWidth: 20, textAlign: 'center' }}>{badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div style={{ padding: '10px', borderTop: `1px solid ${BORDER}` }}>
            <button onClick={logout} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(248,113,113,0.12)', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, justifyContent: 'center', color: 'rgba(248,113,113,0.5)', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500, transition: 'all 0.18s', letterSpacing: '0.04em' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.28)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.12)'; e.currentTarget.style.color = 'rgba(248,113,113,0.5)'; }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="ad-sc" style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '70px 14px 32px' : '30px 28px', background: 'transparent', position: 'relative', zIndex: 1 }}>
          <div className="page-in" key={tab} style={{ maxWidth: 920, margin: '0 auto' }}>
            {CONTENT[tab]}
          </div>
        </main>

        {lb && <Lightbox url={lb.url} name={lb.name} onClose={() => setLb(null)} />}
        <Toast toasts={toasts} />
        <ConfirmDialog
          open={!!confirm}
          msg={confirm?.msg}
          onOk={() => { confirm?.onOk(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      </div>
    </>
  );
}