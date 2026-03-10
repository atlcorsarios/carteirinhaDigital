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
  <div
    v-show="!!selectedItem"
    class="w-100 mt-5 scroll-offset"
    ref="refMoreDetails"
  >
    <slot name="moreDetails" />
  </div>
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

<style scoped>
.bg-primary-lighten-4 {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
}

.col-transition {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-width: 0;
  transition: flex-basis 300ms cubic-bezier(0.4, 0, 0.2, 1),
    max-width 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 960px) {
  .prevent-jump-desktop {
    flex-wrap: nowrap !important;
  }

  .expand-charts-enter-active,
  .expand-charts-leave-active {
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .expand-charts-leave-from {
    opacity: 1;
    max-width: 50%;
    flex: 0 0 50%;
  }

  .expand-charts-enter-from,
  .expand-charts-leave-to {
    opacity: 0;
    max-width: 0 !important;
    flex: 0 0 0 !important;
    min-width: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}

.scroll-offset {
  scroll-margin-top: 90px;
  outline: none;
}
</style>
