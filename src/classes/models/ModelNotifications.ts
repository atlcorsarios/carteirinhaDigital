export interface INotifications {
  id: string | number
  title: string
  description: string
  message: string
  date: Date
  seen: boolean
  sender?: string | number
  recipients?: string[] | number[]
  origin?: string | number
}
