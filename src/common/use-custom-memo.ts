import {DependencyList, useMemo} from "react";
import fastDeepEqual from "fast-deep-equal/react";
import {merge, partition} from 'lodash-es';
import {useDistinct} from "./use-distinct";
import {useFirst} from "./use-first";

type DepsComparison = (prev: DependencyList, next: DependencyList) => boolean;

type UseCustomMemoOptions = {
    comparison: DepsComparison,
    useShallowComparison: (dep: any) => boolean
};

const DONT_USE_SHALLOW_COMPARISON = () => false;

export function useCustomMemo<T>(
    factory: () => T,
    deps: DependencyList,
    options?: Partial<UseCustomMemoOptions>
): T
{
    options = useFirst(options);

    const {comparison, useShallowComparison}: UseCustomMemoOptions = merge({
        comparison: fastDeepEqual,
        useShallowComparison: DONT_USE_SHALLOW_COMPARISON
    }, options);
    const [shallowComparisonDeps = [], customComparisonDeps = []] = partition(deps, useShallowComparison);

    const prevCustomComparisonDeps = useDistinct<DependencyList>(customComparisonDeps, {comparison});

    return useMemo(factory, [...shallowComparisonDeps, prevCustomComparisonDeps]);
}
