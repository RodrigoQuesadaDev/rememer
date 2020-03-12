import {NotFunction} from "./common/utility-types";

export type LazyValue<T> = () => T;
export type LazyString = LazyValue<string>;
export type LazyNumber = LazyValue<number>;
export type NumberOrLazyNumber = number | LazyNumber;

export const val = <T>(value: NotFunction<T> | LazyValue<T>): T => typeof value === 'function' ? (value as LazyValue<T>)() : value;
