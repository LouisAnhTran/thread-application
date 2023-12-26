"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface ParamsCreateThread {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export const createThread = async ({
  text,
  author,
  communityId,
  path,
}: ParamsCreateThread) => {
  try {
    connectToDB();

    console.log("What is happening - new");

    const createdThread = await Thread.create({
      text,
      author,
      communityId: null,
    });

    console.log("what is happening 2");

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

export const fetchPost = async (pageNumber = 1, pagesize = 20) => {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pagesize;

    console.log(await Thread.find({}));

    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pagesize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id parentId name image",
        },
      });

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`new error ${error.message}`);
  }
};

export const fetchThreadById = async (id: string) => {
  try {
    connectToDB();

    // TODO: Populate Community later

    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            }
          }
        ]
      }).exec();

      return thread;
  } catch (error: any) {
    throw new Error(`Error fetching thread: ${error.message}`)
  }
};

export const addCommentToThread= async(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
)=>{
  try {
    connectToDB();

    // review thread based on id
    const originalThread=await Thread.findById(threadId);

    if(!originalThread){
      throw new Error('Thread not found')
    }

    // create a new thread as comment using Thread model
    const commentThread=new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    })

    // after create we then to save to the database
    const savedCommentThread= await commentThread.save();

    // Update the original thread to include the new comment
    originalThread.children.push(savedCommentThread._id);

    // Save the orginal thread
    await originalThread.save();

    revalidatePath(path);

  } catch (error: any) {
      throw new Error(`Error adding comment to thread: ${error.message} `)
  }
}