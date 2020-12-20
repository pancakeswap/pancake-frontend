import React, { ReactElement } from 'react'
import styled from 'styled-components'
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

export default function FarmHeader({searchString, selectedView, showAllStatus, setViewStatus}: Props): ReactElement {
  return (
    <Container>
      <IconWrapper>
        <CardIcon color={!selectedView && '#1FC7D4'} onClick={() => setViewStatus(false)} />
        <TableIcon color={selectedView && '#1FC7D4'} onClick={() => setViewStatus(true)} />
      </IconWrapper>
      <SearchBox inputText="test" />
      {/* <ViewIcon src='/images/icons/table-view.svg' />       */}
    </Container>
  )
}