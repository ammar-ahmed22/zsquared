import React from "react";
import {
  Image,
  ImageProps,
  Modal,
  ModalOverlay,
  ModalContent,
  TextProps,
  Flex,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { IRichText } from "@z-squared/types";
import RichText from "./RichText";
import { BiX } from "react-icons/bi";

type ImageModalProps = {
  imageProps: ImageProps;
  captionProps: TextProps;
  captionData: IRichText[];
};

const ImageModal: React.FC<ImageModalProps> = ({
  imageProps,
  captionData,
  captionProps,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      my="5"
    >
      <Image
        {...imageProps}
        _hover={{ cursor: "pointer" }}
        onClick={onOpen}
      />
      <RichText
        {...captionProps}
        data={captionData}
        blockKey={"image"}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        autoFocus={false}
        returnFocusOnClose={false}
        trapFocus={false}
        scrollBehavior="outside"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          bg="transparent"
          backdropFilter="blur(10px)"
          boxShadow="none"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDir="column"
        >
          <IconButton
            aria-label="close image modal"
            icon={<BiX />}
            pos="absolute"
            top="0"
            right="0"
            transform="translate(100%, -100%)"
            colorScheme="red"
            fontSize="2rem"
            variant="ghost"
            onClick={onClose}
          />
          <Image {...imageProps} />
          <RichText
            {...captionProps}
            data={captionData}
            blockKey={"image"}
          />
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ImageModal;
