import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPost } from "@/lib/actions/thread.actions";
import User from "@/lib/models/user.model";
import { UserButton } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result=await fetchPost(1,30);
  const user=await currentUser();

  console.log("this is all thread",result)

  return (
      <div>
        <h1>THIS IS HOME PAGE</h1>

        <section className="mt-9 flex flex-col gap-10">
          {result.posts.length === 0 ? (
            <p>No threads found</p>
          ) : (
            result.posts.map((post)=>(
              <ThreadCard 
               key={post._id}
               id={post._id}
               currentUserId={user?.id || ""}
               parentId={post.parentId}
               content={post.text}
               author={post.author}
               community={post.community}
               createdAt={post.createdAt}
               comments={post.children}
               />
            ))
          )}
        </section>


      </div>
  );
}
