import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { Button, Flex, Input, Text, Toast  } from "@chakra-ui/react";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";



type LoginProps = {
  };

  
const Login: React.FC<LoginProps> = () => {
    const setAuthModalState =useSetRecoilState(authModalState);
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
      });

    const [signInWithEmailAndPassword, user, loading, error] =
     useSignInWithEmailAndPassword(auth);
    

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      signInWithEmailAndPassword(loginForm.email, loginForm.password);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>)=> {
        setLoginForm((prev) => ({
            ...prev,
              [event?.target.name]: event.target.value,
            }));
          };      
    
    return (
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
        <Text textAlign="center" mt={2} fontSize="10pt" color="red">
        {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
        <Button
          width="100%"
          height="36px"
          mb={2}
          mt={2}
          type="submit"
          isLoading= {loading}
        >
         LOG IN
        </Button>

        <Flex justifyContent="center" mb={2}>
        <Text fontWeight={500} mr={1}>
          Forgot your password?
        </Text>
        <Text
          color="blue.500"
          cursor="pointer"
          onClick={() => setAuthModalState((prev) => ({
            ...prev,
            view: "resetPassword",
        }))}
          fontWeight={600}
        >
          Reset
        </Text>
      </Flex>
        <Flex fontSize="9pt" justifyContent="center" mb={2}>
        <Text mr={1} fontWeight={500}>Not part of the Clique yet? </Text>
        <Text color="blue.500" fontWeight={700} cursor="pointer" 
         onClick={() => setAuthModalState((prev) => ({
            ...prev,
            view: "signup",
        }))}
       >SIGN UP</Text>
      </Flex>
      </form>
    );
  };
  export default Login;


  