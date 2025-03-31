import { pgTable, varchar, text, timestamp, integer, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  password: varchar("password", { length: 128 }).notNull(), // SHA-512 해시값 저장
  phone_number: varchar("phone_number", { length: 20 }),
  email: varchar("email", { length: 100 }).notNull(),
  nickname: varchar("nickname", { length: 50 }).notNull(),
  last_login_at: timestamp("last_login_at"),
  session_id: varchar("session_id", { length: 128 }),
});

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  author_id: varchar("author_id", { length: 50 }).notNull().references(() => users.id),
  view_count: integer("view_count").default(0).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
}); 