export interface Post {
  postId: string;
  authorId: string;
  photoUrls: string[];
  caption: string;
  timePosted: Date;
  location: {
    latitude: number;
    longitude: number;
  };
}
