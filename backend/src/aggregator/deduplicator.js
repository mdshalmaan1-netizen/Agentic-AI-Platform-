export const deduplicateJobs = (jobs = []) => {
  const seen = new Set();
  const result = [];

  for (const job of jobs) {
    const key = `${job.title.toLowerCase().replace(/[^a-z0-9]/g, '')}_${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(job);
    }
  }

  return result;
};

export default deduplicateJobs;
