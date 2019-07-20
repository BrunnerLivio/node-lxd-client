export interface RESTApiMetadata<T> {
  type: string;
  status: string;
  status_code: number;
  operation: string;
  error_code: number;
  error: string;
  metadata: T;
}
