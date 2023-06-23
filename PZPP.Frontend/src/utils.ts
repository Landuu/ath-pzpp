import dayjs from "dayjs"

export const formatDateTime = (dateTime: string) => {
    return dayjs(dateTime).format('DD.MM.YYYY hh:MM')
}