"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form Submitted", {
      email,
      password,
    });
  };

  return (
    <div className="flex justify-center items-center bg-black h-screen">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          𝓘𝓷𝓼𝓽𝓪𝓰𝓻𝓪𝓶
        </h1>
        <h1 className="text-xs italic text-center text-gray-800 mb-6">
          Sign up to see photos and videos from your friends.
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-6">
            <Button type="submit" className="w-full py-3 text-white rounded-lg">
              Log In
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center text-gray-500">
          <p>
            Already have an account?{""}
            <a href="/signup" className="text-blue-600 hover:text-blue-700">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
