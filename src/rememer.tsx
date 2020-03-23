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

export function remem<P, C extends ComponentType<P> = ComponentType<P>>(Component: C & ComponentType<P>): RememerComponent<C, P>;
export function remem<P, C extends ComponentType<P> = ComponentType<P>>(configuration: UserFontSizeConfiguration, Component: C & ComponentType<P>): RememerComponent<C, P>;
export function remem<P, C extends ComponentType<P> = ComponentType<P>>(arg1: UserFontSizeConfiguration | (C & ComponentType<P>), arg2?: C & ComponentType<P>): RememerComponent<C, P>
{
    return rememerHoc('Remem', 'remem', 'rem', {fontSize: BROWSER_DEFAULT_FONT_SIZE_PX}, arg1, arg2);
}

export function memer<P, C extends ComponentType<P> = ComponentType<P>>(Component: C & ComponentType<P>): RememerComponent<C, P>;
export function memer<P, C extends ComponentType<P> = ComponentType<P>>(configuration: UserFontSizeConfiguration, Component: C & ComponentType<P>): RememerComponent<C, P>;
export function memer<P, C extends ComponentType<P> = ComponentType<P>>(arg1: UserFontSizeConfiguration | (C & ComponentType<P>), arg2?: C & ComponentType<P>): RememerComponent<C, P>
{
    return rememerHoc('Memer', 'memer', 'em', undefined, arg1, arg2);
}

function rememerHoc<P, C extends ComponentType<P> = ComponentType<P>>(
    hocName: string,
    fnName: string,
    fontSizeUnit: FontSizeUnit,
    defaultConfig: FontSizeConfiguration | undefined,
    arg1: UserFontSizeConfiguration | (C & ComponentType<P>),
    arg2?: C & ComponentType<P>
): RememerComponent<C, P>
{
    const {userConfig = defaultConfig, Component} = parseArguments(arg1, arg2);

    return hoc<C, RememerProps<P>, RememerComponent<C, P>>(
        hocName,
        Component,
        (props) => {
            const partialConfig = useFontSizeConfig(userConfig);
            const parentContext = useRememerContext(fnName);
            const parentFontSize = fontSizeUnit === 'rem' ? parentContext.rootFontSize : parentContext.fontSize;

            const config: FontSizeConfiguration = merge({scaleFactor: 1}, {fontSize: parentFontSize.px}, partialConfig);
            includeScaleFactorFromProps(config, props);

            const fontSize: IFontSize = useMemo(
                () => new FontSize(config.fontSize, fontSizeUnit, parentFontSize, config.scaleFactor),
                [config.fontSize, config.scaleFactor, parentFontSize]);

            return (<RememProvider {...{fontSize}}>{props.children}</RememProvider>);
        },
        (c) => {
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

export type RememerComponent<C extends ComponentType<P>, P> = C & ComponentType<RememerProps<P>> & {
    __fontSizeConfig: ComponentFontSizeConfiguration,
    o: C
};

export function isRememerComponent(obj: any): obj is RememerComponent<any, any>
{
    return obj.o !== undefined && obj.__fontSizeConfig !== undefined;
}

//endregion
