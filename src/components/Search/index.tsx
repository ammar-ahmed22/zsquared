import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

type SearchProps = {
  onQueryChange?: (q: string) => void;
  placeholder?: string;
};

const Search: React.FC<SearchProps> = ({
  placeholder = "Search",
  onQueryChange = (q) => {},
}) => {
  const [value, setValue] = useState<string>("");

  return (
    <InputGroup colorScheme="brand.dark">
      <InputRightElement
        pointerEvents="none"
        children={<SearchIcon color="gray.300" />}
      />
      <Input
        colorScheme="brand.dark"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onQueryChange(e.target.value);
        }}
      />
    </InputGroup>
  );
};

export default Search;
