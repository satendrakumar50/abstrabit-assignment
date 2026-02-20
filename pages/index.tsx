import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Bookmarks from "./BookMarks";
// import { UserProfile } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
function Index() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    console.log(user);
    return (
      <div>
        <div className=" flex items-center justify-center  ">
          Welcome {user.name}!{" "}
          <Link
            className="ml-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            href="/api/auth/logout"
          >
            Logout
          </Link>
          <br></br>
        </div>
        <Bookmarks user={user} />
      </div>
    );
  }
  return (
    <div className=" flex items-center justify-center ">
      <Link
        // href="/api/auth/login"
        href="/api/auth/login?prompt=login"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
      >
        Login
      </Link>
    </div>
  );
}

export default Index;
