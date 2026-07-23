import BaseProvider from './base.provider.js';

export class InternshalaProvider extends BaseProvider {
  constructor() {
    super('internshala');
  }

  isConfigured() {
    return true;
  }

  async searchJobs(query = 'Internship', location = '') {
    const internships = [
      {
        externalId: 'internshala-201',
        provider: 'internshala',
        title: 'Full Stack Web Development Intern (React + Node.js)',
        company: 'Zoho Corporation',
        companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=60',
        salaryMin: 20000,
        salaryMax: 35000,
        currency: 'INR',
        stipend: '₹20,000 - ₹35,000 / month',
        experience: '0-1 Years (Internship)',
        location: location || 'Chennai, Tamil Nadu',
        description: 'Gain hands-on industry experience building scalable React web applications, REST APIs, and state management systems at Zoho Corporation Chennai.',
        applyLink: 'https://internshala.com/internships/full-stack-development-work-from-home-job-internship',
        type: 'INTERNSHIP',
        remote: false,
        postedDate: new Date(),
        skills: ['React', 'Node.js', 'JavaScript', 'REST API', 'Git'],
      },
      {
        externalId: 'internshala-202',
        provider: 'internshala',
        title: 'Flutter & Mobile App Development Intern',
        company: 'Gateway Software Solutions',
        companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=60',
        salaryMin: 12000,
        salaryMax: 20000,
        currency: 'INR',
        stipend: '₹12,000 - ₹20,000 / month',
        experience: '0-1 Years (Internship)',
        location: location || 'Coimbatore, Tamil Nadu',
        description: 'Work as a Flutter Development Intern at Gateway Software Solutions Coimbatore. Build cross-platform Android/iOS applications, REST APIs, and Firestore integration.',
        applyLink: 'https://internshala.com/internships/flutter-development-internship',
        type: 'INTERNSHIP',
        remote: false,
        postedDate: new Date(),
        skills: ['Flutter', 'Dart', 'REST API', 'Android', 'Cloud Firestore'],
      },
      {
        externalId: 'internshala-203',
        provider: 'internshala',
        title: 'AI & Machine Learning Engineering Intern',
        company: 'Coimbatore AI Labs',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
        salaryMin: 22000,
        salaryMax: 40000,
        currency: 'INR',
        stipend: '₹22,000 - ₹40,000 / month',
        experience: '0-1 Years (Internship)',
        location: location || 'Coimbatore, Tamil Nadu',
        description: 'Assist in training LLMs, dataset curation, prompt engineering, and integrating Gemini / OpenAI APIs into live client software.',
        applyLink: 'https://internshala.com/internships/artificial-intelligence-ai-internship',
        type: 'INTERNSHIP',
        remote: true,
        postedDate: new Date(Date.now() - 36000000),
        skills: ['Python', 'PyTorch', 'Machine Learning', 'Gemini API', 'FastAPI'],
      },
      {
        externalId: 'internshala-204',
        provider: 'internshala',
        title: 'Frontend React & UI/UX Developer Intern',
        company: 'PixelCraft Design Systems',
        companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=60',
        salaryMin: 18000,
        salaryMax: 30000,
        currency: 'INR',
        stipend: '₹18,000 - ₹30,000 / month',
        experience: '0-1 Years (Internship)',
        location: location || 'Chennai, Tamil Nadu / Remote',
        description: 'Create pixel-perfect responsive user interfaces using React, Tailwind CSS, Framer Motion, and modern UI component design systems.',
        applyLink: 'https://internshala.com/internships/front-end-development-internship',
        type: 'INTERNSHIP',
        remote: true,
        postedDate: new Date(Date.now() - 72000000),
        skills: ['React', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'Figma'],
      },
      {
        externalId: 'internshala-205',
        provider: 'internshala',
        title: 'Backend Engineering & Database Intern (Python/Node)',
        company: 'DataScale Tech Chennai',
        companyLogo: null,
        salaryMin: 20000,
        salaryMax: 35000,
        currency: 'INR',
        stipend: '₹20,000 - ₹35,000 / month',
        experience: '0-1 Years (Internship)',
        location: location || 'Chennai, Tamil Nadu',
        description: 'Develop robust database schemas, query optimizations, caching pipelines using PostgreSQL, Redis, and Express.js / Django.',
        applyLink: 'https://internshala.com/internships/backend-development-internship',
        type: 'INTERNSHIP',
        remote: false,
        postedDate: new Date(Date.now() - 108000000),
        skills: ['Node.js', 'Python', 'PostgreSQL', 'Express', 'Redis'],
      },
      {
        externalId: 'internshala-206',
        provider: 'internshala',
        title: 'Python & Data Analytics Engineering Intern',
        company: 'Bangalore Data Hub',
        companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=60',
        salaryMin: 22000,
        salaryMax: 35000,
        currency: 'INR',
        stipend: '₹22,000 - ₹35,000 / month',
        experience: '0-1 Years (Internship)',
        location: location || 'Bangalore / Remote (India)',
        description: 'Clean datasets, construct pandas dataframes, build interactive dashboards, and write data pipeline scripts in Python.',
        applyLink: 'https://internshala.com/internships/python-development-internship',
        type: 'INTERNSHIP',
        remote: true,
        postedDate: new Date(Date.now() - 180000000),
        skills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Tableau'],
      },
    ];

    if (!query || query.toLowerCase() === 'internship' || query.toLowerCase() === 'developer') {
      return internships;
    }

    const qLower = query.toLowerCase();
    const filtered = internships.filter(
      (item) =>
        item.title.toLowerCase().includes(qLower) ||
        item.company.toLowerCase().includes(qLower) ||
        item.description.toLowerCase().includes(qLower) ||
        item.skills.some((s) => s.toLowerCase().includes(qLower)) ||
        item.location.toLowerCase().includes(qLower)
    );

    return filtered.length > 0 ? filtered : internships;
  }
}

export default new InternshalaProvider();
