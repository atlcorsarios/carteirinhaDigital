import type { ValueDataChart } from "@/classes/models/modelComponents/ModelGridDataChart";

export function useChartHelpers(
  items: any[],
  groupingField: string,
  chartAggregation: 'sum' | 'count' = 'count',
  stringToColor: (str: string) => string,
  formatter?: (val: any) => string
): ValueDataChart[] {
  if (!items || items.length === 0) return [];

  const grouped: Record<string, number> = {};

  items.forEach(item => {
    const originalValue = groupingField.split('.').reduce((obj, key) => obj?.[key], item);
    const key = String(originalValue);
    let value = chartAggregation === 'sum' ? (Number(originalValue) || 0) : 1;
    grouped[key] = (grouped[key] || 0) + value;
  });

  return Object.keys(grouped).map((key, index) => {
    let valueToFormat: any = key;
    if (key === 'true') valueToFormat = true;
    if (key === 'false') valueToFormat = false;

    return {
      key: key,
      id: index,
      title: formatter ? formatter(valueToFormat) : key,
      value: grouped[key],
      color: stringToColor(key)
    };
  });
}
