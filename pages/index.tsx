import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Bookmarks from "./BookMarks";
// import { UserProfile } from "@auth0/nextjs-auth0/client";

function index() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    console.log(user);
    return (
      <div>
        <div className=" flex items-center justify-center  ">
          Welcome {user.name}!{" "}
          <a
            className="ml-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            href="/api/auth/logout"
          >
            Logout
          </a>
          <br></br>
        </div>
        <Bookmarks user={user} />
      </div>
    );
  }
  return (
    <div className=" flex items-center justify-center ">
      <a
        href="/api/auth/login"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
      >
        Login
      </a>
    </div>
  );
}

export default index;
