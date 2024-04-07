import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { CommunityState, communityState } from "../atoms/communitiesAtom";
import {
  defaultMenuItem,
  DirectoryMenuItem,
  directoryMenuState,
} from "../atoms/directoryMenuAtom";
import { MdHealthAndSafety } from "react-icons/md";

const useDirectory = () => {
  const [directoryState, setDirectoryState] =
    useRecoilState(directoryMenuState);
  const router = useRouter();

  const communityStateValue = useRecoilValue(communityState);

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));

    router?.push(menuItem.link);

    if (directoryState.isOpen) {
      toggleMenuOpen();
    }
  };

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !directoryState.isOpen,
    }));
  };

  useEffect(() => {
    const currentCommunity = communityStateValue.currentCommunity;
  
    if (currentCommunity && currentCommunity.id) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `${currentCommunity.id}`,
          link: `/healthclique/${currentCommunity.id}`,
          imageURL: currentCommunity.imageURL,
          icon: MdHealthAndSafety,
          iconColor: "blue.500",
        },
      }));
    }
  }, [communityStateValue]);
  
  return { directoryState, onSelectMenuItem, toggleMenuOpen };
};

export default useDirectory;
