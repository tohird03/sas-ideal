export enum PaymentTypes {
  Cash = 'CASH',
  Payme = 'PAYME',
  Click = 'CLICK',
  Apelsin = 'APELSIN',
  FREE = 'Tekin',
  CONTRACT = 'Kontrakt',
  Payze = 'Payze',
  SUPER_FREE = 'Super Free',
}

export const paymentTypeList = [
  '',
  PaymentTypes.Cash,
  PaymentTypes.Payme,
  PaymentTypes.Click,
  PaymentTypes.Apelsin,
  PaymentTypes.FREE,
  PaymentTypes.CONTRACT,
  PaymentTypes.Payze,
  PaymentTypes.SUPER_FREE,

];

export enum PaymentStatus {
  DELETED = 'DELETED',
  NEW = 'NEW',
  PAID = 'PAID',
  ERROR = 'ERROR',
  CANCEL = 'CANCEL',
}

export const paymentStatusList = [
  PaymentStatus.DELETED,
  PaymentStatus.NEW,
  PaymentStatus.PAID,
  PaymentStatus.ERROR,
  PaymentStatus.CANCEL,
];

enum PayedModuleStatus {
  PAID = 'PAID',
  BLOCKED='BLOCKED',
  CANCEL= 'CANCEL',
  EXPIRED = 'EXPIRED',
  FREE = 'FREE',
  INACTIVE = 'INACTIVE',
}

export const paymentModuleStatus = [
  '',
  PayedModuleStatus.PAID,
  PayedModuleStatus.BLOCKED,
  PayedModuleStatus.CANCEL,
  PayedModuleStatus.EXPIRED,
  PayedModuleStatus.FREE,
  PayedModuleStatus.INACTIVE,
];
