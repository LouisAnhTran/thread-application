import React from "react";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import Link from "next/link";

const page = async () => {
  const user = await currentUser();

  if (!user) return null;

  console.log(`user id ${user.id}`);

  const userInfo = await fetchUser(user.id);

  console.log(`user id ${userInfo}}`);

  if (!userInfo?.onboarded) redirect("/onboarding");

  // get activity
  const activity=await getActivity(userInfo._id);

  console.log(`all user activities ${activity}`)
  
  return(
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map(activity=>(
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image src={activity.author.image}
                  alt="Profile picture"
                  width={20}
                  height={20}
                  className="rounded-full object-cover"/>
                  <p className="!text-small-rgular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {`${activity.author.name} `}
                    </span>
                    relied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (<p className="!text-base-regular text-light-3">No activity yet</p>)}
      </section>
    </section>
  )
};

export default page;