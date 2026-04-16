<template>
  <v-row dense class="prevent-jump-desktop w-100 ma-0">
    <v-col
      cols="12"
      :md="hiddenChart ? 12 : 6"
      class="col-transition overflow-hidden"
    >
      <slot name="dataTable" :toggleChart="() => emit('toggle-chart')" />
    </v-col>

    <Transition name="expand-charts">
      <v-col
        v-show="!hiddenChart"
        cols="12"
        md="6"
        class="scroll-offset overflow-hidden"
        ref="refCharts"
        tabindex="-1"
      >
        <div v-if="!hiddenChart" class="fill-height w-100">
          <slot name="dataChart" />
        </div>
      </v-col>
    </Transition>
  </v-row>

  <v-expand-transition>
    <div
      v-show="!!selectedItem"
      class="w-100 mt-5 scroll-offset"
      ref="refMoreDetails"
    >
      <slot name="moreDetails" />
    </div>
  </v-expand-transition>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

const props = defineProps<{
  hiddenChart: boolean,
  selectedItem?: any
}>();

const emit = defineEmits<{
  (e: 'toggle-chart'): void;
}>();

defineSlots<{
  dataTable(props: { toggleChart: () => void }): any;
  dataChart(): any;
  moreDetails(): any;
}>();

const refCharts = ref<any>(null);
const refMoreDetails = ref<any>(null);

watch(() => props.hiddenChart, (isHidden) => {
  if (!isHidden) {
    nextTick(() => {
      scrollIntoView(refCharts.value, 'nearest');
    });
  }
});

watch(() => props.selectedItem, (newItem) => {
  if (newItem) {
    nextTick(() => {
      scrollIntoView(refMoreDetails.value, 'nearest');
    });
  }
});

function scrollIntoView(target: any, optionScroll: string) {
  const el = target?.$el || target;
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: optionScroll,
      inline: optionScroll
    });
  }
}
</script>

<style src="@/assets/components/gridDataChart.scss" lang="scss" scoped></style>
