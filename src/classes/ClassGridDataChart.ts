import type { IModelValueDataChart, IModelValueGridDataChart, IPropsDataTable } from './models/modelComponents/ModelGridDataChart'
import { BaseClass } from './subscriptions/BaseClass'

type GridPartialConstructor<T> = {
  modelTable?: {
    model?: Partial<IPropsDataTable<T>>
  }
  modelChart?: Partial<IModelValueDataChart>
}

export class ClassGridDataChart<T> extends BaseClass<IModelValueGridDataChart<T>> {
  constructor(data?: GridPartialConstructor<T>) {
    super(data as any)
  }

  get grid() {
    return this.model
  }

  private get defaultGrid(): IModelValueGridDataChart<T> {
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
    } as IModelValueGridDataChart<T>
  }

  protected getDefault(data?: unknown): IModelValueGridDataChart<T> {
    const defaults = this.defaultGrid
    const input = (data as GridPartialConstructor<T>) || {}
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
