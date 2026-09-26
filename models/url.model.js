import { integer,pgTable ,uuid,varchar,timestamp,text} from 'drizzle-orm/pg-core';
import {userTable} from './user.model.js';

export const urlsTable=pgTable('urls',{
    id:uuid().defaultRandom().primaryKey(),
    shortcode: varchar('code',{length:155}).unique().notNull(),
    targetURL:text('target_url').notNull(),

    userid:uuid('user_id').references(()=>userTable.id).notNull(),

    createdat:timestamp('created-at').defaultNow().notNull(),
    updatedat:timestamp('updated-at').$onUpdate(()=>new Date()),


})