import { AxiosError } from 'axios';

export function extractErrorMessage(error: unknown, defaultMessage = 'errors.unknown'): string {
  if (isAxiosError(error) && error.response?.data?.errorMessage) {
    return error.response.data.errorMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return defaultMessage;
}

function isAxiosError(error: any): error is AxiosError<any> {
  return error && error.isAxiosError;
}
