import { useState, useEffect, useRef } from 'react'
import milkChocolate from './assets/products/milk-chocolate.png'
import pastryChocolate from './assets/products/pastry-chocolate.png'
import vanillaTruffle from './assets/products/vanilla-truffle.png'
import almondDark from './assets/products/almond-dark.png'
import ourMissionImg from './assets/products/sweeter-joy-promo.png'
import galleryImg1 from './assets/products/images1.jpeg'
import galleryImg2 from './assets/products/images2.jpeg'
import galleryImg3 from './assets/products/images3.jpeg'
import galleryImg4 from './assets/products/images4.jpeg'
import sweeterJoyLogo from './assets/products/SweeterJoyLogo.png'
import phronixLogo from './assets/products/SweeterJoyLogo.png'
// ── Hero slides ──────────────────────────────────────────────────────────────
const heroSlides = [
  {
    img: 'https://images.unsplash.com/photo-1523035274455-b2e5c6d5c2e0?w=1920&h=1080&fit=crop&auto=format',
    heading: "Homemade Chocolates,\nMade with Love",
    sub: 'Freshly handmade in small batches, packed with care, and made to add a little sweetness to every special moment.',
  },
  {
    img: 'https://images.unsplash.com/photo-1458253756247-1e4ed949191b?w=1920&h=1080&fit=crop&auto=format',
    heading: 'A Little Joy\nIn Every Bite',
    sub: 'From classic chocolates to crunchy dry-fruit favourites, every piece is made with care for you and your loved ones.',
  },
  {
    img: 'https://images.unsplash.com/photo-1542843137-8791a6904d14?w=1920&h=1080&fit=crop&auto=format',
    heading: 'Sweet Gifts for\nSpecial Moments',
    sub: 'Birthdays, festivals, celebrations or just because — make the moment sweeter with handcrafted chocolates from Sweeter Joy.',
  },
]

// ── Products ─────────────────────────────────────────────────────────────────
// NOTE: this is now only the *initial* seed list. The live, render-facing
// list lives in state (`productList`) inside App() so newly added products
// from the admin panel show up immediately without a page reload.
type Product = {
  id?: number
  name: string
  price: string
  img: string
  originalPrice?: string
  tag?: string | null
  weight?: string | null
}

const products: Product[] = [
  {
    name: 'Peanut Chocolate',
    price: '₹120',
    img: milkChocolate,
    tag: null,
    weight: null,
  },
  {
   name: 'Dry Fruit Chocolate',
   price: '₹180',
    img: pastryChocolate,
    tag: null,
    weight: null,
  },
  {
    name: 'Almond Chocolate',
    price: '₹150',
    img: vanillaTruffle,
    tag: null,
    weight: null,
  },
  {
    name: 'Dates Chocolate',
    price: '₹160',
    originalPrice: '₹200',
    img: almondDark,
    tag: 'SALE',
    weight: null,
  },
]

// ── Testimonials ─────────────────────────────────────────────────────────────
// NOTE: this is now only the *initial/fallback* seed list. The live,
// render-facing list lives in state (`testimonialsList`) inside App() so
// admin edits made in the "Edit Testimonial" panel show up immediately,
// the same pattern used for productList/statsList/galleryList.
type TestimonialItem = {
  id?: number
  text: string
  name: string
  role: string
  avatar: string
}

// ── Stats ────────────────────────────────────────────────────────────────────
// NOTE: this is now only the *initial/fallback* seed list. The live,
// render-facing list lives in state (`statsList`) inside App() so admin
// edits made in the "Edit Stats" panel show up immediately without a
// page reload, the same pattern used for productList.
type StatItem = {
  key: string
  value: number
  label: string
}

const defaultStats: StatItem[] = [
  { key: 'customers', value: 100, label: 'Happy Customers' },
  { key: 'varieties', value: 8, label: 'Chocolate Varieties' },
  { key: 'orders', value: 150, label: 'Orders Made' },
  { key: 'giftOptions', value: 5, label: 'Gift Options' },
]

// ── Gallery ──────────────────────────────────────────────────────────────────
// NOTE: same pattern as products/stats — this is only the initial/fallback
// seed list. The live, render-facing list lives in state (`galleryList`)
// inside App() so images added from the admin panel show up immediately.
type GalleryItem = {
  id?: number
  img: string
}

const defaultGallery: GalleryItem[] = [
  { img: galleryImg1 },
  { img: galleryImg2 },
  { img: galleryImg3 },
  { img: galleryImg4 },
]

// ── Nav items ────────────────────────────────────────────────────────────────
const navItems = [
  {
    label: 'Home',
    items: [],
  },
  {
    label: 'About Us',
    items: ['About Us', 'Testimonials', 'FAQ', 'Gallery', 'Admin Profile'],
  },
  {
    label: 'Category',
    items: ['Plain chocolate', 'Dry fruit', 'Dry fruit madi', 'Almond', 'Cashews', 'Dates', 'Peanuts'],
  },
  { label: 'Contact', items: [] },
]

// ── Map of nav sub-item labels → section element ids ──────────────────────────
// Any label not listed here (e.g. "Our Services", or Products/Blog sub-items
// that don't have a matching in-page section) simply won't scroll — the link
// still renders, it just has no target yet.
const sectionIdMap: Record<string, string> = {
  'About Us': 'about-section',
  'Our Services': 'services-section',
  'Testimonials': 'testimonials-section',
  'FAQ': 'faq-section',
  'Gallery': 'gallery-section',
}

// ── useCounter hook ───────────────────────────────────────────────────────────
function useCounter(target: number, started: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let start = 0
    const duration = 2000
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, started])
  return count
}

// ── StatCounter ───────────────────────────────────────────────────────────────
function StatCounter({ value, label, started }: { value: number; label: string; started: boolean }) {
  const count = useCounter(value, started)
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-2">
      <span className="counter-num">{count}</span>
      <span style={{ fontFamily: 'Jost', fontSize: '11px', letterSpacing: '0.2em', color: '#9E9B97', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  )
}

// ── GoldWave SVG divider ──────────────────────────────────────────────────────
function GoldWave() {
  return (
    <svg viewBox="0 0 120 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 120, height: 16 }}>
      <path d="M0 8 Q15 2, 30 8 Q45 14, 60 8 Q75 2, 90 8 Q105 14, 120 8" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.8" />
    </svg>
  )
}

// ── Vertical wavy divider between stats ───────────────────────────────────
function GoldWaveVertical() {
  return (
    <svg viewBox="0 0 16 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: '100%' }}>
      <path
        d="M8 0 Q2 15, 8 30 Q14 45, 8 60 Q2 75, 8 90 Q14 105, 8 120"
        stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.5"
      />
    </svg>
  )
}
// ── GoldLine ornament ─────────────────────────────────────────────────────────
function GoldLine() {
  return <div className="gold-divider" style={{ width: 80, margin: '0 auto' }} />
}

// ── ChocolateBoxArt — single cohesive open-box illustration (lid + tray of
//    truffles drawn as one connected SVG, so it can never break apart or
//    show a broken-image icon like a fetched photo could) ────────────────────
function ChocolateBoxArt() {
  const truffles: [number, number][] = [
    [215, 222], [270, 215], [325, 222],
    [218, 300], [270, 308], [322, 300],
  ]
  return (
    <svg
      viewBox="0 0 400 400"
      style={{ width: '100%', height: '100%', display: 'block', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))' }}
    >
      <defs>
        <pattern id="lidDots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="1.4" fill="rgba(212,175,55,0.35)" />
        </pattern>
        <clipPath id="lidClip">
          <polygon points="140,20 270,150 140,280 10,150" />
        </clipPath>
        <radialGradient id="truffleGrad" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#5a4230" />
          <stop offset="55%" stopColor="#2c2019" />
          <stop offset="100%" stopColor="#160f0a" />
        </radialGradient>
      </defs>

      {/* connecting shadow spine (the box's hinge/side wall) */}
      <polygon points="140,280 270,150 270,160 160,270" fill="#0a0806" />

      {/* ── Tray (base, holding the truffles) ── */}
      <polygon points="270,160 380,270 270,380 160,270" fill="#1b140f" stroke="rgba(212,175,55,0.35)" strokeWidth="1.5" />
      {/* compartment dividers */}
      <line x1="215" y1="215" x2="215" y2="325" stroke="rgba(212,175,55,0.15)" strokeWidth="1" />
      <line x1="270" y1="190" x2="270" y2="350" stroke="rgba(212,175,55,0.15)" strokeWidth="1" />
      <line x1="325" y1="215" x2="325" y2="325" stroke="rgba(212,175,55,0.15)" strokeWidth="1" />
      <line x1="190" y1="252" x2="350" y2="252" stroke="rgba(212,175,55,0.15)" strokeWidth="1" />
      {/* truffles */}
      {truffles.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="26" fill="url(#truffleGrad)" />
          <path d={`M ${cx - 14} ${cy} q 7,-14 14,0 q 7,14 14,0`} stroke="rgba(212,175,55,0.55)" strokeWidth="1.6" fill="none" />
          <path d={`M ${cx - 9} ${cy - 7} q 5,-8 9,0`} stroke="rgba(212,175,55,0.35)" strokeWidth="1.2" fill="none" />
        </g>
      ))}

      {/* ── Lid (top, open, showing the logo) ── */}
      <polygon points="140,20 270,150 140,280 10,150" fill="#211914" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" />
      <polygon points="140,20 270,150 140,280 10,150" fill="url(#lidDots)" clipPath="url(#lidClip)" />
      <polygon points="140,85 205,150 140,215 75,150" fill="#0f0c0a" stroke="#D4AF37" strokeWidth="2" />
     <text x="140" y="146" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="20" fontStyle="italic" fill="#D4AF37">Sweeter Joy</text>
<text x="140" y="163" textAnchor="middle" fontFamily="Jost, sans-serif" fontSize="6" letterSpacing="1.5" fill="#9E9B97">CREATED WITH LOVE</text>
    </svg>
  )
}

// ── Backend base URL ────────────────────────────────────────────────────────
const API_URL = 'https://sweeterjoy.onrender.com'

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [slide, setSlide] = useState(0)
  const [slideKey, setSlideKey] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [addedItem, setAddedItem] = useState<string | null>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  // ── "Read More" info modal state ─────────────────────────────────────────
  const [showInfoModal, setShowInfoModal] = useState(false)

  // ── Privacy Policy / Terms & Conditions modal state ─────────────────────
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  // ── Contact form (footer) state ──────────────────────────────────────────
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactSent, setContactSent] = useState(false)

  // ── Admin panel state ──────────────────────────────────────────────────────
  // productList now comes from the backend (Postgres via the Express API),
  // not localStorage — the static `products` array is kept only as a
  // fallback if the fetch fails so the page never renders empty.
  const [productList, setProductList] = useState<Product[]>(products)
  const [productsLoading, setProductsLoading] = useState(true)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  // ── Forgot Password / OTP / Reset Password state ───────────────────────────
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'password' | 'success'>('email')
  const [forgotEmail, setForgotEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotMessage, setForgotMessage] = useState('')

  // New product form fields
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newOriginalPrice, setNewOriginalPrice] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newWeight, setNewWeight] = useState('')
  const [newCategory, setNewCategory] = useState('');
  const [newImgPreview, setNewImgPreview] = useState<string | null>(null)
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [addProductError, setAddProductError] = useState('')
  const [addProductSubmitting, setAddProductSubmitting] = useState(false)

  // ── Stats (dynamic, admin-editable) state ───────────────────────────────────
  // statsList comes from the backend (same pattern as productList). The
  // static `defaultStats` array above is kept only as a fallback so the
  // section never renders empty if the fetch fails.
  const [statsList, setStatsList] = useState<StatItem[]>(defaultStats)
  const [statsLoading, setStatsLoading] = useState(true)
  const [showEditStats, setShowEditStats] = useState(false)
  const [editStatsValues, setEditStatsValues] = useState<Record<string, string>>({})
  const [statsSaveError, setStatsSaveError] = useState('')
  const [statsSaving, setStatsSaving] = useState(false)

  // ── Gallery (dynamic, admin-editable) state ─────────────────────────────────
  // galleryList comes from the backend (same pattern as productList/statsList).
  // defaultGallery is kept only as a fallback so the section never renders
  // empty if the fetch fails.
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(defaultGallery)
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [showAddGallery, setShowAddGallery] = useState(false)
  const [newGalleryPreview, setNewGalleryPreview] = useState<string | null>(null)
  const [newGalleryFile, setNewGalleryFile] = useState<File | null>(null)
  const [addGalleryError, setAddGalleryError] = useState('')
  const [addGallerySubmitting, setAddGallerySubmitting] = useState(false)

  // ── Testimonials (admin-editable) state ──────────────────────────────────
  // testimonialsList now comes from the backend (same pattern as
  // testimonialsList comes entirely from the backend now — no local
  // hardcoded fallback, since editing/deleting a fallback item (which has
  // no database id) caused confusing errors. If the fetch fails or the
  // table is empty, the section just shows nothing until data loads.
  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>([])
  const [testimonialsLoading, setTestimonialsLoading] = useState(true)
  const [showEditTestimonial, setShowEditTestimonial] = useState(false)
  const [editingTestimonialIdx, setEditingTestimonialIdx] = useState<number | null>(null)
  const [editTestimonialText, setEditTestimonialText] = useState('')
  const [editTestimonialName, setEditTestimonialName] = useState('')
  const [editTestimonialRole, setEditTestimonialRole] = useState('')
  const [editTestimonialAvatar, setEditTestimonialAvatar] = useState('')
  const [editTestimonialError, setEditTestimonialError] = useState('')
  const [editTestimonialSaving, setEditTestimonialSaving] = useState(false)

  // ── Add Testimonial (admin-only) state ───────────────────────────────────
  const [showAddTestimonial, setShowAddTestimonial] = useState(false)
  const [newTestimonialText, setNewTestimonialText] = useState('')
  const [newTestimonialName, setNewTestimonialName] = useState('')
  const [newTestimonialRole, setNewTestimonialRole] = useState('')
  const [newTestimonialAvatar, setNewTestimonialAvatar] = useState('')
  const [addTestimonialError, setAddTestimonialError] = useState('')
  const [addTestimonialSubmitting, setAddTestimonialSubmitting] = useState(false)

  async function fetchTestimonials() {
    try {
      setTestimonialsLoading(true)
      const res = await fetch(`${API_URL}/api/testimonials`)
      if (!res.ok) throw new Error('bad response')
      const data = await res.json()
      if (Array.isArray(data)) {
        setTestimonialsList(
          data.map((t: any) => ({
            id: t.id,
            text: t.text,
            name: t.name,
            role: t.role,
            avatar: t.avatar,
          }))
        )
      }
    } catch (err) {
      console.error('Failed to fetch testimonials', err)
    } finally {
      setTestimonialsLoading(false)
    }
  }

  function openEditTestimonial(idx: number) {
    const t = testimonialsList[idx]
    setEditingTestimonialIdx(idx)
    setEditTestimonialText(t.text)
    setEditTestimonialName(t.name)
    setEditTestimonialRole(t.role)
    setEditTestimonialAvatar(t.avatar)
    setEditTestimonialError('')
    setShowEditTestimonial(true)
  }

  async function handleSaveTestimonial(e: React.FormEvent) {
    e.preventDefault()
    if (editingTestimonialIdx === null) return
    if (!editTestimonialText.trim() || !editTestimonialName.trim() || !editTestimonialRole.trim()) {
      setEditTestimonialError('Please fill in the quote, name and role.')
      return
    }
    const target = testimonialsList[editingTestimonialIdx]
    if (!target.id) {
      setEditTestimonialError('This testimonial is not saved in the database yet. Please refresh the page and try again.')
      return
    }
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setEditTestimonialError('Session expired, please log in again')
      setIsAdminLoggedIn(false)
      return
    }
    try {
      setEditTestimonialSaving(true)
      const res = await fetch(`${API_URL}/api/testimonials/${target.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          text: editTestimonialText.trim(),
          name: editTestimonialName.trim(),
          role: editTestimonialRole.trim(),
          avatar: editTestimonialAvatar.trim() || editTestimonialName.trim().slice(0, 2).toUpperCase(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save testimonial')
      await fetchTestimonials()
      setShowEditTestimonial(false)
      setEditingTestimonialIdx(null)
    } catch (err: any) {
      setEditTestimonialError(err.message || 'Failed to save testimonial')
    } finally {
      setEditTestimonialSaving(false)
    }
  }

  // ── Open the "Add Testimonial" form, resetting its fields ───────────────
  function openAddTestimonial() {
    setNewTestimonialText('')
    setNewTestimonialName('')
    setNewTestimonialRole('')
    setNewTestimonialAvatar('')
    setAddTestimonialError('')
    setShowAddTestimonial(true)
  }

  // ── Send the new testimonial to the backend and jump the carousel to it
  // so the admin immediately sees the result of what they just added. ─────
  async function handleAddTestimonial(e: React.FormEvent) {
    e.preventDefault()
    if (!newTestimonialText.trim() || !newTestimonialName.trim() || !newTestimonialRole.trim()) {
      setAddTestimonialError('Please fill in the quote, name and role.')
      return
    }
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setAddTestimonialError('Session expired, please log in again')
      setIsAdminLoggedIn(false)
      return
    }
    try {
      setAddTestimonialSubmitting(true)
      const res = await fetch(`${API_URL}/api/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          text: newTestimonialText.trim(),
          name: newTestimonialName.trim(),
          role: newTestimonialRole.trim(),
          avatar: newTestimonialAvatar.trim() || newTestimonialName.trim().slice(0, 2).toUpperCase(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add testimonial')
      await fetchTestimonials()
      setTestimonialIdx(testimonialsList.length) // jump carousel to the newly added testimonial
      setShowAddTestimonial(false)
    } catch (err: any) {
      setAddTestimonialError(err.message || 'Failed to add testimonial')
    } finally {
      setAddTestimonialSubmitting(false)
    }
  }

  async function handleDeleteTestimonial(id: number | undefined) {
    if (!id) return
    const token = localStorage.getItem('admin_token')
    if (!token) return
    try {
      await fetch(`${API_URL}/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setTestimonialsList(list => list.filter(t => t.id !== id))
      setTestimonialIdx(0)
    } catch (err) {
      console.error('Failed to delete testimonial', err)
    }
  }

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminName: adminUser, password: adminPass }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid username or password')
      localStorage.setItem('admin_token', data.token)
      setIsAdminLoggedIn(true)
      setShowAdminLogin(false)
      setShowAddProduct(true)
      setAdminUser('')
      setAdminPass('')
      setLoginError('')
    } catch (err: any) {
      setLoginError(err.message || 'Invalid username or password')
    }
  }

  function resetForgotFlow() {
    setShowForgotPassword(false)
    setForgotStep('email')
    setForgotEmail('')
    setOtp('')
    setResetToken('')
    setNewPassword('')
    setConfirmPassword('')
    setForgotError('')
    setForgotMessage('')
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setForgotError('')
    setForgotMessage('')
    if (!forgotEmail.trim()) { setForgotError('Please enter your admin email.'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotEmail)) { setForgotError('Please enter a valid email address.'); return }
    try {
      await fetch(`${API_URL}/api/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      setForgotMessage('OTP sent successfully. Please check your email.')
      setTimeout(() => { setForgotMessage(''); setForgotStep('otp') }, 700)
    } catch {
      setForgotError('Something went wrong. Please try again.')
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setForgotError('')
    setForgotMessage('')
    if (!otp.trim()) { setForgotError('Please enter the OTP.'); return }
    if (otp.length !== 6) { setForgotError('OTP must be 6 digits.'); return }
    try {
      const res = await fetch(`${API_URL}/api/admin/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid OTP. Please try again.')
      setResetToken(data.resetToken)
      setForgotMessage('OTP verified successfully.')
      setTimeout(() => { setForgotMessage(''); setForgotStep('password') }, 600)
    } catch (err: any) {
      setForgotError(err.message || 'Invalid OTP. Please try again.')
    }
  }

  async function handleResendOtp() {
    setForgotError('')
    setOtp('')
    try {
      await fetch(`${API_URL}/api/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      setForgotMessage('A new OTP has been sent.')
      setTimeout(() => setForgotMessage(''), 2500)
    } catch {
      setForgotError('Something went wrong. Please try again.')
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setForgotError('')
    setForgotMessage('')
    if (!newPassword || !confirmPassword) { setForgotError('Please enter both password fields.'); return }
    if (newPassword.length < 6) { setForgotError('Password must contain at least 6 characters.'); return }
    if (newPassword !== confirmPassword) { setForgotError('New Password and Confirm Password do not match.'); return }
    try {
      const res = await fetch(`${API_URL}/api/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to reset password.')
      setNewPassword('')
      setConfirmPassword('')
      setForgotStep('success')
    } catch (err: any) {
      setForgotError(err.message || 'Failed to reset password.')
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setNewImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setNewImgPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function resetAddProductForm() {
    setNewName('')
    setNewPrice('')
    setNewOriginalPrice('')
    setNewTag('')
    setNewWeight('')
    setNewCategory('');
    setNewImgPreview(null)
    setNewImageFile(null)
    setAddProductError('')
    
  }

  async function fetchProducts() {
    try {
      setProductsLoading(true)
      const res = await fetch(`${API_URL}/api/products`)
      const data = await res.json()
      setProductList(
        data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          img: p.image_url,
          originalPrice: p.original_price || undefined,
          tag: p.tag || null,
          weight: p.weight || null,
        }))
      )
    } catch (err) {
      console.error('Failed to fetch products', err)
    } finally {
      setProductsLoading(false)
    }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    setAddProductError('')
   if (!newName || !newPrice || !newCategory || !newImageFile) {
  setAddProductError("Name, Category, Price and Image are required");
  return;
}
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setAddProductError('Session expired, please log in again')
      setIsAdminLoggedIn(false)
      return
    }
    const formData = new FormData()
    formData.append('name', newName)
    formData.append('price', newPrice)
    formData.append('originalPrice', newOriginalPrice)
    formData.append('tag', newTag)
    formData.append('weight', newWeight)
    formData.append('image', newImageFile)
    formData.append('category', newCategory)

    try {
      setAddProductSubmitting(true)
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add product')
      await fetchProducts()
      resetAddProductForm()
      setShowAddProduct(false)
    } catch (err: any) {
      setAddProductError(err.message || 'Failed to add product')
    } finally {
      setAddProductSubmitting(false)
    }
  }

  async function handleDeleteProduct(id: number | undefined) {
    if (!id) return
    const token = localStorage.getItem('admin_token')
    if (!token) return
    try {
      await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setProductList(list => list.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete product', err)
    }
  }

  // ── Stats: fetch / save (same pattern as products) ──────────────────────────
  async function fetchStats() {
    try {
      setStatsLoading(true)
      const res = await fetch(`${API_URL}/api/stats`)
      if (!res.ok) throw new Error('bad response')
      const data = await res.json()
      // Expected backend shape: [{ key, value, label }, ...]
      if (Array.isArray(data) && data.length > 0) {
        setStatsList(
          data.map((s: any) => ({
            key: s.key,
            value: Number(s.value),
            label: s.label,
          }))
        )
      }
    } catch (err) {
      console.error('Failed to fetch stats, using defaults', err)
    } finally {
      setStatsLoading(false)
    }
  }

  function openEditStats() {
    const initial: Record<string, string> = {}
    statsList.forEach(s => { initial[s.key] = String(s.value) })
    setEditStatsValues(initial)
    setStatsSaveError('')
    setShowEditStats(true)
  }

  async function handleSaveStats(e: React.FormEvent) {
    e.preventDefault()
    setStatsSaveError('')
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setStatsSaveError('Session expired, please log in again')
      setIsAdminLoggedIn(false)
      return
    }

    const updated = statsList.map(s => ({
      ...s,
      value: Number(editStatsValues[s.key] ?? s.value) || 0,
    }))

    try {
      setStatsSaving(true)
      const res = await fetch(`${API_URL}/api/stats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updated),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save stats')
      setStatsList(updated)
      setShowEditStats(false)
    } catch (err: any) {
      setStatsSaveError(err.message || 'Failed to save stats')
    } finally {
      setStatsSaving(false)
    }
  }

  // ── Gallery: fetch / add / delete (same pattern as products) ────────────────
  async function fetchGallery() {
    try {
      setGalleryLoading(true)
      const res = await fetch(`${API_URL}/api/gallery`)
      if (!res.ok) throw new Error('bad response')
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setGalleryList(
          data.map((g: any) => ({
            id: g.id,
            img: g.image_url,
          }))
        )
      }
    } catch (err) {
      console.error('Failed to fetch gallery, using defaults', err)
    } finally {
      setGalleryLoading(false)
    }
  }

  function handleGalleryImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setNewGalleryFile(file)
    const reader = new FileReader()
    reader.onload = () => setNewGalleryPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function resetAddGalleryForm() {
    setNewGalleryPreview(null)
    setNewGalleryFile(null)
    setAddGalleryError('')
  }

  async function handleAddGalleryImage(e: React.FormEvent) {
    e.preventDefault()
    setAddGalleryError('')
    if (!newGalleryFile) {
      setAddGalleryError('Please choose an image to upload')
      return
    }
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setAddGalleryError('Session expired, please log in again')
      setIsAdminLoggedIn(false)
      return
    }
    const formData = new FormData()
    formData.append('image', newGalleryFile)

    try {
      setAddGallerySubmitting(true)
      const res = await fetch(`${API_URL}/api/gallery`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add image')
      await fetchGallery()
      resetAddGalleryForm()
      setShowAddGallery(false)
    } catch (err: any) {
      setAddGalleryError(err.message || 'Failed to add image')
    } finally {
      setAddGallerySubmitting(false)
    }
  }

  // ── UPDATED: now handles gallery items that don't have a backend id
  // (e.g. the default/fallback images shown before the API has loaded, or
  // if the API call failed). Those get removed straight from local state
  // instead of silently doing nothing, so the ✕ button always works from
  // the moment it's visible.
  async function handleDeleteGalleryImage(id: number | undefined) {
    if (!id) {
      // No backend id (default/fallback image) — just remove it locally.
      setGalleryList(list => list.filter(g => g.id !== id))
      return
    }
    const token = localStorage.getItem('admin_token')
    if (!token) return
    try {
      await fetch(`${API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setGalleryList(list => list.filter(g => g.id !== id))
    } catch (err) {
      console.error('Failed to delete gallery image', err)
    }
  }

  // Fetch products from the backend on first load
  useEffect(() => {
    fetchProducts()
  }, [])

  // Fetch stats from the backend on first load
  useEffect(() => {
    fetchStats()
  }, [])

  // Fetch gallery images from the backend on first load
  useEffect(() => {
    fetchGallery()
  }, [])

  // Fetch testimonials from the backend on first load
  useEffect(() => {
    fetchTestimonials()
  }, [])

  // Restore admin session if a token from a previous login is still saved
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) setIsAdminLoggedIn(true)
  }, [])

  function handleAdminLogout() {
    localStorage.removeItem('admin_token')
    setIsAdminLoggedIn(false)
  }

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contactName || !contactEmail || !contactMessage) return
    setContactSent(true)
    setContactName('')
    setContactEmail('')
    setContactMessage('')
    setTimeout(() => setContactSent(false), 4000)
  }

  // Hero autoplay
  useEffect(() => {
    const t = setInterval(() => {
      setSlide(s => (s + 1) % heroSlides.length)
      setSlideKey(k => k + 1)
    }, 6000)
    return () => clearInterval(t)
  }, [])

  // Sticky scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Stats intersection
  useEffect(() => {
    if (!statsRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  // Testimonial autoplay
  useEffect(() => {
    if (testimonialsList.length === 0) return
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonialsList.length), 5000)
    return () => clearInterval(t)
  }, [testimonialsList.length])

  function goSlide(n: number) {
    setSlide(n)
    setSlideKey(k => k + 1)
  }

async function addToCart(product: Product) {
  setCartCount(c => c + 1)
  setAddedItem(product.name)
  setTimeout(() => setAddedItem(null), 2500)

  const message = `Hi, I want this Chocolate:

*${product.name}*
Price: ${product.price}${product.weight ? `\nWeight: ${product.weight}` : ''}

${product.img}

Please contact me.`

  const adminNumber = '917038657778' // country code + WhatsApp number

  const whatsappUrl =
    `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`

  window.open(whatsappUrl, '_blank')
}
  function scrollToContact() {
    document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth' })
  }

  function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

  // Generic scroll for nav dropdown sub-items (About Us, Testimonials, FAQ, Gallery).
  // Labels without a matching section id are ignored (link just does nothing yet).
  function scrollToSection(label: string) {
    const id = sectionIdMap[label]
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Handles clicks on nav dropdown sub-items. "Admin Profile" opens the
  // Admin Login modal instead of scrolling to a section.
  function handleNavSubClick(label: string) {
    if (label === 'Admin Profile') {
      setShowAdminLogin(true)
    } else {
      scrollToSection(label)
    }
  }

  const filteredProducts = searchQuery.trim()
    ? productList.filter(p => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : productList

  const current = heroSlides[slide]

  return (
    <div style={{ background: '#0F0E0E', color: '#F5EFE6', fontFamily: 'Jost, sans-serif' }}>

      {/* Inline responsive rules for the brand-story grid so it never squishes
          into the "screenshot 2" broken layout on narrower widths */}
      <style>{`
        @media (max-width: 900px) {
          .brand-story-grid {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
        }
        @keyframes slowRotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .rotating-frame {
          animation: slowRotate 24s linear infinite;
        }
        .contact-input:focus {
          border-color: #D4AF37 !important;
        }
      `}</style>

      {/* ── Cart notification ── */}
      {addedItem && (
        <div style={{
          position: 'fixed', top: 88, right: 24, zIndex: 9999,
          background: '#181615', border: '1px solid rgba(212,175,55,0.4)',
          padding: '14px 24px', fontSize: 13, letterSpacing: '0.05em',
          color: '#F5EFE6', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          animation: 'fadeUp 0.4s ease forwards',
        }}>
          <span style={{ color: '#D4AF37' }}>✓</span>&nbsp; Added to cart — <em>{addedItem}</em>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transition: 'all 0.4s ease',
        background: scrolled ? 'rgba(15,14,14,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(212,175,55,0.15)' : 'none',
      }}>
        <div className="site-header-inner" style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', height: 80 }}>

          {/* Logo */}
         {/* Logo */}
<div style={{ flex: '0 0 auto', marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
 <img
    src={sweeterJoyLogo}
    alt="Sweeter Joy Chocolates"
    className="site-logo-img"
    style={{ width: 72, height: 72, objectFit: 'contain', flexShrink: 0, filter: 'brightness(0.82) saturate(1.2) contrast(1.1)' }}
  />
  <div>
    <div className="site-logo-text" style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 400, color: '#D4AF37', lineHeight: 1, letterSpacing: '0.04em' }}>
      Sweeter joy
    </div>
    <div className="site-logo-tagline" style={{ fontSize: 9, letterSpacing: '0.22em', color: '#9E9B97', textTransform: 'uppercase', marginTop: 2 }}>
     Created with love, wrapped in joy
    </div>
  </div>
</div>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="hidden md:flex desktop-nav">
            {navItems.map(item => (
              <div key={item.label} className="nav-item" style={{ position: 'relative' }}>
                <button
                 onClick={() => {
                  if (item.label === "Home") {
                    scrollToTop();
                  } else if (item.label === "Contact") {
                    scrollToContact();
                  }
                }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '8px 16px', color: '#F5EFE6', fontFamily: 'Jost, sans-serif',
                    fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#F5EFE6')}
                >
                  {item.label}
                  {item.items.length > 0 && <span style={{ marginLeft: 4, fontSize: 8, opacity: 0.6 }}>▾</span>}
                </button>
                {item.items.length > 0 && (
                  <div className="nav-dropdown" style={{
                    position: 'absolute', top: '100%', left: 0,
                    background: '#181615', border: '1px solid rgba(212,175,55,0.2)',
                    minWidth: 200, padding: '8px 0', boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
                  }}>
                    {item.items.map(sub => (
                      <a
                        key={sub}
                        href="#"
                        onClick={(e) => { e.preventDefault(); handleNavSubClick(sub) }}
                        style={{
                          display: 'block', padding: '10px 20px',
                          fontSize: 12, letterSpacing: '0.1em', color: '#9E9B97',
                          textDecoration: 'none', textTransform: 'uppercase',
                          transition: 'color 0.2s, padding-left 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.paddingLeft = '28px' }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#9E9B97'; e.currentTarget.style.paddingLeft = '20px' }}
                      >
                        {sub === 'Admin Profile' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                            {sub}
                          </span>
                        ) : sub}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="header-icons-gap" style={{ display: 'flex', alignItems: 'center', gap: 24, marginLeft: 32 }}>
            {/* Search */}
            {searchOpen ? (
              <div className="header-search-open" style={{
                display: 'flex', alignItems: 'center',
                background: '#FFFFFF', borderRadius: 999,
                padding: '10px 18px', width: 260,
                animation: 'fadeIn 0.25s ease',
              }}>
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  placeholder="Search chocolates"
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    color: '#0F0E0E', fontSize: 14, fontFamily: 'Jost, sans-serif',
                  }}
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0F0E0E', display: 'flex', padding: 0, marginLeft: 8 }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9E9B97', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9E9B97')}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            )}
           
            {/* Mobile hamburger */}
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F5EFE6', display: 'flex', flexDirection: 'column', gap: 5 }}
              className="flex md:hidden mobile-hamburger"
              onClick={() => setMenuOpen(m => !m)}
            >
              <span style={{ width: 22, height: 1, background: 'currentColor', display: 'block' }} />
              <span style={{ width: 22, height: 1, background: 'currentColor', display: 'block' }} />
              <span style={{ width: 14, height: 1, background: 'currentColor', display: 'block' }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: '#181615', borderTop: '1px solid rgba(212,175,55,0.15)', padding: '16px 40px 24px' }}>
            {navItems.map(item => (
              <div key={item.label}>
                <div
                  style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: item.label === 'Contact' ? 'pointer' : 'default' }}
                  onClick={item.label === 'Contact' ? () => { scrollToContact(); setMenuOpen(false) } : undefined}
                >
                  <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F5EFE6' }}>{item.label}</span>
                </div>
                {item.items.length > 0 && (
                  <div style={{ paddingLeft: 12 }}>
                    {item.items.map(sub => (
                      <div
                        key={sub}
                        onClick={() => { handleNavSubClick(sub); setMenuOpen(false) }}
                        style={{
                          padding: '8px 0', cursor: 'pointer',
                          fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9E9B97',
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}
                      >
                        {sub === 'Admin Profile' && (
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                          </svg>
                        )}
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </header>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#0F0E0E' }}>
        {/* Background image with zoom */}
        <div key={slideKey} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <img
            src={current.img}
            alt="Luxury chocolate"
            className="hero-zoom"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transformOrigin: 'center center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,14,14,0.35) 0%, rgba(15,14,14,0.75) 60%, rgba(15,14,14,0.92) 100%)' }} />
        </div>

       {/* Content */}
<div className="hero-content-pad" style={{
  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
  justifyContent: 'center', alignItems: 'center', padding: '0 8vw', paddingTop: 80,
  textAlign: 'center',
}}>
  <div key={`text-${slideKey}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div className="fade-up" style={{ fontFamily: 'Italianno, cursive', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#D4AF37', marginBottom: 12, opacity: 0.9 }}>
      Homemade Chocolate
    </div>
    <h1 className="fade-up-delay hero-heading" style={{
      fontFamily: 'Playfair Display, serif',
      fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
      fontWeight: 400,
      lineHeight: 1.1,
      color: '#F5EFE6',
      whiteSpace: 'pre-line',
      maxWidth: 900,
    }}>
      {current.heading}
    </h1>
    <div style={{ width: 60, height: 1, background: '#D4AF37', margin: '28px 0' }} />
    <p className="fade-up-delay-2" style={{
      fontSize: 'clamp(0.85rem, 1.4vw, 1rem)', color: '#9E9B97',
      maxWidth: 600, lineHeight: 1.8, letterSpacing: '0.04em',
    }}>
      {current.sub}
    </p>
    <div style={{ marginTop: 40 }}>
      <button className="btn-luxury fade-up-delay-2" onClick={() => setShowInfoModal(true)}>
        Explore Chocolates <span style={{ fontSize: 14 }}>→</span>
      </button>
    </div>
  </div>
</div>

        {/* Slide arrows */}
        <button
          className="hero-arrow hero-arrow-left"
          onClick={() => goSlide((slide - 1 + heroSlides.length) % heroSlides.length)}
          style={{
            position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37',
            width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.15)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none' }}
        >‹</button>
        <button
          className="hero-arrow hero-arrow-right"
          onClick={() => goSlide((slide + 1) % heroSlides.length)}
          style={{
            position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37',
            width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.15)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none' }}
        >›</button>

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10 }}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goSlide(i)}
              style={{
                width: i === slide ? 28 : 8, height: 1,
                background: i === slide ? '#D4AF37' : 'rgba(212,175,55,0.35)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BRAND STORY (About Us)
      ══════════════════════════════════════════════════════ */}
      <section id="about-section" style={{ background: '#0F0E0E', padding: '100px 8vw' }}>
        <div
          className="brand-story-grid"
          style={{ maxWidth: 1300, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 64, alignItems: 'center' }}
        >

          {/* Left — copy */}
          <div>
           <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 2.8vw, 2.6rem)', fontWeight: 400, lineHeight: 1.35, color: '#F5EFE6', marginBottom: 28 }}>
  Homemade chocolates,{' '}
  <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#D4AF37' }}>
    made from the heart
  </span>
</h2>

<p style={{ color: '#9E9B97', lineHeight: 1.9, fontSize: 15, marginBottom: 36, maxWidth: 360 }}>
  Sweeter Joy started with a simple love for making chocolates at home.
  What began as something made for family and friends became a small
  journey of sharing sweetness with others. Every chocolate is handmade
  with care, packed with love, and made to bring a little joy to your day.
</p>

            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setShowInfoModal(true) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4AF37', textDecoration: 'none' }}
            >
              Read More <span>→</span>
            </a>
          </div>

          {/* Center — open box illustration */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', minWidth: 0 }}>
            <div style={{ width: 'clamp(220px, 90%, 340px)', aspectRatio: '1 / 1' }}>
              <ChocolateBoxArt />
            </div>
          </div>

          {/* Right — feature list (Our Services) */}
          <div id="services-section" style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
            {[
              {
                icon: (
                  <svg width="26" height="26" fill="none" stroke="#D4AF37" strokeWidth="1.2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: 'Freshly Homemade',
                desc: 'Our chocolates are prepared in small batches with care, so every order feels fresh and special.'              },
              {
                icon: (
                  <svg width="26" height="26" fill="none" stroke="#D4AF37" strokeWidth="1.2" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 0-4 0v2" />
                    <line x1="12" y1="12" x2="12" y2="16" />
                  </svg>
                ),
                title: 'Packed with Love',
                desc: 'Every order is carefully packed and presented, making it perfect for gifting or enjoying yourself.'
              },
              {
                icon: (
                  <svg width="26" height="26" fill="none" stroke="#D4AF37" strokeWidth="1.2" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ),
                title: 'Made for Your Moments',
                desc: 'From birthdays and festivals to simple chocolate cravings, we create chocolates for moments worth celebrating.'
              },
            ].map(card => (
              <div key={card.title} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}>{card.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, color: '#F5EFE6', marginBottom: 8 }}>{card.title}</div>
                  <div style={{ fontSize: 13, color: '#9E9B97', lineHeight: 1.7 }}>{card.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FULL-WIDTH BANNER
      ══════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1702744382319-20efefc9dc19?w=1920&h=500&fit=crop&auto=format"
          alt="Luxury macro chocolate"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(15,14,14,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div
            className="rotating-frame"
            style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 180, height: 180,
              border: '1px solid rgba(212,175,55,0.7)',
              zIndex: 0,
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px' }}>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.8rem, 4.2vw, 3.2rem)',
              fontWeight: 400, color: '#F5EFE6', lineHeight: 1.35,
            }}>
              Made with love<br />
              <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#D4AF37' }}>A little sweetness</span> for every special moment
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRODUCT SHOWCASE
      ══════════════════════════════════════════════════════ */}
      <section
        id="products-section"
        style={{
          background: '#0F0E0E',
          padding: '100px 8vw',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="gold-dots-rotate" />

        <div
          style={{
            maxWidth: 1300,
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            {isAdminLoggedIn && !showAddProduct && (
              <div className="admin-buttons-row" style={{
                display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24,
              }}>
                <button
                  onClick={() => setShowAddProduct(true)}
                  style={{
                    background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37',
                    fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                    padding: '10px 18px', cursor: 'pointer', fontFamily: 'Jost, sans-serif',
                  }}
                >
                  + Add Product
                </button>
                <button
                  onClick={handleAdminLogout}
                  style={{
                    background: 'transparent', border: '1px solid rgba(212,175,55,0.35)', color: '#9E9B97',
                    fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                    padding: '10px 18px', cursor: 'pointer', fontFamily: 'Jost, sans-serif',
                  }}
                >
                  Exit Admin Mode
                </button>
              </div>
            )}
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.25em',
                color: '#D4AF37',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Our Collection
            </p>

            <h2 className="section-title">
             Made for Your Sweet Cravings
            </h2>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '20px 0',
              }}
            >
              <GoldWave />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {filteredProducts.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9E9B97', padding: '30px 0' }}>
                No chocolates found for "{searchQuery}"
              </div>
            ) : (
            filteredProducts.map(product => (
              <div
                key={product.id ?? product.name}
                className="product-card"
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    height: 260,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="product-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.5s ease',
                      mixBlendMode: 'multiply',
                      filter: 'contrast(1.05)',
                    }}
                  />

                  {product.tag && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        background: '#C53A3A',
                        color: '#F5EFE6',
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textTransform: 'uppercase',
                      }}
                    >
                      {product.tag}
                    </div>
                  )}

                  {isAdminLoggedIn && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id) }}
                      aria-label={`Delete ${product.name}`}
                      title="Delete product"
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: 'rgba(15,14,14,0.85)',
                        border: '1px solid #C53A3A',
                        color: '#C53A3A',
                        fontSize: 14,
                        lineHeight: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 2,
                        transition: 'background 0.2s, color 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#C53A3A'; e.currentTarget.style.color = '#F5EFE6' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,14,14,0.85)'; e.currentTarget.style.color = '#C53A3A' }}
                    >
                      ✕
                    </button>
                  )}

                  <div
                    className="product-overlay"
                    style={{
                      position: 'absolute',
                      bottom: -60,
                      left: 0,
                      right: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <button
                      className="btn-luxury"
                      style={{ fontSize: 10 }}
                      onClick={() => addToCart(product)}
                    >
                      Place Order →
                    </button>
                  </div>
                </div>

                <div
                  className="product-details"
                  style={{ padding: '16px 4px 0' }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      color: '#F5EFE6',
                      marginBottom: 8,
                      fontFamily: 'Playfair Display, serif',
                    }}
                  >
                    {product.name}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'baseline',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        color: '#D4AF37',
                        fontWeight: 500,
                      }}
                    >
                      {product.price}
                    </span>

                    {'originalPrice' in product &&
                      product.originalPrice && (
                        <span
                          style={{
                            fontSize: 13,
                            color: '#9E9B97',
                            textDecoration: 'line-through',
                          }}
                        >
                          {product.originalPrice}
                        </span>
                      )}
                  </div>

                  {product.weight && (
                    <div
                      style={{
                        fontSize: 11,
                        color: '#9E9B97',
                        marginTop: 4,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {product.weight}
                    </div>
                  )}
                </div>
              </div>
            ))
            )}
          </div>

          <div
            style={{
              textAlign: 'center',
              marginTop: 56,
            }}
          >
            <button className="btn-luxury">
              Online Store →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          VIDEO SECTION
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: '#0F0E0E',
          padding: '70px 3.3vw',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(420px, 38vw, 700px)',
            overflow: 'hidden',
            background: '#000',
          }}
        >
          {!videoPlaying ? (
            <>
              <img
                src="https://images.unsplash.com/photo-1590741664176-7fbd7e2592a0?w=1920&h=900&fit=crop&auto=format"
                alt="Chocolate workshop"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.48)',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(2.8rem, 5vw, 5rem)',
                    fontWeight: 400,
                    color: '#F5EFE6',
                    textAlign: 'center',
                    margin: 0,
                    marginBottom: 60,
                    lineHeight: 1,
                  }}
                >
                  Watch our video
                </h2>

                <button
                  onClick={() => setVideoPlaying(true)}
                  aria-label="Play video"
                  style={{
                    width: 82,
                    height: 82,
                    borderRadius: '50%',
                    border: '1px solid #D4AF37',
                    background: 'rgba(15, 14, 14, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#D4AF37',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1"
                  >
                    <polygon points="7,4 20,12 7,20" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <iframe
              src="https://www.youtube.com/embed/43ngkc2Ejgw?autoplay=1&rel=0"
              title="Chocolate Video"
              width="100%"
              height="100%"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{
                border: 'none',
                display: 'block',
              }}
            />
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATISTICS
      ══════════════════════════════════════════════════════ */}
      <section ref={statsRef} style={{ background: '#0F0E0E', padding: '80px 8vw', borderTop: '1px solid rgba(212,175,55,0.1)', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
        {isAdminLoggedIn && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <button
              onClick={openEditStats}
              style={{
                background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37',
                fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '10px 18px', cursor: 'pointer', fontFamily: 'Jost, sans-serif',
              }}
            >
              Edit Stats
            </button>
          </div>
        )}
        <div className="stats-grid" style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          alignItems: 'center',
        }}>
          {statsList.map((stat, i) => (
            <div key={stat.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StatCounter value={stat.value} label={stat.label} started={statsVisible} />
              {i < statsList.length - 1 && (
                <div className="gold-wave-vertical" style={{ height: 110, display: 'flex', alignItems: 'center' }}>
                  <GoldWaveVertical />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          OUR MISSION
          (Image already contains the "Our Mission" quote text baked in,
          so it's shown as-is with no HTML text layer on top — this keeps
          it a single source of truth and avoids duplicate/ghosted text.)
      ══════════════════════════════════════════════════════ */}
   <section id="mission-section" style={{ position: 'relative', background: '#0F0E0E' }}>
  <img
    src={ourMissionImg}
    alt="Our chocolatier — making chocolates is an art we have perfected over the years to make our customers happy. Orlando Detmers, Pastry Chef"
    style={{ width: '100%', height: 'auto', display: 'block' }}
  />
</section>


    {/* ══════════════════════════════════════════════════════
    TESTIMONIALS
══════════════════════════════════════════════════════ */}
<section id="testimonials-section" style={{ background: '#0F0E0E', padding: '100px 8vw', position: 'relative' }}>
  <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
    <p style={{ fontSize: 10, letterSpacing: '0.25em', color: '#D4AF37', textTransform: 'uppercase', marginBottom: 16 }}>
      Testimonials
    </p>
    <h2 className="section-title" style={{ marginBottom: 12 }}>What our Buyers Say</h2>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 64 }}>
      <GoldWave />
    </div>

    <div style={{ position: 'relative' }}>
      {/* Left arrow */}
      <button
        className="testimonial-arrow-left"
        onClick={() => { if (testimonialsList.length > 0) setTestimonialIdx((testimonialIdx - 1 + testimonialsList.length) % testimonialsList.length) }}
        style={{
          position: 'absolute', left: '-7vw', top: '35%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', color: '#9E9B97',
          fontSize: 22, transition: 'color 0.2s', display: 'flex', padding: 8,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
        onMouseLeave={e => (e.currentTarget.style.color = '#9E9B97')}
        aria-label="Previous testimonial"
      >←</button>

      {/* Right arrow */}
      <button
        className="testimonial-arrow-right"
        onClick={() => { if (testimonialsList.length > 0) setTestimonialIdx((testimonialIdx + 1) % testimonialsList.length) }}
        style={{
          position: 'absolute', right: '-7vw', top: '35%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', color: '#9E9B97',
          fontSize: 22, transition: 'color 0.2s', display: 'flex', padding: 8,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
        onMouseLeave={e => (e.currentTarget.style.color = '#9E9B97')}
        aria-label="Next testimonial"
      >→</button>

      {/* Card box */}
      <div className="testimonial-box" style={{
        position: 'relative',
        border: '1px solid #D4AF37',
        padding: '56px 64px',
        minHeight: 220,
      }}>
        {/* Subtle repeating circle-swirl texture, like the reference */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="testimonialTexture" width="34" height="34" patternUnits="userSpaceOnUse">
              <circle cx="17" cy="17" r="14" stroke="#D4AF37" strokeWidth="1" fill="none" />
              <circle cx="17" cy="17" r="8" stroke="#D4AF37" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testimonialTexture)" />
        </svg>

        {/* Admin edit / add buttons — "+" opens a form to add a brand-new
            testimonial, "✎" opens a form to edit the one currently shown. */}
        {isAdminLoggedIn && (
          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, display: 'flex', gap: 8 }}>
            <button
              onClick={openAddTestimonial}
              aria-label="Add testimonial"
              title="Add testimonial"
              style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(15,14,14,0.85)', border: '1px solid #D4AF37',
                color: '#D4AF37', fontSize: 16, lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#D4AF37'; e.currentTarget.style.color = '#0F0E0E' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,14,14,0.85)'; e.currentTarget.style.color = '#D4AF37' }}
            >
              +
            </button>
            <button
              onClick={() => openEditTestimonial(testimonialIdx)}
              aria-label="Edit testimonial"
              title="Edit testimonial"
              style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(15,14,14,0.85)', border: '1px solid #D4AF37',
                color: '#D4AF37', fontSize: 13, lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#D4AF37'; e.currentTarget.style.color = '#0F0E0E' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,14,14,0.85)'; e.currentTarget.style.color = '#D4AF37' }}
            >
              ✎
            </button>
            {testimonialsList.length > 1 && (
              <button
                onClick={() => handleDeleteTestimonial(testimonialsList[testimonialIdx]?.id)}
                aria-label="Delete testimonial"
                title="Delete testimonial"
                style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(15,14,14,0.85)', border: '1px solid #C53A3A',
                  color: '#C53A3A', fontSize: 14, lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#C53A3A'; e.currentTarget.style.color = '#F5EFE6' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,14,14,0.85)'; e.currentTarget.style.color = '#C53A3A' }}
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          {testimonialsList.map((t, i) => (
            <div
              key={i}
              style={{
                display: i === testimonialIdx ? 'block' : 'none',
              }}
            >
              <div style={{
                fontFamily: 'Playfair Display, serif', fontSize: 44, color: '#D4AF37',
                lineHeight: 0.5, marginBottom: 20,
              }}>"</div>
              <p style={{
                fontFamily: 'Jost, sans-serif', fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)',
                color: '#C9C6C1', lineHeight: 1.8, maxWidth: 620, margin: '0 auto',
              }}>
                {t.text}
              </p>
            </div>
          ))}
        </div>

        {/* Little triangle pointer at the bottom, connecting card to avatar */}
        <div style={{
          position: 'absolute', bottom: -13, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
          width: 24, height: 24, background: '#0F0E0E',
          borderRight: '1px solid #D4AF37', borderBottom: '1px solid #D4AF37',
        }} />
      </div>

      {/* Avatar + name, hanging below the box */}
      <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(212,175,55,0.15)',
          border: '2px solid #D4AF37',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#D4AF37',
          overflow: 'hidden',
        }}>
          {testimonialsList[testimonialIdx]?.avatar}
        </div>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: '#F5EFE6', marginBottom: 4 }}>
            {testimonialsList[testimonialIdx]?.name}
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.18em', color: '#9E9B97', textTransform: 'uppercase' }}>
            {testimonialsList[testimonialIdx]?.role}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

   {/* ══════════════════════════════════════════════════════
    GALLERY
══════════════════════════════════════════════════════ */}
<section id="gallery-section" style={{ background: '#0F0E0E', padding: '100px 8vw', position: 'relative', overflow: 'hidden' }}>
  {/* Faint decorative cocoa-leaf line art, full-bleed background */}
  <svg
    viewBox="0 0 1200 700"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none' }}
    preserveAspectRatio="xMidYMid slice"
  >
    {[120, 420, 780, 1080].map((x, i) => (
      <g key={i} transform={`translate(${x}, ${i % 2 === 0 ? 60 : 320})`}>
        <path d="M0 0 C-60 20 -90 80 -70 150 C-50 220 20 260 80 230 C140 200 150 120 110 60 C90 30 40 -10 0 0 Z"
          stroke="#D4AF37" strokeWidth="1.5" fill="none" />
        <path d="M0 0 C10 60 10 140 0 220" stroke="#D4AF37" strokeWidth="1" fill="none" />
      </g>
    ))}
  </svg>

  <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 1 }}>
    {/* Heading */}
    <div style={{ textAlign: 'center', marginBottom: 64 }}>
      <p style={{ fontSize: 10, letterSpacing: '0.25em', color: '#D4AF37', textTransform: 'uppercase', marginBottom: 16 }}>
        Gallery
      </p>
      <h2 style={{
        fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 400,
        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#F5EFE6', lineHeight: 1.4,
        maxWidth: 700, margin: '0 auto',
      }}>
        "Our pastry chefs create sweets only<br />with creativity and love"
      </h2>

      {isAdminLoggedIn && !showAddGallery && (
        <div style={{ marginTop: 28 }}>
          <button
            onClick={() => setShowAddGallery(true)}
            style={{
              background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37',
              fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '10px 18px', cursor: 'pointer', fontFamily: 'Jost, sans-serif',
            }}
          >
            + Add Gallery Image
          </button>
        </div>
      )}
    </div>

    {/* Image grid with diamond frame overlay */}
    <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
{galleryList.map((item, i) => (
  <div
    key={item.id ?? i}
    className="gallery-item"
    style={{
      position: 'relative',
      aspectRatio: '1 / 1.05',
      overflow: 'hidden',
      marginTop: i % 2 === 0 ? 0 : 48,
    }}
  >
    <img
      src={item.img}
      alt="Gallery item"
      className="gallery-img"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
    {/* Rotated gold diamond frame overlay */}
    <div style={{
        position: 'absolute', inset: '8%',
        border: '1px solid #D4AF37',
        transform: 'rotate(12deg)',
        pointerEvents: 'none',
      }} />
    {/* UPDATED: delete button now shows for every gallery image while in
        admin mode, not just ones that already have a backend id. Images
        without an id (defaults/fallbacks) get removed from local state;
        images with an id also get deleted from the backend. */}
    {isAdminLoggedIn && (
      <button
        onClick={(e) => { e.stopPropagation(); handleDeleteGalleryImage(item.id) }}
        aria-label="Delete gallery image"
        title="Delete image"
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'rgba(15,14,14,0.85)',
          border: '1px solid #C53A3A',
          color: '#C53A3A',
          fontSize: 14,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#C53A3A'; e.currentTarget.style.color = '#F5EFE6' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,14,14,0.85)'; e.currentTarget.style.color = '#C53A3A' }}
      >
        ✕
      </button>
    )}
  </div>
))} 
    </div>

    {/* Read More button */}
    <div style={{ textAlign: 'center', marginTop: 56 }}>
      <button className="btn-luxury" onClick={() => setShowInfoModal(true)}>
        Read More <span style={{ fontSize: 14 }}>→</span>
      </button>
    </div>
  </div>
</section>

    <FAQ />

     {/* ══════════════════════════════════════════════════════
    CONTACT US (placed above the footer)
══════════════════════════════════════════════════════ */}
<section id="contact-us" style={{ background: '#0F0E0E', padding: '100px 8vw', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
  <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
    <p style={{ fontSize: 10, letterSpacing: '0.25em', color: '#D4AF37', textTransform: 'uppercase', marginBottom: 16 }}>
      Get In Touch
    </p>
    <h2 className="section-title" style={{ marginBottom: 12 }}>Contact Us</h2>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
      <GoldWave />
    </div>

    <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, textAlign: 'left' }}>
      <div className="contact-form-row" style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Your Name"
          value={contactName}
          onChange={e => setContactName(e.target.value)}
          className="contact-input"
          style={{
            flex: '1 1 220px',
            background: 'transparent',
            border: '1px solid rgba(212,175,55,0.3)',
            padding: '16px 18px',
            fontSize: 14,
            color: '#F5EFE6',
            fontFamily: 'Jost, sans-serif',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        <input
          type="email"
          placeholder="Your Email"
          value={contactEmail}
          onChange={e => setContactEmail(e.target.value)}
          className="contact-input"
          style={{
            flex: '1 1 220px',
            background: 'transparent',
            border: '1px solid rgba(212,175,55,0.3)',
            padding: '16px 18px',
            fontSize: 14,
            color: '#F5EFE6',
            fontFamily: 'Jost, sans-serif',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
      </div>
      <textarea
        placeholder="Your Message"
        value={contactMessage}
        onChange={e => setContactMessage(e.target.value)}
        className="contact-input"
        rows={5}
        style={{
          background: 'transparent',
          border: '1px solid rgba(212,175,55,0.3)',
          padding: '16px 18px',
          fontSize: 14,
          color: '#F5EFE6',
          fontFamily: 'Jost, sans-serif',
          outline: 'none',
          resize: 'none',
          transition: 'border-color 0.2s',
        }}
      />
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <button type="submit" className="btn-luxury btn-luxury-filled">
          Send Message →
        </button>
      </div>
      {contactSent && (
        <div style={{ textAlign: 'center', fontSize: 13, color: '#D4AF37', marginTop: 4 }}>
          ✓ Thank you — your message has been sent.
        </div>
      )}
    </form>
  </div>
</section>

     {/* ══════════════════════════════════════════════════════
    FOOTER
══════════════════════════════════════════════════════ */}
<footer style={{ background: '#0a0908', padding: '0 8vw 40px', position: 'relative' }}>
  {/* Wavy gold divider line */}
  <svg
    viewBox="0 0 1400 60"
    preserveAspectRatio="none"
    style={{ width: '100%', height: 60, marginBottom: 56, display: 'block' }}
  >
    <path
      d="M0 30 Q100 5, 200 30 T400 30 T600 15 T800 40 T1000 20 T1200 35 T1400 25"
      stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.6"
    />
  </svg>

  <div style={{ maxWidth: 1300, margin: '0 auto' }}>
    <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 64, marginBottom: 56 }}>

      {/* Column 1 — Brand */}
      <div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, color: '#D4AF37', marginBottom: 4 }}>Sweeter joy</div>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: '#9E9B97', textTransform: 'uppercase', marginBottom: 20 }}>Created with love, wrapped in joy</div>
        <p style={{ fontSize: 13, color: '#9E9B97', lineHeight: 1.8, maxWidth: 280, marginBottom: 24 }}>
          Handcrafted chocolates from the finest single-origin cacao. Shipped worldwide in refrigerated, gold-foil packaging.
        </p>
       <div className="footer-social-row" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
  {[
    {
      name: 'Twitter', url: '#', fill: '#1DA1F2',
      path: 'M22 5.9c-.8.3-1.6.6-2.4.7.9-.5 1.5-1.4 1.9-2.3-.8.5-1.7.8-2.7 1-1.6-1.7-4.3-1.7-6 0-1 1-1.4 2.5-1.1 3.9-3.3-.2-6.3-1.8-8.3-4.3-1 1.8-.5 4 1.1 5.2-.7 0-1.4-.2-2-.6v.1c0 1.9 1.3 3.5 3.1 3.9-.6.1-1.2.2-1.8 0 .5 1.6 2 2.7 3.7 2.8-1.4 1.1-3.2 1.7-5 1.5 1.8 1.2 4 1.8 6.2 1.8 7.4 0 11.6-6.3 11.3-12 .8-.5 1.5-1.3 2-2.1z',
    },
    {
      name: 'Facebook', url: '#', fill: '#1877F2',
      path: 'M14 8.5h2.5V5.7h-2.5c-2 0-3.5 1.6-3.5 3.5v1.8H8.5v2.8H10.5V19h2.8v-5.2h2.2l.4-2.8h-2.6v-1.3c0-.6.4-1.2 1-1.2z',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/sweeterjoy.chocolates?utm_source=qr&igsh=dmZqeTZ1Z2RoaTYz',
      fill: 'url(#instaGradient)',
      path: 'M12 2.5c2.7 0 3 0 4.1.1 1 0 1.6.2 2 .4.5.2.9.4 1.3.8.4.4.6.8.8 1.3.2.4.4 1 .4 2 0 1.1.1 1.4.1 4.1s0 3-.1 4.1c0 1-.2 1.6-.4 2-.2.5-.4.9-.8 1.3-.4.4-.8.6-1.3.8-.4.2-1 .4-2 .4-1.1 0-1.4.1-4.1.1s-3 0-4.1-.1c-1 0-1.6-.2-2-.4-.5-.2-.9-.4-1.3-.8-.4-.4-.6-.8-.8-1.3-.2-.4-.4-1-.4-2 0-1.1-.1-1.4-.1-4.1s0-3 .1-4.1c0-1 .2-1.6.4-2 .2-.5.4-.9.8-1.3.4-.4.8-.6 1.3-.8.4-.2 1-.4 2-.4 1.1 0 1.4-.1 4.1-.1zM12 0C9.3 0 8.9 0 7.8.1 6.7.1 5.9.3 5.2.6c-.7.3-1.3.6-1.9 1.2C2.7 2.4 2.4 3 2.1 3.7c-.3.7-.5 1.5-.5 2.6C1.5 7.4 1.5 7.8 1.5 10.5v3c0 2.7 0 3.1.1 4.2 0 1.1.2 1.9.5 2.6.3.7.6 1.3 1.2 1.9.6.6 1.2.9 1.9 1.2.7.3 1.5.5 2.6.5C8.9 24 9.3 24 12 24s3.1 0 4.2-.1c1.1 0 1.9-.2 2.6-.5.7-.3 1.3-.6 1.9-1.2.6-.6.9-1.2 1.2-1.9.3-.7.5-1.5.5-2.6.1-1.1.1-1.5.1-4.2v-3c0-2.7 0-3.1-.1-4.2 0-1.1-.2-1.9-.5-2.6-.3-.7-.6-1.3-1.2-1.9-.6-.6-1.2-.9-1.9-1.2C18.1.3 17.3.1 16.2.1 15.1 0 14.7 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zm0 10.2a4 4 0 110-8 4 4 0 010 8zm6.4-10.4a1.4 1.4 0 11-2.8 0 1.4 1.4 0 012.8 0z',
    },
    {
      name: 'YouTube', url: '#', fill: '#FF0000',
      path: 'M22 7.3c-.3-1-1-1.8-2-2C18.2 4.8 12 4.8 12 4.8s-6.2 0-8 .5c-1 .2-1.7 1-2 2C1.5 9 1.5 12 1.5 12s0 3 .5 4.7c.3 1 1 1.8 2 2 1.8.5 8 .5 8 .5s6.2 0 8-.5c1-.2 1.7-1 2-2 .5-1.7.5-4.7.5-4.7s0-3-.5-4.7zM10 15.5v-7l6 3.5-6 3.5z',
    },
  ].map(icon => (
    <a
      key={icon.name}
      href={icon.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={icon.name}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
    >
      <svg width="27" height="27" viewBox="0 0 24 24">
        {icon.name === 'Instagram' && (
          <defs>
            <linearGradient id="instaGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FED576" />
              <stop offset="26%" stopColor="#F47133" />
              <stop offset="61%" stopColor="#BC3081" />
              <stop offset="100%" stopColor="#4C63D2" />
            </linearGradient>
          </defs>
        )}
        <path d={icon.path} fill={icon.fill} />
      </svg>
    </a>
  ))}
</div>
      </div>

      {/* Column 2 — Explore / Contact */}
      <div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 22, color: '#D4AF37', marginBottom: 10 }}>Explore</div>
        <div style={{ width: 50, height: 1, background: 'rgba(212,175,55,0.4)', marginBottom: 28 }} />

        {[
          { label: 'Phone', value: '+91 7038657778' },
          { label: 'Our Location', value: 'Near shivkrupa sweets , jatra - nandur link road , Nashik' },
          { label: 'Email', value: 'sumitjadhav7778@gmail.com' },
        ].map(item => (
          <div key={item.label} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.18em', color: '#D4AF37', textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 14, color: '#F5EFE6' }}>{item.value}</div>
          </div>
        ))}
      </div>

     
    </div>

    {/* Bottom wavy divider + copyright */}
    <svg
      viewBox="0 0 1400 20"
      preserveAspectRatio="none"
      style={{ width: '100%', height: 20, marginBottom: 24, display: 'block' }}
    >
      <path
        d="M0 10 Q50 2, 100 10 T200 10 T300 10 T400 10 T500 10 T600 10 T700 10 T800 10 T900 10 T1000 10 T1100 10 T1200 10 T1300 10 T1400 10"
        stroke="rgba(212,175,55,0.25)" strokeWidth="1" fill="none"
      />
    </svg>

    <div className="footer-bottom-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
      <div style={{ fontSize: 11, color: '#9E9B97', letterSpacing: '0.06em' }}>
        © 2026 Sweeter joy Maison de Chocolat. All rights reserved.
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        {['Privacy', 'Terms'].map(l => (
          <a
            key={l}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (l === 'Privacy') setShowPrivacyModal(true)
              else setShowTermsModal(true)
            }}
            style={{ fontSize: 11, color: '#9E9B97', textDecoration: 'none', letterSpacing: '0.06em', transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#D4AF37')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#9E9B97')}
          >{l}</a>
        ))}
      </div>
    </div>

    {/* Made by Team Phronix credit */}
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(212,175,55,0.1)',
    }}>
      <img src={phronixLogo} alt="Phronix" style={{ width: 20, height: 20, objectFit: 'contain', borderRadius: 4 }} />
      <span style={{ fontSize: 11, color: '#9E9B97', letterSpacing: '0.06em' }}>
        Made by <span style={{ color: '#D4AF37' }}>Team Phronix</span>
      </span>
    </div>
  </div>
</footer>

      {/* ══════════════════════════════════════════════════════
          READ MORE / CHOCOLATE INFO MODAL
      ══════════════════════════════════════════════════════ */}
      {showInfoModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div className="info-modal" style={{
            background: '#181615', border: '1px solid rgba(212,175,55,0.3)',
            padding: '48px 40px', width: 520, maxWidth: '100%',
            maxHeight: '85vh', overflowY: 'auto', position: 'relative',
          }}>
            <button
              onClick={() => setShowInfoModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#9E9B97', cursor: 'pointer', fontSize: 18 }}
            >✕</button>

            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#D4AF37', marginBottom: 20, textAlign: 'center' }}>
              The Art of Our Chocolate
            </div>

            <div style={{ color: '#C9C6C1', fontSize: 14, lineHeight: 1.9 }}>
              <p style={{ marginBottom: 18 }}>
                Every piece of Sweeter Joy chocolate begins with single-origin cacao beans,
                hand-selected from farms we've partnered with for over a decade. We roast
                each batch in small quantities to preserve the delicate floral and fruity
                notes unique to each origin.
              </p>
              <p style={{ marginBottom: 18 }}>
                Our master chocolatiers temper every batch by hand — a process that gives
                our chocolate its signature glossy finish and satisfying snap. No shortcuts,
                no artificial stabilizers, just pure craftsmanship passed down through
                generations.
              </p>
              <p>
                From bean to bar, from bar to truffle — every step is done with care,
                creativity, and love. That's the promise behind every box we seal with
                our gold foil.
              </p>
            </div>

            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <button
                className="btn-luxury btn-luxury-filled"
                onClick={() => setShowInfoModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          PRIVACY POLICY MODAL
      ══════════════════════════════════════════════════════ */}
      {showPrivacyModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div className="info-modal" style={{
            background: '#181615', border: '1px solid rgba(212,175,55,0.3)',
            padding: '48px 40px', width: 560, maxWidth: '100%',
            maxHeight: '85vh', overflowY: 'auto', position: 'relative',
          }}>
            <button
              onClick={() => setShowPrivacyModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#9E9B97', cursor: 'pointer', fontSize: 18 }}
            >✕</button>

            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: '#D4AF37', marginBottom: 24, textAlign: 'center' }}>
              Privacy Policy
            </div>

            <div style={{ color: '#C9C6C1', fontSize: 13.5, lineHeight: 1.9 }}>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#F5EFE6' }}>Information We Collect.</strong> When you place an
                order or contact us, we may collect your name, phone number, delivery address,
                and any details you share while placing an order via WhatsApp.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#F5EFE6' }}>How We Use Your Information.</strong> We use this
                information only to process your order, confirm delivery details, and respond
                to your queries. We do not sell or rent your personal information to third parties.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#F5EFE6' }}>Orders via WhatsApp.</strong> Placing an order
                redirects you to WhatsApp, which is operated by Meta. Any conversation you have
                there is subject to WhatsApp's own privacy policy.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#F5EFE6' }}>Cookies.</strong> This website may use basic
                browser storage to remember cart items or preferences during your visit. No
                third-party tracking cookies are used.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#F5EFE6' }}>Data Security.</strong> We take reasonable steps
                to protect the information you share with us, but no method of transmission over
                the internet is 100% secure.
              </p>
              <p>
                <strong style={{ color: '#F5EFE6' }}>Contact Us.</strong> For any privacy-related
                questions, reach us at sumitjadhav7778@gmail.com or +91 7038657778.
              </p>
            </div>

            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <button
                className="btn-luxury btn-luxury-filled"
                onClick={() => setShowPrivacyModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TERMS & CONDITIONS MODAL
      ══════════════════════════════════════════════════════ */}
      {showTermsModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div className="info-modal" style={{
            background: '#181615', border: '1px solid rgba(212,175,55,0.3)',
            padding: '48px 40px', width: 560, maxWidth: '100%',
            maxHeight: '85vh', overflowY: 'auto', position: 'relative',
          }}>
            <button
              onClick={() => setShowTermsModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#9E9B97', cursor: 'pointer', fontSize: 18 }}
            >✕</button>

            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: '#D4AF37', marginBottom: 24, textAlign: 'center' }}>
              Terms & Conditions
            </div>

            <div style={{ color: '#C9C6C1', fontSize: 13.5, lineHeight: 1.9 }}>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#F5EFE6' }}>Orders.</strong> All orders placed through this
                website are confirmed via WhatsApp with our team. An order is considered final
                only after confirmation from Sweeter Joy.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#F5EFE6' }}>Pricing.</strong> Prices shown on the website are
                in Indian Rupees (₹) and may change without prior notice. The price confirmed at
                the time of order will be final.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#F5EFE6' }}>Product Availability.</strong> Since our
                chocolates are handmade in small batches, availability may vary. We will inform
                you if an item is out of stock.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#F5EFE6' }}>Delivery.</strong> Delivery timelines are
                communicated at the time of order confirmation and may vary based on location
                and demand.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#F5EFE6' }}>Returns & Refunds.</strong> As our products are
                perishable food items, we do not accept returns once delivered, except in case
                of a genuine quality issue reported within 24 hours of delivery.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#F5EFE6' }}>Intellectual Property.</strong> All content,
                images, and branding on this website belong to Sweeter Joy and may not be
                reproduced without permission.
              </p>
              <p>
                <strong style={{ color: '#F5EFE6' }}>Contact.</strong> For any questions about these
                terms, contact us at sumitjadhav7778@gmail.com or +91 7038657778.
              </p>
            </div>

            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <button
                className="btn-luxury btn-luxury-filled"
                onClick={() => setShowTermsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ADMIN LOGIN MODAL
      ══════════════════════════════════════════════════════ */}
      {showAdminLogin && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.75)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div className="admin-login-modal" style={{
            background: '#181615', border: '1px solid rgba(212,175,55,0.3)',
            padding: '40px 36px', width: 380, position: 'relative',
          }}>
            <button
              onClick={() => { setShowAdminLogin(false); setLoginError('') }}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#9E9B97', cursor: 'pointer', fontSize: 18 }}
            >✕</button>

            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#D4AF37', marginBottom: 24, textAlign: 'center' }}>
              Admin Login
            </div>

            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                placeholder="Admin Name"
                value={adminUser}
                onChange={e => setAdminUser(e.target.value)}
                style={{
                  background: 'transparent', border: '1px solid rgba(212,175,55,0.3)',
                  padding: '14px 16px', fontSize: 14, color: '#F5EFE6',
                  fontFamily: 'Jost, sans-serif', outline: 'none',
                }}
              />
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'transparent', border: '1px solid rgba(212,175,55,0.3)',
                    padding: '14px 50px 14px 16px', fontSize: 14, color: '#F5EFE6',
                    fontFamily: 'Jost, sans-serif', outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                    color: '#9E9B97', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9.5 5 10 8a11.8 11.8 0 0 1-2.1 4.1" />
                      <path d="M6.6 6.6C4.1 8.1 2.4 10.4 2 12c.5 3 4.5 8 10 8a10.6 10.6 0 0 0 4.1-.8" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Forgot Password link */}
              <div style={{ textAlign: 'right', marginTop: -8 }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowAdminLogin(false)
                    setLoginError('')
                    setShowForgotPassword(true)
                  }}
                  style={{ fontSize: 11, color: '#9E9B97', textDecoration: 'none', letterSpacing: '0.04em' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9E9B97')}
                >
                  Forgot Password?
                </a>
              </div>

              {loginError && (
                <div style={{ color: '#C53A3A', fontSize: 12, textAlign: 'center' }}>{loginError}</div>
              )}
              <button type="submit" className="btn-luxury btn-luxury-filled" style={{ marginTop: 8, width: '100%' }}>
                Login →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          FORGOT PASSWORD / OTP / NEW PASSWORD
      ══════════════════════════════════════════════════════ */}
      {showForgotPassword && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(3px)' }}>
          <div className="admin-login-modal" style={{ background: '#181615', border: '1px solid rgba(212,175,55,0.35)', padding: '48px 46px', width: 475, maxWidth: '95vw', position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.65)' }}>
            <button type="button" onClick={resetForgotFlow} style={{ position: 'absolute', top: 18, right: 20, background: 'none', border: 'none', color: '#9E9B97', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>×</button>

            {forgotStep === 'email' && (<>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: '#D4AF37', marginBottom: 22, textAlign: 'center' }}>Forgot Password</div>
              <p style={{ fontSize: 14, color: '#C4C0BC', textAlign: 'center', marginBottom: 34, lineHeight: 1.8 }}>Enter your admin email and we'll send you a verification code to reset your password.</p>
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <input type="email" placeholder="Admin Email" value={forgotEmail} onChange={e => { setForgotEmail(e.target.value); setForgotError('') }} style={{ width: '100%', boxSizing: 'border-box', background: 'transparent', border: '1px solid rgba(212,175,55,0.35)', padding: '17px 20px', fontSize: 15, color: '#F5EFE6', fontFamily: 'Jost, sans-serif', outline: 'none' }} />
                {forgotError && <div style={{ color: '#C53A3A', fontSize: 12, textAlign: 'center' }}>{forgotError}</div>}
                {forgotMessage && <div style={{ color: '#D4AF37', fontSize: 12, textAlign: 'center' }}>✓ {forgotMessage}</div>}
                <button type="submit" className="btn-luxury btn-luxury-filled" style={{ marginTop: 8, width: '100%' }}>SEND OTP →</button>
              </form>
              <div style={{ textAlign: 'center', marginTop: 30 }}><button type="button" onClick={() => { resetForgotFlow(); setShowAdminLogin(true) }} style={{ border: 'none', background: 'none', fontSize: 13, color: '#D4AF37', cursor: 'pointer', fontFamily: 'Jost, sans-serif' }}>← Back to Login</button></div>
            </>)}

            {forgotStep === 'otp' && (<>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: '#D4AF37', marginBottom: 18, textAlign: 'center' }}>OTP Verification</div>
              <p style={{ fontSize: 14, color: '#C4C0BC', textAlign: 'center', marginBottom: 8, lineHeight: 1.8 }}>We sent a 6-digit verification code to</p>
              <div style={{ textAlign: 'center', color: '#D4AF37', fontSize: 13, marginBottom: 32 }}>{forgotEmail}</div>
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <input type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit OTP" value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setForgotError('') }} style={{ width: '100%', boxSizing: 'border-box', background: 'transparent', border: '1px solid rgba(212,175,55,0.35)', padding: '17px 20px', fontSize: 18, color: '#F5EFE6', fontFamily: 'Jost, sans-serif', outline: 'none', textAlign: 'center', letterSpacing: '0.35em' }} />
                {forgotError && <div style={{ color: '#C53A3A', fontSize: 12, textAlign: 'center' }}>{forgotError}</div>}
                {forgotMessage && <div style={{ color: '#D4AF37', fontSize: 12, textAlign: 'center' }}>✓ {forgotMessage}</div>}
                <button type="submit" className="btn-luxury btn-luxury-filled" style={{ marginTop: 8, width: '100%' }}>VERIFY OTP →</button>
              </form>
              <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#9E9B97' }}>Didn't receive the code? <button type="button" onClick={handleResendOtp} style={{ border: 'none', background: 'none', color: '#D4AF37', cursor: 'pointer', fontFamily: 'Jost, sans-serif', fontSize: 12 }}>Resend OTP</button></div>
              <div style={{ textAlign: 'center', marginTop: 18 }}><button type="button" onClick={() => { setForgotStep('email'); setOtp(''); setForgotError(''); setForgotMessage('') }} style={{ border: 'none', background: 'none', color: '#9E9B97', cursor: 'pointer', fontFamily: 'Jost, sans-serif', fontSize: 12 }}>← Change Email</button></div>
            </>)}

            {forgotStep === 'password' && (<>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: '#D4AF37', marginBottom: 20, textAlign: 'center' }}>Create New Password</div>
              <p style={{ fontSize: 14, color: '#C4C0BC', textAlign: 'center', marginBottom: 32, lineHeight: 1.8 }}>Your OTP has been verified. Create a new password for your admin account.</p>
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <input type="password" placeholder="New Password" value={newPassword} onChange={e => { setNewPassword(e.target.value); setForgotError('') }} style={{ width: '100%', boxSizing: 'border-box', background: 'transparent', border: '1px solid rgba(212,175,55,0.35)', padding: '17px 20px', fontSize: 15, color: '#F5EFE6', fontFamily: 'Jost, sans-serif', outline: 'none' }} />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setForgotError('') }} style={{ width: '100%', boxSizing: 'border-box', background: 'transparent', border: '1px solid rgba(212,175,55,0.35)', padding: '17px 20px', fontSize: 15, color: '#F5EFE6', fontFamily: 'Jost, sans-serif', outline: 'none' }} />
                {forgotError && <div style={{ color: '#C53A3A', fontSize: 12, textAlign: 'center' }}>{forgotError}</div>}
                <button type="submit" className="btn-luxury btn-luxury-filled" style={{ marginTop: 10, width: '100%' }}>RESET PASSWORD →</button>
              </form>
            </>)}

            {forgotStep === 'success' && (<>
              <div style={{ width: 68, height: 68, borderRadius: '50%', border: '1px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#D4AF37', fontSize: 28 }}>✓</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, color: '#D4AF37', textAlign: 'center', marginBottom: 18 }}>Password Reset</div>
              <p style={{ color: '#C4C0BC', textAlign: 'center', fontSize: 14, lineHeight: 1.8, marginBottom: 30 }}>Your password has been changed successfully. You can now login using your new password.</p>
              <button type="button" className="btn-luxury btn-luxury-filled" style={{ width: '100%' }} onClick={() => { resetForgotFlow(); setShowAdminLogin(true) }}>BACK TO LOGIN →</button>
            </>)}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ADD PRODUCT MODAL (opens right after successful login)
      ══════════════════════════════════════════════════════ */}
      {showAddProduct && isAdminLoggedIn && (
        <div style={{
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  overflowY: "auto",
  padding: "40px 0",
  zIndex: 9999,
}}>
          <div className="add-product-modal" style={{
            background: '#181615', border: '1px solid rgba(212,175,55,0.3)',
            padding: '40px 36px', width: 420, maxWidth: '100%', position: 'relative',
          }}>
            <button
              onClick={() => setShowAddProduct(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#9E9B97', cursor: 'pointer', fontSize: 18 }}
            >✕</button>

            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#D4AF37', marginBottom: 24, textAlign: 'center' }}>
              Add New Chocolate
            </div>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Image upload */}
              <label style={{
                border: '1px dashed rgba(212,175,55,0.4)', height: 140,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden', position: 'relative',
              }}>
                {newImgPreview ? (
                  <img src={newImgPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: 12, color: '#9E9B97', letterSpacing: '0.05em' }}>Click to upload chocolate image</span>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>

              <input
                type="text" placeholder="Product Name"
                value={newName} onChange={e => setNewName(e.target.value)}
                style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.3)', padding: '14px 16px', fontSize: 14, color: '#F5EFE6', fontFamily: 'Jost, sans-serif', outline: 'none' }}
              />
              <input
                type="text" placeholder="Price (e.g. ₹120)"
                value={newPrice} onChange={e => setNewPrice(e.target.value)}
                style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.3)', padding: '14px 16px', fontSize: 14, color: '#F5EFE6', fontFamily: 'Jost, sans-serif', outline: 'none' }}
              />
              <input
                type="text" placeholder="Original Price (optional, for sale)"
                value={newOriginalPrice} onChange={e => setNewOriginalPrice(e.target.value)}
                style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.3)', padding: '14px 16px', fontSize: 14, color: '#F5EFE6', fontFamily: 'Jost, sans-serif', outline: 'none' }}
              />
              <input
                type="text" placeholder="Tag (optional, e.g. SALE)"
                value={newTag} onChange={e => setNewTag(e.target.value)}
                style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.3)', padding: '14px 16px', fontSize: 14, color: '#F5EFE6', fontFamily: 'Jost, sans-serif', outline: 'none' }}
              />
              <input
                type="text" placeholder="Weight (e.g. 250g, 500g, 1kg)"
                value={newWeight} onChange={e => setNewWeight(e.target.value)}
                style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.3)', padding: '14px 16px', fontSize: 14, color: '#F5EFE6', fontFamily: 'Jost, sans-serif', outline: 'none' }}
              />
              <select
  value={newCategory}
  onChange={(e) => setNewCategory(e.target.value)}
  style={{
    width: '100%',
    padding: '18px 20px',
    background: '#181615',
    color: '#F5EFE6',
    border: '1px solid rgba(212,175,55,0.25)',
    outline: 'none',
    fontSize: '16px',
    marginTop: '20px',
    marginBottom: '20px'
  }}
>
  <option value="">Select Category</option>
  <option value="Plain Chocolate">Plain Chocolate</option>
  <option value="Dry Fruit">Dry Fruit</option>
  <option value="Dry Fruit Madi">Dry Fruit Madi</option>
  <option value="Almond">Almond</option>
  <option value="Cashews">Cashews</option>
  <option value="Dates">Dates</option>
  <option value="Peanuts">Peanuts</option>
</select>
              {addProductError && (
                <div style={{ color: '#C53A3A', fontSize: 12, textAlign: 'center' }}>{addProductError}</div>
              )}

              <button type="submit" disabled={addProductSubmitting} className="btn-luxury btn-luxury-filled" style={{ marginTop: 8, width: '100%' }}>
                {addProductSubmitting ? 'Uploading…' : 'Submit →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          EDIT STATS MODAL (opens from the "Edit Stats" button in admin mode)
      ══════════════════════════════════════════════════════ */}
      {showEditStats && isAdminLoggedIn && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto',
        }}>
          <div className="add-product-modal" style={{
            background: '#181615', border: '1px solid rgba(212,175,55,0.3)',
            padding: '40px 36px', width: 420, maxWidth: '100%', position: 'relative',
          }}>
            <button
              onClick={() => setShowEditStats(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#9E9B97', cursor: 'pointer', fontSize: 18 }}
            >✕</button>

            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#D4AF37', marginBottom: 24, textAlign: 'center' }}>
              Edit Stats
            </div>

            <form onSubmit={handleSaveStats} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {statsList.map(s => (
                <div key={s.key}>
                  <label style={{ fontSize: 11, color: '#9E9B97', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {s.label}
                  </label>
                  <input
                    type="number"
                    value={editStatsValues[s.key] ?? ''}
                    onChange={e => setEditStatsValues(v => ({ ...v, [s.key]: e.target.value }))}
                    style={{
                      width: '100%', boxSizing: 'border-box', marginTop: 6,
                      background: 'transparent', border: '1px solid rgba(212,175,55,0.3)',
                      padding: '14px 16px', fontSize: 14, color: '#F5EFE6',
                      fontFamily: 'Jost, sans-serif', outline: 'none',
                    }}
                  />
                </div>
              ))}

              {statsSaveError && (
                <div style={{ color: '#C53A3A', fontSize: 12, textAlign: 'center' }}>{statsSaveError}</div>
              )}

              <button type="submit" disabled={statsSaving} className="btn-luxury btn-luxury-filled" style={{ marginTop: 8, width: '100%' }}>
                {statsSaving ? 'Saving…' : 'Save →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          EDIT TESTIMONIAL MODAL (opens from the ✎ button on the testimonial card)
      ══════════════════════════════════════════════════════ */}
      {showEditTestimonial && isAdminLoggedIn && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto',
        }}>
          <div className="add-product-modal" style={{
            background: '#181615', border: '1px solid rgba(212,175,55,0.3)',
            padding: '40px 36px', width: 460, maxWidth: '100%', position: 'relative',
          }}>
            <button
              onClick={() => setShowEditTestimonial(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#9E9B97', cursor: 'pointer', fontSize: 18 }}
            >✕</button>

            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#D4AF37', marginBottom: 24, textAlign: 'center' }}>
              Edit Testimonial
            </div>

            <form onSubmit={handleSaveTestimonial} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: '#9E9B97', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Quote</label>
                <textarea
                  value={editTestimonialText}
                  onChange={e => setEditTestimonialText(e.target.value)}
                  rows={5}
                  style={{
                    width: '100%', boxSizing: 'border-box', marginTop: 6,
                    background: 'transparent', border: '1px solid rgba(212,175,55,0.3)',
                    padding: '14px 16px', fontSize: 14, color: '#F5EFE6',
                    fontFamily: 'Jost, sans-serif', outline: 'none', resize: 'vertical',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#9E9B97', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Name</label>
                <input
                  type="text"
                  value={editTestimonialName}
                  onChange={e => setEditTestimonialName(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box', marginTop: 6,
                    background: 'transparent', border: '1px solid rgba(212,175,55,0.3)',
                    padding: '14px 16px', fontSize: 14, color: '#F5EFE6',
                    fontFamily: 'Jost, sans-serif', outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#9E9B97', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Role / Company</label>
                <input
                  type="text"
                  value={editTestimonialRole}
                  onChange={e => setEditTestimonialRole(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box', marginTop: 6,
                    background: 'transparent', border: '1px solid rgba(212,175,55,0.3)',
                    padding: '14px 16px', fontSize: 14, color: '#F5EFE6',
                    fontFamily: 'Jost, sans-serif', outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#9E9B97', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Avatar Initials (e.g. SK)</label>
                <input
                  type="text"
                  maxLength={3}
                  value={editTestimonialAvatar}
                  onChange={e => setEditTestimonialAvatar(e.target.value.toUpperCase())}
                  style={{
                    width: '100%', boxSizing: 'border-box', marginTop: 6,
                    background: 'transparent', border: '1px solid rgba(212,175,55,0.3)',
                    padding: '14px 16px', fontSize: 14, color: '#F5EFE6',
                    fontFamily: 'Jost, sans-serif', outline: 'none', letterSpacing: '0.1em',
                  }}
                />
              </div>

              {editTestimonialError && (
                <div style={{ color: '#C53A3A', fontSize: 12, textAlign: 'center' }}>{editTestimonialError}</div>
              )}

              <button type="submit" disabled={editTestimonialSaving} className="btn-luxury btn-luxury-filled" style={{ marginTop: 8, width: '100%' }}>
                {editTestimonialSaving ? 'Saving…' : 'Save →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ADD TESTIMONIAL MODAL (opens from the + button on the testimonial card)
      ══════════════════════════════════════════════════════ */}
      {showAddTestimonial && isAdminLoggedIn && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto',
        }}>
          <div className="add-product-modal" style={{
            background: '#181615', border: '1px solid rgba(212,175,55,0.3)',
            padding: '40px 36px', width: 460, maxWidth: '100%', position: 'relative',
          }}>
            <button
              onClick={() => setShowAddTestimonial(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#9E9B97', cursor: 'pointer', fontSize: 18 }}
            >✕</button>

            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#D4AF37', marginBottom: 24, textAlign: 'center' }}>
              Add Testimonial
            </div>

            <form onSubmit={handleAddTestimonial} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: '#9E9B97', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Quote</label>
                <textarea
                  value={newTestimonialText}
                  onChange={e => setNewTestimonialText(e.target.value)}
                  rows={5}
                  style={{
                    width: '100%', boxSizing: 'border-box', marginTop: 6,
                    background: 'transparent', border: '1px solid rgba(212,175,55,0.3)',
                    padding: '14px 16px', fontSize: 14, color: '#F5EFE6',
                    fontFamily: 'Jost, sans-serif', outline: 'none', resize: 'vertical',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#9E9B97', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Name</label>
                <input
                  type="text"
                  value={newTestimonialName}
                  onChange={e => setNewTestimonialName(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box', marginTop: 6,
                    background: 'transparent', border: '1px solid rgba(212,175,55,0.3)',
                    padding: '14px 16px', fontSize: 14, color: '#F5EFE6',
                    fontFamily: 'Jost, sans-serif', outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#9E9B97', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Role / Company</label>
                <input
                  type="text"
                  value={newTestimonialRole}
                  onChange={e => setNewTestimonialRole(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box', marginTop: 6,
                    background: 'transparent', border: '1px solid rgba(212,175,55,0.3)',
                    padding: '14px 16px', fontSize: 14, color: '#F5EFE6',
                    fontFamily: 'Jost, sans-serif', outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#9E9B97', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Avatar Initials (e.g. SK)</label>
                <input
                  type="text"
                  maxLength={3}
                  value={newTestimonialAvatar}
                  onChange={e => setNewTestimonialAvatar(e.target.value.toUpperCase())}
                  style={{
                    width: '100%', boxSizing: 'border-box', marginTop: 6,
                    background: 'transparent', border: '1px solid rgba(212,175,55,0.3)',
                    padding: '14px 16px', fontSize: 14, color: '#F5EFE6',
                    fontFamily: 'Jost, sans-serif', outline: 'none', letterSpacing: '0.1em',
                  }}
                />
              </div>

              {addTestimonialError && (
                <div style={{ color: '#C53A3A', fontSize: 12, textAlign: 'center' }}>{addTestimonialError}</div>
              )}

              <button type="submit" disabled={addTestimonialSubmitting} className="btn-luxury btn-luxury-filled" style={{ marginTop: 8, width: '100%' }}>
                {addTestimonialSubmitting ? 'Adding…' : 'Add →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ADD GALLERY IMAGE MODAL (opens from "+ Add Gallery Image" in admin mode)
      ══════════════════════════════════════════════════════ */}
      {showAddGallery && isAdminLoggedIn && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto',
        }}>
          <div className="add-product-modal" style={{
            background: '#181615', border: '1px solid rgba(212,175,55,0.3)',
            padding: '40px 36px', width: 420, maxWidth: '100%', position: 'relative',
          }}>
            <button
              onClick={() => { setShowAddGallery(false); resetAddGalleryForm() }}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#9E9B97', cursor: 'pointer', fontSize: 18 }}
            >✕</button>

            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#D4AF37', marginBottom: 24, textAlign: 'center' }}>
              Add Gallery Image
            </div>

            <form onSubmit={handleAddGalleryImage} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              <label style={{
                border: '1px dashed rgba(212,175,55,0.4)', height: 180,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden', position: 'relative',
              }}>
                {newGalleryPreview ? (
                  <img src={newGalleryPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 12, color: '#9E9B97', letterSpacing: '0.05em' }}>Click to upload gallery image</span>
                )}
                <input type="file" accept="image/*" onChange={handleGalleryImageUpload} style={{ display: 'none' }} />
              </label>

              {addGalleryError && (
                <div style={{ color: '#C53A3A', fontSize: 12, textAlign: 'center' }}>{addGalleryError}</div>
              )}

              <button type="submit" disabled={addGallerySubmitting} className="btn-luxury btn-luxury-filled" style={{ marginTop: 8, width: '100%' }}>
                {addGallerySubmitting ? 'Uploading…' : 'Submit →'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

// ── FAQ Accordion ─────────────────────────────────────────────────────────────
const faqs = [
  { q: 'What makes your chocolate different from artisan competitors?', a: 'We source exclusively from single-origin farms in Ecuador, Venezuela, and Madagascar — estates we visit annually. Our beans are fermented on-site, roasted in-house at low temperature, and hand-tempered by our chocolatiers. No additives, no shortcuts.' },
  { q: 'Do you ship internationally?', a: 'Yes. All orders ship worldwide in climate-controlled packaging with dry ice inserts to maintain 18°C. Free shipping on orders above €200.' },
  { q: 'Can I customise a gift box?', a: 'Absolutely. Our atelier team can personalise packaging, create monogrammed foil wrappers, and curate selections by flavour profile, dietary requirement, or occasion. Contact us at least 5 days in advance for bespoke orders.' },
  { q: 'Are your products suitable for dietary restrictions?', a: 'Our dark chocolate range is naturally vegan and gluten-free. We offer sugar-free and nut-free collections. Full allergen information is printed on every product and available on our website.' },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq-section" style={{ background: '#0F0E0E', padding: '100px 8vw', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', color: '#D4AF37', textTransform: 'uppercase', marginBottom: 16 }}>Questions</p>
          <h2 className="section-title">Frequently Asked</h2>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid rgba(212,175,55,0.15)', marginBottom: 0 }}>
            <button
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '28px 0', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Playfair Display, serif', fontSize: 18, color: open === i ? '#D4AF37' : '#F5EFE6',
                textAlign: 'left', transition: 'color 0.2s',
              }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {faq.q}
              <span style={{ fontSize: 20, color: '#D4AF37', flexShrink: 0, marginLeft: 24, transition: 'transform 0.3s', transform: open === i ? 'rotate(45deg)' : 'rotate(0)' }}>
                +
              </span>
            </button>
            <div style={{
              maxHeight: open === i ? 200 : 0,
              overflow: 'hidden', transition: 'max-height 0.4s ease',
            }}>
              <p style={{ paddingBottom: 28, color: '#9E9B97', lineHeight: 1.85, fontSize: 14 }}>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}