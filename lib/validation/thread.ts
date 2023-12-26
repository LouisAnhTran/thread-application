import * as z from 'zod';

export const ThreadValidation=z.object({
    thread: z.string().nonempty().min(5, {message: "Thread needs minimum 5 words"}),
    accountId: z.string(),
})

export const CommentValidation=z.object({
    thread: z.string().nonempty().min(5, {message: "Thread needs minimum 5 words"}),
})