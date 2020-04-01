import React, {ComponentType, useMemo} from 'react';
import {useRememerContext} from './rememer-provider';
import {hoc} from './common/hoc';
import {RememProvider} from './remem-provider';
import {BROWSER_DEFAULT_FONT_SIZE_PX, FontSize, FontSizeUnit, IFontSize} from './font-size';
import {merge} from 'lodash-es';
import {
    ComponentFontSizeConfiguration,
    FontSizeConfiguration,
    useFontSizeConfig,
    UserFontSizeConfiguration
} from "./font-size-configuration";

export function remem<C extends ComponentType<any> = ComponentType<any>>(Component: C): C;
export function remem<C extends ComponentType<any> = ComponentType<any>>(configuration: UserFontSizeConfiguration, Component: C): C;
export function remem<C extends ComponentType<any> = ComponentType<any>>(arg1: UserFontSizeConfiguration | C, arg2?: C): C
{
    return rememerHoc('Remem', 'remem', 'rem', {fontSize: BROWSER_DEFAULT_FONT_SIZE_PX}, arg1, arg2);
}

export function memer<C extends ComponentType<any> = ComponentType<any>>(Component: C): C;
export function memer<C extends ComponentType<any> = ComponentType<any>>(configuration: UserFontSizeConfiguration, Component: C): C;
export function memer<C extends ComponentType<any> = ComponentType<any>>(arg1: UserFontSizeConfiguration | C, arg2?: C): C
{
    return rememerHoc('Memer', 'memer', 'em', undefined, arg1, arg2);
}

let previousRememerId = 0;

function rememerHoc<P, C extends ComponentType<any> = ComponentType<any>>(
    hocName: string,
    fnName: string,
    fontSizeUnit: FontSizeUnit,
    defaultConfig: FontSizeConfiguration | undefined,
    arg1: UserFontSizeConfiguration | (C & ComponentType<P>),
    arg2?: C & ComponentType<P>
): C & RememerComponent<C>
{
    const {userConfig = defaultConfig, Component} = parseArguments(arg1, arg2);
    const rememerId = previousRememerId += 1;

    const inferredOverriddenRememerId = isRememerComponent(Component) ? Component.__rememerId : undefined;

    return hoc<C, RememerProps<P>, C & RememerComponent<C>>(
        hocName,
        Component,
        (props) => {
            const partialConfig = useFontSizeConfig(userConfig);
            const parentContext = useRememerContext(fnName);
            const parentFontSize = fontSizeUnit === 'rem' ? parentContext.rootFontSize : parentContext.fontSize;

            const overriddenRememerId = partialConfig?.overriddenComponent?.__rememerId || inferredOverriddenRememerId;

            const config: FontSizeConfiguration = merge({scaleFactor: 1}, {fontSize: parentFontSize.px}, partialConfig);
            includeScaleFactorFromProps(config, props);

            const fontSize: IFontSize = useMemo(
                () => new FontSize(config.fontSize, fontSizeUnit, parentFontSize, config.scaleFactor),
                [config.fontSize, config.scaleFactor, parentFontSize]);

            return (<RememProvider {...{rememerId, fontSize, overriddenRememerId}}>{props.children}</RememProvider>);
        },
        (c) => {
            c.__rememerId = rememerId;
            c.__fontSizeConfig = ({...{userConfig, unit: fontSizeUnit}});
            c.o = Component;
        }
    );
}

function includeScaleFactorFromProps(config: FontSizeConfiguration, props: RememerProps<{}>): void
{
    if (props.fontSize === undefined && props.scaleFactor === undefined) return;

    if (config.scaleFactor === undefined) config.scaleFactor = 1;

    if (props.fontSize !== undefined) {
        config.scaleFactor = config.scaleFactor * props.fontSize / config.fontSize;
    }

    if (props.scaleFactor !== undefined) {
        config.scaleFactor = config.scaleFactor * props.scaleFactor;
    }
}

//region Argument Parsing
function parseArguments<C extends ComponentType<any>>(arg1: UserFontSizeConfiguration | C, arg2?: C)
{
    let userConfig: UserFontSizeConfiguration | undefined;
    let Component: C;

    if (arg2 !== undefined) {
        userConfig = arg1 as UserFontSizeConfiguration;

        Component = arg2;
    }
    else {
        Component = arg1 as C;
    }
    return {userConfig, Component};
}

//endregion

//region Types
export type RememerProps<P> = P & Partial<FontSizeConfiguration>

//Created to address [styled-components] Type instantiation is excessively deep and possibly infinite #42829
//https://github.com/DefinitelyTyped/DefinitelyTyped/issues/42829
export function asRememerComponent<C extends ComponentType<any> = ComponentType<any>>(Component: C): C & RememerComponent<C>
{
    if (!isRememerComponent(Component)) throw new Error(`[asRememerComponent] You may only pass a Component of type RememerComponent to this function.`);

    return Component as C & RememerComponent<C>;
}

//Commented out 'ComponentType<RememerProps<P>>' to address [styled-components] Type instantiation is excessively deep and possibly infinite #42829
//https://github.com/DefinitelyTyped/DefinitelyTyped/issues/42829
//export type RememerComponent<C extends ComponentType<P>, P> = C /*& ComponentType<RememerProps<P>>*/ & {
export type RememerComponent<C extends ComponentType<any>> = /*& ComponentType<RememerProps<P>>*/ {
    __rememerId: number,
    __fontSizeConfig: ComponentFontSizeConfiguration,
    o: C
};

export function isRememerComponent(obj: any): obj is RememerComponent<ComponentType<any>>
{
    return obj.__rememerId !== undefined;
}

//endregion
