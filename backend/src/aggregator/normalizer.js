export const normalizeJob = (rawJob) => {
  return {
    externalId: String(rawJob.externalId || rawJob.id || Math.random()),
    provider: rawJob.provider || 'generic',
    title: rawJob.title ? rawJob.title.trim() : 'Software Developer',
    company: rawJob.company ? rawJob.company.trim() : 'Tech Employer',
    companyLogo: rawJob.companyLogo || null,
    salaryMin: rawJob.salaryMin || null,
    salaryMax: rawJob.salaryMax || null,
    currency: rawJob.currency || 'USD',
    experience: rawJob.experience || 'Flexible',
    location: rawJob.location || 'Remote',
    skills: Array.isArray(rawJob.skills) ? rawJob.skills : ['Software'],
    description: rawJob.description || '',
    applyLink: rawJob.applyLink || 'https://google.com',
    type: rawJob.type || 'FULL_TIME',
    remote: !!rawJob.remote,
    postedDate: rawJob.postedDate ? new Date(rawJob.postedDate) : new Date(),
  };
};

export default normalizeJob;
