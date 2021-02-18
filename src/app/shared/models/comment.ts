import { UserSettings } from "./user";

export interface Comment{
    commentID: string;
    authorID: string;
    postID: string; 
    commentText: string;
    author?: UserSettings;
}