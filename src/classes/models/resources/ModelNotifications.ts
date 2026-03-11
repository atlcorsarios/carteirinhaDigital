export interface INotification {
  idNotification: number
  title: string
  description: string
  message: string
  sender: string
  recipients: string[]
  seen: boolean
  date: Date
}
