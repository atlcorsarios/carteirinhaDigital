<template>
  <GenericView
    :headers="ClassOTP.headers"
    id-field="id"
    cursor-key="created_at"
    context-id="admin-otp"
    :title="t('dataTable.otp')"
    :hasActions="true"
    :hasMoreDetails="true"
    :text-create="t('messages.forms.formOtp.create')"
    :text-edit="t('messages.forms.formOtp.edit')"
    icon-create="mdi-key-plus"
    icon-edit="mdi-pencil"
    icon-save="mdi-check"
    :dialog-model-manager="dialogManager"
    :class-model-manager="modelManager"
    :service-fetch="fetchItems"
    :service-save="OtpResourceService.saveOTP"
    :service-delete="(idDoRegistro) => OtpResourceService.inactivateOTP(idDoRegistro)"
    :new-values-update="{ usado: true }"
  >
    <template #form="{ updateValid, refForm, submitForm }">
      <OTPForm
        :ref="refForm"
        v-model:otpCode="modelManager.model"
        @update:valid="updateValid"
        @submit="submitForm"
      />
    </template>

    <template #moreDetails="{ item, close }">
      <MoreOTPDetails
        :otpCodeDetalhado="item"
        @close="close"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
import GenericView from '@/components/layouts/generics/GenericView.vue'
import OTPForm from '@/components/forms/resources/OTPForm.vue'
import MoreOTPDetails from '@/components/MoreDetails/MoreOTPDetails.vue'
import type { IOTPCodeDetalhado } from '@/classes/models/resources/ModelIOTP'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { ClassOTP } from '@/classes/resources/ClassOTP'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { OtpResourceService } from '@/services/resources/otpResourceService'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore();
const { t } = useI18n();

const classRef = new ClassOTP();
const dialogManager = new ClassBaseDialog<IOTPCodeDetalhado>({
  persistent: true,
  maxWidth: 600,
});

const modelManager = {
  model: { ...classRef.model, gerado_por: authStore.userProfile?.id ?? '' },
  reset: () => classRef.reset(),
  updateModel: (item: IOTPCodeDetalhado) => classRef.updateModel(item),
}

const fetchItems = async (payload: TPayloadRequestPagination) => {
  return await OtpResourceService.paginationsOTP(payload);
}

</script>
