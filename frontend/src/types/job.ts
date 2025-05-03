export interface Job {
  id: string;
  title: string;
  company: string;
  type: string;
  salary: string;
  nextInterview?: string;
}

export interface Interview {
  id: string;
  jobId: string;
  company: string;
  position: string;
  time: string;
  duration: string;
  round: string;
  status: 'confirmed' | 'pending';
} 