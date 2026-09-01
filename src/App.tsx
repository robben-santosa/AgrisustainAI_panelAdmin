import { useState, useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | 'onboarding'
  | 'role-select'
  | 'login'
  | 'child-profile-setup'
  | 'child-dashboard'
  | 'parent-dashboard'
  | 'gpk-dashboard'
  | 'game'
  | 'analytics'
  | 'gpk-services'
  | 'gpk-detail'
  | 'gpk-chat'
  | 'gpk-call'
  | 'gpk-register'
  | 'gpk-register-verify'
  | 'gpk-register-profile'
  | 'forum'
  | 'forum-detail'
  | 'store'
  | 'payment'
  | 'gpk-profile'
  | 'parent-password'
  | 'ai-assistant'
  | 'achievements'
  | 'child-shop'
  | 'settings'

type Role = 'child' | 'parent' | 'gpk' | null
type Gender = 'boy' | 'girl' | null

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#fdf6ea',
  card: '#ffffff',
  hero: '#111c28',
  primary: '#f09334',
  primaryLight: '#fff0dc',
  primaryDark: '#d4801f',
  deep: '#1a2535',
  teal: '#1a91b0',
  tealLight: '#dff3f9',
  muted: '#f2ece0',
  border: '#ede5d4',
  mutedText: '#7a7060',
  white: '#ffffff',
  star: '#f5c842',
  success: '#1a91b0',
  red: '#e05252',
  purple: '#7c5cbf',
  purpleLight: '#f0e8ff',
  infoLight: '#d8eef7',
  pink: '#e91e8c',
  pinkLight: '#fde8f4',
}

// ─── Utility ─────────────────────────────────────────────────────────────────
function SectionHeader({ title, onMore }: { title: string; onMore?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-black text-base" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>{title}</h3>
      {onMore && (
        <button className="text-xs font-bold" style={{ color: C.teal, fontFamily: 'Nunito, sans-serif' }} onClick={onMore}>
          Lihat semua →
        </button>
      )}
    </div>
  )
}

function Card({ children, className = '', style = {}, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <div className={`rounded-2xl ${className} ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`} style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}`, ...style }} onClick={onClick}>
      {children}
    </div>
  )
}

function Avatar({ emoji, size = 44, bg = C.primaryLight }: { emoji: string; size?: number; bg?: string }) {
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.48 }}>
      {emoji}
    </div>
  )
}

function Stars({ n, size = 13 }: { n: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= n ? C.star : C.border, fontSize: size }}>★</span>
      ))}
    </span>
  )
}

function Badge({ children, color = C.primaryLight, text = C.primary }: { children: React.ReactNode; color?: string; text?: string }) {
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: color, color: text, fontFamily: 'Nunito, sans-serif' }}>
      {children}
    </span>
  )
}

function ProgressBar({ value, max = 100, color = C.primary, thin = false }: { value: number; max?: number; color?: string; thin?: boolean }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height: thin ? 5 : 8, backgroundColor: C.muted }}>
      <div className="h-full rounded-full" style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }} />
    </div>
  )
}

function IconBox({ emoji, bg = C.hero, size = 46 }: { emoji: string; bg?: string; size?: number }) {
  return (
    <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.48 }}>
      {emoji}
    </div>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ active, role, onNav }: { active: string; role: Role; onNav: (s: Screen) => void }) {
  const childTabs = [
    { icon: '🗺️', label: 'Petualangan', screen: 'child-dashboard' as Screen },
    { icon: '🛒', label: 'Toko', screen: 'child-shop' as Screen },
    { icon: '🏆', label: 'Prestasi', screen: 'achievements' as Screen },
    { icon: '👨‍👩‍👦', label: 'Orang Tua', screen: 'parent-password' as Screen },
  ]
  const parentTabs = [
    { icon: '🏠', label: 'Beranda', screen: 'parent-dashboard' as Screen },
    { icon: '📊', label: 'Analitik', screen: 'analytics' as Screen },
    { icon: '👩‍🏫', label: 'GPK', screen: 'gpk-services' as Screen },
    { icon: '💬', label: 'Forum', screen: 'forum' as Screen },
    { icon: '🛒', label: 'Toko', screen: 'store' as Screen },
  ]
  const gpkTabs = [
    { icon: '🏠', label: 'Beranda', screen: 'gpk-dashboard' as Screen },
    { icon: '💬', label: 'Chat', screen: 'forum' as Screen },
    { icon: '🤖', label: 'AI Asisten', screen: 'ai-assistant' as Screen },
    { icon: '📁', label: 'Arsip', screen: 'analytics' as Screen },
    { icon: '👤', label: 'Profil', screen: 'gpk-profile' as Screen },
  ]
  const tabs = role === 'child' ? childTabs : role === 'gpk' ? gpkTabs : parentTabs
  const accent = role === 'child' ? C.teal : role === 'gpk' ? C.purple : C.primary

  return (
    <div className="flex items-center justify-around px-2 flex-shrink-0" style={{ backgroundColor: C.card, borderTop: `1.5px solid ${C.border}`, paddingTop: 8, paddingBottom: 'max(env(safe-area-inset-bottom), 10px)' }}>
      {tabs.map((t, idx) => {
        const isActive = active === t.screen
        return (
          <button key={`${t.label}-${idx}`} className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[52px] py-1 cursor-pointer rounded-xl" style={{ color: isActive ? accent : C.mutedText }} onClick={() => onNav(t.screen)}>
            {isActive && <div className="w-5 h-1 rounded-full mb-0.5" style={{ backgroundColor: accent }} />}
            <span style={{ fontSize: 20, lineHeight: 1 }}>{t.icon}</span>
            <span className="text-center" style={{ fontFamily: 'Nunito, sans-serif', fontSize: 9.5, fontWeight: isActive ? 800 : 600 }}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── MASCOT SVG ILLUSTRATIONS ─────────────────────────────────────────────────
function MascotCastle() {
  return (
    <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Sky blobs */}
      <circle cx="60" cy="60" r="38" fill="rgba(255,255,255,0.18)" />
      <circle cx="260" cy="45" r="28" fill="rgba(255,255,255,0.13)" />
      <circle cx="290" cy="90" r="18" fill="rgba(255,255,255,0.10)" />
      {/* Castle body */}
      <rect x="90" y="120" width="140" height="110" rx="12" fill="rgba(255,255,255,0.22)" />
      <rect x="100" y="100" width="36" height="40" rx="8" fill="rgba(255,255,255,0.28)" />
      <rect x="184" y="100" width="36" height="40" rx="8" fill="rgba(255,255,255,0.28)" />
      <rect x="140" y="90" width="40" height="50" rx="8" fill="rgba(255,255,255,0.32)" />
      {/* Castle door */}
      <rect x="140" y="175" width="40" height="55" rx="20" fill="rgba(255,255,255,0.38)" />
      {/* Stars */}
      <text x="56" y="42" fontSize="22" fill="rgba(255,255,255,0.85)">✦</text>
      <text x="248" y="34" fontSize="16" fill="rgba(255,255,255,0.7)">✦</text>
      <text x="275" y="78" fontSize="12" fill="rgba(255,255,255,0.6)">✦</text>
      {/* Mascot face peeking from bottom */}
      <ellipse cx="160" cy="262" rx="72" ry="56" fill="rgba(255,255,255,0.96)" />
      <ellipse cx="160" cy="262" rx="72" ry="56" fill="#fff" />
      {/* Eyes */}
      <circle cx="140" cy="248" r="16" fill={C.teal} />
      <circle cx="180" cy="248" r="16" fill={C.teal} />
      <circle cx="140" cy="248" r="9" fill="#1a2535" />
      <circle cx="180" cy="248" r="9" fill="#1a2535" />
      <circle cx="144" cy="244" r="3.5" fill="#fff" />
      <circle cx="184" cy="244" r="3.5" fill="#fff" />
      {/* Eyebrows */}
      <path d="M128 232 Q140 226 152 232" stroke="#1a2535" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M168 232 Q180 226 192 232" stroke="#1a2535" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Nose */}
      <circle cx="160" cy="258" r="3" fill="#1a2535" opacity="0.4" />
    </svg>
  )
}

function MascotBlocks() {
  return (
    <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Floating blocks */}
      <rect x="60" y="30" width="54" height="54" rx="14" fill="rgba(255,255,255,0.28)" transform="rotate(-12 60 30)" />
      <rect x="200" y="20" width="44" height="44" rx="12" fill="rgba(255,255,255,0.22)" transform="rotate(10 200 20)" />
      <rect x="240" y="80" width="36" height="36" rx="10" fill="rgba(255,255,255,0.18)" transform="rotate(-6 240 80)" />
      <circle cx="80" cy="110" r="24" fill="rgba(255,255,255,0.20)" />
      {/* Stars/sparkles */}
      <text x="94" y="62" fontSize="20" fill="rgba(255,255,255,0.9)">★</text>
      <text x="215" y="52" fontSize="15" fill="rgba(255,255,255,0.75)">★</text>
      <text x="258" y="70" fontSize="11" fill="rgba(255,255,255,0.65)">✦</text>
      {/* Ground shadow */}
      <ellipse cx="160" cy="260" rx="90" ry="18" fill="rgba(0,0,0,0.06)" />
      {/* Mascot body */}
      <ellipse cx="160" cy="262" rx="72" ry="56" fill="#fff" />
      {/* Eyes */}
      <circle cx="140" cy="248" r="16" fill={C.primary} />
      <circle cx="180" cy="248" r="16" fill={C.primary} />
      <circle cx="140" cy="248" r="9" fill="#1a2535" />
      <circle cx="180" cy="248" r="9" fill="#1a2535" />
      <circle cx="144" cy="244" r="3.5" fill="#fff" />
      <circle cx="184" cy="244" r="3.5" fill="#fff" />
      {/* Eyebrows happy */}
      <path d="M128 231 Q140 223 152 231" stroke="#1a2535" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M168 231 Q180 223 192 231" stroke="#1a2535" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Smile */}
      <path d="M148 262 Q160 272 172 262" stroke="#1a2535" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="160" cy="257" r="2.5" fill="#1a2535" opacity="0.35" />
      {/* Antenna */}
      <circle cx="160" cy="192" r="10" fill="rgba(255,255,255,0.9)" />
      <rect x="157" y="195" width="6" height="18" rx="3" fill="rgba(255,255,255,0.7)" />
    </svg>
  )
}

function MascotPath() {
  return (
    <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Floating shapes */}
      <circle cx="70" cy="55" r="32" fill="rgba(255,255,255,0.18)" />
      <circle cx="252" cy="38" r="24" fill="rgba(255,255,255,0.14)" />
      <rect x="248" y="86" width="36" height="36" rx="18" fill="rgba(255,255,255,0.16)" />
      <text x="58" y="62" fontSize="18" fill="rgba(255,255,255,0.85)">♥</text>
      <text x="244" y="46" fontSize="14" fill="rgba(255,255,255,0.75)">✦</text>
      {/* Path dots */}
      {[100, 130, 160, 190, 220].map((x, i) => (
        <circle key={i} cx={x} cy={160 - (i % 2) * 18} r="6" fill="rgba(255,255,255,0.45)" />
      ))}
      {/* Three figures */}
      <ellipse cx="120" cy="200" rx="20" ry="22" fill="rgba(255,255,255,0.25)" />
      <circle cx="120" cy="182" r="11" fill="rgba(255,255,255,0.3)" />
      <ellipse cx="200" cy="200" rx="20" ry="22" fill="rgba(255,255,255,0.25)" />
      <circle cx="200" cy="182" r="11" fill="rgba(255,255,255,0.3)" />
      {/* Mascot peeking */}
      <ellipse cx="160" cy="264" rx="72" ry="54" fill="#fff" />
      {/* Eyes with purple tint */}
      <circle cx="140" cy="250" r="16" fill={C.purple} />
      <circle cx="180" cy="250" r="16" fill={C.purple} />
      <circle cx="140" cy="250" r="9" fill="#1a2535" />
      <circle cx="180" cy="250" r="9" fill="#1a2535" />
      <circle cx="144" cy="246" r="3.5" fill="#fff" />
      <circle cx="184" cy="246" r="3.5" fill="#fff" />
      {/* Eyebrows */}
      <path d="M128 234 Q140 227 152 234" stroke="#1a2535" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M168 234 Q180 227 192 234" stroke="#1a2535" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="160" cy="260" r="2.5" fill="#1a2535" opacity="0.35" />
    </svg>
  )
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const slides = [
  { eyebrow: 'RUANG AMAN UNTUK BERTUMBUH', title: 'Setiap langkah kecil\nadalah petualangan.', desc: 'Questoria menemani anak belajar, bermain, dan berkembang dengan ritme yang terasa nyaman.', bg: C.teal, Mascot: MascotCastle },
  { eyebrow: 'BELAJAR SESUAI CARANYA', title: 'Bermain dengan\ntujuan yang jelas.', desc: 'Aktivitas kecil yang menyenangkan membantu membangun fokus, kepercayaan diri, dan keterampilan sehari-hari.', bg: C.primary, Mascot: MascotBlocks },
  { eyebrow: 'PENDAMPINGAN YANG TERHUBUNG', title: 'Tumbuh bersama,\ndipahami bersama.', desc: 'Orang tua, GPK, dan anak dapat melihat perjalanan yang sama—tanpa terburu-buru.', bg: C.purple, Mascot: MascotPath },
]

function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [slide, setSlide] = useState(0)
  const s = slides[slide]
  const isLast = slide === slides.length - 1
  const { Mascot } = s

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#fff' }}>
      {/* Hero area with mascot */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ height: 'clamp(17rem, 50vh, 32rem)', backgroundColor: s.bg }}>
        <div className="absolute rounded-full" style={{ width: 200, height: 200, right: -60, top: -60, backgroundColor: 'rgba(255,255,255,0.12)' }} />
        <div className="absolute rounded-full" style={{ width: 120, height: 120, left: -40, top: 20, backgroundColor: 'rgba(255,255,255,0.08)' }} />
        {/* Slide dots top center */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 24 : 7, height: 7, borderRadius: 9, backgroundColor: i === slide ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'width 0.25s' }} />
          ))}
        </div>
        {/* Skip */}
        <button className="absolute top-3 right-5 text-sm font-bold min-h-[40px] px-2 z-10" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Nunito, sans-serif' }} onClick={onDone}>Lewati</button>
        {/* Mascot illustration — peeks from bottom */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center" style={{ height: '100%' }}>
          <Mascot />
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="flex-1 flex flex-col justify-between px-7 pt-7 pb-8 max-w-lg w-full mx-auto" style={{ backgroundColor: '#fff' }}>
        <div>
          <p className="text-[10px] font-black tracking-[0.16em] mb-3" style={{ color: s.bg, fontFamily: 'Inter, sans-serif' }}>{s.eyebrow}</p>
          <h1 className="font-black leading-[1.1] text-[clamp(1.75rem,5.5vw,2.8rem)]" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep, whiteSpace: 'pre-line' }}>{s.title}</h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: C.mutedText, fontFamily: 'Inter, sans-serif' }}>{s.desc}</p>
        </div>
        <button
          className="w-full mt-6 min-h-[56px] rounded-2xl font-black text-white text-base active:scale-[0.98]"
          style={{ backgroundColor: s.bg, fontFamily: 'Nunito, sans-serif', boxShadow: `0 6px 20px ${s.bg}55` }}
          onClick={() => isLast ? onDone() : setSlide(v => v + 1)}
        >
          {isLast ? 'Mulai Petualangan →' : 'Lanjut →'}
        </button>
      </div>
    </div>
  )
}

// ─── ROLE SELECT MASCOT ───────────────────────────────────────────────────────
function MascotWelcome() {
  return (
    <svg viewBox="0 0 320 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Glow blobs */}
      <circle cx="72" cy="68" r="44" fill="rgba(26,145,176,0.18)" />
      <circle cx="256" cy="52" r="34" fill="rgba(124,92,191,0.14)" />
      <circle cx="280" cy="120" r="22" fill="rgba(240,147,52,0.12)" />
      {/* Castle silhouette */}
      <rect x="100" y="130" width="120" height="90" rx="10" fill="rgba(255,255,255,0.12)" />
      <rect x="105" y="112" width="30" height="36" rx="7" fill="rgba(255,255,255,0.16)" />
      <rect x="190" y="112" width="30" height="36" rx="7" fill="rgba(255,255,255,0.16)" />
      <rect x="145" y="103" width="30" height="44" rx="7" fill="rgba(255,255,255,0.2)" />
      <rect x="148" y="168" width="24" height="52" rx="12" fill="rgba(255,255,255,0.24)" />
      {/* Stars */}
      <text x="60" y="56" fontSize="22" fill="rgba(255,255,255,0.8)">✦</text>
      <text x="248" y="44" fontSize="16" fill="rgba(255,255,255,0.7)">✦</text>
      <text x="280" y="108" fontSize="12" fill="rgba(255,255,255,0.6)">★</text>
      <text x="40" y="120" fontSize="12" fill="rgba(255,255,255,0.5)">★</text>
      {/* Mascot peeking */}
      <ellipse cx="160" cy="284" rx="80" ry="60" fill="#fff" />
      <circle cx="137" cy="264" r="18" fill={C.teal} />
      <circle cx="183" cy="264" r="18" fill={C.teal} />
      <circle cx="137" cy="264" r="10" fill="#1a2535" />
      <circle cx="183" cy="264" r="10" fill="#1a2535" />
      <circle cx="141" cy="259" r="4" fill="#fff" />
      <circle cx="187" cy="259" r="4" fill="#fff" />
      <path d="M124 247 Q137 239 150 247" stroke="#1a2535" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M170 247 Q183 239 196 247" stroke="#1a2535" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M147 276 Q160 288 173 276" stroke="#1a2535" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="160" cy="271" r="3" fill="#1a2535" opacity="0.35" />
    </svg>
  )
}

// ─── ROLE SELECT ──────────────────────────────────────────────────────────────
function RoleSelectScreen({ onRole }: { onRole: (r: Role) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#fff' }}>
      {/* Hero */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ height: 'clamp(15rem, 46vh, 30rem)', background: `linear-gradient(160deg, ${C.hero} 0%, #0f3d50 100%)` }}>
        <div className="absolute rounded-full" style={{ width: 180, height: 180, right: -50, top: -50, backgroundColor: 'rgba(26,145,176,0.15)' }} />
        <div className="absolute rounded-full" style={{ width: 100, height: 100, left: -30, bottom: 20, backgroundColor: 'rgba(240,147,52,0.10)' }} />
        {/* Logo row */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          <div className="rounded-xl flex items-center justify-center" style={{ width: 36, height: 36, backgroundColor: 'rgba(26,145,176,0.35)', fontSize: 20 }}>🏰</div>
          <span className="font-black text-xl text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>Questoria</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center" style={{ height: '100%' }}>
          <MascotWelcome />
        </div>
      </div>

      {/* Sheet */}
      <div className="flex-1 flex flex-col justify-between px-6 pt-7 pb-10" style={{ backgroundColor: '#fff' }}>
        <div>
          <h2 className="font-black text-2xl text-center mb-1" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Halo! Kamu siapa?</h2>
          <p className="text-sm text-center mb-6" style={{ color: C.mutedText }}>Pilih peran untuk melanjutkan</p>
          <div className="flex flex-col gap-3">
            <button
              className="w-full flex items-center gap-4 p-5 rounded-2xl active:scale-[0.98] min-h-[68px]"
              style={{ background: `linear-gradient(135deg, ${C.teal}, #117a97)`, fontFamily: 'Nunito, sans-serif', boxShadow: `0 6px 20px ${C.teal}44` }}
              onClick={() => onRole('child')}
            >
              <div className="rounded-2xl flex items-center justify-center" style={{ width: 46, height: 46, backgroundColor: 'rgba(255,255,255,0.22)', fontSize: 24 }}>🧒</div>
              <div className="flex-1 text-left">
                <p className="font-black text-base text-white">Aku Anak</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>Masuk ke dunia petualangan</p>
              </div>
              <div className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28, backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <span className="text-white font-black text-sm">→</span>
              </div>
            </button>
            <button
              className="w-full flex items-center gap-4 p-5 rounded-2xl active:scale-[0.98] min-h-[68px]"
              style={{ background: `linear-gradient(135deg, ${C.purple}, #5d3ea8)`, fontFamily: 'Nunito, sans-serif', boxShadow: `0 6px 20px ${C.purple}44` }}
              onClick={() => onRole('gpk')}
            >
              <div className="rounded-2xl flex items-center justify-center" style={{ width: 46, height: 46, backgroundColor: 'rgba(255,255,255,0.22)', fontSize: 24 }}>🧑‍🏫</div>
              <div className="flex-1 text-left">
                <p className="font-black text-base text-white">Guru GPK</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>Dashboard pendampingan</p>
              </div>
              <div className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28, backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <span className="text-white font-black text-sm">→</span>
              </div>
            </button>
          </div>
        </div>
        <p className="text-xs text-center mt-4" style={{ color: C.mutedText }}>Akses Orang Tua tersedia di dalam aplikasi anak</p>
      </div>
    </div>
  )
}

// ─── ICON INPUT ───────────────────────────────────────────────────────────────
function IconInput({ icon, placeholder, type = 'text', value, onChange, accentColor, right }: { icon: React.ReactNode; placeholder: string; type?: string; value: string; onChange: (v: string) => void; accentColor: string; right?: React.ReactNode }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0
  return (
    <div className="flex items-center gap-3 px-4 rounded-2xl" style={{ height: 54, border: `1.5px solid ${active ? accentColor : C.border}`, backgroundColor: active ? C.card : C.muted }}>
      <span style={{ color: active ? accentColor : C.mutedText, fontSize: 18, flexShrink: 0 }}>{icon}</span>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className="flex-1 bg-transparent outline-none text-sm" style={{ color: C.deep, fontFamily: 'Inter, sans-serif' }} />
      {right && <span style={{ color: C.mutedText, fontSize: 16, flexShrink: 0 }}>{right}</span>}
    </div>
  )
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginMascotHero({ accent, roleEmoji, isChild }: { accent: string; roleEmoji: string; isChild: boolean }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <circle cx="60" cy="55" r="40" fill="rgba(255,255,255,0.12)" />
      <circle cx="270" cy="40" r="30" fill="rgba(255,255,255,0.09)" />
      <circle cx="290" cy="100" r="20" fill="rgba(255,255,255,0.08)" />
      <text x="50" y="48" fontSize="18" fill="rgba(255,255,255,0.75)">✦</text>
      <text x="258" y="36" fontSize="14" fill="rgba(255,255,255,0.65)">✦</text>
      <text x="278" y="90" fontSize="11" fill="rgba(255,255,255,0.55)">★</text>
      {/* Mascot */}
      <ellipse cx="160" cy="200" rx="70" ry="54" fill="#fff" />
      <circle cx="139" cy="184" r="17" fill={accent} />
      <circle cx="181" cy="184" r="17" fill={accent} />
      <circle cx="139" cy="184" r="9.5" fill="#1a2535" />
      <circle cx="181" cy="184" r="9.5" fill="#1a2535" />
      <circle cx="143" cy="179" r="3.5" fill="#fff" />
      <circle cx="185" cy="179" r="3.5" fill="#fff" />
      <path d={isChild ? "M126 168 Q139 161 152 168" : "M126 167 Q139 158 152 167"} stroke="#1a2535" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d={isChild ? "M168 168 Q181 161 194 168" : "M168 167 Q181 158 194 167"} stroke="#1a2535" strokeWidth="3" strokeLinecap="round" fill="none" />
      {isChild
        ? <path d="M148 194 Q160 204 172 194" stroke="#1a2535" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        : <path d="M148 195 Q160 200 172 195" stroke="#1a2535" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      }
      <circle cx="160" cy="191" r="2.5" fill="#1a2535" opacity="0.32" />
      {/* Role badge */}
      <rect x="136" y="128" width="48" height="28" rx="14" fill={accent} />
      <text x="160" y="146" textAnchor="middle" fontSize="16">{roleEmoji}</text>
    </svg>
  )
}

function LoginScreen({ role, onLogin, onRegister, onBack }: { role: Role; onLogin: () => void; onRegister: () => void; onBack: () => void }) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [passConfirm, setPassConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)

  const isChild = role === 'child'
  const accent = isChild ? C.teal : C.purple
  const roleLabel = isChild ? 'Anak' : 'Guru GPK'
  const roleEmoji = isChild ? '🧒' : '🧑‍🏫'
  const heroBg = isChild
    ? `linear-gradient(160deg, #0f3d50 0%, ${C.teal} 100%)`
    : `linear-gradient(160deg, #2a1a4e 0%, ${C.purple} 100%)`

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: '#fff' }}>
      {/* Hero */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ height: 'clamp(13rem, 38vh, 24rem)', background: heroBg }}>
        <div className="absolute rounded-full" style={{ width: 160, height: 160, right: -50, top: -50, backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <button onClick={onBack} className="absolute top-4 left-5 flex items-center gap-1.5 font-semibold text-sm z-10 min-h-[40px] px-1" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Nunito, sans-serif' }}>← Kembali</button>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="font-black text-base text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>Questoria</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center" style={{ height: '100%' }}>
          <LoginMascotHero accent={accent} roleEmoji={roleEmoji} isChild={isChild} />
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex mx-6 mt-6 p-1 rounded-2xl" style={{ backgroundColor: C.muted }}>
        {(['login', 'register'] as const).map((t) => (
          <button key={t} className="flex-1 py-2.5 rounded-xl font-black text-sm min-h-[44px]" style={{ backgroundColor: tab === t ? accent : 'transparent', color: tab === t ? '#fff' : C.mutedText, fontFamily: 'Nunito, sans-serif', boxShadow: tab === t ? `0 3px 12px ${accent}44` : 'none' }} onClick={() => setTab(t)}>
            {t === 'login' ? 'Masuk' : 'Daftar'}
          </button>
        ))}
      </div>

      {/* Title */}
      <div className="px-6 pt-5 pb-1">
        <h1 className="font-black text-2xl" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>
          {tab === 'login' ? `Selamat datang\nkembali! 👋` : `Buat akun baru\nuntuk ${roleLabel} ✨`}
        </h1>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col px-6 pt-4 pb-8 gap-3">
        {tab === 'register' && (
          <IconInput icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>} placeholder="Nama Lengkap" value={name} onChange={setName} accentColor={accent} />
        )}
        <IconInput icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>} placeholder="Alamat Email" type="email" value={email} onChange={setEmail} accentColor={accent} />
        <IconInput icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" /></svg>} placeholder="Kata Sandi" type={showPass ? 'text' : 'password'} value={pass} onChange={setPass} accentColor={accent} right={<button onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</button>} />
        {tab === 'register' && (
          <IconInput icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" /></svg>} placeholder="Ulangi Kata Sandi" type="password" value={passConfirm} onChange={setPassConfirm} accentColor={accent} />
        )}
        {tab === 'login' && (
          <div className="text-right -mt-1">
            <button className="text-xs font-bold min-h-[40px] px-1" style={{ color: accent, fontFamily: 'Inter, sans-serif' }}>Lupa kata sandi?</button>
          </div>
        )}
        <button
          className="w-full mt-1 font-black text-white text-base active:scale-[0.98] min-h-[56px] rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${accent}, ${isChild ? '#117a97' : '#5d3ea8'})`, fontFamily: 'Nunito, sans-serif', boxShadow: `0 6px 20px ${accent}50` }}
          onClick={tab === 'register' && role === 'gpk' ? onRegister : onLogin}
        >
          {tab === 'login' ? `Masuk sebagai ${roleLabel} →` : role === 'gpk' ? 'Daftar sebagai GPK →' : 'Buat Akun →'}
        </button>
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
          <span className="text-xs" style={{ color: C.mutedText }}>atau lanjut dengan</span>
          <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
        </div>
        <button className="w-full flex items-center justify-center gap-2.5 font-bold text-sm rounded-2xl active:scale-[0.97] min-h-[50px]" style={{ border: `1.5px solid ${C.border}`, backgroundColor: C.card, color: C.deep, fontFamily: 'Nunito, sans-serif' }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Lanjutkan dengan Google
        </button>
      </div>
    </div>
  )
}

// ─── PARENT PASSWORD ──────────────────────────────────────────────────────────
function ParentPasswordScreen({ onUnlock, onBack }: { onUnlock: () => void; onBack: () => void }) {
  const [pin, setPin] = useState('')
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
      <div className="relative px-6 pt-6 pb-10 flex-shrink-0" style={{ backgroundColor: C.hero, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: '50%', backgroundColor: C.primary, opacity: 0.08 }} />
        <button onClick={onBack} className="flex items-center gap-2 mb-6 min-h-[44px] font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif' }}>← Kembali ke Anak</button>
        <div className="rounded-3xl flex items-center justify-center mx-auto mb-4" style={{ width: 72, height: 72, backgroundColor: 'rgba(240,147,52,0.2)', fontSize: 36 }}>👨‍👩‍👦</div>
        <h2 className="font-black text-2xl text-white text-center mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Sesi Orang Tua</h2>
        <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>Masukkan kata sandi untuk lanjut</p>
      </div>
      <div className="flex-1 px-6 pt-8 pb-8 flex flex-col gap-4">
        <p className="text-xs text-center" style={{ color: C.mutedText }}>Laporan AI, pencarian GPK &amp; forum komunitas terlindungi kata sandi.</p>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base" style={{ color: C.mutedText }}>🔒</span>
          <input type="password" placeholder="••••••••" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full outline-none text-center" style={{ padding: '15px 48px', borderRadius: 16, border: `1.5px solid ${C.border}`, backgroundColor: C.card, fontSize: 18, letterSpacing: 8, color: C.deep, fontFamily: 'Inter, sans-serif' }} />
        </div>
        <button className="w-full py-4 rounded-2xl font-black text-white text-base min-h-[56px]" style={{ backgroundColor: C.hero, fontFamily: 'Nunito, sans-serif' }} onClick={onUnlock}>Masuk Sesi Orang Tua 🔓</button>
      </div>
    </div>
  )
}

// ─── CHILD PROFILE SETUP ──────────────────────────────────────────────────────
function ChildProfileSetupScreen({ onDone }: { onDone: (name: string) => void }) {
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('')
  const [grade, setGrade] = useState('')
  const [school, setSchool] = useState('')
  const [parentName, setParentName] = useState('')
  const [parentAge, setParentAge] = useState('')
  const [address, setAddress] = useState('')

  const fields = [
    { label: 'Nama Anak', emoji: '🧒', value: childName, onChange: setChildName, placeholder: 'Contoh: Rafi Ardiansyah' },
    { label: 'Usia Anak', emoji: '🎂', value: childAge, onChange: setChildAge, placeholder: 'Contoh: 8 tahun' },
    { label: 'Kelas', emoji: '📚', value: grade, onChange: setGrade, placeholder: 'Contoh: Kelas 2 SD' },
    { label: 'Nama Sekolah', emoji: '🏫', value: school, onChange: setSchool, placeholder: 'Contoh: SD Negeri 1 Jakarta' },
    { label: 'Nama Orang Tua', emoji: '👩', value: parentName, onChange: setParentName, placeholder: 'Contoh: Dewi Rahayu' },
    { label: 'Usia Orang Tua', emoji: '🎂', value: parentAge, onChange: setParentAge, placeholder: 'Contoh: 35 tahun' },
    { label: 'Alamat', emoji: '📍', value: address, onChange: setAddress, placeholder: 'Contoh: Jl. Melati No. 12, Jakarta' },
  ]

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: C.bg }}>
      <div className="px-6 pt-6 pb-8 flex-shrink-0" style={{ backgroundColor: C.hero, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', backgroundColor: C.teal, opacity: 0.1 }} />
        <div className="text-center relative z-10">
          <div style={{ fontSize: 52, marginBottom: 8 }}>🌟</div>
          <h1 className="font-black text-2xl text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>Isi Profil Dulu, ya!</h1>
          <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Biar Questoria bisa kenal kamu lebih baik</p>
        </div>
        <div className="flex gap-2 mt-4 relative z-10 justify-center">
          {fields.map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-8 flex flex-col gap-3.5">
        {fields.map((f) => (
          <div key={f.label}>
            <div className="flex items-center gap-2 mb-1.5">
              <span style={{ fontSize: 16 }}>{f.emoji}</span>
              <label className="text-xs font-bold" style={{ color: C.mutedText, fontFamily: 'Nunito, sans-serif', letterSpacing: 0.5 }}>{f.label.toUpperCase()}</label>
            </div>
            <input
              placeholder={f.placeholder}
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="w-full outline-none text-sm"
              style={{ padding: '13px 16px', borderRadius: 14, border: `1.5px solid ${f.value ? C.teal : C.border}`, backgroundColor: f.value ? C.card : C.muted, color: C.deep, fontFamily: 'Inter, sans-serif' }}
            />
          </div>
        ))}

        <button
          className="w-full mt-3 py-4 rounded-2xl font-black text-white text-base min-h-[56px] active:scale-[0.98]"
          style={{ backgroundColor: C.teal, fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 16px rgba(26,145,176,0.35)' }}
          onClick={() => onDone(childName || 'Pejuang Kecil')}
        >
          Mulai Petualangan! 🚀
        </button>
      </div>
    </div>
  )
}

// ─── ADVENTURE MAP ────────────────────────────────────────────────────────────
const mapLevels = [
  { id: 1, name: 'Hutan Ajaib', emoji: '🌳', stars: 3, unlocked: true },
  { id: 2, name: 'Gua Kristal', emoji: '💎', stars: 2, unlocked: true },
  { id: 3, name: 'Istana Awan', emoji: '🏰', stars: 1, unlocked: true },
  { id: 4, name: 'Lautan Mimpi', emoji: '🌊', stars: 0, unlocked: false },
  { id: 5, name: 'Puncak Bintang', emoji: '⭐', stars: 0, unlocked: false },
]

// Map layout constants — all positions reference this fixed-width canvas
const MAP_W = 300
const MAP_NODE_W = 72
const MAP_MARGIN = 18
// Left node center X = MAP_MARGIN + MAP_NODE_W/2
const MAP_LX = MAP_MARGIN + MAP_NODE_W / 2   // = 54
// Right node center X = MAP_W - MAP_MARGIN - MAP_NODE_W/2
const MAP_RX = MAP_W - MAP_MARGIN - MAP_NODE_W / 2  // = 246
const MAP_ROW_H = 108
const MAP_NODE_CY = 38  // vertical center of node within each row slot

function AdventureMap({ onPlay }: { onPlay: () => void }) {
  const totalH = mapLevels.length * MAP_ROW_H + 24
  return (
    <div className="rounded-2xl overflow-hidden" style={{ width: MAP_W, margin: '0 auto', height: totalH, position: 'relative', background: 'linear-gradient(180deg, #1a4a2e 0%, #2d6a4f 35%, #1b4332 65%, #0d2818 100%)' }}>
      {/* Forest decoration */}
      {(['🌲','🌳','🌿','🍃','🌲','🌳','🌿','🌲','🍀','🌱','🌲','🌿'] as const).map((tree, i) => (
        <div key={i} style={{ position: 'absolute', fontSize: i % 3 === 0 ? 20 : 14, opacity: 0.25 + (i % 4) * 0.08, top: `${(i * 9) % 93}%`, left: i % 2 === 0 ? `${(i * 7) % 12}%` : `${88 - (i * 5) % 12}%`, pointerEvents: 'none' }}>{tree}</div>
      ))}
      {(['✨','⭐','💫','✨'] as const).map((s, i) => (
        <div key={`s${i}`} style={{ position: 'absolute', fontSize: 11, opacity: 0.35, top: `${i * 24 + 5}%`, left: `${28 + i * 11}%`, pointerEvents: 'none' }}>{s}</div>
      ))}

      {/* SVG connecting paths — coordinates match node centers exactly */}
      <svg style={{ position: 'absolute', inset: 0, width: MAP_W, height: totalH, pointerEvents: 'none' }}>
        {mapLevels.map((lv, i) => {
          if (i === 0) return null
          const prevX = (i - 1) % 2 === 0 ? MAP_LX : MAP_RX
          const prevY = (i - 1) * MAP_ROW_H + MAP_NODE_CY
          const currX = i % 2 === 0 ? MAP_LX : MAP_RX
          const currY = i * MAP_ROW_H + MAP_NODE_CY
          const midY = (prevY + currY) / 2
          const unlocked = mapLevels[i - 1].unlocked && lv.unlocked
          return (
            <path key={i}
              d={`M${prevX},${prevY} C${prevX},${midY} ${currX},${midY} ${currX},${currY}`}
              stroke={unlocked ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)'}
              strokeWidth="3" strokeDasharray="7 5" fill="none"
            />
          )
        })}
      </svg>

      {mapLevels.map((lv, i) => {
        const isLeft = i % 2 === 0
        const isActive = lv.id === 3
        // Position the node so its center aligns with MAP_LX or MAP_RX
        const nodeLeft = isLeft ? MAP_LX - MAP_NODE_W / 2 : MAP_RX - MAP_NODE_W / 2
        return (
          <div key={lv.id} style={{ position: 'absolute', left: nodeLeft, top: i * MAP_ROW_H }}>
            <button onClick={() => lv.unlocked && onPlay()} disabled={!lv.unlocked} className="flex flex-col items-center gap-1" style={{ width: MAP_NODE_W }}>
              {isActive && (
                <div className="font-black text-xs px-2.5 py-0.5 rounded-full" style={{ backgroundColor: C.star, color: C.deep, fontFamily: 'Nunito, sans-serif', fontSize: 10, marginBottom: 2, whiteSpace: 'nowrap' }}>▼ Sekarang</div>
              )}
              <div className="rounded-full flex items-center justify-center" style={{ width: MAP_NODE_W, height: MAP_NODE_W, fontSize: 28, backgroundColor: lv.unlocked ? (isActive ? C.teal : 'rgba(26,145,176,0.65)') : 'rgba(255,255,255,0.07)', border: isActive ? `3px solid ${C.star}` : `2px solid ${lv.unlocked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`, boxShadow: isActive ? `0 0 22px rgba(26,145,176,0.65)` : lv.unlocked ? '0 4px 12px rgba(0,0,0,0.3)' : 'none', opacity: lv.unlocked ? 1 : 0.4 }}>
                {lv.unlocked ? lv.emoji : '🔒'}
              </div>
              <p className="font-black text-xs text-center" style={{ fontFamily: 'Nunito, sans-serif', color: 'white', lineHeight: 1.3 }}>Level {lv.id}</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 9, textAlign: 'center', lineHeight: 1.3, maxWidth: 68 }}>{lv.name}</p>
              <div className="flex gap-0.5">
                {[1,2,3].map((s) => <span key={s} style={{ fontSize: 10, color: s <= lv.stars ? C.star : 'rgba(255,255,255,0.2)' }}>★</span>)}
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ─── CHILD DASHBOARD ──────────────────────────────────────────────────────────
function ChildDashboard({ onNav, calmMode, onToggleCalmMode, childName }: { onNav: (s: Screen) => void; calmMode: boolean; onToggleCalmMode: () => void; childName: string }) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
      {/* Compact hero card */}
      <div className="px-4 pt-4 pb-0 flex-shrink-0">
        <div className="rounded-2xl px-4 py-3.5 relative overflow-hidden" style={{ backgroundColor: C.hero }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 110, height: 110, borderRadius: '50%', backgroundColor: C.teal, opacity: 0.1 }} />
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 1 }}>Halo,</p>
              <p className="font-black text-lg text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>{childName} 👋</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onToggleCalmMode} className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl min-h-[32px]" style={{ backgroundColor: calmMode ? 'rgba(26,145,176,0.25)' : 'rgba(255,255,255,0.1)', border: `1px solid rgba(255,255,255,${calmMode ? '0.3' : '0.12'})`, color: C.white, fontFamily: 'Nunito, sans-serif', fontSize: 10, fontWeight: 700 }}>
                <span style={{ fontSize: 12 }}>{calmMode ? '🌙' : '☀️'}</span>
                {calmMode ? 'Tenang' : 'Normal'}
              </button>
              <div className="flex items-center gap-1.5">
                <button onClick={() => onNav('settings')} className="rounded-xl flex items-center justify-center" style={{ width: 34, height: 34, backgroundColor: 'rgba(255,255,255,0.1)', fontSize: 14 }}>⚙️</button>
                <div className="relative">
                  <div className="rounded-full flex items-center justify-center" style={{ width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.1)', fontSize: 20 }}>🧒</div>
                  <div className="absolute -top-1 -right-1 rounded-full flex items-center justify-center font-black" style={{ width: 16, height: 16, backgroundColor: C.star, color: C.deep, fontSize: 9 }}>7</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: 1.5, fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>TOTAL BINTANG</p>
              <p className="font-black text-white" style={{ fontFamily: 'Nunito, sans-serif', fontSize: 32, lineHeight: 1.1 }}>⭐ 47</p>
            </div>
            <div className="flex gap-1.5">
              <span style={{ backgroundColor: 'rgba(26,145,176,0.3)', color: C.teal, borderRadius: 999, padding: '3px 8px', fontSize: 10, fontWeight: 800, fontFamily: 'Nunito, sans-serif' }}>Lv.7</span>
              <span style={{ backgroundColor: 'rgba(240,147,52,0.2)', color: C.primary, borderRadius: 999, padding: '3px 8px', fontSize: 10, fontWeight: 800, fontFamily: 'Nunito, sans-serif' }}>🔥 5 hari</span>
            </div>
          </div>
          <div className="mt-2 relative z-10">
            <ProgressBar value={1240} max={2000} color={C.teal} thin />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginTop: 3, textAlign: 'right' }}>1.240 / 2.000 XP</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-4 pt-3 pb-0 flex-shrink-0">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { emoji: '🎯', value: '12', label: 'Misi Selesai' },
            { emoji: '💎', value: '6', label: 'Level Dibuka' },
            { emoji: '⏱️', value: '3j', label: 'Main Hari Ini' },
          ].map((s) => (
            <Card key={s.label} className="p-3 text-center">
              <div style={{ fontSize: 20 }}>{s.emoji}</div>
              <p className="font-black text-lg" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>{s.value}</p>
              <p className="text-xs" style={{ color: C.mutedText }}>{s.label}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        {/* Active mission */}
        <div>
          <SectionHeader title="🎮 Misi Aktif" />
          <div className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98]" style={{ background: `linear-gradient(135deg, ${C.teal}, #0d5f7a)` }} onClick={() => onNav('game')}>
            <div className="rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ width: 52, height: 52, backgroundColor: 'rgba(255,255,255,0.15)' }}>🏰</div>
            <div className="flex-1">
              <p className="font-black text-white text-base" style={{ fontFamily: 'Nunito, sans-serif' }}>Level 3: Istana Awan</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Lanjutkan misi kamu!</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <div style={{ height: '100%', width: '40%', backgroundColor: C.star, borderRadius: 99 }} />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>40%</span>
              </div>
            </div>
            <div className="rounded-full flex items-center justify-center" style={{ width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', fontSize: 18 }}>▶</div>
          </div>
        </div>

        {/* Adventure map (main focus) */}
        <div>
          <SectionHeader title="🗺️ Peta Petualangan" onMore={() => onNav('achievements')} />
          <AdventureMap onPlay={() => onNav('game')} />
        </div>

        {/* Daily challenges */}
        <div>
          <SectionHeader title="⚡ Tantangan Harian" />
          <div className="flex flex-col gap-2.5">
            {[
              { emoji: '🎮', title: 'Main game 1 sesi', xp: '+20 XP', done: true },
              { emoji: '🌟', title: 'Raih 3 bintang di level manapun', xp: '+50 XP', done: false },
              { emoji: '🔥', title: 'Streak 5 hari berturut-turut', xp: '+80 XP', done: false },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ backgroundColor: c.done ? C.tealLight : C.card, border: `1.5px solid ${c.done ? C.teal : C.border}` }}>
                <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: 42, height: 42, backgroundColor: c.done ? C.teal : C.muted, fontSize: 20 }}>{c.emoji}</div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep, textDecoration: c.done ? 'line-through' : 'none' }}>{c.title}</p>
                  <p className="font-black text-xs mt-0.5" style={{ fontFamily: 'Nunito, sans-serif', color: c.done ? C.teal : C.primary }}>{c.done ? '✓ Selesai!' : c.xp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="child-dashboard" role="child" onNav={onNav} />
    </div>
  )
}

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
function AchievementsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const levels = [
    { id: 1, name: 'Hutan Ajaib', emoji: '🌳', stars: 3 },
    { id: 2, name: 'Gua Kristal', emoji: '💎', stars: 2 },
    { id: 3, name: 'Istana Awan', emoji: '🏰', stars: 1 },
    { id: 4, name: 'Lautan Mimpi', emoji: '🌊', stars: 0, locked: true },
    { id: 5, name: 'Puncak Bintang', emoji: '⭐', stars: 0, locked: true },
  ]
  const totalStars = levels.reduce((a, b) => a + b.stars, 0)
  const badges = [
    { emoji: '🎖️', label: 'Pemula Berani', earned: true },
    { emoji: '⚡', label: 'Cepat Tanggap', earned: true },
    { emoji: '🎯', label: 'Tepat Sasaran', earned: true },
    { emoji: '🌟', label: 'Bintang 5', earned: false },
    { emoji: '🏅', label: 'Petualang', earned: false },
    { emoji: '🦁', label: 'Pemberani', earned: false },
  ]

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
      <div className="px-5 pt-5 pb-0 flex-shrink-0">
        <div className="rounded-3xl p-5 relative overflow-hidden" style={{ backgroundColor: C.hero }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', backgroundColor: C.star, opacity: 0.1 }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 4 }}>Total Bintang Kamu</p>
          <p className="font-black text-white" style={{ fontFamily: 'Nunito, sans-serif', fontSize: 48, lineHeight: 1 }}>⭐ {totalStars}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>dari 15 bintang tersedia</p>
          <div className="mt-3">
            <ProgressBar value={totalStars} max={15} color={C.star} thin />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
        {/* Weekly XP */}
        <div>
          <SectionHeader title="📅 XP Minggu Ini" />
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-black text-2xl" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>+340 XP</p>
                <p className="text-xs" style={{ color: C.mutedText }}>Target: 400 XP/minggu</p>
              </div>
              <div className="text-right">
                <p className="font-black text-base" style={{ fontFamily: 'Nunito, sans-serif', color: C.primary }}>85%</p>
                <p className="text-xs" style={{ color: C.mutedText }}>tercapai</p>
              </div>
            </div>
            <ProgressBar value={340} max={400} color={C.primary} />
            <div className="flex items-end justify-between gap-1.5 mt-3" style={{ height: 52 }}>
              {[{ day: 'Sen', val: 60 }, { day: 'Sel', val: 80 }, { day: 'Rab', val: 40 }, { day: 'Kam', val: 90 }, { day: 'Jum', val: 70 }, { day: 'Sab', val: 100 }, { day: 'Min', val: 30 }].map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg" style={{ height: `${d.val}%`, backgroundColor: d.day === 'Sab' ? C.primary : C.muted }} />
                  <span style={{ fontSize: 9, color: C.mutedText, fontFamily: 'Nunito, sans-serif' }}>{d.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <SectionHeader title="🏆 Pencapaian per Level" />
          <div className="flex flex-col gap-2.5">
            {levels.map((lv) => (
              <div key={lv.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}`, opacity: (lv as any).locked ? 0.45 : 1 }}>
                <IconBox emoji={(lv as any).locked ? '🔒' : lv.emoji} bg={(lv as any).locked ? C.muted : C.hero} />
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Level {lv.id}: {lv.name}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3].map((s) => <span key={s} style={{ fontSize: 14, color: s <= lv.stars ? C.star : C.border }}>★</span>)}
                  </div>
                </div>
                <p className="font-black text-xl" style={{ fontFamily: 'Nunito, sans-serif', color: lv.stars > 0 ? C.star : C.mutedText }}>{lv.stars}/3</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader title="🏅 Lencana Khusus" />
          <div className="grid grid-cols-3 gap-3">
            {badges.map((b, i) => (
              <Card key={i} className="flex flex-col items-center gap-2 p-4" style={{ opacity: b.earned ? 1 : 0.4 }}>
                <span style={{ fontSize: 30 }}>{b.emoji}</span>
                <span className="text-xs font-bold text-center" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>{b.label}</span>
                {b.earned && <span className="text-xs font-bold" style={{ color: C.teal }}>✓ Diperoleh</span>}
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="achievements" role="child" onNav={onNav} />
    </div>
  )
}

// ─── PARENT DASHBOARD ─────────────────────────────────────────────────────────
function ParentDashboard({ onNav, fromChild = false, onBackToChild, childName }: { onNav: (s: Screen) => void; fromChild?: boolean; onBackToChild?: () => void; childName: string }) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
      <div className="px-5 pt-5 pb-0 flex-shrink-0">
        {fromChild && (
          <button onClick={onBackToChild} className="flex items-center gap-2 mb-3 min-h-[40px] font-semibold text-sm" style={{ color: C.mutedText, fontFamily: 'Nunito, sans-serif' }}>← Kembali ke Sesi Anak</button>
        )}
        <div className="rounded-3xl px-5 py-4 relative overflow-hidden" style={{ backgroundColor: C.hero }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', backgroundColor: C.primary, opacity: 0.1 }} />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Selamat datang,</p>
              <p className="font-black text-lg text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>Bu Dewi Rahayu 🌟</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onNav('settings')} className="rounded-xl flex items-center justify-center min-w-[36px] min-h-[36px]" style={{ backgroundColor: 'rgba(255,255,255,0.12)', fontSize: 16 }}>⚙️</button>
              <Avatar emoji="👩" size={40} bg="rgba(255,255,255,0.12)" />
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-3 p-3 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="rounded-full flex items-center justify-center" style={{ width: 36, height: 36, backgroundColor: 'rgba(240,147,52,0.2)', fontSize: 18 }}>🧒</div>
            <div className="flex-1">
              <p className="font-bold text-white text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>{childName}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Level 7 · 47 Bintang · 🔥 5 hari</p>
            </div>
            <button className="px-3 py-1.5 rounded-xl font-bold text-xs" style={{ backgroundColor: C.primary, color: C.white, fontFamily: 'Nunito, sans-serif' }} onClick={() => onNav('analytics')}>Detail →</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
        <div>
          <SectionHeader title="📈 Perkembangan" onMore={() => onNav('analytics')} />
          <Card className="p-4">
            {[
              { label: 'Kognitif', val: 72, color: C.primary },
              { label: 'Motorik', val: 58, color: C.teal },
              { label: 'Sensorik', val: 85, color: C.purple },
              { label: 'Sosial', val: 45, color: C.success },
            ].map((a) => (
              <div key={a.label} className="flex items-center gap-3 mb-3 last:mb-0">
                <p className="text-sm font-semibold w-16 flex-shrink-0" style={{ color: C.deep }}>{a.label}</p>
                <div className="flex-1">
                  <ProgressBar value={a.val} color={a.color} thin />
                </div>
                <p className="text-sm font-black w-9 text-right flex-shrink-0" style={{ fontFamily: 'Nunito, sans-serif', color: a.color }}>{a.val}%</p>
              </div>
            ))}
          </Card>
        </div>

        <div>
          <SectionHeader title="📅 Aktivitas Minggu Ini" />
          <Card className="p-4">
            <div className="flex items-end justify-between gap-1.5" style={{ height: 72 }}>
              {[{ day: 'Sen', val: 40 }, { day: 'Sel', val: 65 }, { day: 'Rab', val: 45 }, { day: 'Kam', val: 80 }, { day: 'Jum', val: 60 }, { day: 'Sab', val: 90 }, { day: 'Min', val: 30 }].map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-xl" style={{ height: `${d.val}%`, backgroundColor: d.day === 'Sab' ? C.primary : C.muted }} />
                  <span style={{ fontSize: 9.5, color: C.mutedText, fontFamily: 'Nunito, sans-serif' }}>{d.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <SectionHeader title="🔔 Notifikasi" />
          <div className="flex flex-col gap-2.5">
            {[
              { emoji: '📊', text: 'Laporan mingguan tersedia', time: '2j lalu', dot: true },
              { emoji: '🏆', text: `${childName} naik ke Level 7!`, time: '1h lalu', dot: true },
              { emoji: '📅', text: 'Jadwal sesi Bu Sari: Besok 09.00', time: '3j lalu', dot: false },
            ].map((n, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }}>
                <IconBox emoji={n.emoji} bg={C.muted} size={42} />
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: C.deep }}>{n.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.mutedText }}>{n.time}</p>
                </div>
                {n.dot && <div className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, backgroundColor: C.primary }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="parent-dashboard" role="parent" onNav={onNav} />
    </div>
  )
}

// ─── GPK DASHBOARD ────────────────────────────────────────────────────────────
function GpkDashboard({ onNav }: { onNav: (s: Screen) => void }) {
  const children = [
    { name: 'Rafi A.', age: 8, level: 7, progress: 72, emoji: '🧒', parent: 'Bu Dewi' },
    { name: 'Sinta M.', age: 10, level: 5, progress: 55, emoji: '👧', parent: 'Pak Budi' },
    { name: 'Dimas K.', age: 6, level: 3, progress: 38, emoji: '🧒', parent: 'Bu Rina' },
  ]

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
      <div className="px-5 pt-5 pb-0 flex-shrink-0">
        <div className="rounded-3xl p-5 relative overflow-hidden" style={{ backgroundColor: C.hero }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', backgroundColor: C.purple, opacity: 0.12 }} />
          <div className="flex items-start justify-between mb-3 relative z-10">
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Halo, selamat datang,</p>
              <p className="font-black text-xl text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>Bu Sari Wulandari 👩‍🏫</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onNav('settings')} className="rounded-xl flex items-center justify-center min-w-[36px] min-h-[36px]" style={{ backgroundColor: 'rgba(255,255,255,0.12)', fontSize: 16 }}>⚙️</button>
              <Avatar emoji="👩‍🏫" size={44} bg="rgba(255,255,255,0.1)" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 relative z-10">
            {[{ val: '3', label: 'Anak Aktif' }, { val: '12', label: 'Sesi Bulan Ini' }, { val: '4.9★', label: 'Rating' }].map((s) => (
              <div key={s.label} className="text-center py-2.5 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
                <p className="font-black text-white text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>{s.val}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
        <div>
          <SectionHeader title="👦 Anak Didik" />
          <div className="flex flex-col gap-2.5">
            {children.map((c) => (
              <div key={c.name} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer active:scale-[0.98]" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }} onClick={() => onNav('analytics')}>
                <IconBox emoji={c.emoji} bg={C.hero} size={46} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>{c.name}</p>
                    <Badge color={C.purpleLight} text={C.purple}>Lv.{c.level}</Badge>
                  </div>
                  <p className="text-xs mb-1.5" style={{ color: C.mutedText }}>Usia {c.age} th · {c.parent}</p>
                  <ProgressBar value={c.progress} color={C.purple} thin />
                </div>
                <span style={{ color: C.mutedText, fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader title="📅 Jadwal Hari Ini" />
          <div className="flex flex-col gap-2.5">
            {[
              { time: '09.00', name: 'Rafi A.', type: 'Online Meeting', done: true },
              { time: '11.00', name: 'Sinta M.', type: 'Home Visit', done: false },
              { time: '14.00', name: 'Dimas K.', type: 'Online Meeting', done: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }}>
                <div className="rounded-2xl flex items-center justify-center font-black text-xs flex-shrink-0" style={{ width: 48, height: 48, backgroundColor: s.done ? C.hero : C.muted, color: s.done ? C.white : C.deep, fontFamily: 'Nunito, sans-serif' }}>{s.time}</div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>{s.name}</p>
                  <p className="text-xs" style={{ color: C.mutedText }}>{s.type}</p>
                </div>
                <Badge color={s.done ? C.infoLight : C.primaryLight} text={s.done ? C.success : C.primaryDark}>{s.done ? 'Selesai' : 'Akan Datang'}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="gpk-dashboard" role="gpk" onNav={onNav} />
    </div>
  )
}

// ─── GENDER SELECT ────────────────────────────────────────────────────────────
function GenderSelectScreen({ onSelect, onBack }: { onSelect: (g: Gender) => void; onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8 text-center" style={{ backgroundColor: C.hero }}>
      <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: '50%', backgroundColor: C.teal, opacity: 0.06 }} />
      <div style={{ position: 'absolute', bottom: 80, right: -40, width: 160, height: 160, borderRadius: '50%', backgroundColor: '#e91e8c', opacity: 0.06 }} />
      <div>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🎮</div>
        <h2 className="font-black text-2xl text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>Pilih Karakter</h2>
        <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Game berbeda untuk petualangan yang berbeda!</p>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <button className="flex flex-col items-center gap-3 p-6 rounded-3xl active:scale-95" style={{ background: 'linear-gradient(135deg, #1a91b0, #0d6f8a)', border: '2px solid rgba(26,145,176,0.4)' }} onClick={() => onSelect('boy')}>
          <span style={{ fontSize: 54, lineHeight: 1 }}>⚔️</span>
          <div>
            <p className="font-black text-white text-base" style={{ fontFamily: 'Nunito, sans-serif' }}>Laki-laki</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Ksatria vs Monster</p>
          </div>
        </button>
        <button className="flex flex-col items-center gap-3 p-6 rounded-3xl active:scale-95" style={{ background: 'linear-gradient(135deg, #e91e8c, #c2185b)', border: '2px solid rgba(233,30,140,0.4)' }} onClick={() => onSelect('girl')}>
          <span style={{ fontSize: 54, lineHeight: 1 }}>👗</span>
          <div>
            <p className="font-black text-white text-base" style={{ fontFamily: 'Nunito, sans-serif' }}>Perempuan</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Petualangan Barbie</p>
          </div>
        </button>
      </div>
      <button onClick={onBack} className="font-semibold min-h-[44px]" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Nunito, sans-serif' }}>← Kembali ke Peta</button>
    </div>
  )
}

// ─── SEARCH GAME (shared component) ──────────────────────────────────────────
function buildGrid(targets: string[]) {
  const distractors = ['🌸', '🌺', '🍀', '🌿', '🎀', '🎁', '🧸', '🔮', '💎', '🌟', '☀️', '🌙', '💫', '✨', '🦋', '🌈', '🪄', '🎭', '🎪', '🪬', '🧩', '🎑', '🏮', '🎋', '🍭', '🎠', '🪅', '🌻', '🌼', '🍄']
  const shuffled = [...distractors].sort(() => Math.random() - 0.5)
  const grid: { emoji: string; isTarget: boolean; targetIdx: number }[] = Array(16).fill(null).map(() => ({ emoji: '', isTarget: false, targetIdx: -1 }))
  const allIdx = Array.from({ length: 16 }, (_, i) => i)
  const targetPositions = [...allIdx].sort(() => Math.random() - 0.5).slice(0, targets.length)
  targetPositions.forEach((pos, i) => {
    grid[pos] = { emoji: targets[i], isTarget: true, targetIdx: i }
  })
  let di = 0
  grid.forEach((item, i) => {
    if (!item.isTarget) grid[i] = { emoji: shuffled[di++] || '❓', isTarget: false, targetIdx: -1 }
  })
  return grid
}

function SearchGame({ targets, labels, bgColor, onSuccess, onFail }: { targets: string[]; labels: string[]; bgColor: string; onSuccess: () => void; onFail: () => void }) {
  const [grid] = useState(() => buildGrid(targets))
  const [found, setFound] = useState(() => targets.map(() => false))
  const [timeLeft, setTimeLeft] = useState(30)
  const doneRef = useRef(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer)
          if (!doneRef.current) { doneRef.current = true; setTimeout(onFail, 100) }
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  function handleTap(item: typeof grid[0]) {
    if (!item.isTarget || found[item.targetIdx] || doneRef.current) return
    const newFound = found.map((f, i) => i === item.targetIdx ? true : f)
    setFound(newFound)
    if (newFound.every(Boolean) && !doneRef.current) {
      doneRef.current = true
      setTimeout(onSuccess, 500)
    }
  }

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: bgColor }}>
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <p className="font-black text-white text-base" style={{ fontFamily: 'Nunito, sans-serif' }}>🔍 Temukan barang!</p>
          <div className="rounded-xl px-3 py-1" style={{ backgroundColor: timeLeft <= 10 ? '#e05252' : 'rgba(255,255,255,0.2)' }}>
            <p className="font-black text-white text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>{timeLeft}s</p>
          </div>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.15)' }}>
          <div className="h-full rounded-full" style={{ width: `${(timeLeft / 30) * 100}%`, backgroundColor: timeLeft <= 10 ? '#e05252' : '#4ade80', transition: 'width 1s linear' }} />
        </div>
      </div>
      <div className="flex-1 px-3 pb-2">
        <div className="grid grid-cols-4 gap-2 h-full">
          {grid.map((item, i) => (
            <button key={i} className="rounded-2xl flex items-center justify-center active:scale-90" style={{ fontSize: 28, backgroundColor: (found[item.targetIdx] && item.isTarget) ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)', border: `2px solid ${(found[item.targetIdx] && item.isTarget) ? '#4ade80' : 'rgba(255,255,255,0.1)'}`, minHeight: 64 }} onClick={() => handleTap(item)}>
              {(found[item.targetIdx] && item.isTarget) ? '✅' : item.emoji}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 pb-4 flex-shrink-0">
        <p className="text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif' }}>CARI INI:</p>
        <div className="flex gap-2">
          {targets.map((t, i) => (
            <div key={i} className="flex-1 flex items-center gap-1.5 px-2 py-2 rounded-2xl" style={{ backgroundColor: found[i] ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.1)', border: `1.5px solid ${found[i] ? '#4ade80' : 'rgba(255,255,255,0.15)'}` }}>
              <span style={{ fontSize: 18 }}>{t}</span>
              <p className="text-xs font-bold" style={{ color: found[i] ? '#4ade80' : 'white', fontFamily: 'Nunito, sans-serif', textDecoration: found[i] ? 'line-through' : 'none', fontSize: 10 }}>{labels[i]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── OBSTACLE GAME (shared) ───────────────────────────────────────────────────
type ObstacleState = {
  playerX: number; obstacles: { id: number; x: number; y: number }[]
  lives: number; timeLeft: number; nextId: number; running: boolean
  phase: 'playing' | 'won' | 'lost'
}

function ObstacleGame({ vehicleEmoji, obstacleEmoji, bgStyle, onSuccess, onFail }: { vehicleEmoji: string; obstacleEmoji: string; bgStyle: React.CSSProperties; onSuccess: () => void; onFail: () => void }) {
  const GAME_W = 300
  const GAME_H = 360
  const WIN_TIME = 15
  const g = useRef<ObstacleState>({ playerX: GAME_W / 2, obstacles: [], lives: 3, timeLeft: WIN_TIME, nextId: 0, running: true, phase: 'playing' })
  const [snap, setSnap] = useState({ ...g.current, obstacles: [] as ObstacleState['obstacles'] })
  const doneRef = useRef(false)

  function sync() {
    const s = g.current
    setSnap({ playerX: s.playerX, obstacles: [...s.obstacles], lives: s.lives, timeLeft: s.timeLeft, nextId: s.nextId, running: s.running, phase: s.phase })
  }

  useEffect(() => {
    const spawnTimer = setInterval(() => {
      if (!g.current.running) return
      g.current.obstacles.push({ id: g.current.nextId++, x: Math.random() * (GAME_W - 48) + 24, y: -30 })
    }, 900)
    const countdown = setInterval(() => {
      if (!g.current.running) return
      g.current.timeLeft = Math.max(0, g.current.timeLeft - 1)
      if (g.current.timeLeft <= 0) { g.current.running = false; g.current.phase = 'won' }
      sync()
    }, 1000)
    const loop = setInterval(() => {
      const s = g.current
      if (!s.running) return
      s.obstacles = s.obstacles.map((o) => ({ ...o, y: o.y + 5 }))
      const hitIds = new Set<number>()
      for (const o of s.obstacles) {
        if (o.y > GAME_H - 90 && o.y < GAME_H - 30 && Math.abs(o.x - s.playerX) < 28) {
          hitIds.add(o.id)
          s.lives = Math.max(0, s.lives - 1)
        }
      }
      s.obstacles = s.obstacles.filter((o) => !hitIds.has(o.id) && o.y < GAME_H)
      if (s.lives <= 0) { s.running = false; s.phase = 'lost' }
      sync()
    }, 50)
    return () => { clearInterval(spawnTimer); clearInterval(countdown); clearInterval(loop) }
  }, [])

  useEffect(() => {
    if (snap.phase === 'won' && !doneRef.current) { doneRef.current = true; setTimeout(onSuccess, 800) }
    if (snap.phase === 'lost' && !doneRef.current) { doneRef.current = true; setTimeout(onFail, 800) }
  }, [snap.phase])

  function moveLeft() { g.current.playerX = Math.max(28, g.current.playerX - 52); sync() }
  function moveRight() { g.current.playerX = Math.min(GAME_W - 28, g.current.playerX + 52); sync() }

  if (snap.phase === 'won') {
    return <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center" style={bgStyle}><div style={{ fontSize: 72 }}>🎉</div><p className="font-black text-white text-2xl" style={{ fontFamily: 'Nunito, sans-serif' }}>Berhasil! Melanjutkan...</p></div>
  }
  if (snap.phase === 'lost') {
    return <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center" style={bgStyle}><div style={{ fontSize: 72 }}>💥</div><p className="font-black text-white text-2xl" style={{ fontFamily: 'Nunito, sans-serif' }}>Coba Lagi!</p></div>
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0" style={{ ...bgStyle, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex gap-1">{[1, 2, 3].map((h) => <span key={h} style={{ fontSize: 18, opacity: h <= snap.lives ? 1 : 0.2 }}>❤️</span>)}</div>
        <div className="rounded-xl px-3 py-1" style={{ backgroundColor: snap.timeLeft <= 5 ? '#e05252' : 'rgba(255,255,255,0.15)' }}>
          <p className="font-black text-white text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>{snap.timeLeft}s</p>
        </div>
        <p className="font-black text-white text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>Hindari!</p>
      </div>
      <div className="relative overflow-hidden flex-1 w-full mx-auto" style={{ maxWidth: GAME_W, ...bgStyle }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: '49%', top: `${i * 18}%`, width: 3, height: '12%', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 2 }} />
        ))}
        {snap.obstacles.map((o) => (
          <div key={o.id} style={{ position: 'absolute', left: o.x - 20, top: o.y - 20, fontSize: 36, lineHeight: 1 }}>{obstacleEmoji}</div>
        ))}
        <div style={{ position: 'absolute', left: snap.playerX - 24, bottom: 20, fontSize: 46, lineHeight: 1, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}>{vehicleEmoji}</div>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onPointerDown={moveLeft} className="flex items-center justify-center rounded-2xl text-white flex-1" style={{ height: 60, backgroundColor: 'rgba(255,255,255,0.1)', fontSize: 28 }}>◀</button>
        <button onPointerDown={moveRight} className="flex items-center justify-center rounded-2xl text-white flex-1" style={{ height: 60, backgroundColor: 'rgba(255,255,255,0.1)', fontSize: 28 }}>▶</button>
      </div>
    </div>
  )
}

// ─── BOY KNIGHT GAME ──────────────────────────────────────────────────────────
function BoyKnightGame({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'dialogue' | 'search' | 'equip' | 'obstacle' | 'ending' | 'fail'>('dialogue')
  const [armor, setArmor] = useState(0)
  const [sword, setSword] = useState(0)

  const armors = [
    { label: 'Biru', accent: '#2196f3', bgAccent: 'rgba(33,150,243,0.25)' },
    { label: 'Merah', accent: '#f44336', bgAccent: 'rgba(244,67,54,0.25)' },
    { label: 'Emas', accent: '#ffd700', bgAccent: 'rgba(255,215,0,0.25)' },
  ]
  const swords = [
    { emoji: '🗡️', label: 'Belati Pendek' },
    { emoji: '⚔️', label: 'Pedang Panjang' },
    { emoji: '🔱', label: 'Tombak Runcing' },
  ]

  const darkBg = { background: 'linear-gradient(160deg, #1a1a2e 0%, #0a0e1a 100%)' }

  if (phase === 'fail') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-8" style={darkBg}>
        <div style={{ fontSize: 72 }}>😔</div>
        <h2 className="font-black text-2xl text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>Kamu gagal...</h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>Coba lagi dan bantu Raja Questoria!</p>
        <button className="w-full py-4 rounded-2xl font-black text-white min-h-[56px] active:scale-95" style={{ background: 'linear-gradient(135deg, #1a91b0, #0d5f7a)', fontFamily: 'Nunito, sans-serif' }} onClick={() => setPhase('dialogue')}>Coba Lagi ⚔️</button>
        <button className="font-semibold min-h-[44px]" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Nunito, sans-serif' }} onClick={onDone}>Kembali ke Peta</button>
      </div>
    )
  }

  if (phase === 'dialogue') {
    return (
      <div className="flex-1 flex flex-col" style={darkBg}>
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-2 gap-3">
          <div className="text-center">
            <div style={{ fontSize: 72, lineHeight: 1, marginBottom: 6 }}>🏰</div>
            <div style={{ fontSize: 36 }}>👑</div>
          </div>
          <div className="rounded-3xl p-4 w-full" style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: 22 }}>👑</span>
              <p className="font-black text-white text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>Raja Questoria</p>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 1.65, fontFamily: 'Inter, sans-serif' }}>
              "Kesatria! Kerajaan kita sedang diserang monster jahat! Kamu adalah harapan terakhir kami. Maukah kamu membantu melindungi kerajaan ini?"
            </p>
          </div>
        </div>
        <div className="px-4 pb-5 pt-2 flex flex-col gap-2.5 flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: '24px 24px 0 0' }}>
          <p className="text-xs font-bold text-center pt-2 pb-1" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Nunito, sans-serif', letterSpacing: 1 }}>PILIH JAWABANMU:</p>
          {[
            { text: '⚔️ Siap Paduka! Aku akan membantumu!', good: true },
            { text: '😴 Maaf, aku sedang sibuk sekarang.', good: false },
            { text: '🚶 Mungkin lain kali, Paduka.', good: false },
          ].map((c, i) => (
            <button key={i} className="w-full text-left px-4 py-3.5 rounded-2xl font-bold text-sm active:scale-95 min-h-[52px]" style={{ backgroundColor: i === 0 ? C.teal : 'rgba(255,255,255,0.07)', color: 'white', border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)', fontFamily: 'Nunito, sans-serif' }} onClick={() => c.good ? setPhase('search') : setPhase('fail')}>
              {c.text}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'search') {
    return <SearchGame targets={['⚔️', '🛡️', '⛑️']} labels={['Pedang', 'Perisai', 'Helm']} bgColor="#1a1a2e" onSuccess={() => setPhase('equip')} onFail={() => setPhase('fail')} />
  }

  if (phase === 'equip') {
    return (
      <div className="flex-1 flex flex-col" style={darkBg}>
        <div className="flex-shrink-0 px-4 pt-4 pb-3 text-center">
          <p className="font-black text-xl text-white mb-0.5" style={{ fontFamily: 'Nunito, sans-serif' }}>⚔️ Lengkapi Kesatriamu!</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Pilih armor dan senjata andalanmu</p>
          <div className="mx-auto mt-3 rounded-full flex items-center justify-center" style={{ width: 76, height: 76, backgroundColor: armors[armor].bgAccent, border: `3px solid ${armors[armor].accent}`, fontSize: 40 }}>🤺</div>
          <p className="font-black text-sm mt-2" style={{ fontFamily: 'Nunito, sans-serif', color: armors[armor].accent }}>{armors[armor].label} · {swords[sword].emoji} {swords[sword].label}</p>
        </div>
        <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-4 pb-2">
          <div>
            <p className="text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', letterSpacing: 1 }}>WARNA ARMOR:</p>
            <div className="flex gap-2">
              {armors.map((a, i) => (
                <button key={i} className="flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 active:scale-95" style={{ backgroundColor: armor === i ? a.bgAccent : 'rgba(255,255,255,0.06)', border: `2px solid ${armor === i ? a.accent : 'rgba(255,255,255,0.1)'}` }} onClick={() => setArmor(i)}>
                  <span style={{ fontSize: 22 }}>🛡️</span>
                  <span className="text-xs font-bold" style={{ color: armor === i ? a.accent : 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', letterSpacing: 1 }}>JENIS PEDANG:</p>
            <div className="flex gap-2">
              {swords.map((s, i) => (
                <button key={i} className="flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 active:scale-95" style={{ backgroundColor: sword === i ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)', border: `2px solid ${sword === i ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)'}` }} onClick={() => setSword(i)}>
                  <span style={{ fontSize: 26 }}>{s.emoji}</span>
                  <span className="text-xs font-bold text-center" style={{ color: sword === i ? 'white' : 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', fontSize: 10 }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 pb-5 flex-shrink-0">
          <button className="w-full py-4 rounded-2xl font-black text-white text-lg min-h-[56px] active:scale-95" style={{ background: `linear-gradient(135deg, ${armors[armor].accent}, #1a2535)`, fontFamily: 'Nunito, sans-serif', boxShadow: `0 6px 24px ${armors[armor].accent}50` }} onClick={() => setPhase('obstacle')}>
            Pergi ke Medan Perang! ⚔️
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'obstacle') {
    return <ObstacleGame vehicleEmoji="🐴" obstacleEmoji="👹" bgStyle={darkBg} onSuccess={() => setPhase('ending')} onFail={() => setPhase('fail')} />
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-5 text-center" style={darkBg}>
      <div style={{ fontSize: 80 }}>🏆</div>
      <div className="flex gap-3">{[1, 2, 3].map((s) => <span key={s} style={{ fontSize: 44, color: C.star }}>★</span>)}</div>
      <div className="rounded-3xl p-4 w-full" style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="flex items-center gap-2 justify-center mb-2">
          <span style={{ fontSize: 26 }}>👑</span>
          <p className="font-black text-white text-base" style={{ fontFamily: 'Nunito, sans-serif' }}>Raja Questoria</p>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.65, fontFamily: 'Inter, sans-serif' }}>
          "Terima kasih, Kesatria pemberani! Berkat keberanianmu, kerajaan telah selamat. Sampai bertemu di petualangan selanjutnya!"
        </p>
      </div>
      <button className="w-full py-4 rounded-2xl font-black text-xl text-white min-h-[56px] active:scale-95" style={{ background: 'linear-gradient(135deg, #1a91b0, #0d5f7a)', fontFamily: 'Nunito, sans-serif' }} onClick={onDone}>
        Kembali ke Peta 🗺️
      </button>
    </div>
  )
}

// ─── GIRL ADVENTURE GAME ──────────────────────────────────────────────────────
type DressCategory = 'dress' | 'hair' | 'shoes' | 'bag'

const dressOptions: Record<DressCategory, { emoji: string; label: string; accent: string }[]> = {
  dress: [
    { emoji: '👗', label: 'Gaun Merah', accent: '#f44336' },
    { emoji: '🩳', label: 'Casual', accent: '#9c27b0' },
    { emoji: '👘', label: 'Kimono', accent: '#ff9800' },
    { emoji: '🥻', label: 'Sari India', accent: '#e91e8c' },
    { emoji: '👙', label: 'Summer', accent: '#03a9f4' },
    { emoji: '🩱', label: 'Modern', accent: '#673ab7' },
  ],
  hair: [
    { emoji: '👱‍♀️', label: 'Pirang', accent: '#ffc107' },
    { emoji: '👩', label: 'Hitam', accent: '#5d4037' },
    { emoji: '👩‍🦰', label: 'Merah', accent: '#f44336' },
    { emoji: '👩‍🦳', label: 'Putih', accent: '#9e9e9e' },
    { emoji: '👩‍🦱', label: 'Keriting', accent: '#8d6e63' },
    { emoji: '🧖‍♀️', label: 'Hijab', accent: '#e91e8c' },
  ],
  shoes: [
    { emoji: '👠', label: 'High Heels', accent: '#e91e8c' },
    { emoji: '👟', label: 'Sneakers', accent: '#2196f3' },
    { emoji: '🥿', label: 'Flat Shoes', accent: '#ff9800' },
    { emoji: '👡', label: 'Sandal', accent: '#9c27b0' },
    { emoji: '🥾', label: 'Boots', accent: '#795548' },
    { emoji: '👢', label: 'Long Boots', accent: '#f44336' },
  ],
  bag: [
    { emoji: '👜', label: 'Handbag', accent: '#e91e8c' },
    { emoji: '🎒', label: 'Ransel', accent: '#3f51b5' },
    { emoji: '💼', label: 'Tas Kerja', accent: '#607d8b' },
    { emoji: '👛', label: 'Dompet', accent: '#ff9800' },
    { emoji: '🛍️', label: 'Shopping', accent: '#f44336' },
    { emoji: '💍', label: 'Perhiasan', accent: '#ffd700' },
  ],
}

const catMeta: { key: DressCategory; emoji: string; label: string }[] = [
  { key: 'dress', emoji: '👗', label: 'Pakaian' },
  { key: 'hair', emoji: '💇', label: 'Rambut' },
  { key: 'shoes', emoji: '👠', label: 'Sepatu' },
  { key: 'bag', emoji: '👜', label: 'Tas' },
]

function GirlAdventureGame({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'dialogue' | 'search' | 'dressup' | 'obstacle' | 'ending' | 'fail'>('dialogue')
  const [category, setCategory] = useState<DressCategory>('dress')
  const [sel, setSel] = useState<Record<DressCategory, number>>({ dress: 0, hair: 0, shoes: 0, bag: 0 })

  const pinkBg = { background: 'linear-gradient(160deg, #c2185b 0%, #880e4f 100%)' }
  const ch = { dress: dressOptions.dress[sel.dress].emoji, hair: dressOptions.hair[sel.hair].emoji, shoes: dressOptions.shoes[sel.shoes].emoji, bag: dressOptions.bag[sel.bag].emoji }

  if (phase === 'fail') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-8" style={pinkBg}>
        <div style={{ fontSize: 72 }}>😢</div>
        <h2 className="font-black text-2xl text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>Kamu gagal...</h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>Coba lagi dan bantu Barbie!</p>
        <button className="w-full py-4 rounded-2xl font-black text-white min-h-[56px] active:scale-95" style={{ background: 'linear-gradient(135deg, #e91e8c, #c2185b)', fontFamily: 'Nunito, sans-serif' }} onClick={() => setPhase('dialogue')}>Coba Lagi 👗</button>
        <button className="font-semibold min-h-[44px]" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Nunito, sans-serif' }} onClick={onDone}>Kembali ke Peta</button>
      </div>
    )
  }

  if (phase === 'dialogue') {
    return (
      <div className="flex-1 flex flex-col" style={pinkBg}>
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-2 gap-3">
          <div className="text-center">
            <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 6 }}>👸</div>
            <div style={{ fontSize: 32 }}>✨</div>
          </div>
          <div className="rounded-3xl p-4 w-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: 22 }}>👸</span>
              <p className="font-black text-white text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>Barbie</p>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 1.65, fontFamily: 'Inter, sans-serif' }}>
              "Hai! Hari ini aku diundang ke acara penghargaan yang sangat spesial. Apakah kamu mau bantu aku mencari baju yang cocok dipakai?"
            </p>
          </div>
        </div>
        <div className="px-4 pb-5 pt-2 flex flex-col gap-2.5 flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: '24px 24px 0 0' }}>
          <p className="text-xs font-bold text-center pt-2 pb-1" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', letterSpacing: 1 }}>PILIH JAWABANMU:</p>
          {[
            { text: '✨ Boleh Barbie! Aku siap membantu!', good: true },
            { text: '🙅 Mungkin lain kali, Barbie!', good: false },
            { text: '😤 Tidak mau, aku sibuk.', good: false },
          ].map((c, i) => (
            <button key={i} className="w-full text-left px-4 py-3.5 rounded-2xl font-bold text-sm active:scale-95 min-h-[52px]" style={{ backgroundColor: i === 0 ? C.pink : 'rgba(255,255,255,0.1)', color: 'white', border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.15)', fontFamily: 'Nunito, sans-serif' }} onClick={() => c.good ? setPhase('search') : setPhase('fail')}>
              {c.text}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'search') {
    return <SearchGame targets={['👗', '👠', '📿']} labels={['Baju', 'Sepatu', 'Kalung']} bgColor="#c2185b" onSuccess={() => setPhase('dressup')} onFail={() => setPhase('fail')} />
  }

  if (phase === 'dressup') {
    return (
      <div className="flex-1 flex flex-col" style={{ background: 'linear-gradient(180deg, #fce4ec 0%, #fdf6ea 50%)' }}>
        <div className="flex-shrink-0 flex flex-col items-center py-3 gap-1.5">
          <p className="font-black text-base" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>✨ Dress Up Barbie</p>
          <div className="relative">
            <div className="rounded-full flex items-center justify-center" style={{ width: 96, height: 96, background: 'linear-gradient(135deg, #fff 0%, #fce4ec 100%)', border: '3px solid white', boxShadow: '0 8px 24px rgba(233,30,140,0.2)' }}>
              <span style={{ fontSize: 56, lineHeight: 1 }}>{ch.dress}</span>
            </div>
            <div className="absolute rounded-full flex items-center justify-center" style={{ top: -2, right: -4, width: 30, height: 30, backgroundColor: 'white', fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>{ch.hair}</div>
            <div className="absolute rounded-full flex items-center justify-center" style={{ bottom: -2, right: -4, width: 26, height: 26, backgroundColor: 'white', fontSize: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>{ch.shoes}</div>
            <div className="absolute rounded-full flex items-center justify-center" style={{ bottom: -2, left: -4, width: 26, height: 26, backgroundColor: 'white', fontSize: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>{ch.bag}</div>
          </div>
        </div>
        <div className="px-3 flex gap-2 mb-2 flex-shrink-0">
          {catMeta.map((c) => (
            <button key={c.key} className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-2xl text-xs font-bold active:scale-95" style={{ backgroundColor: category === c.key ? C.pink : C.card, color: category === c.key ? C.white : C.mutedText, fontFamily: 'Nunito, sans-serif', border: `1.5px solid ${category === c.key ? C.pink : C.border}` }} onClick={() => setCategory(c.key)}>
              <span style={{ fontSize: 16 }}>{c.emoji}</span>{c.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-2">
          <div className="grid grid-cols-3 gap-2">
            {dressOptions[category].map((opt, i) => {
              const isSelected = sel[category] === i
              return (
                <button key={i} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl active:scale-95" style={{ backgroundColor: isSelected ? opt.accent + '1a' : C.card, border: `2px solid ${isSelected ? opt.accent : C.border}` }} onClick={() => setSel((s) => ({ ...s, [category]: i }))}>
                  <span style={{ fontSize: 28 }}>{opt.emoji}</span>
                  <span className="text-xs font-bold" style={{ fontFamily: 'Nunito, sans-serif', color: isSelected ? opt.accent : C.mutedText }}>{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="px-4 pb-4 pt-2 flex-shrink-0">
          <button className="w-full py-3.5 rounded-2xl font-black text-lg text-white active:scale-95 min-h-[52px]" style={{ background: 'linear-gradient(135deg, #e91e8c, #c2185b)', fontFamily: 'Nunito, sans-serif' }} onClick={() => setPhase('obstacle')}>
            Pergi ke Fashion Show! 💃
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'obstacle') {
    return <ObstacleGame vehicleEmoji="🚗" obstacleEmoji="🍌" bgStyle={{ background: 'linear-gradient(180deg, #fce4ec 0%, #f48fb1 100%)' }} onSuccess={() => setPhase('ending')} onFail={() => setPhase('fail')} />
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-5 text-center" style={{ background: 'linear-gradient(160deg, #fce4ec 0%, #e8eaf6 100%)' }}>
      <div style={{ fontSize: 80 }}>🏆</div>
      <div className="flex gap-3">{[1, 2, 3].map((s) => <span key={s} style={{ fontSize: 44, color: C.star }}>★</span>)}</div>
      <div className="flex gap-3 text-3xl">{ch.dress}{ch.hair}{ch.shoes}{ch.bag}</div>
      <div className="rounded-3xl p-4 w-full" style={{ backgroundColor: 'rgba(194,24,91,0.08)', border: '1px solid rgba(233,30,140,0.2)' }}>
        <div className="flex items-center gap-2 justify-center mb-2">
          <span style={{ fontSize: 26 }}>👸</span>
          <p className="font-black text-lg" style={{ fontFamily: 'Nunito, sans-serif', color: '#c2185b' }}>Barbie</p>
        </div>
        <p style={{ color: C.deep, fontSize: 14, lineHeight: 1.65, fontFamily: 'Inter, sans-serif' }}>
          "Terima kasih sudah membantuku! Kamu luar biasa! Sampai bertemu di level selanjutnya ya! 🌟"
        </p>
      </div>
      <button className="w-full py-4 rounded-2xl font-black text-xl text-white min-h-[56px] active:scale-95" style={{ background: 'linear-gradient(135deg, #e91e8c, #c2185b)', fontFamily: 'Nunito, sans-serif' }} onClick={onDone}>
        Kembali ke Peta 🗺️
      </button>
    </div>
  )
}

// ─── GAME SCREEN (wrapper) ────────────────────────────────────────────────────
function GameScreen({ onNav, gender, onSetGender }: { onNav: (s: Screen) => void; gender: Gender; onSetGender: (g: Gender) => void }) {
  const [localGender, setLocalGender] = useState<Gender>(gender)

  function handleSelect(g: Gender) {
    onSetGender(g)
    setLocalGender(g)
  }

  const headerBg = localGender === 'boy' ? '#111c28' : localGender === 'girl' ? '#c2185b' : C.hero

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3" style={{ backgroundColor: headerBg }}>
        <button onClick={() => onNav('child-dashboard')} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>←</button>
        <h2 className="font-black text-base text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {!localGender ? '🎮 Pilih Karakter' : localGender === 'boy' ? '⚔️ Ksatria Questoria' : '👗 Petualangan Barbie'}
        </h2>
        {localGender ? (
          <button onClick={() => { onSetGender(null); setLocalGender(null) }} className="min-w-[48px] min-h-[40px] px-3 rounded-xl font-bold text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif' }}>Ganti</button>
        ) : (
          <div style={{ width: 48 }} />
        )}
      </div>
      {!localGender
        ? <GenderSelectScreen onSelect={handleSelect} onBack={() => onNav('child-dashboard')} />
        : localGender === 'boy'
        ? <BoyKnightGame onDone={() => onNav('child-dashboard')} />
        : <GirlAdventureGame onDone={() => onNav('child-dashboard')} />
      }
    </div>
  )
}

// ─── CHILD SHOP ───────────────────────────────────────────────────────────────
function ChildShopScreen({ onNav, gender }: { onNav: (s: Screen) => void; gender: Gender }) {
  const [balance] = useState(47)
  const [owned, setOwned] = useState<Set<number>>(new Set([0]))

  const girlItems = [
    { emoji: '👗', name: 'Gaun Merah Muda', desc: 'Cocok untuk fashion show', price: 20, rarity: 'Langka', rarityColor: C.purple },
    { emoji: '📿', name: 'Kalung Berlian', desc: 'Aksesori mewah pilihan', price: 15, rarity: 'Umum', rarityColor: C.teal },
    { emoji: '👠', name: 'Sepatu Kaca', desc: 'Seperti milik Cinderella!', price: 25, rarity: 'Epik', rarityColor: C.pink },
    { emoji: '🎀', name: 'Pita Emas', desc: 'Sentuhan manis di rambut', price: 8, rarity: 'Umum', rarityColor: C.teal },
    { emoji: '💍', name: 'Cincin Rubi', desc: 'Permata merah memukau', price: 22, rarity: 'Langka', rarityColor: C.purple },
    { emoji: '👒', name: 'Topi Berbunga', desc: 'Cantik untuk acara tea party', price: 12, rarity: 'Umum', rarityColor: C.teal },
  ]
  const boyItems = [
    { emoji: '⚔️', name: 'Pedang Legendaris', desc: 'Senjata terkuat di kerajaan', price: 30, rarity: 'Legenda', rarityColor: C.star },
    { emoji: '🛡️', name: 'Perisai Naga', desc: 'Tahan semua serangan monster', price: 25, rarity: 'Epik', rarityColor: C.pink },
    { emoji: '⛑️', name: 'Helm Elang', desc: 'Melindungi kepala ksatria', price: 20, rarity: 'Langka', rarityColor: C.purple },
    { emoji: '🗡️', name: 'Belati Kilat', desc: 'Cepat dan akurat', price: 15, rarity: 'Umum', rarityColor: C.teal },
    { emoji: '🔱', name: 'Tombak Petir', desc: 'Menyerang dari jarak jauh', price: 28, rarity: 'Epik', rarityColor: C.pink },
    { emoji: '🏹', name: 'Busur Pelangi', desc: 'Panah berwarna warni keren!', price: 18, rarity: 'Langka', rarityColor: C.purple },
  ]

  const items = gender === 'girl' ? girlItems : boyItems
  const themeColor = gender === 'girl' ? C.pink : C.teal
  const themeHero = gender === 'girl' ? '#c2185b' : C.hero

  function buyItem(i: number) {
    if (owned.has(i) || items[i].price > balance) return
    setOwned((prev) => new Set([...prev, i]))
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
      <div className="px-5 pt-5 pb-0 flex-shrink-0">
        <div className="rounded-3xl p-4 relative overflow-hidden" style={{ backgroundColor: themeHero }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 110, height: 110, borderRadius: '50%', backgroundColor: themeColor, opacity: 0.15 }} />
          <div className="flex items-center gap-3 relative z-10 mb-3">
            <div className="rounded-2xl flex items-center justify-center" style={{ width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.12)', fontSize: 24 }}>
              {gender === 'girl' ? '👗' : '⚔️'}
            </div>
            <div className="flex-1">
              <p className="font-black text-white text-base" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {gender === 'girl' ? '✨ Toko Fashion' : '⚔️ Toko Senjata'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                {gender === 'girl' ? 'Item dress-up eksklusif Barbie' : 'Perlengkapan ksatria terhebat'}
              </p>
            </div>
            <div className="rounded-2xl px-3 py-2 flex items-center gap-1.5" style={{ backgroundColor: 'rgba(245,200,66,0.2)', border: '1px solid rgba(245,200,66,0.3)' }}>
              <span style={{ fontSize: 16 }}>⭐</span>
              <p className="font-black text-white text-base" style={{ fontFamily: 'Nunito, sans-serif' }}>{balance}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 relative z-10">
            {[{ val: `${owned.size}`, label: 'Dimiliki' }, { val: `${items.length - owned.size}`, label: 'Tersedia' }, { val: `${balance}⭐`, label: 'Saldo' }].map((s) => (
              <div key={s.label} className="text-center py-2 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
                <p className="font-black text-white" style={{ fontFamily: 'Nunito, sans-serif', fontSize: 14 }}>{s.val}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!gender && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-4 text-center">
          <div style={{ fontSize: 52 }}>🛒</div>
          <p className="font-black text-xl" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Pilih karakter dulu!</p>
          <p className="text-sm" style={{ color: C.mutedText }}>Mainkan game untuk memilih karakter cowo atau cewe.</p>
          <button className="px-6 py-3.5 rounded-2xl font-black text-white" style={{ backgroundColor: C.teal, fontFamily: 'Nunito, sans-serif' }} onClick={() => onNav('game')}>Pilih Karakter →</button>
        </div>
      )}

      {gender && (
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            {items.map((item, i) => {
              const isOwned = owned.has(i)
              const canBuy = !isOwned && item.price <= balance
              return (
                <div key={i} className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.card, border: `1.5px solid ${isOwned ? themeColor : C.border}` }}>
                  <div className="flex items-center justify-center py-5" style={{ backgroundColor: isOwned ? themeColor + '18' : C.muted, fontSize: 48 }}>
                    {item.emoji}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-black text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>{item.name}</p>
                    </div>
                    <p className="text-xs mb-2" style={{ color: C.mutedText }}>{item.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: item.rarityColor + '20', color: item.rarityColor, fontFamily: 'Nunito, sans-serif' }}>{item.rarity}</span>
                      {isOwned ? (
                        <span className="text-xs font-black px-2.5 py-1 rounded-xl" style={{ backgroundColor: themeColor + '20', color: themeColor, fontFamily: 'Nunito, sans-serif' }}>✓ Dimiliki</span>
                      ) : (
                        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-black text-xs active:scale-95" style={{ backgroundColor: canBuy ? themeColor : C.muted, color: canBuy ? C.white : C.mutedText, fontFamily: 'Nunito, sans-serif' }} onClick={() => buyItem(i)} disabled={!canBuy}>
                          <span style={{ fontSize: 12 }}>⭐</span>{item.price}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <BottomNav active="child-shop" role="child" onNav={onNav} />
    </div>
  )
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function AnalyticsScreen({ onBack }: { onBack: () => void }) {
  const [period, setPeriod] = useState<'1m' | '3m'>('1m')
  const [disclaimerDismissed, setDisclaimerDismissed] = useState(false)
  const aspects = [
    { label: 'Kognitif', val: 72, prev: 58, color: C.primary, emoji: '🧠' },
    { label: 'Motorik', val: 58, prev: 50, color: C.teal, emoji: '🤸' },
    { label: 'Sensorik', val: 85, prev: 78, color: C.purple, emoji: '👁️' },
    { label: 'Sosial', val: 45, prev: 35, color: C.success, emoji: '🤝' },
  ]

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
      <div className="px-5 pt-5 pb-0 flex-shrink-0">
        <div className="rounded-3xl p-5 relative overflow-hidden" style={{ backgroundColor: C.hero }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', backgroundColor: C.primary, opacity: 0.09 }} />
          <div className="flex items-center gap-3 relative z-10">
            <button onClick={onBack} className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>←</button>
            <div className="flex-1">
              <p className="font-black text-white text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>AI Analytics</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Rafi Ardiansyah</p>
            </div>
            <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
              {(['1m', '3m'] as const).map((p) => (
                <button key={p} className="px-4 py-2 text-sm font-bold min-h-[40px]" style={{ backgroundColor: period === p ? C.primary : 'transparent', color: period === p ? C.white : 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif' }} onClick={() => setPeriod(p)}>
                  {p === '1m' ? '1 Bln' : '3 Bln'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
        {!disclaimerDismissed && (
          <div className="rounded-2xl p-4 flex gap-3" style={{ backgroundColor: '#fff8ec', border: `1.5px solid ${C.border}` }}>
            <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, backgroundColor: C.primaryLight, fontSize: 20 }}>🤖</div>
            <div className="flex-1">
              <p className="font-black text-sm mb-1" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Catatan Penting</p>
              <p className="text-xs leading-relaxed" style={{ color: C.mutedText }}>Hasil analisis AI berdasarkan aktivitas anak di dalam game — bukan sebagai diagnosis medis.</p>
              <button className="mt-2 px-3 py-1.5 rounded-xl text-xs font-black min-h-[36px]" style={{ backgroundColor: C.primary, color: C.white, fontFamily: 'Nunito, sans-serif' }} onClick={() => setDisclaimerDismissed(true)}>Saya Mengerti</button>
            </div>
          </div>
        )}
        <div>
          <SectionHeader title="📈 Perkembangan 4 Aspek" />
          <Card className="p-4">
            {aspects.map((a) => (
              <div key={a.label} className="flex items-center gap-3 mb-4 last:mb-0">
                <div className="rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ width: 36, height: 36, backgroundColor: a.color + '18' }}>{a.emoji}</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1.5">
                    <span className="font-semibold text-sm" style={{ color: C.deep }}>{a.label}</span>
                    <span className="font-black text-sm" style={{ color: a.color }}>{a.val}%</span>
                  </div>
                  <ProgressBar value={a.val} color={a.color} thin />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full ml-1" style={{ backgroundColor: C.infoLight, color: C.success }}>+{a.val - a.prev}</span>
              </div>
            ))}
          </Card>
        </div>
        <div>
          <SectionHeader title={`📊 Tren Kognitif (${period === '1m' ? '1 Bulan' : '3 Bulan'})`} />
          <Card className="p-4">
            <div className="flex items-end gap-1.5" style={{ height: 90 }}>
              {(period === '1m' ? [48, 52, 55, 58, 60, 62, 64, 66, 68, 70, 71, 72] : [35, 40, 44, 48, 50, 52, 55, 58, 60, 62, 65, 68, 70, 71, 72]).map((v, i, arr) => (
                <div key={i} className="flex-1 rounded-t-xl" style={{ height: `${(v / 80) * 100}%`, backgroundColor: i === arr.length - 1 ? C.primary : C.primaryLight }} />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs" style={{ color: C.mutedText }}>{period === '1m' ? 'Jul 1' : 'Apr 1'}</span>
              <span className="text-xs" style={{ color: C.mutedText }}>Hari ini</span>
            </div>
          </Card>
        </div>
        <div>
          <SectionHeader title="🤖 Rekomendasi AI" />
          <div className="flex flex-col gap-2.5">
            {[
              { emoji: '🎨', title: 'Terapi Seni', desc: 'Aktivitas melukis untuk memperkuat koordinasi motorik halus.' },
              { emoji: '🎵', title: 'Musik & Ritme', desc: 'Latihan mengenal irama membantu kemampuan sensorik.' },
              { emoji: '👥', title: 'Bermain Bersama', desc: 'Playdates terstruktur 2× seminggu untuk interaksi sosial.' },
            ].map((r, i) => (
              <div key={i} className="flex gap-3 px-4 py-3 rounded-2xl" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }}>
                <IconBox emoji={r.emoji} bg={C.primaryLight} size={44} />
                <div>
                  <p className="font-bold text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>{r.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.mutedText }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="w-full py-4 rounded-2xl font-black text-white text-base active:scale-95 min-h-[56px]" style={{ backgroundColor: C.hero, fontFamily: 'Nunito, sans-serif' }}>📄 Unduh Laporan Lengkap</button>
      </div>
    </div>
  )
}

// ─── GPK DATA (shared) ───────────────────────────────────────────────────────
const GPK_DATA = [
  {
    id: 0, name: 'Sari Wulandari, S.Pd', spec: 'Autisme & Gangguan Komunikasi',
    exp: '8 tahun', price: 'Rp 150.000/sesi', rating: 5, reviews: 128,
    emoji: '👩‍🏫', available: true, serviceType: 'both' as const,
    location: 'Jakarta Selatan', address: 'Jl. Kemang Raya No. 15, Jakarta Selatan',
    degree: 'S2 Pendidikan Luar Biasa — Universitas Jakarta',
    childrenHandled: 45,
    description: 'GPK berpengalaman yang berfokus pada pendampingan anak autisme usia 5–15 tahun. Menggunakan metode ABA, PECS, dan komunikasi visual untuk mengoptimalkan perkembangan anak.',
    portfolio: [
      { emoji: '📸', title: 'Terapi di SDLB Kemang', desc: 'Mendampingi 8 siswa autisme dalam program terapi bermain terstruktur selama 2 tahun di SDLB Kemang, Jakarta.' },
      { emoji: '🏫', title: 'Koordinator GPK SLB Harapan', desc: 'Memimpin tim 5 guru GPK di SLB Harapan Bangsa selama 3 tahun dengan hasil peningkatan kognitif rata-rata 40%.' },
      { emoji: '📖', title: 'Penelitian ABA Nasional', desc: 'Kolaborasi riset efektivitas terapi ABA untuk anak autisme usia 5–10 tahun bersama UNPAD.' },
    ],
  },
  {
    id: 1, name: 'Ahmad Fauzi, M.Psi', spec: 'Terapi Perilaku (ABA)',
    exp: '12 tahun', price: 'Rp 200.000/sesi', rating: 5, reviews: 94,
    emoji: '👨‍🏫', available: true, serviceType: 'online' as const,
    location: 'Bandung', address: 'Jl. Dago No. 88, Bandung',
    degree: 'S2 Psikologi Klinis — Universitas Padjajaran',
    childrenHandled: 68,
    description: 'Psikolog klinis anak dengan spesialisasi ABA (Applied Behavior Analysis). Menangani 68+ anak autisme dengan rekam jejak intervensi perilaku yang terukur.',
    portfolio: [
      { emoji: '📊', title: 'Program ABA Online 2021–kini', desc: 'Menjalankan sesi online interaktif dengan 15 keluarga di seluruh Indonesia, berbasis program ABA terstruktur.' },
      { emoji: '🎓', title: 'Trainer ABA Bersertifikat', desc: 'Melatih 30+ GPK pemula dalam workshop nasional teknik ABA yang diakui KEMENKES.' },
    ],
  },
  {
    id: 2, name: 'Dian Pratiwi, S.Pd', spec: 'Sensori Integrasi & Motorik',
    exp: '5 tahun', price: 'Rp 120.000/sesi', rating: 4, reviews: 67,
    emoji: '👩‍🏫', available: false, serviceType: 'home' as const,
    location: 'Depok', address: 'Jl. Margonda Raya No. 30, Depok',
    degree: 'S1 Pendidikan Luar Biasa — Universitas Negeri Jakarta',
    childrenHandled: 22,
    description: 'Spesialis sensori integrasi dan terapi motorik untuk anak dengan hipersensitivitas sensorik. Metode bermain dan gerakan terarah.',
    portfolio: [
      { emoji: '🤸', title: 'Klinik Terapi Sensorik Depok', desc: 'Menjalankan program terapi motorik halus dan kasar untuk 22 anak dalam 2 tahun terakhir.' },
    ],
  },
  {
    id: 3, name: 'Budi Santoso, M.Ed', spec: 'Komunikasi Augmentatif (AAC)',
    exp: '10 tahun', price: 'Rp 180.000/sesi', rating: 5, reviews: 112,
    emoji: '👨‍🏫', available: true, serviceType: 'both' as const,
    location: 'Jakarta Timur', address: 'Jl. Raya Bekasi KM 18, Jakarta Timur',
    degree: 'S2 Pendidikan Khusus — Universitas Negeri Jakarta',
    childrenHandled: 53,
    description: 'Ahli AAC (Augmentative & Alternative Communication) untuk anak non-verbal. Membantu anak mengekspresikan diri melalui PECS, tablet AAC, dan sign language.',
    portfolio: [
      { emoji: '💬', title: 'Program AAC Nasional', desc: 'Pengembang kurikulum AAC yang digunakan di 15 SLB se-Indonesia.' },
      { emoji: '📱', title: 'Aplikasi PECS Digital', desc: 'Ko-developer aplikasi PECS berbahasa Indonesia yang telah diunduh 5.000+ keluarga.' },
    ],
  },
]

// ─── GPK SERVICES ─────────────────────────────────────────────────────────────
// ─── INDONESIA & JAVA DETAILED MAP ───────────────────────────────────────────
const GPK_MAP_DOTS = [
  { cx: 90, cy: 95, name: 'Sari W.', color: C.teal, active: true },
  { cx: 125, cy: 90, name: 'Ahmad F.', color: C.purple, active: true },
  { cx: 155, cy: 96, name: 'Dian P.', color: C.teal, active: false },
  { cx: 185, cy: 100, name: 'Budi S.', color: C.purple, active: true },
  { cx: 215, cy: 102, name: 'Rina K.', color: C.teal, active: false },
]

function IndonesiaMapCard({ onAddLocation }: { onAddLocation: () => void }) {
  const [tooltip, setTooltip] = useState<string | null>(null)
  // ViewBox bounds tailored precisely to the map elements (X: 10 to 375, Y: 15 to 215) with safety margin
  const VW = 385, VH = 210
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <div className="flex-1 min-w-0 pr-2">
          <p className="font-black text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>📍 GPK Terdekat dari Lokasi Anda</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: C.mutedText }}>Lokasi anak: Jl. Melati 12, Kemayoran, Jakarta</p>
        </div>
        <button onClick={onAddLocation} className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black min-h-[32px]" style={{ backgroundColor: C.primaryLight, color: C.primaryDark, fontFamily: 'Nunito, sans-serif' }}>
          + Lokasi
        </button>
      </div>

      {/* Map SVG — natural aspect ratio, responsive scaling without clipping */}
      <div className="relative mx-3 mb-3 rounded-2xl overflow-hidden" style={{ backgroundColor: '#dbeeff', aspectRatio: '385/210' }}>
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          width="100%"
          style={{ display: 'block', width: '100%', height: 'auto' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Ocean background */}
          <rect width={VW} height={VH} fill="#bae6fd" />

          {/* Grid lines */}
          {[50, 105, 160].map(y => (
            <line key={y} x1="0" y1={y} x2={VW} y2={y} stroke="#93c5fd" strokeWidth="0.5" strokeDasharray="4 4" />
          ))}
          {[95, 190, 285].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2={VH} stroke="#93c5fd" strokeWidth="0.5" strokeDasharray="4 4" />
          ))}

          {/* ── Islands ── */}

          {/* Sumatra */}
          <path d="M 22 90 L 46 52 L 74 36 L 102 58 L 90 84 L 60 94 Z"
            fill="#86efac" stroke="#22c55e" strokeWidth="1.2" strokeLinejoin="round" />
          <text x="60" y="64" fontSize="8" fill="#15803d" fontWeight="bold" textAnchor="middle">Sumatra</text>

          {/* Kalimantan */}
          <path d="M 130 28 L 182 22 L 206 48 L 194 74 L 148 78 L 122 52 Z"
            fill="#86efac" stroke="#22c55e" strokeWidth="1.2" strokeLinejoin="round" />
          <text x="162" y="50" fontSize="8" fill="#15803d" fontWeight="bold" textAnchor="middle">Kalimantan</text>

          {/* Sulawesi */}
          <path d="M 244 30 L 266 28 L 274 46 L 258 56 L 282 62 L 272 80 L 248 70 L 256 50 L 236 42 Z"
            fill="#86efac" stroke="#22c55e" strokeWidth="1.2" strokeLinejoin="round" />
          <text x="260" y="38" fontSize="7.5" fill="#15803d" fontWeight="bold" textAnchor="middle">Sulawesi</text>

          {/* Papua */}
          <path d="M 308 40 L 334 28 L 362 44 L 364 70 L 340 80 L 314 68 Z"
            fill="#86efac" stroke="#22c55e" strokeWidth="1.2" strokeLinejoin="round" />
          <text x="338" y="56" fontSize="7.5" fill="#15803d" fontWeight="bold" textAnchor="middle">Papua</text>

          {/* Java (highlighted — GPK zone) */}
          <path d="M 82 118 L 116 110 L 154 108 L 194 112 L 232 118 L 260 122 L 257 134 L 224 138 L 186 136 L 148 134 L 110 132 L 78 128 Z"
            fill="#4ade80" stroke="#16a34a" strokeWidth="1.8" strokeLinejoin="round" />
          <text x="170" y="125" fontSize="8.5" fill="#065f46" fontWeight="800" textAnchor="middle">PULAU JAWA</text>

          {/* Bali */}
          <path d="M 264 122 L 276 120 L 275 128 L 263 128 Z"
            fill="#4ade80" stroke="#16a34a" strokeWidth="1" />

          {/* Nusa Tenggara */}
          <path d="M 280 122 L 308 120 L 306 128 L 279 128 Z"
            fill="#86efac" stroke="#22c55e" strokeWidth="1" />

          {/* Home pin — Jakarta area on Java */}
          <g transform="translate(106, 107)">
            <circle cx="0" cy="0" r="8" fill="#f09334" stroke="white" strokeWidth="2" />
            <text x="0" y="3" textAnchor="middle" fontSize="8">🏠</text>
            <rect x="-20" y="-20" width="40" height="13" rx="4" fill="#1a2535" opacity="0.88" />
            <text x="0" y="-11" textAnchor="middle" fontSize="6.5" fill="white" fontWeight="bold">Rumah</text>
          </g>

          {/* GPK dots — spread along Java */}
          {[
            { cx: 128, cy: 112, name: 'Sari W.', color: C.teal, active: true },
            { cx: 158, cy: 108, name: 'Ahmad F.', color: C.purple, active: true },
            { cx: 190, cy: 113, name: 'Dian P.', color: C.teal, active: false },
            { cx: 222, cy: 118, name: 'Budi S.', color: C.purple, active: true },
            { cx: 250, cy: 121, name: 'Rina K.', color: C.teal, active: false },
          ].map((d, i) => (
            <g key={i} style={{ cursor: 'pointer' }} onClick={() => setTooltip(tooltip === d.name ? null : d.name)}>
              <circle cx={d.cx} cy={d.cy} r="6.5" fill={d.color} stroke="white" strokeWidth="1.8" opacity={d.active ? 1 : 0.6} />
              <circle cx={d.cx} cy={d.cy} r="2.5" fill="white" />
              {tooltip === d.name && (
                <g>
                  <rect x={d.cx - 24} y={d.cy - 22} width="48" height="14" rx="4" fill="#1a2535" />
                  <text x={d.cx} y={d.cy - 12} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">{d.name}</text>
                </g>
              )}
            </g>
          ))}

          {/* Legend - positioned neatly at bottom left inside SVG */}
          <g transform="translate(12, 168)">
            <rect x="0" y="0" width="138" height="24" rx="6" fill="rgba(255,255,255,0.92)" stroke={C.border} strokeWidth="0.8" />
            <circle cx="14" cy="12" r="4.5" fill="#f09334" />
            <text x="23" y="15" fontSize="7.5" fill="#333" fontWeight="bold">Lokasi Anda</text>
            <circle cx="82" cy="12" r="4.5" fill={C.teal} />
            <text x="91" y="15" fontSize="7.5" fill="#333" fontWeight="bold">GPK Aktif</text>
          </g>
        </svg>

        {/* Active count badge */}
        <div className="absolute top-2 right-2 rounded-xl px-2.5 py-1" style={{ backgroundColor: 'rgba(255,255,255,0.95)', border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <p className="text-xs font-black" style={{ color: C.deep, fontFamily: 'Nunito, sans-serif' }}>
            {GPK_MAP_DOTS.filter(d => d.active).length} GPK aktif
          </p>
        </div>
      </div>
    </div>
  )
}

function GpkServicesScreen({ onBack, onSelectGpk }: { onBack: () => void; onSelectGpk: (id: number) => void }) {
  const [filter, setFilter] = useState<'all' | 'online' | 'home'>('all')
  const [showAddLocation, setShowAddLocation] = useState(false)
  const [locationInput, setLocationInput] = useState('')

  const GPK_DISTANCES = ['1.2 km', '2.8 km', '3.1 km', '5.4 km']

  const allCount = GPK_DATA.length
  const onlineCount = GPK_DATA.filter(g => g.serviceType === 'online' || g.serviceType === 'both').length
  const homeCount = GPK_DATA.filter(g => g.serviceType === 'home' || g.serviceType === 'both').length

  const filtered = GPK_DATA.filter((g) => {
    if (filter === 'online') return g.serviceType === 'online' || g.serviceType === 'both'
    if (filter === 'home') return g.serviceType === 'home' || g.serviceType === 'both'
    return true
  })

  const tabs = [
    { key: 'all', label: 'Semua', count: allCount },
    { key: 'online', label: 'Online Meeting', count: onlineCount },
    { key: 'home', label: 'Home Visit', count: homeCount },
  ] as const

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
      {/* ── Header ── */}
      <div className="px-4 pt-5 pb-0 flex-shrink-0 w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="flex items-center justify-center rounded-2xl" style={{ width: 40, height: 40, backgroundColor: C.card, border: `1.5px solid ${C.border}`, color: C.deep, fontSize: 17 }}>←</button>
            <div className="flex items-center gap-2">
              <div className="rounded-xl flex items-center justify-center" style={{ width: 34, height: 34, backgroundColor: C.purpleLight }}>
                <span style={{ fontSize: 18 }}>👩‍🏫</span>
              </div>
              <div>
                <p className="font-black text-lg leading-tight" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Layanan GPK</p>
                <p className="text-xs" style={{ color: C.mutedText }}>{allCount} GPK tersedia</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center rounded-full" style={{ width: 38, height: 38, backgroundColor: C.card, border: `1.5px solid ${C.border}`, color: C.mutedText, fontSize: 16 }}>⤴</button>
            <button className="flex items-center justify-center rounded-full" style={{ width: 38, height: 38, backgroundColor: C.card, border: `1.5px solid ${C.border}`, color: C.mutedText, fontSize: 18 }}>⋯</button>
          </div>
        </div>

        {/* ── Filter tabs with count badges ── */}
        <div className="flex gap-2 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
          {tabs.map((t) => {
            const active = filter === t.key
            return (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className="flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 transition-all"
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  backgroundColor: active ? C.deep : C.card,
                  color: active ? '#fff' : C.mutedText,
                  border: `1.5px solid ${active ? C.deep : C.border}`,
                  boxShadow: active ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                }}
              >
                {t.label}
                <span
                  className="flex items-center justify-center rounded-full text-xs font-black leading-none"
                  style={{
                    minWidth: 22,
                    height: 22,
                    paddingInline: 6,
                    backgroundColor: active ? C.purple : C.muted,
                    color: active ? '#fff' : C.mutedText,
                    fontFamily: 'Nunito, sans-serif',
                  }}
                >
                  {t.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-24 flex flex-col gap-3 w-full max-w-2xl mx-auto px-4 pt-1">
        {/* GPK cards — task-list style */}
        {filtered.map((g, idx) => (
          <div
            key={g.id}
            className="rounded-2xl cursor-pointer active:scale-[0.98] transition-transform"
            style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}`, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
            onClick={() => onSelectGpk(g.id)}
          >
            <div className="p-4">
              {/* Row 1: name + menu */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <p className="font-black text-base leading-tight" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>{g.name}</p>
                <button className="flex items-center justify-center flex-shrink-0 rounded-full" style={{ width: 30, height: 30, color: C.mutedText, fontSize: 18, backgroundColor: C.muted }}>⋯</button>
              </div>

              {/* Row 2: tag badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: g.available ? '#dcfce7' : '#f3f4f6', color: g.available ? '#16a34a' : C.mutedText }}
                >
                  {g.available ? '● Aktif' : '○ Sibuk'}
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: C.purpleLight, color: C.purple }}
                >
                  {g.spec.split('&')[0].trim()}
                </span>
                {(g.serviceType === 'online' || g.serviceType === 'both') && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: '#e0f2fe', color: '#0369a1' }}>💻 Online</span>
                )}
                {(g.serviceType === 'home' || g.serviceType === 'both') && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: C.primaryLight, color: C.primaryDark }}>🏠 Home Visit</span>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: C.border }} />

              {/* Row 3: meta row */}
              <div className="flex items-center justify-between mt-2.5">
                <div className="flex items-center gap-3">
                  {/* Calendar + exp */}
                  <div className="flex items-center gap-1" style={{ color: C.mutedText }}>
                    <span style={{ fontSize: 13 }}>📅</span>
                    <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>{g.exp}</span>
                  </div>
                  {/* Distance */}
                  <div className="flex items-center gap-1" style={{ color: C.mutedText }}>
                    <span style={{ fontSize: 13 }}>📍</span>
                    <span className="text-xs font-bold" style={{ fontFamily: 'Inter, sans-serif', color: C.primary }}>{GPK_DISTANCES[idx] || '6 km'}</span>
                  </div>
                  {/* Reviews */}
                  <div className="flex items-center gap-1" style={{ color: C.mutedText }}>
                    <span style={{ fontSize: 13 }}>💬</span>
                    <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>{g.reviews}</span>
                  </div>
                </div>
                {/* Avatar + price */}
                <div className="flex items-center gap-2">
                  <div className="rounded-full flex items-center justify-center text-base" style={{ width: 30, height: 30, backgroundColor: C.hero }}>{g.emoji}</div>
                  <span className="text-xs font-black" style={{ fontFamily: 'Nunito, sans-serif', color: C.purple }}>{g.price.replace('/sesi', '')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── FAB ── */}
      <button
        className="fixed flex items-center justify-center rounded-full shadow-lg z-40"
        style={{ width: 52, height: 52, bottom: 80, right: 20, backgroundColor: C.purple, color: '#fff', fontSize: 26, boxShadow: '0 4px 18px rgba(139,92,246,0.45)' }}
        onClick={() => setShowAddLocation(true)}
      >
        +
      </button>

      {/* Add Location sheet */}
      {showAddLocation && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowAddLocation(false)}>
          <div className="w-full max-w-lg rounded-t-[28px] p-5 flex flex-col gap-3" style={{ backgroundColor: C.card }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <p className="font-black text-lg" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>📍 Tambah Lokasi</p>
              <button onClick={() => setShowAddLocation(false)} className="min-w-[34px] min-h-[34px] flex items-center justify-center rounded-xl" style={{ backgroundColor: C.muted }}>✕</button>
            </div>
            <p className="text-sm" style={{ color: C.mutedText }}>Masukkan alamat rumah anak agar kami bisa menampilkan GPK terdekat.</p>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ backgroundColor: C.bg, border: `1.5px solid ${C.border}` }}>
              <span>📍</span>
              <input placeholder="Contoh: Jl. Melati 12, Kemayoran, Jakarta" value={locationInput} onChange={e => setLocationInput(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" style={{ fontFamily: 'Inter, sans-serif', color: C.deep }} />
            </div>
            <div className="flex gap-2">
              {['Kemayoran, Jakarta', 'Cempaka Putih', 'Menteng, Jakarta'].map(s => (
                <button key={s} className="px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0" style={{ backgroundColor: C.primaryLight, color: C.primaryDark }} onClick={() => setLocationInput(s)}>{s}</button>
              ))}
            </div>
            <button className="w-full py-3.5 rounded-2xl font-black text-white min-h-[50px]" style={{ backgroundColor: C.purple, fontFamily: 'Nunito, sans-serif' }} onClick={() => setShowAddLocation(false)}>Simpan Lokasi ✓</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── GPK DETAIL ───────────────────────────────────────────────────────────────
function GpkDetailScreen({ gpkId, onBack, onChat, onCall }: { gpkId: number; onBack: () => void; onChat: () => void; onCall: () => void }) {
  const [tab, setTab] = useState<'profil' | 'portofolio'>('profil')
  const gpk = GPK_DATA[gpkId] || GPK_DATA[0]
  const hasOnline = gpk.serviceType === 'online' || gpk.serviceType === 'both'

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
      {/* Hero */}
      <div className="relative flex-shrink-0" style={{ backgroundColor: C.hero }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', backgroundColor: C.purple, opacity: 0.1 }} />
        <div className="px-5 pt-5 pb-5 relative z-10">
          <button onClick={onBack} className="mb-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: 18, width: 44 }}>←</button>
          <div className="flex gap-4 items-start">
            <div className="rounded-3xl flex items-center justify-center flex-shrink-0" style={{ width: 72, height: 72, backgroundColor: 'rgba(255,255,255,0.12)', fontSize: 36 }}>{gpk.emoji}</div>
            <div className="flex-1">
              <p className="font-black text-white text-xl" style={{ fontFamily: 'Nunito, sans-serif' }}>{gpk.name}</p>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{gpk.spec}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Stars n={gpk.rating} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>({gpk.reviews}) · {gpk.exp}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span style={{ fontSize: 13 }}>📍</span>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{gpk.location}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[{ val: `${gpk.childrenHandled}`, label: 'Anak Ditangani' }, { val: gpk.exp, label: 'Pengalaman' }, { val: gpk.price.replace('/sesi', ''), label: 'Per Sesi' }].map((s) => (
              <div key={s.label} className="text-center py-2.5 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
                <p className="font-black text-white text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>{s.val}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 pt-3 pb-0 gap-2 flex-shrink-0">
        {(['profil', 'portofolio'] as const).map((t) => (
          <button key={t} className="flex-1 py-2.5 rounded-xl font-bold text-sm capitalize min-h-[40px]" style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: tab === t ? C.hero : C.card, color: tab === t ? C.white : C.mutedText, border: `1.5px solid ${tab === t ? C.hero : C.border}` }} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {tab === 'profil' && (
          <>
            <Card className="p-4">
              <p className="text-xs font-bold mb-2" style={{ color: C.mutedText, fontFamily: 'Nunito, sans-serif', letterSpacing: 0.5 }}>TENTANG SAYA</p>
              <p className="text-sm leading-relaxed" style={{ color: C.deep, fontFamily: 'Inter, sans-serif' }}>{gpk.description}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-bold mb-3" style={{ color: C.mutedText, fontFamily: 'Nunito, sans-serif', letterSpacing: 0.5 }}>DETAIL PROFIL</p>
              {[
                { emoji: '🎓', label: 'Pendidikan', val: gpk.degree },
                { emoji: '📍', label: 'Alamat', val: gpk.address },
                { emoji: '👶', label: 'Anak Ditangani', val: `${gpk.childrenHandled} anak` },
                { emoji: '⏱️', label: 'Pengalaman', val: gpk.exp },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 mb-3 last:mb-0">
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.emoji}</span>
                  <div>
                    <p className="text-xs" style={{ color: C.mutedText, fontFamily: 'Nunito, sans-serif' }}>{item.label}</p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: C.deep }}>{item.val}</p>
                  </div>
                </div>
              ))}
            </Card>
            <Card className="p-4">
              <p className="text-xs font-bold mb-3" style={{ color: C.mutedText, fontFamily: 'Nunito, sans-serif', letterSpacing: 0.5 }}>LAYANAN TERSEDIA</p>
              <div className="flex gap-2 flex-wrap">
                {(gpk.serviceType === 'online' || gpk.serviceType === 'both') && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: C.purpleLight }}>
                    <span>💻</span>
                    <p className="text-sm font-bold" style={{ color: C.purple, fontFamily: 'Nunito, sans-serif' }}>Online Meeting</p>
                  </div>
                )}
                {(gpk.serviceType === 'home' || gpk.serviceType === 'both') && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: C.primaryLight }}>
                    <span>🏠</span>
                    <p className="text-sm font-bold" style={{ color: C.primaryDark, fontFamily: 'Nunito, sans-serif' }}>Home Visit</p>
                  </div>
                )}
              </div>
            </Card>
          </>
        )}
        {tab === 'portofolio' && (
          <>
            <div className="rounded-2xl p-3" style={{ backgroundColor: C.infoLight, border: `1.5px solid ${C.teal}20` }}>
              <p className="text-xs" style={{ color: C.teal, fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>📋 {gpk.childrenHandled} anak telah ditangani · {gpk.exp} pengalaman</p>
            </div>
            {gpk.portfolio.map((p, i) => (
              <div key={i} className="rounded-2xl p-4 flex gap-3 items-start" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }}>
                <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: 52, height: 52, backgroundColor: C.muted, fontSize: 26 }}>{p.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm mb-1" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>{p.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: C.mutedText }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* CTA buttons */}
      <div className="px-5 pb-5 pt-3 flex flex-col gap-2.5 flex-shrink-0" style={{ borderTop: `1.5px solid ${C.border}`, backgroundColor: C.card }}>
        <button className="w-full py-3.5 rounded-2xl font-black text-white text-base min-h-[52px] active:scale-95" style={{ backgroundColor: C.hero, fontFamily: 'Nunito, sans-serif' }} onClick={onChat}>
          💬 Mulai Chat
        </button>
        {hasOnline && (
          <button className="w-full py-3.5 rounded-2xl font-black text-white text-base min-h-[52px] active:scale-95" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', fontFamily: 'Nunito, sans-serif' }} onClick={onCall}>
            📹 Mulai Video Call
          </button>
        )}
      </div>
    </div>
  )
}

// ─── GPK CHAT ─────────────────────────────────────────────────────────────────
function GpkChatScreen({ gpkId, onBack, onCall }: { gpkId: number; onBack: () => void; onCall: () => void }) {
  const gpk = GPK_DATA[gpkId] || GPK_DATA[0]
  const hasOnline = gpk.serviceType === 'online' || gpk.serviceType === 'both'
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ from: 'me' | 'gpk'; text: string; type?: 'payment'; time: string }[]>([
    { from: 'gpk', text: `Halo Bu Dewi! Saya ${gpk.name.split(',')[0]}. Bagaimana kabar Rafi hari ini? 😊`, time: '09:01' },
    { from: 'me', text: 'Halo Bu Sari! Alhamdulillah baik. Kami ingin menjadwalkan sesi terapi minggu ini.', time: '09:03' },
    { from: 'gpk', text: 'Tentu! Saya tersedia Selasa dan Kamis jam 10.00–11.30. Mana yang cocok untuk Rafi?', time: '09:04' },
    { from: 'me', text: 'Kamis jam 10.00 ya Bu, cocok banget!', time: '09:06' },
    { from: 'gpk', text: 'Oke, saya konfirmasi Kamis 10.00. Untuk sesi ini, ini link pembayarannya ya Bu 🧾', time: '09:07', type: 'payment' },
  ])
  const chatRef = useRef<HTMLDivElement>(null)

  function nowTime() {
    const d = new Date()
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  function send() {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { from: 'me', text: input, time: nowTime() }])
    setInput('')
  }

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#f0f2f5' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ backgroundColor: C.hero }}>
        <button onClick={onBack} className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>←</button>
        <div className="rounded-full flex items-center justify-center" style={{ width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.12)', fontSize: 20, flexShrink: 0 }}>{gpk.emoji}</div>
        <div className="flex-1">
          <p className="font-black text-white text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>{gpk.name.split(',')[0]}</p>
          <div className="flex items-center gap-1">
            <div className="rounded-full" style={{ width: 6, height: 6, backgroundColor: gpk.available ? '#4ade80' : '#9ca3af' }} />
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{gpk.available ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        {hasOnline && (
          <button onClick={onCall} className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: 20 }}>📹</button>
        )}
      </div>

      {/* Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            {m.from === 'gpk' && (
              <div className="rounded-full flex items-center justify-center mr-2 flex-shrink-0 self-end" style={{ width: 28, height: 28, backgroundColor: C.hero, fontSize: 14 }}>{gpk.emoji}</div>
            )}
            {m.type === 'payment' ? (
              <div className="rounded-2xl overflow-hidden" style={{ maxWidth: '78%', backgroundColor: C.card, border: `1.5px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div className="px-4 py-3 text-sm" style={{ color: C.deep }}>{m.text}</div>
                <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#fff8ec', borderTop: `1px solid ${C.border}` }}>
                  <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, backgroundColor: C.primaryLight, fontSize: 22 }}>🧾</div>
                  <div className="flex-1">
                    <p className="font-black text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Tagihan Sesi</p>
                    <p className="font-black text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.primary }}>{gpk.price}</p>
                  </div>
                  <button className="px-3 py-2 rounded-xl font-black text-xs text-white" style={{ backgroundColor: C.hero, fontFamily: 'Nunito, sans-serif' }}>Bayar</button>
                </div>
                <div className="px-4 pb-2 text-right">
                  <span style={{ fontSize: 10, color: C.mutedText }}>{m.time}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col" style={{ maxWidth: '75%', alignItems: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
                <div className="px-4 py-2.5 text-sm leading-relaxed" style={{ backgroundColor: m.from === 'me' ? C.teal : C.card, color: m.from === 'me' ? C.white : C.deep, fontFamily: 'Inter, sans-serif', borderRadius: 18, borderBottomRightRadius: m.from === 'me' ? 4 : 18, borderBottomLeftRadius: m.from === 'gpk' ? 4 : 18, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  {m.text}
                </div>
                <span style={{ fontSize: 10, color: '#9ca3af', marginTop: 3 }}>{m.time}{m.from === 'me' ? ' ✓✓' : ''}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0" style={{ backgroundColor: C.card, borderTop: `1px solid ${C.border}` }}>
        <div className="flex-1 flex items-center px-4 rounded-2xl min-h-[44px]" style={{ backgroundColor: '#f0f2f5', border: `1px solid ${C.border}` }}>
          <input className="flex-1 bg-transparent outline-none text-sm py-2" placeholder="Tulis pesan..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} style={{ color: C.deep, fontFamily: 'Inter, sans-serif' }} />
        </div>
        <button className="rounded-full flex items-center justify-center" style={{ width: 44, height: 44, backgroundColor: input.trim() ? C.teal : C.muted, color: 'white', fontSize: 18 }} onClick={send}>➤</button>
      </div>
    </div>
  )
}

// ─── GPK VIDEO CALL ───────────────────────────────────────────────────────────
function GpkCallScreen({ gpkId, onEnd }: { gpkId: number; onEnd: () => void }) {
  const gpk = GPK_DATA[gpkId] || GPK_DATA[0]
  const [phase, setPhase] = useState<'connecting' | 'connected'>('connecting')
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setPhase('connected'), 2500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase !== 'connected') return
    const t = setInterval(() => setDuration((d) => d + 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  const fmtDuration = `${String(Math.floor(duration / 60)).padStart(2, '0')}:${String(duration % 60).padStart(2, '0')}`

  return (
    <div className="flex flex-col h-full relative" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)' }}>
      {/* Remote view */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 relative">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(26,145,176,0.08) 0%, transparent 70%)' }} />
        {phase === 'connecting' ? (
          <>
            <div className="rounded-full flex items-center justify-center" style={{ width: 100, height: 100, backgroundColor: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.12)', fontSize: 50 }}>{gpk.emoji}</div>
            <p className="font-black text-white text-xl" style={{ fontFamily: 'Nunito, sans-serif' }}>{gpk.name.split(',')[0]}</p>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-full typing-dot" style={{ width: 8, height: 8, backgroundColor: 'rgba(255,255,255,0.5)' }} />
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Menghubungkan...</p>
          </>
        ) : (
          <>
            <div className="rounded-3xl flex items-center justify-center w-full mx-8" style={{ height: 280, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 80 }}>{gpk.emoji}</div>
            <p className="font-black text-white text-xl" style={{ fontFamily: 'Nunito, sans-serif' }}>{gpk.name.split(',')[0]}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>{fmtDuration}</p>
          </>
        )}
      </div>

      {/* Self view */}
      {phase === 'connected' && (
        <div className="absolute top-12 right-5 rounded-2xl flex items-center justify-center" style={{ width: 80, height: 110, backgroundColor: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)', fontSize: 36 }}>👩</div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 px-8 py-8 flex-shrink-0">
        {[
          { icon: '🎤', label: 'Mikrofon', active: true },
          { icon: '📹', label: 'Kamera', active: true },
          { icon: '🔊', label: 'Speaker', active: true },
        ].map((btn) => (
          <div key={btn.label} className="flex flex-col items-center gap-1.5">
            <button className="rounded-full flex items-center justify-center active:scale-90" style={{ width: 52, height: 52, backgroundColor: 'rgba(255,255,255,0.12)', fontSize: 24 }}>{btn.icon}</button>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'Nunito, sans-serif' }}>{btn.label}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1.5">
          <button className="rounded-full flex items-center justify-center active:scale-90" style={{ width: 60, height: 60, backgroundColor: C.red, fontSize: 26 }} onClick={onEnd}>📵</button>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'Nunito, sans-serif' }}>Tutup</span>
        </div>
      </div>
    </div>
  )
}

// ─── GPK REGISTER ─────────────────────────────────────────────────────────────
function GpkRegisterScreen({ onSubmit, onBack }: { onSubmit: () => void; onBack: () => void }) {
  const [nama, setNama] = useState('')
  const [umur, setUmur] = useState('')
  const [kampus, setKampus] = useState('')
  const [jenjang, setJenjang] = useState<'S1' | 'S2' | 'S3'>('S1')
  const [gender, setGender] = useState<'Pria' | 'Wanita'>('Wanita')
  const [alamat, setAlamat] = useState('')
  const [licenseUploaded, setLicenseUploaded] = useState(false)

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: C.bg }}>
      <div className="px-6 pt-6 pb-8 flex-shrink-0 relative" style={{ backgroundColor: C.hero, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 130, height: 130, borderRadius: '50%', backgroundColor: C.purple, opacity: 0.1 }} />
        <button onClick={onBack} className="flex items-center gap-1.5 mb-5 font-semibold text-sm min-h-[44px]" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif' }}>← Kembali</button>
        <div className="text-center relative z-10">
          <div style={{ fontSize: 44, marginBottom: 6 }}>🧑‍🏫</div>
          <h1 className="font-black text-2xl text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>Daftar Guru GPK</h1>
          <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Isi data diri dan dokumen kelulusan</p>
        </div>
      </div>

      <div className="flex-1 px-6 pt-5 pb-8 flex flex-col gap-3.5">
        {[
          { label: 'NAMA LENGKAP', emoji: '👤', placeholder: 'Contoh: Sari Wulandari, S.Pd', value: nama, onChange: setNama },
          { label: 'USIA', emoji: '🎂', placeholder: 'Contoh: 28 tahun', value: umur, onChange: setUmur },
          { label: 'LULUSAN UNIVERSITAS', emoji: '🏫', placeholder: 'Contoh: Universitas Jakarta', value: kampus, onChange: setKampus },
          { label: 'ALAMAT LENGKAP', emoji: '📍', placeholder: 'Jalan, kecamatan, kota', value: alamat, onChange: setAlamat },
        ].map((f) => (
          <div key={f.label}>
            <div className="flex items-center gap-2 mb-1.5">
              <span style={{ fontSize: 15 }}>{f.emoji}</span>
              <label className="text-xs font-bold" style={{ color: C.mutedText, fontFamily: 'Nunito, sans-serif', letterSpacing: 0.5 }}>{f.label}</label>
            </div>
            <input placeholder={f.placeholder} value={f.value} onChange={(e) => f.onChange(e.target.value)} className="w-full outline-none text-sm" style={{ padding: '13px 16px', borderRadius: 14, border: `1.5px solid ${f.value ? C.purple : C.border}`, backgroundColor: f.value ? C.card : C.muted, color: C.deep, fontFamily: 'Inter, sans-serif' }} />
          </div>
        ))}

        {/* Jenjang */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span style={{ fontSize: 15 }}>🎓</span>
            <label className="text-xs font-bold" style={{ color: C.mutedText, fontFamily: 'Nunito, sans-serif', letterSpacing: 0.5 }}>JENJANG PENDIDIKAN</label>
          </div>
          <div className="flex gap-2">
            {(['S1', 'S2', 'S3'] as const).map((j) => (
              <button key={j} className="flex-1 py-3 rounded-xl font-black text-sm active:scale-95" style={{ backgroundColor: jenjang === j ? C.purple : C.card, color: jenjang === j ? C.white : C.mutedText, border: `1.5px solid ${jenjang === j ? C.purple : C.border}`, fontFamily: 'Nunito, sans-serif' }} onClick={() => setJenjang(j)}>{j}</button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span style={{ fontSize: 15 }}>👤</span>
            <label className="text-xs font-bold" style={{ color: C.mutedText, fontFamily: 'Nunito, sans-serif', letterSpacing: 0.5 }}>JENIS KELAMIN</label>
          </div>
          <div className="flex gap-2">
            {(['Pria', 'Wanita'] as const).map((g) => (
              <button key={g} className="flex-1 py-3 rounded-xl font-black text-sm active:scale-95" style={{ backgroundColor: gender === g ? C.purple : C.card, color: gender === g ? C.white : C.mutedText, border: `1.5px solid ${gender === g ? C.purple : C.border}`, fontFamily: 'Nunito, sans-serif' }} onClick={() => setGender(g)}>{g === 'Pria' ? '👨 Pria' : '👩 Wanita'}</button>
            ))}
          </div>
        </div>

        {/* Upload lisensi */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span style={{ fontSize: 15 }}>📎</span>
            <label className="text-xs font-bold" style={{ color: C.mutedText, fontFamily: 'Nunito, sans-serif', letterSpacing: 0.5 }}>UPLOAD LISENSI & NILAI KULIAH</label>
          </div>
          <button className="w-full py-4 rounded-xl flex items-center justify-center gap-3 active:scale-95" style={{ backgroundColor: licenseUploaded ? '#f0fdf4' : C.card, border: `2px dashed ${licenseUploaded ? '#4ade80' : C.border}` }} onClick={() => setLicenseUploaded(!licenseUploaded)}>
            <span style={{ fontSize: 24 }}>{licenseUploaded ? '✅' : '📄'}</span>
            <p className="text-sm font-bold" style={{ fontFamily: 'Nunito, sans-serif', color: licenseUploaded ? '#16a34a' : C.mutedText }}>{licenseUploaded ? 'Dokumen terupload!' : 'Ketuk untuk upload dokumen'}</p>
          </button>
        </div>

        <button className="w-full mt-2 py-4 rounded-2xl font-black text-white text-base min-h-[56px] active:scale-95" style={{ backgroundColor: C.purple, fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 16px rgba(124,92,191,0.3)' }} onClick={onSubmit}>
          Kirim Pendaftaran 🚀
        </button>
      </div>
    </div>
  )
}

// ─── GPK REGISTER VERIFY ─────────────────────────────────────────────────────
function GpkRegisterVerifyScreen({ onGoLogin }: { onGoLogin: () => void }) {
  return (
    <div className="flex flex-col h-full items-center justify-center px-8 text-center" style={{ backgroundColor: C.hero }}>
      <div style={{ position: 'absolute', top: -60, left: -60, width: 220, height: 220, borderRadius: '50%', backgroundColor: C.purple, opacity: 0.07 }} />
      <div style={{ position: 'absolute', bottom: 80, right: -40, width: 160, height: 160, borderRadius: '50%', backgroundColor: C.primary, opacity: 0.07 }} />
      <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
      <h1 className="font-black text-3xl text-white mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>Hore! Berhasil!</h1>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 280 }}>
        Pendaftaranmu sudah kami terima! Mohon tunggu verifikasi dari tim Questoria. Notifikasi akan dikirim ke email kamu.
      </p>
      <div className="rounded-3xl p-4 w-full mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="font-black text-white text-base mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>📧 Cek Email Kamu</p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>Setelah diverifikasi, kamu akan mendapat email konfirmasi untuk melanjutkan ke tahap pengisian profil.</p>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Sudah dapat email verifikasi?</p>
        <button className="w-full py-4 rounded-2xl font-black text-white text-base min-h-[56px] active:scale-95" style={{ backgroundColor: C.purple, fontFamily: 'Nunito, sans-serif' }} onClick={onGoLogin}>
          Login Sekarang →
        </button>
      </div>
    </div>
  )
}

// ─── GPK REGISTER PROFILE ─────────────────────────────────────────────────────
function GpkRegisterProfileScreen({ onDone }: { onDone: () => void }) {
  const [desc, setDesc] = useState('')
  const [photoUploaded, setPhotoUploaded] = useState(false)

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: C.bg }}>
      <div className="px-6 pt-6 pb-8 flex-shrink-0 relative" style={{ backgroundColor: C.hero, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', backgroundColor: C.purple, opacity: 0.1 }} />
        <div className="text-center relative z-10 mt-4">
          <div style={{ fontSize: 44, marginBottom: 6 }}>✏️</div>
          <h1 className="font-black text-2xl text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>Lengkapi Profil</h1>
          <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Tampilkan dirimu kepada orang tua</p>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-8 flex flex-col gap-4">
        {/* Photo upload */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: 15 }}>📷</span>
            <label className="text-xs font-bold" style={{ color: C.mutedText, fontFamily: 'Nunito, sans-serif', letterSpacing: 0.5 }}>FOTO PROFIL</label>
          </div>
          <button className="w-full py-5 rounded-2xl flex flex-col items-center gap-2 active:scale-95" style={{ backgroundColor: photoUploaded ? C.purpleLight : C.card, border: `2px dashed ${photoUploaded ? C.purple : C.border}` }} onClick={() => setPhotoUploaded(!photoUploaded)}>
            <span style={{ fontSize: 36 }}>{photoUploaded ? '👩‍🏫' : '📷'}</span>
            <p className="text-sm font-bold" style={{ fontFamily: 'Nunito, sans-serif', color: photoUploaded ? C.purple : C.mutedText }}>{photoUploaded ? 'Foto berhasil diupload!' : 'Upload foto profil'}</p>
          </button>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: 15 }}>📝</span>
            <label className="text-xs font-bold" style={{ color: C.mutedText, fontFamily: 'Nunito, sans-serif', letterSpacing: 0.5 }}>DESKRIPSI SINGKAT</label>
          </div>
          <textarea placeholder="Ceritakan tentang spesialisasi, pengalaman, dan metode terapi yang kamu gunakan..." value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full outline-none text-sm" style={{ padding: '14px 16px', borderRadius: 16, border: `1.5px solid ${desc ? C.purple : C.border}`, backgroundColor: desc ? C.card : C.muted, color: C.deep, fontFamily: 'Inter, sans-serif', height: 120, resize: 'none', lineHeight: 1.6 }} />
          <p className="text-xs mt-1 text-right" style={{ color: C.mutedText }}>{desc.length}/200 karakter</p>
        </div>

        <div className="flex-1" />

        <button className="w-full py-4 rounded-2xl font-black text-white text-base min-h-[56px] active:scale-95" style={{ backgroundColor: C.purple, fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 16px rgba(124,92,191,0.3)' }} onClick={onDone}>
          Masuk ke Dashboard 🏠
        </button>
      </div>
    </div>
  )
}

// ─── FORUM DATA ───────────────────────────────────────────────────────────────
const FORUM_TOPICS = [
  {
    id: 0, title: 'Cara mengatasi tantrum anak di tempat umum — tips yang berhasil!',
    body: 'Halo semua! Anak saya (7 th, autisme level 1) sering tantrum di mall atau tempat ramai. Setelah konsultasi dengan GPK dan coba beberapa teknik, akhirnya ada beberapa yang berhasil. Mau berbagi pengalaman supaya bermanfaat untuk orang tua lain.',
    replies: 34, views: 1280, emoji: '💬', tag: 'Perilaku', time: '2j lalu', hot: true,
    author: 'Bu Dewi R.', authorEmoji: '👩',
    comments: [
      { author: 'Pak Andi', emoji: '👨', time: '1j lalu', text: 'Terima kasih sharingnya Bu! Kami juga mengalami hal serupa. Teknik deep pressure yang Bu Dewi ceritakan sudah kami coba dan lumayan berhasil.' },
      { author: 'Bu Siti', emoji: '👩‍🦱', time: '45m lalu', text: 'Boleh tanya Bu, untuk sensory kit yang direkomendasikan GPK itu beli di mana ya?' },
      { author: 'Bu Dewi R.', emoji: '👩', time: '30m lalu', text: '@Bu Siti ada di Toko Questoria kok, ada Sensory Play Kit yang cukup lengkap!' },
      { author: 'Bu Maya', emoji: '👩‍🦰', time: '15m lalu', text: 'Sangat membantu! Anak saya juga punya trigger yang sama. Akan dicoba malam ini.' },
    ],
    viewers: ['Bu Dewi R.', 'Pak Andi', 'Bu Siti', 'Bu Maya', 'Pak Rudi', 'Bu Hani', '+ 1.274 lainnya'],
  },
  {
    id: 1, title: 'Rekomendasi sekolah inklusi terbaik di Jakarta & Bandung 2026',
    body: 'Lagi mencari referensi sekolah inklusi untuk anak saya yang akan masuk SD tahun ini. Sudah ada yang punya pengalaman mendaftarkan anak ke sekolah inklusi? Share pengalamannya yuk!',
    replies: 19, views: 876, emoji: '🏫', tag: 'Sekolah', time: '5j lalu', hot: false,
    author: 'Pak Budi', authorEmoji: '👨',
    comments: [
      { author: 'Bu Rina', emoji: '👩', time: '4j lalu', text: 'Di Bandung ada SDN Harapan Mulia yang cukup bagus program inklusifnya, GPK-nya aktif dan supportif.' },
      { author: 'Bu Lestari', emoji: '👩‍🏫', time: '3j lalu', text: 'Kalau Jakarta, area Kebayoran ada beberapa sekolah inklusi dengan rasio GPK yang cukup baik per kelasnya.' },
    ],
    viewers: ['Pak Budi', 'Bu Rina', 'Bu Lestari', 'Pak Hendra', '+ 872 lainnya'],
  },
  {
    id: 2, title: 'Pengalaman 6 bulan terapi ABA — progres luar biasa!',
    body: 'Mau cerita perkembangan anak kami setelah 6 bulan rutin terapi ABA bersama Pak Ahmad Fauzi dari Questoria. Hasilnya melebihi ekspektasi — kontak mata meningkat, mau antri, dan sudah bisa bilang 3 kata berturutan!',
    replies: 48, views: 2100, emoji: '📖', tag: 'Terapi', time: '1h lalu', hot: true,
    author: 'Bu Kartika', authorEmoji: '👩‍🦱',
    comments: [
      { author: 'Pak Ahmad F.', emoji: '👨‍🏫', time: '50m lalu', text: 'Terima kasih atas kepercayaannya Bu Kartika! Progres Dimas memang luar biasa, dia anak yang tekun dan orang tuanya sangat supportif 🙏' },
      { author: 'Bu Wulan', emoji: '👩', time: '40m lalu', text: 'Wah keren banget! Anak saya baru mulai ABA bulan lalu. Membaca ini jadi lebih semangat!' },
      { author: 'Pak Eko', emoji: '👨', time: '25m lalu', text: 'GPK Questoria memang recommended! Anak kami juga sudah 3 bulan dan progresnya nyata.' },
    ],
    viewers: ['Bu Kartika', 'Pak Ahmad F.', 'Bu Wulan', 'Pak Eko', '+ 2.096 lainnya'],
  },
  {
    id: 3, title: 'Diet GFCF untuk anak autisme — berhasil atau tidak?',
    body: 'Sudah 3 bulan menerapkan diet GFCF (Gluten Free Casein Free) untuk anak saya. Ada yang punya pengalaman serupa? Sejauh ini perilaku anak terlihat lebih tenang, tapi susah sekali menghindari makanan mengandung gluten di Indonesia.',
    replies: 27, views: 1540, emoji: '🥗', tag: 'Nutrisi', time: '3j lalu', hot: false,
    author: 'Bu Fitri', authorEmoji: '👩‍🦰',
    comments: [
      { author: 'Bu Nanda', emoji: '👩', time: '2j lalu', text: 'Kami sudah 1 tahun GFCF Bu! Memang susah awalnya tapi ada bedanya. Terutama dari sisi fokus dan ketenangan.' },
      { author: 'Dr. Hana', emoji: '👩‍⚕️', time: '1j lalu', text: 'Secara medis, efektivitasnya masih controversial. Yang penting pantau reaksi anak secara individual ya Bu.' },
    ],
    viewers: ['Bu Fitri', 'Bu Nanda', 'Dr. Hana', '+ 1.537 lainnya'],
  },
  {
    id: 4, title: 'Tips komunikasi efektif dengan anak non-verbal usia 5 tahun',
    body: 'Anak saya 5 tahun, belum verbal. GPK menyarankan pakai PECS. Sudah ada yang berhasil pakai PECS atau AAC lain? Mau cari tahu lebih lanjut tentang cara terbaik memulainya.',
    replies: 61, views: 3020, emoji: '🗣️', tag: 'Komunikasi', time: '30m lalu', hot: true,
    author: 'Pak Denny', authorEmoji: '👨‍🦱',
    comments: [
      { author: 'Bu Sari W.', emoji: '👩‍🏫', time: '25m lalu', text: 'PECS sangat efektif untuk memulai! Mulai dari fase 1 dulu — minta item favorit anak menggunakan gambar. Konsisten 2-3 kali sehari.' },
      { author: 'Bu Rini', emoji: '👩', time: '20m lalu', text: 'Anak saya mulai pakai PECS usia 4 th, sekarang 6 th sudah bisa 15+ kata verbal! Jangan menyerah Pak!' },
      { author: 'Pak Denny', emoji: '👨‍🦱', time: '10m lalu', text: '@Bu Sari terima kasih banyak! Akan saya coba mulai minggu ini bersama GPK.' },
    ],
    viewers: ['Pak Denny', 'Bu Sari W.', 'Bu Rini', '+ 3.017 lainnya'],
  },
]

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Perilaku: { bg: '#fff3e0', text: '#c47800' },
  Sekolah: { bg: '#dff3f9', text: '#1a91b0' },
  Terapi: { bg: '#f0e8ff', text: '#7c5cbf' },
  Nutrisi: { bg: '#d8eef7', text: '#1a91b0' },
  Komunikasi: { bg: '#fff0dc', text: '#d4801f' },
}

// ─── FORUM ────────────────────────────────────────────────────────────────────
function ForumScreen({ onBack, onSelectTopic, role, onNav }: { onBack: () => void; onSelectTopic: (id: number) => void; role?: Role; onNav?: (s: Screen) => void }) {
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [showNewTopic, setShowNewTopic] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [search, setSearch] = useState('')

  const filters = ['Semua', 'Populer', 'Perilaku', 'Sekolah', 'Terapi', 'Komunikasi', 'Nutrisi']

  const filtered = FORUM_TOPICS.filter((t) => {
    const matchFilter = activeFilter === 'Semua' ? true : activeFilter === 'Populer' ? t.hot : t.tag === activeFilter
    const matchSearch = search ? t.title.toLowerCase().includes(search.toLowerCase()) : true
    return matchFilter && matchSearch
  })

  const accentColor = role === 'gpk' ? C.purple : C.primary

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
      {/* Header */}
      <div className="flex-shrink-0" style={{ backgroundColor: C.card, borderBottom: `1.5px solid ${C.border}` }}>
        {/* Top bar */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-2xl flex-shrink-0" style={{ backgroundColor: C.muted, color: C.deep, fontSize: 16 }}>←</button>
            <div className="flex-1 min-w-0">
              <p className="font-black text-base" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>💬 Forum Komunitas</p>
              <p className="text-xs" style={{ color: C.mutedText }}>Berbagi & saling mendukung</p>
            </div>
            <button className="px-3.5 py-2 min-h-[38px] rounded-2xl text-xs font-black text-white active:scale-95 flex-shrink-0" style={{ backgroundColor: accentColor, fontFamily: 'Nunito, sans-serif' }} onClick={() => setShowNewTopic(true)}>+ Topik</button>
          </div>
          {/* Stats row */}
          <div className="flex gap-3 mt-3">
            {[{ val: '2.4k', label: 'Anggota' }, { val: '128', label: 'Topik' }, { val: '47', label: 'Online' }].map((s) => (
              <div key={s.label} className="flex-1 text-center py-2 rounded-xl" style={{ backgroundColor: C.muted }}>
                <p className="font-black text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>{s.val}</p>
                <p className="text-[10px]" style={{ color: C.mutedText }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Search */}
        <div className="mx-4 mb-2 flex items-center gap-2 px-3 py-2.5 rounded-2xl" style={{ backgroundColor: C.bg, border: `1.5px solid ${C.border}` }}>
          <span style={{ fontSize: 14, flexShrink: 0, color: C.mutedText }}>🔍</span>
          <input className="flex-1 bg-transparent text-sm outline-none min-w-0" placeholder="Cari topik..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ color: C.deep, fontFamily: 'Inter, sans-serif' }} />
        </div>
        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 px-4" style={{ scrollbarWidth: 'none' }}>
          {filters.map((f) => (
            <button key={f} className="flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold min-h-[32px]" style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: activeFilter === f ? accentColor : C.bg, color: activeFilter === f ? C.white : C.mutedText, border: `1.5px solid ${activeFilter === f ? accentColor : C.border}` }} onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {/* Post list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-3 flex flex-col gap-2.5">
        {filtered.map((t) => (
          <button key={t.id} className="w-full text-left rounded-2xl active:scale-[0.98]" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }} onClick={() => onSelectTopic(t.id)}>
            <div className="px-4 py-3.5">
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: TAG_COLORS[t.tag]?.bg || C.muted, color: TAG_COLORS[t.tag]?.text || C.deep, fontFamily: 'Nunito, sans-serif' }}>{t.tag}</span>
                {t.hot && <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fef9c3', color: '#b45309', fontFamily: 'Nunito, sans-serif' }}>🔥 Populer</span>}
              </div>
              <p className="font-bold text-sm leading-snug mb-1.5" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>{t.title}</p>
              <p className="text-xs leading-relaxed mb-2.5" style={{ color: C.mutedText, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.body}</p>
              <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{t.authorEmoji}</span>
                  <span className="text-xs font-semibold truncate" style={{ color: C.deep }}>{t.author}</span>
                  <span className="text-xs flex-shrink-0" style={{ color: C.mutedText }}>· {t.time}</span>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className="text-xs" style={{ color: C.mutedText }}>💬 {t.replies}</span>
                  <span className="text-xs" style={{ color: C.mutedText }}>👁 {t.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p style={{ fontSize: 40 }}>🔍</p>
            <p className="font-bold mt-2 text-sm" style={{ color: C.mutedText }}>Topik tidak ditemukan</p>
          </div>
        )}
      </div>

      {/* Bottom nav for parent/gpk */}
      {role && onNav && (role === 'parent' || role === 'gpk') && (
        <BottomNav active="forum" role={role} onNav={onNav} />
      )}

      {/* New topic modal — fixed */}
      {showNewTopic && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowNewTopic(false)}>
          <div className="rounded-t-3xl p-5 flex flex-col gap-3" style={{ backgroundColor: C.card }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="font-black text-lg" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>+ Buat Topik Baru</p>
              <button onClick={() => setShowNewTopic(false)} className="min-w-[34px] min-h-[34px] flex items-center justify-center rounded-xl" style={{ backgroundColor: C.muted, color: C.mutedText }}>✕</button>
            </div>
            <input placeholder="Judul topik..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full outline-none text-sm" style={{ padding: '12px 14px', borderRadius: 14, border: `1.5px solid ${C.border}`, fontFamily: 'Inter, sans-serif', color: C.deep, backgroundColor: C.bg }} />
            <textarea placeholder="Ceritakan lebih detail..." className="w-full outline-none text-sm" style={{ padding: '12px 14px', borderRadius: 14, border: `1.5px solid ${C.border}`, height: 80, resize: 'none', fontFamily: 'Inter, sans-serif', color: C.deep, backgroundColor: C.bg }} />
            <div className="flex gap-2 flex-wrap">
              {Object.keys(TAG_COLORS).map((tag) => (
                <button key={tag} className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ backgroundColor: TAG_COLORS[tag].bg, color: TAG_COLORS[tag].text, fontFamily: 'Nunito, sans-serif' }}>{tag}</button>
              ))}
            </div>
            <button className="w-full py-3.5 rounded-2xl font-black text-white min-h-[48px] active:scale-95" style={{ backgroundColor: accentColor, fontFamily: 'Nunito, sans-serif' }} onClick={() => setShowNewTopic(false)}>Posting 🚀</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── FORUM DETAIL ─────────────────────────────────────────────────────────────
function ForumDetailScreen({ topicId, onBack }: { topicId: number; onBack: () => void }) {
  const topic = FORUM_TOPICS[topicId] || FORUM_TOPICS[0]
  const [reply, setReply] = useState('')
  const [showViewers, setShowViewers] = useState(false)
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState(topic.comments)
  const scrollRef = useRef<HTMLDivElement>(null)

  function sendReply() {
    if (!reply.trim()) return
    setComments((prev) => [...prev, { author: 'Saya', emoji: '👤', time: 'baru saja', text: reply }])
    setReply('')
    setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, 80)
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#f7f7f7' }}>
      {/* Sticky header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-4 pb-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #ebebeb' }}>
        <button onClick={onBack} className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: '#f2f2f2', color: '#1a1a1a', fontSize: 16 }}>←</button>
        <span className="flex-1 font-black text-sm truncate" style={{ fontFamily: 'Nunito, sans-serif', color: '#1a1a1a' }}>Forum Komunitas</span>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl min-h-[32px]" style={{ backgroundColor: '#f2f2f2' }} onClick={() => setShowViewers(!showViewers)}>
          <span style={{ fontSize: 13 }}>👁</span>
          <span className="text-xs font-semibold" style={{ color: '#555' }}>{topic.views.toLocaleString()}</span>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {/* Post card */}
        <div className="mx-4 mt-4 rounded-2xl p-4" style={{ backgroundColor: '#ffffff', border: '1px solid #ebebeb' }}>
          {/* Tag + hot */}
          <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full" style={{ backgroundColor: TAG_COLORS[topic.tag]?.bg || '#f2f2f2', color: TAG_COLORS[topic.tag]?.text || '#333', fontFamily: 'Nunito, sans-serif' }}>{topic.tag}</span>
            {topic.hot && <span className="text-xs font-black px-2.5 py-0.5 rounded-full" style={{ backgroundColor: '#fef9c3', color: '#b45309', fontFamily: 'Nunito, sans-serif' }}>🔥 Populer</span>}
          </div>
          {/* Title */}
          <h1 className="font-black text-base leading-snug mb-2.5" style={{ fontFamily: 'Nunito, sans-serif', color: '#111' }}>{topic.title}</h1>
          {/* Body */}
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#333', fontFamily: 'Inter, sans-serif' }}>{topic.body}</p>
          {/* Author */}
          <div className="flex items-center gap-2.5 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
            <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32, backgroundColor: '#f2f2f2', fontSize: 17 }}>{topic.authorEmoji}</div>
            <div className="min-w-0">
              <p className="font-bold text-xs" style={{ color: '#111', fontFamily: 'Nunito, sans-serif' }}>{topic.author}</p>
              <p className="text-xs" style={{ color: '#999' }}>{topic.time}</p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-4 pt-3">
            <button className="flex items-center gap-1.5 min-h-[34px]" onClick={() => setLiked(!liked)}>
              <span style={{ fontSize: 17 }}>{liked ? '❤️' : '🤍'}</span>
              <span className="text-sm font-semibold" style={{ color: liked ? '#e05252' : '#888', fontFamily: 'Nunito, sans-serif' }}>Suka</span>
            </button>
            <button className="flex items-center gap-1.5 min-h-[34px]">
              <span style={{ fontSize: 17 }}>📤</span>
              <span className="text-sm font-semibold" style={{ color: '#888', fontFamily: 'Nunito, sans-serif' }}>Bagikan</span>
            </button>
            <span className="flex-1 text-right text-xs" style={{ color: '#aaa' }}>💬 {comments.length} komentar</span>
          </div>
        </div>

        {/* Viewers */}
        {showViewers && (
          <div className="mx-4 mt-3 rounded-2xl p-4" style={{ backgroundColor: '#ffffff', border: '1px solid #ebebeb' }}>
            <p className="font-bold text-xs mb-2.5" style={{ color: '#555', fontFamily: 'Nunito, sans-serif', letterSpacing: 0.3 }}>👁 DILIHAT OLEH</p>
            <div className="flex flex-wrap gap-1.5">
              {topic.viewers.map((v, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: '#f2f2f2', color: '#333' }}>{v}</span>
              ))}
            </div>
          </div>
        )}

        {/* Comments section */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-bold mb-3" style={{ color: '#999', fontFamily: 'Nunito, sans-serif', letterSpacing: 0.5 }}>💬 {comments.length} KOMENTAR</p>
          <div className="flex flex-col gap-2.5">
            {comments.map((c, i) => (
              <div key={i} className="rounded-2xl p-3" style={{ backgroundColor: '#ffffff', border: '1px solid #ebebeb' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 28, height: 28, backgroundColor: '#f2f2f2', fontSize: 14 }}>{c.emoji}</div>
                  <span className="font-bold text-xs" style={{ color: '#111', fontFamily: 'Nunito, sans-serif' }}>{c.author}</span>
                  <span className="text-xs" style={{ color: '#bbb' }}>· {c.time}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#333', fontFamily: 'Inter, sans-serif', paddingLeft: 36 }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 72 }} />
      </div>

      {/* Reply bar */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #ebebeb' }}>
        <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, backgroundColor: '#f2f2f2', fontSize: 15 }}>👤</div>
        <div className="flex-1 flex items-center px-3 rounded-2xl min-h-[40px]" style={{ backgroundColor: '#f7f7f7', border: '1.5px solid #e8e8e8' }}>
          <input className="flex-1 bg-transparent outline-none text-sm min-w-0" placeholder="Tulis komentar..." value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendReply()} style={{ color: '#111', fontFamily: 'Inter, sans-serif' }} />
        </div>
        <button className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, backgroundColor: reply.trim() ? C.teal : '#e0e0e0', color: 'white', fontSize: 15 }} onClick={sendReply}>➤</button>
      </div>
    </div>
  )
}

// ─── STORE DATA ───────────────────────────────────────────────────────────────
const STORE_PRODUCTS = [
  { id: 0, name: 'Story Book Personal', desc: 'Buku cerita bergambar yang dipersonalisasi berdasarkan data perkembangan anak Anda — karakter utama adalah anak Anda sendiri!', price: 185000, emoji: '📚', badge: 'Personalisasi', badgeBg: C.purpleLight, category: 'Buku', sold: 342, rating: 4.9 },
  { id: 1, name: 'Educational Activity Kit — Basic', desc: '24 kartu emosi + panduan motorik halus untuk terapi ABA di rumah. Cocok usia 3–8 tahun.', price: 250000, emoji: '🧩', badge: 'Terlaris', badgeBg: '#fff0dc', category: 'Alat Terapi', sold: 891, rating: 4.8 },
  { id: 2, name: 'Sensory Play Kit', desc: 'Pasir kinetik, 5 bola bertekstur, fidget spinner, dan 10 lembar aktivitas sensorik terstruktur.', price: 320000, emoji: '🎨', badge: 'Baru', badgeBg: '#d8eef7', category: 'Sensorik', sold: 156, rating: 4.7 },
  { id: 3, name: 'Activity Kit — Advanced', desc: 'Paket lengkap terapi bermain 60 hari dengan panduan GPK bersertifikat (60 halaman + video tutorial).', price: 480000, emoji: '🏆', badge: 'Premium', badgeBg: '#fff8ec', category: 'Paket', sold: 214, rating: 5.0 },
  { id: 4, name: 'PECS Starter Pack', desc: 'Kartu komunikasi visual PECS 120 gambar, ring binder, dan velcro. Termasuk panduan penggunaan Bahasa Indonesia.', price: 195000, emoji: '🗂️', badge: 'Rekomendasi GPK', badgeBg: '#f0e8ff', category: 'Alat Terapi', sold: 423, rating: 4.9 },
  { id: 5, name: 'Buku Panduan Orang Tua Autisme', desc: 'Panduan praktis 200 halaman ditulis oleh tim psikolog & GPK Questoria. Termasuk checklist perkembangan.', price: 120000, emoji: '📖', badge: 'Best Seller', badgeBg: '#dff3f9', category: 'Buku', sold: 1240, rating: 4.8 },
]

// ─── STORE ────────────────────────────────────────────────────────────────────
function StoreScreen({ onBack, onOrder }: { onBack: () => void; onOrder: (id: number) => void }) {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const categories = ['Semua', 'Buku', 'Alat Terapi', 'Sensorik', 'Paket']
  const catEmojis: Record<string, string> = { Semua: '🛍️', Buku: '📚', 'Alat Terapi': '🧩', Sensorik: '🎨', Paket: '🎁' }
  const badgeColors: Record<string, string> = { Personalisasi: C.purple, Terlaris: C.primary, Baru: C.teal, Premium: '#c47800', 'Rekomendasi GPK': C.purple, 'Best Seller': C.primary }

  const filtered = STORE_PRODUCTS.filter((p) => activeCategory === 'Semua' || p.category === activeCategory)

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
      {/* Fixed header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-3 flex items-center justify-between" style={{ backgroundColor: C.bg }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}`, color: C.deep, fontSize: 18 }}>←</button>
          <h2 className="font-black text-xl" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>🛒 Toko Questoria</h2>
        </div>
        <button className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}`, color: C.deep, fontSize: 20 }}>🔍</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Promo banner — fully inline, no overflow-hidden clipping */}
        <div className="mx-5 mb-4 rounded-3xl p-5" style={{ background: 'linear-gradient(135deg, #111c28 0%, #1a2c44 100%)' }}>
          <p className="text-xs font-bold mb-1" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: 1.5, fontFamily: 'Nunito, sans-serif' }}>✦ PROMO AGUSTUS 2026</p>
          <p className="font-black text-2xl text-white mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Gratis Ongkir! 🎁</p>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>Berlaku s.d 31 Agustus untuk semua produk</p>
          <div className="flex gap-2">
            {[{ val: '4.8★', label: 'Rating' }, { val: '1.2k+', label: 'Terjual' }, { val: '24 jam', label: 'Pengiriman' }].map((s) => (
              <div key={s.label} className="flex-1 text-center py-2.5 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-black text-white" style={{ fontFamily: 'Nunito, sans-serif', fontSize: 14 }}>{s.val}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 px-5 mb-3">
          {categories.map((c) => (
            <button key={c} className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold min-h-[36px] active:scale-95" style={{ backgroundColor: activeCategory === c ? C.hero : C.card, color: activeCategory === c ? C.white : C.mutedText, border: `1.5px solid ${activeCategory === c ? C.hero : C.border}`, fontFamily: 'Nunito, sans-serif' }} onClick={() => setActiveCategory(c)}>
              <span>{catEmojis[c]}</span>{c}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="px-5 pb-6 flex flex-col gap-3">
          {filtered.map((p) => (
            <div key={p.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }}>
              <div className="flex gap-4 p-4">
                <div className="rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ width: 72, height: 72, backgroundColor: p.badgeBg }}>{p.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: (badgeColors[p.badge] || C.primary) + '18', color: badgeColors[p.badge] || C.primary, fontFamily: 'Nunito, sans-serif' }}>{p.badge}</span>
                  </div>
                  <p className="font-black text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>{p.name}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: C.mutedText }}>{p.desc}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Stars n={Math.round(p.rating)} size={11} />
                    <span className="text-xs" style={{ color: C.mutedText }}>{p.rating} · {p.sold.toLocaleString()} terjual</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 pb-4 pt-0">
                <p className="font-black text-lg" style={{ fontFamily: 'Nunito, sans-serif', color: C.primary }}>Rp {p.price.toLocaleString('id-ID')}</p>
                <button className="px-5 py-2.5 min-h-[42px] rounded-xl text-sm font-black text-white active:scale-95" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 12px rgba(240,147,52,0.3)' }} onClick={() => onOrder(p.id)}>Pesan →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── PAYMENT (Xendit-style) ───────────────────────────────────────────────────
function QrisCode() {
  /* High-contrast, clean standard QRIS pattern design */
  const cells: boolean[][] = [
    [1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,1,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,1,0,0,0,1,1,1,1,0,1,1,0,1,0,1,1],
    [0,1,0,0,1,0,0,0,1,1,1,1,0,0,0,1,1,0,0,1,0,1,0,0],
    [1,0,1,1,0,1,1,0,0,1,0,0,1,1,0,0,1,1,0,0,1,1,0,1],
    [1,1,0,0,1,0,1,1,0,0,1,0,0,1,1,0,0,1,1,1,0,0,1,0],
    [0,0,1,1,0,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1,1,0,0,1],
    [1,0,1,0,1,0,1,1,0,0,1,1,0,1,1,0,0,1,0,1,0,1,1,0],
    [0,1,0,1,1,0,0,1,1,1,0,0,1,0,0,1,1,0,1,0,1,0,0,1],
    [1,1,1,0,0,1,1,0,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,0],
    [0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,1,0,0,1,0,1,0,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1,0,0,1,1,0,1,0,1,1,0],
    [1,0,0,0,0,0,1,0,1,1,1,0,1,1,1,0,0,0,1,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,1,1,1,0,1,0,1,1,0],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,0,0,1,0,0,1,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,1,0,0,1,1,0,1,1,1,1,0],
    [1,0,0,0,0,0,1,0,1,1,1,0,0,1,1,1,0,1,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,1,1,0,0,1,1,0,1,1,0,1,1,1]
  ].map(row => row.map(cell => Boolean(cell)))

  return (
    <svg viewBox="0 0 240 240" className="w-[180px] h-[180px] flex-shrink-0" style={{ shapeRendering: 'crispEdges', minWidth: 180, minHeight: 180 }}>
      <rect width="240" height="240" fill="white" />
      {/* Grid Pattern */}
      {cells.map((row, r) => row.map((on, c) => {
        // Skip area for center logo overlay
        if (r >= 9 && r <= 14 && c >= 9 && c <= 14) return null
        return on ? <rect key={`${r}-${c}`} x={c * 10} y={r * 10} width="10" height="10" fill="#000000" /> : null
      }))}
      {/* Red QRIS Center Overlay Box */}
      <rect x="88" y="88" width="64" height="64" rx="8" fill="#e62e37" stroke="white" strokeWidth="4" />
      <text x="120" y="128" textAnchor="middle" fontSize="22" fill="white" fontWeight="900" fontFamily="Nunito, sans-serif">QRIS</text>
    </svg>
  )
}

function PaymentScreen({ productId, onBack, onSuccess }: { productId: number; onBack: () => void; onSuccess: () => void }) {
  const product = STORE_PRODUCTS[productId] || STORE_PRODUCTS[0]
  const [step, setStep] = useState<'qris' | 'processing' | 'done'>('qris')
  const [countdown, setCountdown] = useState(300)

  useEffect(() => {
    if (step !== 'qris') return
    const t = setInterval(() => setCountdown(v => v > 0 ? v - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [step])

  const mm = String(Math.floor(countdown / 60)).padStart(2, '0')
  const ss = String(countdown % 60).padStart(2, '0')

  if (step === 'processing') {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-5 px-8 text-center" style={{ backgroundColor: C.bg }}>
        <div className="rounded-full flex items-center justify-center" style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #e62e37, #b91c1c)', fontSize: 38 }}>📱</div>
        <div>
          <p className="font-black text-2xl mb-2" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Memeriksa Pembayaran...</p>
          <p className="text-sm" style={{ color: C.mutedText }}>Konfirmasi dari bank sedang diproses</p>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => <div key={i} className="typing-dot rounded-full" style={{ width: 10, height: 10, backgroundColor: '#e62e37', animationDelay: `${i * 0.2}s` }} />)}
        </div>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-5 px-8 text-center" style={{ backgroundColor: C.bg }}>
        <div className="rounded-full flex items-center justify-center" style={{ width: 90, height: 90, background: 'linear-gradient(135deg, #4ade80, #16a34a)', fontSize: 44 }}>✓</div>
        <div>
          <p className="font-black text-2xl mb-2" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Pembayaran Berhasil! 🎉</p>
          <p className="text-sm leading-relaxed" style={{ color: C.mutedText }}>Pesanan dikonfirmasi. Barang dikirim dalam 24 jam.</p>
        </div>
        <div className="rounded-2xl p-4 w-full" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }}>
          <div className="flex gap-3 items-center">
            <div className="rounded-xl flex items-center justify-center" style={{ width: 46, height: 46, backgroundColor: STORE_PRODUCTS[productId]?.badgeBg || C.muted, fontSize: 24 }}>{product.emoji}</div>
            <div className="text-left">
              <p className="font-bold text-sm" style={{ color: C.deep, fontFamily: 'Nunito, sans-serif' }}>{product.name}</p>
              <p className="text-xs mt-0.5" style={{ color: C.primary, fontWeight: 800, fontFamily: 'Nunito, sans-serif' }}>Rp {product.price.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
        <button className="w-full py-4 rounded-2xl font-black text-white min-h-[54px] active:scale-95" style={{ backgroundColor: C.hero, fontFamily: 'Nunito, sans-serif' }} onClick={onSuccess}>Kembali ke Toko 🛒</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-4 flex items-center gap-3" style={{ backgroundColor: C.card, borderBottom: `1.5px solid ${C.border}` }}>
        <button onClick={onBack} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl" style={{ backgroundColor: C.muted, color: C.deep, fontSize: 18 }}>←</button>
        <div className="flex-1">
          <p className="font-black text-xl" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Pembayaran QRIS</p>
          <p className="text-xs" style={{ color: C.mutedText }}>Scan dengan semua aplikasi e-wallet</p>
        </div>
        <div className="rounded-xl px-2.5 py-1.5" style={{ backgroundColor: '#fff0f0', border: '1.5px solid #fca5a5' }}>
          <p className="font-black text-xs" style={{ color: '#e62e37', fontFamily: 'Nunito, sans-serif' }}>⏱ {mm}:{ss}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3.5 w-full max-w-lg mx-auto">
        {/* Order card */}
        <div className="rounded-2xl p-3.5 flex gap-3 items-center flex-shrink-0" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }}>
          <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 48, height: 48, backgroundColor: product.badgeBg, fontSize: 24 }}>{product.emoji}</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate" style={{ color: C.deep, fontFamily: 'Nunito, sans-serif' }}>{product.name}</p>
            <p className="text-xs mt-0.5 truncate" style={{ color: C.mutedText }}>Promo Agustus · Gratis ongkir</p>
          </div>
          <p className="font-black text-sm flex-shrink-0" style={{ color: C.primary, fontFamily: 'Nunito, sans-serif' }}>Rp {product.price.toLocaleString('id-ID')}</p>
        </div>

        {/* QRIS card */}
        <div className="rounded-3xl overflow-hidden flex-shrink-0 flex flex-col" style={{ backgroundColor: C.card, border: `2px solid ${C.border}` }}>
          {/* QRIS Header band */}
          <div className="px-4 py-2.5 flex items-center justify-between flex-shrink-0" style={{ background: 'linear-gradient(135deg, #e62e37, #b91c1c)' }}>
            <div>
              <p className="font-black text-white text-base leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>QRIS</p>
              <p className="text-[11px] text-white opacity-85 leading-tight">Quick Response Code Indonesian Standard</p>
            </div>
            <div className="rounded-xl px-2.5 py-1 flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <p className="text-[11px] font-black text-white">Semua Bank</p>
            </div>
          </div>
          {/* QR code */}
          <div className="flex flex-col items-center py-4 px-4 flex-shrink-0">
            <p className="text-xs font-bold mb-3 text-center" style={{ color: C.mutedText }}>Scan QR ini dengan aplikasi bank atau e-wallet Anda</p>
            <div className="rounded-2xl p-3 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#fff', border: `2px solid ${C.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <QrisCode />
            </div>
            <div className="mt-3 px-4 py-2 rounded-xl text-center flex-shrink-0 w-full max-w-[220px]" style={{ backgroundColor: C.primaryLight, border: `1.5px solid ${C.primary}30` }}>
              <p className="font-black text-lg" style={{ color: C.primary, fontFamily: 'Nunito, sans-serif' }}>Rp {product.price.toLocaleString('id-ID')}</p>
              <p className="text-[11px]" style={{ color: C.mutedText }}>Total yang harus dibayar</p>
            </div>
            <p className="text-xs text-center mt-2 flex-shrink-0" style={{ color: C.mutedText }}>Merchant: <strong style={{ color: C.deep }}>Questoria Platform</strong></p>
          </div>
          {/* Supported wallets */}
          <div className="px-4 pb-4 flex-shrink-0">
            <p className="text-[11px] font-bold mb-2" style={{ color: C.mutedText, letterSpacing: 0.4 }}>DIDUKUNG OLEH</p>
            <div className="flex flex-wrap gap-1.5">
              {['GoPay', 'OVO', 'Dana', 'ShopeePay', 'BCA', 'BRI', 'BNI', 'Mandiri', 'LinkAja'].map(w => (
                <span key={w} className="px-2 py-0.5 rounded-lg text-[11px] font-semibold" style={{ backgroundColor: C.muted, color: C.deep }}>{w}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl flex-shrink-0 mb-2" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <span style={{ fontSize: 16 }}>🔐</span>
          <p className="text-[11px] leading-relaxed" style={{ color: '#15803d', fontFamily: 'Inter, sans-serif' }}>Transaksi diproses aman oleh <strong>Bank Indonesia</strong> melalui sistem QRIS nasional.</p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0 px-5 py-4 flex flex-col gap-2.5" style={{ borderTop: `1.5px solid ${C.border}`, backgroundColor: C.card }}>
        <button
          className="w-full py-4 rounded-2xl font-black text-white text-base min-h-[54px] active:scale-95"
          style={{ background: 'linear-gradient(135deg, #e62e37, #b91c1c)', fontFamily: 'Nunito, sans-serif', boxShadow: '0 6px 20px rgba(230,46,55,0.35)' }}
          onClick={() => { setStep('processing'); setTimeout(() => setStep('done'), 2200) }}
        >
          Sudah Bayar ✓
        </button>
        <button className="w-full py-2.5 text-sm font-bold" style={{ color: C.mutedText }} onClick={onBack}>Bayar Nanti</button>
      </div>
    </div>
  )
}

// ─── GPK PROFILE ─────────────────────────────────────────────────────────────
type GpkPanel = 'sertifikasi' | 'penghasilan' | 'ketersediaan' | 'notifikasi' | 'privasi' | 'faq' | null

function GpkProfileScreen({ onBack, onNav }: { onBack: () => void; onNav: (s: Screen) => void }) {
  const [panel, setPanel] = useState<GpkPanel>(null)
  const [notifSesi, setNotifSesi] = useState(true)
  const [notifPesan, setNotifPesan] = useState(true)
  const [notifEmail, setNotifEmail] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)

  const Toggle = ({ on, change }: { on: boolean; change: () => void }) => (
    <button onClick={change} style={{ width: 46, height: 26, borderRadius: 99, backgroundColor: on ? C.purple : '#cbd5e1', padding: 3, flexShrink: 0 }}>
      <span className="block rounded-full bg-white shadow-sm" style={{ width: 20, height: 20, transform: on ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
    </button>
  )

  const menuItems = [
    { key: 'sertifikasi' as GpkPanel, emoji: '🎓', label: 'Sertifikasi & Keahlian', sub: 'Kelola sertifikat dan spesialisasi Anda', bg: C.purpleLight, color: C.purple },
    { key: 'penghasilan' as GpkPanel, emoji: '💰', label: 'Penghasilan & Pembayaran', sub: 'Riwayat transaksi dan pencairan dana', bg: '#fff7e6', color: C.primaryDark },
    { key: 'ketersediaan' as GpkPanel, emoji: '📅', label: 'Atur Ketersediaan', sub: 'Jadwal sesi yang tersedia', bg: '#e8f7f0', color: '#15803d' },
    { key: 'notifikasi' as GpkPanel, emoji: '🔔', label: 'Notifikasi', sub: 'Kelola pemberitahuan aktivitas', bg: '#fef9c3', color: '#92400e' },
    { key: 'privasi' as GpkPanel, emoji: '🛡️', label: 'Privasi & Keamanan', sub: 'Kata sandi dan pengaturan akun', bg: C.infoLight, color: C.teal },
    { key: 'faq' as GpkPanel, emoji: '❓', label: 'Bantuan & FAQ', sub: 'Pertanyaan umum dan dukungan', bg: C.muted, color: C.mutedText },
  ]

  const PanelContent = () => {
    if (panel === 'sertifikasi') return (
      <>
        <h2 className="font-black text-xl mb-1" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Sertifikasi & Keahlian</h2>
        <p className="text-xs mb-4" style={{ color: C.mutedText }}>Sertifikat Anda yang terverifikasi di Questoria</p>
        {[
          { name: 'Applied Behavior Analysis (ABA)', issuer: 'ABAI – 2021', verified: true },
          { name: 'Speech & Language Therapy Basic', issuer: 'RS Siloam – 2020', verified: true },
          { name: 'Pendidikan Luar Biasa (PLB)', issuer: 'UNJ – 2018', verified: true },
          { name: 'Terapi Okupasi Dasar', issuer: 'RSCM – 2022', verified: false },
        ].map((c, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-2xl mb-2.5" style={{ backgroundColor: C.bg, border: `1.5px solid ${C.border}` }}>
            <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, backgroundColor: c.verified ? C.purpleLight : C.muted, fontSize: 20 }}>🎓</div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: C.deep, fontFamily: 'Nunito, sans-serif' }}>{c.name}</p>
              <p className="text-xs mt-0.5" style={{ color: C.mutedText }}>{c.issuer}</p>
            </div>
            <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: c.verified ? C.purpleLight : C.muted, color: c.verified ? C.purple : C.mutedText }}>{c.verified ? '✓ Terverifikasi' : 'Proses'}</span>
          </div>
        ))}
        <button className="w-full mt-2 py-3 rounded-2xl font-black text-sm min-h-[46px]" style={{ backgroundColor: C.purple, color: '#fff', fontFamily: 'Nunito, sans-serif' }}>+ Tambah Sertifikat</button>
      </>
    )
    if (panel === 'penghasilan') return (
      <>
        <h2 className="font-black text-xl mb-1" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Penghasilan & Pembayaran</h2>
        <p className="text-xs mb-4" style={{ color: C.mutedText }}>Ringkasan pendapatan bulan ini</p>
        <div className="rounded-2xl p-4 mb-4" style={{ background: `linear-gradient(135deg, ${C.purple}, #5d3ea8)` }}>
          <p className="text-xs text-white opacity-70 mb-1">Total Agustus 2026</p>
          <p className="font-black text-3xl text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>Rp 3.600.000</p>
          <p className="text-xs text-white opacity-60 mt-1">12 sesi selesai</p>
        </div>
        {[['Rafi A. – Sesi ABA', 'Rp 300.000', '2 Agt'], ['Sinta M. – Terapi Motorik', 'Rp 300.000', '4 Agt'], ['Dimas K. – Komunikasi', 'Rp 300.000', '6 Agt']].map(([name, amt, date], i) => (
          <div key={i} className="flex items-center gap-3 py-3 px-1" style={{ borderBottom: `1px solid ${C.border}` }}>
            <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 38, height: 38, backgroundColor: C.purpleLight, fontSize: 18 }}>💳</div>
            <div className="flex-1"><p className="font-bold text-sm" style={{ color: C.deep, fontFamily: 'Nunito, sans-serif' }}>{name}</p><p className="text-xs" style={{ color: C.mutedText }}>{date}</p></div>
            <p className="font-black text-sm" style={{ color: C.primary, fontFamily: 'Nunito, sans-serif' }}>{amt}</p>
          </div>
        ))}
        <button className="w-full mt-4 py-3 rounded-2xl font-black text-sm min-h-[46px]" style={{ backgroundColor: C.purple, color: '#fff', fontFamily: 'Nunito, sans-serif' }}>Ajukan Pencairan Dana</button>
      </>
    )
    if (panel === 'ketersediaan') return (
      <>
        <h2 className="font-black text-xl mb-1" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Atur Ketersediaan</h2>
        <p className="text-xs mb-4" style={{ color: C.mutedText }}>Tentukan jadwal sesi yang bisa Anda terima</p>
        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day, i) => {
          const slots = i < 4 ? ['08:00–10:00', '13:00–15:00'] : i === 4 ? ['08:00–10:00'] : []
          return (
            <div key={day} className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
              <p className="font-bold text-sm w-16 flex-shrink-0" style={{ color: C.deep, fontFamily: 'Nunito, sans-serif' }}>{day}</p>
              <div className="flex-1 flex flex-wrap gap-1.5">
                {slots.length > 0 ? slots.map(s => <span key={s} className="text-xs px-2.5 py-1 rounded-lg font-bold" style={{ backgroundColor: C.purpleLight, color: C.purple }}>{s}</span>) : <span className="text-xs" style={{ color: C.mutedText }}>Libur</span>}
              </div>
              <button className="text-xs font-bold min-h-[34px] px-2" style={{ color: C.purple }}>Edit</button>
            </div>
          )
        })}
      </>
    )
    if (panel === 'notifikasi') return (
      <>
        <h2 className="font-black text-xl mb-4" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Notifikasi</h2>
        {[
          { icon: '📅', label: 'Pengingat sesi', sub: '30 menit sebelum sesi dimulai', on: notifSesi, toggle: () => setNotifSesi(v => !v) },
          { icon: '💬', label: 'Pesan baru', sub: 'Notifikasi dari orang tua & anak', on: notifPesan, toggle: () => setNotifPesan(v => !v) },
          { icon: '✉️', label: 'Ringkasan email', sub: 'Laporan mingguan via email', on: notifEmail, toggle: () => setNotifEmail(v => !v) },
        ].map((n, i) => (
          <div key={i} className="flex items-center gap-3 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}>
            <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, backgroundColor: C.muted, fontSize: 18 }}>{n.icon}</div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: C.deep, fontFamily: 'Nunito, sans-serif' }}>{n.label}</p>
              <p className="text-xs" style={{ color: C.mutedText }}>{n.sub}</p>
            </div>
            <Toggle on={n.on} change={n.toggle} />
          </div>
        ))}
      </>
    )
    if (panel === 'privasi') return (
      <>
        <h2 className="font-black text-xl mb-4" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Privasi & Keamanan</h2>
        {[
          { icon: '🔐', label: 'Ubah Kata Sandi', sub: 'Perbarui kata sandi akun Anda' },
          { icon: '📱', label: 'Verifikasi 2 Langkah', sub: 'Aktifkan OTP untuk login' },
          { icon: '🔒', label: 'Kebijakan Privasi', sub: 'Cara kami melindungi data Anda' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-3.5 cursor-pointer" style={{ borderBottom: `1px solid ${C.border}` }}>
            <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, backgroundColor: C.infoLight, fontSize: 18 }}>{item.icon}</div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: C.deep, fontFamily: 'Nunito, sans-serif' }}>{item.label}</p>
              <p className="text-xs" style={{ color: C.mutedText }}>{item.sub}</p>
            </div>
            <span style={{ color: C.mutedText }}>›</span>
          </div>
        ))}
      </>
    )
    if (panel === 'faq') return (
      <>
        <h2 className="font-black text-xl mb-4" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Bantuan & FAQ</h2>
        {[
          { q: 'Bagaimana cara mengatur jadwal sesi?', a: 'Buka menu Atur Ketersediaan di halaman profil dan pilih slot waktu yang tersedia.' },
          { q: 'Kapan dana sesi bisa dicairkan?', a: 'Pencairan dana tersedia setiap Jumat untuk sesi yang sudah selesai dan dikonfirmasi.' },
          { q: 'Bagaimana jika orang tua membatalkan sesi?', a: 'Pembatalan < 2 jam akan dikenakan biaya 50%. Hubungi support jika ada sengketa.' },
        ].map((f, i) => (
          <div key={i} className="mb-3 rounded-2xl p-4" style={{ backgroundColor: C.bg, border: `1.5px solid ${C.border}` }}>
            <p className="font-bold text-sm mb-1.5" style={{ color: C.deep, fontFamily: 'Nunito, sans-serif' }}>❓ {f.q}</p>
            <p className="text-xs leading-relaxed" style={{ color: C.mutedText }}>{f.a}</p>
          </div>
        ))}
        <button className="w-full mt-2 py-3 rounded-2xl font-black text-sm min-h-[46px]" style={{ backgroundColor: C.hero, color: '#fff', fontFamily: 'Nunito, sans-serif' }}>💬 Hubungi Support</button>
      </>
    )
    return null
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
      {/* Header hero */}
      <div className="flex-shrink-0 px-4 pt-4 pb-0">
        <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${C.hero} 0%, #1a2a40 100%)` }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', backgroundColor: C.purple, opacity: 0.15 }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 90, height: 90, borderRadius: '50%', backgroundColor: C.teal, opacity: 0.08 }} />
          {/* back */}
          <button onClick={onBack} className="flex items-center gap-1.5 mb-4 text-sm font-bold relative z-10" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Nunito, sans-serif' }}>← Kembali</button>
          <div className="flex items-center gap-3 relative z-10">
            <div className="rounded-2xl flex items-center justify-center" style={{ width: 68, height: 68, backgroundColor: 'rgba(255,255,255,0.12)', fontSize: 34, flexShrink: 0 }}>👩‍🏫</div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white text-lg leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>Sari Wulandari, S.Pd</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Guru Pendamping Khusus</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Stars n={5} size={11} />
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>4.9 · 128 ulasan</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(26,145,176,0.3)', color: '#7de8ff' }}>● Aktif</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 relative z-10">
            {[{ val: '3', label: 'Anak Aktif' }, { val: '8 th', label: 'Pengalaman' }, { val: '127', label: 'Sesi' }].map((s) => (
              <div key={s.label} className="text-center py-2.5 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-black text-white" style={{ fontFamily: 'Nunito, sans-serif', fontSize: 17 }}>{s.val}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 px-4 pt-4 flex-shrink-0">
        <button className="flex-1 py-3 min-h-[48px] rounded-2xl font-black text-sm text-white" style={{ background: `linear-gradient(135deg, ${C.hero}, #1a2a40)`, fontFamily: 'Nunito, sans-serif' }}>Edit Profil</button>
        <button className="flex-1 py-3 min-h-[48px] rounded-2xl font-bold text-sm" style={{ backgroundColor: C.purpleLight, color: C.purple, fontFamily: 'Nunito, sans-serif', border: `1.5px solid ${C.purple}30` }}>Bagikan</button>
      </div>

      {/* Menu list */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-2.5">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left active:scale-[0.98]"
            style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }}
            onClick={() => setPanel(item.key)}
          >
            <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, backgroundColor: item.bg, fontSize: 20 }}>{item.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm" style={{ color: C.deep, fontFamily: 'Nunito, sans-serif' }}>{item.label}</p>
              <p className="text-xs truncate" style={{ color: C.mutedText }}>{item.sub}</p>
            </div>
            <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 28, height: 28, backgroundColor: item.bg }}>
              <span style={{ color: item.color, fontSize: 14 }}>›</span>
            </div>
          </button>
        ))}
        <button className="w-full py-3.5 rounded-2xl font-bold text-sm active:scale-95 min-h-[48px] mt-1" style={{ backgroundColor: '#fce8e8', color: C.red, fontFamily: 'Nunito, sans-serif', border: `1.5px solid #fca5a5` }} onClick={() => setConfirmLogout(true)}>
          🚪 Keluar dari Akun
        </button>
      </div>

      <BottomNav active="gpk-profile" role="gpk" onNav={onNav} />

      {/* Sub-panel sheet */}
      {panel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(17,28,40,0.45)' }} onClick={() => setPanel(null)}>
          <div className="w-full max-w-lg rounded-t-[28px] flex flex-col" style={{ backgroundColor: C.card, maxHeight: '85vh' }} onClick={e => e.stopPropagation()}>
            <div className="flex-shrink-0 flex items-center justify-between px-5 pt-4 pb-2">
              <div className="w-10 h-1 rounded-full mx-auto" style={{ backgroundColor: C.border }} />
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              <PanelContent />
            </div>
          </div>
        </div>
      )}

      {/* Logout confirm */}
      {confirmLogout && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(17,28,40,0.45)' }}>
          <div className="w-full max-w-lg rounded-t-[28px] p-5" style={{ backgroundColor: C.card }}>
            <div className="text-3xl mb-3">👋</div>
            <h2 className="font-black text-xl mb-1" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Keluar dari akun?</h2>
            <p className="text-sm mb-5" style={{ color: C.mutedText }}>Anda dapat masuk kembali kapan saja.</p>
            <div className="flex gap-3">
              <button className="flex-1 min-h-[48px] rounded-2xl font-bold text-sm" style={{ backgroundColor: C.muted, color: C.deep }} onClick={() => setConfirmLogout(false)}>Tetap</button>
              <button className="flex-1 min-h-[48px] rounded-2xl font-black text-white text-sm" style={{ backgroundColor: C.red }} onClick={() => setConfirmLogout(false)}>Keluar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── AI ASSISTANT ─────────────────────────────────────────────────────────────
function AiAssistantScreen({ onBack, onNav, role: userRole }: { onBack: () => void; onNav: (s: Screen) => void; role?: Role }) {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [model, setModel] = useState<'v1' | 'v2'>('v1')
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; time: string }[]>([])
  const chatRef = useRef<HTMLDivElement>(null)
  const showWelcome = messages.length === 0 && !isTyping

  const accent = userRole === 'parent' ? C.primary : userRole === 'child' ? C.teal : C.purple
  const accentLight = userRole === 'parent' ? C.primaryLight : userRole === 'child' ? C.tealLight : C.purpleLight
  const accentDark = userRole === 'parent' ? C.primaryDark : userRole === 'child' ? '#0d5f7a' : '#5a3fa0'
  const userName = userRole === 'parent' ? 'Bu Sari' : userRole === 'child' ? 'Rafi' : 'Bu Sari'
  const userEmoji = userRole === 'parent' ? '👩' : userRole === 'child' ? '🧒' : '👩‍🏫'

  const bgGrad = userRole === 'parent'
    ? 'linear-gradient(180deg, #fff7ed 0%, #fffaf5 60%, #ffffff 100%)'
    : userRole === 'child'
    ? 'linear-gradient(180deg, #e0f7fa 0%, #f0fbfd 60%, #ffffff 100%)'
    : 'linear-gradient(180deg, #ede9f8 0%, #f5f3fc 60%, #ffffff 100%)'

  const categories = userRole === 'child'
    ? [
        { emoji: '🎮', title: 'Aktivitas Seru', desc: 'Rekomendasi kegiatan menyenangkan', prompt: 'Aktivitas seru untuk hari ini' },
        { emoji: '📖', title: 'Cerita Hari Ini', desc: 'Cerita pendek yang menyenangkan', prompt: 'Bacakan cerita pendek untuk saya' },
        { emoji: '🎨', title: 'Kreasi & Seni', desc: 'Ide proyek seni kreatif', prompt: 'Ide proyek seni kreatif' },
        { emoji: '🌟', title: 'Pujian Harian', desc: 'Afirmasi positif untukku', prompt: 'Berikan pujian dan semangat untukku' },
      ]
    : userRole === 'parent'
    ? [
        { emoji: '📊', title: 'Analitik Anak', desc: 'Ringkasan perkembangan si kecil', prompt: '📊 Laporan perkembangan anak bulan ini' },
        { emoji: '🤝', title: 'Tips Pendampingan', desc: 'Cara mendukung anak di rumah', prompt: 'Tips mendampingi anak autisme di rumah' },
        { emoji: '📅', title: 'Jadwal Terapi', desc: 'Rencana kegiatan mingguan', prompt: 'Buat jadwal kegiatan mingguan untuk anak' },
        { emoji: '💬', title: 'Komunikasi Anak', desc: 'Strategi komunikasi efektif', prompt: 'Strategi komunikasi dengan anak non-verbal' },
      ]
    : [
        { emoji: '🎯', title: 'Rencana Sesi', desc: 'Buat rencana terapi & aktivitas', prompt: '📝 Rencana Sesi' },
        { emoji: '📚', title: 'Materi Belajar', desc: 'Susun materi belajar personal', prompt: 'Materi komunikasi visual non-verbal' },
        { emoji: '🧩', title: 'Aktivitas Motorik', desc: 'Rekomendasi sesuai usia anak', prompt: 'Aktivitas motorik untuk Rafi (8 th)' },
        { emoji: '✍️', title: 'Laporan Kemajuan', desc: 'Buat laporan perkembangan', prompt: '📊 Laporan perkembangan anak bulan ini' },
      ]

  const aiReplies: Record<string, string> = {
    '📝 Rencana Sesi': 'Rencana sesi terapi hari ini:\n\n🕘 08:00–08:20 — Pemanasan: aktivitas motorik kasar\n🕘 08:20–08:45 — Terapi ABA: latihan kontak mata\n🕘 08:45–09:00 — Istirahat sensorik: pasir kinetik\n🕘 09:00–09:20 — Komunikasi: PECS kartu pilihan\n\nSesuaikan durasi dengan kondisi anak hari ini. ✅',
    'Materi komunikasi visual non-verbal': 'Materi komunikasi visual untuk anak non-verbal:\n\n📸 Kartu gambar rutinitas harian (10 kartu dasar)\n🔄 Choice Board: makan, minum, istirahat, main\n🎯 PECS Phase 1: minta item favorit\n\nMulai dengan 5 simbol dasar, tingkatkan setelah 2 minggu.',
    'Aktivitas motorik untuk Rafi (8 th)': '3 aktivitas motorik untuk Rafi (8 th):\n\n1. 🎯 Lempar bola ke keranjang (1m) — koordinasi mata-tangan\n2. ✂️ Menggunting pola bergambar — motorik halus\n3. 🧱 Menyusun balok 10 tingkat — konsentrasi\n\nSetiap 15 menit, 2× sehari.',
    '📊 Laporan perkembangan anak bulan ini': 'Laporan Perkembangan Agustus 2026:\n\n📈 Komunikasi: +35% (12 → 16 kata fungsional)\n🤝 Interaksi sosial: mau antri 3 menit\n🎯 Fokus: sesi 20 menit tanpa distraksi\n\n✅ Target bulan depan:\n— 20 kata fungsional\n— Bermain bersama 2 teman\n\nPerkembangan sangat baik! 🌟',
    'Aktivitas seru untuk hari ini': 'Hei! Ini aktivitas seru untukmu hari ini! 🎉\n\n🎨 1. Lukis dengan jari — gunakan cat warna-warni\n🎵 2. Tari sambil dengarkan musik favoritmu\n🧩 3. Puzzle 24 kepingan — tantangan baru!\n\nPilih yang paling kamu suka ya! 😄',
    'Bacakan cerita pendek untuk saya': 'Dahulu kala, ada seekor kupu-kupu kecil bernama Kiki. 🦋\n\nKiki tidak bisa terbang jauh seperti teman-temannya. Tapi Kiki selalu mencoba setiap hari, sedikit demi sedikit.\n\nSuatu hari, Kiki berhasil terbang ke bunga mawar yang indah! Semua teman bersorak gembira.\n\n🌟 Pesan: Setiap usaha kecil penting. Kamu hebat!',
    'Ide proyek seni kreatif': 'Proyek seni seru untukmu! 🎨\n\n⭐ Mozaik kertas warna — potong dan tempel\n🌈 Lukis pelangi dengan kapas\n🦁 Topeng hewan dari kertas karton\n\nMinta bantuan orang tua untuk gunting ya!',
    'Berikan pujian dan semangat untukku': '🌟 Kamu luar biasa hari ini!\n\nSemua hal yang kamu coba, sekecil apapun, itu sangat berarti. Kamu terus berkembang setiap hari! 💪\n\n"Kamu bisa melakukan hal-hal hebat. Satu langkah kecil setiap hari = kemajuan besar!"\n\nQuestoria bangga padamu! 🏆',
  }

  function nowTime() {
    const d = new Date()
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  function sendMessage(text: string) {
    if (!text.trim() || isTyping) return
    setMessages((prev) => [...prev, { role: 'user', text, time: nowTime() }])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const reply = aiReplies[text] || `Baik! Untuk "${text}", saya merekomendasikan:\n\n📋 Langkah 1: Identifikasi kebutuhan spesifik\n📋 Langkah 2: Buat jadwal konsisten 3× seminggu\n📋 Langkah 3: Dokumentasi progres setiap sesi\n\nSemangat! 💪`
      setMessages((prev) => [...prev, { role: 'ai', text: reply, time: nowTime() }])
    }, 1600)
    setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight }, 100)
  }

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, isTyping])

  return (
    <div className="flex flex-col h-full" style={{ background: bgGrad }}>
      {/* Top bar */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3" style={{ backgroundColor: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(0,0,0,0.06)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, backgroundColor: C.muted, color: C.deep, fontSize: 16 }}>←</button>
          {/* AI avatar */}
          <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, background: `linear-gradient(135deg, ${accent}, ${accentDark})`, fontSize: 20 }}>🤖</div>
          <div className="flex-1">
            <p className="font-black text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Questoria AI</p>
            <div className="flex items-center gap-1.5">
              <div className="rounded-full" style={{ width: 6, height: 6, backgroundColor: '#4ade80' }} />
              <p className="text-xs" style={{ color: C.mutedText }}>Aktif sekarang</p>
            </div>
          </div>
          {/* Model toggle */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-2xl" style={{ backgroundColor: C.muted }}>
            {(['v1', 'v2'] as const).map((v) => (
              <button key={v} className="px-3 py-1.5 rounded-xl text-xs font-black" style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: model === v ? accent : 'transparent', color: model === v ? '#fff' : C.mutedText }} onClick={() => setModel(v)}>
                {v === 'v1' ? 'v1' : <span>v2 <span style={{ backgroundColor: accent, color: 'white', fontSize: 8, padding: '1px 4px', borderRadius: 6, opacity: 0.85 }}>Pro</span></span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome / Chat */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4">
        {showWelcome ? (
          <div className="flex flex-col items-center pt-6 pb-4">
            {/* AI glow orb */}
            <div className="rounded-full flex items-center justify-center mb-4" style={{ width: 64, height: 64, background: `linear-gradient(135deg, ${accent}, ${accentDark})`, fontSize: 30, boxShadow: `0 8px 24px ${accent}50` }}>🤖</div>
            <p className="text-sm mb-1 font-semibold" style={{ color: accent, fontFamily: 'Inter, sans-serif' }}>Halo, {userName}!</p>
            <h1 className="font-black text-xl text-center leading-snug mb-6" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep, maxWidth: 260 }}>Apa yang bisa saya bantu hari ini?</h1>
            <div className="grid grid-cols-2 gap-3 w-full">
              {categories.map((cat, i) => (
                <button key={i} className="text-left p-4 rounded-2xl active:scale-[0.97]" style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1.5px solid ${C.border}` }} onClick={() => sendMessage(cat.prompt)}>
                  <div className="rounded-xl flex items-center justify-center mb-2.5" style={{ width: 40, height: 40, backgroundColor: accentLight, fontSize: 20 }}>{cat.emoji}</div>
                  <p className="font-black text-sm mb-1" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>{cat.title}</p>
                  <p className="text-xs leading-snug" style={{ color: C.mutedText, fontFamily: 'Inter, sans-serif' }}>{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {m.role === 'ai' && <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${accent}, ${accentDark})`, fontSize: 13 }}>🤖</div>}
                <div className="flex flex-col gap-0.5" style={{ maxWidth: '78%', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div className="px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: m.role === 'user' ? accent : '#ffffff', color: m.role === 'user' ? '#fff' : C.deep, border: m.role === 'ai' ? `1px solid ${C.border}` : 'none', fontFamily: 'Inter, sans-serif', borderRadius: 20, borderBottomRightRadius: m.role === 'user' ? 5 : 20, borderBottomLeftRadius: m.role === 'ai' ? 5 : 20, whiteSpace: 'pre-line', boxShadow: m.role === 'user' ? `0 4px 12px ${accent}35` : '0 2px 8px rgba(0,0,0,0.06)' }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: 10, color: '#bbb', marginLeft: m.role === 'ai' ? 4 : 0, marginRight: m.role === 'user' ? 4 : 0 }}>{m.time}{m.role === 'user' ? ' ✓✓' : ''}</span>
                </div>
                {m.role === 'user' && <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 28, height: 28, backgroundColor: accentLight, fontSize: 14 }}>{userEmoji}</div>}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${accent}, ${accentDark})`, fontSize: 13 }}>🤖</div>
                <div className="px-4 py-3 rounded-2xl" style={{ backgroundColor: '#ffffff', border: `1px solid ${C.border}`, borderBottomLeftRadius: 5 }}>
                  <div className="flex gap-1.5 items-center" style={{ height: 14 }}>
                    {[0, 1, 2].map((j) => <div key={j} className="typing-dot rounded-full" style={{ width: 7, height: 7, backgroundColor: accent, animationDelay: `${j * 0.2}s` }} />)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-4 py-3" style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderTop: '1px solid rgba(0,0,0,0.06)', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center px-4 rounded-2xl min-h-[46px]" style={{ backgroundColor: C.muted, border: `1.5px solid ${C.border}` }}>
            <input className="flex-1 bg-transparent outline-none text-sm min-w-0" placeholder="Ketik pesan..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)} style={{ color: C.deep, fontFamily: 'Inter, sans-serif' }} />
          </div>
          <button
            className="rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ width: 46, height: 46, background: input.trim() ? `linear-gradient(135deg, ${accent}, ${accentDark})` : C.muted, color: input.trim() ? '#fff' : C.mutedText, fontSize: 18, boxShadow: input.trim() ? `0 4px 14px ${accent}45` : 'none' }}
            onClick={() => sendMessage(input)}
          >
            {input.trim() ? '↑' : '🎤'}
          </button>
        </div>
      </div>

      <BottomNav active="ai-assistant" role="gpk" onNav={onNav} />
    </div>
  )
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
type Profile = { name: string; email: string; bio: string }
function SettingsScreen({ onBack, role, profile, onSaveProfile, onLogout }: { onBack: () => void; role: Role; profile: Profile; onSaveProfile: (p: Profile) => void; onLogout: () => void }) {
  const [notifPush, setNotifPush] = useState(true)
  const [notifEmail, setNotifEmail] = useState(false)
  const [panel, setPanel] = useState<'profile' | 'password' | 'privacy' | null>(null)
  const [draft, setDraft] = useState(profile)
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [notice, setNotice] = useState('')
  const [confirmLogout, setConfirmLogout] = useState(false)
  const accent = role === 'gpk' ? C.purple : role === 'child' ? C.teal : C.primary
  const roleLabel = role === 'gpk' ? 'Guru Pendamping Khusus' : role === 'child' ? 'Siswa / Anak' : 'Orang Tua'
  const openProfile = () => { setDraft(profile); setNotice(''); setPanel('profile') }
  const MenuRow = ({ icon, label, sub, onClick, danger = false }: { icon: string; label: string; sub: string; onClick: () => void; danger?: boolean }) => <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#fffaf1] focus:outline-none focus-visible:ring-2" style={{ borderBottom: `1px solid ${C.border}`, ['--tw-ring-color' as string]: accent }}><div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, backgroundColor: danger ? '#fff0f0' : C.muted, fontSize: 18 }}>{icon}</div><div className="flex-1 min-w-0"><p className="font-bold text-sm" style={{ color: danger ? C.red : C.deep, fontFamily: 'Nunito, sans-serif' }}>{label}</p><p className="text-xs truncate" style={{ color: C.mutedText }}>{sub}</p></div><span aria-hidden style={{ color: C.mutedText, fontSize: 19 }}>›</span></button>
  const Toggle = ({ on, change }: { on: boolean; change: () => void }) => <button aria-label="Ubah pengaturan notifikasi" aria-pressed={on} onClick={change} className="flex-shrink-0 transition-colors" style={{ width: 46, height: 26, borderRadius: 99, backgroundColor: on ? accent : '#cbd5e1', padding: 3 }}><span className="block rounded-full bg-white shadow-sm transition-transform" style={{ width: 20, height: 20, transform: on ? 'translateX(20px)' : 'translateX(0)' }} /></button>
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => <section className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.card, border: `1.5px solid ${C.border}` }}><div className="px-4 py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}><p className="text-[10px] font-black tracking-[.12em]" style={{ color: C.mutedText, fontFamily: 'Inter, sans-serif' }}>{title}</p></div>{children}</section>
  return <div className="flex flex-col h-full" style={{ backgroundColor: C.bg }}>
    <header className="flex-shrink-0 px-4 sm:px-8 py-4" style={{ backgroundColor: C.card, borderBottom: `1.5px solid ${C.border}` }}><div className="max-w-4xl mx-auto flex items-center gap-3"><button aria-label="Kembali" onClick={onBack} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl" style={{ backgroundColor: C.muted, color: C.deep, fontSize: 19 }}>←</button><div><p className="font-black text-xl" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Pengaturan</p><p className="text-xs" style={{ color: C.mutedText }}>{roleLabel}</p></div></div></header>
    <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-5"><div className="max-w-4xl mx-auto grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
      <div className="rounded-3xl p-5 text-white" style={{ backgroundColor: accent }}><div className="flex items-center gap-3"><Avatar emoji={role === 'gpk' ? '👩‍🏫' : role === 'child' ? '🧒' : '👩'} size={56} bg="rgba(255,255,255,.2)" /><div><p className="font-black text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>{profile.name}</p><p className="text-xs opacity-80">{roleLabel}</p></div></div><p className="mt-5 text-sm leading-relaxed opacity-90">{profile.bio || 'Lengkapi profil agar pendampingan terasa lebih personal.'}</p><button onClick={openProfile} className="mt-5 rounded-xl px-4 min-h-[42px] text-sm font-black" style={{ backgroundColor: 'rgba(255,255,255,.94)', color: accent, fontFamily: 'Nunito, sans-serif' }}>Edit profil</button></div>
      <div className="flex flex-col gap-3"><Section title="AKUN"><MenuRow icon="👤" label="Edit Profil" sub="Nama, email, dan deskripsi" onClick={openProfile} /><MenuRow icon="🔐" label="Reset Password" sub="Perbarui kata sandi akun" onClick={() => { setNotice(''); setPanel('password') }} /><MenuRow icon="✉️" label="Email" sub={profile.email} onClick={openProfile} /></Section><Section title="NOTIFIKASI"><div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}><span className="text-lg">🔔</span><div className="flex-1"><p className="font-bold text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Notifikasi aktivitas</p><p className="text-xs" style={{ color: C.mutedText }}>Jadwal dan pembaruan penting</p></div><Toggle on={notifPush} change={() => setNotifPush(!notifPush)} /></div><div className="flex items-center gap-3 px-4 py-3.5"><span className="text-lg">✉️</span><div className="flex-1"><p className="font-bold text-sm" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Ringkasan email</p><p className="text-xs" style={{ color: C.mutedText }}>Laporan perkembangan mingguan</p></div><Toggle on={notifEmail} change={() => setNotifEmail(!notifEmail)} /></div></Section><Section title="PRIVASI & BANTUAN"><MenuRow icon="🔒" label="Kebijakan Privasi" sub="Cara kami melindungi data" onClick={() => setPanel('privacy')} /><MenuRow icon="🚪" label="Keluar dari akun" sub="Kembali ke pilihan peran" onClick={() => setConfirmLogout(true)} danger /></Section></div>
    </div></main>
    {(panel || confirmLogout) && <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5" style={{ backgroundColor: 'rgba(17,28,40,.42)' }}><div className="w-full sm:max-w-md rounded-t-[28px] sm:rounded-[28px] p-5 sm:p-6" style={{ backgroundColor: C.card }}>
      {panel === 'profile' && <><h2 className="font-black text-2xl" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Edit profil</h2><p className="text-sm mt-1" style={{ color: C.mutedText }}>Perbarui informasi yang tampil di Questoria.</p><div className="mt-5 flex flex-col gap-3">{[['Nama', 'name'], ['Email', 'email'], ['Tentang saya', 'bio']].map(([label,key]) => <label key={key} className="text-xs font-bold" style={{ color: C.mutedText }}>{label}<input value={draft[key as keyof Profile]} onChange={e => setDraft({ ...draft, [key]: e.target.value })} className="mt-1.5 w-full rounded-xl px-3 py-3 text-sm outline-none" style={{ border: `1.5px solid ${C.border}`, color: C.deep }} /></label>)}</div><div className="mt-5 flex gap-3"><button className="flex-1 min-h-[48px] font-bold" onClick={() => setPanel(null)}>Batal</button><button className="flex-1 min-h-[48px] rounded-xl text-white font-black" style={{ backgroundColor: accent }} onClick={() => { onSaveProfile(draft); setPanel(null) }}>Simpan</button></div></>}
      {panel === 'password' && <><h2 className="font-black text-2xl" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Reset password</h2><p className="text-sm mt-1" style={{ color: C.mutedText }}>Gunakan minimal 6 karakter untuk keamanan akun.</p><div className="mt-5 flex flex-col gap-3"><input aria-label="Kata sandi baru" type="password" placeholder="Kata sandi baru" value={newPw} onChange={e => setNewPw(e.target.value)} className="rounded-xl px-3 py-3 outline-none" style={{ border: `1.5px solid ${C.border}` }} /><input aria-label="Konfirmasi kata sandi" type="password" placeholder="Konfirmasi kata sandi" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="rounded-xl px-3 py-3 outline-none" style={{ border: `1.5px solid ${C.border}` }} />{notice && <p className="text-xs" style={{ color: C.red }}>{notice}</p>}</div><div className="mt-5 flex gap-3"><button className="flex-1 min-h-[48px] font-bold" onClick={() => setPanel(null)}>Batal</button><button className="flex-1 min-h-[48px] rounded-xl text-white font-black" style={{ backgroundColor: accent }} onClick={() => { if (newPw.length < 6) setNotice('Kata sandi minimal 6 karakter.'); else if (newPw !== confirmPw) setNotice('Konfirmasi kata sandi belum sama.'); else { setNewPw(''); setConfirmPw(''); setPanel(null) } }}>Simpan</button></div></>}
      {panel === 'privacy' && <><h2 className="font-black text-2xl" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Privasi Anda</h2><p className="mt-3 text-sm leading-relaxed" style={{ color: C.mutedText }}>Data perkembangan hanya digunakan untuk pengalaman Questoria dan dapat dibagikan kepada GPK pilihan orang tua secara eksplisit.</p><button className="mt-6 w-full min-h-[48px] rounded-xl text-white font-black" style={{ backgroundColor: accent }} onClick={() => setPanel(null)}>Saya mengerti</button></>}
      {confirmLogout && <><div className="text-3xl">👋</div><h2 className="mt-3 font-black text-2xl" style={{ fontFamily: 'Nunito, sans-serif', color: C.deep }}>Keluar dari akun?</h2><p className="mt-2 text-sm" style={{ color: C.mutedText }}>Anda dapat masuk kembali kapan saja dengan akun ini.</p><div className="mt-6 flex gap-3"><button className="flex-1 min-h-[48px] font-bold" onClick={() => setConfirmLogout(false)}>Tetap di sini</button><button className="flex-1 min-h-[48px] rounded-xl text-white font-black" style={{ backgroundColor: C.red }} onClick={onLogout}>Keluar</button></div></>}
    </div></div>}
  </div>
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('onboarding')
  const [role, setRole] = useState<Role>(null)
  const [gender, setGender] = useState<Gender>(null)
  const [calmMode, setCalmMode] = useState(false)
  const [parentFromChild, setParentFromChild] = useState(false)
  const [childName, setChildName] = useState('Pejuang Kecil')
  const [profileSetupDone, setProfileSetupDone] = useState(false)
  const [selectedGpkId, setSelectedGpkId] = useState(0)
  const [selectedTopicId, setSelectedTopicId] = useState(0)
  const [selectedProductId, setSelectedProductId] = useState(0)
  const [gpkRegDone, setGpkRegDone] = useState(false)
  const [profiles, setProfiles] = useState<Record<Exclude<Role, null>, Profile>>({ child: { name: 'Pejuang Kecil', email: 'rafi@questoria.id', bio: 'Sedang menjelajahi dunia belajar.' }, parent: { name: 'Sari Wulandari', email: 'sari.wulandari@gmail.com', bio: 'Mendampingi tumbuh kembang dengan penuh perhatian.' }, gpk: { name: 'Nadia Pratama, S.Pd.', email: 'nadia@questoria.id', bio: 'Guru Pendamping Khusus yang hangat dan terlatih.' } })

  function handleRole(r: Role) {
    setRole(r)
    setScreen('login')
  }

  function handleLogin() {
    if (role === 'child') {
      setScreen(profileSetupDone ? 'child-dashboard' : 'child-profile-setup')
    } else if (role === 'gpk') {
      setScreen(gpkRegDone ? 'gpk-register-profile' : 'gpk-dashboard')
    } else {
      setScreen('parent-dashboard')
    }
  }

  function handleProfileDone(name: string) {
    setChildName(name)
    setProfileSetupDone(true)
    setScreen('child-dashboard')
  }

  function handleParentUnlock() {
    setParentFromChild(true)
    setScreen('parent-dashboard')
  }

  function goBack() {
    if (screen === 'login') setScreen('role-select')
    else if (screen === 'parent-password') setScreen('child-dashboard')
    else if (screen === 'parent-dashboard' && parentFromChild) { setParentFromChild(false); setScreen('child-dashboard') }
    else if (screen === 'analytics') role === 'gpk' ? setScreen('gpk-dashboard') : setScreen('parent-dashboard')
    else if (screen === 'gpk-services') setScreen('parent-dashboard')
    else if (screen === 'gpk-detail') setScreen('gpk-services')
    else if (screen === 'gpk-chat') setScreen('gpk-detail')
    else if (screen === 'gpk-call') setScreen('gpk-chat')
    else if (screen === 'forum') role === 'gpk' ? setScreen('gpk-dashboard') : setScreen('parent-dashboard')
    else if (screen === 'forum-detail') setScreen('forum')
    else if (screen === 'store') role === 'gpk' ? setScreen('gpk-dashboard') : setScreen('parent-dashboard')
    else if (screen === 'payment') setScreen('store')
    else if (screen === 'settings') role === 'gpk' ? setScreen('gpk-dashboard') : (parentFromChild || role === 'parent') ? setScreen('parent-dashboard') : setScreen('child-dashboard')
    else if (screen === 'gpk-profile') setScreen('gpk-dashboard')
    else if (screen === 'ai-assistant') setScreen('gpk-dashboard')
    else if (screen === 'achievements') setScreen('child-dashboard')
    else setScreen('role-select')
  }

  function renderScreen() {
    switch (screen) {
      case 'onboarding': return <OnboardingScreen onDone={() => setScreen('role-select')} />
      case 'role-select': return <RoleSelectScreen onRole={handleRole} />
      case 'login': return <LoginScreen role={role} onLogin={handleLogin} onRegister={() => setScreen('gpk-register')} onBack={() => setScreen('role-select')} />
      case 'child-profile-setup': return <ChildProfileSetupScreen onDone={handleProfileDone} />
      case 'parent-password': return <ParentPasswordScreen onUnlock={handleParentUnlock} onBack={() => setScreen('child-dashboard')} />
      case 'child-dashboard': return <ChildDashboard onNav={setScreen} calmMode={calmMode} onToggleCalmMode={() => setCalmMode((v) => !v)} childName={childName} />
      case 'achievements': return <AchievementsScreen onNav={setScreen} />
      case 'parent-dashboard': return <ParentDashboard onNav={setScreen} fromChild={parentFromChild} onBackToChild={() => { setParentFromChild(false); setScreen('child-dashboard') }} childName={childName} />
      case 'gpk-dashboard': return <GpkDashboard onNav={setScreen} />
      case 'game': return <GameScreen onNav={setScreen} gender={gender} onSetGender={setGender} />
      case 'analytics': return <AnalyticsScreen onBack={goBack} />
      case 'gpk-services': return <GpkServicesScreen onBack={goBack} onSelectGpk={(id) => { setSelectedGpkId(id); setScreen('gpk-detail') }} />
      case 'gpk-detail': return <GpkDetailScreen gpkId={selectedGpkId} onBack={goBack} onChat={() => setScreen('gpk-chat')} onCall={() => setScreen('gpk-call')} />
      case 'gpk-chat': return <GpkChatScreen gpkId={selectedGpkId} onBack={goBack} onCall={() => setScreen('gpk-call')} />
      case 'gpk-call': return <GpkCallScreen gpkId={selectedGpkId} onEnd={() => setScreen('gpk-chat')} />
      case 'gpk-register': return <GpkRegisterScreen onSubmit={() => { setGpkRegDone(true); setScreen('gpk-register-verify') }} onBack={() => setScreen('login')} />
      case 'gpk-register-verify': return <GpkRegisterVerifyScreen onGoLogin={() => setScreen('login')} />
      case 'gpk-register-profile': return <GpkRegisterProfileScreen onDone={() => { setGpkRegDone(false); setScreen('gpk-dashboard') }} />
      case 'forum': return <ForumScreen onBack={goBack} onSelectTopic={(id) => { setSelectedTopicId(id); setScreen('forum-detail') }} role={parentFromChild ? 'parent' : role} onNav={setScreen} />
      case 'forum-detail': return <ForumDetailScreen topicId={selectedTopicId} onBack={goBack} />
      case 'store': return <StoreScreen onBack={goBack} onOrder={(id) => { setSelectedProductId(id); setScreen('payment') }} />
      case 'payment': return <PaymentScreen productId={selectedProductId} onBack={goBack} onSuccess={() => setScreen('store')} />
      case 'gpk-profile': return <GpkProfileScreen onBack={goBack} onNav={setScreen} />
      case 'ai-assistant': return <AiAssistantScreen onBack={goBack} onNav={setScreen} role={parentFromChild ? 'parent' : role} />
      case 'child-shop': return <ChildShopScreen onNav={setScreen} gender={gender} />
      case 'settings': { const effRole = (parentFromChild ? 'parent' : role || 'parent') as Exclude<Role, null>; return <SettingsScreen onBack={goBack} role={effRole} profile={profiles[effRole]} onSaveProfile={(p) => { setProfiles({ ...profiles, [effRole]: p }); if (effRole === 'child') setChildName(p.name) }} onLogout={() => { setParentFromChild(false); setRole(null); setScreen('role-select') }} /> }
      default: return <OnboardingScreen onDone={() => setScreen('role-select')} />
    }
  }

  return (
    <div className={`fixed inset-0 flex flex-col overflow-hidden ${calmMode ? 'calm-sensory-mode' : ''}`} style={{ backgroundColor: C.bg }}>
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderScreen()}
      </div>
    </div>
  )
}
