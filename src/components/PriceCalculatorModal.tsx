import React, { useState } from 'react';
import { MOUNTAIN_ROUTES } from '../data/mountainData';
import { X, Calculator, Copy, Check, Car, Users, Sparkles, MapPin, ExternalLink } from 'lucide-react';

interface PriceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lineUrl: string;
  phone: string;
}

export const PriceCalculatorModal: React.FC<PriceCalculatorModalProps> = ({
  isOpen,
  onClose,
  lineUrl,
  phone
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState(MOUNTAIN_ROUTES[0].id);
  const [pickupCity, setPickupCity] = useState<'taichung' | 'taipei' | 'hsinchu' | 'kaohsiung' | 'yilan'>('taichung');
  const [tripType, setTripType] = useState<'round' | 'oneway'>('round');
  const [passengerCount, setPassengerCount] = useState(7);
  const [needD0Wait, setNeedD0Wait] = useState(false);
  const [extraPickups, setExtraPickups] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentRoute = MOUNTAIN_ROUTES.find(r => r.id === selectedRouteId) || MOUNTAIN_ROUTES[0];
  
  // Calculate base price
  const baseRate = currentRoute.basePrice[pickupCity] || 5000;
  const tripMultiplier = tripType === 'round' ? 1.85 : 1.0;
  const d0Fee = needD0Wait ? 1500 : 0;
  const extraPickupFee = extraPickups * 400;

  const totalEstimate = Math.round((baseRate * tripMultiplier + d0Fee + extraPickupFee) / 100) * 100;
  const perPersonEstimate = Math.round(totalEstimate / Math.max(1, passengerCount));

  const cityNames = {
    taipei: '台北 / 新北',
    taichung: '台中 / 彰化 / 高鐵站',
    hsinchu: '新竹 / 苗栗 / 桃園',
    kaohsiung: '高雄 / 台南',
    yilan: '宜蘭 / 羅東'
  };

  const bookingText = `【亞馬遜高山接駁 - 線上預約詢價】
📍 路線景點：${currentRoute.name}
🚩 登山口：${currentRoute.trailhead}
🚗 上車出發地：${cityNames[pickupCity]}
📅 接駁行程：${tripType === 'round' ? '去回程雙向包車' : '單程接駁'}
👥 乘車人數：${passengerCount} 位山友
🏕️ D0住宿等候：${needD0Wait ? '需要 (前晚送抵民宿/隔日接送起登)' : '不需要'}
🚏 沿途加點接送：${extraPickups > 0 ? `${extraPickups} 處加點` : '單一定點上下車'}
💰 系統預估總資：NT$ ${totalEstimate.toLocaleString()} 元 (每人約 NT$ ${perPersonEstimate.toLocaleString()} 元)
-----------------------------
司機大哥您好，我想進一步預約日期與確認派車車況！`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLine = () => {
    // If possible copy first
    navigator.clipboard.writeText(bookingText);
    window.open(lineUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border-2 border-[#1e3a29] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#1e3a29] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-500/20 rounded-lg">
              <Calculator className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">高山登山包車價格估算系統</h2>
              <p className="text-xs text-emerald-200/80">透明化費用試算 · 專車接送 · 9人座豪華保姆車隊</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Route selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1e3a29] mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              1. 選擇百岳登山路線 / 登山口
            </label>
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#1e3a29] focus:outline-hidden"
            >
              {MOUNTAIN_ROUTES.map(route => (
                <option key={route.id} value={route.id}>
                  {route.popular ? '★ ' : ''}{route.name} ({route.region})
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs text-gray-500 bg-emerald-50/50 p-2.5 rounded-md border border-emerald-100 flex items-start gap-1.5">
              <span className="text-emerald-700 font-semibold shrink-0">登山口：</span>
              <span>{currentRoute.trailhead} · {currentRoute.durationEstimate}</span>
            </div>
          </div>

          {/* Step 2: Departure City & Trip Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1e3a29] mb-2">
                2. 上車出發縣市 / 集合地點
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(cityNames) as Array<keyof typeof cityNames>).map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setPickupCity(city)}
                    className={`py-2 px-2.5 text-xs font-medium rounded-lg border text-left transition-all cursor-pointer ${
                      pickupCity === city
                        ? 'bg-[#1e3a29] text-white border-[#1e3a29] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    {cityNames[city]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1e3a29] mb-2">
                3. 行程趟次選擇
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTripType('round')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    tripType === 'round'
                      ? 'bg-[#1e3a29] text-white border-[#1e3a29] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="font-bold text-sm">雙向來回接送</div>
                  <div className="text-[11px] opacity-80 mt-0.5">出發接駁 + 下山返程</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('oneway')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    tripType === 'oneway'
                      ? 'bg-[#1e3a29] text-white border-[#1e3a29] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="font-bold text-sm">單程接駁</div>
                  <div className="text-[11px] opacity-80 mt-0.5">僅去程送達或下山接回</div>
                </button>
              </div>

              {/* Passengers count */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">乘車預估人數 (試算每人分攤)：</span>
                  <span className="text-xs font-bold text-[#1e3a29]">{passengerCount} 人</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(parseInt(e.target.value))}
                  className="w-full accent-[#1e3a29] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Add-on options */}
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 space-y-2.5">
            <span className="text-xs font-bold text-gray-700">加值彈性選項</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={needD0Wait}
                  onChange={(e) => setNeedD0Wait(e.target.checked)}
                  className="w-4 h-4 text-[#1e3a29] rounded accent-[#1e3a29]"
                />
                <span>前晚 D0 住宿送達 + 隔日清晨起登接駁 (+NT$1,500)</span>
              </label>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">同城多點接送 (每點+400)：</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExtraPickups(Math.max(0, extraPickups - 1))}
                    className="w-6 h-6 rounded bg-white border border-gray-300 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="w-4 text-center font-bold">{extraPickups}</span>
                  <button
                    type="button"
                    onClick={() => setExtraPickups(Math.min(3, extraPickups + 1))}
                    className="w-6 h-6 rounded bg-white border border-gray-300 text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-br from-[#1e3a29] to-[#14281c] text-white p-5 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold flex items-center gap-1">
                  <Car className="w-3.5 h-3.5" />
                  9人座高山專用包車試算結果
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-white">
                    NT$ {totalEstimate.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-200">/ 整車包車</span>
                </div>
                <div className="text-xs text-white/80 mt-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-300" />
                  <span>
                    若 {passengerCount} 人均分，每人約僅 <strong className="text-amber-300 text-sm">NT$ {perPersonEstimate.toLocaleString()}</strong> 元
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/20 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? '已複製詢價單' : '複製試算單'}
                </button>

                <button
                  type="button"
                  onClick={handleOpenLine}
                  className="px-4 py-2.5 bg-[#06c755] hover:bg-[#05b34c] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  帶入估價加 LINE 預約
                </button>
              </div>
            </div>
            
            <p className="text-[11px] text-emerald-200/70 mt-3 pt-3 border-t border-white/10">
              * 費用包含：營業車輛乘客險、高山專業司機油資與過路費、慶功宴定點接駁。遇連續假期、雪季雪鏈加裝或跨日長期縱走，歡迎 LINE 直接詳洽確認！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
