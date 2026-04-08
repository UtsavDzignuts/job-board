export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'candidate' | 'recruiter' | 'admin';
  company_id?: string;
  company_name?: string;
  company_industry?: string;
  company_location?: string;
  company_description?: string;
  company_website?: string;
  applied_job_ids?: string[];
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: 'candidate' | 'recruiter';
  company_name?: string;
  company_industry?: string;
  company_location?: string;
  company_description?: string;
  company_website?: string;
}

export interface UserUpdateData {
  email?: string;
  password?: string;
  full_name?: string;
  company_name?: string;
  company_industry?: string;
  company_location?: string;
  company_description?: string;
  company_website?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company_id: string;
  location: string;
  salary_range: string;
  job_type: string;
  experience_level: string;
  remote: boolean;
  posted_by: string;
  created_at: string;
  updated_at: string;
  company: Company;
  tags: Tag[];
}

export interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  logo_url: string;
  industry: string;
  location: string;
  creator_id: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}
