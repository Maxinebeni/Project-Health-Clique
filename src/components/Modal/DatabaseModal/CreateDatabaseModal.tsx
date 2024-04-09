import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  ModalFooter,
  FormErrorMessage,
  Spinner,
} from "@chakra-ui/react";
import { ArticlePost } from "@/atoms/articleAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import { User } from "firebase/auth";
import { Timestamp, addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import router, { useRouter } from "next/router";
import DetailsModal from "../DetailsModal/detailsModal";

interface CreateDatabaseModalProps {
  open: boolean;
  handleClose: () => void;
  user?: User | null; // Make the user prop optional or nullable
}

const CreateDatabaseModal: React.FC<CreateDatabaseModalProps> = ({
  user,
  open,
  handleClose,
}) => {
  const [articleNameUrl, setArticleNameUrl] = useState("");
  const [articleLink, setArticleLink] = useState("");
  const [articleNamePdf, setArticleNamePdf] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfURL, setPdfURL] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [pdfOrUrlError, setPdfOrUrlError] = useState("");
  const [pdfTitleError, setPdfTitleError] = useState("");
  const [option, setOption] = useState<"url" | "file">("url");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const openDetailsModal = () => {
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileTypes = ['application/pdf'];
    const selectedFile = event.target.files && event.target.files[0];
  
    if (selectedFile && fileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      setError("Please upload a valid PDF file.");
      setLoading(false);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleArticleNameUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setArticleNameUrl(event.target.value);
  };

  const handleArticleLinkChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setArticleLink(event.target.value);
  };

  const handleArticleNamePdfChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setArticleNamePdf(event.target.value);
  };

  const handleOptionChange = (value: "url" | "file") => {
    setOption(value);
    setArticleNameUrl('');
    setArticleLink('');
    setArticleNamePdf('');
    setFile(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setLoading(true);
  
    const newArticleNameUrl = articleNameUrl || "";
    const newArticleLink = articleLink || "";
    const newArticleNamePdf = articleNamePdf || "";
  
    if (!newArticleNameUrl && !newArticleNamePdf) {
      setTitleError("Please enter a title.");
      setIsLoading(false);
      return;
    }
  
    if (option === "url" && !newArticleLink) {
      setPdfOrUrlError("Please enter a URL or switch to the file upload option.");
      setIsLoading(false);
      return;
    }
  
    if (option === "file" && !file) {
      setPdfOrUrlError("Please upload a file or switch to the URL option.");
      setIsLoading(false);
      return;
    }
  
    if (option === "file" && !newArticleNamePdf) {
      setPdfTitleError("Please enter a PDF title.");
      setIsLoading(false);
      return;
    }
  
    const currentUser: User | null = auth.currentUser;
  
    if (!currentUser) {
      console.error("No user signed in.");
      setLoading(false);
      return;
    }
  
    const requestOptions = {
      method: "POST",
      headers: {},
    };
  
    const formData = new FormData();
    formData.append("title", option === "url" ? articleNameUrl : articleNamePdf);
    formData.append("input_type", option);
  
    if (option === "url") {
      formData.append("url_link", articleLink);
    } else if (option === "file") {
      formData.append("pdf_file", file as Blob);
    } else {
      console.error("Error processing request: ", error);
    }
  
    try {
      const response = await fetch(
        "https://article-api-0ktg.onrender.com/classify",
        { ...requestOptions, body: formData }
      );
      const data = await response.json();
  
      if (response.ok) {
        const { prediction_message, summary, title, pdfURL, url } = data;
  
        if (!summary) {
          setError("Article not health-related. Please try again.");
          setIsLoading(false);
          return;
        }

        setMessage(prediction_message);
        if (summary) {
          setSummary(summary);
        }

        // Save article data to Firestore
        const currentUser: User | null = auth.currentUser;
        if (currentUser) {
          const articleData = {
            creatorDisplayName: user?.email!.split("@")[0],
            creatorId: currentUser.uid,
            createdAt: serverTimestamp(),
            pdfURL: pdfURL || "", // Set pdfURL to the value received from the API, or an empty string if it's undefined
            summary: summary,
            title: option === "url" ? newArticleNameUrl : newArticleNamePdf,
            url: newArticleLink || "",

                  };
  
          try {
            // Add a new document to the Firestore collection named "articleposts"
            const docRef = await addDoc(collection(firestore, "articleposts"), articleData);
            console.log("Document written with ID: ", docRef.id);
          } catch (error) {
            console.error("Error adding document: ", error);
          }
        }
  
        setMessage(prediction_message);
  
        // Set loading to false here
        setIsLoading(false);
  
        // Set message to "Article is health-related" for 2 seconds
        setMessage("Article is health-related.");
        setTimeout(() => {
          // Update message to "Saved successfully!" after 2 seconds
          setMessage("Saved successfully!");
          // Close modal and redirect after another 3 seconds
          setTimeout(() => {
            handleClose();
            setMessage("");
            setSummary("");
            setLoading(false);
            router.push("/healthclique/Articles");
          }, 3000);
        }, 2000);
      } else {
        setMessage(data.error || "An error occurred while processing the request.");
      }
    } catch (error) {
      console.error("Error processing request: ", error);
      setMessage("Error: " + error);
      setIsLoading(false);
    }
  
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      setArticleNameUrl('');
      setArticleNamePdf('');
      setArticleLink('');
      setFile(null);
      setOption("url");
      setLoading(false);
      setMessage('');
      setError('');
      setSummary('');
    }
  }, [open]);

  return (
    <>
      <Modal isOpen={open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mt={4} mr={2} fontSize={14} color="gray.400">
            Add an article to the Database
            <Text
              fontSize={12}
              color="brand.100"
              onClick={openDetailsModal}
            >
              Click here to see the rules for adding to Article Database
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <FormControl mb={4}>
        <FormLabel>Choose Option</FormLabel>
        <RadioGroup defaultValue="url" onChange={handleOptionChange}>
          <Radio value="url">URL</Radio>
          <Radio value="file">File Upload</Radio>
        </RadioGroup>
      </FormControl>
      {option === "url" ? (
        <>
          <FormControl mb={4}>
            <FormLabel>Article Name</FormLabel>
            <Input
              value={articleNameUrl}
              onChange={handleArticleNameUrlChange}
              placeholder="Enter article name"
            />
            <FormErrorMessage>{titleError}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isInvalid={!!pdfOrUrlError}>
            <FormLabel>URL</FormLabel>
            <Input
              value={articleLink}
              onChange={handleArticleLinkChange}
              placeholder="Enter URL"
            />
            <FormErrorMessage>{pdfOrUrlError}</FormErrorMessage>
          </FormControl>
        </>
      ) : (
        <>
          <FormControl mb={4} isInvalid={!!pdfTitleError}>
            <FormLabel>PDF Title</FormLabel>
            <Input
              value={articleNamePdf}
              onChange={handleArticleNamePdfChange}
              placeholder="Enter PDF title"
            />
            <FormErrorMessage>{pdfTitleError}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Upload PDF</FormLabel>
            <Input type="file" onChange={handleFileUpload} />
          </FormControl>
              </>
            )}
            {error && <Text color="red.500">{error}</Text>}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" height="30px" mr={2} onClick={handleSubmit}>
              Add
            </Button>
            <Button variant="solid" height="30px" onClick={handleClose}>
              Close
            </Button>
          </ModalFooter>
          {isLoading && (
            <Spinner
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              color="green.500"
            />
          )}
          {isLoading && (
            <Text
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, 50%)"
              fontSize="14px"
              color="gray.500"
            >
              Analyzing. Please wait...Do not close modal
            </Text>
          )}
          {message && (
            <Text textAlign="center" color={message.includes('Error') ? 'red.500' : 'green.500'} mt={1} mb={2}>
              {message}
            </Text>
          )}
        </ModalContent>
      </Modal>
      <DetailsModal isOpen={isDetailsModalOpen} onClose={closeDetailsModal} />
    </>
  );
};

export default CreateDatabaseModal;
