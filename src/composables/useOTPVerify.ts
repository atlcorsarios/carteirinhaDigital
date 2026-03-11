import { type IVerifyWithOtp } from '@/classes/models/modelOtp/IVerifyWithOtp';
import { useSnackbar } from './useSnackbar';
import { useAuthStore } from '@/stores/authStore';
import { computed, ref } from 'vue';

export interface IOTPVerifyOptions {
  navStep?: number;
  onSuccess?: (dados?: any) => void | Promise<void>;
}

export function useOTPVerify() {
  const snackbar = useSnackbar();
  const authStore = useAuthStore();
  const loading = ref<boolean>(false);
  const step = ref<number>(1);
  const otpCode = ref<string>('');
  const timeLeft = ref(0);

  let timerInterval: ReturnType<typeof setInterval> | null = null;

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  function startTimer() {
    stopTimer();
    timeLeft.value = 600;
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        stopTimer();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  const changeStep = (navStep: number) => {
    step.value = navStep;
  };

  const sendCode = async (emailSender: string, options: IOTPVerifyOptions = {}) => {
    loading.value = true;
    try {
      await authStore.generateOTP(emailSender);
      if (options.navStep) changeStep(options.navStep);
      if (options.onSuccess) await options.onSuccess();

      startTimer();
      snackbar.notify('auth.codeSent');
    } catch (error: any) {
      snackbar.notify(error);
    } finally {
      loading.value = false;
    }
  };

  const verifyCode = async (requestVerify: IVerifyWithOtp, options: IOTPVerifyOptions = {}) => {
    loading.value = true;
    try {
      await authStore.verify(requestVerify);
      if (options.onSuccess) await options.onSuccess();
    } catch (error: any) {
      snackbar.notify(error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    step,
    otpCode,
    timeLeft,
    formattedTime,
    startTimer,
    stopTimer,
    changeStep,
    sendCode,
    verifyCode
  };
}
