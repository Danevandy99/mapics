import { UserSettings } from 'src/app/shared/models/user';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
export interface Reaction {
  userId: string;
  user?: UserSettings;
  emoji: EmojiData;
}
