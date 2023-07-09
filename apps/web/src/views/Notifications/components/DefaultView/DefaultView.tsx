import { useContext } from "react";
import { PushContext } from "contexts/PushContext";
import { Box, Button, Flex, Heading } from "@pancakeswap/uikit";

const DefaultView: React.FC<{
  handleAuth: () => void;
  handleSign: () => void;
}> = ({ handleAuth, handleSign }) => {
  const { initialized } = useContext(PushContext);
  return (
    <Box>
      <Box position={{ position: "relative" }}>
        <Flex
          style={{ position: "relative", top: "1.5em" }}
          justifyContent="center"
        >
          <Flex
            style={{ position: "absolute", top: "5%" }}
            justifyContent="center"
          >
            {/* <Image
              style={{ filter: "blur(10px)" }}
              src="/auth.png"
              alt="auth"
            /> */}
          </Flex>
          {/* <Image style={{ filter: "blur(1px)" }} src="/auth.png" alt="auth" /> */}
        </Flex>
      </Box>
      <Flex
        flexDirection="column"
        padding="2em 3em"
        borderRadius="24px"
        className="bg-secondary"
        alignItems="center"
      >
        <Heading>Sign in</Heading>
        <Button
          paddingY="1.25em"
          onClick={handleAuth}
          disabled={!initialized}
        >
          <Flex>
            {/* <Image src="/wc.png" fit="scale-down" alt="WC" /> */}
            <span style={{ color: "white" }}>
              {initialized ? "WalletConnect Auth" : "Initializing..."}
            </span>
          </Flex>
        </Button>
        <Button
        variant="primary"
          paddingY="1.25em"
          onClick={handleSign}
          disabled={!initialized}
        >
          <Flex>
            {/* <Image src="/wc.png" fit="scale-down" alt="WC" /> */}
            <span style={{ color: "white" }}>
              {initialized ? "WalletConnect Sign" : "Initializing..."}
            </span>
          </Flex>
        </Button>
      </Flex>
    </Box>
  );
};

export default DefaultView;
