"use client";
import { useEffect, useState } from "react";
import { Ellipsis, House, SquarePlus, User } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type postType = {
  _id: string;
  caption: string;
  postImg: string;
  userId: {
    username: string;
    profileImg: string;
    _id: string;
  };
  like: string[];
};

type UserType = {
  _id: string;
  username: string;
  email: string;
  followers: string[];
  following: string[];
  posts: postType[];
  profileImg: string;
};

type DecodedToken = {
  userId: string;
  username: string;
};

const Page1 = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const { userId } = useParams();

  const token = localStorage.getItem("token");
  const decodedToken: DecodedToken = jwtDecode(token ?? "");
  const accountId = decodedToken.userId;

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `https://instagram-1-1kxe.onrender.com/oneUser/${userId}`
      );
      const data = await response.json();
      setUser(data);
    };

    fetchUser();
  }, [userId]);

  const isUserfollowed = user?.followers?.includes(accountId);

  const handleFollow = async () => {
    if (isUserfollowed) {
      const response = await fetch(
        `https://instagram-1-1kxe.onrender.com/unfollow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            followingUserId: userId,
            followedUserId: accountId,
          }),
        }
      );
      const result = await response.json();
      console.log(result);
    } else {
      const response = await fetch(
        "https://instagram-1-1kxe.onrender.com/follow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            followingUserId: userId,
            followedUserId: accountId,
          }),
        }
      );
      const result = await response.json();
      console.log(result);
    }
  };

  return (
    <div className="bg-black h-full p-5 flex flex-col justify-between">
      <div className="flex justify-center border-b-[2px] border-zinc-700 pb-40">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={
              user?.profileImg ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-white ml-5 font-semibold flex mb-2">
            <div className="text-xl">{user?.username}</div>
            <Ellipsis className="ml-5" />
          </div>
          {userId === accountId ? null : (
            <button
              onClick={handleFollow}
              className={`ml-5 w-28 rounded-md px-4 text-white font-semibold transition-all duration-300 ease-in-out ${
                isUserfollowed
                  ? "bg-neutral-800 hover:bg-neutral-700 shadow-md hover:shadow-lg"
                  : "bg-blue-600 hover:bg-blue-500 shadow-sm hover:shadow-md"
              }`}
            >
              {isUserfollowed ? "Following" : "Follow"}
            </button>
          )}
          <div className="flex ml-5">
            <div className="text-white font-semibold">
              {user?.posts.length} posts
            </div>
            <Dialog>
              <DialogTrigger>
                <div className="text-white font-semibold ml-5">
                  {user?.followers.length} followers
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>
                  {user?.followers.length} followed people
                </DialogTitle>
                {user?.followers.map((followers, index) => {
                  return (
                    <DialogDescription key={index}>
                      {followers}
                    </DialogDescription>
                  );
                })}
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger>
                <div className="text-white font-semibold ml-5">
                  {user?.following.length} following
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>
                  {user?.following.length} following people
                </DialogTitle>
                {user?.following.map((following, index) => {
                  return (
                    <DialogDescription key={index}>
                      {following}
                    </DialogDescription>
                  );
                })}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="mt-8 sm:mt-10">
        <div className="flex flex-wrap sm:flex-row sm:gap-2 h-screen">
          {user?.posts.map((post, index) => {
            return (
              <div key={index}>
                <img
                  className="w-[450px] h-[500px] object-cover"
                  src={post.postImg}
                />
              </div>
            );
          })}
        </div>
        <div className="fixed bottom-0  left-0 grid w-full h-10 grid-cols-1 px-8 bg-black border-t border-black-500 white:bg-gray-700 white:border-gray-600">
          <div className="flex justify-between p-2">
            <Link href={"/"}>
              <House color="white" />
            </Link>
            <Link href={"/upload"}>
              <SquarePlus color="white" />
            </Link>
            <Link href={"/profile"}>
              <User color="white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page1;
