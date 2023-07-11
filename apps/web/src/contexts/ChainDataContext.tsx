import {
      createContext,
      ReactNode,
      useContext,
      useEffect,
      useState,
    } from "react";
    
    import { EIP155ChainData } from "views/Notifications/chains/chains";
    import { ChainNamespaces, ChainsMap, getAllChainNamespaces } from "views/Notifications/helpers";

    /**
     * Types
     */
    interface IContext {
      chainData: ChainNamespaces;
    }
    
    /**
     * Context
     */
    export const ChainDataContext = createContext<IContext>({} as IContext);
    
    /**
     * Provider
     */
    export function ChainDataContextProvider({
      children,
    }: {
      children: ReactNode | ReactNode[];
    }) {
      const [chainData, setChainData] = useState<ChainNamespaces>({});
    
      const loadChainData = async () => {
        const namespaces = getAllChainNamespaces();
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const chainData: ChainNamespaces = {};
        await Promise.all(
          namespaces.map(async (namespace) => {
            let chains: ChainsMap | undefined;
            switch (namespace) {
              case "eip155":
                chains = EIP155ChainData;
                break;
              default:
                console.error("Unknown chain namespace: ", namespace);
            }
    
            if (typeof chains !== "undefined") {
              chainData[namespace] = chains;
            }
          })
        );
    
        setChainData(chainData);
      };
    
      useEffect(() => {
        loadChainData();
      }, []);
    
      return (
        <ChainDataContext.Provider
          value={{
            chainData,
          }}
        >
          {children}
        </ChainDataContext.Provider>
      );
    }
    
    export function useChainData() {
      const context = useContext(ChainDataContext);
      if (context === undefined) {
        throw new Error(
          "useChainData must be used within a ChainDataContextProvider"
        );
      }
      return context;
    }
    