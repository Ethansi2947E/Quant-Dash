export async function safeAsync<T>(
  promise: Promise<T>,
  errorHandler?: (error: unknown) => void,
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise
    return [data, null]
  } catch (error) {
    if (errorHandler) {
      errorHandler(error)
    } else {
      console.error("Error in async operation:", error)
    }
    return [null, error as Error]
  }
}
