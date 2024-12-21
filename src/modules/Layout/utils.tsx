import React from 'react';
import { MenuProps } from 'antd';
import { IMenuItems } from './types';
import { IStaff } from '@/stores/profile/types';

export type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem => ({
  label,
  key,
  icon,
  children,
} as MenuItem);

// export const generateAllMenuItems = (list: IMenuItems[] | undefined, staffInfo: IStaff): MenuProps['items'] =>
//   list?.filter(el => !el?.roleKey || staffInfo?.roles?.includes(el?.roleKey!)).map((item) => getItem(
//     <div className="sidebar-links">
//       {item?.label}
//     </div>,
//     item.key,
//     item.icon,
//     item.children && generateAllMenuItems(item.children, staffInfo) || undefined
//   ));
export const generateAllMenuItems = (list: IMenuItems[] | undefined, staff: IStaff): MenuProps['items'] =>
  list
    ?.map((item) => {
      // Check if the current menu item has permission for the staff
      const hasPermission = staff.permissions?.some(per => per.key === item?.roleKey);

      // If there are no children and no permission, skip the item
      if (!item.children && !hasPermission) {
        return null;
      }

      // If there are children, recursively generate the submenus and filter out the ones without permissions
      const filteredChildren = item.children
        ? generateAllMenuItems(item.children, staff)!.filter(subItem => subItem !== null)
        : [];

      if (filteredChildren.length > 0 || hasPermission) {
        return getItem(
          <div className="sidebar-links">{item?.label}</div>,
          item.key,
          item.icon,
          filteredChildren.length > 0 ? filteredChildren : undefined
        );
      }

      return null;
    })
    .filter(item => item !== null) as MenuItem[]; // Remove null values (for items that should not be shown)
