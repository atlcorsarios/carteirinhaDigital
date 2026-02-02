
import type { IHeadersDataTable, TEntityConfig } from "../models/modelComponents/ModelHeaderTable";
import type { IQueryFilter } from "../models/modelComponents/ModelQueryFilter";
import type { IFilterColumn } from "../models/ModelFilterColumns";
import type { IStock } from "../models/ModelIStock";
import { validCategoriesGroups } from "../models/ModelIProduct";
import { BaseClass } from "../subscriptions/BaseClass";
import { ClassCategories } from "./ClassCategories";
import { ClassFormatters } from "../ClassFormatters";

export class ClassStock extends BaseClass<IStock> {
  constructor(data?: Partial<IStock>) {
    super(data)
  }

  static defaultStock(): IStock {
    return {
      idStock: 0,
      category: ClassCategories.defaultCategory(),
      description: '',
      measurement: '',
      amount: 0.0
    }
  }

  protected getDefault(data: unknown = {}) {
    const item = data as Partial<IStock>
    return this.createWithDefaults(item, ClassStock.defaultStock())
  }

  static get fieldConfig(): TEntityConfig<IStock> {
    return {
      idStock: {
        excludeFromChart: true,
        excludeFromFilter: true,
        width: 50,
        maxWidth: 100,
        minWidth: 50
      },
      category: {
        key: 'category.group',
        align: 'center',
        width: 200,
        maxWidth: 250,
        minWidth: 150,
        chartFormatter: (val: string) => ClassFormatters.formatI18n('forms.formCategory.group.types', val?.toLowerCase()),
        value: (item) => ClassFormatters.formatI18n('forms.formCategory.group.types', item.category?.group.toLocaleLowerCase()),
        filterType: 'select',
        selectOptions: validCategoriesGroups.map(group => ({
          label: ClassFormatters.formatI18n('forms.formCategory.group.types', group.toLocaleLowerCase()),
          value: group
        })),
      },
      description: {
        align: 'center',
        width: 450,
        maxWidth: 600,
        minWidth: 150,
        excludeFromChart: true
      },
      measurement: {
        align: 'center',
        width: 150,
        maxWidth: 200,
        minWidth: 100
      },
      amount: {
        align: 'end',
        width: 150,
        maxWidth: 200,
        minWidth: 100
      }
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassStock().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formStock',
      ClassStock.fieldConfig
    );
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassStock().getDefault()
    return BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formStock',
      ClassStock.fieldConfig
    )
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'category',
      condition: 'equals',
      value: validCategoriesGroups[0]
    };
  }
}
