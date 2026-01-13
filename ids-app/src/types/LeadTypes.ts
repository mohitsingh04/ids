export interface LeadProps extends Record<string, unknown> {
  name: string;
  email: string;
  mobile_no: string;
  status: string;
  createdAt: string;
  overallLeadScore: string;
}
