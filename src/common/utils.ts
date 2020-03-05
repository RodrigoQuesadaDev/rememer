import {ComponentType} from 'react';

export function getComponentName(target: ComponentType<any>): string {
    return (process.env.NODE_ENV !== 'production' && (target.displayName || target.name)) || 'Component';
}
