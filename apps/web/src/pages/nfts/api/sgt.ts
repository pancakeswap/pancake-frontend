import { sgtList, sgtDetail } from './mock'

const mock = true

export const getSgtList = async () => {
  if (mock) {
    return sgtList
  }
  const response = await fetch('/sgt', {
    method: 'GET', // or 'PUT', depending on how your API is set up
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.json()
}

export const getSgtDetail = async () => {
  if (mock) {
    return sgtDetail
  }
  const response = await fetch('/sgt/detail', {
    method: 'GET', // or 'PUT', depending on how your API is set up
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.json()
}
