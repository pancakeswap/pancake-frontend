import { styled } from "styled-components";
import { Image } from "../Image";
import emptyMessageIcon from "./assets/empty-message.svg";

const EmptyTips = styled.div`
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  margin: 10px;
`;
export const EmptyMessage = ({ msg }: { msg?: string }) => (
  <>
    <Image src={emptyMessageIcon} width={80} height={80} />
    <EmptyTips>{msg ?? "No data"}</EmptyTips>
  </>
);
