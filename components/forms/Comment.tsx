"use client";

import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import { validateHeaderName } from "http";
import { CommentValidation, ThreadValidation } from "@/lib/validation/thread";
import { addCommentToThread, createThread } from "@/lib/actions/thread.actions";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(threadId,values.thread,JSON.parse(currentUserId),pathname);

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                <Image 
                src={currentUserImg}
                alt="Profile Image"
                width={48}
                height={48}
                className="rounded-full object-cover"></Image>
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                type="text"
                placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                ></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">Reply</Button>
      </form>
    </Form>
  );
};

export default Comment;
