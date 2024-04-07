import { authModalState } from "@/atoms/authModalAtom";
import { Community, CommunitySnippet, communityState } from "@/atoms/communitiesAtom";
import { auth, firestore } from "@/firebase/clientApp";
import { collection, doc, getDoc, getDocs, increment, writeBatch } from "firebase/firestore";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";



const useCommunityData= () =>{

    const [communityStateValue, setCommunityStateValue,] = useRecoilState(communityState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user] = useAuthState(auth);
    const setAuthModalState = useSetRecoilState(authModalState);
    const router = useRouter();
    

  

    const onJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean)=> {
    // console.log("ON JOIN LEAVE", community.id);

    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };


  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(collection(firestore, 
        `users/${user?.uid}/communitySnippets`)
        );   
        
    const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
    setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        snippetsFetched: true,
      }));

    } catch (error: any) {
      console.log("Error getting user snippets", error);
    }
    setLoading(false);
  };

 
    const joinCommunity = async (communityData: Community)=>{
        console.log("JOINING COMMUNITY: ", communityData.id);
        try {
          const batch = writeBatch(firestore);
          const newSnippet: CommunitySnippet = {
            communityId: communityData.id,
            imageURL: communityData.imageURL || "",
            isModerator: user?.uid === communityData.creatorId,
          };
          batch.set(
            doc(
              firestore,
              `users/${user?.uid}/communitySnippets`,
              communityData.id // will for sure have this value at this point
            ),
            newSnippet
          );
    
          batch.update(doc(firestore, "communities", communityData.id), {
            numberOfMembers: increment(1),
          });
    
          // perform batch writes
          await batch.commit();
    
          // Add current community to snippet
          setCommunityStateValue((prev) => ({
            ...prev,
            mySnippets: [...prev.mySnippets, newSnippet],
          }));
        } catch (error) {
          console.log("joinCommunity error", error);
        }
        setLoading(false);

    };

    const leaveCommunity= async (communityId: string)=> {
        try {
            const batch = writeBatch(firestore);
      
            batch.delete(
              doc(firestore, `users/${user?.uid}/communitySnippets/${communityId}`)
            );
      
            batch.update(doc(firestore, "communities", communityId), {
              numberOfMembers: increment(-1),
            });
      
            await batch.commit();
      
            setCommunityStateValue((prev) => ({
              ...prev,
              mySnippets: prev.mySnippets.filter(
                (item) => item.communityId !== communityId
              ),
            }));
          } catch (error) {
            console.log("leaveCommunity error", error);
          }
          setLoading(false);
      

    };

    const getCommunityData = async (communityId: string) => {
      try {
        const communityDocRef = doc(
          firestore,
          "communities",
          communityId as string
        );
        const communityDoc = await getDoc(communityDocRef);

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));

  
        
      } catch (error) {
        console.log('getCommunityData', error)
        
      }
    }


    useEffect(() => {
        if (!user) {
          setCommunityStateValue((prev) => ({
            ...prev,
            mySnippets: [],
            snippetsFetched: false,
          }));
          return;

    
        };
        getMySnippets();
      }, [user]);


    

      useEffect(() => {
        const {communityId} = router.query;

        if(communityId && !communityStateValue.currentCommunity){
          getCommunityData(communityId as string);
        }

      }, [router.query, communityStateValue.currentCommunity]);


    return {
        communityStateValue,
        leaveCommunity,
        joinCommunity,
        onJoinOrLeaveCommunity,
        loading,
        currentCommunity: communityStateValue.currentCommunity, // Add this line

        // setLoading,
        // error,
      };
    };
    export default useCommunityData;