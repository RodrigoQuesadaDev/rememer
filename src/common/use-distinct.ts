import {merge} from "lodash-es";
import fastDeepEqual from "fast-deep-equal/react";
import {useRef} from "react";

export type ValueComparison<T> = (prev: T, next: T) => boolean;

export type UseDistinctOptions<T> = {
    comparison: ValueComparison<T>
};

export function useDistinct<T>(
    value: T,
    options?: Partial<UseDistinctOptions<T>>
): T
{
    const {comparison}: UseDistinctOptions<T> = merge({comparison: fastDeepEqual}, options);

    const ref = useRef<T>(value);

    if (!comparison(value, ref.current)) ref.current = value;

    return ref.current;
}
