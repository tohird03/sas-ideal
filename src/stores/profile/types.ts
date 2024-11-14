export interface IStaff {
  username: string;
  phone: string;
  roles: string[];
}

export type ChangePasswordFormType = {
  currentPassword: string;
  newPassword: string;
};

export type ProfileFormType = {
  username: IStaff['username'];
  phone: IStaff['phone'];
};
