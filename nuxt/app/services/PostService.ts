import { posts } from '~/data/posts.js';
import type { PostInterface } from '~/interfaces/PostInterface.js';

/** Reads the three local articles shared by static generation and navigation. */
export class PostService {
  /** Returns the complete article catalogue. */
  public static getPosts(): PostInterface[] {
    return posts;
  }

  /** Finds an article using its stable URL slug. */
  public static getPostBySlug(slug: string): PostInterface | undefined {
    return posts.find((post) => post.slug === slug);
  }
}
