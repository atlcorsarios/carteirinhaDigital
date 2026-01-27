import { ClassUsers } from "./ClassUsers";
import type { IErrorAPI, ITraceError } from "./models/ModelErrorAPI"
import { BaseClass } from "./subscriptions/BaseClass";

export class ClassErrorAPI extends BaseClass<IErrorAPI> {
  constructor(data?: Partial<IErrorAPI>) {
    super(data)
  }

  static defaultErrorTrace(): ITraceError {
    return {
      lineNumber: 0,
      fileName: '',
      className: '',
      methodName: ''
    }
  }

  static defaultError(): IErrorAPI {
    return {
      errorMessage: '',
      errorDateTime: new Date(),
      errorStatusCode: 0,
      user: ClassUsers.defaultUser(),
      trace: ClassErrorAPI.defaultErrorTrace()
    };
  }

  protected getDefault(data: unknown = {}): IErrorAPI {
    const item = data as Partial<IErrorAPI>
    return this.createWithDefaults(item, ClassErrorAPI.defaultError())
  }
}
