import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";

export type Post = {
  id?: string;
  communityId: string;
  creatorDisplayName: string; // change to authorDisplayText
  creatorId: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  createdAt: Timestamp;
  imageURL?: string;
  communityImageURL: string; // Add this property


};

export type PostVote = {
  id?: string;
  postId: string;
  communityId: string;
  voteValue: number;
};

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVote[];
//   postsCache: {
//     [key: string]: Post[];
//   };
//   postUpdateRequired: boolean;
}

export const defaultPostState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
//   postsCache: {},
//   postUpdateRequired: true,
};

export const postState = atom<PostState>({
  key: "postState",
  default: defaultPostState,
});
