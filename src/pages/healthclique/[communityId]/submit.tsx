import { Box, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communitiesAtom";
import PageContentLayout from "../../../components/Layout/PageContent";
import { auth } from "../../../firebase/clientApp";
import useCommunityData from "../../../hooks/useCommunityData";
import NewPostForm from "@/components/Posts/NewPostForm";
import About from "@/components/Community/About";
import PageContent from "../../../components/Layout/PageContent";

const SubmitPostPage: NextPage = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { community } = router.query;
  const communityStateValue = useCommunityData();
  console.log("COMMUNITY", communityStateValue);

  return (
    <PageContent maxWidth="1060px">
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="blue.500">
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        {user && <NewPostForm user={user} communityImageURL = {communityStateValue.currentCommunity?.imageURL}/>} 
      </>

      <>
        {communityStateValue && communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};

export default SubmitPostPage;
