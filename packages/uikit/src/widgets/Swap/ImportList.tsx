import { useTranslation } from "@pancakeswap/localization";
import { useTheme } from "@pancakeswap/hooks";
import { useState } from "react";
import styled from "styled-components";
import { AutoColumn, Flex, Link, Text, Checkbox, Button, Message, Box, RowBetween, RowFixed } from "../../components";
import { ListLogo } from "./ListLogo";

interface ImportProps {
  listURL: string;
  listLogoURI: string | undefined;
  listName: string;
  listTokenLength: number;
  onAddList: () => void;
  addError: string | null;
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const TextDot = styled.div`
  height: 3px;
  width: 3px;
  background-color: ${({ theme }) => theme.colors.text};
  border-radius: 50%;
`;

const Card = styled(Box)<{
  width?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
}>`
  width: ${({ width }) => width ?? "100%"};
  padding: ${({ padding }) => padding ?? "1.25rem"};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius ?? "16px"};
  background-color: ${({ theme }) => theme.colors.background};
`;

export function ImportList({ listURL, listLogoURI, listName, listTokenLength, onAddList, addError }: ImportProps) {
  const { theme } = useTheme();

  const { t } = useTranslation();

  // user must accept
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Wrapper>
      <AutoColumn gap="md">
        <AutoColumn gap="md">
          <Card width="370px" padding="12px 20px">
            <RowBetween>
              <RowFixed flexWrap="nowrap">
                {listLogoURI && <ListLogo logoURI={listLogoURI} size="40px" />}
                <AutoColumn gap="sm" style={{ marginLeft: "20px" }}>
                  <RowFixed>
                    <Text bold mr="6px">
                      {listName}
                    </Text>
                    <TextDot />
                    <Text small color="textSubtle" ml="6px">
                      {listTokenLength} tokens
                    </Text>
                  </RowFixed>
                  <Link
                    style={{ width: "100%", overflowX: "scroll" }}
                    small
                    external
                    ellipsis
                    href={`https://tokenlists.org/token-list?url=${listURL}`}
                  >
                    {listURL}
                  </Link>
                </AutoColumn>
              </RowFixed>
            </RowBetween>
          </Card>

          <Message variant="danger">
            <Flex flexDirection="column">
              <Text fontSize="20px" textAlign="center" color={theme.colors.failure} mb="16px">
                {t("Import at your own risk")}
              </Text>
              <Text color={theme.colors.failure} mb="8px">
                {t(
                  "By adding this list you are implicitly trusting that the data is correct. Anyone can create a list, including creating fake versions of existing lists and lists that claim to represent projects that do not have one."
                )}
              </Text>
              <Text bold color={theme.colors.failure} mb="16px">
                {t("If you purchase a token from this list, you may not be able to sell it back.")}
              </Text>
              <Flex alignItems="center">
                <Checkbox
                  name="confirmed"
                  type="checkbox"
                  checked={confirmed}
                  onChange={() => setConfirmed(!confirmed)}
                  scale="sm"
                />
                <Text ml="10px" style={{ userSelect: "none" }}>
                  {t("I understand")}
                </Text>
              </Flex>
            </Flex>
          </Message>

          <Button disabled={!confirmed} onClick={onAddList}>
            {t("Import")}
          </Button>
          {addError ? (
            <Text color="failure" style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
              {addError}
            </Text>
          ) : null}
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  );
}
