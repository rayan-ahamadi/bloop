export type Post = {
  id: string;
  parent_id: string | null;
  user_id: string;
  text_content: string;
  image: string | null;
  image_alt: string | null;
  posted_at: string;
  likes_nb: number;
  comments_nb: number;
  repost_nb: number;
  save_nb: number;
};
