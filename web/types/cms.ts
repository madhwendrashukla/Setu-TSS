export interface HeroData {
  top_badge?: string;
  headline: {
    text: string;
    color: string;
    font?: string;
    size?: string;
  };
  description: string;
  key_highlights: string[];
}

export interface StoryBox {
  title: string;
  description: string;
  bullets: {
    text: string;
    style: 'check' | 'cross';
  }[];
}

export interface StoryData {
  visible: boolean;
  headline: string;
  description: string;
  boxes: StoryBox[];
}

export interface OutputData {
  image_url: string;
  headline: {
    text: string;
    color: string;
  };
  bullets: string[];
}

export interface WorkshopDetailBullets {
  what_youll_learn: string[];
  your_deliverables: string[];
}

export interface WorkshopPricing {
  strike_price: number;
  actual_price: number;
  date_time_bullets: string[];
  mode: 'online' | 'offline';
  address: string | null;
}

export interface CTAData {
  text: string;
  active: boolean;
}

export interface WorkshopSession {
  title: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface WorkshopData {
  id: string;
  priority_order: number;
  heading: string;
  title: string;
  key_features: string;
  detail_bullets: WorkshopDetailBullets;
  pricing: WorkshopPricing;
  cta: CTAData;
  visible: boolean;
  color?: string;
  icon?: string;
  badge?: string;
  mentor?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  duration?: string;
  sessions?: WorkshopSession[];
  date_time_html?: string;
  calendarLinks?: { label: string; url: string }[];
}

export interface MentorData {
  id: string;
  image_url: string;
  name: string;
  professional_headline: string;
  professional_description: string;
  credential_bullets: string[];
  visible: boolean;
  color?: string;
  imagePosition?: string;
  badge_text?: string;
}

export interface MentorsSectionData {
  section_headline: string;
  items: MentorData[];
}

export interface VideoGalleryData {
  headline: string | null;
  videos: string[];
}

export interface TestimonialData {
  id: string;
  type?: 'text' | 'video';
  // Text Testimonial fields
  name?: string;
  role?: string;
  company?: string;
  city?: string;
  rating?: number;
  quote?: string;
  // Video Testimonial fields
  video_url?: string;
  video_heading?: string;
  video_description?: string;
  show_description?: boolean;
  visible: boolean;
}

export interface FAQData {
  id: string;
  priority_order: number;
  question: string;
  answer: string;
  visible: boolean;
}

export interface ContactWhatsApp {
  headline: string;
  description: string;
  button_text: string;
  link: string;
}

export interface ContactLeadForm {
  headline: string;
  subtext: string;
  submit_text: string;
  destination_email: string;
  destination_contact_number: string;
}

export interface ContactData {
  whatsapp: ContactWhatsApp;
  lead_form: ContactLeadForm;
}

export interface CouponData {
  code: string;
  discount_percent: number;
  active: boolean;
  expiry_date?: string;
}

export interface ExtrasData {
  workshop_nudges: {
    enabled: boolean;
    frequency_sections: number;
  };
  footer: string;
  chatbot: {
    enabled: boolean;
    note: string;
  };
}

export interface SectionVisibility {
  hero: boolean;
  story: boolean;
  output: boolean;
  workshops: boolean;
  pricing: boolean;
  mentors: boolean;
  video_gallery: boolean;
  text_testimonials: boolean;
  video_testimonials: boolean;
  faqs: boolean;
  contact: boolean;
}

export interface PricingTier {
  id: string;
  priority_order: number;
  heading: string;
  title: string;
  key_features: string;
  sessions?: WorkshopSession[];
  date_time_html?: string;
  pricing: {
    strike_price: number;
    actual_price: number;
    date_time_bullets: string[];
    mode: string;
    address?: string;
  };
  cta: {
    text: string;
    active: boolean;
  };
  visible: boolean;
}

export interface PageData {
  registrations_open?: boolean;
  section_visibility: SectionVisibility;
  hero: HeroData;
  story: StoryData;
  output: OutputData;
  workshops: WorkshopData[];
  pricing_options?: PricingTier[];
  mentors: MentorsSectionData;
  video_gallery: VideoGalleryData;
  text_testimonials: TestimonialData[];
  video_testimonials: TestimonialData[];
  faqs: FAQData[];
  contact: ContactData;
  coupon: CouponData;
  extras: ExtrasData;
}
