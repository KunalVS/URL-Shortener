import { integer,pgTable ,uuid,varchar,timestamp,text} from 'drizzle-orm/pg-core'

export const userTable=pgTable('users',{
    id:uuid().defaultRandom().primaryKey(),
    
    firstname:varchar("first_name",{length:25}).notNull(),
    lastname:varchar("last_name",{length:25}),
    
    email:varchar({length:255}).notNull(),
    password:text().notNull(),
    
    salt:text().notNull(),
    
    createdAt:timestamp("created-at").defaultNow().notNull(),
    updatedAt:timestamp('updated-at').$onUpdate(()=>new Date())
})