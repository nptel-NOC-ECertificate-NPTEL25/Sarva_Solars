import {
  User,
  Product,
  Project,
  BlogArticle,
  ServiceItem,
  SubsidyDetail,
  Testimonial,
  FAQItem,
  GalleryItem,
  JobOpening,
  AppSettings,
  HeroSlide
} from '../types';

export const defaultSettings: AppSettings = {
  companyName: 'Sarva Solar',
  tagline: 'Empowering Homes & Businesses with Clean Solar Energy',
  phone1: '+91 8985430100',
  phone2: '+91 9160513161',
  email: 'solarsarva@gmail.com',
  address: "SARVA GROUP of Company's, Brodipet 5/15 Guntur Andhra Pradesh pincode:-522002, India",
  whatsappNumber: '918985430100',
  workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
  announcementBarText: '⚡ Govt Subsidy under PM Surya Ghar Scheme up to ₹78,000 available! Book your free site survey today.',
  showAnnouncementBar: true,
  metaTitle: 'Sarva Solar - Leading Solar Energy EPC Solutions in AP, Telangana & WB',
  metaDescription: 'Sarva Solar provides premium residential, commercial & industrial solar rooftop solutions with government subsidy assistance and zero EMI options.',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3829.418294719208!2d80.4328!3d16.3067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a755d55555555%3A0x1111111111111111!2sGuntur%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin'
};

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    badge: 'PM Surya Ghar Govt Subsidy Assistance up to ₹78,000',
    title: 'Green Power, Bright Future. Clean Solar Energy for Every Roof.',
    subtitle: 'Sarva Solar is a premier EPC solar partner across Andhra Pradesh, Telangana & West Bengal. Eliminate electricity bills with Tier-1 bifacial modules & DISCOM net-metering.',
    mediaType: 'image',
    mediaUrl: '/src/assets/images/regenerated_image_1784933875727.jpg',
    ctaPrimaryText: 'Get Free Instant Quote',
    ctaPrimaryAction: 'quote',
    ctaSecondaryText: 'Calculate Solar Savings',
    ctaSecondaryAction: 'calculators',
    order: 1
  },
  {
    id: 'slide-2',
    badge: 'Industrial & Commercial Rooftop Solar EPC',
    title: 'Slash Commercial Electricity Overhead by up to 80%',
    subtitle: 'High-capacity 50kWp to 1MWp solar installations for factories, cold storages, and commercial complexes with accelerated depreciation tax benefits.',
    mediaType: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-solar-panels-on-a-roof-in-a-sunny-day-41318-large.mp4',
    ctaPrimaryText: 'Request Commercial Audit',
    ctaPrimaryAction: 'quote',
    ctaSecondaryText: 'Explore Commercial Projects',
    ctaSecondaryAction: 'projects',
    order: 2
  },
  {
    id: 'slide-3',
    badge: 'Smart Off-Grid & Hybrid Solar Storage',
    title: 'Uninterrupted Power 24/7 with Hybrid Solar Storage',
    subtitle: 'Intelligent lithium battery back-up solutions ensuring continuous zero-interruption solar power for farms, villas, and sensitive medical/IT setups.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1542336391-ae2936d8eff4?auto=format&fit=crop&w=2000&q=80',
    ctaPrimaryText: 'View Solar Packages',
    ctaPrimaryAction: 'products',
    ctaSecondaryText: 'Talk to Solar Engineer',
    ctaSecondaryAction: 'contact',
    order: 3
  }
];

export const defaultSubsidies: SubsidyDetail[] = [
  {
    id: 'sub-1',
    schemeName: 'PM Surya Ghar: Muft Bijli Yojana (1 kW System)',
    capacityRange: '1 kWp',
    centralSubsidyAmount: 30000,
    stateBonusAmount: 0,
    eligibility: [
      'Must be an Indian residential household with valid electricity connection',
      'Roof space must be suitable for solar installation (min 80-100 sq ft shadow-free)',
      'Electricity consumer account registered in applicant name'
    ],
    documents: [
      'Aadhaar Card copy',
      'Recent Electricity Bill (last 3 months)',
      'Roof Ownership Proof / House Tax Receipt',
      'Bank Account passbook / Cancelled Cheque for Direct Benefit Transfer'
    ],
    processSteps: [
      'Register on National Portal for Rooftop Solar (PM Surya Ghar)',
      'Sarva Solar performs site inspection and submits technical feasibility report',
      'Installation of Tier-1 solar modules & net meter by Sarva Solar certified engineers',
      'DISCOM inspection & Net Metering approval',
      'Direct Subsidy Credit into customer bank account within 30 days'
    ],
    updatedDate: '2026-06-01'
  },
  {
    id: 'sub-2',
    schemeName: 'PM Surya Ghar: Muft Bijli Yojana (2 kW System)',
    capacityRange: '2 kWp',
    centralSubsidyAmount: 60000,
    stateBonusAmount: 0,
    eligibility: [
      'Residential house with monthly power consumption 150 - 300 units',
      'Shadow-free rooftop area of minimum 160-200 sq ft'
    ],
    documents: [
      'Aadhaar Card',
      'Latest DISCOM Electricity Bill',
      'Bank Account Passbook / Cancelled Cheque'
    ],
    processSteps: [
      'Online application on PM Surya Ghar portal',
      'Sarva Solar technical team feasibility report',
      'Turnkey installation & safety inspection',
      'Net Meter commissioning by DISCOM',
      'Direct Subsidy Disbursement ₹60,000 to bank account'
    ],
    updatedDate: '2026-06-01'
  },
  {
    id: 'sub-3',
    schemeName: 'PM Surya Ghar: Muft Bijli Yojana (3 kW to 10 kW)',
    capacityRange: '3 kWp - 10 kWp',
    centralSubsidyAmount: 78000,
    stateBonusAmount: 10000,
    eligibility: [
      'Residential homeowners with higher power bill (> 300 units/month)',
      'Min 300 sq ft shadow-free roof area'
    ],
    documents: [
      'Aadhaar Card & PAN Card',
      'Electricity Bill with Service Connection Number',
      'Rooftop clearance certificate'
    ],
    processSteps: [
      'Portal registration & DISCOM approval',
      'EPC execution by Sarva Solar certified installers',
      'Bi-directional Net Metering setup',
      'Subsidy claim generation & Direct Benefit Transfer of ₹78,000'
    ],
    updatedDate: '2026-06-01'
  }
];

export const defaultServices: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Residential Solar Solutions',
    slug: 'residential-solar',
    shortDesc: 'Cut electricity bills by up to 90% with custom rooftop solar plants and government subsidy assistance.',
    fullDesc: 'Transform your home into an independent clean energy generator with Sarva Solar residential rooftop systems.',
    iconName: 'Home',
    benefits: [
      'Save up to ₹60,000 to ₹1,20,000 annually on electricity bills',
      'Up to ₹78,000 direct central government subsidy',
      '25-year linear performance warranty'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      { question: 'How much roof space is required for a 3kW residential solar plant?', answer: 'A 3kW system requires approximately 240-300 sq. ft. of shadow-free rooftop space.' }
    ]
  },
  {
    id: 'srv-2',
    title: 'Commercial & Corporate Solar',
    slug: 'commercial-solar',
    shortDesc: 'Optimize operational expenses for offices, hospitals, schools, and retail with high-ROI solar power.',
    fullDesc: 'Commercial power tariffs in India are among the highest. Sarva Solar commercial EPC projects reduce corporate energy costs dramatically.',
    iconName: 'Building2',
    benefits: [
      'Drastically reduce commercial grid power tariff costs',
      'Avail 40% Accelerated Depreciation tax savings in Year 1'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      { question: 'What is the average ROI for commercial solar plants?', answer: 'Commercial solar plants generally deliver full payback within 2.5 to 3.5 years.' }
    ]
  }
];

export const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Sarva Ultra BIFACIAL 550W Mono PERC Panel',
    category: 'Solar Panels',
    brand: 'Sarva Solar / Tier 1 OEM',
    price: 14500,
    rating: 4.9,
    specs: {
      'Wattage': '550W',
      'Cell Type': 'N-Type Bifacial Mono PERC',
      'Efficiency': '22.8%'
    },
    description: 'Generates up to 25% extra electricity from rear-side light reflections. Engineered for high performance.',
    warranty: '12 Years Product Warranty, 30 Years Linear Power Output Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    inventory: 250
  },
  {
    id: 'prod-2',
    name: 'Sarva High-Yield 540W Mono PERC Module',
    category: 'Solar Panels',
    brand: 'Sarva Solar / Goldi',
    price: 13200,
    rating: 4.8,
    specs: {
      'Wattage': '540W',
      'Cell Type': 'Half-Cut Monocrystalline',
      'Efficiency': '21.5%'
    },
    description: 'High-density half-cut design reduces internal resistance loss.',
    warranty: '10 Years Product, 25 Years Performance Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    inventory: 180
  },
  {
    id: 'prod-3',
    name: 'Sarva Hybrid Smart Inverter 5kVA MPPT',
    category: 'Inverters',
    brand: 'Sarva Solar / Havells OEM',
    price: 48500,
    rating: 4.9,
    specs: {
      'Capacity': '5 kW / 5 kVA',
      'Efficiency': '98.2%'
    },
    description: 'Dual MPPT hybrid string inverter capable of managing grid feed-in and battery storage.',
    warranty: '5 Years Manufacturer Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    inventory: 65
  }
];

export const defaultProjects: Project[] = [
  {
    id: 'proj-1',
    title: '15 kWp Luxury Residential Villa Solar Rooftop',
    category: 'Residential',
    location: 'Brodipet, Guntur',
    state: 'Andhra Pradesh',
    capacityKw: 15,
    annualSavingsRs: 185000,
    completionDate: '2026-03-15',
    status: 'Completed',
    images: [
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Custom elevated structural design allowing full rooftop usage below the panels.',
    clientReview: {
      author: 'Dr. K. S. Rao',
      comment: 'Sarva Solar team completed the installation in just 2 days. Electricity bill dropped from ₹18,000 to zero!',
      rating: 5
    }
  },
  {
    id: 'proj-2',
    title: '120 kWp Commercial Spinning Mill Rooftop',
    category: 'Commercial',
    location: 'Vijayawada Highway',
    state: 'Andhra Pradesh',
    capacityKw: 120,
    annualSavingsRs: 1420000,
    completionDate: '2026-01-20',
    status: 'Completed',
    images: [
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Turnkey industrial EPC on standing seam metal roof.',
    clientReview: {
      author: 'P. V. Ramana (MD)',
      comment: 'Top-class engineering! High savings from year one.',
      rating: 5
    }
  }
];

export const defaultBlogs: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'How to Claim Up to ₹78,000 Subsidy Under PM Surya Ghar Muft Bijli Yojana in 2026',
    slug: 'claim-pm-surya-ghar-subsidy-2026',
    category: 'Government Subsidy',
    author: 'Sarva Solar Technical Team',
    publishedAt: '2026-06-15',
    readTime: '5 min read',
    excerpt: 'A comprehensive step-by-step guide on eligibility, required documents, and applying for Central Govt solar rooftop subsidies.',
    content: 'PM Surya Ghar scheme provides direct subsidy credit up to ₹78,000 for 3kW to 10kW residential rooftop systems.',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
    tags: ['PM Surya Ghar', 'Solar Subsidy', 'Rooftop Solar'],
    isPublished: true
  }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: 't-1',
    customerName: 'K. Srinivasa Rao',
    location: 'Guntur, Andhra Pradesh',
    systemSizeKw: 5,
    rating: 5,
    comment: 'Sarva Solar installed a 5kW system on my home rooftop. Electricity bill is down from ₹6,500 to zero!',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    savedPerYear: '₹72,000 / year'
  }
];

export const defaultFaqs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How much can I save on electricity bills with rooftop solar?',
    answer: 'Rooftop solar reduces residential electricity bills by 80% to 90%.',
    category: 'General'
  }
];

export const defaultGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: '5kW Residential Net-Meter Installation',
    category: 'Residential',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
    caption: 'Brodipet Guntur'
  }
];

export const defaultJobs: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Solar Sales Manager',
    department: 'Sales & Business Development',
    location: 'Guntur / Vijayawada',
    type: 'Full-time',
    exp: '2-4 years in solar / electrical sales',
    desc: 'Drive rooftop solar sales for residential & commercial clients across AP.',
    isActive: true,
    postedDate: '2026-06-01'
  }
];

export const defaultUsers: User[] = [
  {
    id: 'usr-0',
    name: 'Sarva Solar Admin',
    email: 'sarvasolars@gmail.com',
    role: 'Admin',
    phone: '+91 8985430100',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];
