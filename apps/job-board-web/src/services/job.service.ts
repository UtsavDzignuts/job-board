import apiClient from '../lib/api-client';
import { Job, PaginatedResponse, Tag, Company } from '../types';

export const jobService = {
  async getJobs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    job_type?: string;
    location?: string;
    remote?: boolean;
    experience_level?: string;
    company_id?: string;
    tag?: string;
  }): Promise<PaginatedResponse<Job>> {
    const { data } = await apiClient.get<PaginatedResponse<Job>>('/jobs', {
      params,
    });
    return data;
  },

  async applyToJob(id: string): Promise<any> {
    const { data } = await apiClient.post(`/jobs/${id}/apply`);
    return data;
  },

  async getMyApplications(): Promise<any[]> {
    const { data } = await apiClient.get('/jobs/applications/me');
    return data;
  },

  async getRecruiterApplications(): Promise<any[]> {
    const { data } = await apiClient.get('/jobs/applications/recruiter');
    return data;
  },

  async updateApplicationStatus(id: string, status: string): Promise<any> {
    const { data } = await apiClient.patch(`/jobs/applications/${id}/status`, {
      status,
    });
    return data;
  },

  async getMyApplicationForJob(jobId: string): Promise<any> {
    const { data } = await apiClient.get(`/jobs/${jobId}/my-application`);
    return data;
  },

  async getJobById(id: string): Promise<Job> {
    const { data } = await apiClient.get<Job>(`/jobs/${id}`);
    return data;
  },

  async createJob(jobData: Partial<Job>): Promise<Job> {
    const { data } = await apiClient.post<Job>('/jobs', jobData);
    return data;
  },

  async getTags(): Promise<Tag[]> {
    const { data } = await apiClient.get<Tag[]>('/tags');
    return data;
  },

  async getCompanies(): Promise<Company[]> {
    const { data } = await apiClient.get<Company[]>('/companies');
    return data;
  },

  async getCompanyById(id: string): Promise<Company> {
    const { data } = await apiClient.get<Company>(`/companies/${id}`);
    return data;
  },

  async createCompany(companyData: Partial<Company>): Promise<Company> {
    const { data } = await apiClient.post<Company>('/companies', companyData);
    return data;
  },
};
