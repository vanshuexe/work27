import { LIFE_SERVICES, LOVE_SERVICES } from "@/lib/site";

export type ManagedService = {
  id: string;
  slug: string;
  title: string;
  text: string;
  content: string;
  img: string;
  group: "love" | "life";
  visible: boolean;
};

export type ServiceContent = {
  services: ManagedService[];
  updatedAt: string | null;
};

export type ManagedBlog = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  img: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  visible: boolean;
};

export type BlogContent = {
  blogs: ManagedBlog[];
  updatedAt: string | null;
};

export const DEFAULT_SERVICE_DESCRIPTIONS: Record<string, string> = {
  "love-1": `Love is the foundation of happiness, yet even the deepest relationships can face sudden emotional drift, misunderstandings, or third-party interference. In Vedic astrology, the 5th house governs romance and emotional bonds, while the 7th house rules marriage and commitment. Venus (Shukra) is the prime significator of love, and Moon (Chandra) governs emotions and thoughts.

### Common Astrological Causes of Love Problems
- **Affliction of Venus (Shukra):** When Venus is placed in an enemy sign or aspected by Rahu/Ketu, emotional detachment, lack of affection, or sudden loss of attraction occurs.
- **5th & 7th House Dosh:** Malefic planetary placements in the 5th or 7th house can trigger continuous arguments and trust deficiencies.
- **Negative External Influences:** Jealousy or ill-wishes from outside individuals can introduce discord into an otherwise peaceful relationship.

### How Astrologer Kali Charan Restores Love
- **In-depth Kundli Milan & Chart Analysis:** Diagnosing the root planetary imbalance affecting both partners.
- **Divine Shukra & Kamdev Pooja:** Clearing malefic radiation and rejuvenating warmth, passion, and mutual respect.
- **Vedic Yantras & Mantras:** Personalized energized remedies to permanently remove third-party interference.

With over 25 years of proven experience and 98,000+ satisfied clients worldwide, Astrologer Kali Charan provides 100% confidential, safe, and effective solutions. Call or WhatsApp now to resolve your love life challenges within hours.`,

  "love-2": `Losing someone you truly love is one of the most painful experiences in life. Whether your separation was caused by misunderstandings, ego clashes, family pressure, or third-person manipulation, ancient Vedic astrology offers powerful, ethical spiritual remedies to rekindle love and reunite broken hearts.

### Why Did Your Partner Leave?
- **Afflicted Moon (Chandra):** When Moon is under the influence of Saturn (Shani) or Rahu, mental confusion, sudden indifference, and emotional numbness take over.
- **Dasha Period Disruptions:** Unfavorable Mahadasha or Antardasha transits often create temporary illusions and abrupt breakups between compatible lovers.
- **Negative Energy Blockages:** Lingering resentment and external toxicity prevent honest communication.

### Astrological Solutions to Bring Your Ex Back
1. **Kundli Alignment & Transit Check:** Identifying the exact astrological transit that triggered the separation.
2. **Kamdev & Rati Vashikaran Mantras:** Ethical, pure Vedic invocations that dissolve anger, revive cherished memories, and restore deep affection.
3. **Specific Graha Shanti Pujas:** Neutralizing negative planetary rays so your partner reaches out to you willingly with genuine remorse and love.

Consult Astrologer Kali Charan directly today for private, compassionate guidance and proven Vedic remedies that yield visible results.`,

  "love-3": `Choosing your life partner out of love is a sacred journey, but Indian families and societal norms often create severe roadblocks. Parental disapproval, caste differences, financial status disparities, and horoscope mismatches frequently threaten to break apart loving couples.

### Astrological Obstacles in Love Marriage
- **Manglik Dosha & Nadi Dosha:** Incompatibilities in the 28-point or 36-point Guna Milan that frighten family elders.
- **Afflicted 9th House (Bhagya & Elders):** When the 9th house (father, dharma) clashes with the 5th house (love), parents adamantly resist the union.
- **Weak Jupiter (Guru):** Jupiter represents elders' wisdom and blessing; when debilitated, family discussions result in harsh resistance.

### How Astrologer Kali Charan Ensures Parental Blessing
- **Kundli Dosha Nivaran:** Performing customized Shanti pujas to balance Manglik and Nadi doshas without requiring difficult rituals.
- **Brihaspati (Jupiter) Pacification:** Calming family elders' stubbornness and inspiring genuine love and acceptance for your partner.
- **Auspicious Muhurat Planning:** Choosing the exact planetary timing for marriage discussions to guarantee positive outcomes.

Speak with Astrologer Kali Charan today on Call or WhatsApp for confidential consultation and immediate guidance.`,

  "love-4": `Authentic Vedic Vashikaran is an ancient spiritual science derived from the Atharva Veda. Unlike common misconceptions, pure Vedic Vashikaran is strictly positive, ethical, and used solely for noble intentions — such as saving marriages, bringing strayed partners back to righteous paths, and removing malevolent third-party interference.

### When is Positive Vashikaran Beneficial?
- When your spouse or partner has fallen into bad habits, substance abuse, or toxic company.
- When an outsider is actively scheming to break your marriage or family harmony.
- When continuous hostility, domestic abuse, or stubborn silence threatens your home.

### 100% Ethical & Safe Astrological Practice
- **Pure Vedic Vidhi:** Only divine satvik mantras and energized spiritual yantras are utilized, never harmful black magic.
- **Zero Negative Karma:** Designed to invoke compassion, understanding, and loving harmony between two souls.
- **Complete Confidentiality:** Every consultation and detail remains 100% private and protected.

Connect with renowned Vashikaran Specialist Astrologer Kali Charan for guaranteed guidance and long-lasting relationship peace.`,

  "love-5": `Inter-caste love marriages symbolize true commitment, yet rigid social traditions and orthodox family expectations often lead to painful opposition from parents and relatives. Astrology provides powerful, time-tested spiritual remedies to dissolve societal resistance and help parents happily consent.

### Astrological Dynamics of Inter-Caste Unions
- **5th and 9th House Synergy:** When the lord of romance (5th) is at odds with the lord of tradition (9th), family elders feel their cultural prestige is compromised.
- **Influence of Rahu:** Rahu represents unconventional unions and breaking societal boundaries; its placement often drives inter-caste attraction but also sparks family friction.

### Proven Solutions for Family Approval
- **Vishnu & Lakshmi Puja:** Invoking divine blessings to soften family tensions and establish domestic acceptance.
- **Consecrated Rudraksha Remedies:** Wearing specific Gauri Shankar Rudraksha beads to harmonize contradictory family energies.
- **Planetary Dasha Alignment:** Timing family meetings during favorable Guru and Shukra dasha periods to secure immediate consent.

Schedule a consultation with Astrologer Kali Charan today to unite with your beloved with full family blessings and dignity.`,

  "love-6": `Transitioning into married life often brings unforeseen stress. Adjusting to a new family, conflicting lifestyles, financial pressures, interference from in-laws, and evolving expectations can quickly erode newlywed happiness and cause bitter disputes.

### Key Astrological Factors in Post-Marriage Stress
- **Transitioning Planetary Dashas:** Moving into a new Dasha or Antardasha right after marriage can suddenly trigger temperament clashes.
- **Afflicted 2nd House (Kutumba/Family):** Negative aspects on the 2nd house create friction with in-laws and extended family members.
- **Ketu Influences:** Ketu creates emotional isolation, sudden indifference, and unspoken resentment between newly married couples.

### How Vedic Guidance Heals Post-Marriage Friction
- **In-Depth Horoscope Matching Review:** Identifying the specific planetary clashes and clearing dosha blind spots.
- **Vastu Corrections for the Bedroom:** Harmonizing the South-West master bedroom energy to promote grounding, love, and intimacy.
- **Specific Graha Shanti Mantras:** Performing targeted rituals to pacify Rahu, Ketu, and Mars for domestic serenity.

Get in touch with Astrologer Kali Charan for immediate, private advice to protect and revitalize your married life.`,

  "love-7": `A peaceful marriage is the cornerstone of life, yet daily arguments, ego clashes, lack of communication, financial stress, or infidelity can bring two devoted partners to the brink of collapse. Vedic astrology offers precise diagnostic tools to uncover the spiritual and planetary root causes of marital discord.

### Common Astrological Triggers for Marital Discord
- **Debilitated Venus or Jupiter:** Venus governs mutual love and physical bonding, while Jupiter rules marital stability and wisdom. Afflictions here lead to emotional disconnect.
- **Manglik Dosha Impact:** High Mars energy results in sudden anger, aggressive verbal arguments, and stubborn ego battles.
- **7th & 8th House Dosh:** Malefic planetary transits across the marital houses often breed distrust and external interference.

### Time-Tested Vedic Remedies
- **Shiv-Parvati Abhishek:** Performing ritual offerings together on Mondays to dissolve negative household vibrations and restore affection.
- **Shukra Beej Mantra:** Chanting the Venus mantra to sweeten speech and revive romantic passion.
- **Protective Kavach & Yantra:** Consecrated spiritual shields to protect your marital sanctuary from toxic outside envy.

Consult Astrologer Kali Charan today for compassionate, effective astrological solutions to restore lasting harmony between husband and wife.`,

  "life-1": `Divorce and legal separation cause devastating emotional, financial, and psychological distress to both partners and their children. In countless cases, divorce is initiated in haste due to temporary planetary afflictions, ego clashes, or malicious outside rumors rather than a genuine lack of love.

### Astrological Causes of Unwanted Divorce
- **6th & 8th House Activation:** The 6th house rules court cases and legal battles, while the 8th house rules emotional trauma and sudden endings. When these houses are heavily aspected by Saturn, Rahu, or Mars, divorce proceedings escalate rapidly.
- **Severe Papakartari Yoga:** When the 7th house of marriage is hemmed between malefic planets, partners feel trapped and seek legal dissolution.

### How Astrologer Kali Charan Stops Divorce
- **Urgent Chart Diagnostics:** Pinpointing the exact dasha periods and determining whether reconciliation is astrologically possible.
- **Legal & Dispute Shanti Pujas:** Calming court proceedings and pacifying hostile external parties who are fueling the divorce.
- **Heart-Healing Spiritual Mantras:** Re-activating genuine affection and forgiveness in your spouse's heart, leading to voluntary cancellation of divorce proceedings.

If your marriage is facing divorce, do not wait until it is too late. Contact Astrologer Kali Charan now for immediate, confidential assistance.`,

  "life-2": `A divided family brings constant anxiety and unrest. Property disputes among siblings, ongoing friction between mothers-in-law and daughters-in-law, generational gaps with rebellious children, and financial burdens can tear a peaceful household apart.

### Astrological Roots of Family Turmoil
- **Afflicted 4th House (Sukha Sthana):** The 4th house represents peace of mind and domestic happiness. Malefic aspects here ensure continuous household quarrels.
- **2nd House Malefic Influences:** The 2nd house represents the extended family and speech. Cruel planets placed here lead to harsh speech, legal battles, and bitter property feuds.
- **Vastu & Negative Energies:** Blocked cosmic energy in the North-East or South-West directions amplifies domestic anger.

### Vedic Remedies for Lasting Family Peace
- **Maha Mrityunjaya & Gayatri Japa:** Purifying the entire residence of negative vibrations and envious gaze (Buri Nazar).
- **Planetary Pacification for Siblings & Elders:** Harmonizing Mars (brothers), Moon (mother), and Sun/Jupiter (father).
- **Vastu Energy Rectification:** Strategic placement of yantras and spiritual elements to restore warmth and mutual cooperation.

Connect with Astrologer Kali Charan to bring peace, prosperity, and unity back into your family.`,

  "life-3": `The joy of welcoming a child and seeing them thrive is unmatched. However, many couples face heartbreaking obstacles including delayed conception, repeated miscarriages, medical perplexities, or behavioural and academic challenges with growing children.

### Astrological Indicators for Child Concerns
- **5th House (Putra Bhava) Affliction:** In Vedic astrology, the 5th house and its karaka planet Jupiter (Guru) govern progeny, fertility, and intellect.
- **Pitri Dosha or Rahu in 5th House:** Known as Naga Dosha or Sarpadosha, this placement frequently causes unexplained delays in child conception.
- **Mercury (Budha) Affliction:** Causes attention deficits, poor memory, or severe stubbornness in children.

### Sacred Vedic Remedies for Progeny & Children
- **Santan Gopal Mantra & Yagya:** One of the most revered and potent Vedic rituals for blessed conception and child well-being.
- **Pitri Dosha Nivaran:** Performing Tarpan and ancestral peace pujas to unlock divine progeny blessings.
- **Budh & Saraswati Puja:** Enhancing child focus, academic excellence, memory retention, and obedient temperament.

Consult Astrologer Kali Charan for an accurate birth chart reading and customized spiritual solutions for your child-related concerns.`,

  "life-4": `Building and running a profitable business requires tremendous hard work, dedication, and strategic foresight. However, even well-planned ventures can suffer from sudden cash flow collapse, mounting debts, fraudulent partners, client disputes, or unexplained stagnation due to unfavorable cosmic alignments.

### Astrological Causes of Business Setbacks
- **Afflicted 10th & 11th Houses:** The 10th house governs profession, authority, and public status, while the 11th house controls gains, profit, and revenue expansion.
- **Shani Sade Sati or Dhaiya:** Saturn's demanding transit can impose sudden financial strain, regulatory hurdles, or partner conflicts.
- **Mercury (Budha) & Sun (Surya) Weakness:** Mercury controls commerce, trade intellect, and negotiations; Sun controls government favors and market leadership.

### Potent Astrological Business Remedies
- **Vyapar Vridhi Yantra & Lakshmi Kuber Puja:** Consecrated spiritual instruments installed in your office or shop to attract wealth and high-paying clients.
- **Planetary Remedial Gemstones:** Recommending authentic Emerald (Panna), Ruby (Manikya), or Blue Sapphire (Neelam) after rigorous birth chart calculation.
- **Shubh Muhurat Timing:** Initiating tenders, partnership deeds, and major investments under optimal planetary alignments for assured success.

Partner with Astrologer Kali Charan today to conquer business stagnation and achieve sustainable prosperity.`,

  "life-5": `When love falls apart, despair and loneliness can feel overwhelming. A dedicated love back astrologer uses the profound wisdom of Vedic charts to heal broken bonds, clear negative karmic blockages, and guide departed lovers back into each other's arms with renewed affection and lifelong loyalty.

### How Deep Astrological Insight Solves Love Loss
- **Identification of Planetary Clashes:** Pinpointing whether Saturn, Mars, or Rahu caused the breakdown.
- **Elimination of Third-Party Manipulation:** Severing toxic outside influences that poisoned your partner's mind against you.
- **Spiritual Energy Alignment:** Re-establishing the cosmic resonance between your soul and your partner's soul for enduring devotion.

### Why Choose Astrologer Kali Charan?
- Over 25 years of specialized experience in love, marriage, and relationship restoration.
- 100% confidential and private consultations with direct guidance on Call and WhatsApp.
- Pure Vedic remedies and mantras with zero negative side-effects.

Speak directly with Astrologer Kali Charan today to bring your love back and restore eternal romance in your life.`,
};

export const DEFAULT_CONTENT: ServiceContent = {
  updatedAt: null,
  services: [
    ...LOVE_SERVICES.map((s, i) => {
      const id = `love-${i + 1}`;
      return {
        id,
        slug: slugify(s.title),
        title: s.title,
        text: s.text,
        content: DEFAULT_SERVICE_DESCRIPTIONS[id] || s.text,
        img: s.img,
        group: "love" as const,
        visible: true,
      };
    }),
    ...LIFE_SERVICES.map((s, i) => {
      const id = `life-${i + 1}`;
      return {
        id,
        slug: slugify(s.title),
        title: s.title,
        text: s.text,
        content: DEFAULT_SERVICE_DESCRIPTIONS[id] || s.text,
        img: s.img,
        group: "life" as const,
        visible: true,
      };
    }),
  ],
};

export const DEFAULT_BLOGS: ManagedBlog[] = [
  {
    id: "blog-1",
    slug: "effective-astrological-remedies-for-husband-wife-disputes",
    title: "Effective Astrological Remedies for Husband-Wife Disputes",
    excerpt: "Frequent arguments, lack of understanding, or third-person interference can strain married life. Learn how Vedic astrology diagnoses planetary disharmony and offers potent remedies for mutual harmony.",
    category: "Husband-Wife Problem",
    author: "Astrologer Kali Charan",
    date: "2026-10-28",
    readTime: "5 min read",
    img: "/assets/img/service/husband-wife-realistic.webp",
    visible: true,
    content: `Marriage is one of the most sacred unions in Vedic tradition, yet planetary transits and doshas can create friction between couples. When Venus (Shukra), the planet of love, or Jupiter (Guru), the significator of marital stability, face malefic influences from Rahu, Ketu, or Saturn, misunderstandings naturally escalate.

### Common Astrological Causes of Marital Discord
- **Afflicted 7th House:** In Vedic astrology, the 7th house in the birth chart governs spouse and marital happiness. Malefic aspects here often lead to ego clashes.
- **Manglik Dosha:** Mars placement in the 1st, 4th, 7th, 8th, or 12th house can trigger sudden temperamental outbursts if not balanced.
- **Rahu or Ketu Transits:** The shadow planets frequently create illusions, trust deficiencies, or external family misunderstandings.

### Proven Vedic Remedies
1. **Friday Shukra Pooja:** Chanting the Shukra Beej Mantra ('Om Shum Shukraya Namaha') 108 times on Fridays helps strengthen love and sweet speech between partners.
2. **Panchamrit Abhishek:** Performing Shiv-Parvati puja together on Mondays cleanses negative vibrations from the household.
3. **Vastu Corrections:** Ensure the master bedroom is placed in the South-West direction to establish grounded stability and peace.

For personalized chart matching and custom yantra consultations, connect with Astrologer Kali Charan directly.`,
  },
  {
    id: "blog-2",
    slug: "vedic-remedies-to-get-your-ex-love-back",
    title: "Vedic Remedies to Get Your Ex Love Back & Heal Broken Bonds",
    excerpt: "Sudden breakups and emotional separation often happen due to adverse planetary positions. Discover how astrological counseling and spiritual remedies can reunite parted lovers.",
    category: "Love Problem",
    author: "Astrologer Kali Charan",
    date: "2026-10-24",
    readTime: "4 min read",
    img: "/assets/img/service/love-back-realistic.webp",
    visible: true,
    content: `When two souls connect deeply, emotional separation causes immense heartbreak. In many cases, breakups occur not due to a lack of genuine affection, but because of temporary malefic transits disrupting the 5th house of love and romance.

### Why Do Relationships Face Sudden Breakups?
- **Debilitated Venus or Moon:** The Moon controls human emotions and empathy. When the Moon is afflicted by Saturn or Rahu, emotional detachment or misunderstandings take over.
- **5th and 7th House Link Broken:** If the lord of the 5th house moves into an enemy sign or the 6th/8th house of disputes, separations occur unexpectedly.

### How Astrological Guidance Restores Love
- **Birth Chart Analysis:** By analyzing both partners' Kundlis, the exact root cause of resentment is identified.
- **Kamdev & Rati Mantra:** Traditional spiritual recitations invoke positive magnetic attraction and remove negative third-party influences.
- **Specific Donations:** Donating white sweets, rice, or milk on Mondays and Fridays calms adverse planetary rays.

With over 25 years of experience, Astrologer Kali Charan has helped thousands of couples reunite peacefully with complete confidentiality.`,
  },
  {
    id: "blog-3",
    slug: "how-to-overcome-parental-opposition-in-inter-caste-love-marriage",
    title: "How to Overcome Parental Opposition in Inter-Caste Love Marriages",
    excerpt: "Facing family disapproval for your choice of partner? Discover how Vedic planetary pacification and Kundli alignment help parents willingly accept love marriages.",
    category: "Love Marriage",
    author: "Astrologer Kali Charan",
    date: "2026-10-18",
    readTime: "6 min read",
    img: "/assets/img/service/inter-caste-realistic.webp",
    visible: true,
    content: `In Indian society, inter-caste marriages often face resistance from conservative family members and elders. Astrologically, the 9th house represents family traditions and fatherly approval, while the 4th house represents motherly affection and domestic acceptance.

### The Astrological Dynamics of Parental Approval
When the 5th house (love) and 9th house (dharma/elders) do not harmoniously aspect each other, parents often struggle to accept their child's romantic choice. Furthermore, Jupiter's weakness can make family discussions tense and unfruitful.

### Effective Astrological Solutions
- **Strengthening Jupiter (Guru):** Jupiter represents elders and wisdom. Offering yellow flowers and gram pulse (chana dal) to Lord Vishnu on Thursdays helps soften elders' resistance.
- **Gauri Shankar Rudraksha:** Wearing a consecrated Gauri Shankar Rudraksha unites discordant energies and brings family harmony.
- **Favorable Timing (Shubh Muhurat):** Initiating marriage discussions during positive planetary dasha periods dramatically increases the likelihood of parental agreement.

If you are struggling to convince your parents, consult Astrologer Kali Charan for an accurate birth chart reading and personalized remedies.`,
  },
  {
    id: "blog-4",
    slug: "complete-guide-to-vashikaran-astrology-for-positive-relationship-harmony",
    title: "Complete Guide to Vashikaran Astrology for Positive Relationship Harmony",
    excerpt: "Understand the sacred origins of positive Vedic Vashikaran, how it clears toxic external influences, and why ethical consultation brings true peace.",
    category: "Vashikaran Specialist",
    author: "Astrologer Kali Charan",
    date: "2026-10-12",
    readTime: "5 min read",
    img: "/assets/img/service/vashikaran-realistic.webp",
    visible: true,
    content: `The term 'Vashikaran' comes from ancient Sanskrit scriptures, where it refers to the spiritual art of bringing mind, aura, and heart into peaceful resonance. In authentic Vedic practice, it is strictly used with pure intentions to protect families and save marriages from destructive influences.

### When is Positive Vashikaran Recommended?
- When a spouse or partner has fallen into harmful habits or bad company.
- When an outside individual is intentionally causing separation between husband and wife.
- When continuous hostility threatens the emotional well-being of children and the family.

### Ethical and Safe Astrological Practices
True Vashikaran involves divine mantras and positive energy alignment, never harmful black magic. When performed under the guidance of a genuine Vedic astrologer, it works by eliminating negativity and invoking compassion and clarity.

Astrologer Kali Charan provides 100% safe, verified, and completely private consultations to help you regain peace and mutual affection in your relationship.`,
  },
];

export const DEFAULT_BLOG_CONTENT: BlogContent = {
  updatedAt: null,
  blogs: DEFAULT_BLOGS,
};

function isValidImagePath(img: unknown): boolean {
  if (typeof img !== "string" || img.length > 2048) return false;
  const localImage = /^\/assets\/img\/[a-zA-Z0-9_\-/]+\.(webp|png|jpe?g)$/i.test(img);
  const uploadedImage = /^\/api\/media\/[a-f0-9-]{36}\.webp$/.test(img);
  let remoteImage = false;
  try {
    const url = new URL(img);
    remoteImage = url.protocol === "https:" && !url.username && !url.password;
  } catch { /* Local paths are checked separately. */ }
  return localImage || uploadedImage || remoteImage;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function calculateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

export function validateContent(value: unknown): ServiceContent {
  if (!value || typeof value !== "object" || !("services" in value) || !Array.isArray(value.services)) {
    throw new Error("Invalid services content.");
  }
  if (value.services.length > 60) throw new Error("A maximum of 60 services is supported.");
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const services = value.services.map((s: unknown) => {
    if (!s || typeof s !== "object") throw new Error("Invalid service.");
    const item = s as Record<string, unknown>;
    if (typeof item.id !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(item.id) || ids.has(item.id)) {
      throw new Error("Each service must have a unique ID.");
    }
    ids.add(item.id);
    if (typeof item.title !== "string" || !item.title.trim() || item.title.trim().length > 100) {
      throw new Error("Service titles must contain 1–100 characters.");
    }
    if (typeof item.text !== "string" || !item.text.trim() || item.text.trim().length > 2000) {
      throw new Error("Service descriptions must contain 1–2,000 characters.");
    }

    const rawSlug = typeof item.slug === "string" && item.slug.trim() ? item.slug.trim() : item.title.trim();
    const slug = slugify(rawSlug);
    if (!slug) throw new Error("Each service must have a valid URL slug.");
    if (slugs.has(slug)) throw new Error(`Duplicate service URL slug: "${slug}".`);
    slugs.add(slug);

    const content = typeof item.content === "string" && item.content.trim()
      ? item.content.trim()
      : (DEFAULT_SERVICE_DESCRIPTIONS[item.id] || item.text.trim());

    if (!isValidImagePath(item.img)) throw new Error("Choose an image, a local image path, or an HTTPS image URL.");
    if (item.group !== "love" && item.group !== "life") throw new Error("Choose a valid service group.");
    if (typeof item.visible !== "boolean") throw new Error("Invalid service visibility.");
    return {
      id: item.id,
      slug,
      title: item.title.trim(),
      text: item.text.trim(),
      content,
      img: String(item.img),
      group: item.group,
      visible: item.visible,
    } satisfies ManagedService;
  });
  const updatedAt = "updatedAt" in value ? value.updatedAt : null;
  if (updatedAt !== null && (typeof updatedAt !== "string" || !Number.isFinite(Date.parse(updatedAt)))) {
    throw new Error("Invalid saved revision.");
  }
  return { services, updatedAt };
}

export function validateBlogContent(value: unknown): BlogContent {
  if (!value || typeof value !== "object" || !("blogs" in value) || !Array.isArray(value.blogs)) {
    throw new Error("Invalid blog content.");
  }
  if (value.blogs.length > 100) throw new Error("A maximum of 100 blogs is supported.");
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const blogs = value.blogs.map((b: unknown) => {
    if (!b || typeof b !== "object") throw new Error("Invalid blog.");
    const item = b as Record<string, unknown>;
    if (typeof item.id !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(item.id) || ids.has(item.id)) {
      throw new Error("Each blog must have a unique ID.");
    }
    ids.add(item.id);

    const rawSlug = typeof item.slug === "string" ? slugify(item.slug) : "";
    if (!rawSlug || !/^[a-z0-9-]+$/.test(rawSlug) || slugs.has(rawSlug)) {
      throw new Error("Each blog must have a unique, URL-safe slug.");
    }
    slugs.add(rawSlug);

    if (typeof item.title !== "string" || !item.title.trim() || item.title.trim().length > 150) {
      throw new Error("Blog titles must contain 1–150 characters.");
    }
    if (typeof item.excerpt !== "string" || !item.excerpt.trim() || item.excerpt.trim().length > 600) {
      throw new Error("Blog excerpts must contain 1–600 characters.");
    }
    if (typeof item.content !== "string" || !item.content.trim() || item.content.trim().length > 30000) {
      throw new Error("Blog content must contain 1–30,000 characters.");
    }
    if (!isValidImagePath(item.img)) throw new Error("Choose an image, a local image path, or an HTTPS image URL.");

    const category = typeof item.category === "string" && item.category.trim() ? item.category.trim().slice(0, 60) : "Vedic Astrology";
    const author = typeof item.author === "string" && item.author.trim() ? item.author.trim().slice(0, 80) : "Astrologer Kali Charan";
    const date = typeof item.date === "string" && item.date.trim() ? item.date.trim().slice(0, 30) : new Date().toISOString().slice(0, 10);
    const readTime = typeof item.readTime === "string" && item.readTime.trim() ? item.readTime.trim().slice(0, 30) : calculateReadTime(item.content.trim());

    if (typeof item.visible !== "boolean") throw new Error("Invalid blog visibility.");

    return {
      id: item.id,
      slug: rawSlug,
      title: item.title.trim(),
      excerpt: item.excerpt.trim(),
      content: item.content.trim(),
      img: String(item.img),
      category,
      author,
      date,
      readTime,
      visible: item.visible,
    } satisfies ManagedBlog;
  });

  const updatedAt = "updatedAt" in value ? value.updatedAt : null;
  if (updatedAt !== null && (typeof updatedAt !== "string" || !Number.isFinite(Date.parse(updatedAt)))) {
    throw new Error("Invalid saved revision.");
  }
  return { blogs, updatedAt };
}
