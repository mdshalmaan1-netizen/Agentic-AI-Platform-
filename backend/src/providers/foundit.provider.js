import BaseProvider from './base.provider.js';

export class FounditProvider extends BaseProvider {
  constructor() {
    super('foundit');
  }

  isConfigured() {
    return true;
  }

  async searchJobs(query = '', location = '') {
    const founditingsings = [
      {
        externalId: 'foundit-401',
        provider: 'foundit',
        title: 'Full Stack React & Node.js Engineer / Intern',
        company: 'Zoho Corporation',
        companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=60',
        salaryMin: 450000,
        salaryMax: 800000,
        currency: 'INR',
        stipend: '₹35,000 / month Stipend',
        experience: '0-1 Years',
        location: location || 'Chennai, Tamil Nadu',
        description: 'Zoho is hiring Software Development Interns and Freshers in Chennai to build SaaS applications, microservices, and React components.',
        applyLink: 'https://www.foundit.in/job/zoho-full-stack-react-node-js-engineer-intern-chennai-401',
        type: 'INTERNSHIP',
        remote: false,
        postedDate: new Date(),
        skills: ['React', 'Node.js', 'Java', 'PostgreSQL', 'JavaScript'],
      },
      {
        externalId: 'foundit-402',
        provider: 'foundit',
        title: 'Python AI & Data Analytics Trainee',
        company: 'Freshworks India',
        companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=60',
        salaryMin: 30000,
        salaryMax: 45000,
        currency: 'INR',
        stipend: '₹30,000 - ₹45,000 / month',
        experience: '0-1 Years (Internship)',
        location: location || 'Chennai, Tamil Nadu / Remote',
        description: 'Join Freshworks AI team in Chennai to build predictive analytics models, conversational AI bots, and data processing scripts.',
        applyLink: 'https://www.foundit.in/job/freshworks-python-ai-data-analytics-trainee-chennai-402',
        type: 'INTERNSHIP',
        remote: true,
        postedDate: new Date(Date.now() - 14400000),
        skills: ['Python', 'FastAPI', 'Pandas', 'SQL', 'Gemini API'],
      },
      {
        externalId: 'foundit-403',
        provider: 'foundit',
        title: 'Junior Software Engineer (Web & Cloud)',
        company: 'Cognizant Technology Solutions',
        companyLogo: null,
        salaryMin: 400000,
        salaryMax: 650000,
        currency: 'INR',
        stipend: '₹30,000 / month',
        experience: '0-2 Years',
        location: location || 'Coimbatore, Tamil Nadu',
        description: 'Cognizant Coimbatore campus is hiring Entry Level Engineers for Web Development, AWS Cloud, and DevOps automation.',
        applyLink: 'https://www.foundit.in/job/cognizant-junior-software-engineer-coimbatore-403',
        type: 'FULL_TIME',
        remote: false,
        postedDate: new Date(Date.now() - 28800000),
        skills: ['React', 'Java', 'AWS', 'Spring Boot', 'MySQL'],
      },
      {
        externalId: 'foundit-404',
        provider: 'foundit',
        title: 'Frontend React Developer Intern',
        company: 'Payoda Technologies',
        companyLogo: null,
        salaryMin: 18000,
        salaryMax: 28000,
        currency: 'INR',
        stipend: '₹18,000 - ₹28,000 / month',
        experience: '0-1 Years (Internship)',
        location: location || 'Coimbatore, Tamil Nadu',
        description: 'Develop modern responsive web applications using React 18, Redux Toolkit, Tailwind CSS, and REST API integration.',
        applyLink: 'https://www.foundit.in/job/payoda-frontend-react-developer-intern-coimbatore-404',
        type: 'INTERNSHIP',
        remote: false,
        postedDate: new Date(Date.now() - 43200000),
        skills: ['React', 'Tailwind CSS', 'JavaScript', 'HTML5', 'Git'],
      },
    ];

    if (!query) return founditingsings;

    const qLower = query.toLowerCase();
    const filtered = founditingsings.filter(
      (item) =>
        item.title.toLowerCase().includes(qLower) ||
        item.company.toLowerCase().includes(qLower) ||
        item.description.toLowerCase().includes(qLower) ||
        item.skills.some((s) => s.toLowerCase().includes(qLower)) ||
        (qLower.includes('intern') && item.type === 'INTERNSHIP')
    );

    return filtered.length > 0 ? filtered : founditingsings;
  }
}

export default new FounditProvider();
