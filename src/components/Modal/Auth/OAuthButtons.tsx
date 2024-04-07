import { auth, firestore } from "@/firebase/clientApp";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";


const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth);

//   const renderError = () => {
//     if (error) {
//       let errorMessage: string;

//       // Check if error.message is available, otherwise fallback to error code
//       if (error.message) {
//         errorMessage = error.message;
//       } else {
//         errorMessage = `Error occurred: ${error.code}`;
//       }

//       return (
//         <Text textAlign="center" fontSize="10pt" color="red" mt={2}>
//           {errorMessage}
//         </Text>
//       );
//     }
    
//     return null; // Return null if no error
//   };

  const createUserDocument = async(user:User) =>{
    const userDocRef= doc(firestore, 'users', user.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (userCred){
      createUserDocument(userCred.user)
    }
  }, [userCred]

  );

  return (
    <Flex direction="column" mb={4} width="100%">
      <Button
        variant="oauth"
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image src="/images/google.jpg" height="20px" mr={4}  alt="OAuth"
/>
        Continue with Google
      </Button>
      {error && <Text>{error.message}</Text>}
    </Flex>
  );
};
export default OAuthButtons;
