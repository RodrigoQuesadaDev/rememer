import {useRememerContext} from './rememer-provider';
import {FontSizeConfiguration, RememerComponent} from './rememer';
import {FontSize} from './font-size';
import {scopedFontSize, withScopedFontSize} from './scoped-font-size';

type PxBody<T> = () => T;

export function px(): string;
export function px(value: number): string;
export function px<T>(Component: RememerComponent<any, any>, body: PxBody<T>): T;
export function px<T>(Component: RememerComponent<any, any>, assumedConfig: FontSizeConfiguration, body: PxBody<T>): T;
export function px<T>(arg1?: number | RememerComponent<any, any>, arg2?: FontSizeConfiguration | PxBody<T>, arg3?: PxBody<T>): string | T {
    const fnName = 'px';
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const context = useRememerContext(fnName);
    if (arg1 === undefined) {
        return context.fontSize.cssValue;
    }
    else if (typeof arg1 === 'number') {
        return (scopedFontSize() || context.fontSize).relativeCssValue(arg1);
    }
    else {
        let Component = arg1;
        let assumedConfig: FontSizeConfiguration | undefined;
        let body: PxBody<T>;
        if (typeof arg2 === 'function') {
            body = arg2;
        }
        else {
            assumedConfig = arg2!;
            body = arg3!;
        }

        if (assumedConfig?.fontSize === undefined && Component.fontSizeConfig.fontSize === undefined) {
            throw new Error(`[${fnName}] You should either specify the fontSize of the component when defining it or pass it along to this method as assumed configuration.`);
        }

        const partialFontSizeConfig: Partial<FontSizeConfiguration> = {...Component.fontSizeConfig};

        if (assumedConfig?.fontSize !== undefined) partialFontSizeConfig.fontSize = assumedConfig.fontSize;

        if (partialFontSizeConfig.scaleFactor === undefined) partialFontSizeConfig.scaleFactor = 1;
        if (assumedConfig?.scaleFactor !== undefined) partialFontSizeConfig.scaleFactor *= assumedConfig.scaleFactor;

        const fontSizeConfig: FontSizeConfiguration = partialFontSizeConfig as FontSizeConfiguration;

        return withScopedFontSize(
            new FontSize(
                fontSizeConfig.fontSize,
                Component.fontSizeConfig.unit,
                context.rootFontSize,
                fontSizeConfig.scaleFactor
            ),
            body);
    }
}

export interface RememerComponentPxFn {

    <T>(body: PxBody<T>): T;

    <T>(assumedConfig: FontSizeConfiguration, body: PxBody<T>): T;
}

export function createRememerComponentPxFunction(Component: RememerComponent<any, any>): RememerComponentPxFn {
    return function <T>(arg1: FontSizeConfiguration | PxBody<T>, arg2?: PxBody<T>): T {
        return px(Component, arg1 as any, arg2 as any);
    }
}
