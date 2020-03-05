import React, {ReactNode, useMemo} from 'react';
import {IFontSize} from './font-size';
import {RememerContext, useRememerContext} from './rememer-provider';

type Props = {
    children?: ReactNode,
    fontSize: IFontSize,
};

export function RememProvider(props: Props) {
    const {children, fontSize} = props;
    const parentContext = useRememerContext('RememProvider');

    const context = useMemo(() => ({rootFontSize: parentContext.rootFontSize, fontSize}),
        [fontSize, parentContext.rootFontSize]);

    if (!children) return null;

    return (
        <RememerContext.Provider value={context}>{props.children}</RememerContext.Provider>
    )
}
