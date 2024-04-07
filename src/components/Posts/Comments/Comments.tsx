import React, { useEffect, useState } from "react";
import { Flex, Stack, Text, Box } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { writeBatch, collection, doc, increment, serverTimestamp, query, where, orderBy, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import CommentInput from "./CommentInput";
import CommentItem, { Comment } from "./CommentItem";
import { postState, Post } from "@/atoms/postsAtom";

type CommentsProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({ user, selectedPost, communityId }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const setAuthModalState = useSetRecoilState(authModalState);
  const setPostState = useSetRecoilState(postState);
  const [loadingDeleteId, setloadingDeleteId] = useState("");


  const onCreateComment = async (commentText: string) => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);

      const commentDocRef = doc(collection(firestore, "comments"));
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as any,
      };

      batch.set(commentDocRef, newComment);

      const postDocRef = doc(firestore, "posts", selectedPost?.id as string);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      setCommentText("");
      setComments((prev) => [newComment, ...prev]);

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost!,
          numberOfComments: prev.selectedPost!.numberOfComments! + 1,
        },
      }));
    } catch (error: any) {
      console.log("onCreateComment error", error.message);
    }
    setCreateLoading(false);
  };

  const onDeleteComment = async (comment: Comment) => {
      setloadingDeleteId(comment.id as string);
      try {
        if (!comment.id) throw "Comment has no ID";

        const batch = writeBatch(firestore);
        const commentDocRef = doc(firestore, "comments", comment.id);
        batch.delete(commentDocRef);

        const postDocRef = doc(firestore, "posts", selectedPost?.id!); // Corrected reference to the "posts" collection

        batch.update(postDocRef, {
            numberOfComments: increment(-1),
        });

        await batch.commit();

        setPostState((prev) => ({
            ...prev,
            selectedPost: {
                ...prev.selectedPost,
                numberOfComments: prev.selectedPost?.numberOfComments! - 1,
            } as Post,
            //   postUpdateRequired: true,
        }));

        setComments((prev) => prev.filter((item) => item.id !== comment.id));
        // return true;
      } catch (error: any) {
        console.log("Error deleting comment", error.message);
        // return false;
      }
      setloadingDeleteId("");
    };

  const getPostComments = async () => {
    try {
       const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt", "desc")
      );
      
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error: any) {
      console.log("getPostComments error", error.message);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost, getPostComments]);
  
  return (
    <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
      <Flex direction="column" pl={10} pr={4} mb={6} fontSize="10pt" width="100%">
        {!fetchLoading && (
        <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          createLoading={createLoading}
          user={user}
          onCreateComment={onCreateComment}
        />
        )}
      </Flex>
      <Stack spacing={6} p={4}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                {/* Skeleton UI */}
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                    loadingDelete={loadingDeleteId === comment.id}
                    userId={user.uid}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Comments;
