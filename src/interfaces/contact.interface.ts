export interface IContact {
  email?: string;
  id: string | number;
  phoneNumber?: string;
  linkedId?: string | number;
  linkPrecedence: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
