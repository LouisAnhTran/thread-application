import React from "react";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import PostThread from "@/components/forms/PostThread";

const page = async () => {
  const user = await currentUser();

  if (!user) return null;

  console.log(`user id ${user.id}`)

  const userInfo = await fetchUser(user.id);

  console.log(`user id ${userInfo}}`)


  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <div className="text-light-1 text-heading1-bold">Create a new thread</div>

      <PostThread userId={userInfo._id}/>
    </>
  );
};

export default page;
