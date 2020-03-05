import React, {ComponentType, useMemo} from 'react';
import {useRememerContext} from './rememer-provider';
import {hoc} from './common/hoc';
import {RememProvider} from './remem-provider';
import {FontSize, FontSizeUnit, IFontSize} from './font-size';
import {createRememerComponentPxFunction, RememerComponentPxFn} from './px';

//TODO make remem configuration required!!! (and or default to 16px...)
export function remem<P, C extends ComponentType<P> = ComponentType<P>>(Component: C): RememerComponent<C, P>;
export function remem<P, C extends ComponentType<P> = ComponentType<P>>(configuration: Partial<FontSizeConfiguration>, Component: C): RememerComponent<C, P>;
export function remem<P, C extends ComponentType<P> = ComponentType<P>>(arg1: Partial<FontSizeConfiguration> | C, arg2?: C): RememerComponent<C, P> {
    return rememerHoc('Remem', 'remem', 'rem', arg1, arg2);
}

export function memer<P, C extends ComponentType<P> = ComponentType<P>>(Component: C): RememerComponent<C, P>;
export function memer<P, C extends ComponentType<P> = ComponentType<P>>(configuration: Partial<FontSizeConfiguration>, Component: C): RememerComponent<C, P>;
export function memer<P, C extends ComponentType<P> = ComponentType<P>>(arg1: Partial<FontSizeConfiguration> | C, arg2?: C): RememerComponent<C, P> {
    return rememerHoc('Memer', 'memer', 'em', arg1, arg2);
}

function rememerHoc<P, C extends ComponentType<P> = ComponentType<P>>(
    hocName: string,
    fnName: string,
    fontSizeUnit: FontSizeUnit,
    arg1: Partial<FontSizeConfiguration> | C,
    arg2?: C
): RememerComponent<C, P> {
    let partialConfig: FontSizeConfiguration | undefined;
    let Component: C;
    if (arg2 !== undefined) {
        partialConfig = arg1 as FontSizeConfiguration;
        Component = arg2;
    }
    else {
        Component = arg1 as C;
    }

    const Hoc: RememerComponent<C, P> = hoc<RememerProps<P>>(hocName, Component, (props, children) => {
        const parentContext = useRememerContext(fnName);
        const parentFontSize = fontSizeUnit === 'rem' ? parentContext.rootFontSize : parentContext.fontSize;

        const config: FontSizeConfiguration = {
            ...{scaleFactor: 1},
            ...(partialConfig || {fontSize: parentFontSize.px})
        };
        includeScaleFactorFromProps(config, props);

        const fontSize: IFontSize = useMemo(
            () => new FontSize(config.fontSize, fontSizeUnit, parentFontSize, config.scaleFactor),
            [config.fontSize, config.scaleFactor, parentFontSize]);

        return (<RememProvider {...{fontSize}}>{children}</RememProvider>);
    }) as RememerComponent<C, P>;

    Hoc.fontSizeConfig = {...{unit: fontSizeUnit}, ...(partialConfig || {})};
    Hoc.o = Component;
    Hoc.px = createRememerComponentPxFunction(Hoc);

    return Hoc;
}

function includeScaleFactorFromProps(config: FontSizeConfiguration, props: RememerProps<{}>): void {
    if (props.fontSize === undefined && props.scaleFactor === undefined) return;

    if (config.scaleFactor === undefined) config.scaleFactor = 1;
    if (props.fontSize !== undefined) config.scaleFactor *= props.fontSize / config.fontSize;
    if (props.scaleFactor !== undefined) config.scaleFactor *= props.scaleFactor;
}

//region Types
export type FontSizeConfiguration = {
    fontSize: number;
    scaleFactor?: number;
};

export type RememerProps<P> = P & Partial<FontSizeConfiguration>

export type RememerComponent<C extends ComponentType<P>, P> = C & ComponentType<RememerProps<P>> & {
    fontSizeConfig: Partial<FontSizeConfiguration> & { unit: FontSizeUnit },
    o: C,
    px: RememerComponentPxFn
};

//endregion
