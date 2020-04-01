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

    const context = useMemo(() => {
            return parentContext.overriddenRememerId === rememerId
                ? {
                    ...parentContext,
                    overriddenRememerId
                }
                : {
                    rootFontSize: parentContext.rootFontSize,
                    fontSize,
                    overriddenRememerId
                };
        },
        [fontSize, overriddenRememerId, parentContext, rememerId]);

    if (!children) return null;

    return (
        <RememerContext.Provider value={context}>{props.children}</RememerContext.Provider>
    );
}
