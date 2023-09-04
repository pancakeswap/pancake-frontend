import { useState, useMemo, useEffect } from "react";
import { styled } from "styled-components";
import debounce from "lodash/debounce";
import { useTranslation } from "@pancakeswap/localization";
import { Input } from "../Input";

const StyledInput = styled(Input)`
  border-radius: 16px;
  margin-left: auto;
`;

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`;

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  initialValue?: string;
}

const SearchInput: React.FC<React.PropsWithChildren<Props>> = ({
  onChange: onChangeCallback,
  placeholder = "Search",
  initialValue,
}) => {
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();

  const debouncedOnChange = useMemo(
    () => debounce((e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e), 500),
    [onChangeCallback]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    debouncedOnChange(e);
  };
  useEffect(() => {
    if (initialValue) {
      setSearchText(initialValue);
    }
  }, [initialValue]);

  return (
    <InputWrapper>
      <StyledInput value={searchText} onChange={onChange} placeholder={t(placeholder)} />
    </InputWrapper>
  );
};

export default SearchInput;
