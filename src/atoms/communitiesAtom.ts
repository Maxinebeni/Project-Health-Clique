import { atom } from "recoil";
import { FieldValue, Timestamp } from "firebase/firestore";

export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "public" | "restricted" | "private";
  createdAt?: Timestamp;
  imageURL?: string;
  description?: string; // Add description field

}

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
  description?: string; // Add description field

}

export interface CommunityState {
  mySnippets: CommunitySnippet[];
  snippetsFetched: boolean;
  currentCommunity?: Community;
}


const defaultCommunityState: CommunityState = {
  mySnippets: [],
  snippetsFetched: false,
};

export const communityState = atom<CommunityState>({
  key: "communitiesState",
  default: defaultCommunityState,
});
