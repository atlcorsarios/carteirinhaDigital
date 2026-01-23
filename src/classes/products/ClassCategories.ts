import { ClassFormatters } from '../ClassFormatters'
import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { ICategory } from '../models/ModelIProduct'
import { BaseClass } from '../subscriptions/BaseClass'

export class ClassCategories extends BaseClass<ICategory> {
  constructor(data?: Partial<ICategory>) {
    super(data)
  }

  static defaultCategory(): ICategory {
    return {
      idCategory: 0,
      description: '',
      active: true
    }
  }

  protected getDefault(data: unknown = {}): ICategory {
    const item = data as Partial<ICategory>
    return this.createWithDefaults(item, ClassCategories.defaultCategory())
  }

  static get fieldConfig(): TEntityConfig<ICategory> {
    return {
      idCategory: {
        width: 50
      },
      description: {
        align: 'center',
        maxWidth: 'auto'
      },
      active: {
        align: 'center',
        chartFormatter: ClassFormatters.formatBoolean,
        value: (item) => ClassFormatters.formatBoolean(item.active),
        width: 50,
      },
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassCategories().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formCategory',
      ClassCategories.fieldConfig
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassCategories().getDefault()
    return BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formCategory',
      ClassCategories.fieldConfig
    )
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'description',
      condition: 'contains'
    }
  }
}
