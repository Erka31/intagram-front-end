import { jwtDecode } from "jwt-decode";
import { MessageCircle } from "lucide-react";
import { Send } from "lucide-react";
import { Bookmark } from "lucide-react";
import { Heart } from "lucide-react";
import Link from "next/link";

type DecodedToken = {
  userId: string;
  username: string;
};
export const PostActions = ({
  likes,
  postId,
}: {
  postId: string;
  likes: string[];
}) => {
  const token = localStorage.getItem("token");
  const decodedToken: DecodedToken = jwtDecode(token ?? "");
  const userId = decodedToken.userId;
  const isUserLiked = likes.includes(userId);
  console.log({
    postId,
    userId,
  });
  const handleLike = async () => {
    if (isUserLiked) {
      await fetch("https://instagram-1-1kxe.onrender.com/unlike", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId,
        }),
      });
    } else {
      await fetch("https://instagram-1-1kxe.onrender.com/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId,
        }),
      });
    }
  };

  return (
    <div className="flex justify-between mt-2 mb-2">
      <div className="flex gap-x-2 ml-2">
        <Heart
          onClick={handleLike}
          color={isUserLiked ? "red" : "white"}
          fill={isUserLiked ? "red" : "black"}
          className="cursor-pointer"
        />
        <Link href={`/comments/${postId}`}>
          <MessageCircle />
        </Link>
        <Send />
      </div>
      <div className="mr-2">
        <Bookmark />
      </div>
    </div>
  );
};
