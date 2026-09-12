import React from 'react';
import { X, FileText, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  email: string;
  termsContent?: string;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  phone,
  email,
  termsContent
}) => {
  if (!isOpen) return null;

  // Format terms content into blocks
  const renderFormattedTerms = (text: string) => {
    const blocks = text.split('\n\n').map(b => b.trim()).filter(Boolean);
    return blocks.map((block, idx) => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      const firstLine = lines[0] || '';

      // Check if this block is a special banner/header
      if (firstLine.includes('【專業高山合格接駁車隊規範】') || firstLine.includes('車隊規範')) {
        const remaining = lines.slice(1).join(' ');
        return (
          <div key={idx} className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-sm text-emerald-800">
              <Shield className="w-4 h-4 text-emerald-600" />
              {firstLine.replace(/[【】]/g, '')}
            </p>
            <p>{remaining || firstLine}</p>
          </div>
        );
      }

      // If it starts with 【 or a numbered heading
      const isHeader = firstLine.startsWith('【') || /^[一二三四五六七八九十0-9]+[、. ]/.test(firstLine);
      const title = isHeader ? firstLine.replace(/[【】]/g, '') : null;
      const contentLines = isHeader ? lines.slice(1) : lines;

      return (
        <div key={idx} className="space-y-1.5">
          {title && (
            <h3 className="font-bold text-[#1e3a29] flex items-center gap-1.5 text-sm">
              {title.includes('取消') ? (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{title}</span>
            </h3>
          )}
          {contentLines.length > 0 && (
            <div className="space-y-1 text-xs text-gray-600">
              {contentLines.map((line, lineIdx) => {
                const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
                const cleanLine = isBullet ? line.replace(/^[•\-*]\s*/, '') : line;
                return (
                  <div key={lineIdx} className={isBullet ? "flex items-start gap-1.5 pl-2" : ""}>
                    {isBullet && <span className="text-emerald-600 font-bold shrink-0">•</span>}
                    <p className="leading-relaxed">{cleanLine}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border-2 border-[#1e3a29] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1e3a29] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-300" />
            <h2 className="text-lg font-bold">亞馬遜高山接駁 預約條款與服務須知</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-gray-700 leading-relaxed">
          {termsContent ? (
            renderFormattedTerms(termsContent)
          ) : (
            <>
              <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-sm text-emerald-800">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  專業高山合格接駁車隊規範
                </p>
                <p>亞馬遜高山接駁嚴格採用政府立案之合法租賃營業車輛（T牌車），投保高額乘客意外險。司機均持有職業駕照，具備多年百岳高山、林道、窄路彎道駕駛經驗，定期車輛健檢與保養。</p>
              </div>

              <div>
                <h3 className="font-bold text-[#1e3a29] flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  一、預約與訂金收取規範
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                  <li>預約確認後，請於約定時間內支付訂金（一般為車資之 30%），始完成留車手續。</li>
                  <li>尾款於接駁當日付清（現金、ATM轉帳、LINE Pay均可）。</li>
                  <li>如需開立發票或報帳收據，請於預約時提前告知統編與抬頭。</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#1e3a29] flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  二、登山裝備與行李攜帶規範
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                  <li>九人座包車建議乘客人數為 6-8 人，以確保每位山友均有充足座位及 50L-75L 重裝登山大背包之置放空間。</li>
                  <li>請自備乾淨衣物於車上更換；登山杖尖端請務必加裝保護套，冰爪或瓦斯罐等請妥善打包裝袋。</li>
                  <li>下山返程提供車內免費暫存乾淨換洗衣物服務，讓您登頂下山後能舒適更衣返程。</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#1e3a29] flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  三、氣候異常與不可抗力取消政策
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                  <li>若因中央氣象署發布海上/陸上颱風警報、豪大雨特報，或國家公園官方宣佈步道封閉、道路坍方落石中斷等不可抗拒之自然災害，<strong>訂金可全額退費或保留延期使用</strong>（僅扣除銀行手續費）。</li>
                  <li>若因個人因素（如抽中未去、自主取消）：出發前 7 日以上取消退還訂金 80%；出發前 3 日取消退還 50%；出發前 24 小時內取消恕不退還訂金。</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#1e3a29] flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  四、高山安全與守時協議
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                  <li>高山行車請全程繫妥安全帶。車內全面禁菸及檳榔。</li>
                  <li>下山若因山區步道突發延誤，請領隊或山友在有手機訊號處第一時間聯絡司機回報進度，司機會在登山口耐心守候。</li>
                </ul>
              </div>
            </>
          )}

          <div className="pt-3 border-t border-gray-200 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
            <span>聯絡專線：{phone}</span>
            <span>電子信箱：{email}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-right shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#1e3a29] hover:bg-[#284f38] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            我知道了，關閉須知
          </button>
        </div>
      </div>
    </div>
  );
};
