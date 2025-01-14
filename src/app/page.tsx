"use client";

import { useState, useEffect } from "react";

import * as React from "react";
import { Carousel } from "@/components/ui/carousel";
import { PostHeader } from "./custom_component/PostHeader";
import { PostActions } from "./custom_component/PostActions";
import { PostContent } from "./custom_component/PostContent";
import { PostFooter } from "./custom_component/PostFooter";
import { House } from "lucide-react";
import { SquarePlus, User } from "lucide-react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

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
}[];
type DecodedToken = {
  userId: string;
  username: string;
};
const Page = () => {
  const [posts, setPosts] = useState<postType>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const decodedToken: DecodedToken = jwtDecode(token ?? "");
  const userId = decodedToken.userId;
  const getPosts = async () => {
    console.log(token);
    console.log("working");
    const jsonData = await fetch(
      "https://instagram-1-1kxe.onrender.com/posts",
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response = await jsonData.json();
    setPosts(response);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getPosts();
  }, []);

  if (loading === true) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="w-32 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]">
          <span className="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center  bg-black">
      <div className="text-white border-b w-screen h-10 text-lg fixed top-0 left-0 bg-black z-10">
        𝓘𝓷𝓼𝓽𝓪𝓰𝓻𝓪𝓶
      </div>
      {posts?.map((post) => {
        return (
          <div
            key={post._id}
            className="w-fit bg-black text-white mt-10 mb-10 border-b border-zinc-700 py-10"
          >
            <Link href={`/profile/${post.userId._id}`}>
              <PostHeader
                profileImg={
                  post.userId.profileImg ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                username={post.userId.username}
              />
            </Link>
            <Carousel className="w-full max-w-xl">
              <PostContent postImg={post.postImg} />
              <PostActions postId={post._id} likes={post.like} />
            </Carousel>
            <PostFooter
              username={post.userId.username}
              likes={post.like.length}
              like={post.like}
              caption={post.caption}
              id={post._id}
            />
          </div>
        );
      })}
      <div className="fixed bottom-0  left-0 grid w-full h-10 grid-cols-1 px-8 bg-black border-t border-black-500  white:bg-gray-700 white:border-gray-600">
        <div className="flex justify-between p-2">
          <Link href={"/"}>
            <House color="white" />
          </Link>
          <Link href={"/upload"}>
            <SquarePlus color="white" />
          </Link>
          <Link href={`/profile/${userId}`}>
            <User color="white" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
