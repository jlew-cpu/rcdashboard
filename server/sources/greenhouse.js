// server/sources/greenhouse.js
// Greenhouse Harvest API data source.
// Env vars: GREENHOUSE_API_KEY

const STUB = {
  kpis: [
    { label: 'Open roles', value: '23', note: 'across 5 functions', warn: false },
  ],
};

export async function fetchGreenhouse() {
  const key = process.env.GREENHOUSE_API_KEY;
  if (!key) {
    return STUB;
  }

  try {
    const token = Buffer.from(`${key}:`).toString('base64');
    // Fetch all open jobs (paginate if needed; first page covers most orgs)
    const res = await fetch('https://harvest.greenhouse.io/v1/jobs?status=open&per_page=500', {
      headers: { Authorization: `Basic ${token}` },
    });
    if (!res.ok) {
      throw new Error(`Greenhouse API responded ${res.status}: ${await res.text()}`);
    }
    const jobs = await res.json();
    const count = Array.isArray(jobs) ? jobs.length : 0;

    // Derive function count from departments
    const deptSet = new Set();
    if (Array.isArray(jobs)) {
      for (const job of jobs) {
        if (job.departments?.length) {
          for (const d of job.departments) {
            deptSet.add(d.name);
          }
        }
      }
    }
    const fnCount = deptSet.size || 5;

    return {
      kpis: [
        { label: 'Open roles', value: String(count), note: `across ${fnCount} functions`, warn: false },
      ],
    };
  } catch (err) {
    console.warn('[greenhouse] fetch failed, using stub:', err.message);
    return STUB;
  }
}
