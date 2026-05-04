export interface ApiResponse<T> {
  data: T;
  meta: {
    schemaVersion: "1.0";
    contentVersion: string;
    generatedAt?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}
