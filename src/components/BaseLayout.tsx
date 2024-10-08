import {FC, ReactNode} from "react";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SuggestedProducts from "@/components/SuggestedProducts";

export interface IBaseLayout {
  children: ReactNode;
  renderRightPanel?: boolean;
}

const BaseLayout:FC<IBaseLayout> = async ({
  children,
  renderRightPanel = true
}) => {
  const { isAuthenticated } = getKindeServerSession();

  if ( !(await isAuthenticated()) ) {
    return redirect('/');
  }

  return (
    <div className="flex max-w-2xl lg:max-w-7xl mx-auto relative">
      <Sidebar />

      <div className="w-full lg:w-3/5 flex flex-col border-r">{children}</div>

      {renderRightPanel && (
        <SuggestedProducts />
      )}
    </div>
  )
}
export default BaseLayout
