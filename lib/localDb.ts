import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'mock_db.json');

// Ensure the data directory and db file exist
function initDb() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function getApplicants(): any[] {
  initDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mock_db.json:', error);
    return [];
  }
}

export function saveApplicant(applicant: any) {
  const applicants = getApplicants();
  applicants.push(applicant);
  fs.writeFileSync(DB_FILE, JSON.stringify(applicants, null, 2), 'utf-8');
}

export function updateApplicant(id: string, updates: any) {
  const applicants = getApplicants();
  const index = applicants.findIndex((a: any) => a.id === id);
  if (index !== -1) {
    applicants[index] = { ...applicants[index], ...updates };
    fs.writeFileSync(DB_FILE, JSON.stringify(applicants, null, 2), 'utf-8');
    return applicants[index];
  }
  return null;
}

export function deleteApplicant(id: string) {
  const applicants = getApplicants();
  const filtered = applicants.filter((a: any) => a.id !== id);
  fs.writeFileSync(DB_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
}
