import React from 'react';
import { TRAFFIC_REGULATIONS } from '../data/mountainData';
import { X, AlertTriangle, ShieldCheck, Clock, Phone, Navigation, ExternalLink } from 'lucide-react';

interface TrafficModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrafficModal: React.FC<TrafficModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '正常通行':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case '定時管制':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case '施工交管':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case '夜間封閉':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border-2 border-[#1e3a29] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1e3a29] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">高山公路與林道路線管制即時動態</h2>
              <p className="text-xs text-emerald-200/80">南橫 · 合歡山 · 中橫 · 新中橫 · 觀霧大鹿林道</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info banner */}
        <div className="p-4 bg-amber-50/80 border-b border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong>亞馬遜車隊專業調度承諾：</strong>
            高山道路常因邊坡修繕、氣候或季節更替實施預警管制。亞馬遜接駁司機每日密切注意交通部公路局即時路況，事前會依管制時段與主辦領隊精準推估接駁時間，避免山友於管制站久候或受阻。
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {TRAFFIC_REGULATIONS.map(item => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4.5 hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}>
                    ● {item.status}
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    {item.route}
                  </h3>
                  <span className="text-xs text-gray-500 font-mono">
                    ({item.section})
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                  {item.mountainArea}
                </span>
              </div>

              {/* Control hours */}
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex items-start gap-2 text-xs">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-800">管制時段／放行時間：</span>
                  <p className="text-gray-700 mt-0.5 font-medium">{item.controlHours}</p>
                </div>
              </div>

              {/* Detail & notes */}
              <p className="text-xs text-gray-600 leading-relaxed">
                {item.detail}
              </p>

              {/* Contact */}
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  權責工務段：{item.emergencyContact}
                </span>
                <span className="text-[11px] text-gray-400">
                  狀態：{item.lastUpdated}
                </span>
              </div>
            </div>
          ))}

          {/* Quick link to Highway Bureau */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
            <p className="text-xs text-gray-600 mb-2">欲查詢全台灣省道即時路況影像與最新突發路況通報：</p>
            <a
              href="https://168.thb.gov.tw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:border-gray-400 rounded-lg text-xs font-semibold text-gray-700 shadow-xs transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#1e3a29]" />
              公路局省道即時資訊服務網 (168.thb.gov.tw)
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
