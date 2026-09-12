import React, { useState, useEffect } from 'react';
import { SiteConfig, FeatureCard } from '../types';
import { DEFAULT_CONFIG, parseTrustItems } from '../data/mountainData';
import {
  X,
  Lock,
  CheckCircle2,
  RotateCcw,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Sliders,
  Layers,
  FileText,
  Info
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onSave: (newConfig: SiteConfig) => void;
}

const AVAILABLE_ICONS = [
  { value: 'Calculator', label: '💰 價格估算 (Calculator)' },
  { value: 'Hotel', label: '🏠 住宿旅宿 (Hotel)' },
  { value: 'Utensils', label: '🍽️ 餐廳慶功 (Utensils)' },
  { value: 'AlertTriangle', label: '🚧 即時路況 (AlertTriangle)' },
  { value: 'Compass', label: '🧭 登山路線 (Compass)' },
  { value: 'Calendar', label: '📅 預約排程 (Calendar)' },
  { value: 'MapPin', label: '📍 登山口位置 (MapPin)' },
  { value: 'Car', label: '🚙 接駁車輛 (Car)' },
  { value: 'ShieldCheck', label: '🛡️ 安全保險 (ShieldCheck)' },
  { value: 'Sparkles', label: '✨ 特色推薦 (Sparkles)' },
  { value: 'FileText', label: '📄 規章須知 (FileText)' },
  { value: 'Phone', label: '📞 客服專線 (Phone)' }
];

const PRESET_URLS = [
  { label: '--- 常用預設工具 ---', value: '' },
  { label: '價格估算彈窗 (price.html)', value: 'price.html' },
  { label: 'D0住宿推薦彈窗 (d0-hotel.html)', value: 'd0-hotel.html' },
  { label: '慶功宴餐廳彈窗 (feast.html)', value: 'feast.html' },
  { label: '道路管制查詢彈窗 (traffic.html)', value: 'traffic.html' },
  { label: '條款與服務須知彈窗 (terms)', value: 'terms' }
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'about' | 'features' | 'terms'>('features');

  // Initialize form state
  const [formData, setFormData] = useState<SiteConfig>(() => {
    const features = config.features && config.features.length > 0
      ? config.features
      : DEFAULT_CONFIG.features;
    return {
      ...DEFAULT_CONFIG,
      ...config,
      features
    };
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [deleteConfirmIdx, setDeleteConfirmIdx] = useState<number | null>(null);
  const [actionNotice, setActionNotice] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync formData whenever modal is opened or config prop updates
  useEffect(() => {
    if (isOpen) {
      const features = config.features && config.features.length > 0
        ? config.features
        : DEFAULT_CONFIG.features;
      setFormData({
        ...DEFAULT_CONFIG,
        ...config,
        features
      });
      setErrorMsg('');
      setSavedSuccess(false);
      setDeleteConfirmIdx(null);
      setShowResetConfirm(false);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'yy661003') {
      setIsAuthenticated(true);
      setErrorMsg('');
      const features = config.features && config.features.length > 0
        ? config.features
        : DEFAULT_CONFIG.features;
      setFormData({
        ...DEFAULT_CONFIG,
        ...config,
        features
      });
    } else {
      setErrorMsg('密碼錯誤！請輸入正確的管理密碼。');
    }
  };

  const handleInputChange = (field: keyof SiteConfig, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Feature cards handlers
  const handleAddFeature = () => {
    const newId = `feature-${Date.now()}`;
    const newFeature: FeatureCard = {
      id: newId,
      title: '新自訂功能區塊',
      desc: '請在此輸入此功能區塊的詳細介紹與說明文字',
      url: 'price.html',
      icon: 'Sparkles',
      actionText: '查看詳情'
    };
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), newFeature]
    }));
    setActionNotice('已新增一個功能區塊！可直接於下方編輯內容，完成後請點擊「儲存並同步至前台」。');
    setTimeout(() => setActionNotice(''), 4500);
  };

  const handleRequestDelete = (index: number) => {
    setDeleteConfirmIdx(index);
  };

  const handleConfirmDelete = (index: number) => {
    const targetTitle = formData.features[index]?.title || `區塊 ${index + 1}`;
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== index)
    }));
    setDeleteConfirmIdx(null);
    setActionNotice(`已成功刪除「${targetTitle}」！請記得點擊下方「儲存並同步至前台」。`);
    setTimeout(() => setActionNotice(''), 4500);
  };

  const handleMoveFeature = (index: number, direction: 'up' | 'down') => {
    setFormData(prev => {
      const list = [...(prev.features || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, features: list };
    });
  };

  const handleFeatureChange = (index: number, field: keyof FeatureCard, value: string) => {
    setFormData(prev => {
      const list = [...(prev.features || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, features: list };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Sync legacy card fields with top features
    const f = formData.features;
    const finalData: SiteConfig = {
      ...formData,
      card1Title: f[0]?.title || formData.card1Title,
      card1Desc: f[0]?.desc || formData.card1Desc,
      card1Url: f[0]?.url || formData.card1Url,
      card2Title: f[1]?.title || formData.card2Title,
      card2Desc: f[1]?.desc || formData.card2Desc,
      card2Url: f[1]?.url || formData.card2Url,
      card3Title: f[2]?.title || formData.card3Title,
      card3Desc: f[2]?.desc || formData.card3Desc,
      card3Url: f[2]?.url || formData.card3Url,
      card4Title: f[3]?.title || formData.card4Title,
      card4Desc: f[3]?.desc || formData.card4Desc,
      card4Url: f[3]?.url || formData.card4Url,
    };

    onSave(finalData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetDefaults = () => {
    if (window.confirm('確定要將所有設定（包含功能區塊、關於、條款與服務須知）恢復為初始預設值嗎？')) {
      setFormData({ ...DEFAULT_CONFIG });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border-2 border-[#1e3a29] overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1e3a29] text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold">亞馬遜高山接駁 頁面動態管理後台</h2>
              <p className="text-xs text-emerald-200">即時編輯前台功能區塊、關於內容、服務條款與聯絡資訊</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
            title="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="space-y-4 py-8 max-w-sm mx-auto">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-emerald-100 text-[#1e3a29] rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">請輸入管理員密碼</h3>
                <p className="text-xs text-gray-500 mt-1">此處僅供站長或管理員維護前台內容</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  管理密碼
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="請輸入密碼"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a29] focus:outline-hidden pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 text-xs bg-red-50 text-red-700 rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1e3a29] hover:bg-[#284f38] text-white py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                >
                  解鎖並進入後台
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  取消
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              {savedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg flex items-center gap-2 text-sm animate-pulse">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>資料已成功儲存並同步更新至前台！</span>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-200 gap-1 sm:gap-2 overflow-x-auto pb-1 text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => setActiveTab('features')}
                  className={`px-3 sm:px-4 py-2 rounded-t-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'features'
                      ? 'bg-emerald-50 text-[#1e3a29] border-b-2 border-[#1e3a29]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Layers className="w-4 h-4 text-emerald-700" />
                  <span>前台功能區塊管理 ({formData.features?.length || 0})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('about')}
                  className={`px-3 sm:px-4 py-2 rounded-t-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'about'
                      ? 'bg-emerald-50 text-[#1e3a29] border-b-2 border-[#1e3a29]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Info className="w-4 h-4 text-emerald-700" />
                  <span>關於亞馬遜接駁</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('terms')}
                  className={`px-3 sm:px-4 py-2 rounded-t-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'terms'
                      ? 'bg-emerald-50 text-[#1e3a29] border-b-2 border-[#1e3a29]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>條款與服務須知</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('basic')}
                  className={`px-3 sm:px-4 py-2 rounded-t-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'basic'
                      ? 'bg-emerald-50 text-[#1e3a29] border-b-2 border-[#1e3a29]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-emerald-700" />
                  <span>網站基本資訊</span>
                </button>
              </div>

              {/* TAB 1: FEATURES MANAGER */}
              {activeTab === 'features' && (
                <div className="space-y-4 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-50/60 p-3 rounded-lg border border-emerald-200">
                    <div>
                      <h4 className="text-sm font-bold text-[#1e3a29] flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-emerald-700" />
                        前台功能區塊配置 (支援任意新增與排序)
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        您可以自由新增、刪除、拖移排序功能區塊，不再侷限於原本的四個功能！
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="inline-flex items-center gap-1.5 bg-[#1e3a29] hover:bg-[#284f38] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>新增功能區塊</span>
                    </button>
                  </div>

                  {actionNotice && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg flex items-center justify-between text-xs font-medium">
                      <span>{actionNotice}</span>
                      <button
                        type="button"
                        onClick={() => setActionNotice('')}
                        className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {(!formData.features || formData.features.length === 0) ? (
                    <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 space-y-2">
                      <p className="text-sm font-bold text-gray-700">目前沒有任何前台功能區塊</p>
                      <p className="text-xs text-gray-500">點擊上方「新增功能區塊」按鈕即可新增</p>
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="inline-flex items-center gap-1.5 bg-[#1e3a29] hover:bg-[#284f38] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer mt-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>立即新增功能區塊</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                      {formData.features?.map((feature, idx) => (
                        <div
                          key={feature.id || idx}
                          className="p-4 bg-white rounded-xl border border-gray-200 shadow-xs hover:border-emerald-300 transition-colors space-y-3"
                        >
                          {/* Top bar of card */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-[#1e3a29] text-white text-xs font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-sm text-[#1e3a29]">
                                {feature.title || `區塊 ${idx + 1}`}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleMoveFeature(idx, 'up')}
                                disabled={idx === 0}
                                title="上移"
                                className="p-1 text-gray-500 hover:text-emerald-700 hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveFeature(idx, 'down')}
                                disabled={idx === formData.features.length - 1}
                                title="下移"
                                className="p-1 text-gray-500 hover:text-emerald-700 hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>

                              {deleteConfirmIdx === idx ? (
                                <div className="flex items-center gap-1 bg-red-50 border border-red-300 px-2 py-1 rounded-md">
                                  <span className="text-xs text-red-700 font-bold">確認刪除此區塊？</span>
                                  <button
                                    type="button"
                                    onClick={() => handleConfirmDelete(idx)}
                                    className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    確認刪除
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmIdx(null)}
                                    className="px-1.5 py-0.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs transition-colors cursor-pointer"
                                  >
                                    取消
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleRequestDelete(idx)}
                                  title="刪除此功能區塊"
                                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded border border-red-200 transition-colors cursor-pointer font-medium ml-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>刪除</span>
                                </button>
                              )}
                            </div>
                          </div>

                        {/* Card input fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              區塊標題名稱：
                            </label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                              placeholder="例如：價格估算系統"
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              區塊圖示 (Icon)：
                            </label>
                            <select
                              value={feature.icon}
                              onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden bg-white"
                            >
                              {AVAILABLE_ICONS.map((iconOpt) => (
                                <option key={iconOpt.value} value={iconOpt.value}>
                                  {iconOpt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            區塊簡要說明：
                          </label>
                          <input
                            type="text"
                            value={feature.desc}
                            onChange={(e) => handleFeatureChange(idx, 'desc', e.target.value)}
                            placeholder="例如：透明化高山包車資估算，快速試算包車費用"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-gray-700 focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-semibold text-gray-700">
                                點擊動作 / 超連結目標：
                              </label>
                              <span className="text-[11px] text-emerald-700">支援內建工具或自訂網址</span>
                            </div>
                            <div className="space-y-1.5">
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleFeatureChange(idx, 'url', e.target.value);
                                  }
                                }}
                                className="w-full px-2.5 py-1 text-xs border border-gray-200 rounded bg-gray-50 text-gray-600 focus:outline-hidden"
                              >
                                {PRESET_URLS.map((preset, pIdx) => (
                                  <option key={pIdx} value={preset.value}>
                                    {preset.label}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="text"
                                value={feature.url}
                                onChange={(e) => handleFeatureChange(idx, 'url', e.target.value)}
                                placeholder="輸入 price.html、d0-hotel.html、feast.html、traffic.html 或 https://..."
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs font-mono focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              底部行動按鈕文字：
                            </label>
                            <input
                              type="text"
                              value={feature.actionText || '查看詳情'}
                              onChange={(e) => handleFeatureChange(idx, 'actionText', e.target.value)}
                              placeholder="例如：開始估算車資、瀏覽精選民宿、立即查詢"
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
                            />
                            <p className="text-[11px] text-gray-400 mt-1">卡片底部點擊指引文字</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="inline-flex items-center gap-2 border-2 border-dashed border-emerald-600 text-emerald-800 hover:bg-emerald-50 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>再新增一個功能區塊</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

              {/* TAB 2: ABOUT US EDITOR */}
              {activeTab === 'about' && (
                <div className="space-y-4 pt-1">
                  <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200">
                    <h4 className="text-sm font-bold text-[#1e3a29] flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-emerald-700" />
                      關於亞馬遜高山接駁 內容編輯
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      編輯顯示於首頁中下方的「關於亞馬遜高山接駁」區塊，支援分段文字（換行空一行即可分段）。
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      詳細介紹內容文字：
                    </label>
                    <textarea
                      rows={8}
                      value={formData.aboutContent}
                      onChange={(e) => handleInputChange('aboutContent', e.target.value)}
                      placeholder="請輸入關於亞馬遜高山接駁的說明文案..."
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-[#1e3a29] focus:outline-hidden"
                    />
                  </div>

                  {/* Live preview */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                      前台即時預覽：
                    </span>
                    <article className="bg-white p-4 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-600 leading-relaxed space-y-2">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="w-2 h-4 bg-[#1e3a29] rounded-full"></span>
                        <span className="font-bold text-[#1e3a29]">關於亞馬遜高山接駁</span>
                      </div>
                      {formData.aboutContent.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </article>
                  </div>
                </div>
              )}

              {/* TAB 3: TERMS & SERVICES EDITOR */}
              {activeTab === 'terms' && (
                <div className="space-y-4 pt-1">
                  <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200">
                    <h4 className="text-sm font-bold text-[#1e3a29] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      預約條款與服務須知 內容編輯
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      編輯山友點擊頁尾「條款與服務須知」後跳出的彈窗內容。標題請使用【標題名稱】，項目請使用「•」或換行。
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      服務條款與取消退訂政策內文：
                    </label>
                    <textarea
                      rows={12}
                      value={formData.termsContent}
                      onChange={(e) => handleInputChange('termsContent', e.target.value)}
                      placeholder="請輸入條款與服務須知內容..."
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm font-mono leading-relaxed focus:ring-2 focus:ring-[#1e3a29] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        頁尾連結文字：
                      </label>
                      <input
                        type="text"
                        value={formData.footerText}
                        onChange={(e) => handleInputChange('footerText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        頁尾連結目標 (預設: terms 開啟彈窗)：
                      </label>
                      <input
                        type="text"
                        value={formData.footerUrl}
                        onChange={(e) => handleInputChange('footerUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BASIC SETTINGS */}
              {activeTab === 'basic' && (
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        前台網站名稱 / 品牌大標題：
                      </label>
                      <input
                        type="text"
                        value={formData.siteTitle}
                        onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        副標題 / Slogan：
                      </label>
                      <input
                        type="text"
                        value={formData.siteSlogan}
                        onChange={(e) => handleInputChange('siteSlogan', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      全行保證信任標語橫條 (5大信任指標)：
                    </label>
                    <input
                      type="text"
                      value={formData.trustBannerText || ''}
                      onChange={(e) => handleInputChange('trustBannerText', e.target.value)}
                      placeholder="合法租賃營業車 • 職業駕照司機 • 準時接送不延誤 • 全台國登山口接送 • 500萬乘客平安險"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      項目間可使用圓點 (•)、空格或逗號分隔，前台會自動排版為同一水平橫條並以綠點串接顯示
                    </p>

                    {/* Live Preview of Trust Banner */}
                    <div className="mt-2.5 p-3 bg-[#1e3a29] rounded-lg border border-emerald-700/50">
                      <span className="text-emerald-300 text-[10px] font-bold block mb-1">
                        前台即時效果預覽：
                      </span>
                      <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs text-emerald-100 font-medium whitespace-nowrap overflow-x-auto scrollbar-none py-1">
                        {parseTrustItems(formData.trustBannerText).map((item, idx, arr) => (
                          <React.Fragment key={idx}>
                            <span>{item}</span>
                            {idx < arr.length - 1 && (
                              <span className="text-emerald-400 font-bold">•</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        LINE 官方預約連結：
                      </label>
                      <input
                        type="text"
                        value={formData.lineUrl}
                        onChange={(e) => handleInputChange('lineUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        客服電話：
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        客服 EMAIL：
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200 mt-6">
                {showResetConfirm ? (
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg text-xs">
                    <span className="text-amber-900 font-medium">確定要恢復為官方初始設定嗎？</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...DEFAULT_CONFIG });
                        setShowResetConfirm(false);
                        setActionNotice('已恢復官方預設值，請記得點擊「儲存並同步至前台」！');
                        setTimeout(() => setActionNotice(''), 4000);
                      }}
                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold cursor-pointer"
                    >
                      確定重置
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded cursor-pointer"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 py-1.5 px-3 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    恢復官方預設值
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1e3a29] hover:bg-[#284f38] text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>💾 儲存並同步至前台</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
