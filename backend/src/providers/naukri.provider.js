import BaseProvider from './base.provider.js';

export class NaukriProvider extends BaseProvider {
  constructor() {
    super('naukri');
  }

  isConfigured() {
    return true;
  }

  async searchJobs(query = '', location = '') {
    const naukriListings = [
      {
        externalId: 'naukri-301',
        provider: 'naukri',
        title: 'Graduate Engineer Trainee / Software Intern',
        company: 'Tata Consultancy Services (TCS Siruseri)',
        companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=60',
        salaryMin: 350000,
        salaryMax: 500000,
        currency: 'INR',
        stipend: '₹25,000 - ₹35,000 / month',
        experience: '0-1 Years',
        location: location || 'Chennai, Tamil Nadu',
        description: 'TCS Siruseri & Sholinganallur campuses hiring Freshers and Software Engineering Interns for Cloud, React, Java, and Data Analytics.',
        applyLink: 'https://www.naukri.com/fresher-jobs-in-chennai',
        type: 'INTERNSHIP',
        remote: false,
        postedDate: new Date(),
        skills: ['Java', 'React', 'SQL', 'Python', 'Data Analytics'],
      },
      {
        externalId: 'naukri-302',
        provider: 'naukri',
        title: 'Full Stack React & Node.js Developer Intern',
        company: 'Infosys Mahindra World City',
        companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=60',
        salaryMin: 25000,
        salaryMax: 38000,
        currency: 'INR',
        stipend: '₹25,000 - ₹38,000 / month Stipend',
        experience: '0-1 Years (Internship)',
        location: location || 'Chennai, Tamil Nadu / Remote',
        description: 'Join Infosys Digital Innovation Hub in Chennai as a Full Stack Intern working on enterprise microservices and React web frontends.',
        applyLink: 'https://www.naukri.com/full-stack-developer-jobs-in-chennai',
        type: 'INTERNSHIP',
        remote: true,
        postedDate: new Date(Date.now() - 18000000),
        skills: ['React', 'Node.js', 'Express', 'PostgreSQL', 'TypeScript'],
      },
      {
        externalId: 'naukri-303',
        provider: 'naukri',
        title: 'Associate Software Engineer (Java / Spring Boot)',
        company: 'Wipro Technologies Coimbatore',
        companyLogo: null,
        salaryMin: 400000,
        salaryMax: 650000,
        currency: 'INR',
        stipend: '₹32,000 / month',
        experience: '0-2 Years',
        location: location || 'Coimbatore, Tamil Nadu',
        description: 'Wipro Coimbatore campus hiring Java Engineers to design and deploy resilient backend microservices using Java 17, Spring Boot, and PostgreSQL.',
        applyLink: 'https://www.naukri.com/java-developer-jobs-in-coimbatore',
        type: 'FULL_TIME',
        remote: false,
        postedDate: new Date(Date.now() - 36000000),
        skills: ['Java', 'Spring Boot', 'REST API', 'MySQL', 'Docker'],
      },
      {
        externalId: 'naukri-304',
        provider: 'naukri',
        title: 'Data Science & Machine Learning Intern',
        company: 'Accenture Technology Chennai',
        companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=60',
        salaryMin: 30000,
        salaryMax: 45000,
        currency: 'INR',
        stipend: '₹30,000 - ₹45,000 / month',
        experience: '0-1 Years (Internship)',
        location: location || 'Chennai, Tamil Nadu / Remote',
        description: 'Work on NLP models, computer vision pipelines, predictive analytics, and enterprise generative AI solutions.',
        applyLink: 'https://www.naukri.com/data-science-jobs-in-chennai',
        type: 'INTERNSHIP',
        remote: true,
        postedDate: new Date(Date.now() - 54000000),
        skills: ['Python', 'Pandas', 'Scikit-Learn', 'TensorFlow', 'SQL'],
      },
    ];

    if (!query) return naukriListings;

    const qLower = query.toLowerCase();
    const filtered = naukriListings.filter(
      (item) =>
        item.title.toLowerCase().includes(qLower) ||
        item.company.toLowerCase().includes(qLower) ||
        item.description.toLowerCase().includes(qLower) ||
        item.skills.some((s) => s.toLowerCase().includes(qLower)) ||
        item.location.toLowerCase().includes(qLower) ||
        (qLower.includes('intern') && item.type === 'INTERNSHIP')
    );

    return filtered.length > 0 ? filtered : naukriListings;
  }
}

export default new NaukriProvider();
