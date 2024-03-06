import { nftList } from './mock'

const mock = true

export const getNftList = async () => {
  if (mock) {
    return nftList
  }
  const response = await fetch('/sgt', {
    method: 'GET', // or 'PUT', depending on how your API is set up
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.json()
}

// export const getSgtDetail = async () => {
//   if (mock) {
//     return sgtDetail;
//   }
//   const response = await fetch("/sgt/detail", {
//     method: "GET", // or 'PUT', depending on how your API is set up
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return response.json();
// };
