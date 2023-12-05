import Image from 'next/image'
import veCakeBunny from './assets/veCakeBunny.png'

export const VeCakeBunny: React.FC = () => {
  return <Image src={veCakeBunny} width={186} height={195} alt="vecake-bunny" />
}
