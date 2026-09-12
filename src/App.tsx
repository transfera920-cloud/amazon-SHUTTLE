import React, { useState, useEffect } from 'react';
import { SiteConfig, FeatureCard } from './types';
import { DEFAULT_CONFIG, parseTrustItems } from './data/mountainData';
import { AdminModal } from './components/AdminModal';
import { PriceCalculatorModal } from './components/PriceCalculatorModal';
import { D0LodgingModal } from './components/D0LodgingModal';
import { FeastModal } from './components/FeastModal';
import { TrafficModal } from './components/TrafficModal';
import { TermsModal } from './components/TermsModal';
import {
  MessageCircle,
  Phone,
  Settings,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Compass,
  Calculator,
  Hotel,
  Utensils,
  AlertTriangle,
  Calendar,
  MapPin,
  Car,
  FileText,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('amazonMountainConfig');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure features array exists if updated from legacy version
        const features = Array.isArray(parsed.features) && parsed.features.length > 0
          ? parsed.features
          : DEFAULT_CONFIG.features;
        const aboutContent = parsed.aboutContent || DEFAULT_CONFIG.aboutContent;
        const termsContent = parsed.termsContent || DEFAULT_CONFIG.termsContent;
        const trustBannerText = typeof parsed.trustBannerText === 'string'
          ? parsed.trustBannerText
          : DEFAULT_CONFIG.trustBannerText;
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          features,
          aboutContent,
          termsContent,
          trustBannerText
        };
      }
    } catch (e) {
      console.error('Failed to load amazonMountainConfig from localStorage', e);
    }
    return DEFAULT_CONFIG;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Modals state
  const [activeModal, setActiveModal] = useState<
    'none' | 'price' | 'd0' | 'feast' | 'traffic' | 'terms'
  >('none');

  // Fetch latest config from server API on mount and on window focus
  useEffect(() => {
    let isMounted = true;

    const fetchServerConfig = async () => {
      try {
        const response = await fetch('/api/config');
        if (!response.ok) return;
        const result = await response.json();
        const serverData = result.data || result;
        if (isMounted && serverData && typeof serverData === 'object') {
          setConfig((prev) => {
            const features = Array.isArray(serverData.features) && serverData.features.length > 0
              ? serverData.features
              : (prev.features && prev.features.length > 0 ? prev.features : DEFAULT_CONFIG.features);
            return {
              ...DEFAULT_CONFIG,
              ...prev,
              ...serverData,
              features
            };
          });
          try {
            localStorage.setItem('amazonMountainConfig', JSON.stringify(serverData));
          } catch {
            // ignore localStorage quota errors
          }
        }
      } catch (err) {
        console.warn('[App] Could not fetch server config, using local cache:', err);
      }
    };

    fetchServerConfig();

    const handleFocus = () => {
      fetchServerConfig();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleSaveConfig = async (newConfig: SiteConfig, adminToken?: string): Promise<boolean> => {
    // Optimistically update local UI
    setConfig(newConfig);
    try {
      localStorage.setItem('amazonMountainConfig', JSON.stringify(newConfig));
    } catch {
      // ignore
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-admin-password': 'yy661003'
      };
      if (adminToken) {
        headers['x-admin-token'] = adminToken;
      }

      const response = await fetch('/api/config', {
        method: 'POST',
        headers,
        body: JSON.stringify(newConfig)
      }).catch((err) => {
        console.warn('[App] /api/config network request failed (may be static hosting):', err);
        return null;
      });

      if (response) {
        if (response.ok) {
          const result = await response.json().catch(() => null);
          const savedConfig = result?.data || result;
          if (savedConfig && typeof savedConfig === 'object') {
            setConfig(savedConfig);
            localStorage.setItem('amazonMountainConfig', JSON.stringify(savedConfig));
          }
        } else if (response.status === 401) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || '未授權：請以正確密碼登入後再儲存');
        } else if (response.status !== 404) {
          console.warn(`[App] Server returned status ${response.status}, preserved in local storage`);
        }
      }

      return true;
    } catch (err) {
      console.error('[App] Failed to save config to server database:', err);
      throw err;
    }
  };

  // Dynamic feature card click handler
  const handleFeatureCardClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    if (!url) return;

    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    const cleanUrl = url.toLowerCase().trim();
    if (cleanUrl.includes('price')) {
      setActiveModal('price');
    } else if (cleanUrl.includes('d0') || cleanUrl.includes('hotel') || cleanUrl.includes('lodging')) {
      setActiveModal('d0');
    } else if (cleanUrl.includes('feast') || cleanUrl.includes('restaurant')) {
      setActiveModal('feast');
    } else if (cleanUrl.includes('traffic') || cleanUrl.includes('road')) {
      setActiveModal('traffic');
    } else if (cleanUrl.includes('terms') || cleanUrl.includes('contact')) {
      setActiveModal('terms');
    } else {
      window.location.href = url;
    }
  };

  const handleFooterLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (config.footerUrl && (config.footerUrl.startsWith('http://') || config.footerUrl.startsWith('https://'))) {
      window.open(config.footerUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setActiveModal('terms');
  };

  // Helper to render icon for dynamic feature cards
  const renderCardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-8 h-8 text-emerald-700" />;
      case 'Hotel':
        return <Hotel className="w-8 h-8 text-emerald-700" />;
      case 'Utensils':
        return <Utensils className="w-8 h-8 text-emerald-700" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-8 h-8 text-amber-600" />;
      case 'Compass':
        return <Compass className="w-8 h-8 text-emerald-700" />;
      case 'Calendar':
        return <Calendar className="w-8 h-8 text-emerald-700" />;
      case 'MapPin':
        return <MapPin className="w-8 h-8 text-emerald-700" />;
      case 'Car':
        return <Car className="w-8 h-8 text-emerald-700" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-8 h-8 text-emerald-700" />;
      case 'FileText':
        return <FileText className="w-8 h-8 text-emerald-700" />;
      case 'Phone':
        return <Phone className="w-8 h-8 text-emerald-700" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-8 h-8 text-emerald-700" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8] text-[#333333] selection:bg-emerald-200">
      {/* Header */}
      <header className="bg-[#1e3a29] text-white text-center py-10 px-5 relative shadow-md">
        {/* Admin Toggle Button */}
        <button
          type="button"
          onClick={() => setIsAdminOpen(true)}
          className="admin-toggle-btn absolute top-3.5 right-3.5 sm:top-4 sm:right-4 bg-white/20 hover:bg-white/30 text-white border border-white/40 px-3 py-1.5 rounded-md cursor-pointer text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 backdrop-blur-xs"
          title="登入管理後台"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>管理後台</span>
        </button>

        <div className="max-w-4xl mx-auto">
          <h1
            id="site-title"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight my-2 text-white"
          >
            {config.siteTitle}
          </h1>

          <p className="mt-2 text-sm sm:text-base text-white/90 font-light tracking-wide max-w-xl mx-auto">
            {config.siteSlogan}
          </p>

          {/* LINE Official Account Button */}
          <div className="mt-6">
            <a
              href={config.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-line inline-flex items-center gap-2.5 bg-[#06c755] hover:bg-[#05b34c] active:scale-95 text-white px-7 py-3 rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>點我加 LINE 官方帳號預約</span>
            </a>
          </div>

          {/* Trust Banner (同一行排版，前台即時同步後台設定) */}
          <div className="mt-7 pt-5 border-t border-white/15 w-full max-w-4xl mx-auto overflow-x-auto scrollbar-none">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base text-emerald-100 font-medium whitespace-nowrap min-w-max px-2">
              {parseTrustItems(config.trustBannerText).map((item, index, array) => (
                <React.Fragment key={index}>
                  <span>{item}</span>
                  {index < array.length - 1 && (
                    <span className="text-emerald-400 font-bold">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto my-8 px-4 sm:px-6 flex-1">
        {/* Section Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3a29] tracking-tight">
            高山接駁服務與即時查詢
          </h2>
        </div>

        {/* Dynamic Feature Cards Grid (支援任意新增/管理) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(config.features && config.features.length > 0 ? config.features : DEFAULT_CONFIG.features).map((card, idx) => (
            <a
              key={card.id || idx}
              id={`feature-card-${idx}`}
              href={card.url}
              onClick={(e) => handleFeatureCardClick(e, card.url)}
              className="card group bg-white p-6 rounded-xl text-center shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-100 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="mb-3.5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                    {renderCardIcon(card.icon)}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#1e3a29] mb-2 group-hover:text-emerald-700 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed min-h-[36px]">
                  {card.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1 text-xs font-bold text-emerald-700">
                <span>{card.actionText || '查看詳情'}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>

        {/* SEO / 關於亞馬遜高山接駁 Block (後台可編輯) */}
        <article className="seo-text bg-white p-6 sm:p-8 rounded-xl mt-10 shadow-xs border border-gray-200 leading-relaxed text-gray-600">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-5 bg-[#1e3a29] rounded-full"></span>
            <h3 className="text-lg sm:text-xl font-bold text-[#1e3a29] m-0">
              關於亞馬遜高山接駁
            </h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            {(config.aboutContent || DEFAULT_CONFIG.aboutContent)
              .split('\n\n')
              .filter(Boolean)
              .map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
          </div>
        </article>

        {/* Direct Call & Booking Banner (移除多餘字樣，來電諮詢保留功能不顯號碼) */}
        <div className="mt-8 bg-gradient-to-r from-emerald-900 to-[#1e3a29] rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold">高山登山接駁專屬預約</h4>
            <p className="text-xs text-emerald-200 mt-1">
              合法租賃車輛 · 行程彈性安排 · 歡迎提早預約包車
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href={`tel:${config.phone.replace(/[^0-9]/g, '')}`}
              className="inline-flex items-center gap-2 bg-white text-[#1e3a29] hover:bg-emerald-50 px-4 py-2.5 rounded-lg text-sm font-bold shadow-xs transition-colors cursor-pointer"
              title="來電諮詢專線"
            >
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>來電諮詢</span>
            </a>
            <a
              href={config.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#06c755] hover:bg-[#05b34c] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>LINE 立即預約</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer (FOOT 區只保留 © 亞馬遜高山接駁 | 專屬預約服務 與 條款與服務須知) */}
      <footer className="text-center py-8 px-5 bg-[#222222] text-[#cccccc] mt-12 text-sm leading-relaxed border-t border-neutral-800">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="font-semibold text-white">© 亞馬遜高山接駁 | 專屬預約服務</p>
          <div>
            <a
              id="footer-link"
              href={config.footerUrl}
              onClick={handleFooterLinkClick}
              className="text-[#06c755] hover:underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{config.footerText || '條款與服務須知'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Quick Contact Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        <a
          href={`tel:${config.phone.replace(/[^0-9]/g, '')}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-700" />
          <span>來電諮詢</span>
        </a>
        <a
          href={config.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#06c755] hover:bg-[#05b34c] text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white" />
          <span>加 LINE 詢價</span>
        </a>
      </div>

      {/* Modals */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onSave={handleSaveConfig}
      />

      <PriceCalculatorModal
        isOpen={activeModal === 'price'}
        onClose={() => setActiveModal('none')}
        lineUrl={config.lineUrl}
        phone={config.phone}
      />

      <D0LodgingModal
        isOpen={activeModal === 'd0'}
        onClose={() => setActiveModal('none')}
      />

      <FeastModal
        isOpen={activeModal === 'feast'}
        onClose={() => setActiveModal('none')}
      />

      <TrafficModal
        isOpen={activeModal === 'traffic'}
        onClose={() => setActiveModal('none')}
      />

      <TermsModal
        isOpen={activeModal === 'terms'}
        onClose={() => setActiveModal('none')}
        phone={config.phone}
        email={config.email}
        termsContent={config.termsContent}
      />
    </div>
  );
}
