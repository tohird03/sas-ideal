export interface IAddPaymentParams {
  orderId?: string,
  clientId: string,
  cash: number,
  card: number,
  transfer: number,
  other: number,
}
