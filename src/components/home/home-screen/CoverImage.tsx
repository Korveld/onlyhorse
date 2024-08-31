import Image from "next/image";
import {Heart, Image as ImageIcon, Video} from "lucide-react";
import prisma from "@/db/prisma";
import {formatNumber} from "@/lib/utils";

const CoverImage = async ({ adminName }: { adminName: string }) => {
  const imageCount = await prisma.post.count({
    where: {
      mediaType: "image"
    }
  }).finally(() => {
    prisma.$disconnect();
  });
  const videoCount = await prisma.post.count({
    where: {
      mediaType: "video"
    }
  }).finally(() => {
    prisma.$disconnect();
  });
  // const totalLikes = await prisma.like.count();
  const totalLikes = await prisma.post.aggregate({
    _sum: {
      likes: true
    }
  }).finally(() => {
    prisma.$disconnect();
  });

  return (
    <div className="h-44 overflow-hidden relative">
      <Image
        src={"/featured/featured10.jpg"}
        alt="Featured Image"
        fill
        className="h-full w-full object-cover select-none pointer-events-none"
      />
      <div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-800 to-transparent"
        aria-hidden="true"
      />

      <div className="flex justify-between items-center absolute top-0 left-0 px-2 py-1 z-20 w-full">
        <div className="flex items-center gap-2">
          <div className="flex flex-col text-white">
            <p className="font-bold">{adminName}</p>

            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-1">
                <ImageIcon className="w-4 h-4"/>
                <span className="text-sm font-bold">{imageCount}</span>
              </div>

              <span className="text-xs">•</span>
              <div className="flex items-center gap-1">
                <Video className="w-4 h-4"/>
                <span className="text-sm font-bold">{videoCount}</span>
              </div>

              <span className="text-xs">•</span>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4"/>
                <span className="text-sm font-bold">{formatNumber(totalLikes._sum.likes || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CoverImage
