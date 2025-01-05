export type ContactMutation = {
  id?: string;
  first?: string;
  last?: string;
  avatar?: string;
  avatar2?: File;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
  id: string;
  createdAt: string;
};
