import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'
// import { Toggle } from '@pancakeswap-libs/uikit'
import SearchBox from './Searchbox'

interface Props {
  searchString: string;
  selectedView: boolean; // false: Cardview, true: tableview
  showAllStatus: boolean;
  setViewStatus: (status: boolean) => void;
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 26px 0;
`

const CardIcon = styled.div`
  mask-image: url('/images/icons/card-view.svg');
  width: 18px;
  height: 13px;
  background-color: ${props => props.color ? props.color : '#BDC2C4'};
  margin-right: 15px;
  cursor: pointer;
`

const TableIcon = styled.div`
  mask-image: url('/images/icons/table-view.svg');
  width: 18px;
  height: 13px;
  background-color: ${props => props.color ? props.color : '#BDC2C4'};
  cursor: pointer;
`

const IconWrapper = styled.div`
  display: flex;
`

// const StyledToggle = styled(Toggle)`
//   background-color: red;
// `

export default function FarmHeader({searchString, selectedView, showAllStatus, setViewStatus}: Props): ReactElement {
  const [searchText, setSearchText] = useState("")
  const [isShowAll, setIsShowAll] = useState<boolean>(false)

  const toggle = () => setIsShowAll(!isShowAll)
  return (
    <Container>
      <IconWrapper>
        <CardIcon color={!selectedView && '#1FC7D4'} onClick={() => setViewStatus(false)} />
        <TableIcon color={selectedView && '#1FC7D4'} onClick={() => setViewStatus(true)} />
        {/* <StyledToggle checked={isShowAll} onChange={toggle} /> */}
      </IconWrapper>
      <SearchBox searchText={searchText} onChange={setSearchText} />
      {/* <ViewIcon src='/images/icons/table-view.svg' />       */}
    </Container>
  )
}