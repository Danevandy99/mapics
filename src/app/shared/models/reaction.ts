import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
export interface Reaction {
  userId: string;
  postId: string;
  emoji: EmojiData;
}
