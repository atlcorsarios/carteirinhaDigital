export interface INotification {
  idNotification: number
  title: string
  description: string
  message: string
  date: Date | string
  seen: boolean
  sender: string
  recipients: string[]
  origin?: string
}
