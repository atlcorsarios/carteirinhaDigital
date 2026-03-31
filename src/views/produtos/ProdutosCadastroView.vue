<template>
  <GenericView
    ref="genericView"
    :headers="ClassProdutos.headers"
    :id-field="'id'"
    :showIdInTextEdit="false"
    :title="'dataTable.products'"
    :context-id="String(route.name)"
    :hasActions="true"
    :hasMoreDetails="true"
    :text-create="t('messages.forms.formProduct.createProduct')"
    :text-edit="t('messages.forms.formProduct.editingProduct')"
    :icon-create="'mdi-package-variant-closed-plus'"
    :icon-edit="'mdi-pencil-outline'"
    :icon-save="'mdi-package-variant-closed-check'"
    :dialog-model-manager="dialogProduct"
    :class-model-manager="productModelManager"
    :service-fetch="buscarProdutosPaginado"
    :service-save="ProductsService.saveProduct"
    :service-delete="ProductsService.inactivateProduct"
  >
    <template #form="{ model, updateValid, refForm, submitForm }">
      <ProductForm
        :ref="refForm"
        :produto="model"
        @update:valid="updateValid"
        @submit="submitForm"
      />
    </template>

    <template #moreDetails="{ item, close }">
      <MoreProductDetails
        :produto="item"
        @close="close"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
// Componentes
import GenericView from '@/components/layouts/generics/GenericView.vue'
import ProductForm from '@/components/forms/resources/ProductForm.vue'
import MoreProductDetails from '@/components/MoreDetails/MoreProductDetails.vue'

// Models
import { type IProdutos } from '@/classes/models/resources/ModelIProdutos'
import type { IQueryFilter } from '@/classes/models/modelComponents/ModelQueryFilter'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'

// Classes
import { ClassProdutos } from '@/classes/resources/ClassProdutos'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { ProductsService } from '@/services/resources/produtosService'

// Store
import { useQueryFilterStore } from '@/stores/queryFilterStore'
import { useAuthStore } from '@/stores/authStore'

// Vue
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const route = useRoute();
const queryFilterStore = useQueryFilterStore();
const authStore = useAuthStore();

const classProduct = new ClassProdutos()
const dialogProduct = new ClassBaseDialog<IProdutos>({
  persistent: true,
  maxWidth: 800,
});

const buscarProdutosPaginado = async (limit: number, lastCursor: string | null) => {
  const isParceiro = authStore.userProfile?.cargo === 'parceiro';
  const idParceiro = authStore.userProfile?.id;

  let filtroEstaticoDaTela: IQueryFilter = {
    field: '',
    condition: '',
    value: ''
  };

  if (isParceiro && idParceiro) {
    filtroEstaticoDaTela = {
      field: 'id_parceiro',
      condition: 'equals',
      value: String(idParceiro)
    }
  }

  const payload: TPayloadRequestPagination = {
    limit,
    cursor: lastCursor,
    filters: [
      ...queryFilterStore.activeFilters,
      filtroEstaticoDaTela
    ]
  }

  return await ProductsService.paginationsProducts(payload, 'produtos');
}

const productModelManager = {
  model: classProduct.model,
  reset: () => classProduct.reset(),
  updateModel: (item: any) => {
    classProduct.updateModel(item)
  },
}

</script>
