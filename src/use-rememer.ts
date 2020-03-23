import {isRememerComponent, RememerComponent,} from "./rememer";
import {useMemo} from "react";
import {useRememerContext} from "./rememer-provider";
import {px, PxFn} from "./px";
import {bp, BpFn} from "./bp";
import {lineHeight, LineHeightFn} from "./line-height";
import {merge} from 'lodash-es';
import {FontSize, IFontSize, isFontSize} from "./font-size";
import {useCustomMemo} from "./common/use-custom-memo";
import {FontSizeConfiguration, useComponentFontSizeConfig} from "./font-size-configuration";

export function useRememer(): UseRememerReturnType;
export function useRememer(assumedFontSize: IFontSize): UseRememerReturnType;
export function useRememer(Component: RememerComponent<any, any>, assumedConfig?: FontSizeConfiguration): UseRememerReturnType
export function useRememer(arg1?: RememerComponent<any, any> | IFontSize, assumedConfig?: FontSizeConfiguration): UseRememerReturnType
{
    const fnName = 'useRememer';
    let {Component, assumedFontSize} = readArguments(arg1);
    if (Component && !isRememerComponent(Component)) throw new Error(`[${fnName}] You may only pass a Component of type RememerComponent to this function.`);

    const componentFontSizeConfig = useComponentFontSizeConfig(Component?.__fontSizeConfig);
    const context = useRememerContext('useRememer');

    assumedFontSize = useCustomMemo(() => {

            if (assumedFontSize !== undefined) return assumedFontSize;

            if (componentFontSizeConfig) {
                if (componentFontSizeConfig.fontSize === undefined && assumedConfig?.fontSize === undefined) {
                    throw new Error(`[${fnName}] You should either specify the fontSize of the component when defining it or pass it along to this method as assumed configuration.`);
                }

                const partialFontSizeConfig: Partial<FontSizeConfiguration> = merge(
                    {scaleFactor: 1}, componentFontSizeConfig, {fontSize: assumedConfig?.fontSize}
                );
                if (assumedConfig?.scaleFactor !== undefined) partialFontSizeConfig.scaleFactor! *= assumedConfig.scaleFactor;
                const fontSizeConfig = partialFontSizeConfig as FontSizeConfiguration;

                return new FontSize(
                    fontSizeConfig.fontSize,
                    componentFontSizeConfig.unit,
                    context.rootFontSize,
                    fontSizeConfig.scaleFactor
                );
            }
        }, [assumedConfig, assumedFontSize, componentFontSizeConfig, context.rootFontSize],
        {useShallowComparison: it => isFontSize(it)});

    return useMemo(() => ({
        px: px(context, assumedFontSize),
        bp: bp(context),
        lineHeight: lineHeight(context, assumedFontSize),
        fontSize: context.fontSize
    }), [assumedFontSize, context]);
}

function readArguments(arg1?: RememerComponent<any, any> | IFontSize)
{
    return isFontSize(arg1) ? {assumedFontSize: arg1} : {Component: arg1};
}

//region Types
type UseRememerReturnType = {
    px: PxFn,
    bp: BpFn,
    lineHeight: LineHeightFn,
    fontSize: IFontSize
}
//endregion
