import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const PostFooter = ({
  username,
  likes,
  like,
  caption,
  id,
}: {
  username: string;
  likes: number;
  like: string[];
  caption: string;
  id: string;
}) => {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div className="ml-3">{likes} likes</div>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{likes} liked people</DialogTitle>
          {like.map((like, index) => {
            return <DialogDescription key={index}>{like}</DialogDescription>;
          })}
        </DialogContent>
      </Dialog>
      <div className="flex">
        <div className="text-xs font-semibold ml-3">{username}</div>
        <div className="text-xs ml-1">{caption}</div>
      </div>
      <Link href={`/comments/${id}`} className="text-xs text-gray-400 ml-3">
        view all comments
      </Link>
    </>
  );
};
