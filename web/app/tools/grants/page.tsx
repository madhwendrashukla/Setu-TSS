'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Search, Filter, RefreshCw, CheckCircle2, AlertCircle, 
  ExternalLink, Building2, HelpCircle, CheckSquare, 
  Layers, MapPin, BookOpen
} from 'lucide-react';
import { grantsData, Grant } from '@/lib/data/grants';

type LanguageKey = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'mr';

// Translations Dictionary (Updated to remove 0% equity references and wizard strings)
const translations: Record<LanguageKey, {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    region: string;
    stage: string;
    sector: string;
    clearFilters: string;
    resultsFound: string;
    applyLink: string;
    howToApply: string;
    docsNeeded: string;
    verified: string;
    affiliation: string;
    deadline: string;
    funding: string;
    provider: string;
    stageLabel: string;
    criteria: string;
    backToTools: string;
    statsTotal: string;
    statsDeadlines: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    all: string;
}> = {
    en: {
        title: "Grants & Schemes Directory",
        subtitle: "Search and discover active government-backed schemes, incubation programs, and startup grants.",
        searchPlaceholder: "Search by grant name, provider, sector...",
        region: "Region / State",
        stage: "Startup Stage",
        sector: "Focus Sector",
        clearFilters: "Clear Filters",
        resultsFound: "Programs Available",
        applyLink: "Apply Now",
        howToApply: "How to Apply",
        docsNeeded: "Documents Needed",
        verified: "Verified",
        affiliation: "Govt Affiliation",
        deadline: "Deadline",
        funding: "Funding / Benefits",
        provider: "Provider",
        stageLabel: "Stage",
        criteria: "Eligibility Criteria",
        backToTools: "Back to Tools",
        statsTotal: "Total Programs",
        statsDeadlines: "Active & Rolling",
        step1: "Register startup on DPIIT / Startup India portal (if needed)",
        step2: "Prepare a Pitch Deck and detailed project report (DPR)",
        step3: "Gather founder KYC documents (Aadhaar, PAN, etc.)",
        step4: "Visit official portal and fill out the application form",
        all: "All",
    },
    hi: {
        title: "सरकारी अनुदान और योजना निर्देशिका",
        subtitle: "सक्रिय सरकारी योजनाओं, इनक्यूबेशन कार्यक्रमों और स्टार्टअप अनुदानों की खोज करें।",
        searchPlaceholder: "अनुदान नाम, प्रदाता, क्षेत्र द्वारा खोजें...",
        region: "क्षेत्र / राज्य",
        stage: "स्टार्टअप चरण",
        sector: "मुख्य क्षेत्र",
        clearFilters: "फ़िल्टर हटाएं",
        resultsFound: "उपलब्ध कार्यक्रम",
        applyLink: "अभी आवेदन करें",
        howToApply: "आवेदन कैसे करें",
        docsNeeded: "आवश्यक दस्तावेज़",
        verified: "सत्यापित",
        affiliation: "सरकारी संबद्धता",
        deadline: "अंतिम तिथि",
        funding: "वित्तीय सहायता / लाभ",
        provider: "प्रदाता",
        stageLabel: "चरण",
        criteria: "पात्रता मानदंड",
        backToTools: "टूल्स पर वापस जाएं",
        statsTotal: "कुल कार्यक्रम",
        statsDeadlines: "सक्रिय और चालू",
        step1: "DPIIT / स्टार्टअप इंडिया पोर्टल पर स्टार्टअप पंजीकृत करें (यदि आवश्यक हो)",
        step2: "पिच डेक और विस्तृत परियोजना रिपोर्ट (DPR) तैयार करें",
        step3: "संस्थापक के KYC दस्तावेज़ एकत्र करें (आधार, पैन, आदि)",
        step4: "आधिकारिक पोर्टल पर जाएं और आवेदन पत्र भरें",
        all: "सभी",
    },
    kn: {
        title: "ಅನುದಾನಗಳು ಮತ್ತು ಯೋಜನೆಗಳ ಡೈರೆಕ್ಟರಿ",
        subtitle: "ಸಕ್ರಿಯ ಸರ್ಕಾರಿ ಬೆಂಬಲಿತ ಯೋಜನೆಗಳು, ಇನ್‌ಕ್ಯುಬೇಶನ್ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಅನುದಾನಗಳನ್ನು ಹುಡುಕಿ.",
        searchPlaceholder: "ಅನುದಾನದ ಹೆಸರು, ಪೂರೈकेದಾರರು, ವಲಯದ ಮೂಲಕ ಹುಡುಕಿ...",
        region: "ಪ್ರದೇಶ / ರಾಜ್ಯ",
        stage: "ಸ್ಟಾರ್ಟ್‌ಅಪ್ ಹಂತ",
        sector: "ಮುಖ್ಯ ವಲಯ",
        clearFilters: "ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ",
        resultsFound: "ಲಭ್ಯವಿರುವ ಯೋಜನೆಗಳು",
        applyLink: "ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
        howToApply: "ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ",
        docsNeeded: "ಅಗತ್ಯ ದಾಖಲೆಗಳು",
        verified: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
        affiliation: "ಸರ್ಕಾರಿ ಸಂಯೋಜನೆ",
        deadline: "ಕೊನೆಯ ದಿನಾಂಕ",
        funding: "ಹಣಕಾಸು ನೆರವು / ಪ್ರಯೋಜನಗಳು",
        provider: "ಪೂರೈಕೆದಾರರು",
        stageLabel: "ಹಂತ",
        criteria: "ಅರ್ಹತಾ ಮಾನದಂಡಗಳು",
        backToTools: "ಪರಿಕರಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
        statsTotal: "ಒಟ್ಟು ಕಾರ್ಯಕ್ರಮಗಳು",
        statsDeadlines: "ಸಕ್ರಿಯ ಮತ್ತು ಚಾಲ್ತಿ",
        checklistTitle: "ಅರ್ಜಿ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ",
        step1: "DPIIT / ಸ್ಟಾರ್ಟ್‌ಅಪ್ ಇಂಡಿಯಾ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಸ್ಟಾರ್ಟ್‌ಅಪ್ ನೋಂದಾಯಿಸಿ (ಅಗತ್ಯವಿದ್ದರೆ)",
        step2: "ಪಿಚ್ ಡೆಕ್ ಮತ್ತು ವಿವರವಾದ ಯೋಜನಾ ವರದಿ (DPR) ಸಿದ್ಧಪಡಿಸಿ",
        step3: "ಸ್ಥಾಪಕರ KYC ದಾಖಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ (ಆಧಾರ್, ಪ್ಯಾನ್, ಇತ್ಯಾದಿ)",
        step4: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ ಮತ್ತು ಅರ್ಜಿ ನಮೂನೆಯನ್ನು ಭರ್ತಿ ಮಾಡಿ",
        all: "ಎಲ್ಲಾ",
    },
    ta: {
        title: "மானியங்கள் & திட்டங்கள் அடைவு",
        subtitle: "செயலில் உள்ள அரசு திட்டங்கள், அடைகாப்பு திட்டங்கள் மற்றும் தொடக்க மானியங்களைத் தேடிக் கண்டறியவும்.",
        searchPlaceholder: "மானியத்தின் பெயர், வழங்குநர், துறை மூலம் தேடவும்...",
        region: "பிராந்தியம் / மாநிலம்",
        stage: "தொடக்க நிலை",
        sector: "முக்கிய துறை",
        clearFilters: "வடிகட்டிகளை நீக்கு",
        resultsFound: "கிடைக்கக்கூடிய திட்டங்கள்",
        applyLink: "இப்போதே விண்ணப்பிக்கவும்",
        howToApply: "விண்ணப்பிப்பது எப்படி",
        docsNeeded: "தேவையான ஆவணங்கள்",
        verified: "சரிபார்க்கப்பட்டது",
        affiliation: "அரசு இணைப்பு",
        deadline: "இறுதி தேதி",
        funding: "நிதி உதவி / நன்மைகள்",
        provider: "வழங்குநர்",
        stageLabel: "நிலை",
        criteria: "தகுதி வரம்பு",
        backToTools: "கருவிகளுக்குத் திரும்பு",
        statsTotal: "மொத்த திட்டங்கள்",
        statsDeadlines: "செயலில் மற்றும் தொடரும்",
        step1: "DPIIT / ஸ்டார்ட்அப் இந்தியா போர்ட்டலில் உங்கள் நிறுவனத்தை பதிவு செய்யவும்",
        step2: "பிட்ச் டெக் மற்றும் விரிவான திட்ட அறிக்கையை (DPR) தயார் செய்யவும்",
        step3: "நிறுவனர்களின் KYC ஆவணங்களை சேகரிக்கவும் (ஆதார், பான் போன்றவை)",
        step4: "அதிகாரப்பூர்வ போர்ட்டலுக்குச் சென்று விண்ணப்பப் படிவத்தை நிரப்பவும்",
        all: "அனைத்தும்",
    },
    te: {
        title: "గ్రాంట్లు & పథకాల డైరెక్టరీ",
        subtitle: "క్రియాశీల ప్రభుత్వ పథకాలు, ఇంక్యుబేషన్ ప్రోగ్రామ్‌లు మరియు స్టార్టప్ గ్రాంట్లను శోధించండి.",
        searchPlaceholder: "గ్రాంట్ పేరు, ప్రదాత, రంగం ద్వారా శోధించండి...",
        region: "ప్రాంతం / రాష్ట్రం",
        stage: "స్టార్టప్ దశ",
        sector: "ప్రధాన రంగం",
        clearFilters: "ఫిల్టర్లను తొలగించు",
        resultsFound: "అందుబాటులో ఉన్న పథకాలు",
        applyLink: "ఇప్పుడే దరఖాస్తు చేసుకోండి",
        howToApply: "దరఖాస్తు విధానం",
        docsNeeded: "అవసరమైన పత్రాలు",
        verified: "ధృవీకరించబడింది",
        affiliation: "ప్రభుత్వ అనుబంధం",
        deadline: "చివరి తేదీ",
        funding: "ఆర్థిక సహాయం / ప్రయోజనాలు",
        provider: "ప్రదాత",
        stageLabel: "దశ",
        criteria: "అర్హత ప్రమాణాలు",
        backToTools: "టూల్స్ కి తిరిగి వెళ్ళండి",
        statsTotal: "మొత్తం కార్యక్రమాలు",
        statsDeadlines: "క్రియాశీల & రోలింగ్",
        step1: "DPIIT / స్టార్టప్ ఇండియా పోర్టల్‌లో స్టార్టప్‌ను నమోదు చేయండి (అవసరమైతే)",
        step2: "పిచ్ డెక్ మరియు వివరణాत्मक ప్రాజెక్ట్ నివేదిక (DPR) సిద్ధం చేయండి",
        step3: "వ్యవస్థాపకుల KYC పత్రాలను సేకరించండి (ఆధార్, పాన్ మొదలైనవి)",
        step4: "అధికారిక పోర్టల్‌ను సందర్శించి, దరఖాస్తు ఫారమ్‌ను పూరించండి",
        all: "అన్నీ",
    },
    mr: {
        title: "अनुदान आणि सरकारी योजनांची निर्देशिका",
        subtitle: "सक्रिय सरकारी योजना, इनक्यूबेशन कार्यक्रम आणि स्टार्टअप अनुदाने शोधा.",
        searchPlaceholder: "अनुदान नाव, प्रदाता, क्षेत्र याद्वारे शोध...",
        region: "प्रदेश / राज्य",
        stage: "स्टार्टअप टप्पा",
        sector: "मुख्य क्षेत्र",
        clearFilters: "फिल्टर्स काढा",
        resultsFound: "उपलब्ध योजना आणि अनुदान",
        applyLink: "आता अर्ज करा",
        howToApply: "अर्ज कसा करावा",
        docsNeeded: "आवश्यक कागदपत्रे",
        verified: "सत्यापित",
        affiliation: "सरकारी संलग्नता",
        deadline: "अंतिम तारीख",
        funding: "वित्तीय सहाय्य / लाभ",
        provider: "प्रदाता",
        stageLabel: "टप्पा",
        criteria: "पात्रता निकष",
        backToTools: "साधनांवर परत जा",
        statsTotal: "एकूण कार्यक्रम",
        statsDeadlines: "सक्रिय आणि चालू",
        step1: "DPIIT / स्टार्टअप इंडिया पोर्टलवर स्टार्टअप नोंदणी करा (आवश्यक असल्यास)",
        step2: "पिच डेक आणि तपशीलवार प्रकल्प अहवाल (DPR) तयार करा",
        step3: "संस्थापकांचे KYC दस्तऐवज गोळा करा (आधार, पॅन इ.)",
        step4: "अधिकृत पोर्टलला भेट द्या आणि अर्ज भरा",
        all: "सर्व",
    }
};

export default function GrantsDirectoryPage() {
  const [lang, setLang] = useState<LanguageKey>('en');
  const t = translations[lang];

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modal State
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);

  // Dropdown Options
  const regions = ['All', 'Pan India', 'Delhi NCR', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'Kerala', 'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'West Bengal', 'Goa', 'Punjab', 'Haryana', 'Odisha', 'Assam'];
  const stages = ['All', 'Idea', 'MVP', 'MVP, Revenue, Scaling', 'Revenue, Scaling'];
  const sectors = ['All', 'DeepTech, AI/ML, SaaS', 'BioTech, HealthTech, MedTech', 'AgriTech, FoodTech', 'Defence, Aerospace, SpaceTech', 'JewelryTech, Innovation', 'All Sectors'];
  const types = ['All', 'Grant', 'Debt/Equity-free Loan', 'Seed Equity', 'Incubation Support'];

  // Combined Search & Filters logic
  const filteredData = useMemo(() => {
    return grantsData.filter(item => {
      // 1. Text Search
      const searchTokens = search.toLowerCase().split(/\s+/).filter(Boolean);
      const grantText = `${item.name} ${item.provider} ${item.focusSector} ${item.criteria} ${item.location} ${item.fundingSupport}`.toLowerCase();
      const matchesSearch = searchTokens.every(token => grantText.includes(token));

      // 2. Region Filter
      const matchesRegion = regionFilter === 'All' || item.location.toLowerCase().includes(regionFilter.toLowerCase()) || item.location.toLowerCase() === 'pan india';

      // 3. Stage Filter
      const matchesStage = stageFilter === 'All' || item.idealStage.toLowerCase().includes(stageFilter.toLowerCase());

      // 4. Sector Filter
      const matchesSector = sectorFilter === 'All' || item.focusSector.toLowerCase().includes(sectorFilter.toLowerCase());

      // 5. Type Filter
      const matchesType = typeFilter === 'All' || item.type.toLowerCase().includes(typeFilter.toLowerCase());

      return matchesSearch && matchesRegion && matchesStage && matchesSector && matchesType;
    });
  }, [search, regionFilter, stageFilter, sectorFilter, typeFilter]);

  const resetFilters = () => {
    setSearch('');
    setRegionFilter('All');
    setStageFilter('All');
    setSectorFilter('All');
    setTypeFilter('All');
  };

  const getDocumentChecklist = (grant: Grant) => {
    const list = [
      t.step1,
      t.step2,
      t.step3,
      t.step4
    ];
    const crit = grant.criteria.toLowerCase();
    if (crit.includes('dpiit')) {
      list.unshift("DPIIT Recognition Certificate (Mandatory)");
    }
    if (crit.includes('student') || crit.includes('youth') || crit.includes('young')) {
      list.push("College ID proof / Bonafide Certificate");
    }
    if (crit.includes('women') || crit.includes('woman')) {
      list.push("DPIIT Certificate proving >51% female ownership");
    }
    if (crit.includes('trl') || crit.includes('prototype')) {
      list.push("Proof of Concept (PoC) / Prototype screenshots or video link");
    }
    return list;
  };

  const activeRollingCount = useMemo(() => {
    return grantsData.filter(g => g.deadline.toLowerCase().includes('roll') || g.deadline.toLowerCase().includes('ong') || g.deadline.toLowerCase().includes('open')).length;
  }, []);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-bg-main relative">
      {/* Subtle Glow Overlay */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-accent-blue/5 via-accent-violet/3 to-transparent pointer-events-none z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Navigation & Language Dropdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <Link href="/tools" className="inline-flex items-center text-text-secondary hover:text-white transition-colors text-sm group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            {t.backToTools}
          </Link>

          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full p-1 self-end sm:self-auto">
            {(['en', 'hi', 'kn', 'ta', 'te', 'mr'] as LanguageKey[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all uppercase ${
                  lang === l 
                    ? 'bg-gradient-to-r from-accent-blue to-accent-violet text-white shadow-md' 
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {l === 'en' ? 'EN' : l === 'hi' ? 'हिंदी' : l === 'kn' ? 'ಕನ್ನಡ' : l === 'ta' ? 'தமிழ்' : l === 'te' ? 'తెలుగు' : 'मराठी'}
              </button>
            ))}
          </div>
        </div>

        {/* Minimal Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-[-0.04em] mb-3">
              {t.title}
            </h1>
            <p className="text-text-secondary font-light max-w-2xl text-base leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Minimal Stats Cards */}
          <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
            <div className="glass-card px-5 py-3 rounded-2xl border border-white/5 bg-bg-surface/10 flex items-center gap-3">
              <Layers size={18} className="text-accent-blue" />
              <div>
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{t.statsTotal}</p>
                <strong className="text-sm text-white font-bold">{grantsData.length} Live</strong>
              </div>
            </div>
            <div className="glass-card px-5 py-3 rounded-2xl border border-white/5 bg-bg-surface/10 flex items-center gap-3">
              <RefreshCw size={18} className="text-accent-violet" />
              <div>
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{t.statsDeadlines}</p>
                <strong className="text-sm text-white font-bold">{activeRollingCount} Programs</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Streamlined Minimalist Filter Bar */}
        <div className="glass-card p-4 md:p-6 rounded-[2rem] border border-white/10 bg-bg-surface/20 mb-10 space-y-4">
          
          {/* Main Keyword Search */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-blue transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-text-tertiary focus:outline-none focus:border-accent-blue/50 transition-all"
            />
          </div>

          {/* Inline Select Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-2">
            
            <div className="relative group">
              <label className="absolute left-3.5 -top-2 px-1 bg-[#0F172A] text-[9px] font-bold text-text-secondary uppercase tracking-wider">{t.region}</label>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3.5 text-xs text-white focus:outline-none focus:border-accent-blue/50 transition-all cursor-pointer appearance-none"
              >
                {regions.map(r => <option key={r} value={r} className="bg-bg-surface">{r === 'All' ? t.all : r}</option>)}
              </select>
            </div>

            <div className="relative group">
              <label className="absolute left-3.5 -top-2 px-1 bg-[#0F172A] text-[9px] font-bold text-text-secondary uppercase tracking-wider">{t.stage}</label>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3.5 text-xs text-white focus:outline-none focus:border-accent-blue/50 transition-all cursor-pointer appearance-none"
              >
                {stages.map(s => <option key={s} value={s} className="bg-bg-surface">{s === 'All' ? t.all : s}</option>)}
              </select>
            </div>

            <div className="relative group">
              <label className="absolute left-3.5 -top-2 px-1 bg-[#0F172A] text-[9px] font-bold text-text-secondary uppercase tracking-wider">{t.sector}</label>
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3.5 text-xs text-white focus:outline-none focus:border-accent-blue/50 transition-all cursor-pointer appearance-none"
              >
                {sectors.map(s => <option key={s} value={s} className="bg-bg-surface">{s === 'All' ? t.all : s}</option>)}
              </select>
            </div>

            <div className="relative group">
              <label className="absolute left-3.5 -top-2 px-1 bg-[#0F172A] text-[9px] font-bold text-text-secondary uppercase tracking-wider">Funding Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3.5 text-xs text-white focus:outline-none focus:border-accent-blue/50 transition-all cursor-pointer appearance-none"
              >
                {types.map(ty => <option key={ty} value={ty} className="bg-bg-surface">{ty === 'All' ? t.all : ty}</option>)}
              </select>
            </div>

          </div>

          {/* Inline Reset & Total Count Row */}
          <div className="flex justify-between items-center pt-2 text-xs">
            <button
              onClick={resetFilters}
              className="text-text-secondary hover:text-white transition-colors flex items-center gap-1"
            >
              <RefreshCw size={12} /> {t.clearFilters}
            </button>
            <p className="text-text-secondary font-bold text-[10px] uppercase tracking-wider">
              {t.resultsFound}: <span className="text-white ml-1 font-bold">{filteredData.length}</span>
            </p>
          </div>

        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item, index) => (
            <div 
              key={item.id || index}
              className="glass-card hover-glow p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col relative group transition-all duration-300 bg-bg-surface/10"
            >
              
              {/* Type Ribbon Badge */}
              <div className="flex justify-between items-start mb-5">
                <span className="bg-white/10 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {item.type}
                </span>
                {item.deadline.toLowerCase().includes('roll') || item.deadline.toLowerCase().includes('ong') || item.deadline.toLowerCase().includes('open') ? (
                  <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={10} /> Open
                  </span>
                ) : null}
              </div>

              {/* Title & Provider */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-accent-blue transition-colors line-clamp-2 leading-tight">
                  {item.name}
                </h3>
                <p className="text-xs text-text-secondary font-light flex items-center gap-1">
                  <Building2 size={12} className="text-accent-blue/70 shrink-0" />
                  <span className="line-clamp-1">{item.provider}</span>
                </p>
              </div>

              {/* Parameter details grid */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-white/5 border border-white/5 rounded-2xl text-xs">
                <div>
                  <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold block mb-1">
                    {t.funding}
                  </span>
                  <span className="text-white font-medium line-clamp-2 leading-tight">{item.fundingSupport}</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold block mb-1">
                    {t.deadline}
                  </span>
                  <span className="text-white font-medium line-clamp-2 leading-tight">{item.deadline}</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold block mb-1">
                    {t.stageLabel}
                  </span>
                  <span className="text-white font-medium line-clamp-1">{item.idealStage}</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold block mb-1">
                    Location
                  </span>
                  <span className="text-white font-medium line-clamp-1 flex items-center gap-1">
                    <MapPin size={10} className="text-accent-violet shrink-0" /> {item.location}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                <button
                  onClick={() => setSelectedGrant(item)}
                  className="flex-1 border border-white/10 hover:border-white/20 text-white py-2.5 rounded-xl font-bold text-xs transition duration-300 flex justify-center items-center gap-1.5"
                >
                  <BookOpen size={12} /> {t.howToApply}
                </button>
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-gray-200 text-black px-4 py-2.5 rounded-xl font-bold text-xs transition duration-300 flex items-center justify-center gap-1 shrink-0"
                >
                  Apply <ExternalLink size={12} />
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Empty state container */}
        {filteredData.length === 0 && (
          <div className="glass-card p-16 rounded-3xl border border-dashed border-white/10 text-center flex flex-col items-center justify-center min-h-[350px]">
            <AlertCircle size={40} className="text-text-secondary mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Matches Found</h3>
            <p className="text-text-secondary mb-8 max-w-md">No grants match this setup. Try adjusting your filter tags or resetting the matcher.</p>
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors" onClick={resetFilters}>
              {t.clearFilters}
            </button>
          </div>
        )}

      </div>

      {/* Slide-in Detail Drawer Modal */}
      {selectedGrant && (
        <div className="fixed inset-0 bg-black/80 backdrop-filter backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-2xl w-full rounded-[2rem] border border-white/10 bg-bg-surface overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6">
              <button 
                onClick={() => setSelectedGrant(null)} 
                className="text-text-secondary hover:text-white transition-colors text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-8 md:p-10 max-h-[85vh] overflow-y-auto">
              
              <div className="mb-6">
                <span className="bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
                  {selectedGrant.type}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                  {selectedGrant.name}
                </h2>
                <p className="text-sm text-text-secondary flex items-center gap-1.5">
                  <Building2 size={14} className="text-accent-blue" />
                  <span>{selectedGrant.provider}</span>
                </p>
              </div>

              {/* Metadata strip info */}
              <div className="flex flex-wrap gap-4 mb-8 bg-white/5 border border-white/5 rounded-2xl p-4 text-xs">
                {selectedGrant.governmentAffiliation && (
                  <div>
                    <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-bold mb-0.5">{t.affiliation}</span>
                    <span className="text-white font-semibold">{selectedGrant.governmentAffiliation}</span>
                  </div>
                )}
                {selectedGrant.sourceVerified && (
                  <div>
                    <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-bold mb-0.5">{t.verified}</span>
                    <span className="text-green-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> {selectedGrant.sourceVerified}
                    </span>
                  </div>
                )}
              </div>

              {/* Interactive guidelines */}
              <div className="space-y-6">
                
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Filter size={14} className="text-accent-violet" />
                    {t.criteria}
                  </h4>
                  <p className="text-sm text-text-secondary font-light bg-white/5 rounded-xl p-4 border border-white/5 leading-relaxed">
                    {selectedGrant.criteria}
                  </p>
                </div>

                {/* Documents checklist */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                    <CheckSquare size={14} className="text-accent-blue" />
                    {t.docsNeeded}
                  </h4>
                  <ul className="space-y-2.5">
                    {getDocumentChecklist(selectedGrant).map((doc, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-accent-blue shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Applying guide instructions */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                    <HelpCircle size={14} className="text-accent-violet" />
                    {t.howToApply}
                  </h4>
                  <div className="text-sm text-text-secondary font-light space-y-2">
                    <p>1. Verify eligibility parameters matching your startup details.</p>
                    <p>2. Prepare necessary documentation including checklist items listed above.</p>
                    <p>3. Submit the digital form at the official application portal using the link below.</p>
                  </div>
                </div>

              </div>

              {/* Close and apply buttons */}
              <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
                <button
                  onClick={() => setSelectedGrant(null)}
                  className="flex-1 border border-white/10 hover:border-white/20 text-white py-3 rounded-xl font-bold text-sm transition"
                >
                  Close
                </button>
                <a
                  href={selectedGrant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-accent-blue to-accent-violet text-white py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md shadow-accent-blue/20"
                >
                  {t.applyLink} <ExternalLink size={14} />
                </a>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
