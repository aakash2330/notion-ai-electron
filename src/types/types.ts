

import { type } from 'os'
import {z} from 'zod'


export const formSchema = z.object({
    topic: z.string().min(2, {
        message: "Topic must be at least 2 characters.",
    }),
    notionKey: z.string().min(2, {
        message: "Invalid Key.",
    }),
    notionUrl: z.string().min(2, {
        message: "Invalid URL",
    })
})


export type formType = z.infer<typeof formSchema>

export type openaiActionType = {userPrompt:string}

export type addPageToDatabaseType = formType & {content:string,trancriptSummary:string,videoId:string}



export type addDatabaseToPageType = formType; 

export type helpPageData = {
    title:string,
    description:string,
    image:string,
}
