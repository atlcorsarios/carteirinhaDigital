<template>
  <GenericView
    :headers="ClassStock.headers"
    :id-field="'idStock'"
    :title="t('dataTable.stock.title')"
    :hasActions="true"
    :text-create="t('messages.forms.formStock.addInventory')"
    :text-edit="t('messages.forms.formStock.updateInventory')"
    :icon-create="'mdi-warehouse'"
    :icon-edit="'mdi-pencil-outline'"
    :icon-save="'mdi-check'"
    :dialog-model-manager="dialogStock"
    :class-model-manager="stockModelManager"
    :service-fetch="stockServices.getAllStock"
    :service-save="stockServices.saveStock"
  >
    <template #form="{ model, updateValid, refForm, submitForm }">
      <StockControlForm
        :ref="refForm"
        :stock="model"
        @update:valid="updateValid"
        @submit="submitForm"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// Componentes
import GenericView from '@/views/view/GenericView.vue'
import StockControlForm from '@/components/forms/products/StockControlForm.vue'

// Models
import type { IStock, IStockControl } from '@/classes/models/ModelIStock'

// Classes
import { ClassStock } from '@/classes/products/ClassStock'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'


// Services
import { stockServices } from '@/services/resources/products/stockService'

// Vue
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()

const classStock = new ClassStock()
const modelStockControle = ref<IStockControl<T>>({
  item: {} as T,
  operation: 'ENTRY',
  amount: classStock.model.amount,
  measurement: classStock.model.measurement,
  price: undefined
})

const dialogStock = new ClassBaseDialog<IStock>({
  persistent: true,
  maxWidth: 800,
})

const stockModelManager = {
  model: modelStockControle.value,
  reset: () => classStock.reset(),
  updateModel: (item: any) => {
    classStock.updateModel(item)
  },
}
</script>
