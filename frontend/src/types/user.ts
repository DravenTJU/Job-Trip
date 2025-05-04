export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  preferences?: {
    theme: string;
    notifications: boolean;
    language: string;
  };
  status: string;
} 