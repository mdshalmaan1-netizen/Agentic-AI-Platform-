// ------------------------------------------------------------------
// Real Active Hackathons & Platform Data
// ------------------------------------------------------------------

export const realHackathons = [
  {
    id: 'h_devpost_01',
    name: 'Google Cloud & Gemini AI Hackathon',
    organizer: 'Google Cloud & Devpost',
    prizePool: '$50,000 USD',
    dateRange: 'Active Registration — Closes Next Month',
    location: 'Global (Online)',
    teamSize: '1-4 Members',
    status: 'ongoing',
    banner: 'from-emerald-600 to-teal-800',
    link: 'https://googlecloud.devpost.com/',
    platform: 'Devpost',
  },
  {
    id: 'h_sih_02',
    name: 'Smart India Hackathon (SIH)',
    organizer: 'Ministry of Education & AICTE',
    prizePool: '₹1,00,000 Per Problem Statement',
    dateRange: 'Open for Registration',
    location: 'Hybrid / India',
    teamSize: '6 Members',
    status: 'upcoming',
    banner: 'from-forest-500 to-forest-800',
    link: 'https://sih.gov.in/',
    platform: 'SIH Portal',
  },
  {
    id: 'h_unstop_03',
    name: 'Unstop National Tech Innovation Challenge',
    organizer: 'Unstop & Fortune 500 Partners',
    prizePool: '₹5,00,000 + Pre-Placement Offers',
    dateRange: 'Registrations Open',
    location: 'Online',
    teamSize: '1-3 Members',
    status: 'ongoing',
    banner: 'from-cyan-600 to-blue-800',
    link: 'https://unstop.com/hackathons',
    platform: 'Unstop',
  },
  {
    id: 'h_devfolio_04',
    name: 'ETHGlobal & Devfolio Hackathon',
    organizer: 'Devfolio Buidlers Community',
    prizePool: '$30,000 USD',
    dateRange: 'Upcoming Registration Window',
    location: 'Online',
    teamSize: '1-4 Members',
    status: 'upcoming',
    banner: 'from-indigo-600 to-purple-800',
    link: 'https://devfolio.co/hackathons',
    platform: 'Devfolio',
  },
  {
    id: 'h_mlh_05',
    name: 'MLH Global Hack Week 2026',
    organizer: 'Major League Hacking (MLH)',
    prizePool: '$15,000 + Mentorship & Swag',
    dateRange: 'Active Now',
    location: 'Global (Online)',
    teamSize: 'Individual or Teams',
    status: 'ongoing',
    banner: 'from-amber-500 to-orange-700',
    link: 'https://mlh.io/seasons/2026/events',
    platform: 'MLH',
  },
  {
    id: 'h_kaggle_06',
    name: 'Kaggle Machine Learning Grand Challenge',
    organizer: 'Kaggle & Google Research',
    prizePool: '$100,000 USD',
    dateRange: 'Active Competition',
    location: 'Online',
    teamSize: '1-5 Members',
    status: 'ongoing',
    banner: 'from-blue-600 to-indigo-900',
    link: 'https://www.kaggle.com/competitions',
    platform: 'Kaggle',
  },
]

export const currentUser = {
  id: 'u_001',
  name: 'Candidate Professional',
  email: 'candidate@agentic-ai.com',
  location: 'Remote',
  avatar: 'https://ui-avatars.com/api/?name=Candidate+User&background=0D9488&color=fff',
  title: 'Full Stack Engineer',
  bio: 'Passionate developer dedicated to building AI-driven web applications.',
  skills: ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'TypeScript', 'Tailwind CSS'],
  education: {
    degree: 'B.Tech in Computer Science & AI',
    school: 'Tech Institute',
    years: '2020 - 2024',
    cgpa: '8.8',
  },
  socials: { linkedin: '#', github: '#', twitter: '#' },
  profileStrength: 85,
  resume: { fileName: 'candidate_resume.pdf', uploadedOn: 'Recent' },
}

export const hackathons = realHackathons

export const applications = [
  { id: 'ap1', role: 'Frontend Developer', company: 'TechCorp', status: 'In Review', appliedOn: '20 May 2025' },
  { id: 'ap2', role: 'AI Engineer', company: 'InnovateAI', status: 'Interview', appliedOn: '18 May 2025' },
  { id: 'ap3', role: 'Data Analyst', company: 'DataSense', status: 'Shortlisted', appliedOn: '15 May 2025' },
  { id: 'ap4', role: 'Product Manager', company: 'GrowthX', status: 'Applied', appliedOn: '10 May 2025' },
  { id: 'ap5', role: 'Backend Developer', company: 'CodeCraft', status: 'Rejected', appliedOn: '05 May 2025' },
]

export const applicationStats = {
  applied: 32,
  inReview: 12,
  interview: 5,
  shortlisted: 3,
  rejected: 7,
}
