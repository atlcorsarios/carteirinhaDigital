import type {
  IModelValueDataChart,
  IModelValueGridDataChart,
  IPropsDataTable,
} from './models/modelComponents/ModelGridDataChart'
import { BaseClass } from './subscriptions/BaseClass'

export type GridPartialConstructor<T> = {
  modelTable?: {
    model?: Partial<IPropsDataTable<T>>
  }
  modelChart?: Partial<IModelValueDataChart>
}

export class ClassGridDataChart<T> extends BaseClass<IModelValueGridDataChart<T>> {
  constructor(data?: Partial<GridPartialConstructor<T>>) {
    super(data as any)
  }

  static defaultGrid<T>(): IModelValueGridDataChart<T> {
    return {
      modelTable: {
        model: {
          hiddenChart: true,
          titleTable: '',
          heightTable: 'auto',
          maxHeightTable: 400,
          densityTable: 'compact',
          bgColorTable: '',
          headersTable: [],
          itemsTable: [],
          loadingDataTable: true,
        },
      },
      modelChart: {
        optionsFilterSelectData: [],
        model: [
          {
            id: 1,
            color: 'rgba(var(--v-theme-on-surface), .2)',
            title: 'Start Data Table',
            value: 0,
          },
        ],
      },
    }
  }

  protected getDefault(data: unknown = {}): IModelValueGridDataChart<T> {
    const defaults = ClassGridDataChart.defaultGrid<T>()
    const input = data as Partial<GridPartialConstructor<T>>
    return {
      modelTable: {
        model: this.createWithDefaults(input.modelTable?.model || {}, defaults.modelTable.model),
      },
      modelChart: {
        optionsFilterSelectData:
          input.modelChart?.optionsFilterSelectData || defaults.modelChart.optionsFilterSelectData,
        model: input.modelChart?.model || defaults.modelChart.model,
      },
    }
  }
}
