import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Stack,
  Textarea,
  Image,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
    Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { useRecoilState, useSetRecoilState } from "recoil";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import TextInputs from "./PostForm/TextInputs";
import ImageUpload from "./PostForm/ImageUpload";
import { firestore, storage } from "@/firebase/clientApp";
import TabItem from "./TabItem";
import { Post } from "@/atoms/postsAtom";
import useSelectFile from "@/hooks/useSelectFile";


type NewPostFormProps = {
    // communityId: string;
    communityImageURL?: string;
    user: User;
  };  

const formTabs: TabItem[] =  [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};


const NewPostForm: React.FC<NewPostFormProps> = ({
  // communityId,
  communityImageURL,
  user,
}) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({title: "", body: "",
  });
  const {selectedFile, 
    setSelectedFile,
    onSelectFile
} = useSelectFile();
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
//   const setPostItems = useSetRecoilState(postState);


  const handleCreatePost = async () => {
    setLoading(true);
    // const { title, body } = textInputs;
    const {communityId} = router.query;
      const newPost: Post = {
        communityId: communityId as string,
        creatorId: user.uid,
        creatorDisplayName: user.email!.split("@")[0],
        title: textInputs.title,
        body: textInputs.body,
        numberOfComments: 0,
        voteStatus: 0,
        createdAt: serverTimestamp() as Timestamp,
        communityImageURL: communityImageURL || "",
      };

      try {
        const postDocRef = await addDoc(collection(firestore, "posts"), newPost); 

      // // check if selectedFile exists, if it does, do image processing
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
        console.log("HERE IS DOWNLOAD URL", downloadURL);
      }

      // Clear the cache to cause a refetch of the posts
    //   setPostItems((prev) => ({
    //     ...prev,
    //     postUpdateRequired: true,
    //   }));
      router.back();
    } catch (error) {
      console.log("handleCreatePost error", error);
      setError("Error creating post");
    }
    setLoading(false);


  };


  const onTextChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item, index) => (
          <TabItem
            key={index}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            selectFileRef={selectFileRef}
            onSelectImage={onSelectFile}
          />
        )}
      </Flex>
      {error &&(
        <Alert status='error'>
        <AlertIcon />
        <Text mr ={2}>Error Creating Post</Text>
      </Alert>

      )}
    </Flex>
  );
};
export default NewPostForm;
