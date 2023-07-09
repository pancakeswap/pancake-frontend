import { ReactNode } from "react";
import useInitialization from "views/Notifications/hooks/useInitialization";
import { authClient, pushClient, signClient } from "views/Notifications/utils/clients";
import { PushContext } from "./PushContext";

interface IPushProviderProps {
  children: ReactNode;
}

const PushProvider: React.FC<IPushProviderProps> = ({ children }) => {
  const { initialized } = useInitialization();

  return (
    <PushContext.Provider
      value={{ initialized, authClient, pushClient, signClient }}
    >
      {children}
    </PushContext.Provider>
  );
};

export default PushProvider;
