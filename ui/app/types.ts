export type FieldErrors<T> = {
  [P in keyof T]?: string[];
};
