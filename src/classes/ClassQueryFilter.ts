import type { IQueryFilter } from "./models/modelComponents/ModelQueryFilter";
import type { FilterColumn } from "./models/ModelFilterColumns";
import { formattedDate } from "@/utils/formattedDate";
import { StorageUtils } from "@/utils/StorageUtils";
import { BaseClass } from "./subscriptions/BaseClass";
import { FALLBACK_LOCALE } from "@/plugins/i18n";
import { useRoute } from "vue-router";
import { reactive, ref, watch } from "vue";

export class ClassQueryFilter extends BaseClass<IQueryFilter[]> {
  private staging: IQueryFilter;
  private availableColumns = ref<FilterColumn[]>([]);
  private storageKey: string = '';

  constructor(data?: Partial<IQueryFilter>[]) {
    super(data as any)
    this.staging = reactive(this.createWithDefaults({}, this.defaultItem));

    const route = useRoute();

    watch(
      () => route.name,
      (newName) => {
        if (!newName) return;

        this.storageKey = `filter_context_${String(newName)}`;
        const savedData = StorageUtils.get<IQueryFilter[]>(this.storageKey, [], 'session');

        this.model.length = 0;
        if (savedData && savedData.length > 0) {
          const cleanData = savedData.map(item =>
            this.createWithDefaults(item, this.defaultItem)
          );
          this.model.push(...cleanData);
        }

        this.resetStaging();
      },{ immediate: true }
    );

    watch(
      () => route.meta?.filterConfig,
      (newConfig) => {
        this.availableColumns.value = (newConfig as FilterColumn[]) || [];
      }, { immediate: true }
    );

    watch(() => this.model, (newVal) => {
      if (this.storageKey) {
        StorageUtils.set(this.storageKey, newVal, 'session');
      }
    }, { deep: true });
  }

  get stagingModel(): IQueryFilter {
    return this.staging;
  }

  get filters(): FilterColumn[] {
    return this.availableColumns.value;
  }

  private get defaultItem(): IQueryFilter {
    const today = new Date();
    const locale = typeof navigator !== 'undefined' ? navigator.language : FALLBACK_LOCALE;
    const dateStr = formattedDate(today, locale);

    return {
      field: '',
      condition: '',
      value: '',
      startDate: dateStr,
      endDate: dateStr,
      selectValues: []
    } as IQueryFilter;
  }

  protected getDefault(data?: unknown): IQueryFilter[] {
    const items = (data as Partial<IQueryFilter>[]) || []

    if (items.length > 0) {
      return items.map(item => this.createWithDefaults(item, this.defaultItem));
    }

    return [];
  }

  addFilter(): boolean {
    if (this.isDuplicate(this.staging)) {
      return false;
    }

    this.model.push(this.createWithDefaults(this.staging, this.defaultItem));
    this.resetStaging();
    return true;
  }

  removeFilter(index: number) {
    if (this.model.length === 1) {
      this.reset();
    } else {
      this.model.splice(index, 1);
    }
  }

  reset() {
    this.model.length = 0;
  }

  resetStaging() {
    const freshItem = this.createWithDefaults({}, this.defaultItem);
    Object.keys(this.staging).forEach(key => {
      // @ts-ignore
      delete this.staging[key];
    });

    Object.assign(this.staging, freshItem);
  }

  private isDuplicate(newItem: IQueryFilter): boolean {
    return this.model.some(existing =>
      existing.field === newItem.field &&
      existing.condition === newItem.condition &&
      existing.value === newItem.value &&
      existing.startDate === newItem.startDate &&
      existing.endDate === newItem.endDate
    );
  }

  getColumnType(key: string): FilterColumn | undefined {
    return this.availableColumns.value.find(col => col.key === key);
  }

  fieldChanged(newField: string) {
    const newItem = this.createWithDefaults({ field: newField }, this.defaultItem);

    Object.keys(this.staging).forEach(key => {
      // @ts-ignore
      delete this.staging[key];
    });
    Object.assign(this.staging, newItem);
  }

  updateStaging(data: Partial<IQueryFilter>) {
    Object.assign(this.staging, data);
  }
}
