import type { IUser } from './ModelUser'

export interface ITraceError {
  lineNumber: number
  fileName: string
  className: string
  methodName: string
}

export interface IErrorAPI {
  errorMessage: string
  errorDateTime: Date
  errorStatusCode: number
  user: IUser
  trace: ITraceError
}
