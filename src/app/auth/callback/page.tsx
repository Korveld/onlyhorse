"use client"
import {Loader} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import {checkAuthStatus} from "@/app/auth/callback/actions";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["authCheck"],
    queryFn: async () => await checkAuthStatus(),
  });

  useEffect(() => {
    if (data?.success || data?.success === false) {
      // window.location.href = "/";
      router.push("/");
    }
  }, [data, router]);

  return (
    <div className="mt-20 w-full flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader className="w-10 h-10 animate-[spin_1500ms_linear_infinite] text-muted-foreground" />
        <h3 className="text-xl font-bold">Redirecting...</h3>
        <p>Please wait...</p>
      </div>
    </div>
  )
}
export default Page
