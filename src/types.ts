export interface FeatureCard {
  id: string;
  title: string;
  desc: string;
  url: string; // e.g., "price.html", "d0-hotel.html", "https://..."
  icon: string; // Icon identifier like "Calculator", "Hotel", "Utensils", "AlertTriangle", etc.
  actionText?: string;
  badge?: string;
}

export interface SiteConfig {
  siteTitle: string;
  siteSlogan: string;
  lineUrl: string;
  phone: string;
  email: string;
  trustBannerText?: string;
  aboutContent: string;
  termsContent: string;
  features: FeatureCard[];
  footerText: string;
  footerUrl: string;
  // Backward compatibility fields
  card1Title?: string;
  card1Desc?: string;
  card1Url?: string;
  card2Title?: string;
  card2Desc?: string;
  card2Url?: string;
  card3Title?: string;
  card3Desc?: string;
  card3Url?: string;
  card4Title?: string;
  card4Desc?: string;
  card4Url?: string;
}

export interface MountainRoute {
  id: string;
  name: string;
  region: string;
  trailhead: string;
  basePrice: {
    taipei: number;
    taichung: number;
    kaohsiung: number;
    hsinchu: number;
    yilan: number;
  };
  durationEstimate: string;
  notes: string;
  popular: boolean;
}

export interface D0Hotel {
  id: string;
  name: string;
  mountainArea: string;
  address: string;
  phone: string;
  priceRange: string;
  features: string[];
  note: string;
}

export interface FeastRestaurant {
  id: string;
  name: string;
  town: string;
  mountainArea: string;
  cuisine: string;
  signatureDishes: string[];
  phone: string;
  address: string;
  pricePerPerson: string;
  parking: string;
}

export interface TrafficInfo {
  id: string;
  route: string;
  section: string;
  mountainArea: string;
  status: '正常通行' | '定時管制' | '夜間封閉' | '施工交管' | '雪季管制';
  statusColor: 'green' | 'amber' | 'red' | 'blue';
  controlHours: string;
  detail: string;
  lastUpdated: string;
  emergencyContact: string;
}
