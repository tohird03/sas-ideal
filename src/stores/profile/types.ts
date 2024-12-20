import { ISeller } from "@/api/clients";

export interface IStaff extends ISeller {
  permissions: string[];
}

export type ChangePasswordFormType = {
  currentPassword: string;
  newPassword: string;
};
