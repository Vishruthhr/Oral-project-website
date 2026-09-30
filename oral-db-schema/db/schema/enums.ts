import { pgEnum } from 'drizzle-orm/pg-core';

// Frontend stores sex as '1' / '2' -> map to 'male' / 'female' on the way in/out.
export const sexEnum = pgEnum('sex', ['male', 'female']);
