import { useCallback, useEffect, useMemo, useState } from "react";
import { css, styled } from "styled-components";
import { Box } from "../Box";
import { Checkbox } from "../Checkbox";
import { DropDownHeader } from "../StyledComponents";
import { ArrowDropDownIcon } from "../Svg";
import { Text } from "../Text";

const DropDownListContainer = styled.div`
  min-width: 100px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.input};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  width: 100%;
`;

const DropDownContainer = styled(Box)<{ isOpen: boolean }>`
  cursor: pointer;
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  height: 40px;
  min-width: 125px;
  user-select: none;
  z-index: 20;

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
        border-radius: 16px 16px 0 0;
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        border-top-width: 0;
        border-radius: 0 0 16px 16px;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
      }
    `}

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`;

const ListItem = styled.li`
  display: flex;
  list-style: none;
  padding: 8px 16px;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }

  input {
    margin: 0 8px 0 0;
  }
`;

export interface MultiSelectorOptionsProps {
  id: number;
  label: string;
  value: any;
}

export interface MultiSelectorProps {
  pickMultiSelect: Array<number>;
  placeHolderText: string;
  onOptionChange: (data: Array<number>) => void;
  options: MultiSelectorOptionsProps[];
  closeDropdownWhenClickOption?: boolean;
}

const MultiSelector: React.FunctionComponent<React.PropsWithChildren<MultiSelectorProps>> = ({
  options,
  pickMultiSelect,
  onOptionChange,
  placeHolderText,
  closeDropdownWhenClickOption = true,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const isCheckboxValid = useCallback((id: number) => pickMultiSelect.includes(id), [pickMultiSelect]);

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen);
    event.stopPropagation();
  };

  const onOptionClicked = (id: number) => (e: React.MouseEvent) => {
    e.stopPropagation();

    if (closeDropdownWhenClickOption) {
      setIsOpen(false);
    }

    const hasPickedData = isCheckboxValid(id);
    if (hasPickedData) {
      const newData = pickMultiSelect.filter((i) => i !== id);
      onOptionChange(newData);
    } else {
      const newData = [...pickMultiSelect, id];
      onOptionChange(newData);
    }
  };

  const hasOptionsPicked = useMemo(() => {
    if (pickMultiSelect.length > 0) {
      const hasIndex = options.filter((i) => pickMultiSelect.includes(i.id));
      return hasIndex.length > 0;
    }
    return false;
  }, [options, pickMultiSelect]);

  const headerTextDisplay = useMemo(() => {
    const textDisplay = pickMultiSelect
      .map((i) => options.find((j) => j.id === i)?.label)
      .filter((i) => Boolean(i))
      .join(", ");

    return textDisplay;
  }, [options, pickMultiSelect]);

  return (
    <DropDownContainer isOpen={isOpen} {...props}>
      <DropDownHeader onClick={toggling}>
        {!hasOptionsPicked && placeHolderText ? (
          <Text ellipsis color="text" pr="20px">
            {placeHolderText}
          </Text>
        ) : (
          <Text ellipsis color="text" pr="20px">
            {headerTextDisplay}
          </Text>
        )}
        <ArrowDropDownIcon color="text" onClick={toggling} />
      </DropDownHeader>
      <DropDownListContainer>
        <DropDownList>
          {options.map((option) => (
            <ListItem key={option.id} onClick={onOptionClicked(option.id)}>
              <Checkbox scale="xs" color="secondary" checked={isCheckboxValid(option.id)} />
              {option.label}
            </ListItem>
          ))}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  );
};

export default MultiSelector;
