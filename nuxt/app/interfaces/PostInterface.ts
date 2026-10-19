/** An original academic article published in the static blog. */
export interface PostInterface {
  slug: string;
  title: string;
  summary: string;
  category: string;
  sections: { heading: string; paragraphs: string[] }[];
}
