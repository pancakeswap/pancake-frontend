// import { FC } from 'react'
import { SWRConfig } from 'swr'

const Archive = ({ fallback }: { fallback: () => void }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <>Archive</>
    </SWRConfig>
  )
}

export default Archive
