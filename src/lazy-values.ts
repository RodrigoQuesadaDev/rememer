import {NotFunction} from "./common/utility-types";

export type LazyValue<T> = () => T;
export type PossiblyLazyValue<T> = NotFunction<T> | LazyValue<T>;
export type LazyNumber = LazyValue<number>;
export type NumberOrLazyNumber = PossiblyLazyValue<number>;

export const val = <T>(value: PossiblyLazyValue<T>): T => typeof value === 'function' ? (value as LazyValue<T>)() : value;
