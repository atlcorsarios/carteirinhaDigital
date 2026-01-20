export interface INotifications {
  id: string | number
  title: string
  description: string
  message: string
  date: Date
  seen: boolean
  sender: string
  recipients: string[]
  origin?: string
}
