export type QuoteStatus = 'draft' | 'submitted' | 'reviewed' | 'responded';

export interface QuoteItem {
  productId: string;
  productName: string;
  quantity: number;
  notes?: string;
}

export interface QuoteRequest {
  items: QuoteItem[];
  company: {
    name: string;
    sector: string;
    contactPerson: string;
    role: string;
    phone: string;
    email: string;
  };
  requirements: {
    timeline?: string;
    installation?: boolean;
    notes?: string;
  };
  status: QuoteStatus;
}
