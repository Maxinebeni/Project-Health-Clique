import { useState } from "react";
import { Button, Checkbox, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const UserInterestsModal: React.FC<{ isOpen: boolean; onClose: () => void; userUid: string }> = ({ isOpen, onClose, userUid }) => {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [country, setCountry] = useState("");
  const [healthInterests, setHealthInterests] = useState("");

  const handleSave = async () => {
    try {
      const db = getFirestore();
      await setDoc(doc(db, "user_interests", userUid), {
        name,
        profession,
        country,
        healthInterests,
      });
      onClose();
    } catch (error) {
      console.error("Error saving user interests:", error);
      // Handle error here
    }
  };


//   const handleInterestChange = (interest: string) => {
//     if (healthInterests.includes(interest)) {
//       setHealthInterests(healthInterests.filter(item => item !== interest));
//     } else {
//       if (healthInterests.length < maxInterests) {
//         setHealthInterests([...healthInterests, interest]);
//       } else {
//         // You can show a message here that the user can select up to 5 interests
//       }
//     }
//   };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Your Interests</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <Text>We want you to have a personalized experience on the app and so we want you to tell us more about yourself</Text>
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Profession" value={profession} onChange={(e) => setProfession(e.target.value)} />
          <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          <Text>Health Interests (up to 5)</Text>
          <Flex>
            {["Fitness", "Yoga", "Meditation", "Healthy Eating", "Running", "Cycling", "Swimming"].map(interest => (
              <Checkbox key={interest} isChecked={healthInterests.includes(interest)} mr={2}>
                {interest}
              </Checkbox>
            ))}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserInterestsModal;
