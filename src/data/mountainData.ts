import { SiteConfig, MountainRoute, D0Hotel, FeastRestaurant, TrafficInfo } from '../types';

export const parseTrustItems = (text?: string): string[] => {
  if (!text || !text.trim()) {
    return [
      '合法租賃營業車',
      '職業駕照司機',
      '準時接送不延誤',
      '全台國登山口接送',
      '500萬乘客平安險'
    ];
  }
  const clean = text.trim();
  // Check if separated by bullets, middots, pipes, slashes, or newlines
  if (/[•·|\n]/.test(clean)) {
    const list = clean.split(/[•·|\n]+/).map(s => s.trim()).filter(Boolean);
    if (list.length > 0) return list;
  }
  // Check if separated by commas
  if (/[,，]/.test(clean)) {
    const list = clean.split(/[,，]+/).map(s => s.trim()).filter(Boolean);
    if (list.length > 0) return list;
  }
  // Check if separated by spaces
  const spaceParts = clean.split(/\s+/).filter(Boolean);
  if (spaceParts.length > 1) {
    return spaceParts;
  }
  return [clean];
};

export const DEFAULT_CONFIG: SiteConfig = {
  siteTitle: "亞馬遜高山接駁",
  siteSlogan: "安全 · 舒適 · 準時 | 專業百岳高山包車接駁",
  lineUrl: "https://lin.ee/TO7bDic",
  phone: "0972573495",
  email: "yy661003@gmail.com",
  trustBannerText: "合法租賃營業車  職業駕照司機  準時接送不延誤  全台國登山口接送 500萬乘客平安險",
  aboutContent: `亞馬遜高山接駁提供全台灣熱門百岳與高山步道之專業接駁服務。無論您是要前往合歡山群峰、雪山主東峰、嘉明湖（向陽）、玉山登山口、奇萊南華，或是能高越嶺等路線，我們皆提供安全、優質的接駁車隊體驗。

提供司機駕駛經驗豐富的高山接駁服務，協助登山客解決大眾運輸不便的問題。請善用本站提供的價格估算系統、D0住宿推薦、慶功宴餐廳資訊與即時道路管制動態，讓您的登山行程更安心順暢。`,
  termsContent: `【專業高山合格接駁車隊規範】
亞馬遜高山接駁嚴格採用政府立案之合法租賃營業車輛（T牌車），投保高額乘客意外險。司機均持有職業駕照，具備多年百岳高山、林道、窄路彎道駕駛經驗，定期車輛健檢與保養。

【一、預約與訂金收取規範】
• 預約確認後，請於約定時間內支付訂金（一般為車資之 30%），始完成留車手續。
• 尾款於接駁當日付清（現金、ATM轉帳、LINE Pay均可）。
• 如需開立發票或報帳收據，請於預約時提前告知統編與抬頭。

【二、登山裝備與行李攜帶規範】
• 九人座包車建議乘客人數為 6-8 人，以確保每位山友均有充足座位及 50L-75L 重裝登山大背包之置放空間。
• 請自備乾淨衣物於車上更換；登山杖尖端請務必加裝保護套，冰爪或瓦斯罐等請妥善打包裝袋。
• 下山返程提供車內免費暫存乾淨換洗衣物服務，讓您登頂下山後能舒適更衣返程。

【三、氣候異常與不可抗力取消政策】
• 若因中央氣象署發布海上/陸上颱風警報、豪大雨特報，或國家公園官方宣佈步道封閉、道路坍方落石中斷等不可抗拒之自然災害，訂金可全額退費或保留延期使用（僅扣除銀行手續費）。
• 若因個人因素（如抽中未去、自主取消）：出發前 7 日以上取消退還訂金 80%；出發前 3 日取消退還 50%；出發前 24 小時內取消恕不退還訂金。

【四、高山安全與守時協議】
• 高山行車請全程繫妥安全帶。車內全面禁菸及檳榔。
• 下山若因山區步道突發延誤，請領隊或山友在有手機訊號處第一時間聯絡司機回報進度，司機會在登山口耐心守候。`,
  features: [
    {
      id: "price",
      title: "價格估算系統",
      desc: "透明化高山包車資估算，快速試算包車費用",
      url: "price.html",
      icon: "Calculator"
    },
    {
      id: "d0",
      title: "D0 住宿查詢",
      desc: "登山口周邊優質民宿與接駁合作住宿推薦",
      url: "d0-hotel.html",
      icon: "Hotel"
    },
    {
      id: "feast",
      title: "下山慶功宴查詢",
      desc: "精選完登下山補給合菜與在地美食餐廳",
      url: "feast.html",
      icon: "Utensils"
    },
    {
      id: "traffic",
      title: "道路路線管制查詢",
      desc: "即時掌握林道與高山省道最新施工管制時間",
      url: "traffic.html",
      icon: "AlertTriangle"
    }
  ],
  footerText: "條款與服務須知",
  footerUrl: "terms",
  card1Title: "價格估算系統",
  card1Desc: "透明化高山包車資估算，快速試算包車費用",
  card1Url: "price.html",
  card2Title: "D0 住宿查詢",
  card2Desc: "登山口周邊優質民宿與接駁合作住宿推薦",
  card2Url: "d0-hotel.html",
  card3Title: "下山慶功宴查詢",
  card3Desc: "精選完登下山補給合菜與在地美食餐廳",
  card3Url: "feast.html",
  card4Title: "道路路線管制查詢",
  card4Desc: "即時掌握林道與高山省道最新施工管制時間",
  card4Url: "traffic.html"
};

export const MOUNTAIN_ROUTES: MountainRoute[] = [
  {
    id: "hehuan",
    name: "合歡山群峰 / 小風口 / 武嶺",
    region: "南投/花蓮",
    trailhead: "小風口停車場 / 石門山 / 主峰登山口",
    basePrice: {
      taichung: 4500,
      taipei: 6800,
      hsinchu: 6000,
      kaohsiung: 7800,
      yilan: 6500
    },
    durationEstimate: "台中出發約 2.5 小時；台北出發約 4 小時",
    notes: "雪季或假日車潮需提前出發，路程經過翠峰管制站。",
    popular: true
  },
  {
    id: "xueshan",
    name: "雪山主東峰 / 武陵農場登山口",
    region: "台中和平",
    trailhead: "武陵農場雪山登山口大水池",
    basePrice: {
      taichung: 6500,
      taipei: 6000,
      yilan: 4800,
      hsinchu: 6500,
      kaohsiung: 9000
    },
    durationEstimate: "台北/宜蘭出發約 3.5-4 小時；台中出發約 4.5 小時",
    notes: "武陵農場門票需自理，夜衝或清晨出發免塞車。",
    popular: true
  },
  {
    id: "yushan",
    name: "玉山前峰/主西峰 / 塔塔加登山口",
    region: "南投/嘉義",
    trailhead: "塔塔加鞍部 (排雲管理站接駁點)",
    basePrice: {
      taichung: 5200,
      kaohsiung: 5800,
      taipei: 7500,
      hsinchu: 6800,
      yilan: 8500
    },
    durationEstimate: "台中出發約 3 小時；高雄出發約 3.5 小時",
    notes: "台21線新中橫草坪頭至塔塔加每日17:30至隔日07:00夜間封閉管制。",
    popular: true
  },
  {
    id: "jiaminghu",
    name: "嘉明湖 / 向陽國家森林遊樂區",
    region: "台東海端",
    trailhead: "向陽登山口大門",
    basePrice: {
      kaohsiung: 6800,
      taichung: 8500,
      taipei: 9800,
      hsinchu: 9200,
      yilan: 9000
    },
    durationEstimate: "高雄經南橫約 3.5-4 小時；台東池上出發約 1.5 小時",
    notes: "南橫公路梅山口至向陽每週二、四常態管制通行（依公路局最新公告）。",
    popular: true
  },
  {
    id: "qilai_nanhua",
    name: "奇萊南華 / 能高越嶺西段 (屯原登山口)",
    region: "南投仁愛",
    trailhead: "屯原登山口 (雲天宮高繞接駁處)",
    basePrice: {
      taichung: 4800,
      taipei: 7000,
      hsinchu: 6200,
      kaohsiung: 8000,
      yilan: 7500
    },
    durationEstimate: "台中出發約 2.5-3 小時，至廬山轉接駁",
    notes: "路況常受雨季土石影響，目前需注意雲天宮高繞路況。",
    popular: true
  },
  {
    id: "dabajian",
    name: "大霸尖山 / 觀霧大鹿林道東線",
    region: "新竹五峰/苗栗泰安",
    trailhead: "觀霧山莊 / 大鹿林道東線 0.3K",
    basePrice: {
      hsinchu: 4500,
      taipei: 5800,
      taichung: 6200,
      kaohsiung: 8500,
      yilan: 6800
    },
    durationEstimate: "新竹高鐵出發約 2.5 小時；台北出發約 3.5 小時",
    notes: "大鹿林道東線現開放自主騎乘自行車入山，車行僅至管制站。",
    popular: true
  },
  {
    id: "wuling_four",
    name: "武陵四秀 (品田/池有/桃山/喀拉業)",
    region: "台中和平",
    trailhead: "武陵山莊登山口",
    basePrice: {
      yilan: 4800,
      taipei: 6000,
      taichung: 6500,
      hsinchu: 6500,
      kaohsiung: 9000
    },
    durationEstimate: "宜蘭出發約 2.5 小時；台北出發約 3.5-4 小時",
    notes: "可甲進乙出 (例如：武陵山莊進、池有進桃山出)，接駁可配合彈性等候。",
    popular: false
  },
  {
    id: "zhilu",
    name: "錐麓古道 / 太魯閣國家公園",
    region: "花蓮秀林",
    trailhead: "燕子口錐麓吊橋 / 慈母橋",
    basePrice: {
      yilan: 4200,
      taipei: 6500,
      taichung: 7800,
      kaohsiung: 9500,
      hsinchu: 7500
    },
    durationEstimate: "花蓮市區約 1 小時；宜蘭出發約 2 小時",
    notes: "需申請入園入山證，入園時間為上午 07:00 - 10:00 截止。",
    popular: false
  },
  {
    id: "nenggao_andongjun",
    name: "能高安東軍 (奧萬大出)",
    region: "南投仁愛",
    trailhead: "屯原進 / 奧萬大國家森林遊樂區出",
    basePrice: {
      taichung: 7800,
      taipei: 10500,
      kaohsiung: 10000,
      hsinchu: 9500,
      yilan: 11000
    },
    durationEstimate: "跨天雙向接駁服務",
    notes: "長天數縱走，下山點奧萬大常有涉水或路況異動，司機保持衛星通訊聯絡。",
    popular: false
  }
];

export const D0_HOTELS: D0Hotel[] = [
  {
    id: "h1",
    name: "春陽溫泉 / 廬山一品民宿",
    mountainArea: "奇萊南華 / 能高越嶺 / 合歡群峰",
    address: "南投縣仁愛鄉春陽村虎門巷",
    phone: "0912-345-678",
    priceRange: "每人 NT$ 600 - 900 / 床",
    features: ["24小時熱水澡", "免費裝備打包空間", "清晨摸黑退房OK", "天然碳酸氫鈉泉舒緩肌肉"],
    note: "爬山前一晚泡湯放鬆首選，距屯原登山口車程約 40 分鐘。"
  },
  {
    id: "h2",
    name: "清境雲海景觀背包客棧",
    mountainArea: "合歡群峰 / 奇萊主北",
    address: "南投縣仁愛鄉大同村仁和路",
    phone: "049-280-3366",
    priceRange: "每人 NT$ 800 - 1,200 / 床",
    features: ["提早供應外帶早餐袋", "附設高山適應休息廳", "接駁車可直達門口停車載客"],
    note: "海拔約 2,000 公尺，是初次攀登百岳高山適應高度的最佳 D0 基地。"
  },
  {
    id: "h3",
    name: "環山部落 / 詩歌謠天空民宿",
    mountainArea: "雪山主東 / 武陵四秀 / 志佳陽大山",
    address: "台中市和平區平等里中興路三段 (環山部落)",
    phone: "0937-296-880",
    priceRange: "每人 NT$ 700 - 1,000 / 床",
    features: ["部落泰雅文化導覽", "清晨起登叫車接送配合", "冷藏冰箱借用", "提供脫水機"],
    note: "距離武陵農場登山口僅約 25 分鐘，避開武陵高價住宿的熱門首選。"
  },
  {
    id: "h4",
    name: "東埔警光山莊 & 溫泉旅社",
    mountainArea: "玉山群峰 / 八通關古道",
    address: "南投縣信義鄉東埔村開高巷",
    phone: "049-270-1360",
    priceRange: "每人 NT$ 500 - 900 / 床",
    features: ["平價高CP值溫泉", "公共大浴池", "停車方便", "司機配合晨間接駁上塔塔加"],
    note: "從東埔往塔塔加車程約 50 分鐘，路況優良。"
  },
  {
    id: "h5",
    name: "池上稻香背包客棧 / 換鵝山房",
    mountainArea: "嘉明湖 / 戒茂斯山",
    address: "台東縣池上鄉仁愛路",
    phone: "089-862-415",
    priceRange: "每人 NT$ 600 - 850 / 床",
    features: ["池上火車站步行3分鐘", "裝備寄存服務", "向陽接駁指定集合點", "池上便當代訂"],
    note: "搭火車抵達池上後休息 D0，隔日清晨專車走南橫公路上向陽。"
  },
  {
    id: "h6",
    name: "觀霧加羅板 / 清泉溫泉山莊",
    mountainArea: "大霸尖山 / 榛山步道",
    address: "新竹縣五峰鄉桃山村清泉",
    phone: "03-585-6012",
    priceRange: "每人 NT$ 750 - 1,100 / 床",
    features: ["三毛夢屋旁", "附設溫泉舒壓", "提供熱水供應與乾糧販售", "山區訊號良好"],
    note: "前往觀霧大霸前的中繼站，降低清晨舟車勞頓的疲勞。"
  }
];

export const FEAST_RESTAURANTS: FeastRestaurant[] = [
  {
    id: "f1",
    name: "埔里日高日式料理 / 埔里四季熱炒合菜",
    town: "南投埔里",
    mountainArea: "合歡山 / 奇萊南華 / 干卓萬 下山",
    cuisine: "台式熱炒合菜、放山土雞、甘蔗筍",
    signatureDishes: ["招牌白斬土雞", "埔里特產炒甘蔗筍", "刺蔥蛋", "剝皮辣椒雞湯"],
    phone: "049-299-1234",
    address: "南投縣埔里鎮中山路三段",
    pricePerPerson: "每人約 NT$ 350 - 550",
    parking: "備有大型專用停車場，9人座包車超好停"
  },
  {
    id: "f2",
    name: "大坑九號甕仔雞 / 國姓甕缸雞",
    town: "台中北屯 / 國姓交流道",
    mountainArea: "中部百岳下山返程",
    cuisine: "古早味柴燒甕仔雞、熱炒海產",
    signatureDishes: ["招牌皮脆多汁甕仔雞", "現炸豆腐", "筍絲大腸", "鮮菇蛤蜊湯"],
    phone: "04-2239-5566",
    address: "台中市北屯區東山路一段 / 國姓交流道口",
    pricePerPerson: "每人約 NT$ 300 - 450",
    parking: "超寬敞停車場，登山社團聚餐最愛"
  },
  {
    id: "f3",
    name: "宜蘭礁溪福哥石窯雞",
    town: "宜蘭礁溪",
    mountainArea: "雪山 / 武陵四秀 / 南湖大山 下山",
    cuisine: "石窯烤雞、蘭陽平原野菜合菜",
    signatureDishes: ["黑羽土雞石窯烤雞", "溫泉空心菜", "糕渣卜肉雙拼", "西魯肉鍋"],
    phone: "03-988-2235",
    address: "宜蘭縣礁溪鄉白雲三路11號",
    pricePerPerson: "每人約 NT$ 400 - 600",
    parking: "專屬大停車場，近頭城交流道"
  },
  {
    id: "f4",
    name: "水里野鴨谷餐廳 / 董家肉圓",
    town: "南投水里",
    mountainArea: "玉山主東 / 八通關 / 郡大西巒 下山",
    cuisine: "山產水產合菜、梅子風味餐",
    signatureDishes: ["脆皮野鴨", "梅汁排骨", "高山清蒸鱸魚", "過貓拌野薑花蛋黃"],
    phone: "049-277-0058",
    address: "南投縣水里鄉中山路一段",
    pricePerPerson: "每人約 NT$ 350 - 500",
    parking: "餐廳對面有公有大型停車場"
  },
  {
    id: "f5",
    name: "池上翠華小館 / 全美行池上鐵路月台餐盒",
    town: "台東池上",
    mountainArea: "嘉明湖 / 戒茂斯 下山",
    cuisine: "客家精緻合菜、在地縱谷農產",
    signatureDishes: ["客家小炒", "白斬玉米雞", "福菜五花肉湯", "乾煎在地豆腐"],
    phone: "089-863-487",
    address: "台東縣池上鄉靜元路",
    pricePerPerson: "每人約 NT$ 300 - 450",
    parking: "火車站前街區周邊好停車"
  },
  {
    id: "f6",
    name: "竹東阿平客家菜 / 莊記牛肉麵",
    town: "新竹竹東",
    mountainArea: "大霸尖山 / 霞喀羅古道 下山",
    cuisine: "道地傳統客家風味",
    signatureDishes: ["薑絲大腸", "梅干扣肉刈包", "桔醬三層肉", "炒粄條"],
    phone: "03-596-2211",
    address: "新竹縣竹東鎮東寧路三段",
    pricePerPerson: "每人約 NT$ 300 - 500",
    parking: "近竹東停三停車場"
  }
];

export const TRAFFIC_REGULATIONS: TrafficInfo[] = [
  {
    id: "t1",
    route: "台14甲線 (合歡山公路)",
    section: "翠峰(18K) 至 大禹嶺(41.5K)",
    mountainArea: "合歡群峰 / 奇萊主北 / 武嶺",
    status: "定時管制",
    statusColor: "amber",
    controlHours: "夜間 17:00 至 翌日 07:00 預警性封閉（冬季雪季路面結冰加強管制）",
    detail: "日間正常雙向通車。如逢雪季降雪或路面結冰，武嶺至合歡山遊客中心限加掛雪鏈車輛通行。亞馬遜車隊均備有合格認證雪鏈及四輪驅動車。",
    lastUpdated: "即時聯網更新中",
    emergencyContact: "公路局埔里工務段 049-298-2066"
  },
  {
    id: "t2",
    route: "台20線 (南部橫貫公路)",
    section: "梅山口(105K) 至 向陽(149K)",
    mountainArea: "嘉明湖 / 南橫三星 (庫哈諾辛、塔關、關山嶺)",
    status: "定時管制",
    statusColor: "amber",
    controlHours: "每日開放時間 07:00 - 14:00，17:00 全線淨空。每週二、四常態不開放通行！",
    detail: "欲攀登嘉明湖或南橫三星，請務必避開每週二、四管制日。亞馬遜司機熟悉放行時段，會為登山隊安排最適時間通過梅山口。",
    lastUpdated: "即時聯網更新中",
    emergencyContact: "公路局甲仙工務段 07-675-1014"
  },
  {
    id: "t3",
    route: "台8線 (中橫公路東段)",
    section: "大禹嶺(110K) 至 天祥(167K)",
    mountainArea: "太魯閣 / 奇萊東稜 / 錐麓古道",
    status: "施工交管",
    statusColor: "red",
    controlHours: "採每日固定時段放行（08:00、10:00、12:00-13:00、15:00、17:00）",
    detail: "受地震邊坡落石修復工程影響，東段實施時段放行管制，夜間封閉。如前往錐麓或由花蓮端進出，接駁車程需預留充足等待時間。",
    lastUpdated: "即時聯網更新中",
    emergencyContact: "公路局太魯閣工務段 03-861-0775"
  },
  {
    id: "t4",
    route: "台21線 (新中橫公路)",
    section: "草坪頭(110K) 至 塔塔加(145K)",
    mountainArea: "玉山群峰 / 鹿林山 / 麟趾山",
    status: "夜間封閉",
    statusColor: "amber",
    controlHours: "每日 17:30 至 隔日 07:00 實施常態性夜間封閉管制",
    detail: "日間雙向通行無虞。玉山單攻或下山接駁隊伍，若預估傍晚下山，司機將提前於塔塔加等候，以確保能在 17:30 封閉前順利通過草坪頭管制站。",
    lastUpdated: "即時聯網更新中",
    emergencyContact: "公路局信義工務段 049-279-1510"
  },
  {
    id: "t5",
    route: "大鹿林道東線",
    section: "觀霧管制站 (0.3K) 至 馬達拉溪登山口 (19K)",
    mountainArea: "大霸尖山 / 小霸尖山 / 伊澤山 / 加利山",
    status: "正常通行",
    statusColor: "green",
    controlHours: "林道僅開放公務車、登山步行與合法審驗合格之自行車進入",
    detail: "接駁車輛僅能到達觀霧山莊及林道 0.3K 管制站，後續 19 公里林道需徒步或租賃自行車進入。亞馬遜提供大霸尖山去程提早送抵觀霧、回程約定時間守候服務。",
    lastUpdated: "即時聯網更新中",
    emergencyContact: "雪霸國家公園觀霧管理站 037-276-300"
  },
  {
    id: "t6",
    route: "台7甲線 (中橫宜蘭支線)",
    section: "棲蘭 至 武陵農場 / 思源埡口",
    mountainArea: "雪山主東 / 武陵四秀 / 南湖大山 / 塚呂馬布",
    status: "正常通行",
    statusColor: "green",
    controlHours: "全線全日雙向通行正常（邊坡零星維護請減速慢行）",
    detail: "近期氣候良好路面順暢，思源埡口清晨常有濃霧，亞馬遜高山經驗司機配備專業高照度霧燈及車距雷達安全駕駛。",
    lastUpdated: "即時聯網更新中",
    emergencyContact: "公路局獨立山工務段 03-980-9601"
  }
];
