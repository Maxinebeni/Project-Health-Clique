import { Community, communityState } from "@/atoms/communitiesAtom";
import About from "@/components/Community/About";
import CreatePostLink from "@/components/Community/CreatePostLink";
import Header from "@/components/Community/Header";
import NotFound from "@/components/Community/NotFound";
import PageContent from "@/components/Layout/PageContent";
import Posts from "@/components/Posts/Posts";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import safeJsonStringify from "safe-json-stringify";



type CommunityPageProps = {
    communityData: Community;
};
    
    const CommunityPage: React.FC<CommunityPageProps> = ({communityData}) => { 
        console.log("Here is data", communityData);
        const [communityStateValue, setCommunityStateValue] =
        useRecoilState(communityState);
    


        useEffect(() => {
          setCommunityStateValue((prev) => ({
            ...prev,
            currentCommunity: communityData,
          }));
        }, [communityData]);

        if (!communityData) {
          return <NotFound/>
        }

      
        // // Community was not found in the database
        // if (!communityData) {
        //   return <CommunityNotFound />;
        // }
      

        return  (<>
           <Header communityData={communityData}/>
           <PageContent>
        <>
         <CreatePostLink />
         <Posts communityData={communityData} />
        </>
        <>
        <About communityData={communityData}/>
        </>
      </PageContent>
    </>
        );
    };


    export async function getServerSideProps(context: GetServerSidePropsContext) {
        console.log("GET SERVER SIDE PROPS RUNNING");
      
        try {
        const communityDocRef = doc(firestore, "communities", context.query.communityId as string);
         const communityDoc = await getDoc(communityDocRef);
          return {
            props: {
              communityData: communityDoc.data()
                ? JSON.parse(
                    safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }) // needed for dates
                  )
                : "",
            },
          };
        } catch (error) {
          // Could create error page here
          console.log("getServerSideProps error - [communityId]", error);
        }
      }
      
    export default CommunityPage;
