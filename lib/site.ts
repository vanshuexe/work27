export const SITE_NAME = "Astrologer Kali Charan";
// The live address of the site; set NEXT_PUBLIC_SITE_URL in production (see .env.example).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SEO_TITLE = "Astrologer Kali Charan – Love Problem Solution | +91 99102 53443";
export const SEO_DESCRIPTION =
  "Astrologer Kali Charan: love back, love marriage, husband-wife, divorce & family problem solutions. 25+ years experience. Call/WhatsApp +91 99102 53443.";
export const TAGLINE = "Love, Marriage & Family Problem Specialist";
export const PHONE = "+91 99102 53443";
export const TEL = "tel:+919910253443";
const WA_NUMBER = "919910253443";
export const WHATSAPP = `https://wa.me/${WA_NUMBER}/?text=Hello!`;
export const IMG_ALT = `${SITE_NAME} ${PHONE}`;

export const NAV = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#why-us", label: "Why Us" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export type Service = { img: string; title: string; text: string };

export const LOVE_SERVICES: Service[] = [
  {
    img: "/assets/img/service/love-problem.webp",
    title: "Love Problem Specialist",
    text: "Marriage and falling in love is something special and rare in life. Fortunately, both can be predicted through your birth chart.",
  },
  {
    img: "/assets/img/service/love-back.webp",
    title: "Get Your Love Back",
    text: "Love combines positive feelings such as happiness, kindness, and caring for someone you love, and happens when you put their happiness above yours.",
  },
  {
    img: "/assets/img/service/love-marriage.webp",
    title: "Love Marriage",
    text: "Love marriage astrology consultation is based on the study of ascendant, Venus, the 5th house and the 7th house to predict if you will fall in love.",
  },
  {
    img: "/assets/img/service/inter-caste.webp",
    title: "Inter Caste Marriage",
    text: "In a world full of customs and beliefs, intercaste marriages bring both personal joys and difficulties.",
  },
  {
    img: "/assets/img/service/after-marriage.webp",
    title: "After Marriage Problem",
    text: "Having trouble after marriage with your partner? You are in the right place to solve your marriage problems.",
  },
  {
    img: "/assets/img/service/husband-wife.webp",
    title: "Husband Wife Problem",
    text: "End everyday conflicts and misunderstandings with spiritual guidance and proven astrological remedies. Strengthen emotional bonds and restore harmony in your married life.",
  },
];

export const LIFE_SERVICES: Service[] = [
  {
    img: "/assets/img/service/divorce.webp",
    title: "Divorce Problem",
    text: "A good marital relationship builds on how much two partners love and trust each other while working together.",
  },
  {
    img: "/assets/img/service/family.webp",
    title: "Family Problem Solution",
    text: "Disagreements between families are a normal aspect of life. Comparing the astrology charts of family members helps bring peace back home.",
  },
  {
    img: "/assets/img/service/child.webp",
    title: "Child Related Problem",
    text: "Struggling with child-related issues? Astrology delivers potent guidance to help solve these issues.",
  },
  {
    img: "/assets/img/service/business.webp",
    title: "Business Problem",
    text: "Every type of business startup demands particular traits and skills that form the foundation for business success.",
  },
  {
    img: "/assets/img/service/love-back-astrologer.webp",
    title: "Love Back Astrologer",
    text: "Love problems take a heavy toll on emotions so people want answers that lead them to a better future.",
  },
];

export const HERO_POINTS = [
  { icon: "clock", label: "25+ years experience" },
  { icon: "users", label: "98K+ clients" },
  { icon: "lock", label: "100% privacy" },
] as const;

export const FEATURES = [
  { icon: "award", title: "21+ International Awards" },
  { icon: "clock", title: "25+ Years of Experience" },
  { icon: "badge", title: "Certified Expert Astrologer" },
  { icon: "users", title: "98K+ Satisfied Customers" },
] as const;

export const COUNTERS = [
  { value: 10200, label: "Marriage Solutions" },
  { value: 6100, label: "Love Solutions" },
  { value: 8015, label: "Family Solutions" },
  { value: 10158, label: "Husband Wife Solutions" },
];

export const STEPS = [
  { title: "Call or WhatsApp", text: `Reach out any time on ${PHONE}. Your conversation stays completely private.` },
  { title: "Share your details", text: "Tell us your problem along with your birth date, time and place for chart reading." },
  { title: "Get guidance & remedies", text: "Receive a clear reading of your situation and simple astrological remedies to follow." },
];

export const TESTIMONIALS = [
  {
    name: "Anand Kumar",
    city: "Bangalore",
    text: "My parents were not giving me permission to marry in another caste so for help I connected with Astrologer Kali Charan and his suggested remedies helped me to gain their permission for my inter caste love marriage.",
  },
  {
    name: "Mohit Rajput",
    city: "Delhi",
    text: "I wanted to get back with my ex lover and for this I connected with Astrologer Kali Charan and he prescribed me with some astrological rituals. By executing those rituals correctly today I get my ex lover back in life.",
  },
  {
    name: "Usha Devi",
    city: "Ludhiana",
    text: "I wanted to attract my crush towards me, so I took some love remedies from Astrologer Kali Charan and by using his solutions I was able to attract her towards me and today we both are happy.",
  },
  {
    name: "Chanda Malviya",
    city: "Mumbai",
    text: "Thank you so much Astrologer Kali Charan Ji for your astrological relationship guidance. Today, due to your guidance I am able to tackle trust issues in my relationship and bring love and peace into my love life.",
  },
];

export const FAQS = [
  {
    q: "Why do people consider Astrologer Kali Charan famous?",
    a: "People trust Astrologer Kali Charan because of his 25+ years of experience and accurate predictions. His simple yet powerful remedies make him a trusted name for relationship, career, and family issues.",
  },
  {
    q: "Why is Astrologer Kali Charan known across India?",
    a: "With clients from the USA, UK, Australia, Canada, and across India, his credibility and accuracy have earned him wide recognition. His global reach and problem-solving methods stand out.",
  },
  {
    q: "What qualities make someone the top astrologer in India?",
    a: "A top astrologer must offer accurate predictions, practical remedies, and consistent results across various life issues. Astrologer Kali Charan meets all these criteria, making him widely trusted.",
  },
  {
    q: "Is my consultation kept private?",
    a: "Yes. Every consultation is handled with 100% privacy. Your personal details and problems are never shared with anyone.",
  },
];

// "Popular Searches" tags, grouped by the search word they target. Each tag opens WhatsApp
// with the phrase pre-filled, so the tags double as conversation starters.
export const POPULAR_SEARCHES: { group: string; tags: string[] }[] = [
  { group: "Online", tags: ["Online Astrologer", "Online Love Problem Solution", "Online Astrology Consultation"] },
  { group: "Free", tags: ["Free Love Problem Solution", "Free Astrology Advice on WhatsApp", "Free Love Marriage Advice"] },
  { group: "Best", tags: ["Best Astrologer in India", "Best Love Problem Solution Astrologer", "Best Love Marriage Specialist"] },
  { group: "Near me", tags: ["Astrologer Near Me", "Love Problem Solution Near Me", "Love Marriage Specialist Near Me"] },
  { group: "Molvi ji", tags: ["Love Problem Solution Molvi Ji", "Molvi Ji for Love Back", "Molvi Ji Near Me"] },
  { group: "Astrologer", tags: ["Love Astrologer", "Marriage Astrologer", "Family Problem Astrologer"] },
  { group: "Expert", tags: ["Love Problem Expert", "Vashikaran Expert", "Husband Wife Problem Expert"] },
  { group: "Guru ji", tags: ["Love Guru Ji", "Astrologer Guru Ji", "Guru Ji for Love Marriage"] },
  { group: "Baba ji", tags: ["Love Problem Solution Baba Ji", "Baba Ji for Love Back", "Baba Ji Near Me"] },
  { group: "Remedies", tags: ["Love Problem Remedies", "Astrological Remedies for Marriage", "Husband Wife Dispute Remedies"] },
  { group: "Top", tags: ["Top Astrologer in India", "Top Love Problem Specialist", "Top Vashikaran Specialist"] },
  { group: "Famous", tags: ["Famous Astrologer", "Famous Love Astrologer", "Famous Astrologer Kali Charan"] },
  { group: "Tantrik", tags: ["Love Problem Tantrik", "Tantrik for Love Back", "Tantrik Near Me"] },
  { group: "Powerful", tags: ["Powerful Astrologer", "Powerful Love Remedies", "Powerful Vashikaran Specialist"] },
  { group: "Genuine", tags: ["Genuine Astrologer", "Genuine Love Problem Solution", "Genuine Astrologer in India"] },
];

export const whatsappWith = (topic: string) =>
  `https://wa.me/${WA_NUMBER}/?text=${encodeURIComponent(`Hello! I need help with: ${topic}`)}`;

export const FOOTER_WHY_US = [
  "High Quality Service",
  "24x7 Help & Support",
  "Trusted By 98K+ Customers",
  "Online Consultation",
  "Love Back Guidance",
  "Accurate Horoscope Analysis",
];
