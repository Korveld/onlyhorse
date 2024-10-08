"use client";

import React, {FC, useEffect, useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
// import {user} from "@/dummy_data";
import {Heart, ImageIcon, LockKeyholeIcon, MessageCircle, Trash} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {User, Post as PostType, Prisma} from "@prisma/client";
import {CldVideoPlayer} from "next-cloudinary";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {commentOnPostAction, deletePostAction, likePostAction} from "@/components/home/home-screen/actions";
import {useToast} from "@/components/ui/use-toast";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import Comment from "@/components/home/home-screen/Comment";
import moment from "moment";


type TPostWithComments = Prisma.PostGetPayload<{
  include: {
    comments: {
      include: {
        user: true
      }
    };
    likesList: true;
  }
}>

interface IPost {
  post: TPostWithComments;
  admin: User;
  isSubscribed: boolean
}

const Post: FC<IPost> = ({
  post,
  admin,
  isSubscribed
}) => {
  const [isLike, setIsLike] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [comment, setComment] = useState("");
  const { user } = useKindeBrowserClient();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending } = useMutation({
    mutationKey: ["deletePost"],
    mutationFn: async () => await deletePostAction(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast({
        title: "Success",
        description: "Post deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Success",
        description: error.message,
        variant: "destructive"
      })
    },
  });

  const {mutate: likePost, isPending: likeLoading} = useMutation({
    mutationKey: ['likePost'],
    mutationFn: async () => {
      post.likes += isLike ? -1 : 1;
      setIsLike(!isLike);
      // useOptimistic (https://react.dev/reference/react/useOptimistic)
      // setIsLikeLoading(true);
      await likePostAction(post.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLikeLoading(false);
    }
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationKey: ['commentPost'],
    mutationFn: async () => await commentOnPostAction(post.id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setComment("");
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCommentSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment) return;
    commentPost();
  };

  useEffect(() => {
    if (post.likesList && user?.id) {
      setIsLike(post.likesList.length > 0);
      setIsLikeLoading(false);
    }
  }, [post.likesList, user?.id]);

  return (
    <div className="flex flex-col gap-3 p-3 border-t">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={admin.image || "/user-placeholder.png"} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm md:text-base">{admin.name}</span>
        </div>

        <div className="flex gap-2 items-center">
          <p className="text-zinc-400 text-xs md:text-sm tracking-tighter">
            {moment(post.createdAt).format('DD.MM.YYYY')}
          </p>

          {admin.id === user?.id && (
            <Dialog>
              <DialogTrigger>
                <Trash
                  className="w-5 h-5 text-muted-foreground hover:text-red-500 cursor-pointer transition-all duration-300"
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your post
                    and remove data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={() => deletePost()}
                  >Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <p className="text-sm md:text-base">{post.text}</p>

      {(post.isPublic || isSubscribed) && post.mediaUrl && post.mediaType === "image" && (
        <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden">
          <Image
            src={post.mediaUrl}
            alt="Post image"
            className="rounded-lg object-cover"
            fill
          />
        </div>
      )}

      {(post.isPublic || isSubscribed) && post.mediaUrl && post.mediaType === "video" && (
        <div className="w-full mx-auto">
          <CldVideoPlayer width="960" height="540" src={post.mediaUrl} className="rounded-md" />
        </div>
      )}

      {!isSubscribed && !post.isPublic && (
        <div className="w-full bg-slate-800 relative h-96 rounded-md bg-of flex flex-col justify-center items-center px-5 overflow-hidden">
          <LockKeyholeIcon className="w-16 h-16 text-zinc-400 mb-20 z-0" />
          <div aria-hidden={true} className="opacity-60 absolute top-0 left-0 w-full h-full bg-stone-800" />

          <div className="flex flex-col gap-2 z-10 border p-2 border-gray-500 w-full rounded">
            <div className="flex gap-1 items-center">
              <ImageIcon className="w-4 h-4" />
              <span className="text-xs">1</span>
            </div>

            <Link
              href={"/pricing"}
              className={buttonVariants({
                className: "!rounded-full w-full font-bold text-white"
              })}
            >
              Subscribe to unlock
            </Link>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex gap-1 items-center">
          <Heart
            className={cn(
              "w-5 h-5 cursor-pointer transition-opacity duration-500",
              { "text-red-500": isLike, "fill-red-500": isLike },
              { "opacity-70": isLikeLoading },
            )}
            onClick={() => {
              // setIsLike(!isLike);
              if (!isSubscribed) return;
              likePost();
            }}
          />
          <span className="text-xs text-zinc-400 tracking-tighter">{post.likes}</span>
        </div>

        <div className='flex gap-1 items-center'>
          <Dialog>
            <DialogTrigger>
              <MessageCircle className='w-5 h-5 cursor-pointer'/>
            </DialogTrigger>
            {isSubscribed && (
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Comments</DialogTitle>
                </DialogHeader>
                <ScrollArea className='h-[400px] w-[350px] rounded-md p-4'>
                  {post.comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                  ))}

                  {post.comments.length === 0 && (
                    <div className='flex flex-col items-center justify-center h-full'>
                      <p className='text-zinc-400'>No comments yet</p>
                    </div>
                  )}
                </ScrollArea>

                <form onSubmit={handleCommentSubmission}>
                  <Input
                    placeholder='Add a comment'
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                  />

                  <DialogFooter>
                    <Button type='submit' className='mt-4' disabled={isCommenting}>
                      {isCommenting ? "Commenting..." : "Comment"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            )}
          </Dialog>
          <div className='flex gap-1 items-center'>
						<span className='text-xs text-zinc-400 tracking-tighter'>
							{post.comments.length > 0 ? post.comments.length : 0}
						</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Post
