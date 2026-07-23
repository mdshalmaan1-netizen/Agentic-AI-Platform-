import prisma from '../../config/database.js';

// In-memory fallback store for development sessions
const memoryApplications = [
  {
    id: 'app_101',
    jobId: 'internshala-201',
    userId: 'user_default',
    role: 'Full Stack Web Development Intern (React + Node.js)',
    company: 'Zoho Corporation',
    location: 'Chennai, Tamil Nadu',
    salary: '₹20,000 - ₹35,000 / month',
    status: 'In Review',
    match: 98,
    appliedOn: 'Today',
    timeline: [
      { step: 'Application Submitted', date: 'Today', done: true },
      { step: 'HR Screening & AI Match', date: 'Today', done: true },
      { step: 'Technical Interview', date: 'Upcoming', done: false },
      { step: 'Final Offer', date: 'Pending', done: false },
    ],
  },
  {
    id: 'app_102',
    jobId: 'naukri-301',
    userId: 'user_default',
    role: 'Graduate Engineer Trainee / Software Intern',
    company: 'Tata Consultancy Services (TCS Siruseri)',
    location: 'Chennai, Tamil Nadu',
    salary: '₹25,000 - ₹35,000 / month',
    status: 'Interview',
    match: 92,
    appliedOn: '2 Days Ago',
    timeline: [
      { step: 'Application Submitted', date: '2 Days Ago', done: true },
      { step: 'HR Screening & AI Match', date: 'Yesterday', done: true },
      { step: 'Technical Interview Scheduled', date: 'Tomorrow at 2:00 PM', done: true },
      { step: 'Final Offer', date: 'Pending', done: false },
    ],
  },
  {
    id: 'app_103',
    jobId: 'foundit-402',
    userId: 'user_default',
    role: 'Python AI & Data Analytics Trainee',
    company: 'Freshworks India',
    location: 'Chennai, Tamil Nadu / Remote',
    salary: '₹30,000 - ₹45,000 / month',
    status: 'Shortlisted',
    match: 89,
    appliedOn: '5 Days Ago',
    timeline: [
      { step: 'Application Submitted', date: '5 Days Ago', done: true },
      { step: 'Resume Shortlisted', date: '3 Days Ago', done: true },
      { step: 'Assessment Completed', date: 'Yesterday', done: true },
      { step: 'Final Interview', date: 'Upcoming', done: false },
    ],
  },
  {
    id: 'app_104',
    jobId: 'internshala-202',
    userId: 'user_default',
    role: 'Flutter & Mobile App Development Intern',
    company: 'Gateway Software Solutions',
    location: 'Coimbatore, Tamil Nadu',
    salary: '₹12,000 - ₹20,000 / month',
    status: 'Applied',
    match: 95,
    appliedOn: '1 Week Ago',
    timeline: [
      { step: 'Application Submitted', date: '1 Week Ago', done: true },
      { step: 'Under Review', date: 'Pending', done: false },
    ],
  },
];

export class ApplicationsRepository {
  static async findByUserId(userId) {
    try {
      if (prisma && prisma.application) {
        const dbApps = await prisma.application.findMany({
          where: { userId },
          include: { job: true },
          orderBy: { updatedAt: 'desc' },
        });
        if (dbApps && dbApps.length > 0) return dbApps;
      }
    } catch (err) {
      console.warn('Prisma DB query fallback to memory applications:', err.message);
    }
    return memoryApplications;
  }

  static async createApplication(payload) {
    const { userId = 'user_default', jobId, role, company, location, salary, match } = payload;
    
    // Check if already exists in memory
    const existing = memoryApplications.find((a) => a.jobId === jobId || a.role === role);
    if (existing) {
      existing.status = 'Applied';
      existing.appliedOn = 'Just Now';
      return existing;
    }

    const newApp = {
      id: `app_${Date.now()}`,
      jobId: jobId || `job_${Date.now()}`,
      userId,
      role: role || 'Software Developer Intern',
      company: company || 'Tech Employer',
      location: location || 'Remote',
      salary: salary || 'Competitive',
      status: 'Applied',
      match: match || 85,
      appliedOn: 'Just Now',
      timeline: [
        { step: 'Application Submitted', date: 'Just Now', done: true },
        { step: 'HR & AI Review', date: 'In Progress', done: false },
        { step: 'Interview Round', date: 'Pending', done: false },
        { step: 'Offer Decision', date: 'Pending', done: false },
      ],
    };

    memoryApplications.unshift(newApp);

    try {
      if (prisma && prisma.application && jobId) {
        await prisma.application.upsert({
          where: { userId_jobId: { userId, jobId } },
          update: { status: 'APPLIED' },
          create: { userId, jobId, status: 'APPLIED' },
        });
      }
    } catch (e) {
      // Ignored for fallback
    }

    return newApp;
  }

  static async updateStatus(id, status) {
    const app = memoryApplications.find((a) => a.id === id || a.jobId === id);
    if (app) {
      app.status = status;
    }
    return app;
  }
}

export default ApplicationsRepository;
