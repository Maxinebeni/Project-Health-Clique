import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Input, InputGroup, InputLeftElement, Text } from "@chakra-ui/react";
import { ArticlePost, articleState } from "@/atoms/articleAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { useRecoilState } from "recoil";
import PageContent from "@/components/Layout/PageContent";
import ReadSummaryModal from "@/components/Modal/readSummaryModal/readSummaryModal";
import ArticleHeader from "@/components/articleheader";
import Article_Recommender from "@/components/articlerecommender";
import ArticleLayout from "@/components/Layout/ArticleLayout";
import { query, collection, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import moment from "moment";


const ArticlePostsPage: React.FC = () => {
  const [articlePosts, setArticlePosts] = useState<ArticlePost[]>([]);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [postStateValue, setPostStateValue] = useRecoilState(articleState);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ArticlePost | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [recommendedArticles, setRecommendedArticles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [filteredArticles, setFilteredArticles] = useState<ArticlePost[]>([]); // State to store filtered articles

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredArticles(
      articlePosts.filter((post) =>
        post.title.toLowerCase().includes(query)
      )
    );
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  
    return () => unsubscribe();
  }, []);
  

  // Handle article click
  const handleArticleClick = async (articleId: string) => {
    try {
      // Check if the user is logged in
      if (currentUser) {
        // Logic to check if the article has been clicked before
        // For example, you can store clicked articles in the user's data or in local storage
        const clickedArticle = articlePosts.find((article) => article.id === articleId);
        if (!clickedArticle) {
          console.error("Clicked article not found in the article list");
          return;
        }

        const summary = clickedArticle.summary;

        if (summary) {
          console.log("Summary found:", summary);

          // Check if recommendations are stored in local storage and not expired
          const lastRecommendationTimestamp = Number(localStorage.getItem("lastRecommendationTimestamp"));
          const currentTimestamp = new Date().getTime();
          const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;

          if (lastRecommendationTimestamp && currentTimestamp - lastRecommendationTimestamp < threeDaysInMilliseconds) {
            // If 3 days have not passed since the last recommendation, retrieve the recommendations from local storage
            const storedRecommendations = localStorage.getItem("recommendations");
            if (storedRecommendations) {
              setRecommendedArticles(JSON.parse(storedRecommendations));
            } else {
              console.error("Stored recommendations not found in local storage");
            }
          } else {
            // Fetch recommendations from the API
            console.log("Sending summary to API...");
            const formData = new FormData();
            formData.append('summary', summary);

            const response = await fetch("https://articles-f08q.onrender.com/", {
              method: "POST",
              body: formData, // Send the summary as form data
            });

            if (response.ok) {
              const data = await response.json();
              console.log("Received recommendations:", data);
              setRecommendedArticles(data);
              localStorage.setItem("recommendations", JSON.stringify(data)); // Store the recommendations in local storage
              localStorage.setItem("lastRecommendationTimestamp", currentTimestamp.toString()); // Store the timestamp of the last recommendation in local storage
            } else {
              console.error("Failed to fetch recommendations from the API");
            }
          }
        } else {
          console.error("Summary not found for the clicked article");
        }

        const articleUrl = clickedArticle.url;
        if (articleUrl) {
          window.open(articleUrl.toString(), "_blank");
        }
      } else {
        console.log("User is not logged in");
      }
    } catch (error) {
      console.error("Error handling article click:", error);
    }
  };

  const getArticlePosts = async () => {
    setLoading(true);
    try {
      const articlepostsQuery = query(
        collection(firestore, "articleposts"),orderBy("title", "asc")
      );
      const postDocs = await getDocs(articlepostsQuery);
      const posts = await Promise.all(
        postDocs.docs.map(async (doc) => {
          const data = doc.data() as ArticlePost;
          if (data.pdfURL) {
            const pdfRef = ref(storage, data.pdfURL);
            const pdfURL = await getDownloadURL(pdfRef);
            return { id: doc.id, ...data, pdfURL };
          } else {
            return { id: doc.id, ...data };
          }
        })
      );
      setArticlePosts(posts);
    } catch (error) {
      console.error("getArticlePosts error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const storedRecommendations = localStorage.getItem("recommendations");
    if (storedRecommendations) {
      setRecommendedArticles(JSON.parse(storedRecommendations));
    } else {
      getArticlePosts();
    }
  }, []);



  const handleArticleDelete = async (post: ArticlePost) => {
    setLoadingDelete(true);
    try {
      // if post has a PDF URL, delete it from storage
      if (post.pdfURL) {
        const pdfRef = ref(storage, post.pdfURL);
        await deleteObject(pdfRef);
      }
  
      // delete post from Firestore
      const postDocRef = doc(firestore, "articleposts", post.id!);
      await deleteDoc(postDocRef);
  
      // Update article posts state if needed
      // Assuming setArticlePosts is a setter function for the article posts state
      setArticlePosts((prevPosts) =>
        prevPosts.filter((item) => item.id !== post.id)
      );
  
      console.log("Article post successfully deleted");
    } catch (error) {
      console.error("Error deleting article post:", error);
    }
    setLoadingDelete(false);
  };
  



      
  const handleReadSummary = (post: ArticlePost) => {
    setSelectedPost(post);
    setIsSummaryModalOpen(true);
  };

  const categorizeArticles = () => {
    const categorizedArticles: { [key: string]: ArticlePost[] } = {};
    articlePosts.forEach((post) => {
      const firstChar = post.title[0].toUpperCase();
      if (!categorizedArticles[firstChar]) {
        categorizedArticles[firstChar] = [];
      }
      categorizedArticles[firstChar].push(post);
    });
    return categorizedArticles;
  };

  useEffect(() => {
    getArticlePosts();
  }, []); // Run once when the component mounts


  useEffect(() => {
    const categorizedArticles = categorizeArticles();
    setFilteredArticles(
      Object.values(categorizedArticles).flat().filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    );
  }, [searchQuery, articlePosts]);
  
  

  return (
    <div
    style={{
      backgroundImage: "url('/images/articles.png')", // Assuming your image is located in the public/images directory
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh", // Ensure the background covers the entire page height
      backgroundColor: "gray.100", // Add background color here

    }}
  >

    <>
      <ArticleHeader />
      <ArticleLayout
        leftContent={
        <Flex direction="column" align="center">
            <Flex width="100%"> 
              <Box
                border="2px solid"
                borderColor="gray.300"
                borderRadius="4px 4px 0px 0px"
                bg="white"
                mt={1}
                overflowY="auto"
                maxHeight="calc(100vh - 200px)"
                width="100%"
                pr={6}
                pl={6}
              >
{Object.entries(categorizeArticles()).map(([letter, posts]) => (
  <Flex key={letter} direction="column" mb={4}>
    <Box mb={1}>
      <Text
        mt={2}
        fontWeight="bold"
        borderBottom="1px solid"
        pb={2}
      >
        {letter}
      </Text>
    </Box>
    {posts.map((post) => (
      <Flex
        key={post.id}
        direction="column"
        align="flex-start"
        mb={6}
        bg="gray.100"
        p={4}
        borderRadius={4}
        position="relative"
        pr={10}
      >
        <Text fontSize="sm" color="gray.500">
          Posted by {post.creatorDisplayName}{" "}
          {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
        </Text>
        <Text fontSize="lg" fontWeight="bold" mb={2} color="gray.400">
          {post.title}
        </Text>
        {post.url && (
          <Text fontSize="sm" mb={2}>
            URL:{" "}
            <a
              href={post.url.toString()}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue.500", textDecoration: "underline" }}
              onClick={(e) => {
                e.preventDefault();
                if (post.id) {
                  handleArticleClick(post.id);
                }
              }}
            >
              {post.url.toString()}
            </a>
          </Text>
        )}
        {post.pdfURL && (
          <Button
            mt={2}
            colorScheme="blue"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              if (post.id) {
                handleArticleClick(post.id);
              }
            }}
          >
            Download PDF
          </Button>
        )}
        <Box
          right={0}
          bottom={0}
          mt={4}
          p={2}
          borderRadius={4}
        >
          <Button
            colorScheme="teal"
            size="sm"
            mr={2}
            onClick={() => handleReadSummary(post)}
          >
            Read Summary
          </Button>
          {currentUser && currentUser.uid === post.creatorId && (
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => handleArticleDelete(post)}
              isLoading={loadingDelete}
            >
              Delete
            </Button>
          )}
        </Box>
      </Flex>
    ))}
    </Flex>
     ))}
              </Box>
            </Flex>
          </Flex>
        }
        rightContent={
          <Article_Recommender
            handleArticleClick={handleArticleClick}
            recommendedArticles={recommendedArticles}
          />
        }
      />
      <ReadSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summary={selectedPost?.summary || ""}
      />
    </>
    </div>

  );
};

export default ArticlePostsPage;
