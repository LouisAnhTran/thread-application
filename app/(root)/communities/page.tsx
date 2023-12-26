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
import { fetchCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "@/components/cards/CommunityCard";

const page = async () => {
  const user = await currentUser();

  if (!user) return null;

  console.log(`user id ${user.id}`);

  const userInfo = await fetchUser(user.id);

  console.log(`user id ${userInfo}}`);

  // Fetch communities
  const result=await fetchCommunities({
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
        {result.communities.length===0 ? (
            <p className="no-result">No Community</p>
        ) : (
            <>
                {result.communities.map(community=>(
                    <CommunityCard
                    key={community.id}
                    id={community.id}
                    name={community.name}
                    username={community.username}
                    imgUrl={community.image}
                    bio={community.bio}
                    members={community.members}>
                    </CommunityCard>
                ))}
            </>
        )}
      </div>
    </section>
  );
};

export default page;
