import { Job, Company, SuccessMetric, TalentHighlight } from './types';

export const COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'Nebula Systems',
    logo: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=128&h=128&fit=crop',
    description: 'Pioneering decentralized AI networks for the next generation of computing.',
    industry: 'Cloud Computing & AI',
    employees: '500-1000',
    headquarters: 'San Francisco, CA',
    website: 'nebula.ai',
    milestones: [
      { year: '2022', event: 'Series B funding of $50M' },
      { year: '2023', event: 'Launched Nebula Core' },
      { year: '2024', event: 'Reached 1M active nodes' }
    ]
  },
  {
    id: 'c2',
    name: 'EcoFlow',
    logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=128&h=128&fit=crop',
    description: 'Sustainable energy solutions powered by predictive smart grids.',
    industry: 'Renewable Energy',
    employees: '200-500',
    headquarters: 'Berlin, Germany',
    website: 'ecoflow.io',
    milestones: [
      { year: '2021', event: 'Founded in Berlin' },
      { year: '2023', event: 'Partnership with 5 European cities' }
    ]
  },
  {
    id: 'c3',
    name: 'Lumina Design',
    logo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bde3?w=128&h=128&fit=crop',
    description: 'Digital agency creating emotionally resonant brand experiences.',
    industry: 'Design & Creative',
    employees: '50-100',
    headquarters: 'Austin, TX',
    website: 'lumina.design',
    milestones: [
      { year: '2024', event: 'Agency of the Year Finalist' }
    ]
  }
];

export const JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior AI Engineer',
    companyId: 'c1',
    location: 'Remote',
    type: 'Full-time',
    salary: '$180k - $240k',
    description: 'We are looking for an AI engineer to lead our distributed model training initiatives.',
    postedAt: '2 days ago',
    category: 'Engineering',
    aiMatchScore: 98
  },
  {
    id: 'j2',
    title: 'Sustainability Consultant',
    companyId: 'c2',
    location: 'Berlin, Germany',
    type: 'Contract',
    salary: '€80k - €100k',
    description: 'Help our clients transition to green energy using data-driven insights.',
    postedAt: '1 week ago',
    category: 'Consulting',
    aiMatchScore: 85
  },
  {
    id: 'j3',
    title: 'Creative Director',
    companyId: 'c3',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$140k - $190k',
    description: 'Lead a team of multidisciplinary designers to push the boundaries of digital brand identity.',
    postedAt: '3 days ago',
    category: 'Design',
    aiMatchScore: 92
  },
  {
    id: 'j4',
    title: 'Frontend Architect',
    companyId: 'c1',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$160k - $210k',
    description: 'Expert in React and performance optimization for complex AI dashboards.',
    postedAt: '5 days ago',
    category: 'Engineering',
    aiMatchScore: 78
  }
];

export const SUCCESS_METRICS: SuccessMetric[] = [
  { label: 'Successful Placements', value: '12,500', suffix: '+' },
  { label: 'Partner Companies', value: '450', suffix: '' },
  { label: 'Avg. Salary Increase', value: '32', suffix: '%' },
  { label: 'Happy Talents', value: '50', suffix: 'k+' }
];

export const TALENT_HIGHLIGHTS: TalentHighlight[] = [
  {
    name: 'Sarah Jenkins',
    role: 'Lead Designer @ EcoFlow',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop',
    quote: 'HireAI matched me with a role that perfectly aligned with my values and technical skills.'
  },
  {
    name: 'Marcus Chen',
    role: 'ML Engineer @ Nebula',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop',
    quote: 'The AI matching score was surprisingly accurate. Best job hunt experience I\'ve ever had.'
  }
];
