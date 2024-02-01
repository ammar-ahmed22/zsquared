import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
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
    <InputGroup variant="branded">
      <InputRightElement
        pointerEvents="none"
        children={<SearchIcon />}
      />
      <Input
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
