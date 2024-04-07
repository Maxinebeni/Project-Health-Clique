import React, { useState } from "react";
import { Flex, Icon, Stack, Skeleton, Spinner, Text, Image, Alert, AlertIcon } from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsDot, BsChat } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import { MdHealthAndSafety } from "react-icons/md";
import { IoArrowUpCircleSharp, IoArrowUpCircleOutline, IoArrowDownCircleSharp, IoArrowDownCircleOutline, IoArrowRedoOutline, IoBookmarkOutline } from 'react-icons/io5';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import { Post } from "@/atoms/postsAtom";

type PostItemProps = {
    post: Post;
    userIsCreator: boolean;
    userVoteValue?: number;
    onVote: (
        event: React.MouseEvent<SVGElement, MouseEvent>,
        post: Post,
        vote: number,
        communityId: string,
    ) => void;
    onDeletePost: (post: Post) => Promise<boolean>;
    onSelectPost?: (post: Post) => void;
    homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
    post,
    onVote,
    onSelectPost,
    onDeletePost,
    userVoteValue,
    userIsCreator,
    homePage,
}) => {
    const [loadingImage, setLoadingImage] = useState(true);
    const [error, setError] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const singlePostPage = !onSelectPost;
    const router = useRouter();
    const [user] = useAuthState(auth);
    const setAuthModalState = useSetRecoilState(authModalState);

    const handleDelete = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        setLoadingDelete(true);
        try {
            const success = await onDeletePost(post);
            if (!success) throw new Error("Failed to delete post");

            console.log("Post successfully deleted");
            if (singlePostPage) {
                router.push(`/healthclique/${post.communityId}`);
            }

        } catch (error: any) {
            setError(error.message);
        }
        setLoadingDelete(false);
    };

    const handlePostItemClick = () => {
        if (!user) {
            setAuthModalState({ open: true, view: "login" });
        } else {
            if (onSelectPost) {
                onSelectPost(post);
            }
        }
    };

    const handleVote = (event: React.MouseEvent<SVGElement, MouseEvent>, vote: number) => {
        if (!user) {
            setAuthModalState({ open: true, view: "login" });
        } else {
            onVote(event, post, vote, post.communityId);
        }
    };

    return (
        <Flex
            border="1px solid"
            bg="white"
            borderColor={singlePostPage ? "white" : "gray.300"}
            borderRadius={singlePostPage ? "4px 4px 0px 0px" : 4}
            cursor={singlePostPage ? "unset" : "pointer"}
            _hover={{ borderColor: singlePostPage ? "none" : "gray.500" }}
            onClick={handlePostItemClick}
        >       
         <Flex
          direction="column"
          align="center"
          p={2}
          width="40px"
          bg={singlePostPage ? "none" : "gray.100"}
          borderRadius={singlePostPage? "0" : "3px 0px 0px 3px"}
          
        >
          <Icon
            as={
              userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
            }
            color={userVoteValue === 1 ? "brand.100" : "gray.400"}
            fontSize={22}
            cursor="pointer"
            onClick={(event) => onVote(event, post, 1, post.communityId)}
            />
          <Text fontSize="9pt" fontWeight={600}>
            {post.voteStatus}
          </Text>
          <Icon
            as={
              userVoteValue === -1
                ? IoArrowDownCircleSharp
                : IoArrowDownCircleOutline
            }
            color={userVoteValue === -1 ? "#brand.100" : "gray.400"}
            fontSize={22}
            cursor="pointer"
            onClick={(event) => onVote(event, post, -1, post.communityId)}
          />
        </Flex>
        <Flex direction="column" width="100%">
        {error &&(
        <Alert status='error'>
        <AlertIcon />
        <Text mr ={2}>Error Creating Post</Text>
      </Alert>

      )}

        <Stack spacing={1} p="10px 10px">
            <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
              {/* Home Page Check */}
              {homePage && (
                <>
                  {post.communityImageURL ? (
                    <Image
                      borderRadius="full"
                      boxSize="18px"
                      src={post.communityImageURL}
                      mr={2}
                      alt="CommunityImageURL"

                    />
                  ) : (
                    <Icon as={MdHealthAndSafety} fontSize={18} mr={1} color="blue.500" />
                  )}
                  <Link href={`healthclique/${post.communityId}`}>
                    <Text
                      fontWeight={700}
                      _hover={{ textDecoration: "underline" }}
                      onClick={(event) => event.stopPropagation()}
                    >{`${post.communityId}`}</Text>
                  </Link>
                  <Icon as={BsDot} color="gray.500" fontSize={8} />
                </>
              )}
              <Text color="gray.500" fontSize={12}>
                Posted by {post.creatorDisplayName}{" "}
                {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
              </Text>
            </Stack>
            <Text fontSize="12pt" fontWeight={600}>
            {post.title}
          </Text>
          <Text >{post.body}</Text>
          {post.imageURL && (
            <Flex justify="center" align="center" p={2}>
                {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}

              <Image
                maxHeight="360px"
                src={post.imageURL}
                display={loadingImage ? "none" : "unset"}
                onLoad={() => setLoadingImage(false)}
                alt="Post Image"
              />
            </Flex>
          )}
         </Stack>
         <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text >{post.numberOfComments}</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text >Share</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} color='blue.400' />
            <Text >Save</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor="pointer"
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize="9pt">Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>

)};
export default PostItem;