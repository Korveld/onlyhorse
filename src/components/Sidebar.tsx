import Link from "next/link";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Home, LayoutDashboard, Shirt, User} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import LogoutButton from "./LogoutButton";
import {ModeToggle} from "@/components/ModeToggle";
import {getUserProfileAction} from "@/app/update-profile/actions";

const SIDEBAR_LINKS = [
  {
    icon: Home,
    label: "Home",
    href: "/",
  },
  {
    icon: Shirt,
    label: "Merch",
    href: "/merch",
  },
];

const Sidebar = async () => {
  const userProfile = await getUserProfileAction();

  const isAdmin = process.env.ADMIN_EMAIL === userProfile?.email;

  return (
    <div className="flex lg:w-1/5 flex-col gap-3 px-2 border-r sticky left-0 top-0 h-screen">
      <Link href="/update-profile" className="max-w-fit">
        <Avatar className="mt-4 cursor-pointer">
          <AvatarImage src={userProfile?.image || "/user-placeholder.png"} className="object-cover" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>

      <nav className="flex flex-col gap-3">
        {SIDEBAR_LINKS.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className="flex w-12 lg:w-full items-center gap-2 bg-transparent hover:bg-primary-foreground font-bold hover:text-primary px-2 py-1 rounded-full justify-center lg:justify-normal transition-all duration-300"
          >
            <link.icon className="w-6 h-6" />
            <span className="hidden lg:block">{link.label}</span>
          </Link>
        ))}

        {isAdmin && (
          <Link
            href="/secret-dashboard"
            className="flex w-12 lg:w-full items-center gap-2 bg-transparent hover:bg-primary-foreground font-bold hover:text-primary px-2 py-1 rounded-full justify-center lg:justify-normal transition-all duration-300"
          >
            <LayoutDashboard className="w-6 h-6"/>
            <span className="hidden lg:block">Dashboard</span>
          </Link>
        )}

        <DropdownMenu modal={false}>
          <div
            className="flex w-12 lg:w-full items-center gap-2 bg-transparent hover:bg-primary-foreground font-bold hover:text-primary px-2 py-1 rounded-full justify-center lg:justify-normal transition-all duration-300"
          >
            <DropdownMenuTrigger className="flex items-center gap-2">
              <User className="w-6 h-6" />
              <span className="hidden lg:block">Settings</span>
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={process.env.STRIPE_BILLING_PORTAL_LINK_DEV + "?prefilled_email=" + userProfile?.email}>
              <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
            </Link>
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />
      </nav>
    </div>
  )
}
export default Sidebar
