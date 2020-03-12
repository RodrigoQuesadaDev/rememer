import {RememerContextValue, useRememerContext} from './rememer-provider';
import {FontSizeConfiguration, isRememerComponent, RememerComponent} from './rememer';
import {FontSize} from './font-size';
import {scopedFontSize, withScopedFontSize} from './scoped-font-size';
import {LazyString, LazyValue, mapLazyProperties, NumberOrLazyNumber} from "./lazy-values";

type PxBody<T> = () => T;

export function px(): LazyString;
export function px(value: NumberOrLazyNumber): LazyString;
export function px<T>(Component: RememerComponent<any, any>, body: PxBody<T>): T;
export function px<T>(Component: RememerComponent<any, any>, assumedConfig: FontSizeConfiguration, body: PxBody<T>): T;
export function px<T>(arg1?: NumberOrLazyNumber | RememerComponent<any, any>, arg2?: FontSizeConfiguration | PxBody<T>, arg3?: PxBody<T>): LazyString | T
{
    const scopedFontSizeValue = scopedFontSize();
    return parseArguments({arg1, arg2, arg3},
        (context) => () => context().fontSize.cssValue(),

        (context) => () => (scopedFontSizeValue || context().fontSize).relativeCssValue(arg1)(),

        (context, Component, assumedConfig, body) => {
            const partialFontSizeConfig: Partial<FontSizeConfiguration> = {...Component.fontSizeConfig};

            if (assumedConfig?.fontSize !== undefined) partialFontSizeConfig.fontSize = assumedConfig.fontSize;

            if (partialFontSizeConfig.scaleFactor === undefined) partialFontSizeConfig.scaleFactor = 1;

            if (assumedConfig?.scaleFactor !== undefined) {
                partialFontSizeConfig.scaleFactor = mapLazyProperties(
                    [partialFontSizeConfig.scaleFactor, assumedConfig.scaleFactor],
                    (a, b) => a * b
                );
            }

            const fontSizeConfig: FontSizeConfiguration = partialFontSizeConfig as FontSizeConfiguration;

            return withScopedFontSize(
                new FontSize(
                    fontSizeConfig.fontSize,
                    Component.fontSizeConfig.unit,
                    () => context().rootFontSize,
                    fontSizeConfig.scaleFactor
                ),
                body);
        }
    );
}

export function createRememerComponentPxFunction(Component: RememerComponent<any, any>): RememerComponentPxFn
{
    return function <T>(arg1: FontSizeConfiguration | PxBody<T>, arg2?: PxBody<T>): T {
        return px(Component, arg1 as any, arg2 as any);
    }
}

//region Argument Parsing
function parseArguments<T>(
    {arg1, arg2, arg3}: { arg1?: number | RememerComponent<any, any>, arg2?: FontSizeConfiguration | PxBody<T>, arg3?: PxBody<T> },
    caseNoArgs: (context: LazyValue<RememerContextValue>) => LazyString,
    casePxValue: (context: LazyValue<RememerContextValue>, value: number) => LazyString,
    caseComponentArg: (
        context: LazyValue<RememerContextValue>,
        Component: RememerComponent<any, any>,
        assumedConfig: FontSizeConfiguration | undefined,
        body: PxBody<T>
    ) => T
): LazyString | T
{
    const fnName = 'px';
    const context = () => useRememerContext(fnName);
    if (arg1 === undefined) {
        return caseNoArgs(context);
    }
    else if (isRememerComponent(arg1)) {
        const Component = arg1;
        let assumedConfig: FontSizeConfiguration | undefined;
        let body: PxBody<T>;
        if (typeof arg2 === 'function') {
            body = arg2;
        }
        else {
            assumedConfig = {...arg2!};
            body = arg3!;
        }

        if (assumedConfig?.fontSize === undefined && Component.fontSizeConfig.fontSize === undefined) {
            throw new Error(`[${fnName}] You should either specify the fontSize of the component when defining it or pass it along to this method as assumed configuration.`);
        }

        return caseComponentArg(context, Component, assumedConfig, body);
    }
    else {
        return casePxValue(context, arg1);
    }
}

//endregion

//region Types
export interface RememerComponentPxFn {

    <T>(body: PxBody<T>): T;

    <T>(assumedConfig: FontSizeConfiguration, body: PxBody<T>): T;
}

//endregion
