export type NarrowableType = string | number | undefined;

// make required type of properties to optional
export type PickWithPartial<T, K extends keyof T> = Pick<T, K> & Partial<T>;

// make optional properties to required type
export type RequiredPartialProps<T, C extends keyof T> = T & {
  [K in C]-?: T[K];
};

// 타입의 명확성을 나타내는 범용적인 네이밍, 타입 적용
export type Nullish<T> = T | null | undefined;
export type Nullable<T> = T | null;
export type Arrayable<T> = T | Array<T>;
