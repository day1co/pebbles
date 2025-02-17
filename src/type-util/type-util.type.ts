export type NarrowableType = string | number | undefined;

// make required type of properties to optional
export type PickWithPartial<T, K extends keyof T> = Pick<T, K> & Partial<T>;

// make optional properties to required type
export type RequiredPartialProps<T, C extends keyof T> = T & {
  [K in C]-?: T[K];
};

// https://github.com/day1coloso/coloso/pull/7036#issuecomment-2661939732
export type Nullish<T> = T | null | undefined;
export type Nullable<T> = T | null;
export type Arrayable<T> = T | Array<T>;
