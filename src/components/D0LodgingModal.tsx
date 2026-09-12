import React, { useState } from 'react';
import { D0_HOTELS } from '../data/mountainData';
import { X, Home, Phone, MapPin, Check, Search, Sparkles, Info } from 'lucide-react';

interface D0LodgingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const D0LodgingModal: React.FC<D0LodgingModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('ALL');

  if (!isOpen) return null;

  const areas = ['ALL', '合歡/奇萊', '雪山/武陵', '玉山', '嘉明湖', '大霸尖山'];

  const filteredHotels = D0_HOTELS.filter(hotel => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.mountainArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedArea === 'ALL') return matchesSearch;
    return matchesSearch && hotel.mountainArea.includes(selectedArea.split('/')[0]);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border-2 border-[#1e3a29] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1e3a29] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-500/20 rounded-lg">
              <Home className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">D0 住宿推薦與合作民宿查詢</h2>
              <p className="text-xs text-emerald-200/80">登山口周邊平價客棧 · 配合清晨起登接駁 · 24H熱水澡</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜尋民宿名稱、百岳山區、鄉鎮..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {areas.map(area => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setSelectedArea(area)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedArea === area
                      ? 'bg-[#1e3a29] text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {area === 'ALL' ? '全部山區' : area}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              💡 亞馬遜接駁貼心提醒：D0（起登前一晚）先抵達中繼山莊適應高度，有助於降低高山症發作風險，司機隔日清晨皆可準時至民宿門口接送！
            </span>
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {filteredHotels.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              查無符合條件的 D0 住宿，請嘗試更換關鍵字或篩選全部山區。
            </div>
          ) : (
            filteredHotels.map(hotel => (
              <div
                key={hotel.id}
                className="bg-white border border-gray-200 rounded-xl p-4.5 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {hotel.mountainArea}
                      </span>
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {hotel.priceRange}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mt-1">
                      {hotel.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      {hotel.address}
                    </p>
                  </div>

                  <a
                    href={`tel:${hotel.phone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    致電預約：{hotel.phone}
                  </a>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {hotel.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {feat}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    📌 {hotel.note}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
