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
import { ThreadValidation } from "@/lib/validation/thread";
import { createThread } from "@/lib/actions/thread.actions";

interface Params {
    userId: string
}


const PostThread = ({userId}:Params) => {
    const router=useRouter();
    const pathname=usePathname();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
        thread: '',
        accountId: userId
    },
  });

  const onSubmit=async (values: z.infer<typeof ThreadValidation>)=>{
    await createThread({
        text: values.thread,
        author: userId,
        communityId: null,
        path: pathname
    })

    router.push("/");

  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="mt-10 flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea
                  rows={15}
                  className="account-form_input no-focus"
                  {...field}
                ></Textarea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    
        <Button type="submit" className="bg-primary-500">Submit</Button>
      </form>
    </Form>
  )
}

export default PostThread