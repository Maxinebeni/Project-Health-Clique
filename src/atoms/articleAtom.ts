import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";


  
export type ArticlePost = {
    id?: string;
    creatorId: string;
    creatorDisplayName: string; // change to authorDisplayText
    title: string;
    createdAt: Timestamp;
    url?: string | URL; // Accept URL as string or URL object
    pdfURL?: string;  
    summary?: string; // Add summary field

  
  };

  
interface ArticleState {
    selectedArticle: ArticlePost | null;
    articles: ArticlePost[];
    // Add any additional state properties as needed
  }
  
export const defaultArticleState: ArticleState = {
    selectedArticle: null,
    articles: [],
    // Initialize additional state properties here
  };
  
export const articleState = atom<ArticleState>({
    key: "articleState",
    default: defaultArticleState,
  });
  
  