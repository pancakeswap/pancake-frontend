import dayjs from 'dayjs'

export const formatDate = (time: dayjs.Dayjs) => time.format('MMM D YYYY HH:mm')
