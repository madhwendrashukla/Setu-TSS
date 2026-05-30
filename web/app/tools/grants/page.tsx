'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Search, Filter, RefreshCw, CheckCircle2, AlertCircle, 
  ExternalLink, Building2, HelpCircle, FileText, CheckSquare, 
  Award, Heart, ShieldAlert, Sparkles, BookOpen, Layers
} from 'lucide-react';
import { grantsData, Grant } from '@/lib/data/grants';

// Type definition for language dictionary keys
type LanguageKey = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'mr';

// Translations Dictionary
const translations: Record<LanguageKey, {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    region: string;
    stage: string;
    sector: string;
    founderProfile: string;
    clearFilters: string;
    resultsFound: string;
    liveNow: string;
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
    wizardTitle: string;
    wizardDesc: string;
    next: string;
    prev: string;
    getMatches: string;
    resetWizard: string;
    backToTools: string;
    statsTotal: string;
    statsFunding: string;
    statsDeadlines: string;
    checklistTitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    all: string;
    scoreLabel: string;
}> = {
    en: {
        title: "Grants & Schemes Discovery",
        subtitle: "Discover government-backed hubs, incubation grants, and pure schemes asking for 0% equity.",
        searchPlaceholder: "Search by grant name, provider, sector...",
        region: "Region / State",
        stage: "Startup Stage",
        sector: "Focus Sector",
        founderProfile: "Founder Profile",
        clearFilters: "Clear Filters",
        resultsFound: "Grants & Schemes Available",
        liveNow: "Live Now",
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
        wizardTitle: "Smart Match Engine",
        wizardDesc: "Answer 4 quick questions to see which grants you are eligible for.",
        next: "Next",
        prev: "Back",
        getMatches: "Find Match",
        resetWizard: "Reset Matcher",
        backToTools: "Back to Tools",
        statsTotal: "Total Programs",
        statsFunding: "Equity-Free Funding",
        statsDeadlines: "Active & Rolling",
        checklistTitle: "Application Checklist",
        step1: "Register startup on DPIIT / Startup India portal (if needed)",
        step2: "Prepare a Pitch Deck and detailed project report (DPR)",
        step3: "Gather founder KYC documents (Aadhaar, PAN, etc.)",
        step4: "Visit official portal and fill out the application form",
        all: "All",
        scoreLabel: "Match Score",
    },
    hi: {
        title: "सरकारी अनुदान और योजना खोज",
        subtitle: "सरकारी हब, इनक्यूबेशन अनुदान और 0% इक्विटी वाले शुद्ध सरकारी योजनाओं की खोज करें।",
        searchPlaceholder: "अनुदान नाम, प्रदाता, क्षेत्र द्वारा खोजें...",
        region: "क्षेत्र / राज्य",
        stage: "स्टार्टअप चरण",
        sector: "मुख्य क्षेत्र",
        founderProfile: "संस्थापक प्रोफ़ाइल",
        clearFilters: "फ़िल्टर हटाएं",
        resultsFound: "उपलब्ध योजनाएं और अनुदान",
        liveNow: "सक्रिय",
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
        wizardTitle: "स्मार्ट मैच इंजन",
        wizardDesc: "आप किन अनुदानों के लिए पात्र हैं, यह देखने के लिए 4 त्वरित प्रश्नों के उत्तर दें।",
        next: "आगे",
        prev: "पीछे",
        getMatches: "मैच खोजें",
        resetWizard: "इंजन रीसेट करें",
        backToTools: "टूल्स पर वापस जाएं",
        statsTotal: "कुल कार्यक्रम",
        statsFunding: "इक्विटी-मुक्त फंड",
        statsDeadlines: "सक्रिय और चालू",
        checklistTitle: "आवेदन चेकलिस्ट",
        step1: "DPIIT / स्टार्टअप इंडिया पोर्टल पर स्टार्टअप पंजीकृत करें (यदि आवश्यक हो)",
        step2: "पिच डेक और विस्तृत परियोजना रिपोर्ट (DPR) तैयार करें",
        step3: "संस्थापक के KYC दस्तावेज़ एकत्र करें (आधार, पैन, आदि)",
        step4: "आधिकारिक पोर्टल पर जाएं और आवेदन पत्र भरें",
        all: "सभी",
        scoreLabel: "मैच स्कोर",
    },
    kn: {
        title: "ಅನುದಾನಗಳು ಮತ್ತು ಯೋಜನೆಗಳ ಶೋಧನೆ",
        subtitle: "ಸರ್ಕಾರಿ ಬೆಂಬಲಿತ ಹಬ್‌ಗಳು, ಇನ್‌ಕ್ಯುಬೇಶನ್ ಅನುದಾನಗಳು ಮತ್ತು 0% ಇಕ್ವಿಟಿ ಕೇಳುವ ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
        searchPlaceholder: "ಅನುದಾನದ ಹೆಸರು, ಪೂರೈಕೆದಾರರು, वಲಯದ ಮೂಲಕ ಹುಡುಕಿ...",
        region: "ಪ್ರದೇಶ / ರಾಜ್ಯ",
        stage: "ಸ್ಟಾರ್ಟ್‌ಅಪ್ ಹಂತ",
        sector: "ಮುಖ್ಯ ವಲಯ",
        founderProfile: "ಸ್ಥಾಪಕರ ಪ್ರೊಫೈಲ್",
        clearFilters: "ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ",
        resultsFound: "ಲಭ್ಯವಿರುವ ಯೋಜನೆಗಳು",
        liveNow: "ಸಕ್ರಿಯ",
        applyLink: "ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
        howToApply: "ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ",
        docsNeeded: "ಅಗತ್ಯ ದಾಖಲೆಗಳು",
        verified: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
        affiliation: "ಸರ್ಕಾರಿ ಸಂಯೋಜನೆ",
        deadline: "ಕೊನೆಯ ದಿನಾಂಕ",
        funding: "ಹಣಕาสು ನೆರವು / ಪ್ರಯೋಜನಗಳು",
        provider: "ಪೂರೈಕೆದಾರರು",
        stageLabel: "ಹಂತ",
        criteria: "ಅರ್ಹತಾ ಮಾನದंडಗಳು",
        wizardTitle: "ಸ್ಮಾರ್ಟ್ ಮ್ಯಾಚ್ ಇಂಜಿನ್",
        wizardDesc: "ನೀವು ಯಾವ ಅನುದಾನಕ್ಕೆ ಅರ್ಹರು ಎಂದು ತಿಳಿಯಲು 4 ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.",
        next: "ಮುಂದೆ",
        prev: "ಹಿಂದೆ",
        getMatches: "ಮ್ಯಾಚ್ ಹುಡುಕಿ",
        resetWizard: "ರೀಸೆಟ್ ಮಾಡಿ",
        backToTools: "ಪರಿಕರಗಳಿಗೆ ಹಿಂತಿರುगी",
        statsTotal: "ಒಟ್ಟು ಕಾರ್ಯಕ್ರಮಗಳು",
        statsFunding: "ಇಕ್ವಿटी-ಮುಕ್ತ ನಿಧಿ",
        statsDeadlines: "ಸಕ್ರಿಯ ಮತ್ತು ಚಾಲ್ತಿ",
        checklistTitle: "ಅರ್ಜಿ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ",
        step1: "DPIIT / ಸ್ಟಾರ್ಟ್‌ಅಪ್ ಇಂಡಿಯಾ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಸ್ಟಾರ್ಟ್‌ಅಪ್ ನೋಂದಾಯಿಸಿ (ಅಗತ್ಯವಿದ್ದರೆ)",
        step2: "ಪಿಚ್ ಡೆಕ್ ಮತ್ತು ವಿವರವಾದ ಯೋಜನಾ ವರದಿ (DPR) ಸಿದ್ಧಪಡಿಸಿ",
        step3: "ಸ್ಥಾಪಕರ KYC ದಾಖಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ (ಆಧಾರ್, ಪ್ಯಾನ್, ಇತ್ಯಾದಿ)",
        step4: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ ಮತ್ತು ಅರ್ಜಿ ನಮೂನೆಯನ್ನು ಭರ್ತಿ ಮಾಡಿ",
        all: "ಎಲ್ಲಾ",
        scoreLabel: "ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್",
    },
    ta: {
        title: "மானியங்கள் & திட்டங்கள் கண்டறிதல்",
        subtitle: "அரசு ஆதரவு பெற்ற மையங்கள், அடைகாப்பு மானியங்கள் மற்றும் 0% ஈக்விட்டி திட்டங்களைக் கண்டறியவும்.",
        searchPlaceholder: "மானியத்தின் பெயர், வழங்குநர், துறை மூலம் தேடவும்...",
        region: "பிராந்தியம் / மாநிலம்",
        stage: "தொடக்க நிலை",
        sector: "முக்கிய துறை",
        founderProfile: "நிறுவனர் சுயவிவரம்",
        clearFilters: "வடிகட்டிகளை நீக்கு",
        resultsFound: "கிடைக்கக்கூடிய திட்டங்கள்",
        liveNow: "செயலில் உள்ளது",
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
        wizardTitle: "ஸ்மார்ட் மேட்ச் இன்ஜின்",
        wizardDesc: "எந்த மானியங்களுக்கு நீங்கள் தகுதி பெறுகிறீர்கள் என்பதைப் பார்க்க 4 விரைவான கேள்விகளுக்குப் பதிலளிக்கவும்.",
        next: "அடுத்து",
        prev: "முந்தைய",
        getMatches: "பொருத்தத்தைக் கண்டறி",
        resetWizard: "மீட்டமைக்கவும்",
        backToTools: "கருவிகளுக்குத் திரும்பு",
        statsTotal: "மொத்த திட்டங்கள்",
        statsFunding: "பங்கு இல்லாத நிதி",
        statsDeadlines: "செயலில் மற்றும் தொடரும்",
        checklistTitle: "விண்ணப்ப சரிபார்ப்பு பட்டியல்",
        step1: "DPIIT / ஸ்டார்ட்அப் இந்தியா போர்ட்டலில் உங்கள் நிறுவனத்தை பதிவு செய்யவும்",
        step2: "பிட்ச் டெக் மற்றும் விரிவான திட்ட அறிக்கையை (DPR) தயார் செய்யவும்",
        step3: "நிறுவனர்களின் KYC ஆவணங்களை சேகரிக்கவும் (ஆதார், பான் போன்றவை)",
        step4: "அதிகாரப்பூர்வ போர்ட்டலுக்குச் சென்று விண்ணப்பப் படிவத்தை நிரப்பவும்",
        all: "அனைத்தும்",
        scoreLabel: "பொருத்த மதிப்பெண்",
    },
    te: {
        title: "గ్రాంట్లు & పథకాల ఆవిష్కరణ",
        subtitle: "ప్రభుత్వ సహాయం పొందిన హబ్‌లు, ఇంక్యుబేషన్ గ్రాంట్లు మరియు 0% ఈక్విటీ పథకాలను కనుగొనండి.",
        searchPlaceholder: "గ్రాంట్ పేరు, ప్రదాత, రంగం ద్వారా శోధించండి...",
        region: "ప్రాంతం / రాష్ట్రం",
        stage: "స్టార్టప్ దశ",
        sector: "ప్రధాన రంగం",
        founderProfile: "వ్యవస్థాపక ప్రొఫైల్",
        clearFilters: "ఫిల్టర్లను తొలగించు",
        resultsFound: "అందుబాటులో ఉన్న పథకాలు",
        liveNow: "లైవ్ లో ఉంది",
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
        wizardTitle: "స్మార్ట్ మ్యాచ్ ఇంజిన్",
        wizardDesc: "మీరు ఏ గ్రాంట్లకు అర్హులో తెలుసుకోవడానికి 4 శీఘ్ర ప్రశ్నలకు సమాధానం ఇవ్వండి.",
        next: "తరువాత",
        prev: "వెనుకకు",
        getMatches: "మ్యాచ్ కనుగొను",
        resetWizard: "రీసెట్ చేయండి",
        backToTools: "టూల్స్ కి తిరిగి వెళ్ళండి",
        statsTotal: "మొత్తం కార్యక్రమాలు",
        statsFunding: "ఈక్విటీ-రహిత నిధులు",
        statsDeadlines: "క్రియాశీల & రోలింగ్",
        checklistTitle: "దరఖాస్తు చెక్ లిస్ట్",
        step1: "DPIIT / స్టార్టప్ ఇండియా పోర్టల్‌లో స్టార్టప్‌ను నమోదు చేయండి (అవసరమైతే)",
        step2: "పిచ్ డెక్ మరియు వివరణాత్మక ప్రాజెక్ట్ నివేదిక (DPR) సిద్ధం చేయండి",
        step3: "వ్యవస్థాపకుల KYC పత్రాలను సేకరించండి (ఆధార్, పాన్ మొదలైనవి)",
        step4: "అధికారిక పోర్టల్‌ను సందర్శించి, దరఖాస్తు ఫారమ్‌ను పూరించండి",
        all: "అన్నీ",
        scoreLabel: "మ్యాచ్ స్కోరు",
    },
    mr: {
        title: "अनुदान आणि सरकारी योजनांचा शोध",
        subtitle: "सरकारी पाठबळ असलेले हब्स, इनक्यूबेशन अनुदान आणि 0% इक्विटी असलेल्या सरकारी योजना शोधा.",
        searchPlaceholder: "अनुदान नाव, प्रदाता, क्षेत्र याद्वारे शोध...",
        region: "प्रदेश / राज्य",
        stage: "स्टार्टअप टप्पा",
        sector: "मुख्य क्षेत्र",
        founderProfile: "संस्थापक प्रोफाइल",
        clearFilters: "फिल्टर्स काढा",
        resultsFound: "उपलब्ध योजना आणि अनुदान",
        liveNow: "सक्रिय",
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
        wizardTitle: "स्मार्ट मॅच इंजिन",
        wizardDesc: "आपण कोणत्या अनुदानांसाठी पात्र आहात हे पाहण्यासाठी 4 द्रुत प्रश्नांची उत्तरे द्या.",
        next: "पुढे",
        prev: "मागे",
        getMatches: "मॅच शोधा",
        resetWizard: "रीसेट करा",
        backToTools: "साधनांवर परत जा",
        statsTotal: "एकूण कार्यक्रम",
        statsFunding: "इक्विटी-मुक्त निधी",
        statsDeadlines: "सक्रिय आणि चालू",
        checklistTitle: "अर्ज चेकलिस्ट",
        step1: "DPIIT / स्टार्टअप इंडिया पोर्टलवर स्टार्टअप नोंदणी करा (आवश्यक असल्यास)",
        step2: "पिच डेक आणि तपशीलवार प्रकल्प अहवाल (DPR) तयार करा",
        step3: "संस्थापकांचे KYC दस्तऐवज गोळा करा (आधार, पॅन इ.)",
        step4: "अधिकृत पोर्टलला भेट द्या आणि अर्ज भरा",
        all: "सर्व",
        scoreLabel: "मॅच स्कोअर",
    }
};

export default function GrantsDiscoveryPage() {
  const [lang, setLang] = useState<LanguageKey>('en');
  const t = translations[lang];

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [profileFilter, setProfileFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Wizard state
  const [wizardActive, setWizardActive] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardAnswers, setWizardAnswers] = useState({
    stage: '',
    region: '',
    profile: '',
    sector: ''
  });

  // Modal / Detail drawer state
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);

  // Static options based on data mapping
  const regions = ['All', 'Pan India', 'Delhi NCR', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'Kerala', 'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'West Bengal', 'Goa', 'Punjab', 'Haryana', 'Odisha', 'Assam'];
  const stages = ['All', 'Idea', 'MVP', 'MVP, Revenue, Scaling', 'Revenue, Scaling'];
  const sectors = ['All', 'DeepTech, AI/ML, SaaS', 'BioTech, HealthTech, MedTech', 'AgriTech, FoodTech', 'Defence, Aerospace, SpaceTech', 'JewelryTech, Innovation', 'All Sectors'];
  const profiles = ['All', 'Student / Youth', 'Woman Entrepreneur', 'SC/ST', 'General'];
  const types = ['All', 'Grant', 'Debt/Equity-free Loan', 'Seed Equity', 'Incubation Support'];

  const handleLangChange = (newLang: LanguageKey) => {
    setLang(newLang);
  };

  // Run Wizard Filtering & Scoring
  const scoredData = useMemo(() => {
    return grantsData.map(grant => {
      let score = 100;
      let reasons: string[] = [];

      if (wizardActive) {
        score = 0;
        const totalChecks = 4;
        let passed = 0;

        // Stage Check
        if (wizardAnswers.stage) {
          const grantStage = grant.idealStage.toLowerCase();
          const selectedStage = wizardAnswers.stage.toLowerCase();
          if (grantStage.includes(selectedStage) || selectedStage.includes(grantStage) || grantStage.includes("all")) {
            passed++;
          }
        } else {
          passed++;
        }

        // Region Check
        if (wizardAnswers.region && wizardAnswers.region !== 'All') {
          const grantLoc = grant.location.toLowerCase();
          const selectedLoc = wizardAnswers.region.toLowerCase();
          if (grantLoc.includes(selectedLoc) || selectedLoc.includes(grantLoc) || grantLoc.includes("pan india")) {
            passed++;
          }
        } else {
          passed++;
        }

        // Profile Check
        if (wizardAnswers.profile && wizardAnswers.profile !== 'All') {
          const grantCrit = grant.criteria.toLowerCase();
          const selectedProf = wizardAnswers.profile.toLowerCase();
          if (selectedProf === 'student / youth') {
            if (grantCrit.includes('student') || grantCrit.includes('youth') || grantCrit.includes('young') || grantCrit.includes('grad') || grantCrit.includes('age')) {
              passed++;
            }
          } else if (selectedProf === 'woman entrepreneur') {
            if (grantCrit.includes('women') || grantCrit.includes('woman') || grantCrit.includes('female')) {
              passed++;
            }
          } else if (selectedProf === 'sc/st') {
            if (grantCrit.includes('sc') || grantCrit.includes('st') || grantCrit.includes('tribal') || grantCrit.includes('caste')) {
              passed++;
            }
          } else {
            passed++; // General
          }
        } else {
          passed++;
        }

        // Sector Check
        if (wizardAnswers.sector && wizardAnswers.sector !== 'All') {
          const grantSect = grant.focusSector.toLowerCase();
          const selectedSect = wizardAnswers.sector.toLowerCase();
          
          if (selectedSect.includes("tech") && (grantSect.includes("tech") || grantSect.includes("software") || grantSect.includes("ai") || grantSect.includes("saas"))) {
            passed++;
          } else if (selectedSect.includes("agri") && (grantSect.includes("agri") || grantSect.includes("food"))) {
            passed++;
          } else if (selectedSect.includes("biotech") && (grantSect.includes("biotech") || grantSect.includes("health") || grantSect.includes("med"))) {
            passed++;
          } else if (selectedSect.includes("defence") && (grantSect.includes("def") || grantSect.includes("space") || grantSect.includes("aero"))) {
            passed++;
          } else if (grantSect.includes("all") || grantSect.includes("agnostic")) {
            passed++;
          }
        } else {
          passed++;
        }

        score = Math.round((passed / totalChecks) * 100);
      }

      return { ...grant, matchScore: score };
    });
  }, [wizardActive, wizardAnswers]);

  // Main Filter Logic
  const filteredData = useMemo(() => {
    return scoredData.filter(item => {
      // Text Search
      const matchesSearch = 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.provider.toLowerCase().includes(search.toLowerCase()) ||
        item.focusSector.toLowerCase().includes(search.toLowerCase()) ||
        item.criteria.toLowerCase().includes(search.toLowerCase());

      // Region Filter
      const matchesRegion = regionFilter === 'All' || item.location.toLowerCase().includes(regionFilter.toLowerCase()) || item.location.toLowerCase() === 'pan india';

      // Stage Filter
      const matchesStage = stageFilter === 'All' || item.idealStage.toLowerCase().includes(stageFilter.toLowerCase());

      // Sector Filter
      const matchesSector = sectorFilter === 'All' || item.focusSector.toLowerCase().includes(sectorFilter.toLowerCase());

      // Type Filter
      const matchesType = typeFilter === 'All' || item.type.toLowerCase().includes(typeFilter.toLowerCase());

      // Profile Filter (Heuristic matching on criteria field)
      let matchesProfile = true;
      if (profileFilter !== 'All') {
        const criteriaLower = item.criteria.toLowerCase();
        if (profileFilter === 'Student / Youth') {
          matchesProfile = criteriaLower.includes('student') || criteriaLower.includes('youth') || criteriaLower.includes('young') || criteriaLower.includes('grad');
        } else if (profileFilter === 'Woman Entrepreneur') {
          matchesProfile = criteriaLower.includes('women') || criteriaLower.includes('woman') || criteriaLower.includes('female');
        } else if (profileFilter === 'SC/ST') {
          matchesProfile = criteriaLower.includes('sc') || criteriaLower.includes('st') || criteriaLower.includes('caste') || criteriaLower.includes('tribal');
        }
      }

      // If Wizard is active, we show entries with a score > 0
      const matchesWizard = !wizardActive || item.matchScore > 25;

      return matchesSearch && matchesRegion && matchesStage && matchesSector && matchesType && matchesProfile && matchesWizard;
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [scoredData, search, regionFilter, stageFilter, sectorFilter, typeFilter, profileFilter, wizardActive]);

  const resetFilters = () => {
    setSearch('');
    setRegionFilter('All');
    setStageFilter('All');
    setSectorFilter('All');
    setProfileFilter('All');
    setTypeFilter('All');
    setWizardActive(false);
    setWizardStep(0);
    setWizardAnswers({ stage: '', region: '', profile: '', sector: '' });
  };

  const handleWizardSubmit = () => {
    setWizardActive(true);
  };

  // Document checklist builder helper based on metadata
  const getDocumentChecklist = (grant: Grant) => {
    const list = [
      t.step1,
      t.step2,
      t.step3,
      t.step4
    ];
    if (grant.criteria.toLowerCase().includes('dpiit')) {
      list.unshift("DPIIT Recognition Certificate (Mandatory)");
    }
    if (grant.criteria.toLowerCase().includes('student') || grant.criteria.toLowerCase().includes('youth')) {
      list.push("College ID proof or Graduation Certificate");
    }
    if (grant.criteria.toLowerCase().includes('women') || grant.criteria.toLowerCase().includes('woman')) {
      list.push("Shareholding proof pattern showing >51% female ownership");
    }
    return list;
  };

  // Quick stats
  const activeRollingCount = useMemo(() => {
    return grantsData.filter(g => g.deadline.toLowerCase().includes('roll') || g.deadline.toLowerCase().includes('ong') || g.deadline.toLowerCase().includes('open')).length;
  }, []);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-bg-main relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent-blue/5 via-accent-violet/5 to-transparent pointer-events-none z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Navigation & Language Select */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <Link href="/tools" className="inline-flex items-center text-text-secondary hover:text-white transition-colors text-sm group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            {t.backToTools}
          </Link>

          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 self-end md:self-auto">
            {(['en', 'hi', 'kn', 'ta', 'te', 'mr'] as LanguageKey[]).map((l) => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
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

        {/* Title Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-accent-violet/20 text-accent-violet text-[10px] font-bold px-3 py-1 rounded-full border border-accent-violet/30 uppercase tracking-widest">
              AI & Rule Augmented Engine
            </span>
            <div className="h-px bg-white/10 w-24"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-[-0.04em] mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-text-secondary font-light max-w-3xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Stat Bar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-bg-surface/10 hover-glow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue border border-accent-blue/20">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">{t.statsTotal}</p>
              <strong className="text-2xl text-white font-black">{grantsData.length} Schemes</strong>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-bg-surface/10 hover-glow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20">
              <Award size={22} />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">{t.statsFunding}</p>
              <strong className="text-2xl text-white font-black">0% Equity Grants</strong>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-bg-surface/10 hover-glow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-violet/10 flex items-center justify-center text-accent-violet border border-accent-violet/20">
              <RefreshCw size={22} />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">{t.statsDeadlines}</p>
              <strong className="text-2xl text-white font-black">{activeRollingCount} Programs</strong>
            </div>
          </div>
        </div>

        {/* Wizard and Filters Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Smart Match wizard */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 bg-bg-surface/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Sparkles size={120} className="text-accent-blue animate-pulse" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-accent-violet animate-spin" />
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">{t.wizardTitle}</h3>
                </div>
                <p className="text-sm text-text-secondary font-light mb-6">{t.wizardDesc}</p>

                {/* Step 1: Stage */}
                {wizardStep === 0 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary">{t.stage}</label>
                    <div className="grid grid-cols-1 gap-2">
                      {stages.filter(s => s !== 'All').map(s => (
                        <button
                          key={s}
                          onClick={() => setWizardAnswers({...wizardAnswers, stage: s})}
                          className={`p-3 text-left rounded-xl text-xs font-medium border transition-all ${
                            wizardAnswers.stage === s 
                              ? 'bg-accent-blue/20 border-accent-blue text-white' 
                              : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Region */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary">{t.region}</label>
                    <select
                      value={wizardAnswers.region}
                      onChange={(e) => setWizardAnswers({...wizardAnswers, region: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-accent-blue/50 transition-all cursor-pointer"
                    >
                      <option value="" disabled className="bg-bg-surface">Select State</option>
                      {regions.map(r => <option key={r} value={r} className="bg-bg-surface">{r}</option>)}
                    </select>
                  </div>
                )}

                {/* Step 3: Profile */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary">{t.founderProfile}</label>
                    <div className="grid grid-cols-1 gap-2">
                      {profiles.filter(p => p !== 'All').map(p => (
                        <button
                          key={p}
                          onClick={() => setWizardAnswers({...wizardAnswers, profile: p})}
                          className={`p-3 text-left rounded-xl text-xs font-medium border transition-all ${
                            wizardAnswers.profile === p 
                              ? 'bg-accent-blue/20 border-accent-blue text-white' 
                              : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Sector */}
                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary">{t.sector}</label>
                    <select
                      value={wizardAnswers.sector}
                      onChange={(e) => setWizardAnswers({...wizardAnswers, sector: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-accent-blue/50 transition-all cursor-pointer"
                    >
                      <option value="" disabled className="bg-bg-surface">Select Focus Sector</option>
                      {sectors.map(s => <option key={s} value={s} className="bg-bg-surface">{s}</option>)}
                    </select>
                  </div>
                )}

                {/* Wizard Controls */}
                <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/10">
                  {wizardStep > 0 ? (
                    <button
                      onClick={() => setWizardStep(wizardStep - 1)}
                      className="text-xs font-bold text-text-secondary hover:text-white transition-colors"
                    >
                      {t.prev}
                    </button>
                  ) : (
                    <span />
                  )}

                  {wizardStep < 3 ? (
                    <button
                      onClick={() => setWizardStep(wizardStep + 1)}
                      className="bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                      {t.next}
                    </button>
                  ) : (
                    <button
                      onClick={handleWizardSubmit}
                      className="bg-gradient-to-r from-accent-blue to-accent-violet hover:opacity-90 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md"
                    >
                      {t.getMatches}
                    </button>
                  )}
                </div>

                {/* Reset button if wizard active */}
                {wizardActive && (
                  <button
                    onClick={resetFilters}
                    className="w-full mt-4 flex items-center justify-center gap-2 border border-white/10 text-text-secondary hover:text-white py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    <RefreshCw size={12} /> {t.resetWizard}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Unified Filter & Search Bar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 bg-bg-surface/20">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <Filter size={18} className="text-accent-blue" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Search Filters</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Search Text */}
                <div className="relative group md:col-span-2">
                  <label className="absolute left-4 -top-2.5 px-2 bg-[#0F172A] text-[10px] font-bold text-text-secondary uppercase tracking-widest group-focus-within:text-accent-blue transition-colors">
                    Search Keyword
                  </label>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-text-tertiary focus:outline-none focus:border-accent-blue/50 transition-all"
                  />
                </div>

                {/* State/Region filter */}
                <div className="relative group">
                  <label className="absolute left-4 -top-2.5 px-2 bg-[#0F172A] text-[10px] font-bold text-text-secondary uppercase tracking-widest">{t.region}</label>
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all cursor-pointer"
                  >
                    {regions.map(r => <option key={r} value={r} className="bg-bg-surface">{r === 'All' ? t.all : r}</option>)}
                  </select>
                </div>

                {/* Stage filter */}
                <div className="relative group">
                  <label className="absolute left-4 -top-2.5 px-2 bg-[#0F172A] text-[10px] font-bold text-text-secondary uppercase tracking-widest">{t.stage}</label>
                  <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all cursor-pointer"
                  >
                    {stages.map(s => <option key={s} value={s} className="bg-bg-surface">{s === 'All' ? t.all : s}</option>)}
                  </select>
                </div>

                {/* Sector filter */}
                <div className="relative group">
                  <label className="absolute left-4 -top-2.5 px-2 bg-[#0F172A] text-[10px] font-bold text-text-secondary uppercase tracking-widest">{t.sector}</label>
                  <select
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all cursor-pointer"
                  >
                    {sectors.map(s => <option key={s} value={s} className="bg-bg-surface">{s === 'All' ? t.all : s}</option>)}
                  </select>
                </div>

                {/* Type filter */}
                <div className="relative group">
                  <label className="absolute left-4 -top-2.5 px-2 bg-[#0F172A] text-[10px] font-bold text-text-secondary uppercase tracking-widest">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all cursor-pointer"
                  >
                    {types.map(ty => <option key={ty} value={ty} className="bg-bg-surface">{ty === 'All' ? t.all : ty}</option>)}
                  </select>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-text-secondary hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={12} /> {t.clearFilters}
                </button>

                <p className="text-text-secondary text-[10px] uppercase tracking-wider font-bold">
                  {t.resultsFound}: <span className="text-white text-xs ml-1 font-bold">{filteredData.length}</span>
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item, index) => (
            <div 
              key={item.id || index}
              className="glass-card hover-glow p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col relative group transition-all duration-300 bg-bg-surface/10"
            >
              {/* Card Ribbon / Badges */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white/10 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.type}
                  </span>
                  {item.deadline.toLowerCase().includes('roll') && (
                    <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 size={10} /> Rolling
                    </span>
                  )}
                </div>

                {/* Score badge in Wizard mode */}
                {wizardActive && (
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] uppercase tracking-widest text-text-secondary font-bold mb-1">{t.scoreLabel}</span>
                    <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                      item.matchScore >= 75 
                        ? 'text-green-400 border-green-500/30 bg-green-500/10' 
                        : item.matchScore >= 50 
                        ? 'text-accent-blue border-accent-blue/30 bg-accent-blue/10' 
                        : 'text-text-secondary border-white/10'
                    }`}>
                      {item.matchScore}%
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Organization Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-accent-blue transition-colors line-clamp-2 leading-tight">
                  {item.name}
                </h3>
                <p className="text-xs text-text-secondary font-light flex items-center gap-1">
                  <Building2 size={12} className="text-accent-blue/70 shrink-0" />
                  <span className="line-clamp-1">{item.provider}</span>
                </p>
              </div>

              {/* Parameter Table details */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-white/5 border border-white/5 rounded-2xl text-xs">
                <div>
                  <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold block mb-1">
                    {t.funding}
                  </span>
                  <span className="text-white font-medium line-clamp-1">{item.fundingSupport}</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold block mb-1">
                    {t.deadline}
                  </span>
                  <span className="text-white font-medium line-clamp-1">{item.deadline}</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold block mb-1">
                    {t.stageLabel}
                  </span>
                  <span className="text-white font-medium line-clamp-1">{item.idealStage}</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold block mb-1">
                    {t.region}
                  </span>
                  <span className="text-white font-medium line-clamp-1">{item.location}</span>
                </div>
              </div>

              {/* Footer action keys */}
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

        {/* Empty state details */}
        {filteredData.length === 0 && (
          <div className="glass-card p-16 rounded-3xl border border-dashed border-white/10 text-center flex flex-col items-center justify-center min-h-[350px]">
            <AlertCircle size={40} className="text-text-secondary mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Matches Found</h3>
            <p className="text-text-secondary mb-8 max-w-md">No grants match this setup. Try adjusting your filter tags or resetting the match engine.</p>
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors" onClick={resetFilters}>
              {t.clearFilters}
            </button>
          </div>
        )}

      </div>

      {/* Interactive Detail Drawer Modal */}
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
              
              {/* Header inside modal */}
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

              {/* Verified badge or Affiliation */}
              <div className="flex flex-wrap gap-4 mb-8 bg-white/5 border border-white/5 rounded-2xl p-4">
                {selectedGrant.governmentAffiliation && (
                  <div>
                    <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-bold mb-0.5">{t.affiliation}</span>
                    <span className="text-white text-xs font-semibold">{selectedGrant.governmentAffiliation}</span>
                  </div>
                )}
                {selectedGrant.sourceVerified && (
                  <div>
                    <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-bold mb-0.5">{t.verified}</span>
                    <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> {selectedGrant.sourceVerified}
                    </span>
                  </div>
                )}
              </div>

              {/* Criteria details */}
              <div className="space-y-6">
                
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ShieldAlert size={14} className="text-accent-violet" />
                    {t.criteria}
                  </h4>
                  <p className="text-sm text-text-secondary font-light bg-white/5 rounded-xl p-4 border border-white/5 leading-relaxed">
                    {selectedGrant.criteria}
                  </p>
                </div>

                {/* Checklist Document simulation */}
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

                {/* Guide description */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                    <HelpCircle size={14} className="text-accent-violet" />
                    {t.howToApply}
                  </h4>
                  <div className="text-sm text-text-secondary font-light space-y-2">
                    <p>1. Verify eligibility based on criteria listed above.</p>
                    <p>2. Prepare necessary documentation including checklist items.</p>
                    <p>3. Submit the digital form at the official application portal.</p>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
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
                  className="flex-1 bg-gradient-to-r from-accent-blue to-accent-violet text-white py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
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
