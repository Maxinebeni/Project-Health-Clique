import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "../../firebase/clientApp";
import { Community, communityState } from "../../atoms/communitiesAtom";
import moment from "moment";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { FaHandHoldingMedical } from "react-icons/fa";
import useSelectFile from "@/hooks/useSelectFile";


type AboutProps = {
  communityData: Community;
  pt?: number;
  onCreatePage?: boolean;
  loading?: boolean;
};

const About: React.FC<AboutProps> = ({
  communityData,
  pt,
  onCreatePage,
  loading,
}) => {
  const [user] = useAuthState(auth); // will revisit how 'auth' state is passed
  const selectFileRef = useRef<HTMLInputElement>(null);
  const setCommunityStateValue = useSetRecoilState(communityState);
  const {selectedFile, setSelectedFile, onSelectFile} = useSelectFile();
  const [description, setDescription] = useState<string>("");




  // Added last!
  const [imageLoading, setImageLoading] = useState(false);


  const onUpdateImage = async () => {
    if (!selectedFile) return;
    setImageLoading(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageURL: downloadURL,
      });
      console.log("HERE IS DOWNLOAD URL", downloadURL);

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadURL,
        } as Community,
      }));
    } catch (error: any) {
      console.log("updateImage error", error.message);
    }
    setImageLoading(false);
  };

  return (
    <Box pt={pt} position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        p={3}
        color="white"
        bg="brand.100"
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          Community Details
        </Text>
        <Icon as={HiOutlineDotsHorizontal} cursor="pointer" />
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 5px 5px">
        {loading ? (
          <Stack mt={2}>
            <SkeletonCircle size="10" />
            <Skeleton height="10px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        ) : (
          <>
            {user?.uid === communityData?.creatorId && (
              <Box
                bg="gray.100"
                width="100%"
                p={2}
                borderRadius={4}
                border="1px solid"
                borderColor="gray.300"
                cursor="pointer"
                maxWidth="300px"
              >
                <Text fontSize="9pt" fontWeight={700} color="blue.500"  whiteSpace="normal" wordBreak="break-all"
>
                {communityData?.description || "Add description"}
                </Text>
              </Box>
            )}
            <Stack spacing={2}>
              <Flex width="100%" p={2} fontWeight={600} fontSize="10pt">
                <Flex direction="column" flexGrow={1}>
                  <Text>
                    {communityData?.numberOfMembers?.toLocaleString()}
                  </Text>
                  <Text>Members</Text>
                </Flex>
                <Flex direction="column" flexGrow={1}>
                  <Text>1</Text>
                  <Text>Online</Text>
                </Flex>
              </Flex>
              <Divider />
              <Flex
                align="center"
                width="100%"
                p={1}
                fontWeight={500}
                fontSize="10pt"
              >
                <Icon as={RiCakeLine} mr={2} fontSize={18} />
                {communityData?.createdAt && (
                  <Text>
                    Created{" "}
                    {moment(
                      new Date(communityData.createdAt!.seconds * 1000)
                    ).format("MMM DD, YYYY")}
                  </Text>
                )}
              </Flex>
              {!onCreatePage && (
                <Link href={`/healthclique/${communityData.id}/submit`}>
                  <Button mt={3} height="30px" >
                    Create Post
                  </Button>
                </Link>
              )}
              {/* !!!ADDED AT THE VERY END!!! INITIALLY DOES NOT EXIST */}
              {user?.uid === communityData?.creatorId && (
                <>
                  <Divider />
                  <Stack fontSize="10pt" spacing={1}>
                    <Text fontWeight={600}>Admin</Text>
                    <Flex align="center" justify="space-between">
                      <Text
                        color="blue.500"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                        onClick={() => selectFileRef.current?.click()}
                      >
                        Change Image
                      </Text>
                      {communityData?.imageURL || selectedFile ? (
                        <Image
                          borderRadius="full"
                          boxSize="40px"
                          src={selectedFile || communityData?.imageURL}
                          alt="Dan Abramov"
                        />
                      ) : (
                        <Icon
                          as={FaHandHoldingMedical }
                          fontSize={40}
                          color="blue.400"
                          mr={2}
                        //   bg='blue.400'
                        />
                      )}
                    </Flex>
                    {selectedFile &&
                      (imageLoading ? (
                        <Spinner />
                      ) : (
                        <Text cursor="pointer" onClick={onUpdateImage}>
                          Save Changes
                        </Text>
                      ))}
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/x-png,image/gif,image/jpeg"
                      hidden
                      ref={selectFileRef}
                      onChange={onSelectFile}
                    />
                  </Stack>
                </>
              )}
            </Stack>
          </>
        )}
      </Flex>
    </Box>
  );
};
export default About;
