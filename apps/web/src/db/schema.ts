import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const gmUsers = pgTable("gm_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  account: varchar("account", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
