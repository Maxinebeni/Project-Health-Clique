import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { Community, communityState } from "../atoms/communitiesAtom";
import { auth, firestore, storage } from "../firebase/clientApp";
import router, { useRouter } from "next/router";
import { Post, PostVote, postState } from "@/atoms/postsAtom";

const usePosts = (communityData?: Community) => {
  const [user] = useAuthState(auth);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const currentCommunity = useRecoilValue(communityState).currentCommunity;
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();


  const onVote = async (event: React.MouseEvent<SVGElement, MouseEvent>,

    post: Post, vote: number, communityId: string) => {
      event.stopPropagation();

    if (!user?.uid) {
      setAuthModalState({open: true, view: "login"})
    }
    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (v) => v.postId === post.id
      );

      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      if (!existingVote) {
        const postVoteCollectionRef = collection(
          firestore,
          "users",
          `${user?.uid}`,
          "postVotes"
        );
        const postVoteRef = doc(postVoteCollectionRef);

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote,
        };

        batch.set(postVoteRef, newVote);

        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        const postVoteCollectionRef = collection(
          firestore,
          "users",
          `${user?.uid}`,
          "postVotes"
        );
        const postVoteRef = doc(postVoteCollectionRef, existingVote.id);

        if (existingVote.voteValue === vote) {
          // Remove the vote
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (v) => v.id !== existingVote.id
          );

          batch.delete(postVoteRef);
          voteChange *= -1;
        } else {
          // Update the vote
          updatedPost.voteStatus = voteStatus + 2 * vote;

          const voteIdx = updatedPostVotes.findIndex(
            (v) => v.id === existingVote.id
          );

          updatedPostVotes[voteIdx] = {
            ...existingVote,
            voteValue: vote,
          };
          batch.update(postVoteRef, { voteValue: vote });

          voteChange = 2 * vote;
        }
      }

      const postIdx = updatedPosts.findIndex((item) => item.id === post.id);
      updatedPosts[postIdx] = updatedPost;

      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));

      if (postStateValue.selectedPost){
        setPostStateValue(prev=> ({
          ...prev,
          selectedPost: updatedPost,

        })
          
          )
      }

      const postRef = doc(firestore, "posts", post.id!);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });

      await batch.commit();
    } catch (error) {
      console.log("onVote error", error);
    }
  };

  const onSelectPost = (post: Post) => {

    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/healthclique/${post.communityId}/comments/${post.id}`);
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // if post has an image url, delete it from storage
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      // delete post from posts collection
      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);

      // Update post state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));
      return true;
    } catch (error) {
      console.log("THERE WAS AN ERROR", error);
      return false;
    }
  };


  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );

    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }))};

    useEffect(() => {
      if (!user || !currentCommunity?.id) return;
      getCommunityPostVotes(currentCommunity?.id);
    }, [user, currentCommunity, getCommunityPostVotes, setPostStateValue]);
    
    useEffect(() => {
      // Logout or no authenticated user
      if (!user) {
        setPostStateValue((prev) => ({
          ...prev,
          postVotes: [],
        }));
        return;
      }
    }, [user, setPostStateValue]);
      
  

  return {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    onVote,
  };
};

export default usePosts;
