import styled from 'styled-components'

// TODO: Use UI Kit
const Page = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 904px;
  padding-bottom: 48px;
  padding-left: 16px;
  padding-right: 16px;

  @media (min-width: 576px) {
    padding-left: 24px;
    padding-right: 24px;
  }

  @media (min-width: 968px) {
    padding-left: 32px;
    padding-right: 32px;
    width: 100%;
  }
`

export default Page
