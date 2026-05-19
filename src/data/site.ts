export const firm = {
  name: 'Ibezim Law Offices P.C.',
  tagline: 'Our goal is to get you the best results',
  phone: '+1 (973) 351-5800',
  email: 'sebastian@ibezimlaw.com',
  address: '1182 Clinton Ave, First Floor, Irvington, NJ 07111, USA',
  hours: 'Mon–Fri: 9:00 AM – 6:00 PM | Saturdays – Sundays: By Appointment Only',
  mapsEmbed:
    'https://maps.google.com/maps?q=1182+Clinton+Ave,+First+Floor,+Irvington,+NJ+07111,+USA&hl=en&z=16&output=embed',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=1182+Clinton+Ave,+Irvington,+NJ+07111,+USA',
} as const

/** Rotating hero headlines (Home) */
export const heroHeadlines = [
  {
    primary: 'Clear counsel.',
    accent: 'Strong advocacy.',
  },
  {
    primary: 'High-caliber representation',
    accent: 'from the best.',
  },
  {
    primary: 'Dedicated to efficient and',
    accent: 'effective resolution of cases.',
  },
] as const

/** Home — about preview (below hero) */
export const homeAboutSection = {
  label: 'About Ibezim Law',
  title: 'We Always Fight For Your Justice.',
  excerpt:
    'For more than two decades, Ibezim Law Offices has delivered strategic counsel across personal injury, immigration, and complex civil matters—with integrity, rigorous preparation, and a relentless focus on results for every client we represent.',
  highlights: [
    { label: 'Excellent Legal Services', icon: 'justice' as const },
    { label: 'Expert Attorneys', icon: 'attorney' as const },
    { label: 'Superb Success Rate', icon: 'gavel' as const },
    { label: 'Highly Recommend', icon: 'recommend' as const },
    { label: 'Truly Result Oriented', icon: 'results' as const },
    { label: 'Highly Knowledgeable', icon: 'education' as const },
  ],
} as const

/** Home — Why Choose Us */
export const whyChooseUs = {
  eyebrow: 'The Big Question',
  title: 'Why Ibezim Law?',
  reasons: [
    {
      title: 'Accessible',
      text: 'We are easily accessible, no machines or answering service. You will reach an attorney.',
      icon: 'accessible' as const,
    },
    {
      title: 'Personable',
      text: 'Personal service. We treat every case like it’s our personal case, and no case is too big or too small.',
      icon: 'personable' as const,
    },
    {
      title: 'Experience',
      text: 'We are very knowledgeable, and we take the time to educate you on your case with our years of experience, because we believe that the educated client makes our job easier.',
      icon: 'experience' as const,
    },
    {
      title: 'Communication',
      text: 'We communicate to you on every step of your case, so that you are well informed.',
      icon: 'communication' as const,
    },
    {
      title: 'Results',
      text: 'Our goal is to get you the best results on your case, so that you are very satisfied.',
      icon: 'results' as const,
    },
  ],
} as const

/** Trust strip pillars below header (Home) */
export const heroTrustPillars = [
  { num: '01', label: 'Accessible', icon: 'accessible' as const },
  { num: '02', label: 'Experienced', icon: 'experienced' as const },
  { num: '03', label: 'Results', icon: 'results' as const },
] as const

/** Update with your live profile URLs */
export const socialLinks = {
  facebook: 'https://web.facebook.com/sebastian.ibezim.7?_rdc=1&_rdr#',
  linkedin: 'https://www.linkedin.com/in/sebastian-ibezim-jr-92153a33/',
} as const

export const affiliations = [
  {
    image: 'part1',
    name: 'American Immigration Lawyers Association',
    short: 'AILA',
  },
  {
    image: 'part2',
    name: 'New York State Bar Association',
    short: 'NYSBA',
  },
  {
    image: 'part3',
    name: 'New Jersey Association for Justice',
    short: 'NJAJ',
  },
] as const

export const navLinks = [
  { label: 'Home', path: '/' },
  {
    label: 'About',
    path: '/about',
    children: [
      { label: 'About Us', path: '/about' },
      { label: 'Attorney Details', path: '/attorney' },
    ],
  },
  { label: 'Practice Areas', path: '/services' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Resources', path: '/resources' },
  { label: 'Contact', path: '/contact' },
] as const

export const testimonials = [
  {
    id: 'maria-g',
    quote:
      'After my accident, I felt overwhelmed and unsure where to turn. Mr. Ibezim and his team handled everything with professionalism and genuine care. They kept me informed at every step and secured a result that exceeded my expectations.',
    name: 'Maria G.',
    location: 'Newark, NJ',
    matter: 'Personal Injury',
    rating: 4,
  },
  {
    id: 'Attitude-l',
    quote:
      'After my accident, I felt overwhelmed and unsure where to turn. Mr. Ibezim and his team handled everything with professionalism and genuine care. They kept me informed at every step and secured a result that exceeded my expectations.',
    name: 'Attitude L.',
    location: 'Newark, NJ',
    matter: 'Personal Injury',
    rating: 4,
  },
  {
    id: 'patricia-l',
    quote:
      'When I was injured on the job, my claim was initially denied. The firm fought tirelessly on my behalf and helped me obtain the benefits I deserved. I recommend them without hesitation.',
    name: 'Patricia L.',
    location: 'East Orange, NJ',
    matter: 'Workers Compensation',
    rating: 5,
  },
  {
    id: 'eucharia-O',
    quote:
      'Our Medical Malpractice case could have been complicated, but the process was smooth and dignified from start to finish. They explained every document and made a difficult chapter manageable for our Loved ones.',
    name: 'Eucharia O.',
    location: 'Elizabeth, NJ',
    matter: 'Medical Malpractice',
    rating: 5,
  },
  {
    id: 'denis-p',
    quote:
      'Our Traffic Matters case could have been complicated, but the process was smooth and dignified from start to finish. They explained every document and made a difficult chapter manageable for our family.',
    name: 'Denis P.',
    location: 'Yorkshire, UK',
    matter: 'Traffic Matters',
    rating: 5,
  },
  {
    id: 'mete-y',
    quote:
      'Our uncontested divorce could have been complicated, but the process was smooth and dignified from start to finish. They explained every document and made a difficult chapter manageable for our family.',
    name: 'Mete Yonkoye',
    location: 'North Carolina, USA',
    matter: 'Immigration',
    rating: 3,
  },
] as const

export const faqs = [
  {
    id: 'consultation',
    question: 'How do I schedule a consultation?',
    answer:
      'Call our office at (973) 351-5800, email sebastian@ibezimlaw.com, or use the contact form on this website. We typically respond within one business day to schedule a confidential consultation at our Irvington office.',
  },
  {
    id: 'first-visit',
    question: 'What should I bring to my first appointment?',
    answer:
      'Bring a valid photo ID, any documents related to your matter (contracts, court papers, medical records, correspondence), and a list of questions. If your case involves an injury or accident, photos, police reports, and insurance information are especially helpful.',
  },
  {
    id: 'fees',
    question: 'How are legal fees structured?',
    answer:
      'Fees depend on the type of matter. Some cases are handled on a contingency basis; others use flat fees or hourly rates. During your consultation, we explain the fee arrangement clearly before you decide to move forward—no surprises.',
  },
  {
    id: 'areas',
    question: 'What areas of law does your firm handle?',
    answer:
      'We represent clients in personal injury, immigration, workers’ compensation, medical malpractice, real estate, traffic matters, and uncontested divorce. Visit our Practice Areas page for details on each service.',
  },
  {
    id: 'timeline',
    question: 'How long will my case take?',
    answer:
      'Every matter is different. Simple cases may resolve in weeks; complex litigation can take months or longer. We provide honest timelines at the outset and keep you updated as your case progresses.',
  },
  {
    id: 'confidential',
    question: 'Is my consultation confidential?',
    answer:
      'Yes. Information you share during a consultation is treated as confidential. An attorney-client relationship is established only when we agree in writing to represent you.',
  },
] as const

export const blogTags = [
  'Attorney',
  'Law',
  'Immigration',
  'Personal Injury',
  'New Jersey',
  'Litigation',
  'Estate Planning',
  'Workers Compensation',
] as const

export const blogPosts = [
  {
    slug: 'understanding-corporate-compliance-New-Jersey',
    title: 'Understanding Corporate Compliance in New Jersey',
    excerpt:
      'Key regulatory obligations every business owner should know before scaling operations in the Garden State.',
    date: '2026-04-12',
    category: 'Corporate Law',
    author: 'Sebastian O. Ibezim',
    readTime: '6 min read',
    imageKey: 'office',
    body: [
      'New Jersey’s business environment is shaped by federal law, state statutes, and industry-specific regulations. For growing companies, compliance is not merely a box-ticking exercise—it is foundational to sustainable growth and credibility with partners and investors.',
      'From formation documents and annual reports to employment policies, tax obligations, and licensing, businesses must stay proactive. New Jersey’s Division of Revenue and federal agencies expect timely filings and accurate disclosures.',
      'We recommend a compliance review at least annually, with updated policies for contracts, workplace practices, and record-keeping. Early structure prevents costly disputes and penalties down the line.',
    ],
  },
  {
    slug: 'estate-planning-essentials-families',
    title: 'Estate Planning Essentials for Families',
    excerpt:
      'Why a valid will and clear succession plan matter—and how New Jersey families can get started.',
    date: '2026-03-28',
    category: 'Estate Planning',
    author: 'Sebastian O. Ibezim',
    readTime: '5 min read',
    imageKey: 'door',
    body: [
      'Estate planning ensures your assets are distributed according to your wishes and that your loved ones are protected. In New Jersey, this typically begins with a properly executed will, supported where appropriate by trusts and powers of attorney.',
      'Without a will, intestacy rules apply—and the outcome may not reflect your intentions, especially in blended families or where property spans multiple states.',
      'Start by listing assets, identifying beneficiaries, and appointing executors you trust. Our team guides clients through drafting, safe storage, and periodic review as life circumstances change.',
    ],
  },
  {
    slug: 'navigating-commercial-disputes',
    title: 'Navigating Commercial Disputes: Litigation vs. Arbitration',
    excerpt:
      'Choosing the right path when a business relationship breaks down in New Jersey courts or private forums.',
    date: '2026-02-15',
    category: 'Litigation',
    author: 'Sebastian O. Ibezim',
    readTime: '7 min read',
    imageKey: 'reception',
    body: [
      'When commercial relationships sour, parties often face a choice between court litigation and arbitration. Each route has distinct advantages depending on confidentiality needs, speed, cost, and enforceability of awards.',
      'Arbitration clauses in contracts can streamline resolution and keep matters private—but only if drafted clearly at the outset. Litigation may be preferable where injunctive relief or precedent is critical.',
      'Early legal advice helps preserve evidence, manage communications, and explore settlement before positions harden. Our dispute resolution practice advises on strategy from pre-action through to enforcement.',
    ],
  },
  {
    slug: 'personal-injury-steps-new-jersey',
    title: 'What to Do After a Personal Injury in New Jersey',
    excerpt:
      'Practical steps to protect your health, your rights, and your potential claim after an accident.',
    date: '2026-01-20',
    category: 'Personal Injury',
    author: 'Sebastian O. Ibezim',
    readTime: '5 min read',
    imageKey: 'officeoutdoor',
    body: [
      'After an accident, your first priorities are safety and medical care. Once you are stable, documenting what happened becomes essential—photos, witness information, and official reports can strengthen a future claim.',
      'Avoid giving recorded statements to insurance companies before speaking with an attorney. Seemingly casual comments can be used to minimize your injuries or shift blame.',
      'New Jersey personal injury claims are subject to statutes of limitations and specific procedural rules. Consulting a lawyer early helps preserve evidence and identify all sources of compensation.',
    ],
  },
] as const

export const practiceAreas = [
  {
    title: 'Personal Injury',
    imageKey: 'personalInjury',
    description:
      'Representation for individuals injured through negligence—including auto accidents, slips and falls, and other incidents—pursuing compensation for medical expenses, lost income, and pain and suffering.',
    icon: 'scale',
  },
  {
    title: 'Immigration',
    imageKey: 'immigration',
    description:
      'Assistance with visas, green cards, citizenship applications, deportation defense, and family-based petitions for clients navigating U.S. immigration law.',
    icon: 'document',
  },
  {
    title: 'Workers Compensation',
    imageKey: 'workersComp',
    description:
      'Helping injured employees file claims, challenge denials, and secure medical treatment and wage benefits under New Jersey workers’ compensation law.',
    icon: 'people',
  },
  {
    title: 'Traffic Matters',
    imageKey: 'traffic',
    description:
      'Defense and resolution of traffic citations, license suspensions, DUI/DWI charges, and municipal court matters throughout New Jersey.',
    icon: 'scale',
  },
  {
    title: 'Medical Malpractice',
    imageKey: 'medical',
    description:
      'Advocacy for patients harmed by negligent medical care—including misdiagnosis, surgical errors, and failure to treat—seeking accountability and fair recovery.',
    icon: 'building',
  },
  {
    title: 'Real Estate Matters',
    imageKey: 'realEstate',
    description:
      'Support for residential and commercial transactions, title issues, leases, closings, and property disputes for buyers, sellers, and landlords.',
    icon: 'home',
  },
  {
    title: 'Uncontested Divorce',
    imageKey: 'divorce',
    description:
      'Efficient representation when spouses agree on terms—handling filings, equitable distribution, and support arrangements without unnecessary conflict.',
    icon: 'people',
  },
] as const

/** About page — main content block */
export const aboutPage = {
  label: 'About Us',
  title: 'Dedicated to Efficient, Effective Resolution of Cases',
  paragraphs: [
    'Our attorneys have over twenty-three years of experience, and very knowledgeable in what we do. We are very results oriented because we realize that is our client’s main objective, therefore we fight for you with all we have.',
    'The Ibezim Law firm’s primary objective is to help you resolve your legal dispute quickly and effectively.',
  ],
  featuredPracticeAreas: [
    'Personal Injury',
    'Medical Malpractice',
    'Immigration',
    'Traffic Matters',
    'Real Estate Matters',
    'Uncontested Divorce',
  ],
} as const

export const values = [
  {
    title: 'Integrity',
    text: 'We uphold the highest ethical standards in every matter we handle.',
    icon: 'integrity' as const,
  },
  {
    title: 'Excellence',
    text: 'Rigorous preparation and sharp advocacy define our approach to the law.',
    icon: 'excellence' as const,
  },
  {
    title: 'Client Focus',
    text: 'Your goals guide our strategy—we communicate clearly and act decisively.',
    icon: 'client' as const,
  },
] as const

export const attorney = {
  name: 'Sebastian O. Ibezim',
  title: 'Attorney at Law',
  subtitle: 'Founder & Managing Attorney, Ibezim Law Offices, P.C.',
  bio: [
    'Sebastian O. Ibezim, Jr., Esq. is an experienced trial attorney in various complex civil litigation fields. With a world of experience in litigation, jury, and bench trials including running a successful private practice for more than twenty years in both New York and New Jersey, he has focused his practice for the past three years mostly on personal injury and immigration. Mr. Ibezim is revered for his high-caliber representation of clients, as well as its trial-oriented and results-producing practice.',
    'Mr. Ibezim attended The College of New Jersey where he obtained a bachelor’s degree in Public Administration and Political Science. Mr. Ibezim graduated from Seton Hall Law School in 1997, where he worked at the renowned Center For Social Justice Immigration Clinic for law students.',
    'In 2002 he was the senior partner of the then existing Blackburn, Ibezim & Okechukwu LLC. In that capacity, he successfully prosecuted the firm’s complex personal injury, medical malpractice and civil litigation matters, in State and Federal Courts, at the trial and appeal levels. Since departing from Blackburn, Ibezim & Okechukwu, Mr. Ibezim’s practice has focused primarily on personal injury matters in which he has recovered millions of dollars in jury verdicts, settlement negotiations, private mediation, and mandatory arbitration for his clients. Mr. Ibezim is known in the field of law as an affable lawyer who treats judges, fellow attorneys, clients and colleagues with a great deal of respect—but also as a tough litigator who does not hesitate to take a case to trial in order to protect his clients’ best interests.',
  ],
  education: [
    'LLB, Law — Seton Hall Law School',
    'BS, Public Administration and Political Science - The College of New Jersey',
  ],
  admissions: [
    'New Jersey Supreme Court',
    'Federal District Court for the District of New Jersey',
    'Appellate Division of the Supreme Court of New York',
  ],
  highlights: [
    '25+ years of legal experience',
    'Personal injury & civil litigation',
    'Immigration & naturalization',
    'Workers’ compensation claims',
  ],
} as const

export const team = [
  {
    name: 'Sebastian O. Ibezim',
    role: 'Attorney at Law',
    bio: 'Over 25 years of experience advocating for clients across New Jersey.',
  },
  {
    name: 'Adaeze Okonkwo',
    role: 'Senior Associate',
    bio: 'Specializes in real estate transactions and commercial dispute resolution.',
  },
  {
    name: 'Tunde Bakare',
    role: 'Associate',
    bio: 'Focuses on employment law and regulatory compliance for growing businesses.',
  },
] as const
