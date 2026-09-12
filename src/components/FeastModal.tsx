import React, { useState } from 'react';
import { FEAST_RESTAURANTS } from '../data/mountainData';
import { X, Utensils, Phone, MapPin, Search, Car, Flame } from 'lucide-react';

interface FeastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeastModal: React.FC<FeastModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTown, setSelectedTown] = useState('ALL');

  if (!isOpen) return null;

  const towns = ['ALL', '埔里', '宜蘭', '台中', '南投水里', '池上', '竹東'];

  const filteredRestaurants = FEAST_RESTAURANTS.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.town.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.mountainArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedTown === 'ALL') return matchesSearch;
    return matchesSearch && r.town.includes(selectedTown);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border-2 border-[#1e3a29] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1e3a29] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-500/20 rounded-lg">
              <Utensils className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">完登下山慶功宴餐廳指南</h2>
              <p className="text-xs text-emerald-200/80">在地合菜熱炒 · 柴燒甕仔雞 · 接駁專車直達門口停車</p>
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
                placeholder="搜尋餐廳、特色菜名、下山地區..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#1e3a29] focus:outline-hidden"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {towns.map(town => (
                <button
                  key={town}
                  type="button"
                  onClick={() => setSelectedTown(town)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedTown === town
                      ? 'bg-[#1e3a29] text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {town === 'ALL' ? '全部地區' : town}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-emerald-900 bg-emerald-50/80 p-2.5 rounded border border-emerald-200 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              亞馬遜包車服務包含：下山接駁可彈性停留慶功宴餐廳（1.5 小時以內），司機耐心等候並照看大背包！
            </span>
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              查無符合條件的慶功宴餐廳，請嘗試更換關鍵字。
            </div>
          ) : (
            filteredRestaurants.map(restaurant => (
              <div
                key={restaurant.id}
                className="bg-white border border-gray-200 rounded-xl p-4.5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {restaurant.town}
                      </span>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {restaurant.mountainArea}
                      </span>
                      <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {restaurant.pricePerPerson}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mt-1">
                      {restaurant.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      {restaurant.address}
                    </p>
                  </div>

                  <a
                    href={`tel:${restaurant.phone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    電話預訂：{restaurant.phone}
                  </a>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  <div>
                    <span className="text-xs font-semibold text-gray-700">招牌必點菜色：</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {restaurant.signatureDishes.map((dish, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-medium"
                        >
                          🍲 {dish}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 flex items-center gap-1.5 bg-gray-50 p-2 rounded">
                    <Car className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>停車資訊：</strong>{restaurant.parking}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
