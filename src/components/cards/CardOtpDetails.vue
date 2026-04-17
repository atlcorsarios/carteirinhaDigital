<template>
  <v-container fluid class="pa-0">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="h-100 rounded-lg">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="text-caption text-medium-emphasis">
                  {{ t('forms.formOTP.cargo_destino.headerTable') }}
                </div>
                <div class="text-body-1 font-weight-medium text-capitalize">
                  <v-icon
                    icon="mdi-badge-account-outline"
                    size="small"
                    color="info"
                    class="mr-1"
                  />
                  {{ otpCodeDetalhado.cargo_destino }}
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="text-caption text-medium-emphasis">
                  {{ t('forms.formOTP.usado.headerTable') }}
                </div>
                <v-chip
                  :color="otpCodeDetalhado.usado ? 'error' : 'success'"
                  size="small"
                  variant="flat"
                  class="font-weight-bold"
                >
                  {{ t(`forms.formOTP.usado.${otpCodeDetalhado.usado}`) }}
                </v-chip>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="text-caption text-medium-emphasis">
                  {{ t('forms.formOTP.created_at.headerTable') }}
                </div>
                <div class="text-body-2">
                  {{ ClassFormatters.formatDateTime(otpCodeDetalhado.created_at) }}
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="text-caption text-medium-emphasis">
                  {{ t('forms.formOTP.data_expiracao.headerTable') }}
                </div>
                <div class="text-body-2 text-warning font-weight-medium">
                  {{ ClassFormatters.formatDateTime(otpCodeDetalhado.data_expiracao) }}
                </div>
              </v-col>

              <v-col cols="12" sm="6" v-if="otpCodeDetalhado.usado">
                <div class="text-caption text-medium-emphasis">
                  {{ t('forms.formOTP.data_uso.headerTable') }}
                </div>
                <div class="text-body-2 text-error">
                  {{ otpCodeDetalhado.data_uso ? ClassFormatters.formatDate(otpCodeDetalhado.data_uso) : '-' }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" class="d-flex flex-column">
        <v-tabs
          v-model="tab"
          color="primary"
          align-tabs="start"
          variant="outlined"
          density="compact"
          class="rounded-lg"
        >
          <v-tab v-if="otpCodeDetalhado.plano" value="plano">
            <v-icon
              icon="mdi-seal"
              start
            />
            {{ t('forms.formOTP.plano.headerTable') }}
          </v-tab>
          <v-tab v-if="otpCodeDetalhado.usuario_destino" value="destino">
            <v-icon
              icon="mdi-account-arrow-right"
              start
            />
            {{ t('forms.formOTP.usuario_destino.headerTable') }}
          </v-tab>
          <v-tab v-if="otpCodeDetalhado.usuario_gerador" value="gerador">
            <v-icon
              icon="mdi-account-cog"
              start
            />
            {{ t('forms.formOTP.gerado_por.headerTable') }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-window
          v-model="tab"
          class="mt-2 rounded-lg"
          style="background: transparent;"
        >

          <v-window-item value="plano">
            <v-card
              variant="tonal"
              class="pa-4 border-dashed"
            >
              <CardPlano :plano="otpCodeDetalhado.plano" />
            </v-card>
          </v-window-item>

          <v-window-item value="destino">
            <v-card variant="tonal" class="pa-4 border-dashed">
              <CardUsuario :usuario="otpCodeDetalhado.usuario_destino" />
            </v-card>
          </v-window-item>

          <v-window-item value="gerador">
            <v-card variant="tonal" class="pa-4 border-dashed">
              <CardUsuario :usuario="otpCodeDetalhado.usuario_gerador" />
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import CardPlano from './CardPlano.vue';
import CardUsuario from './CardUsuario.vue';
import type { IOTPCodeDetalhado } from '@/classes/models/resources/ModelIOTP';
import { ClassFormatters } from '@/classes/ClassFormatters';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n();
const tab = ref();

const props = defineProps<{ otpCodeDetalhado: IOTPCodeDetalhado }>();

</script>
