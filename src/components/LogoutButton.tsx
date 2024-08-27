"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { DropdownMenuItem } from "./ui/dropdown-menu";

const LogoutButton = () => {
  return (
    <LogoutLink className="!cursor-pointer">
      <DropdownMenuItem className="cursor-pointer">Logout</DropdownMenuItem>
    </LogoutLink>
  );
};
export default LogoutButton;
