import { UserSettings } from "./user";

export interface Conversation{
    userID: string;
    lastSentMessage: string;
    lastSentMessageTime: number;
    user?: UserSettings;
}
