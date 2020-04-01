import React, {ReactNode, useMemo} from 'react';
import {IFontSize} from './font-size';
import {RememerContext, useRememerContext} from './rememer-provider';

type Props = {
    children?: ReactNode,
    rememerId: number,
    fontSize: IFontSize,
    overriddenRememerId?: number
};

export function RememProvider(props: Props)
{
    const {children, rememerId, fontSize, overriddenRememerId} = props;
    const parentContext = useRememerContext('RememProvider');

    const context = useMemo(() => ({rootFontSize: parentContext.rootFontSize, fontSize, overriddenRememerId}),
        [fontSize, overriddenRememerId, parentContext.rootFontSize]);

    if (!children) return null;

    return parentContext.overriddenRememerId === rememerId
        ? (<RememerContext.Provider value={context}>{props.children}</RememerContext.Provider>)
        : (<>{props.children}</>);
}
