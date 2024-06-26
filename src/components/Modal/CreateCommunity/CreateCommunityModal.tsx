import React, { useState, useEffect } from "react";
import { Box, Button, Checkbox, Divider, Flex, Icon, Input, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, Textarea } from "@chakra-ui/react";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import { doc, getDocs, collection, where, query, runTransaction, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import useDirectory from "@/hooks/useDirectory";

type CreateCommunityModalProps= {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ 
  open, handleClose
}) => {

    const [user] = useAuthState(auth);
    const [communityName, setCommunityName] = useState('');
    const [description, setDescription] = useState('');

    const [charsRemaining, setCharsRemaining] = useState(21);
    const [communityType, setCommunityType] = useState("public");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
    const router = useRouter();
    const {toggleMenuOpen} = useDirectory();

    useEffect(() => {
      if (user) {
        fetchJoinedCommunities();
      }
    }, [user]);

    const fetchJoinedCommunities = async () => {
      try {
        if (user) { // Add conditional check for user
          const userCommunitiesRef = collection(firestore, `users/${user.uid}/communitySnippets`);
          const userCommunitiesSnapshot = await getDocs(userCommunitiesRef);
          const userCommunities = userCommunitiesSnapshot.docs.map(doc => doc.id);
          setJoinedCommunities(userCommunities);
        }
      } catch (error) {
        console.error("Error fetching joined communities:", error);
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 21) return;
        setCommunityName(event.target.value);
        setCharsRemaining(21 - event.target.value.length);
    };

    const onCommunityTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        const {
          target: { name },
        } = event;
        if (name === communityType) return;
        setCommunityType(name);
      };

      const handleCreateCommunity = async () => {
        if (error) setError("");
        const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    
        if (format.test(communityName) || communityName.length < 3) {
          setError(
            "Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores."
          );
          return;
        }

        setLoading(true);

        try {

        const communityDocRef = doc(firestore, "communities", communityName);

        await runTransaction(firestore, async (transaction) =>{
          const communityDoc = await transaction.get(communityDocRef);
          if (communityDoc.exists()) {
            throw new Error(`Sorry, ${communityName} is taken. Please Try another.`);
          } 
          transaction.set(communityDocRef, {
            creatorId: user?.uid,
            createdAt: serverTimestamp(),
            numberOfMembers: 1,
            privacyType: communityType,
            description: description, // Add description field
     
         });
        //  create community snippet
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,

          }

        );

        
        });
        const absolutePath = `/healthclique/${communityName}`;

        handleClose();
        toggleMenuOpen();
        router.push(absolutePath);
      } catch (error: any) {
            console.log('handleCreateCommunity error', error);
            setError(error.message);
          }
      
         setLoading(false)
    
    
    };
       
  return (
    <>      
    <Modal isOpen={open} onClose={handleClose}>
    <ModalOverlay zIndex={10}/>
    <ModalContent zIndex={11}>
    <ModalHeader mt={4} mr={2} fontSize={14} color="gray.400">
            Create Community clique
          </ModalHeader>
    <Box pr={3} pl={3}>  
    {/* <Divider/>   */}
        <ModalCloseButton/>
        <ModalBody display="flex" flexDirection="column" padding="10px 0px"> 
        <Text fontWeight={600} fontSize={15}>
            Name of Group
          </Text>
          <Text
            color="gray.400"
            fontSize ={11}
            mb = {2}
          >
            Community Names cannot be changed after creation
          </Text>
          <Input
            value= {communityName}
            position="relative"
            name="name"
            onChange={handleChange }
            pl="22px"
            type={""}
            size="sm"
          />
         <Text
            fontSize="9pt"
            color={charsRemaining === 0 ? "red" : "gray.500"}
            pt={2}
            mb={2}
          >
            {charsRemaining} Characters remaining
          </Text>
          <Text fontSize="9pt" color="red" pt={1}>
            {error}
          </Text>
          <Text
            color="gray.400"
            fontSize ={11}
            mb = {2}
          >
            Enter Community Description
          </Text>
          <Textarea
             value={description}
             position="relative"
             onChange={(event) => setDescription(event.target.value)}
             fontSize="9pt"
             size="sm"
             pl="22px"
             rows = {3}
 
/>
          <Box  mt={4} mb={4}>
            <Text fontWeight={600} fontSize={15}>
                Community Type
            </Text>
            <Stack spacing={2} pt={1}>
              <Checkbox
                colorScheme="blue"
                name="public"
                isChecked={communityType === "public"}
                onChange={onCommunityTypeChange}
              >
                <Flex alignItems="center">
                  <Icon as={BsFillPersonFill} mr={2} color="blue.500" />
                  <Text fontSize="10pt" mr={1}>
                    Public
                  </Text>
                  <Text fontSize="7pt" color="gray.500" pt={1}>
                    Anyone can view, post, and comment to this community
                  </Text>
                </Flex>
              </Checkbox>
              <Checkbox
                colorScheme="blue"
                name="restricted"
                isChecked={communityType === "restricted"}
                onChange={onCommunityTypeChange}
              >
                <Flex alignItems="center">
                  <Icon as={BsFillEyeFill} color="blue.500" mr={2} />
                  <Text fontSize="10pt" mr={1}>
                    Restricted
                  </Text>
                  <Text fontSize="7pt" color="gray.500" pt={1}>
                    Anyone can view this community, but only approved users can
                    post
                  </Text>
                </Flex>
              </Checkbox>
              <Checkbox
                colorScheme="blue"
                name="private"
                isChecked={communityType === "private"}
                onChange={onCommunityTypeChange}
              >
                <Flex alignItems="center">
                  <Icon as={HiLockClosed} color="blue.500" mr={2} />
                  <Text fontSize="10pt" mr={1}>
                    Private
                  </Text>
                  <Text fontSize="7pt" color="gray.500" pt={1}>
                    Only approved users can view and submit to this community
                  </Text>
                </Flex>
              </Checkbox>
            </Stack>

          </Box>
</ModalBody>
</Box>
<ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
        <Button variant="outline" height="30px" mr={2} onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="solid"
          height="30px"
          onClick={handleCreateCommunity}
          isLoading={loading}
        >
        Create Community
</Button>
      </ModalFooter>
      </ModalContent>
      </Modal>
</>
  );
};

export default CreateCommunityModal;
