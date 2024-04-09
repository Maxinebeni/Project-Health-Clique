import { communityState } from "@/atoms/communitiesAtom";
import { Post, PostVote } from "@/atoms/postsAtom";
import CreatePostLink from "@/components/Community/CreatePostLink";
import News from "@/components/Community/News";
import PersonalHome from "@/components/Community/PersonalHome";
import Premium from "@/components/Community/Premium";
import Recommendations from "@/components/Community/Recommendations";
import PageContent from "@/components/Layout/PageContent";
import SignUp from "@/components/Modal/Auth/SignUp";
import SignUpModal from "@/components/Modal/SignUpModal";
import PostItem from "@/components/Posts/PostItem";
import PostLoader from "@/components/Posts/PostLoader";
import { auth, firestore } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import usePosts from "@/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import PostCreateLink from "@/components/Community/PostCreateLink";



const Home: NextPage =()=> {

  const [recommendedArticles, setRecommendedArticles] = useState<string[]>([]);
  const setAuthModalState = useSetRecoilState(authModalState);

  const [userCred] = useAuthState(auth);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);





  // Fetch recommended articles
  useEffect(() => {
    const fetchRecommendedArticles = async () => {
      try {
        // Fetch recommended articles from API or other data source
        const response = await fetch("https://articles-f08q.onrender.com/");
        if (response.ok) {
          const data = await response.json();
          setRecommendedArticles(data);
        } else {
          console.error("Failed to fetch recommended articles");
        }
      } catch (error) {
        console.error("Error fetching recommended articles:", error);
      }
    };

    fetchRecommendedArticles();
  }, []);


  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {communityStateValue} = useCommunityData();
  const {postStateValue, setPostStateValue,onVote,
    onSelectPost,
    onDeletePost,
} = usePosts();


  const buildUserHomeFeed = async () => {
    setLoading(true);
    try {
      // const feedPosts: Post[] = [];

      // User has joined communities
      if (communityStateValue.mySnippets.length) {

        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        );

        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in" ,myCommunityIds),
          limit(10)
        );

        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
     
      } else {
        buildNoUserHomeFeed();

      }
    } catch (error: any) {
      console.log("buildUserHomeFeed error", error);
    }
    setLoading(false);

  };


  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
      
    } catch (error: any) {
      console.log("buildNoUserHomeFeed error", error);
    }
    setLoading(false);

  };


  const getUserPostVotes = async () => {

    try {
      
    const postIds = postStateValue.posts.map((post) => post.id);
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("postId", "in", postIds)
    );
    const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));

} catch (error) {
  console.log("getUserPostsVotes error", error);

      
}
  };



  // useEffects


  useEffect(() => {
    if (!communityStateValue.snippetsFetched) {
      (async () => {
        await buildUserHomeFeed();
      })();
    }
  }, [communityStateValue.snippetsFetched]);
  
  useEffect(() => {
    if (!user && !loadingUser) {
      (async () => {
        await buildNoUserHomeFeed();
      })();
    }
  }, [user, loadingUser]);

  useEffect(() => {
    if (!user?.uid || !postStateValue.posts.length) getUserPostVotes;

    // // Clear postVotes on dismount
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [postStateValue.posts, user?.uid]);







  return (
    <div
    style={{
      backgroundColor: user
      ? "gray.100"
      : "gray.100",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh", 

    }}
  >
    <PageContent>
    <>
    <PostCreateLink/>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map(post => (
            <PostItem
              key={post.id}
              post={post}
              onVote={onVote}
              onDeletePost={onDeletePost}
              onSelectPost={onSelectPost}
              userVoteValue={
                postStateValue.postVotes.find(
                  (item) => item.postId === post.id
                )?.voteValue
              }
              userIsCreator={user?.uid === post.creatorId}
              homePage
            />
          ))}
        </Stack>
      )}
    </>
    <Stack spacing={5} position="sticky" top="14px">
    <PersonalHome />  
      <Recommendations />
      <Premium recommendedArticles={recommendedArticles} handleArticleClick={function (articleId: string): Promise<void> {
          throw new Error("Function not implemented.");
        } } />
       <News/>
    </Stack>
  </PageContent>
  </div>

);
};


    
export default Home;
