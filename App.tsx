import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  User,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Heart,
  Star,
  Check,
  X,
  Plus,
  Minus,
  Sparkles,
  Menu,
  Trash2,
  Copy,
  MapPin,
  CheckCircle,
  HelpCircle,
  Sun,
  Moon
} from "lucide-react";
import { HERO_SLIDES, PRODUCTS, INGREDIENTS, ARTICLES } from "./data";
import { Product, CartItem, Article, IngredientStory } from "./types";
import { TRANSLATIONS } from "./translations";

export default function App() {
  // Language & Theme states
  const [lang, setLang] = useState<"vi" | "en">(() => {
    const saved = localStorage.getItem("theinside_lang");
    return (saved === "en" || saved === "vi") ? saved : "vi";
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theinside_darkMode");
    if (saved !== null) return saved === "true";
    return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Translation function helper
  const t = (key: keyof typeof TRANSLATIONS.vi) => {
    return TRANSLATIONS[lang][key] || TRANSLATIONS.vi[key];
  };

  const tReplace = (key: keyof typeof TRANSLATIONS.vi, replacements: Record<string, string | number>) => {
    let str = TRANSLATIONS[lang][key] || TRANSLATIONS.vi[key];
    Object.entries(replacements).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, String(v));
    });
    return str;
  };

  useEffect(() => {
    localStorage.setItem("theinside_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("theinside_darkMode", String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [darkMode]);

  // Navigation & UI States
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientStory | null>(INGREDIENTS[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Cart Management
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("theinside_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Form, 2: Success
  const [checkoutForm, setCheckoutForm] = useState({ name: "", phone: "", address: "" });

  // Campaign Recycle Program State
  const [recycleOpen, setRecycleOpen] = useState(false);
  const [recycleStep, setRecycleStep] = useState(1); // 1: Info, 2: Form, 3: Voucher Code
  const [recycleForm, setRecycleForm] = useState({ name: "", email: "", qty: "200", address: "" });
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [brandTab, setBrandTab] = useState("meaning");

  // Likes / Wishlist State
  const [favorites, setFavorites] = useState<string[]>([]);

  // Toast Notification System
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" }[]>([]);

  // Auto scroll for hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem("theinside_cart", JSON.stringify(cart));
  }, [cart]);

  // Handle header background upon scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show customized floating notifications
  const addToast = (message: string, type: "success" | "info" = "success") => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Cart operations
  const addToCart = (product: Product, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      const name = lang === "vi" ? product.name : (product.nameEn || product.name);
      if (existing) {
        addToast(lang === "vi" ? `Cập nhật số lượng của ${name}` : `Updated quantity of ${name}!`);
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      addToast(lang === "vi" ? `Đã thêm ${name} vào giỏ hàng!` : `Added ${name} to cart!`);
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, amount: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + amount;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      const name = lang === "vi" ? item.product.name : (item.product.nameEn || item.product.name);
      addToast(lang === "vi" ? `Đã xóa ${name} khỏi giỏ` : `Removed ${name} from cart`, "info");
    }
  };

  const getTotalCartPrice = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Favorites Operation
  const toggleFavorite = (productId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        addToast(t("toastFavoriteRemoved"), "info");
        return prev.filter((id) => id !== productId);
      } else {
        addToast(t("toastFavoriteAdded"));
        return [...prev, productId];
      }
    });
  };

  // Search filter
  const filteredProducts = PRODUCTS.filter((p) => {
    const name = (p.name + " " + (p.nameEn || "")).toLowerCase();
    const sub = (p.subtitle + " " + (p.subtitleEn || "")).toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || sub.includes(query);
  });

  const filteredArticles = ARTICLES.filter((a) => {
    const title = (a.title + " " + (a.titleEn || "")).toLowerCase();
    const excerpt = (a.excerpt + " " + (a.excerptEn || "")).toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || excerpt.includes(query);
  });

  // Copy voucher
  const handleCopyVoucher = () => {
    navigator.clipboard.writeText("THEINSIDEPAPAYA100");
    setCopiedVoucher(true);
    addToast(t("toastCopiedVoucher"));
    setTimeout(() => setCopiedVoucher(false), 2000);
  };

  // Handle Checkout Submission
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      addToast(t("toastEmptyFields"), "info");
      return;
    }
    setCheckoutStep(2);
    addToast(t("toastSuccessOrder"));
    // Remove items from state
    setCart([]);
  };

  // Handle Recycling Form Submission
  const handleRecycleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recycleForm.name || !recycleForm.email || !recycleForm.address) {
      addToast(t("toastEmptyFields"), "info");
      return;
    }
    setRecycleStep(3);
    addToast(t("toastSuccessRecycle"));
  };

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-charcoal selection:bg-brand-accent/20 selection:text-brand-charcoal">
      
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-brand-cream/90 dark:bg-[#151110]/95 backdrop-blur-md shadow-sm py-3 border-b border-brand-clay/30 dark:border-brand-clay/15"
            : "bg-gradient-to-b from-black/50 via-black/15 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`p-1.5 md:hidden transition-all duration-300 ${
                scrolled
                  ? "text-brand-charcoal dark:text-brand-cream hover:text-brand-accent"
                  : "text-white hover:text-brand-accent drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter"
              }`}
              aria-label="Mở menu"
              id="mobile-menu-open-btn"
            >
              <Menu size={22} className={!scrolled ? "drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)]" : ""} />
            </button>

            {/* Brand Logo */}
            <a
              href="/"
              className="flex items-center space-x-1 group"
              id="brand-logo-link"
            >
              <span className={`font-serif text-2xl sm:text-3xl font-bold tracking-widest transition-all duration-300 ${
                scrolled
                  ? "text-brand-charcoal dark:text-white group-hover:text-brand-accent"
                  : "text-white group-hover:text-brand-accent drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] filter"
              }`}>
                THE INSIDE
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              <a
                href="#san-pham"
                className={`text-xs lg:text-sm font-medium tracking-widest transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-brand-accent hover:after:w-full after:transition-all pointer-events-auto ${
                  scrolled
                    ? "text-brand-charcoal/80 dark:text-brand-cream/80 hover:text-brand-accent dark:hover:text-brand-accent"
                    : "text-white hover:text-brand-accent drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] filter"
                }`}
              >
                {t("navProducts")}
              </a>
              <a
                href="#triet-ly"
                className={`text-xs lg:text-sm font-medium tracking-widest transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-brand-accent hover:after:w-full after:transition-all pointer-events-auto ${
                  scrolled
                    ? "text-brand-charcoal/80 dark:text-brand-cream/80 hover:text-brand-accent dark:hover:text-brand-accent"
                    : "text-white hover:text-brand-accent drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] filter"
                }`}
              >
                {t("navAbout")}
              </a>
              <a
                href="#nguyen-lieu"
                className={`text-xs lg:text-sm font-medium tracking-widest transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-brand-accent hover:after:w-full after:transition-all pointer-events-auto ${
                  scrolled
                    ? "text-brand-charcoal/80 dark:text-brand-cream/80 hover:text-brand-accent dark:hover:text-brand-accent"
                    : "text-white hover:text-brand-accent drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] filter"
                }`}
              >
                {t("navIngredients")}
              </a>
              <a
                href="#bai-viet"
                className={`text-xs lg:text-sm font-medium tracking-widest transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-brand-accent hover:after:w-full after:transition-all pointer-events-auto ${
                  scrolled
                    ? "text-brand-charcoal/80 dark:text-brand-cream/80 hover:text-brand-accent dark:hover:text-brand-accent"
                    : "text-white hover:text-brand-accent drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] filter"
                }`}
              >
                {t("navArticles")}
              </a>
              <a
                href="#lien-he"
                className={`text-xs lg:text-sm font-medium tracking-widest transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-brand-accent hover:after:w-full after:transition-all pointer-events-auto ${
                  scrolled
                    ? "text-brand-charcoal/80 dark:text-brand-cream/80 hover:text-brand-accent dark:hover:text-brand-accent"
                    : "text-white hover:text-brand-accent drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] filter"
                }`}
              >
                {t("navContact")}
              </a>
            </nav>

            {/* Utility Icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-1.5 transition-all duration-300 relative ${
                  scrolled
                    ? "text-brand-charcoal dark:text-brand-cream hover:text-brand-accent dark:hover:text-brand-accent"
                    : "text-white hover:text-brand-accent drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter"
                }`}
                aria-label="Tìm kiếm sản phẩm"
                id="search-toggle-btn"
              >
                <Search size={20} className={!scrolled ? "drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)]" : ""} />
              </button>

              {/* Language Toggle */}
              <button
                onClick={() => setLang(prev => prev === "vi" ? "en" : "vi")}
                className={`flex items-center justify-center h-7 px-2.5 text-[10px] font-extrabold tracking-widest rounded-full transition-all uppercase duration-300 ${
                  scrolled
                    ? "border-brand-clay dark:border-brand-cream/20 hover:border-brand-accent text-brand-charcoal dark:text-brand-cream hover:text-brand-accent dark:hover:text-brand-accent"
                    : "border-white/50 hover:border-brand-accent text-white hover:text-brand-accent bg-black/10 hover:bg-black/20 backdrop-blur-xs drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter"
                }`}
                title={lang === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
                id="lang-switch-btn"
              >
                {lang === "vi" ? "EN" : "VI"}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(prev => !prev)}
                className={`p-1.5 hover:scale-110 transition-all duration-300 rounded-full ${
                  scrolled
                    ? "text-brand-charcoal dark:text-brand-cream hover:text-brand-accent hover:bg-brand-clay/10 dark:hover:bg-white/10"
                    : "text-white hover:text-brand-accent hover:bg-white/10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter"
                }`}
                aria-label="Đổi giao diện sáng tối"
                title={lang === "vi" ? "Đổi chủ đề" : "Toggle Theme"}
                id="theme-switch-btn"
              >
                {darkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className={!scrolled ? "drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)]" : ""} />}
              </button>

              {/* Shopping Bag with Badge */}
              <button
                onClick={() => setCartOpen(true)}
                className={`p-1.5 transition-all duration-300 relative ${
                  scrolled
                    ? "text-brand-charcoal dark:text-brand-cream hover:text-brand-accent dark:hover:text-brand-accent"
                    : "text-white hover:text-brand-accent drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] filter"
                }`}
                aria-label="Giỏ hàng"
                id="cart-drawer-toggle-btn"
              >
                <ShoppingBag size={20} className={!scrolled ? "drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)]" : ""} />
                <AnimatePresence>
                  {getCartCount() > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[9px] font-bold text-white shadow-xs"
                    >
                      {getCartCount()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 pointer-events-auto"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-sm h-full bg-brand-cream shadow-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-brand-clay/30">
                  <span className="font-serif text-xl font-bold tracking-widest text-brand-charcoal">
                    THE INSIDE
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-brand-charcoal hover:text-brand-accent transition-colors"
                    id="mobile-close-btn"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col gap-5 mt-8">
                  <a
                    href="#san-pham"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium tracking-wide text-brand-charcoal/90 hover:text-brand-accent transition-colors py-1"
                  >
                    Sản phẩm dưỡng môi
                  </a>
                  <a
                    href="#triet-ly"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium tracking-wide text-brand-charcoal/90 hover:text-brand-accent transition-colors py-1"
                  >
                    Về thương hiệu
                  </a>
                  <a
                    href="#nguyen-lieu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium tracking-wide text-brand-charcoal/90 hover:text-brand-accent transition-colors py-1"
                  >
                    Câu chuyện nguyên liệu
                  </a>
                  <a
                    href="#bai-viet"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium tracking-wide text-brand-charcoal/90 hover:text-brand-accent transition-colors py-1"
                  >
                    Bài viết truyền cảm hứng
                  </a>
                  <a
                    href="#lien-he"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium tracking-wide text-brand-charcoal/90 hover:text-brand-accent transition-colors py-1"
                  >
                    Liên hệ chúng tôi
                  </a>
                </nav>
              </div>

              {/* Mobile footer of menu */}
              <div className="pt-6 border-t border-brand-clay/30 text-xs text-brand-charcoal/60 space-y-1.5">
                <p>THE INSIDE Beauty Co.</p>
                <p>Hotline: 2938 3667</p>
                <p>Email: hello@theinside.vn</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HERO SECTION / CAROUSEL */}
      <section className="relative h-[85vh] sm:h-[90vh] bg-brand-beige overflow-hidden">
        
        {/* Slides */}
        <AnimatePresence mode="popLayout">
          {(() => {
            const slide = HERO_SLIDES[activeSlide];
            return (
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0"
              >
                {/* Background Editorial Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.img
                    key={`img-${activeSlide}`}
                    initial={{ scale: 1.08, filter: "brightness(0.7) contrast(1.02)" }}
                    animate={{ scale: 1, filter: "brightness(0.82) contrast(1.05)" }}
                    transition={{ duration: 5.5, ease: "easeOut" }}
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-brand-charcoal/20 to-transparent" />
                </div>

                {/* Text Area */}
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24">
                  <div className="max-w-2xl text-white">
                    
                    {/* Tagline */}
                    <motion.span
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="inline-block px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full text-[10px] tracking-widest font-semibold uppercase mb-4"
                    >
                      {lang === "vi" ? slide.tagline : (slide.taglineEn || slide.tagline)}
                    </motion.span>

                    {/* Headline */}
                    <motion.h1
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.35 }}
                      className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-medium tracking-tight mb-4 leading-tight"
                    >
                      {lang === "vi" ? slide.title : (slide.titleEn || slide.title)}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                      className="text-sm sm:text-base text-gray-200/90 leading-relaxed mb-8 font-light"
                    >
                      {lang === "vi" ? slide.subtitle : (slide.subtitleEn || slide.subtitle)}
                    </motion.p>

                    {/* CTA button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.65 }}
                      className="flex flex-wrap gap-4"
                    >
                      <a
                        href="#san-pham"
                        className="inline-flex items-center justify-center px-6 py-3 bg-brand-cream text-brand-charcoal rounded-full text-xs font-semibold tracking-wider hover:bg-brand-accent hover:text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none"
                      >
                        {lang === "vi" ? slide.cta : (slide.ctaEn || slide.cta)}
                        <ArrowRight size={13} className="ml-2" />
                      </a>
                      
                      <button
                        onClick={() => setRecycleOpen(true)}
                        className="inline-flex items-center justify-center px-6 py-3 bg-white/15 backdrop-blur-xs text-white rounded-full text-xs font-semibold tracking-wider border border-white/20 hover:bg-white/35 hover:border-white/50 transition-all outline-none"
                      >
                        {lang === "vi" ? "Triết lý xanh của THE INSIDE" : "Our Ecological Values"}
                      </button>
                    </motion.div>

                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Manual Slides Controls */}
        <div className="absolute bottom-6 right-4 sm:right-8 z-20 flex items-center gap-2">
          <button
            onClick={() => setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="p-1.5 sm:p-2.5 rounded-full border border-white/30 text-white bg-black/10 hover:bg-white hover:text-brand-charcoal transition-all"
            aria-label="Hình trước"
            id="hero-prev-btn"
          >
            <ArrowLeft size={16} />
          </button>
          
          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="p-1.5 sm:p-2.5 rounded-full border border-white/30 text-white bg-black/10 hover:bg-white hover:text-brand-charcoal transition-all"
            aria-label="Hình tiếp"
            id="hero-next-btn"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Carousel indicators dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeSlide ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Đi tới hình ${index + 1}`}
            />
          ))}
        </div>

      </section>

      {/* CAMPAIGN BANNER CARD */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand-beige border border-brand-clay/40 shadow-xs">
          
          {/* Subtle Organic Wave background graphics */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-clay/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative px-6 py-10 sm:p-12 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-brand-accent font-semibold tracking-widest text-[10px] sm:text-xs mb-3 uppercase">
                <Sparkles size={14} />
                TRIẾT LÝ TUẦN HOÀN NÔNG NGHIỆP
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-brand-charcoal mb-4 tracking-tight leading-tight">
                Đổi 200g hạt đu đủ khô lấy 1 thỏi son
              </h2>
              <p className="text-sm sm:text-base text-brand-charcoal/70 leading-relaxed font-light">
                Gửi về cho THE INSIDE 200g hạt đu đủ khô ráo bất kỳ sau khi dùng quả để nhận ngay một thỏi son dưỡng thuần chay tuyệt tác hoàn toàn miễn phí. Hạt đu đủ thu hồi sẽ trải qua công nghệ ép lạnh ròng rã lấy enzyme Papain tự nhiên làm khỏe trẻ đôi môi bạn!
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  setRecycleStep(1);
                  setRecycleOpen(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 bg-brand-accent text-white hover:bg-brand-terracotta rounded-full text-xs font-semibold tracking-wider shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 outline-none font-medium animate-pulse cursor-pointer"
                id="campaign-action-btn"
              >
                {lang === "vi" ? "Đăng ký đổi hạt đu đủ khô lấy son" : "Register to trade dry seeds for a balm"}
                <ArrowRight size={13} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND PHILOSOPHY SECTION */}
      <section id="triet-ly" className="py-16 sm:py-24 bg-brand-cream border-y border-brand-clay/35">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-[10px] sm:text-xs font-semibold uppercase text-brand-accent tracking-widest block mb-3">
              {t("navAbout")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-brand-charcoal mb-8 tracking-tight">
              {lang === "vi" ? "Lắng Nghe & Chăm Sóc Thế Giới Bên Trong" : "Nurturing Your Beautiful Inner Universe"}
            </h2>
            
            {/* Triết lý bìa - Gorgeous highlight quote card */}
            <div className="relative bg-brand-beige/50 border border-brand-clay/30 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs">
              <span className="absolute -top-6 left-6 text-7xl font-serif text-brand-accent/20 select-none pointer-events-none">“</span>
              <p className="text-sm sm:text-base md:text-lg text-brand-charcoal/80 leading-relaxed font-serif italic relative z-10">
                {lang === "vi" 
                  ? "Với niềm tin vẻ đẹp bền vững luôn bắt nguồn từ sự hài hòa giữa con người và thiên nhiên, The Inside đưa những giá trị nguyên bản vào các sản phẩm an toàn, lành tính, hướng đến sự cân bằng giữa chăm sóc bản thân và trân trọng thiên nhiên."
                  : "Believing that eternal beauty blossoms from absolute harmony between humans and habitats, The Inside infuses native organic virtues into pure, certified vegan remedies—balancing personal care with environmental respect."}
              </p>
              <span className="absolute -bottom-16 right-6 text-7xl font-serif text-brand-accent/20 select-none pointer-events-none">”</span>
            </div>
          </div>

          {/* Interactive Tabbed Detail Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-12 sm:mt-16 bg-white dark:bg-brand-beige border border-brand-clay/35 rounded-[32px] p-6 sm:p-8 md:p-10 shadow-sm">
            
            {/* Tabs navigation list */}
            <div className="lg:col-span-4 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-2 border-b lg:border-b-0 lg:border-r border-brand-clay/30 pr-0 lg:pr-6 snap-x whitespace-nowrap scrollbar-none">
              {[
                { id: "meaning", label: lang === "vi" ? "Ý Nghĩa Thương Hiệu" : "Brand Essence", icon: "✨" },
                { id: "philosophy", label: lang === "vi" ? "Triết Lý" : "Philosophy", icon: "🍃" },
                { id: "mission", label: lang === "vi" ? "Sứ Mệnh" : "Our Mission", icon: "🌸" },
                { id: "commitment", label: lang === "vi" ? "Cam Kết" : "Our Commitment", icon: "🤝" },
                { id: "values", label: lang === "vi" ? "Giá Trị Cốt Lõi" : "Core Values", icon: "💎" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setBrandTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide transition-all outline-none duration-300 snap-start select-none cursor-pointer ${
                    brandTab === tab.id
                      ? "bg-brand-accent text-white shadow-md shadow-brand-accent/10 lg:translate-x-1"
                      : "text-brand-charcoal/70 hover:text-brand-accent hover:bg-brand-beige/40"
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content display */}
            <div className="lg:col-span-8 lg:pl-6 min-h-[220px] flex items-center">
              <AnimatePresence mode="wait">
                {brandTab === "meaning" && (
                  <motion.div
                    key="meaning"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-charcoal flex items-center gap-2">
                      {lang === "vi" ? "Ý Nghĩa Thương Hiệu" : "Brand Essence"}
                    </h3>
                    <div className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed space-y-4 font-light">
                      {lang === "vi" ? (
                        <>
                          <p>
                            <strong>The Inside</strong> nghĩa là “bên trong” – nơi khởi nguồn của sự cân bằng, chữa lành và vẻ đẹp bền vững. Chúng tôi tin rằng vẻ đẹp thật sự không chỉ đến từ những gì được nhìn thấy bên ngoài, mà bắt đầu từ việc lắng nghe, nuôi dưỡng và chăm sóc thế giới bên trong.
                          </p>
                          <p>
                            Từ ý nghĩa ấy, The Inside ra đời với mong muốn trở thành người bạn đồng hành trên hành trình quay về với chính mình. Trong nhịp sống hiện đại đầy áp lực và vội vã, chúng tôi mong muốn mang đến những sản phẩm giúp con người tìm lại sự kết nối với thiên nhiên và với bản thân, từ những điều giản dị và thuần khiết nhất.
                          </p>
                          <p>
                            Thiên nhiên luôn chứa đựng những nguồn dưỡng chất quý giá. Từ các loại hạt, thảo mộc, hoa lá và trái cây, mỗi nguyên liệu đều mang trong mình những giá trị riêng được chắt lọc qua thời gian. Chính vì thế, The Inside lựa chọn khai thác và phát triển các sản phẩm từ các nguồn nguyên liệu thiên nhiên, lành tính và gần gũi, với mong muốn đem đến sự chăm sóc dịu dàng nhưng hiệu quả cho cơ thể và tâm hồn.
                          </p>
                          <p>
                            Đối với chúng tôi, mỗi sản phẩm không chỉ là một giải pháp chăm sóc cá nhân mà còn là lời nhắc nhở dành thời gian cho bản thân, lắng nghe những nhu cầu từ bên trong và nuôi dưỡng chúng bằng những điều tốt đẹp nhất từ thiên nhiên.
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>The Inside</strong> represents the spiritual core - the sanctuary of deep balance, organic healing, and sustainable beauty. We champion that genuine beauty originates not from superficial layers, but from listening to and cherishing the internal self.
                          </p>
                          <p>
                            Guided by this purpose, The Inside is crafted as an eco-conscious companion on your quest back to self. Amidst an intense, high-speed modern lifestyle, we supply soothing botanical rituals to restore harmony inside and out.
                          </p>
                          <p>
                            Mother Earth hosts spectacular restorative properties in her crops. By extracting active compounds from organic seeds, natural fruits, and cold-pressed botanical oils, we cultivate targeted skin safety with profound results.
                          </p>
                          <p>
                            Each balm acts as a daily reminder to pause, look inward, and treat your skin to biological kindness harvested sustainably in certified cooperatives.
                          </p>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}

                {brandTab === "philosophy" && (
                  <motion.div
                    key="philosophy"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-charcoal flex items-center gap-2">
                      {lang === "vi" ? "Triết Lý Thương Hiệu" : "Our Brand Philosophy"}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed font-light">
                      {lang === "vi" 
                        ? "Chúng tôi tin rằng vẻ đẹp bền vững được hình thành từ sự hài hòa giữa con người và thiên nhiên. Chúng tôi xem thiên nhiên không chỉ là nguồn nguyên liệu vô giá mà còn là người bạn đồng hành trong hành trình nuôi dưỡng sức khỏe và vẻ đẹp từ bên trong. Vì vậy, The Inside không chỉ mong muốn mang đến các sản phẩm an toàn, lành tính mà còn hướng đến một lối sống cân bằng, nơi việc chăm sóc bản thân song hành cùng sự trân trọng thiên nhiên."
                        : "We carry a stellar conviction that personal wellness is indissoluble from habitat preservation. Nature isn't merely an extraction library, but an eternal partner that replenishes our biological rhythms. Safe, non-toxic cosmetic choices are simply the gateway to a holistic, balanced lifestyle."}
                    </p>
                  </motion.div>
                )}

                {brandTab === "mission" && (
                  <motion.div
                    key="mission"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-charcoal flex items-center gap-2">
                      {lang === "vi" ? "Sứ Mệnh Thương Hiệu" : "Our Brand Mission"}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed font-light">
                      {lang === "vi"
                        ? "The Inside được sinh ra với sứ mệnh chăm sóc sức khỏe và vẻ đẹp của con người bằng những sản phẩm có nguồn gốc từ thiên nhiên, được nghiên cứu và thử nghiệm kỹ lưỡng nhằm đảm bảo tính an toàn, lành tính và hiệu quả. Chúng tôi không ngừng tìm kiếm và phát huy những giá trị quý giá để tạo nên các giải pháp chăm sóc bền vững, phù hợp với nhu cầu của người tiêu dùng. Với The Inside, mỗi sản phẩm không chỉ là chăm sóc mà còn thể hiện sự tận tâm trong hành trình mang những giá trị tốt đẹp nhất từ thiên nhiên đến con người."
                        : "Our mission is to serve skin vitality on a silver plate of botanical brilliance, executing meticulously research-backed formulations that prove skin healing doesn't require harsh chemical lead compounds. We honor native crops, empower smallholder farmers, and promote certified vegan integrity in Southeast Asia."}
                    </p>
                  </motion.div>
                )}

                {brandTab === "commitment" && (
                  <motion.div
                    key="commitment"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-charcoal flex items-center gap-2">
                      {lang === "vi" ? "Cam Kết Từ The Inside" : "Our Safety Pledge"}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed font-light">
                      {lang === "vi"
                        ? "Chúng tôi cam kết không thử nghiệm trên động vật, sử dụng các thành phần thuần chay và ưu tiên những nguyên liệu có nguồn gốc rõ ràng, an toàn cho làn da. Chúng tôi luôn nghiên cứu và kiểm nghiệm cẩn trọng để mang đến những sản phẩm chất lượng, lành tính và đáng tin cậy cho người tiêu dùng."
                        : "We operate with a absolute cruelty-free structure: no animal-derived testing, utilizing exclusively vegan-friendly botanical chemistry, and prioritizing organic hand-harvested native sourcing. Transparent labels and clean, toxicological security are our lifetime promise to you."}
                    </p>
                  </motion.div>
                )}

                {brandTab === "values" && (
                  <motion.div
                    key="values"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 w-full"
                  >
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-charcoal flex items-center gap-2">
                      {lang === "vi" ? "Giá Trị Cốt Lõi" : "Core Values"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {[
                        {
                          num: "01",
                          title: lang === "vi" ? "Thiên nhiên làm gốc" : "Nature Bound First",
                          desc: lang === "vi" ? "Lấy thiên nhiên làm gốc, hướng đến sản phẩm thuần Việt, an toàn và lành tính cho làn da." : "We establish pure organic earth as our base, designing clean products for skin healing.",
                        },
                        {
                          num: "02",
                          title: lang === "vi" ? "Giá trị vùng miền" : "Regional Soil",
                          desc: lang === "vi" ? "Giữ gìn và lan tỏa giá trị vùng miền Việt Nam qua từng sản phẩm." : "Sustaining and preserving regional crop values through fair-trade Vietnamese farming.",
                        },
                        {
                          num: "03",
                          title: lang === "vi" ? "Sản xuất trách nhiệm" : "Ethical Lifecycle",
                          desc: lang === "vi" ? "Sản xuất có trách nhiệm, vì con người, cộng đồng và môi trường." : "Responsible, minor-impact carbon manufacturing that respects communities and ecosystems.",
                        },
                      ].map((val) => (
                        <div key={val.num} className="bg-brand-beige/40 border border-brand-clay/35 rounded-2xl p-5 space-y-3">
                          <span className="font-mono text-2xl font-bold text-brand-accent/50 block">{val.num}</span>
                          <h4 className="text-xs font-bold tracking-wide text-brand-charcoal uppercase">{val.title}</h4>
                          <p className="text-[11px] sm:text-xs text-brand-charcoal/70 leading-relaxed font-light">{val.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>



      {/* BEST SELLER PRODUCTS GRID */}
      <section id="san-pham" className="py-16 sm:py-24 bg-brand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
            <div className="max-w-xl">
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-brand-accent tracking-widest block mb-3">
                {t("productSectionTag")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-brand-charcoal mb-4">
                {t("productSectionTitle")}
              </h2>
              <p className="text-sm text-brand-charcoal/60 leading-relaxed font-light">
                {lang === "vi" 
                  ? "Công thức khóa ẩm vượt trội kết hợp hoàn hảo cùng nông sản Việt organic hái tay cho môi căng tràn sức sống mộc mạc ban ngày lẫn ban đêm ngủ say." 
                  : "Ultra-hydrating formulas seamlessly blended with organic hand-harvested Vietnamese crops for plump, revitalized lips day and night."}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-4 text-xs font-medium text-brand-charcoal/70">
              <p className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                {lang === "vi" ? "100% Thuần chay (Vegan)" : "100% Vegan Certified"}
              </p>
              <p className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                {lang === "vi" ? "Không chứa hóa chì độc hại" : "Lead-free & Safe Formula"}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-brand-cream border border-brand-clay/30 rounded-3xl overflow-hidden hover:shadow-xl hover:border-brand-accent/50 transition-all duration-300 group cursor-pointer flex flex-col justify-between w-full max-w-sm"
                id={`product-card-${product.id}`}
              >
                
                {/* Images Container */}
                <div className="relative aspect-square overflow-hidden bg-brand-beige">
                  <img
                    src={product.image}
                    alt={lang === "vi" ? product.name : (product.nameEn || product.name)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Rating stamp left-top */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-white/95 rounded-full text-[9px] font-bold tracking-wider text-brand-charcoal flex items-center gap-0.5 shadow-xs">
                    <Star size={10} className="fill-amber-500 text-amber-500" />
                    {product.rating}
                  </div>

                  {/* Discount Promo Badge / Tem giảm giá */}
                  {product.originalPrice && (
                    <div className="absolute top-11 left-3 px-2.5 py-1 bg-red-600 text-white rounded-full text-[9px] font-bold tracking-wide uppercase shadow-md animate-pulse z-10">
                      {lang === "vi" ? "GIẢM 30%" : "30% OFF"}
                    </div>
                  )}

                  {/* Heart Icon like right-top */}
                  <button
                    onClick={(e) => toggleFavorite(product.id, e)}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-brand-accent hover:text-white text-brand-charcoal/80 flex items-center justify-center transition-colors shadow-xs"
                    aria-label="Thêm vào danh sách yêu thích"
                    id={`fav-btn-for-${product.id}`}
                  >
                    <Heart
                      size={15}
                      className={favorites.includes(product.id) ? "fill-brand-accent text-brand-accent group-hover:text-white" : ""}
                    />
                  </button>

                  {/* Quick-view notice overlay */}
                  <div className="absolute inset-0 bg-brand-charcoal/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-4 py-2 bg-brand-cream/95 backdrop-blur-xs text-[10px] uppercase font-bold tracking-wider rounded-full shadow-md text-brand-charcoal transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {lang === "vi" ? "Xem Chi Tiết Thỏi Son" : "Quick View Details"}
                    </span>
                  </div>
                </div>

                {/* Info Text Area */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <span className="text-[10px] text-brand-accent font-semibold tracking-widest block mb-1 uppercase">
                      {lang === "vi" ? "SON DƯỠNG MÔI CHUYÊN SÂU" : "DAILY LUSH RECOVERY"}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-brand-charcoal group-hover:text-brand-accent transition-colors line-clamp-1">
                      {lang === "vi" ? product.name : (product.nameEn || product.name)}
                    </h3>
                    <p className="text-xs text-brand-charcoal/60 leading-relaxed font-light line-clamp-2 mt-1">
                      {lang === "vi" ? product.subtitle : (product.subtitleEn || product.subtitle)}
                    </p>
                  </div>

                  <div>
                    {/* Price in VND */}
                    <div className="flex items-center justify-between border-t border-brand-clay/35 pt-4">
                      <div>
                        {product.originalPrice ? (
                          <div className="flex flex-col">
                            <span className="text-[10px] text-brand-charcoal/40 line-through">
                              {product.originalPrice.toLocaleString("vi-VN")}₫
                            </span>
                            <span className="font-sans font-extrabold text-brand-accent flex items-center gap-1">
                              {product.price.toLocaleString("vi-VN")}₫
                              <span className="text-[8px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-bold font-mono">
                                -30%
                              </span>
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[10px] text-brand-charcoal/40 block">{t("productPriceLabel")}</span>
                            <span className="font-sans font-bold text-base text-brand-charcoal">
                              {product.price.toLocaleString("vi-VN")}₫
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Cart Add Button */}
                      <button
                        onClick={(e) => addToCart(product, e)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-accent hover:bg-brand-terracotta text-white transition-colors shadow-xs outline-none"
                        title={lang === "vi" ? "Thêm vào giỏ" : "Add to Cart"}
                        id={`add-btn-for-${product.id}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY OF INGREDIENT INTERACTIVE */}
      <section id="nguyen-lieu" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] sm:text-xs font-semibold uppercase text-brand-accent tracking-widest block mb-3">
            {t("ingSectionTag")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-brand-charcoal">
            {t("ingSectionTitle")}
          </h2>
          <p className="text-sm text-brand-charcoal/60 leading-relaxed font-light mt-3">
            {t("ingSectionDesc")}
          </p>
        </div>

        {/* Icons row (circular cards) */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-12 mb-12">
          {INGREDIENTS.map((ing) => {
            const isSelected = selectedIngredient?.id === ing.id;
            return (
              <button
                key={ing.id}
                onClick={() => setSelectedIngredient(ing)}
                className="flex flex-col items-center group focus:outline-none"
                id={`ingredient-tab-${ing.id}`}
              >
                <div
                  className={`relative h-20 w-20 sm:h-24 sm:w-24 rounded-full p-1 border-2 transition-all duration-300 ${
                    isSelected
                      ? "border-brand-accent scale-105 shadow-md"
                      : "border-brand-clay/40 hover:border-brand-accent/50 hover:scale-103"
                  }`}
                >
                  <img
                    src={ing.image}
                    alt={lang === "vi" ? ing.name : (ing.nameEn || ing.name)}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <div
                    className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                      isSelected ? "opacity-0" : "bg-black/10 group-hover:opacity-0"
                    }`}
                  />
                </div>
                
                <span
                  className={`mt-3 text-xs sm:text-sm tracking-wider font-semibold uppercase transition-colors ${
                    isSelected ? "text-brand-accent" : "text-brand-charcoal/70 group-hover:text-brand-accent"
                  }`}
                >
                  {lang === "vi" ? ing.name : (ing.nameEn || ing.name)}
                </span>
                
                <div
                  className={`h-1 w-5 rounded-full bg-brand-accent transition-all mt-1 duration-300 ${
                    isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Selected Interactive Detail Section */}
        <AnimatePresence mode="wait">
          {selectedIngredient && (
            <motion.div
              key={selectedIngredient.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="bg-brand-beige border border-brand-clay/35 rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row gap-8 items-center"
              id="selected-ingredient-display"
            >
              
              {/* Product background circle art */}
              <div className="relative w-40 h-40 sm:w-56 sm:h-56 flex-shrink-0">
                <div
                  className="absolute inset-0 rounded-full scale-105 animate-pulse"
                  style={{ backgroundColor: selectedIngredient.accentColor }}
                />
                <img
                  src={selectedIngredient.image}
                  alt={lang === "vi" ? selectedIngredient.name : (selectedIngredient.nameEn || selectedIngredient.name)}
                  className="w-full h-full object-cover rounded-full shadow-md border-2 border-white relative z-10"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text detail */}
              <div className="flex-1 space-y-4">
                
                <div className="inline-flex px-3 py-1 bg-brand-accent/10 rounded-full text-[10px] text-brand-accent tracking-widest font-semibold uppercase">
                  {lang === "vi" 
                    ? `Hợp chất chính: ${selectedIngredient.keyCompound}` 
                    : `Key compound: ${selectedIngredient.keyCompoundEn || selectedIngredient.keyCompound}`}
                </div>
                
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-brand-charcoal">
                  {lang === "vi" 
                    ? `Món quà tự nhiên từ trái cây ${selectedIngredient.name}` 
                    : `Pure gift of nature from organic ${selectedIngredient.nameEn || selectedIngredient.name}`}
                </h3>
                
                <p className="text-sm sm:text-base text-brand-charcoal/80 leading-relaxed font-light">
                  {lang === "vi" ? selectedIngredient.description : (selectedIngredient.descriptionEn || selectedIngredient.description)}
                </p>

                <div className="border-t border-brand-clay/30 pt-4 mt-2">
                  <h4 className="text-[10px] font-bold tracking-widest text-brand-charcoal/50 uppercase mb-2">
                    {lang === "vi" ? "LỢI ÍCH SỬ DỤNG CHO ĐÔI MÔI" : "LIP HEALING BENEFITS"}
                  </h4>
                  <p className="text-xs sm:text-sm text-brand-accent font-semibold leading-relaxed">
                    🌟 {lang === "vi" ? selectedIngredient.benefit : (selectedIngredient.benefitEn || selectedIngredient.benefit)}
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="#san-pham"
                    className="inline-flex items-center text-xs font-bold text-brand-accent hover:text-brand-terracotta transition-colors group-hover:translate-x-1 duration-200"
                  >
                    {lang === "vi" ? "Xem sản phẩm chứa nguyên liệu này" : "Shop product containing this ingredient"}
                    <ArrowRight size={13} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </section>

      {/* RECYCLING PROGRAM PROMO STEP */}
      <section className="py-12 bg-brand-accent text-brand-cream text-center relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-[-20%] left-[-10%] w-60 h-60 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-60 h-60 rounded-full bg-white/5 blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <p className="text-[10px] uppercase font-bold tracking-widest text-brand-clay/80">THE INSIDE ECO-CONSCIOUS SPIRIT</p>
          <blockquote className="font-serif text-xl sm:text-2xl font-light italic leading-relaxed">
            {lang === "vi" 
              ? '"Chúng tôi đi tìm sự lộng lẫy từ những điều mộc mạc nhất, và cam kết trả lại cho Đất mẹ vị ngọt lành vẹn nguyên ban đầu."'
              : '"We seek splendor in the simplest of components, dreaming of gifting back to Mother Earth her pristine, untouched sweetness."'}
          </blockquote>
          <p className="text-xs text-brand-cream/70 font-light">
            {lang === "vi" ? "— Sáng lập viên THE INSIDE Beauty Co." : "— Founder, THE INSIDE Beauty Co."}
          </p>
        </div>
      </section>

      {/* BLOG / NEWS SECTION */}
      <section id="bai-viet" className="py-16 sm:py-24 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-[10px] sm:text-xs font-semibold uppercase text-brand-accent tracking-widest block mb-3">
              {t("blogSectionTag")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-brand-charcoal">
              {t("blogSectionTitle")}
            </h2>
            <p className="text-sm text-brand-charcoal/60 leading-relaxed font-light mt-3">
              {lang === "vi" 
                ? "Cập nhật những xu thế chăm sóc đôi môi hữu cơ và các kiến thức khoa học lành tính từ chuyên gia hàng đầu."
                : "Discover pure holistic lip rituals and clean skin science published daily by dermatological experts."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTICLES.map((article) => (
              <article
                key={article.id}
                className="bg-brand-beige border border-brand-clay/30 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                id={`article-card-${article.id}`}
              >
                <div>
                  
                  {/* Article Card Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-brand-clay/20">
                    <img
                      src={article.image}
                      alt={lang === "vi" ? article.title : (article.titleEn || article.title)}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    
                    <span className="absolute bottom-3 left-3 bg-brand-cream/95 backdrop-blur-xs text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 text-brand-charcoal rounded-full shadow-xs">
                      {lang === "vi" ? article.readingTime : (article.readingTimeEn || article.readingTime)}
                    </span>
                  </div>

                  {/* Article Text Content */}
                  <div className="p-6">
                    <span className="text-[10px] text-brand-charcoal/40 font-semibold uppercase block mb-1">
                      {lang === "vi" ? article.date : (article.dateEn || article.date)}
                    </span>
                    
                    <h3 className="font-serif text-lg font-bold text-brand-charcoal mb-3 line-clamp-2 hover:text-brand-accent transition-colors">
                      {lang === "vi" ? article.title : (article.titleEn || article.title)}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed font-light line-clamp-3">
                      {lang === "vi" ? article.excerpt : (article.excerptEn || article.excerpt)}
                    </p>
                  </div>

                </div>

                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="inline-flex items-center text-xs font-bold text-brand-accent hover:text-brand-terracotta group"
                    id={`read-article-btn-${article.id}`}
                  >
                    {lang === "vi" ? "Đọc thêm bài viết" : "Read Full Article"}
                    <ArrowRight size={12} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

              </article>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer id="lien-he" className="bg-[#1C1613] dark:bg-[#0E0C0B] text-[#ECE5DF]/80 pt-16 pb-12 border-t border-[#31231C] dark:border-brand-clay/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            
            {/* Logo/Info column */}
            <div className="md:col-span-2 space-y-4">
              <span className="font-serif text-2xl font-bold tracking-widest text-white block">
                THE INSIDE
              </span>
              <p className="text-xs text-[#ECE5DF]/60 leading-relaxed max-w-sm">
                {lang === "vi" 
                  ? "Chúng tôi tự hào là đơn vị tiên phong kiến tạo nên dòng son dưỡng hữu cơ cao cấp đại diện cho nhan sắc thiện lương, thuần chay Việt Nam."
                  : "We are proud pioneers of high-end organic lip balms, celebrating certified vegan beauty and clean Vietnamese botany."}
              </p>
              
              <div className="space-y-2 pt-2 text-xs">
                <p className="flex items-center gap-2">
                  <span className="text-brand-accent">✦</span>
                  <strong>THE INSIDE Beauty Co.</strong>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-brand-accent">✦</span>
                  {lang === "vi" ? "Hotline" : "Support Hotline"}: 1900 1234
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-brand-accent">✦</span>
                  Email: <a href="mailto:hello@theinside.vn" className="hover:text-white underline">hello@theinside.vn</a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-brand-accent">✦</span>
                  {lang === "vi" ? "Văn phòng: Ngũ Hành Sơn, Tp. Đà Nẵng, Việt Nam" : "Office: Ngu Hanh Son Dist, Da Nang City, Vietnam"}
                </p>
              </div>
            </div>

            {/* Quick Links support */}
            <div>
              <h4 className="font-serif text-white text-sm font-semibold tracking-wider uppercase mb-5">
                {lang === "vi" ? "HỖ TRỢ KHÁCH HÀNG" : "CUSTOMER SERVICE"}
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a
                    href="#faq"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      addToast(lang === "vi" ? "Chuyên trang Câu Hỏi Thường Gặp đang được dịch chuyển!" : "The FAQ Center is currently migrating here!"); 
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {lang === "vi" ? "Hỏi đáp" : "FAQs"}
                  </a>
                </li>
                <li>
                  <a
                    href="#huong-dan"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      addToast(lang === "vi" ? "Chính sách mua mẫu dùng thử đang cập nhật!" : "Trial specimen policies are being finalized!"); 
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {lang === "vi" ? "Hướng dẫn mua hàng" : "Purchase Guide"}
                  </a>
                </li>
                <li>
                  <a
                    href="#chinh-sach"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      addToast(lang === "vi" ? "Chính sách miễn phí vận chuyển quốc nội!" : "Free local tracking shipping applied!"); 
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {lang === "vi" ? "Chính sách bán hàng" : "Terms & Conditions"}
                  </a>
                </li>
                <li>
                  <a
                    href="#bao-mat"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      addToast(lang === "vi" ? "Điều khoản mã hóa bảo mật chuẩn SSL!" : "SSL secure encryptions verified!"); 
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {lang === "vi" ? "Điều khoản bảo mật" : "Privacy Policy"}
                  </a>
                </li>
                <li>
                  <a
                    href="#khieu-nai"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      addToast(lang === "vi" ? "Tổng đài khiếu nại hoạt động 24/7." : "Hotline dispatch desk is open 24/7."); 
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {lang === "vi" ? "Khiếu nại" : "Feedback & Dispute"}
                  </a>
                </li>
                <li>
                  <a
                    href="#lien-he"
                    className="hover:text-white transition-colors"
                  >
                    {lang === "vi" ? "Liên hệ" : "Contact Us"}
                  </a>
                </li>
              </ul>
            </div>

            {/* Social channels / Newsletter */}
            <div className="space-y-5">
              <h4 className="font-serif text-white text-sm font-semibold tracking-wider uppercase">
                {lang === "vi" ? "THEO DÕI CHÚNG TÔI" : "FOLLOW US"}
              </h4>
              
              {/* Simple Social media icons bar */}
              <div className="flex gap-4">
                <a
                  href="#facebook"
                  onClick={(e) => { e.preventDefault(); addToast(lang === "vi" ? "Đang kết nối Facebook THE INSIDE" : "Connecting to THE INSIDE Facebook..."); }}
                  className="h-8 w-8 rounded-full border border-white/10 hover:border-white hover:text-white flex items-center justify-center transition-all bg-white/5"
                  aria-label="Facebook"
                >
                  <span className="text-xs font-bold font-sans">FB</span>
                </a>
                <a
                  href="#instagram"
                  onClick={(e) => { e.preventDefault(); addToast(lang === "vi" ? "Đang kết nối Instagram THE INSIDE" : "Connecting to THE INSIDE Instagram..."); }}
                  className="h-8 w-8 rounded-full border border-white/10 hover:border-white hover:text-white flex items-center justify-center transition-all bg-white/5"
                  aria-label="Instagram"
                >
                  <span className="text-xs font-bold font-sans">IG</span>
                </a>
                <a
                  href="#tiktok"
                  onClick={(e) => { e.preventDefault(); addToast(lang === "vi" ? "Đang kết nối TikTok THE INSIDE" : "Connecting to THE INSIDE TikTok..."); }}
                  className="h-8 w-8 rounded-full border border-white/10 hover:border-white hover:text-white flex items-center justify-center transition-all bg-white/5"
                  aria-label="TikTok"
                >
                  <span className="text-xs font-bold font-sans">TT</span>
                </a>
                <a
                  href="#youtube"
                  onClick={(e) => { e.preventDefault(); addToast(lang === "vi" ? "Đang kết nối YouTube THE INSIDE" : "Connecting to THE INSIDE YouTube..."); }}
                  className="h-8 w-8 rounded-full border border-white/10 hover:border-white hover:text-white flex items-center justify-center transition-all bg-white/5"
                  aria-label="YouTube"
                >
                  <span className="text-xs font-bold font-sans">YT</span>
                </a>
              </div>

              {/* Newsletter interactive signup */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-white/50 tracking-widest block font-bold">
                  {lang === "vi" ? "ĐĂNG KÝ BẢN TIN CHỮA LÀNH MÔI" : "SIGN UP FOR ORGANIC LIP TIPS"}
                </span>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addToast(lang === "vi" 
                      ? "Chúc mừng! Bạn đã đăng ký bản tin của THE INSIDE thành công." 
                      : "Bravo! You've successfully subscribed to THE INSIDE newsletter.");
                    (e.target as HTMLFormElement).reset();
                  }}
                  className="relative flex items-center"
                >
                  <input
                    type="email"
                    required
                    placeholder={lang === "vi" ? "Nhập email của bạn..." : "Enter your email address..."}
                    className="w-full bg-white/11 text-xs px-4 py-2.5 rounded-full text-white placeholder-[#ECE5DF]/40 focus:outline-none focus:bg-white/15 focus:ring-1 focus:ring-brand-accent transition-all pr-12 border-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 text-white bg-brand-accent hover:bg-brand-terracotta transition-colors h-7 w-7 rounded-full flex items-center justify-center cursor-pointer"
                    aria-label="Gửi bản đăng ký"
                  >
                    <Check size={12} />
                  </button>
                </form>
              </div>

            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#ECE5DF]/45">
            <p>© 2026 THE INSIDE. {lang === "vi" ? "Toàn bộ bản quyền tác giả được bảo lưu." : "All rights reserved throughout the cosmos."}</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="#toc" onClick={(e) => e.preventDefault()} className="hover:text-white">{lang === "vi" ? "Điều khoản vận hành" : "Terms of Service"}</a>
              <span>•</span>
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white">{lang === "vi" ? "An toàn sinh thái" : "Ecological Footprint"}</a>
            </div>
          </div>

        </div>
      </footer>

      {/* TOAST SYSTEM POPUPS */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 border pointer-events-auto ${
                toast.type === "success"
                  ? "bg-brand-charcoal text-white border-white/10"
                  : "bg-brand-beige text-brand-charcoal border-brand-clay"
              }`}
            >
              <div className="h-6 w-6 rounded-full bg-brand-accent flex items-center justify-center text-xs flex-shrink-0 text-white font-bold">
                ✓
              </div>
              <p className="text-xs font-medium leading-relaxed">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 pointer-events-auto"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-brand-cream border border-brand-clay w-full max-w-2xl rounded-3xl p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between gap-4 border-b border-brand-clay/35 pb-4 mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search size={18} className="text-brand-charcoal/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nhập tên sản phẩm son hoặc nguyên liệu (vd: Đu đủ, Dầu dừa...)"
                    className="w-full bg-transparent text-sm text-brand-charcoal focus:outline-none placeholder-brand-charcoal/40 border-none"
                    autoFocus
                  />
                </div>
                
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-1 rounded-full hover:bg-brand-beige text-brand-charcoal"
                  id="search-close-btn"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Live search results */}
              <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
                {searchQuery.trim() === "" ? (
                  <div className="text-center py-6 text-xs text-brand-charcoal/40 font-light">
                    Hệ thống đề xuất xu hướng: <span className="font-semibold text-brand-accent underline cursor-pointer" onClick={() => setSearchQuery("Đu đủ")}>Đu đủ</span>, <span className="font-semibold text-brand-accent underline cursor-pointer" onClick={() => setSearchQuery("Dầu dừa")}>Dải dừa</span>, <span className="font-semibold text-brand-accent underline cursor-pointer" onClick={() => setSearchQuery("Dâu tằm")}>Dâu tằm Sapa</span>.
                  </div>
                ) : (
                  <>
                    {/* Products matches */}
                    {filteredProducts.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold tracking-widest text-brand-charcoal/40 uppercase mb-2">
                          SẢN PHẨM PHÙ HỢP ({filteredProducts.length})
                        </h4>
                        <div className="space-y-2">
                          {filteredProducts.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => {
                                setSelectedProduct(p);
                                setSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="flex items-center justify-between p-2 rounded-2xl hover:bg-brand-beige cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="h-10 w-10 object-cover rounded-xl"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <p className="text-xs font-bold text-brand-charcoal">{p.name}</p>
                                  <p className="text-[10px] text-brand-charcoal/50">{p.subtitle}</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-brand-accent">
                                {p.price.toLocaleString("vi-VN")}₫
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Articles matches */}
                    {filteredArticles.length > 0 && (
                      <div className="border-t border-brand-clay/35 pt-4">
                        <h4 className="text-[10px] font-bold tracking-widest text-brand-charcoal/40 uppercase mb-2">
                          BÀI VIẾT PHÙ HỢP ({filteredArticles.length})
                        </h4>
                        <div className="space-y-2">
                          {filteredArticles.map((a) => (
                            <div
                              key={a.id}
                              onClick={() => {
                                setSelectedArticle(a);
                                setSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="p-2 rounded-2xl hover:bg-brand-beige cursor-pointer transition-colors"
                            >
                              <p className="text-xs font-semibold text-brand-charcoal line-clamp-1">{a.title}</p>
                              <p className="text-[10px] text-brand-charcoal/50 line-clamp-1">{a.excerpt}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredProducts.length === 0 && filteredArticles.length === 0 && (
                      <div className="text-center py-8 text-xs text-brand-charcoal/50">
                        Rất tiếc, THE INSIDE tìm kiếm không ra kết quả phù hợp cho "{searchQuery}".
                      </div>
                    )}
                  </>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHOPPING CART SIDE DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 pointer-events-auto"
              onClick={() => {
                setCartOpen(false);
                setIsCheckingOut(false);
                setCheckoutStep(1);
              }}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full sm:max-w-md h-full bg-brand-cream shadow-2xl flex flex-col justify-between"
            >
              
              {/* Cart Drawer Header */}
              <div className="p-6 border-b border-brand-clay/30 flex items-center justify-between bg-brand-beige/50">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-brand-accent" />
                  <span className="font-serif text-lg font-bold text-brand-charcoal">
                    Giỏ hàng của bạn ({getCartCount()})
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    setCartOpen(false);
                    setIsCheckingOut(false);
                    setCheckoutStep(1);
                  }}
                  className="p-1 rounded-full hover:bg-brand-beige text-brand-charcoal"
                  id="checkout-close-btn"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {/* Checkout Success screen */}
                {isCheckingOut && checkoutStep === 2 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-3xl">
                      ✓
                    </div>
                    <h3 className="font-serif text-xl font-bold text-brand-charcoal">Thanh toán hoàn tất thành công!</h3>
                    <p className="text-xs text-brand-charcoal/60 max-w-xs leading-relaxed font-light">
                      Cảm ơn quý khách <strong>{checkoutForm.name}</strong> đã đặt trọn lòng tin mua sắm sinh thái tại THE INSIDE. Thỏi son dưỡng của bạn đang được kỹ sư hân hoan đóng hộp bã mía tự hủy để gửi đến địa chỉ <em>{checkoutForm.address}</em>. Tổng đài viên sẽ phản hồi gọi xác thực trong giây lát!
                    </p>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        setIsCheckingOut(false);
                        setCheckoutStep(1);
                        setCheckoutForm({ name: "", phone: "", address: "" });
                      }}
                      className="px-6 py-2.5 bg-brand-accent text-white rounded-full text-xs font-semibold tracking-wider hover:bg-brand-terracotta"
                    >
                      Tiếp tục hành trình xanh
                    </button>
                  </div>
                ) : isCheckingOut ? (
                  
                  /* Cart Checkout Form */
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div className="p-4 bg-brand-beige/80 rounded-2xl space-y-3 border border-brand-clay/30">
                      <h4 className="text-xs font-bold tracking-wider text-brand-accent flex items-center gap-1">
                        <Sparkles size={13} fill="currentColor" />
                        THÔNG TIN GIAO HÀNG ĐẶT TRỰC TUYẾN
                      </h4>
                      <p className="text-[11px] text-brand-charcoal/60 leading-relaxed font-light">
                        Chúng tôi hỗ trợ chuyển phát nhanh Free Ship toàn quốc và phương thức nhận hàng thanh toán tận tâm COD (thanh toán khi nhận hàng).
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-charcoal/50 block">HỌ VÀ TÊN NGƯỜI NHẬN</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.name}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full bg-brand-beige px-4 py-2.5 rounded-full text-xs text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-charcoal/50 block">SỐ ĐIỆN THOẠI LIÊN LẠC</label>
                      <input
                        type="tel"
                        required
                        value={checkoutForm.phone}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                        placeholder="Số máy: 09xx xxx xxx"
                        className="w-full bg-brand-beige px-4 py-2.5 rounded-full text-xs text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-charcoal/50 block">ĐỊA CHỈ NHẬN HÀNG CHÍNH XÁC</label>
                      <textarea
                        required
                        rows={3}
                        value={checkoutForm.address}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                        placeholder="Số nhà, Tên đường, Phường, Quận, Thành phố..."
                        className="w-full bg-brand-beige px-4 py-2.5 rounded-2xl text-xs text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>

                    <div className="pt-4 flex border-t border-brand-clay/35 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsCheckingOut(false)}
                        className="flex-1 py-3 border border-brand-clay text-brand-charcoal font-semibold rounded-full text-xs tracking-wider uppercase hover:bg-brand-beige"
                      >
                        Quay lại
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-brand-accent text-white font-semibold rounded-full text-xs tracking-wider uppercase hover:bg-brand-terracotta"
                      >
                        HOÀN TẤT ĐẶT HÀNG
                      </button>
                    </div>
                  </form>
                ) : cart.length === 0 ? (
                  
                  /* Empty state */
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="text-4xl">🍃</div>
                    <p className="text-sm font-semibold text-brand-charcoal/80">Giỏ hàng của bạn đang trống trải</p>
                    <p className="text-[11px] text-brand-charcoal/50 max-w-xs px-4">Hãy khám phá dòng son dưỡng từ nông sản nước Nam cao cấp để nâng chở bờ môi thô ráp ẩm mượt tức thì bạn ơi!</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="px-6 py-2 bg-brand-accent text-white hover:bg-brand-terracotta rounded-full text-xs font-semibold tracking-wider transition-colors outline-none"
                    >
                      Bắt đầu mua sắm ngay
                    </button>
                  </div>
                ) : (
                  
                  /* Cart Listings */
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between p-3 bg-brand-beige/40 border border-brand-clay/30 rounded-2xl gap-3"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-14 w-14 object-cover rounded-xl bg-brand-beige"
                          referrerPolicy="no-referrer"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-brand-charcoal truncate">{item.product.name}</p>
                          <p className="text-[10px] text-brand-accent font-semibold">{item.product.price.toLocaleString("vi-VN")}₫</p>
                          
                          {/* Quantity control box */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, -1)}
                              className="h-6 w-6 rounded-full bg-brand-clay/20 hover:bg-brand-clay/50 flex items-center justify-center text-brand-charcoal/80"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, 1)}
                              className="h-6 w-6 rounded-full bg-brand-clay/20 hover:bg-brand-clay/50 flex items-center justify-center text-brand-charcoal/80"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 justify-between h-14">
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-brand-charcoal/40 hover:text-brand-accent transition-colors"
                            aria-label={`Xóa ${item.product.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                          <span className="text-xs font-bold text-brand-charcoal">
                            {(item.product.price * item.quantity).toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Drawer Footer (Only when listing products) */}
              {!isCheckingOut && cart.length > 0 && (
                <div className="p-6 border-t border-brand-clay/30 bg-brand-beige/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-brand-charcoal">Tổng cộng tạm tính</p>
                      <p className="text-[11px] text-brand-charcoal/40 font-light">Đã bao gồm hoàn toàn thuế VAT và Freeship</p>
                    </div>
                    <span className="text-xl font-bold text-brand-accent">
                      {getTotalCartPrice().toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-2xl flex gap-2 items-center border border-emerald-100/60">
                    <span className="text-xs">🌿</span>
                    <p className="text-[10px] text-emerald-800 leading-normal font-light">
                      Lựa chọn son dưỡng thuần chay THE INSIDE đang cắt giảm trực tiếp 1.2kg carbon đóng hộp bao bì mỡ cừu nhựa công nghiệp độc hại.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full py-3.5 bg-brand-accent hover:bg-brand-terracotta text-white font-bold rounded-full text-xs uppercase tracking-wider text-center transition-colors shadow-md hover:shadow-lg outline-none"
                  >
                    Tiến hành mua hàng an toàn
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RECYCLE CAMPAIGN DETAILS MODAL */}
      <AnimatePresence>
        {recycleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 pointer-events-auto"
              onClick={() => setRecycleOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-brand-cream border border-brand-clay w-full max-w-xl rounded-4xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
            >
              {/* Top border decor green line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600" />

              <div className="flex items-center justify-between pb-4 border-b border-brand-clay/35 mb-6">
                <span className="font-serif text-lg font-bold text-brand-charcoal flex items-center gap-2">
                  ♻️ Triết lý: Đổi 200g Hạt Đu Đủ Khô Lấy 1 Thỏi Son
                </span>
                
                <button
                  onClick={() => setRecycleOpen(false)}
                  className="p-1 rounded-full hover:bg-brand-beige text-brand-charcoal"
                  id="recycle-close-btn"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress Stepper */}
              <div className="flex items-center justify-between gap-2 max-w-sm mx-auto mb-8 text-[11px] font-bold">
                <div className="flex items-center gap-1">
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center ${recycleStep >= 1 ? "bg-brand-accent text-white" : "bg-brand-clay/40 text-brand-charcoal/50"}`}>1</span>
                  <span className={recycleStep >= 1 ? "text-brand-accent" : "text-brand-charcoal/50"}>Thông tin</span>
                </div>
                <div className="h-[1px] flex-1 bg-brand-clay/40" />
                <div className="flex items-center gap-1">
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center ${recycleStep >= 2 ? "bg-brand-accent text-white" : "bg-brand-clay/40 text-brand-charcoal/50"}`}>2</span>
                  <span className={recycleStep >= 2 ? "text-brand-accent" : "text-brand-charcoal/50"}>Đăng ký gửi</span>
                </div>
                <div className="h-[1px] flex-1 bg-brand-clay/40" />
                <div className="flex items-center gap-1">
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center ${recycleStep === 3 ? "bg-emerald-600 text-white" : "bg-brand-clay/40 text-brand-charcoal/50"}`}>3</span>
                  <span className={recycleStep === 3 ? "text-emerald-700" : "text-brand-charcoal/50"}>Nhận Quà Thật</span>
                </div>
              </div>

              {recycleStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-serif text-base sm:text-lg font-bold text-brand-charcoal">Triết lý tuần hoàn nông nghiệp: Đổi quả lành lấy son xanh</h4>
                  <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light">
                    Thay vì vứt bỏ những hạt đu đủ sau khi thưởng thức món quả chín, THE INSIDE khuyến khích bạn thu gom, rửa ráo và phơi khô hạt đu đủ dồi dào. Trong hạt đu đủ ẩn giấu enzyme Papain hảo hạng cùng lượng axit béo trân quý, là thành phần diệu kỳ để trích xuất tinh chất tẩy da chết môi tự nhiên của chúng tôi!
                  </p>
                  <div className="p-4 bg-brand-beige/80 rounded-2xl space-y-2 border border-brand-clay/35">
                    <p className="text-xs font-semibold text-brand-charcoal">Quy chuẩn đổi hạt đu đủ lấy son:</p>
                    <ul className="text-[11px] text-brand-charcoal/70 space-y-1 sm:space-y-1.5 list-disc pl-4 font-light">
                      <li>Cứ mỗi <strong>200g hạt đu đủ phơi khô ráo</strong>, bạn được đổi lấy <strong>1 thỏi son dưỡng thuần chay hoàn toàn miễn phí</strong>.</li>
                      <li>Chi phí ship bưu tá đến tận nơi thu nhận hạt tại nhà bạn do chúng tôi chi trả <strong>100% miễn phí</strong>.</li>
                      <li>Bạn sẽ lập tức nhận được mã đổi son miễn phí <strong>(THEINSIDEPAPAYA100)</strong> áp dụng ngay.</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setRecycleStep(2)}
                      className="px-6 py-2.5 bg-brand-accent text-white rounded-full text-xs font-semibold tracking-wider hover:bg-brand-terracotta"
                    >
                      Đăng ký đổi hạt đu đủ khô lấy son
                    </button>
                  </div>
                </div>
              )}

              {recycleStep === 2 && (
                <form onSubmit={handleRecycleSubmit} className="space-y-4">
                  <h4 className="font-serif text-base font-bold text-brand-charcoal">Điền địa chỉ nhận bưu tá thu gom hạt</h4>
                  <p className="text-[11px] text-brand-charcoal/50 font-light">THE INSIDE sẽ phái nhân viên chuyển phát mang dụng cụ bảo quản hữu cơ đến tận nhà nhận hạt đu đủ khô, hoàn toàn miễn phí!</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-charcoal/50">HỌ VÀ TÊN</label>
                      <input
                        type="text"
                        required
                        value={recycleForm.name}
                        onChange={(e) => setRecycleForm({ ...recycleForm, name: e.target.value })}
                        placeholder="Ví dụ: Trần Thị B"
                        className="w-full bg-brand-beige px-4 py-2.5 rounded-full text-xs text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-charcoal/50">ĐỊA CHỈ EMAIL</label>
                      <input
                        type="email"
                        required
                        value={recycleForm.email}
                        onChange={(e) => setRecycleForm({ ...recycleForm, email: e.target.value })}
                        placeholder="Ví dụ: xanhtroi@gmail.com"
                        className="w-full bg-brand-beige px-4 py-2.5 rounded-full text-xs text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-charcoal/50">SỐ LƯỢNG HẠT ĐU ĐỦ KHÔ QUY ĐỔI</label>
                      <select
                        value={recycleForm.qty}
                        onChange={(e) => setRecycleForm({ ...recycleForm, qty: e.target.value })}
                        className="w-full bg-brand-beige px-4 py-2.5 rounded-full text-xs text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-accent"
                      >
                        <option value="200">200g hạt khô (Đổi lấy 1 thỏi son dưỡng)</option>
                        <option value="400">400g hạt khô (Đổi lấy 2 thỏi son dưỡng)</option>
                        <option value="1000">Từ 1kg trở lên (Bộ quà tặng Sống Xanh cao cấp)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-brand-charcoal/50">ĐỊA CHỈ GOM HẠT ĐU ĐỦ NÀY</label>
                      <input
                        type="text"
                        required
                        value={recycleForm.address}
                        onChange={(e) => setRecycleForm({ ...recycleForm, address: e.target.value })}
                        placeholder="Số nhà, Tên đường, Quận, Thành phố..."
                        className="w-full bg-brand-beige px-4 py-2.5 rounded-full text-xs text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-brand-clay/30 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setRecycleStep(1)}
                      className="px-6 py-2.5 border border-brand-clay text-brand-charcoal rounded-full text-xs font-semibold uppercase hover:bg-brand-beige"
                    >
                      Bỏ qua
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-brand-accent text-white rounded-full text-xs font-semibold uppercase hover:bg-brand-terracotta"
                    >
                      GỬI ĐĂNG KÝ NGAY
                    </button>
                  </div>
                </form>
              )}

              {recycleStep === 3 && (
                <div className="text-center space-y-6 py-4">
                  <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-xs">
                    🌱
                  </div>
                  
                  <div className="space-y-2 text-center max-w-sm mx-auto">
                    <h4 className="font-serif text-lg font-bold text-brand-charcoal">Đăng ký thành công rực rỡ!</h4>
                    <p className="text-xs text-brand-charcoal/60 leading-relaxed font-light">
                      Bưu tá THE INSIDE đã được định vị để đến thu gom hạt đu đủ của bạn! Mã đổi son dưỡng 100% miễn phí đã được kích hoạt thành công bên dưới.
                    </p>
                  </div>

                  {/* Copy Coupon interactive Section */}
                  <div className="bg-brand-beige p-5 rounded-3xl border border-brand-clay/40 space-y-3 max-w-sm mx-auto">
                    <p className="text-[10px] font-bold tracking-widest text-brand-accent uppercase">MÃ ĐỔI THỎI SON DƯỠNG MIỄN PHÍ</p>
                    <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-brand-cream/60 rounded-full border border-brand-clay/40">
                      <span className="font-mono font-bold text-sm tracking-wider text-brand-charcoal">THEINSIDEPAPAYA100</span>
                      <button
                        onClick={handleCopyVoucher}
                        className="text-brand-accent hover:text-brand-terracotta flex items-center gap-1.5 focus:outline-none"
                      >
                        {copiedVoucher ? (
                          <>
                            <CheckCircle size={14} className="text-emerald-600" />
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Đã copy</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span className="text-[10px] font-bold uppercase">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[9px] text-brand-charcoal/50 leading-relaxed font-light">Mã giảm 100% áp dụng mua sắm đổi 01 thỏi son dưỡng bất kỳ trên toàn quốc.</p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setRecycleOpen(false);
                        setRecycleStep(1);
                        setRecycleForm({ name: "", email: "", qty: "3", address: "" });
                      }}
                      className="px-6 py-2.5 bg-brand-accent text-white rounded-full text-xs font-semibold tracking-wider hover:bg-brand-terracotta"
                    >
                      Bỏ hòm và tiếp tục tham quan
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRODUCT DETAILED DIALOG MODAL (QUICK VIEW) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 pointer-events-auto"
              onClick={() => setSelectedProduct(null)}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-brand-cream border border-brand-clay w-full max-w-3xl rounded-4xl p-5 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-brand-beige text-brand-charcoal text-white z-10"
                id="product-details-close-btn"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                
                {/* Images side of details */}
                <div className="space-y-4">
                  <div className="aspect-square aspect-w-1 aspect-h-1 rounded-3xl bg-brand-beige overflow-hidden border border-brand-clay/30 relative">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1.5 rounded-full text-[10px] font-bold text-brand-charcoal flex items-center gap-1">
                      <Star size={11} className="fill-amber-500 text-amber-500" />
                      {selectedProduct.rating} / 5.0 (Đánh giá từ khách hàng)
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs text-brand-charcoal/60 leading-normal font-light p-3 bg-brand-beige rounded-2xl">
                    <span>💡</span>
                    <p><strong>Cách dùng chuẩn:</strong> {selectedProduct.howToUse}</p>
                  </div>
                </div>

                {/* Text side of details */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-brand-accent tracking-widest font-bold uppercase block mb-1">THE INSIDE PURE SON DƯỠNG</span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal leading-tight">
                      {selectedProduct.name}
                    </h2>
                    
                    <p className="text-xs text-brand-charcoal/50 leading-relaxed italic mt-1 pb-3 border-b border-brand-clay/35">
                      {selectedProduct.subtitle}
                    </p>

                    <div className="py-3 flex items-center gap-3">
                      {selectedProduct.originalPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-brand-accent">
                            {selectedProduct.price.toLocaleString("vi-VN")}₫
                          </span>
                          <span className="text-sm text-brand-charcoal/40 line-through">
                            {selectedProduct.originalPrice.toLocaleString("vi-VN")}₫
                          </span>
                          <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold font-mono">
                            -30%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-brand-accent">{selectedProduct.price.toLocaleString("vi-VN")}₫</span>
                      )}
                      <span className="text-[10px] text-brand-charcoal/40">Đã bao gồm VAT</span>
                    </div>

                    <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light">
                      {selectedProduct.description}
                    </p>

                    {/* Benefit list */}
                    <div className="space-y-1.5 mt-4">
                      <span className="text-[10px] font-bold text-brand-charcoal/50 tracking-wider block">ƯU ĐIỂM SẢN PHẨM KHÓA ẨM</span>
                      {selectedProduct.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-brand-charcoal/85">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-accent flex-shrink-0" />
                          <p>{benefit}</p>
                        </div>
                      ))}
                    </div>

                    {/* Ingredients chip list */}
                    <div className="mt-4">
                      <span className="text-[10px] font-bold text-brand-charcoal/50 tracking-white block mb-2">NGUYÊN LIỆU ĐẲNG CẤP</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProduct.ingredients.map((ing, i) => (
                          <span key={i} className="text-[9px] font-semibold text-brand-charcoal/70 bg-brand-beige px-2 py-1 rounded-full">
                            🌱 {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions purchase details */}
                  <div className="pt-4 border-t border-brand-clay/35 flex gap-3">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                        setCartOpen(true);
                      }}
                      className="flex-1 py-3 bg-brand-accent hover:bg-brand-terracotta text-white font-bold rounded-full text-xs tracking-wider uppercase text-center transition-colors shadow-md outline-none"
                    >
                      MUA SON NÀY NGAY ĐI
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        addToast("Cảm ơn bạn đã lưu thỏi son dưỡng lý tưởng này!");
                      }}
                      className="px-4 py-3 border border-brand-clay rounded-full text-brand-charcoal/80 hover:bg-brand-beige transition-colors flex items-center justify-center"
                      title="Lưu yêu thích"
                    >
                      <Heart size={15} />
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BLOG RECIPES DETAILED READ MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 pointer-events-auto"
              onClick={() => setSelectedArticle(null)}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-brand-cream border border-brand-clay w-full max-w-2xl rounded-4xl p-6 sm:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-brand-beige text-brand-charcoal"
                id="article-close-btn"
              >
                <X size={18} />
              </button>

              <div className="space-y-6 pt-4">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-brand-accent font-bold tracking-widest uppercase mb-1">
                    <span>{selectedArticle.date}</span>
                    <span>•</span>
                    <span>{selectedArticle.readingTime}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-charcoal leading-tight">
                    {selectedArticle.title}
                  </h2>
                </div>

                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-brand-beige border border-brand-clay/20">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Article Detailed Story Render */}
                <div className="space-y-4 text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light whitespace-pre-line border-t border-brand-clay/30 pt-6">
                  {selectedArticle.content}
                </div>

                <div className="pt-6 border-t border-brand-clay/30 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedArticle(null);
                      addToast("Cảm ơn bạn đã đọc bài viết truyền cảm hứng!");
                    }}
                    className="px-6 py-2.5 bg-brand-accent text-white rounded-full text-xs font-semibold tracking-wider hover:bg-brand-terracotta"
                  >
                    Hoàn tất đọc báo và trở lại
                  </button>
                  
                  <div className="flex gap-2 items-center text-xs text-brand-charcoal/50">
                    <span>🔗</span>
                    <span>Chia sẻ bài viết này</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
