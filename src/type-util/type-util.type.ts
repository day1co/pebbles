export type NarrowableType = string | number | undefined;

// make required type of properties to optional
export type PickWithPartial<T, K extends keyof T> = Pick<T, K> & Partial<T>;

// make optional properties to required type
export type RequiredPartialProps<T, C extends keyof T> = T & {
  [K in C]-?: T[K];
};
export type Nullable<T> = T | null | undefined;
export type Arrayable<T> = T | Array<T>;
