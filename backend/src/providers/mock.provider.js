import BaseProvider from './base.provider.js';

export class MockProvider extends BaseProvider {
  constructor() {
    super('mock');
  }

  async searchJobs(query = 'Developer', location = 'Remote') {
    const jobs = [
      {
        externalId: 'mock-101',
        provider: 'mock',
        title: 'Senior Full Stack Engineer (React + Node)',
        company: 'CloudScale Innovations',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
        salaryMin: 120000,
        salaryMax: 150000,
        currency: 'USD',
        experience: '3-5 Years',
        location: location || 'Remote / San Francisco',
        description: 'We are seeking an ambitious Full Stack Engineer to lead our multi-agent AI architecture team.',
        applyLink: 'https://example.com/careers/fullstack-engineer',
        type: 'FULL_TIME',
        remote: true,
        postedDate: new Date(),
        skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'TypeScript'],
      },
      {
        externalId: 'mock-102',
        provider: 'mock',
        title: 'AI Solutions & Frontend Architect',
        company: 'NextGen AI Labs',
        companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=60',
        salaryMin: 130000,
        salaryMax: 170000,
        currency: 'USD',
        experience: '4+ Years',
        location: 'Remote',
        description: 'Architect next-generation user interfaces leveraging Gemini LLM capabilities and responsive React applications.',
        applyLink: 'https://example.com/careers/ai-architect',
        type: 'FULL_TIME',
        remote: true,
        postedDate: new Date(Date.now() - 86400000),
        skills: ['React', 'Gemini API', 'Tailwind CSS', 'Redux', 'GraphQL'],
      },
      {
        externalId: 'mock-103',
        provider: 'mock',
        title: 'Backend API Developer (Node.js & Prisma)',
        company: 'DataPulse Corp',
        companyLogo: null,
        salaryMin: 100000,
        salaryMax: 130000,
        currency: 'USD',
        experience: '2-4 Years',
        location: 'New York, NY',
        description: 'Build high-throughput REST APIs and Redis-cached database models using Node.js and Express.',
        applyLink: 'https://example.com/careers/backend-dev',
        type: 'FULL_TIME',
        remote: false,
        postedDate: new Date(Date.now() - 172800000),
        skills: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Redis'],
      },
      {
        externalId: 'mock-104',
        provider: 'mock',
        title: 'Software Development & AI Intern',
        company: 'Global AI Ventures',
        companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=60',
        salaryMin: 20000,
        salaryMax: 35000,
        currency: 'INR',
        stipend: '₹20,000 - ₹35,000 / month',
        experience: '0-1 Years (Internship)',
        location: 'Remote / Bangalore',
        description: 'Work alongside senior engineers to develop intelligent search agents and build full stack web applications.',
        applyLink: 'https://internshala.com/internships/software-development-internship',
        type: 'INTERNSHIP',
        remote: true,
        postedDate: new Date(),
        skills: ['React', 'Python', 'Node.js', 'AI Agents'],
      },
    ];

    if (/intern/i.test(query)) {
      return jobs.filter((j) => j.type === 'INTERNSHIP' || /intern/i.test(j.title));
    }

    return jobs;
  }
}

export default new MockProvider();
