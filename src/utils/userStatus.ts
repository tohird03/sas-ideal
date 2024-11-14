export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  NEW = 'NEW',
}

export const userStatusList = [
  UserStatus.NEW,
  UserStatus.ACTIVE,
  UserStatus.BLOCKED,
];

export enum UserGenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export const userGenderTypeList = [
  UserGenderType.MALE,
  UserGenderType.FEMALE,
];

export enum PayedModuleStatus {
  ALL = 'ALL',
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}
