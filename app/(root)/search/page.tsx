import React from "react";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";

const page = async () => {
  const user = await currentUser();

  if (!user) return null;

  console.log(`user id ${user.id}`);

  const userInfo = await fetchUser(user.id);

  console.log(`user id ${userInfo}}`);

  // Fetch users
  const result=await fetchUsers({
    userId:user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 25
  })

  console.log(`all the users`)

  if (!userInfo?.onboarded) redirect("/onboarding");
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* Search bar */}

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length===0 ? (
            <p className="no-result">No Users</p>
        ) : (
            <>
                {result.users.map(person=>(
                    <UserCard
                    key={person.id}
                    id={person.id}
                    name={person.name}
                    username={person.username}
                    imgUrl={person.image}
                    personType='User'></UserCard>
                ))}
            </>
        )}
      </div>
    </section>
  );
};

export default page;
