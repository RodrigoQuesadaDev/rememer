import React, {ComponentType, forwardRef, ReactElement, ReactNode} from 'react';
import hoistStatics from 'hoist-non-react-statics';
import {getComponentName} from './utils';

interface RenderFunction<P> {
    (props: P, children: ReactNode): ReactElement | null;
}

export function hoc<P>(
    hocName: string,
    Component: ComponentType<any>,
    render: RenderFunction<P>
): ComponentType<P> {
    const WrappedComponent = forwardRef<any, P>((props, ref) => {
        return render(props, <Component {...props} ref={ref}/>);
    });

    hoistStatics(WrappedComponent, Component);
    WrappedComponent.displayName = `${hocName}(${getComponentName(Component)})`;

    // @ts-ignore
    return WrappedComponent;
}
