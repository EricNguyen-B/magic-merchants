import { z } from 'zod';
export const loginSchema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
});
export const registerSchema = z.object({
    email: z.string().min(1),
    username: z.string().min(1),
    password: z.string().min(1),
});
export const auctionSchema = z.object({
    dateStart: z.coerce.date(),
    dateEnd: z.coerce.date(),
    cardName: z.string(),
    cardCondition: z.string(),
    minBidPrice: z.number(),
    minBidIncrement: z.number()
});
