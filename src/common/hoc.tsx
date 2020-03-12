import React, {ComponentType, forwardRef, PropsWithChildren, ReactElement} from 'react';
import hoistStatics from 'hoist-non-react-statics';
import {getComponentName} from './component-utils';

interface RenderFunction<P> {
    (props: P): ReactElement | null;
}

export function hoc<C extends ComponentType<P>, P extends PropsWithChildren<any>, H extends C>(
    hocName: string,
    Component: C,
    render: RenderFunction<PropsWithChildren<any>>,
    postprocess: (hoc: H) => void
): H
{
    // @ts-ignore
    const Hoc: H = forwardRef((props: PropsWithChildren<any>, ref) => {
        return render({...props, children: (<Component {...props} ref={ref}/>)});
    });

    hoistStatics(Hoc, Component);
    Hoc.displayName = `${hocName}(${getComponentName(Component)})`;

    postprocess(Hoc);

    return Hoc;
}
