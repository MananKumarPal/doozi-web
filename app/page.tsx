'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Users, 
  Camera, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  Instagram,
  MessageCircle,
  BookOpen,
  Globe,
  Target,
  Star,
  Plane,
  Video,
  Heart,
  TrendingUp,
  Shield,
  Zap,
  Megaphone,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import PhoneMockup from '@/components/iphone-mockup';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('');
  const [chaosAnimated, setChaosAnimated] = useState(false);
  const chaosRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setChaosAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (chaosRef.current) {
      observer.observe(chaosRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* App Store Submission Banner */}
      <div className="bg-gradient-to-r from-brand-pink to-brand-purple py-2 sm:py-3 px-3 sm:px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2 text-white text-center">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <p className="text-xs sm:text-sm md:text-base font-semibold leading-tight sm:leading-normal">
            🚧 We're submitting v1 of the Doozi app to the app stores.{' '}
            {user 
              ? 'Your account is ready! Apply to be a creator and get early access.'
              : 'Sign up now to secure your account, apply to be a creator, and get early access.'
            }
          </p>
        </div>
      </div>

      {/* Navigation */}
      <header className="bg-white border-b border-gray-100 sticky top-12 z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/logo.svg"
                alt="Doozi Logo"
                className="h-12 sm:h-16 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('travellers')}
                className={`font-bold transition-colors ${
                  activeSection === 'travellers' ? 'text-brand-pink' : 'text-gray-700 hover:text-black'
                }`}
              >
                For Travellers
              </button>
              <button
                onClick={() => scrollToSection('creators')}
                className={`font-bold transition-colors ${
                  activeSection === 'creators' ? 'text-brand-pink' : 'text-gray-700 hover:text-black'
                }`}
              >
                For Creators
              </button>
              <button
                onClick={() => scrollToSection('business')}
                className={`font-bold transition-colors ${
                  activeSection === 'business' ? 'text-brand-pink' : 'text-gray-700 hover:text-black'
                }`}
              >
                For Businesses
              </button>
              <button
                onClick={() => scrollToSection('community')}
                className={`font-bold transition-colors ${
                  activeSection === 'community' ? 'text-brand-pink' : 'text-gray-700 hover:text-black'
                }`}
              >
                Community
              </button>
              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <User className="h-4 w-4" />
                    <span>{user.email || user.name || user.fullName}</span>
                  </div>
                  <Link href="/dashboard" className="button-primary inline-flex items-center gap-2">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-brand-pink transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link href="/auth/signup" className="button-primary inline-flex items-center gap-2">
                  Sign Up
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-brand-pink transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 pt-4 pb-4 mt-4">
              <nav className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    scrollToSection('travellers');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left font-bold text-gray-700 hover:text-brand-pink transition-colors py-2"
                >
                  For Travellers
                </button>
                <button
                  onClick={() => {
                    scrollToSection('creators');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left font-bold text-gray-700 hover:text-brand-pink transition-colors py-2"
                >
                  For Creators
                </button>
                <button
                  onClick={() => {
                    scrollToSection('business');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left font-bold text-gray-700 hover:text-brand-pink transition-colors py-2"
                >
                  For Businesses
                </button>
                <button
                  onClick={() => {
                    scrollToSection('community');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left font-bold text-gray-700 hover:text-brand-pink transition-colors py-2"
                >
                  Community
                </button>
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 py-2 border-t border-gray-100 pt-3">
                      <User className="h-4 w-4" />
                      <span className="truncate">{user.name || user.fullName || user.email}</span>
                    </div>
                    <Link 
                      href="/dashboard" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="button-primary inline-flex items-center justify-center gap-2 py-2.5"
                    >
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-sm text-gray-700 hover:text-brand-pink transition-colors py-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/auth/signup" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="button-primary inline-flex items-center justify-center gap-2 py-2.5"
                  >
                    Sign Up
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-pink via-brand-pink to-brand-purple pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center min-h-[70vh] sm:min-h-[85vh] py-8 sm:py-12 lg:py-16">
            
            {/* Left Side - Hero Content */}
            <div className="text-white z-10 relative">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 sm:mb-8 lg:mb-12 leading-tight">
                The Future of Travel Discovery<br />
                <span className="text-white/90">Is Here</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-12 lg:mb-16 leading-relaxed font-medium text-white/90 max-w-2xl">
                {user 
                  ? `Welcome back, ${user.name || user.fullName || 'there'}! Your Doozi account is ready. Explore the app and start planning your next adventure.`
                  : "Whether you're a traveler always looking for your next hidden gem or a creator who loves sharing food, hotels, or adventure recs — this app is for you."
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {user ? (
                  <Link href="/dashboard" className="bg-white text-brand-pink px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full font-black text-base sm:text-lg lg:text-xl hover:shadow-2xl transition-all inline-flex items-center justify-center gap-2 sm:gap-3">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Link>
                ) : (
                  <Link href="/auth/signup" className="bg-white text-brand-pink px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full font-black text-base sm:text-lg lg:text-xl hover:shadow-2xl transition-all inline-flex items-center justify-center gap-2 sm:gap-3">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Link>
                )}
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden xl:block">
              <div className="relative">
                <PhoneMockup />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-40 right-10 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>
        </div>
      </section>

      {/* The Chaos Section */}
      <section className="py-20 bg-[#F5F5F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-white mb-16 py-20 shadow-xl rounded-2xl">
            <div ref={chaosRef} className="relative" style={{ minHeight: '600px' }}>
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-16 text-center relative z-10 border-l-4 border-brand-pink pl-8 inline-block">
                The current way we plan trips is chaotic.
              </h2>
              {/* <hr className="divider mb-12" /> */}
              
              <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
                <div className="card bg-white shadow-2xl rounded-2xl border-2 border-brand-pink/10 hover:border-brand-pink/30 transition-all hover:-translate-y-2">
                  <div className="text-4xl font-black text-brand-pink mb-4">2×</div>
                  <p className="text-gray-700 font-semibold text-lg">more tabs opened when hunting deals</p>
                </div>
                <div className="card bg-white shadow-2xl rounded-2xl border-2 border-brand-pink/10 hover:border-brand-pink/30 transition-all hover:-translate-y-2">
                  <div className="text-4xl font-black text-brand-pink mb-4">15+</div>
                  <p className="text-gray-700 font-semibold text-lg">apps to plan one trip</p>
                </div>
                <div className="card bg-white shadow-2xl rounded-2xl border-2 border-brand-pink/10 hover:border-brand-pink/30 transition-all hover:-translate-y-2">
                  <div className="text-4xl font-black text-brand-pink mb-4">100s</div>
                  <p className="text-gray-700 font-semibold text-lg">of hours lost comparing reviews</p>
                </div>
              </div>

            {chaosAnimated && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-600 rounded-xl opacity-20 transform rotate-12"></div>
                <div className="absolute top-40 right-16 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl opacity-20 transform -rotate-6"></div>
                <div className="absolute bottom-32 left-20 w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl opacity-20 transform rotate-45"></div>
                <div className="absolute bottom-20 right-24 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl opacity-20 transform -rotate-12"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-red-400 to-pink-600 rounded-xl opacity-20"></div>
                <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl opacity-20 transform rotate-6"></div>
              </div>
            )}

              <div className="relative z-10 text-center mt-12">
                <p className="text-3xl font-black text-gray-900 mb-4">
                  Doozi fixes this.
                </p>
                <p className="text-xl text-gray-600">
                  Everything you need in one beautifully designed app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why You'll Love Doozi */}
      <section className="py-20 bg-[#F5F5F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8 border-l-4 border-brand-pink pl-8 inline-block">
              Why You'll Love Doozi
            </h3>
            <hr className="divider mb-8" />
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Everything you need to discover, plan, and book your perfect trip—all in one app
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="card group bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-2 border-transparent hover:border-brand-pink/20 shadow-lg rounded-2xl">
              <Video className="h-12 w-12 text-brand-pink mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Travel Inspiration, TikTok-Style</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Scroll through bite-sized videos from real travelers—discover hidden gems and honest reviews in seconds.
              </p>
            </div>

            <div className="card group bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-2 border-transparent hover:border-brand-green/20 shadow-lg rounded-2xl">
              <MapPin className="h-12 w-12 text-brand-green mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Map-First Trip Planning</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Every saved spot appears on your custom map—no more lost notes or screenshots.
              </p>
            </div>

            <div className="card group bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-2 border-transparent hover:border-brand-purple/20 shadow-lg rounded-2xl">
              <Calendar className="h-12 w-12 text-brand-purple mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Book Directly, In-App</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Book hotels, restaurants, and experiences as you discover them. No extra tabs needed.
              </p>
            </div>

            <div className="card group bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-2 border-transparent hover:border-brand-pink/20 shadow-lg rounded-2xl">
              <Target className="h-12 w-12 text-brand-pink mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalized Just for You</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Smart filters and recommendations tailored to your travel style. Find what matters in seconds.
              </p>
            </div>

            <div className="card group bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-2 border-transparent hover:border-brand-green/20 shadow-lg rounded-2xl">
              <Star className="h-12 w-12 text-brand-green mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted Community Content</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                No fake reviews. Only real travelers, honest tips, and creator-verified videos.
              </p>
            </div>

            <div className="card group bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-2 border-transparent hover:border-brand-purple/20 shadow-lg rounded-2xl">
              <Users className="h-12 w-12 text-brand-purple mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Share and Collaborate</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Plan with friends, send your profile, and share full itineraries with one click.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl text-gray-700 mb-8 font-semibold">
              {user ? "Ready to explore?" : "Ready to see what's possible?"}
            </p>
            {user ? (
              <Link href="/dashboard" className="button-primary inline-flex items-center gap-3 py-5 px-10 text-xl font-bold hover:shadow-2xl hover:scale-105 transition-all">
                Go to Dashboard
                <ArrowRight className="w-6 h-6" />
              </Link>
            ) : (
              <Link href="/auth/signup" className="button-primary inline-flex items-center gap-3 py-5 px-10 text-xl font-bold hover:shadow-2xl hover:scale-105 transition-all">
                Create Your Account
                <ArrowRight className="w-6 h-6" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* For Travellers Section */}
      <section className="py-20 bg-white" id="travellers">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 mb-16">
            <hr className="divider flex-grow" />
            <h2 className="text-lg font-bold text-brand-green uppercase tracking-wider px-6 bg-[#F5F5F7] py-3 rounded-full shadow-sm">For Travellers</h2>
            <hr className="divider flex-grow" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 mb-16">
            {/* Left Column - Traveler Journey */}
            <div className="space-y-8">
              <h3 className="text-5xl lg:text-6xl font-black text-gray-900 mb-12 border-l-4 border-brand-green pl-8">
                Your Travel Journey, Simplified
              </h3>
              
              <div className="border-l-4 border-brand-pink pl-8 py-4">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Discover Places Worth Going</h4>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Watch bite-sized videos from real travelers sharing authentic experiences. No fake reviews, just honest recommendations with easy-to-filter results by location, style, and travel type.
                </p>
              </div>
              
              <div className="border-l-4 border-brand-pink pl-8 py-4">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Save & Auto-Organize Everything</h4>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Like a video and it's automatically saved to your city folder. No more screenshot chaos or lost bookmarks—everything is organized by location and ready for planning.
                </p>
              </div>
              
              <div className="border-l-4 border-brand-pink pl-8 py-4">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Plan Your Full Itinerary</h4>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Build day-by-day itineraries with your saved content. Invite friends to collaborate, add time slots, and even "watch" your trip by scrolling through all the videos in sequence.
                </p>
              </div>

              <div className="border-l-4 border-brand-pink pl-8 py-4">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Book Everything in One Spot</h4>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Book hotels, restaurants, and experiences directly from the videos that inspired you. No tab-switching or comparison shopping needed. <span className="text-brand-pink font-bold">(Coming Soon)</span>
                </p>
              </div>
            </div>

            {/* Right Column - This Could Be You */}
            <div className="bg-gradient-to-br from-brand-pink via-brand-pink to-brand-purple rounded-3xl p-12 text-white shadow-2xl">
              <h3 className="text-4xl font-black text-white mb-12 text-center">This Could Be You</h3>
              
              <div className="space-y-6 mb-12">
                <div className="card bg-white shadow-lg flex items-start gap-6 border-l-4 border-brand-pink">
                  <MapPin className="w-10 h-10 text-brand-pink flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed text-lg">
                    "I saw a Doozi video about a hidden ramen shop in Tokyo, booked a spot right in the app, and ended up making a new friend in the comments. My best meal of the trip!"
                  </p>
                </div>

                <div className="card bg-white shadow-lg flex items-start gap-6 border-l-4 border-brand-purple">
                  <MapPin className="w-10 h-10 text-brand-purple flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed text-lg">
                    "Booked a boutique hotel in Paris after seeing a creator's walkthrough on Doozi—way better than sifting through 500 reviews."
                  </p>
                </div>

                <div className="card bg-white shadow-lg flex items-start gap-6 border-l-4 border-brand-green">
                  <MapPin className="w-10 h-10 text-brand-green flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed text-lg">
                    "My friend and I planned our whole Iceland road trip on Doozi—just liked videos to auto-save the map, and booked everything in a few taps."
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Link href="/auth/signup" className="inline-flex items-center gap-3 py-5 px-10 text-xl font-bold bg-white text-brand-pink rounded-full hover:shadow-2xl hover:scale-105 transition-all">
                  Start Your Journey
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-brand-black text-white rounded-3xl p-12 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-5xl font-black mb-4 text-brand-pink">15s</p>
                <p className="text-gray-300 text-lg font-semibold">Avg. discovery time</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-black mb-4 text-brand-green">1-tap</p>
                <p className="text-gray-300 text-lg font-semibold">To save & plan</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-black mb-4 text-brand-purple">100%</p>
                <p className="text-gray-300 text-lg font-semibold">Verified creators</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-black mb-4 text-brand-pink">All-in-1</p>
                <p className="text-gray-300 text-lg font-semibold">Travel solution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Creators Section */}
      <section className="py-20 bg-[#F5F5F7]" id="creators">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 mb-16">
            <hr className="divider flex-grow" />
            <h2 className="text-lg font-bold text-brand-purple uppercase tracking-wider px-6 bg-white py-3 rounded-full shadow-sm">For Creators</h2>
            <hr className="divider flex-grow" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-16">
            <div>
              <div className="border-l-4 border-brand-green pl-8 mb-12">
                <h3 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8">
                  Why Doozi finally pays travel storytellers
                </h3>
                <p className="text-gray-700 mb-6 text-xl leading-relaxed">
                  Brands shower tech & beauty influencers with affiliate links, but travel creators hustle for one-off hotel stays. We're changing that.
                </p>
                <p className="text-gray-700 mb-6 text-xl leading-relaxed">
                  Doozi channels real marketing dollars <em>into experiences</em>—rewarding the people who inspire trips. Share clips or itineraries and earn whenever travelers book, save, or follow your route.
                </p>
                <p className="text-gray-700 font-bold text-xl">
                  No cold-pitching. No chasing comps. Capture the vibe of a place and get paid when your community books it.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <Shield className="h-8 w-8 text-brand-pink" />
                  <p className="text-gray-700 font-semibold text-lg">Limited creator spots (invite only)</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <MapPin className="h-8 w-8 text-brand-purple" />
                  <p className="text-gray-700 font-semibold text-lg">First dibs on sponsored trips</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <TrendingUp className="h-8 w-8 text-brand-green" />
                  <p className="text-gray-700 font-semibold text-lg">Future revenue streams unlocked</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <Zap className="h-8 w-8 text-brand-pink" />
                  <p className="text-gray-700 font-semibold text-lg">Help shape the roadmap in real time</p>
                </div>
              </div>
            </div>

            <div className="relative mx-auto" style={{ maxWidth: '360px' }}>
              <PhoneMockup />
            </div>
          </div>
          
          <div className="bg-brand-black text-white rounded-3xl p-12 shadow-2xl">
            <h3 className="text-4xl font-black text-white mb-12 text-center">Finally, Get Paid for Your Passion</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <Video className="text-brand-pink h-8 w-8 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-xl mb-2">Creator Fund</p>
                  <p className="text-gray-300 text-lg">Earn from views, engagement, and bookings generated from your content</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Megaphone className="text-brand-pink h-8 w-8 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-xl mb-2">Brand Partnerships</p>
                  <p className="text-gray-300 text-lg">Connect with hotels, restaurants, and experiences for paid collaborations</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <TrendingUp className="text-brand-pink h-8 w-8 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-xl mb-2">Analytics Dashboard</p>
                  <p className="text-gray-300 text-lg">Track your performance, earnings, and audience insights</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Shield className="text-brand-pink h-8 w-8 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-xl mb-2">Creator Protection</p>
                  <p className="text-gray-300 text-lg">Your content, your control. No algorithm changes that kill your reach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Businesses Section */}
      <section className="py-20 bg-white" id="business">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 mb-16">
            <hr className="divider flex-grow" />
            <h2 className="text-lg font-bold text-brand-green uppercase tracking-wider px-6 bg-[#F5F5F7] py-3 rounded-full shadow-sm">For Businesses</h2>
            <hr className="divider flex-grow" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 mb-16">
            <div className="space-y-8">
              <h3 className="text-5xl lg:text-6xl font-black text-gray-900 mb-12 border-l-4 border-brand-green pl-8">
                Grow Your Business with Authentic Content
              </h3>
              
              <div className="border-l-4 border-brand-pink pl-8 py-4">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Claim Your Business Profile</h4>
                <p className="text-gray-700 text-lg leading-relaxed">Take control of your presence on Doozi. Update info, track analytics, and engage with creators who want to feature your business.</p>
              </div>
              
              <div className="border-l-4 border-brand-pink pl-8 py-4">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Partner with Creators</h4>
                <p className="text-gray-700 text-lg leading-relaxed">Launch campaigns, invite creators, and get authentic video content about your business that drives real bookings.</p>
              </div>
              
              <div className="border-l-4 border-brand-pink pl-8 py-4">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Drive Direct Bookings</h4>
                <p className="text-gray-700 text-lg leading-relaxed">Convert views into bookings with our integrated reservation system. Track ROI in real-time as travelers book directly from videos.</p>
              </div>
              
              <div className="border-l-4 border-brand-pink pl-8 py-4">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Boost Your Content</h4>
                <p className="text-gray-700 text-lg leading-relaxed">Promote creator videos about your business to reach more travelers actively planning trips and searching for authentic experiences.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-green via-brand-green to-brand-purple rounded-3xl p-12 text-white shadow-2xl">
              <h3 className="text-4xl font-black text-white mb-12 text-center">This Could Be Your Business</h3>
              
              <div className="space-y-6 mb-12">
                <div className="card bg-white shadow-lg flex items-start gap-6 border-l-4 border-brand-green">
                  <span className="text-3xl flex-shrink-0 mt-1">🍜</span>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    "After three creators tagged our ramen shop on Doozi, we went from 20 customers a day to being fully booked for weeks. Best marketing ROI we've ever seen!"
                  </p>
                </div>

                <div className="card bg-white shadow-lg flex items-start gap-6 border-l-4 border-brand-purple">
                  <span className="text-3xl flex-shrink-0 mt-1">🏨</span>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    "Our boutique hotel became the most viral place to stay in Barcelona after creators started making videos in our lobby. Bookings increased 400% in 3 months."
                  </p>
                </div>

                <div className="card bg-white shadow-lg flex items-start gap-6 border-l-4 border-brand-pink">
                  <span className="text-3xl flex-shrink-0 mt-1">☕</span>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    "One viral Doozi video of our signature latte turned us from a local coffee shop into a destination. We now have travelers from around the world visiting daily."
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Link href="/auth/signup" className="inline-flex items-center gap-3 py-5 px-10 text-xl font-bold bg-white text-brand-green rounded-full hover:shadow-2xl hover:scale-105 transition-all">
                  Claim Your Profile
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-brand-black text-white rounded-3xl p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-5xl font-black mb-4 text-brand-pink">51%</p>
                <p className="text-gray-300 text-lg font-semibold">of Gen Z prefer TikTok over Google for search</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-black mb-4 text-brand-green">40%</p>
                <p className="text-gray-300 text-lg font-semibold">use TikTok/Instagram when looking for places to eat</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-black mb-4 text-brand-purple">72%</p>
                <p className="text-gray-300 text-lg font-semibold">of Gen Z bought something after seeing it on TikTok</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-[#F5F5F7]" id="community">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 mb-16">
            <hr className="divider flex-grow" />
            <h2 className="text-lg font-bold text-brand-purple uppercase tracking-wider px-6 bg-white py-3 rounded-full shadow-sm">Community</h2>
            <hr className="divider flex-grow" />
          </div>
          
          <div className="text-center mb-20">
            <h3 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8 border-l-4 border-brand-purple pl-8 inline-block">
              Join a Community That Gets It
            </h3>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Connect with fellow travelers, share experiences, and discover your next adventure through authentic recommendations from people who've been there.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center bg-white shadow-2xl rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <Users className="h-16 w-16 text-brand-pink mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Real Travelers</h4>
              <p className="text-gray-700 text-lg leading-relaxed">Connect with authentic travelers sharing honest experiences, not sponsored content.</p>
            </div>

            <div className="card text-center bg-white shadow-2xl rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <Heart className="h-16 w-16 text-brand-purple mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Ask Questions</h4>
              <p className="text-gray-700 text-lg leading-relaxed">Get instant answers from travelers who've actually been to your destination.</p>
            </div>

            <div className="card text-center bg-white shadow-2xl rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <Star className="h-16 w-16 text-brand-green mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Share Stories</h4>
              <p className="text-gray-700 text-lg leading-relaxed">Inspire others with your adventures and help fellow travelers discover amazing places.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-pink to-brand-purple">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {user ? (
            <>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                Welcome back, {user.name || user.fullName || 'there'}!
              </h2>
              <p className="text-xl text-white/90 mb-2">
                Your account is ready. Start exploring and planning your next adventure.
              </p>
              <Link href="/dashboard" className="bg-white text-brand-pink px-12 py-5 rounded-full font-black text-xl hover:shadow-2xl transition-all inline-flex items-center gap-3 mt-8">
                Go to Dashboard
                <ArrowRight className="w-6 h-6" />
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                Claim Your Early Access
              </h2>
              <p className="text-xl text-white/90 mb-2">
                No credit card required • Takes 30 seconds
              </p>
              <Link href="/auth/signup" className="bg-white text-brand-pink px-12 py-5 rounded-full font-black text-xl hover:shadow-2xl transition-all inline-flex items-center gap-3 mt-8">
                Create Your Account
                <ArrowRight className="w-6 h-6" />
              </Link>
              <p className="mt-8 text-white/80">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-bold underline hover:text-white">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-black text-white py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <Link href="/">
                  <img
                    src="/logo.svg"
                    alt="Doozi Logo"
                    className="h-12 sm:h-16 w-auto"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </Link>
              </div>
              <p className="text-white/70 leading-relaxed max-w-md">
                The future of travel discovery. Find authentic experiences, plan perfect trips, and connect with travelers worldwide.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-3 text-white/70">
                <li><button onClick={() => scrollToSection('travellers')} className="hover:text-brand-pink transition-colors">For Travellers</button></li>
                <li><button onClick={() => scrollToSection('creators')} className="hover:text-brand-pink transition-colors">For Creators</button></li>
                <li><button onClick={() => scrollToSection('business')} className="hover:text-brand-pink transition-colors">For Businesses</button></li>
                <li><button onClick={() => scrollToSection('community')} className="hover:text-brand-pink transition-colors">Community</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-3 text-white/70">
                <li><Link href="/privacy" className="hover:text-brand-pink transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-brand-pink transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/50 text-sm">
                &copy; 2026 Doozi. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-white/50 hover:text-brand-pink transition-colors">
                  {/* <Instagram className="w-5 h-5" /> */}
                </a>
                <a href="#" className="text-white/50 hover:text-brand-pink transition-colors">
                  {/* <MessageCircle className="w-5 h-5" /> */}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
