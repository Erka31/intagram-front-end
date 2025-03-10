"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { Send } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { AvatarFallback } from "@radix-ui/react-avatar";

type CommentType = {
  comment: string;
  postId: string;
  userId: {
    _id: string;
    username: string;
    profileImg: string;
  };
}[];

type DecodedToken = {
  userId: string;
  username: string;
};

const Page = () => {
  const [comments, setComments] = useState<CommentType>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { postId } = useParams();
  const token = localStorage.getItem("token");
  const decodedToken: DecodedToken = jwtDecode(token ?? "");
  const getComments = async () => {
    const jsonData = await fetch(
      `https://instagram-1-1kxe.onrender.com/getComment/${postId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await jsonData.json();
    console.log(response);
    setComments(response.comment);
    setLoading(false);
  };

  const addComment = async () => {
    if (!commentText.trim()) {
      return;
    }

    const newComment = {
      postId: postId,
      userId: decodedToken.userId,
      comment: commentText,
    };

    console.log(newComment);

    const jsonData = await fetch(
      `https://instagram-1-1kxe.onrender.com/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      }
    );

    const response = await jsonData.json();
    console.log(response);
    setCommentText(" ");
    getComments();
  };

  useEffect(() => {
    getComments();
    setLoading(true);
  }, []);

  if (loading === true) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="relative flex items-center justify-center">
          <div className="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-48 md:h-48 h-32 w-32 aspect-square rounded-full">
            <div className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900"></div>
          </div>
          <div className="absolute text-center text-black font-semibold">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black h-screen w-full flex flex-col mb-12">
      <div className="flex justify-center text-white text-xl font-bold overline p-3">
        Comments
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments?.map((comment, index) => (
          <div key={index} className="flex justify-between items-start">
            <div className="flex p-4 space-x-3 w-full ">
              <Avatar>
                <AvatarImage
                  src={
                    comment.userId.profileImg ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col w-full">
                <div className="text-slate-50 font-semibold">
                  {comment.userId.username}
                </div>
                <div className="text-slate-50">{comment.comment}</div>
                <div className="font-semibold text-xs text-gray-400 mt-1 cursor-pointer">
                  Reply
                </div>
              </div>
            </div>
            <Heart className="text-slate-50 mt-9 cursor-pointer" />
          </div>
        ))}
      </div>
      <div className="flex fixed bottom-0 left-0 w-full bg-black p-4">
        <Input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="text-white w-full h-12 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
        <Send
          onClick={addComment}
          className="text-slate-50 mt-4 ml-2 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Page;
