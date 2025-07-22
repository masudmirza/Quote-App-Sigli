import z from "zod";

const QuoteTagDto = z.object({
  id: z.string().min(1),
});

export const QuoteResponseDto = z.object({
  id: z.string(),
  text: z.string(),
  author: z.string(),
  likeCount: z.number().nonnegative(),
  tags: z.array(QuoteTagDto).optional(),
  createdAt: z.preprocess(
    (arg: unknown) =>
      arg instanceof Date ? arg : new Date(arg as string | number | Date),
    z.date(),
  ),
});

export type QuoteResponse = z.infer<typeof QuoteResponseDto>;
