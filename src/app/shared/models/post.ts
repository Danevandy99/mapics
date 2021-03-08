import { UserSettings } from './user';
export interface Post {
  postId: string;
  authorId: string;
  photoUrls: string[];
  caption: string;
  timePosted: number;
  latitude: number;
  longitude: number;
  geohash: string;
  author?: UserSettings;
  distance?: number;
}
