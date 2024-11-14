export interface IGetPaymentData {
  paymentList: IPayment[];
  count: number;
}

export interface IPayment {
  id: string;
  contactName: string;
  contactPhone: string;
  description: string;
  status: string;
  type: IPaymentRequestType;
}


export interface IPaymentCreate {
  cashboxId: string;
  contactName: string;
  contactPhone: string;
  description: string;
  sum: number;
  type: IPaymentRequestType;
}

export enum IPaymentRequestType {
  Expense = 'expense',
  Incoming = 'incoming',
}
