"use client";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { House, SquarePlus, User } from "lucide-react";

const Upload = () => {
  const [images, setImages] = useState<FileList | null>(null);
  const [upld, setUpld] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const token = localStorage.getItem("token");
  let decodedToken: any = null;

  try {
    decodedToken = token ? jwtDecode(token) : null;
  } catch (error) {
    console.error("Invalid token", error);
  }

  const up = async () => {
    if (!images) return;
    setIsLoading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(images).map(async (image) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "testerhme");
        formData.append("cloud_name", "dfnw2fgzz");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dfnw2fgzz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const result = await response.json();
        return result.secure_url;
      });

      const uploaded = await Promise.all(uploadPromises);
      setUpld(uploaded.filter((url) => url !== null) as string[]);

      if (decodedToken?.userId) {
        await create(uploaded);
      } else {
        throw new Error("User ID not found in token");
      }
    } catch (error) {
      setError("An error occurred while uploading.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const create = async (upld: string[]) => {
    try {
      const response = await fetch(
        "https://instagram-1-1kxe.onrender.com/post/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            postImg: upld[0],
            userId: decodedToken?.userId,
            caption: caption,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const result = await response.json();
      console.log("Instagram post created:", result);
    } catch (error) {
      setError("Failed to create post.");
      console.error(error);
    }
  };

  return (
    <div className=" bg-black h-screen">
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <input
          type="file"
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              setImages(files);
            }
          }}
          className="file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:bg-blue-50 file:text-blue-700 file:cursor-pointer hover:file:bg-blue-100"
        />

        <button
          onClick={up}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>

        <input
          type="text"
          placeholder="Write a caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mt-4 px-4 py-2 border border-gray-300 rounded-md w-full"
        />

        {error && (
          <div className="mt-4 text-red-600 text-center">
            <p>{error}</p>
          </div>
        )}

        <div className="mt-4 text-center">
          {upld.map((img, index) => (
            <img
              key={index}
              src={img}
              className="max-w-full h-[300px] rounded-lg shadow-lg"
              alt={`Uploaded ${index + 1}`}
            />
          ))}
        </div>
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
  );
};

export default Upload;
