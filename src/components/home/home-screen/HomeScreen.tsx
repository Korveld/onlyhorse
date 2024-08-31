import BaseLayout from "@/components/BaseLayout";
import UserProfile from "@/components/home/home-screen/UserProfile";
import Posts from "./Posts";
import prisma from "@/db/prisma";
import {getUserProfileAction} from "@/app/update-profile/actions";
import {notFound} from "next/navigation";

const HomeScreen = async () => {
  const admin = await prisma.user.findUnique({
    where: {
      email: process.env.ADMIN_EMAIL,
    }
  }).finally(() => {
    prisma.$disconnect();
  });
  const user = await getUserProfileAction();

  if (!user) return notFound();

  return (
    <>
      <BaseLayout>
        <UserProfile />
        <Posts admin={admin!} isSubscribed={user?.isSubscribed} />
      </BaseLayout>
    </>
)
  ;
}
export default HomeScreen
