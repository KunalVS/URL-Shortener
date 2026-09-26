import db from '../db/index.js'
import {urlsTable} from '../models/index.js'
import {nanoid} from 'nanoid'

export async function InsertURLdata(code,url,user_id){
     const [result]=await db.insert(urlsTable).values({
        shortcode:code ?? nanoid(6),
        targetURL:url,
        userid:user_id,
    }).returning({
        id:urlsTable.id,
        targetURL:urlsTable.targetURL,
        shortcode:urlsTable.shortcode
    });

    return result;
}