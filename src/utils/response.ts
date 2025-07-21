export function CustomResponse<T>(statusCode: number, data: T | T[]) {
  return {
    statusCode,
    success: true,
    data,
  };
}
