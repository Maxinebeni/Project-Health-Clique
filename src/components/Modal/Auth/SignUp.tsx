import { authModalState } from "@/atoms/authModalAtom";
import { Button, Flex, Input, Text, Toast  } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { auth, firestore} from "../../../firebase/clientApp";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { addDoc, collection } from "firebase/firestore";
import { User } from "firebase/auth";
import SignUpModal from "../SignUpModal";




  
const SignUp = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const setAuthModalState =useSetRecoilState(authModalState);
    const [showSignUpModal, setShowSignUpModal] = useState(false); // State to control modal visibility


    const [SignUpForm, setSignUpForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
      });
      const [error, setError] = useState("");


      const [createUserWithEmailAndPassword, userCred, loading, userError] =
      useCreateUserWithEmailAndPassword(auth);
    

      const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (error) setError('');
          // Password validation rules
       const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
       if (!passwordRegex.test(SignUpForm.password)) {
         setError("Password must be at least 8 characters long and contain at least 1 uppercase letter and 1 number");
         return;
  }

        if (SignUpForm.password !== SignUpForm.confirmPassword) {
            setError("Passwords do not match");
            return;
          }      
        createUserWithEmailAndPassword(SignUpForm.email, SignUpForm.password);

        };

      const onChange = (event: React.ChangeEvent<HTMLInputElement>)=> {

        setSignUpForm((prev) => ({
            ...prev,
              [event?.target.name]: event.target.value,
            }));
          };

      const createUserDocument = async(user: User) => {
        await addDoc(collection(firestore, "users"), JSON.parse(JSON.stringify(user)));
      };

      useEffect(() => {
        if (userCred) {
          createUserDocument(userCred.user);
          setShowSignUpModal(true);
        }
      }, [userCred]);
    
    
        
      
    
  
    return (
      <>
      <form onSubmit={onSubmit}>
        <Input
        required
          name="email"
          placeholder="email"
          type="email"
          mb={2}
          onChange={onChange}
          fontSize='10pt'
          _placeholder={{color: "gray.500"}}
          _hover={{
            bg: 'white',
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: 'none',
            bg: 'white',
            border: "1px solid",
            borderColor: "blue.500",
          }}
          bg="gray.200"
        />
        <Input
          required
          name="password"
          placeholder="password"
          type="password"
          mb={2}
          onChange={onChange}
          fontSize='10pt'
          _placeholder={{color: "gray.500"}}
          _hover={{
            bg: 'white',
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: 'none',
            bg: 'white',
            border: "1px solid",
            borderColor: "blue.500",
          }}
          bg="gray.200"

        />
        <Input
          required
          name="confirmPassword"
          placeholder="confirm password"
          type="password"
          mb={2}
          onChange={onChange}
          fontSize='10pt'
          _placeholder={{color: "gray.500"}}
          _hover={{
            bg: 'white',
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: 'none',
            bg: 'white',
            border: "1px solid",
            borderColor: "blue.500",
          }}
          bg="gray.200"

        />{(error || userError) &&(
        <Text textAlign="center" mt={2} fontSize="10pt" color="red">
            {error || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}

        </Text>)}

        <Button
          width="100%"
          height="36px"
          mb={2}
          mt={2}
          type="submit"
          isLoading= {loading}
        >
               SIGN UP
        </Button>
        <Flex fontSize="9pt" justifyContent="center" mb={2}>
        <Text mr={1} fontWeight={400}>Already Have an Account? </Text>
        <Text color="blue.500" fontWeight={700} cursor="pointer" 
         onClick={() => setAuthModalState((prev) => ({
            ...prev,
            view: "login",

        }))}
       >LOG IN</Text>
      </Flex>
      </form>
      <SignUpModal isOpen={isOpen} onClose={onClose} />

     </>



    );
  };
  export default SignUp;


  