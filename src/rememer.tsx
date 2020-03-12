import React, {ComponentType, useMemo} from 'react';
import {useRememerContext} from './rememer-provider';
import {hoc} from './common/hoc';
import {RememProvider} from './remem-provider';
import {BROWSER_DEFAULT_FONT_SIZE_PX, FontSize, FontSizeUnit, IFontSize} from './font-size';
import {createRememerComponentPxFunction, RememerComponentPxFn} from './px';
import {mapLazyProperties, NumberOrLazyNumber} from "./lazy-values";

export function remem<P, C extends ComponentType<P> = ComponentType<P>>(Component: C): RememerComponent<C, P>;
export function remem<P, C extends ComponentType<P> = ComponentType<P>>(configuration: Partial<FontSizeConfiguration>, Component: C): RememerComponent<C, P>;
export function remem<P, C extends ComponentType<P> = ComponentType<P>>(arg1: Partial<FontSizeConfiguration> | C, arg2?: C): RememerComponent<C, P>
{
    return rememerHoc('Remem', 'remem', 'rem', {fontSize: BROWSER_DEFAULT_FONT_SIZE_PX}, arg1, arg2);
}

export function memer<P, C extends ComponentType<P> = ComponentType<P>>(Component: C): RememerComponent<C, P>;
export function memer<P, C extends ComponentType<P> = ComponentType<P>>(configuration: Partial<FontSizeConfiguration>, Component: C): RememerComponent<C, P>;
export function memer<P, C extends ComponentType<P> = ComponentType<P>>(arg1: Partial<FontSizeConfiguration> | C, arg2?: C): RememerComponent<C, P>
{
    return rememerHoc('Memer', 'memer', 'em', undefined, arg1, arg2);
}

function rememerHoc<P, C extends ComponentType<P> = ComponentType<P>>(
    hocName: string,
    fnName: string,
    fontSizeUnit: FontSizeUnit,
    defaultConfig: FontSizeConfiguration | undefined,
    arg1: Partial<FontSizeConfiguration> | C,
    arg2?: C
): RememerComponent<C, P>
{
    const {partialConfig = defaultConfig, Component} = parseArguments(arg1, arg2);

    return hoc<C, RememerProps<P>, RememerComponent<C, P>>(
        hocName,
        Component,
        (props) => {
            const parentContext = useRememerContext(fnName);
            const parentFontSize = fontSizeUnit === 'rem' ? parentContext.rootFontSize : parentContext.fontSize;

            const config: FontSizeConfiguration = {
                ...{scaleFactor: 1},
                ...(partialConfig || {fontSize: parentFontSize.px})
            };
            includeScaleFactorFromProps(config, props);

            const fontSize: IFontSize = useMemo(
                () => new FontSize(config.fontSize, fontSizeUnit, () => parentFontSize, config.scaleFactor),
                [config.fontSize, config.scaleFactor, parentFontSize]);

            return (<RememProvider {...{fontSize}}>{props.children}</RememProvider>);
        },
        (c) => {
            c.fontSizeConfig = {...{unit: fontSizeUnit}, ...(partialConfig || {})};
            c.o = Component;
            c.px = createRememerComponentPxFunction(c);
        }
    );
}

function includeScaleFactorFromProps(config: FontSizeConfiguration, props: RememerProps<{}>): void
{
    if (props.fontSize === undefined && props.scaleFactor === undefined) return;

    if (config.scaleFactor === undefined) config.scaleFactor = 1;

    if (props.fontSize !== undefined) {
        config.scaleFactor = mapLazyProperties(
            [config.scaleFactor, props.fontSize, config.fontSize],
            (a, b, c) => a * b / c
        );
    }

    if (props.scaleFactor !== undefined) {
        config.scaleFactor = mapLazyProperties(
            [config.scaleFactor, props.scaleFactor],
            (a, b) => a * b
        );
    }
}

//region Argument Parsing
function parseArguments<C extends ComponentType<any>>(arg1: Partial<FontSizeConfiguration> | C, arg2?: C)
{
    let partialConfig: FontSizeConfiguration | undefined;
    let Component: C;
    if (arg2 !== undefined) {
        partialConfig = arg1 as FontSizeConfiguration;
        Component = arg2;
    }
    else {
        Component = arg1 as C;
    }
    return {partialConfig, Component};
}

//endregion

//region Types
export type FontSizeConfiguration = {
    fontSize: NumberOrLazyNumber;
    scaleFactor?: NumberOrLazyNumber;
};

export type RememerProps<P> = P & Partial<FontSizeConfiguration>

export type RememerComponent<C extends ComponentType<P>, P> = C & ComponentType<RememerProps<P>> & {
    fontSizeConfig: Partial<FontSizeConfiguration> & { unit: FontSizeUnit },
    o: C,
    px: RememerComponentPxFn
};

export function isRememerComponent(obj: any): obj is RememerComponent<any, any>
{
    return obj.o !== undefined && obj.fontSizeConfig !== undefined;
}

//endregion
