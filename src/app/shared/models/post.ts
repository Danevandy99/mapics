import { UserSettings } from './user';
export interface Post {
  postId: string;
  authorId: string;
  photoUrls: string[];
  caption: string;
  timePosted: number;
  location: {
    latitude: number;
    longitude: number;
  };
  author?: UserSettings;
}
