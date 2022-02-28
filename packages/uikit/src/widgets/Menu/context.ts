import { createContext, ElementType } from "react";

export const MenuContext = createContext<{ linkComponent: ElementType }>({ linkComponent: "a" });
