import { ReactElement } from "react"

export interface TabProps {
  title: string,
}

export interface TabsProps {
  children: ReactElement[],
  startAt?: number,
}
