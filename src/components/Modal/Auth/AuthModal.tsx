import { authModalState } from "@/atoms/authModalAtom";
import { useDisclosure, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Flex, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import AuthInputs from "./AuthInputs";
import OAuthButtons from "./OAuthButtons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import ResetPassword from "./ResetPassword";

const AuthModal: React.FC = () => {
    const [modalState, setModalState] = useRecoilState(authModalState);
    const [user, loading, error] = useAuthState(auth);

    const handleClose = () => {
        setModalState((prev) => ({
            ...prev,
            open: false,
        }));
    };

    useEffect(() => {
        if (user) handleClose();
    }, [user]);

    return (
        <Modal isOpen={modalState.open} onClose={handleClose}>
            <ModalOverlay />
            <Flex justifyContent="center" alignItems="center" height="100vh">
                <ModalContent width="400px" maxW="90vw">
                    <ModalHeader textAlign="center">
                        <div style={{ position: "relative", width: "100%" }}>
                            <img src="images/au.png" alt="Description of your image" style={{ width: "100%", height: "70px" }} />
                            <div style={{ position: "absolute", top: "20px", left: "0", right: "0", textAlign: "center", color: "black" }}>
                                {modalState.view === "login" && "WELCOME BACK! LOGIN"}
                                {modalState.view === "signup" && "GET STARTED. SIGN UP"}
                                {modalState.view === "resetPassword" && "Reset Password"}
                            </div>
                        </div>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" pb={6}>
                        <Flex direction="column" align="center" justify="center" width="70%">
                            {modalState.view === 'login' || modalState.view === 'signup' ? (
                                <>
                                    <OAuthButtons />
                                    <Text color="gray.500" fontWeight={800}>OR</Text>
                                    <AuthInputs />
                                </>
                            ) : (
                                <ResetPassword />
                            )}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Flex>
        </Modal>
    );
};

export default AuthModal;
