import React, {createContext, ReactNode, useContext, useMemo} from 'react';
import {IFontSize, RootFontSize} from './font-size';

export type RememerContextValue = {
    rootFontSize: RootFontSize;
    fontSize: IFontSize;
};

export const RememerContext = createContext<RememerContextValue | undefined>(undefined);
export const RememerConsumer = RememerContext.Consumer;

type Props = {
    children?: ReactNode,
    rootFontSize: RootFontSize,
};

export function RememerProvider(props: Props) {
    const {children, rootFontSize} = props;

    const context = useMemo(() => ({rootFontSize, fontSize: rootFontSize}), [rootFontSize]);

    if (!children) return null;

    return (
        <RememerContext.Provider value={context}>{children}</RememerContext.Provider>
    )
}

export function useRememerContext(fnName: string): RememerContextValue {
    const context = useContext(RememerContext);
    if (context === undefined) throw new Error(`[${fnName}] You are not using a RememerProvider`);

    return context;
}
