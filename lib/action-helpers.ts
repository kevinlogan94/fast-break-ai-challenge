// Generic helpers for type safety and consistent error handling
// Learning: These ensure all Server Actions follow the same pattern

/**
 * Standard response type for all Server Actions
 */
export type ActionResponse<T = void> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

/**
 * Wraps async operations with consistent error handling
 * Similar to try-catch but returns a typed result
 */
export async function safeAction<T>(
  action: () => Promise<T>
): Promise<ActionResponse<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    console.error('Action error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

/**
 * Type guard to check if a response is successful
 */
export function isSuccessResponse<T>(
  response: ActionResponse<T>
): response is { success: true; data: T } {
  return response.success === true;
}

/**
 * Type guard to check if a response is an error
 */
export function isErrorResponse<T>(
  response: ActionResponse<T>
): response is { success: false; error: string } {
  return response.success === false;
}

/**
 * Extracts data from a successful response or throws
 */
export function unwrapResponse<T>(response: ActionResponse<T>): T {
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error(response.error);
}

/**
 * Handles response with callbacks for success and error
 */
export function handleResponse<T>(
  response: ActionResponse<T>,
  handlers: {
    onSuccess: (data: T) => void;
    onError: (error: string) => void;
  }
): void {
  if (isSuccessResponse(response)) {
    handlers.onSuccess(response.data);
  } else {
    handlers.onError(response.error);
  }
}
