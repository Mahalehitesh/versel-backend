export type TermStatus = 'PAST' | 'CURRENT' | 'FUTURE';

export interface Term {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: TermStatus;
}

export interface TermRequest {
  name: string;
  startDate: string;
  endDate: string;
}
