import {DependencyList, useMemo} from "react";
import fastDeepEqual from "fast-deep-equal/react";
import {groupBy, merge} from 'lodash-es';
import {usePreviousDistinct} from 'react-use/esm';
import {Predicate} from "react-use/esm/usePreviousDistinct";

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
    const {comparison, useShallowComparison}: UseCustomMemoOptions = merge({
        comparison: fastDeepEqual,
        useShallowComparison: DONT_USE_SHALLOW_COMPARISON
    }, options);
    const {'true': shallowComparisonDeps = [], 'false': customComparisonDeps = []} = groupBy(deps, useShallowComparison);

    const prevCustomComparisonDeps = usePreviousDistinct(customComparisonDeps, comparison as Predicate<DependencyList>) || customComparisonDeps;

    return useMemo(factory, prevCustomComparisonDeps.concat(shallowComparisonDeps));
}
