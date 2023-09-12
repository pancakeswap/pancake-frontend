import { styled } from 'styled-components'
import { Link } from '@pancakeswap/uikit'
import Image from 'next/image'

const Container = styled(Link)`
  position: fixed;
  z-index: 100;
  right: 5%;
  bottom: calc(185px + env(safe-area-inset-bottom));
`

const ThirdYearBirthdayCake = () => {
  return (
    <Container href="https://blog.pancakeswap.finance/" external>
      <Image src="/images/third-year-cake-icon.png" alt="third-year-cake-icon" width={48} height={48} />
    </Container>
  )
}

export default ThirdYearBirthdayCake
