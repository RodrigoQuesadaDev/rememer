import {NumberOrLazyNumber, PossiblyLazyValue, val} from "./lazy-values";
import {mapValues} from 'lodash-es';
import {FontSizeUnit} from "./font-size";
import {useMemo} from "react";

export type FontSizeConfiguration = {
    fontSize: number;
    scaleFactor?: number;
};

export type UserFontSizeConfigurationValue = {
    fontSize?: NumberOrLazyNumber;
    scaleFactor?: NumberOrLazyNumber;
};

export type UserFontSizeConfiguration = PossiblyLazyValue<UserFontSizeConfigurationValue>;

export function useFontSizeConfig(userConfig: UserFontSizeConfiguration | undefined): Partial<FontSizeConfiguration> | undefined
{
    const userConfigValue: undefined | UserFontSizeConfigurationValue = userConfig && val(userConfig);
    return useMemo(() => userConfigValue && mapValues(userConfigValue, (it: any) => val(it)), [userConfigValue]);
}

export type ComponentFontSizeConfiguration = { userConfig?: UserFontSizeConfiguration, unit: FontSizeUnit };
export type ProcessedComponentFontSizeConfiguration = Partial<FontSizeConfiguration> & { unit: FontSizeUnit };

export function useComponentFontSizeConfig(componentConfig?: ComponentFontSizeConfiguration): ProcessedComponentFontSizeConfiguration | undefined
{
    const fontSizeConfig = useFontSizeConfig(componentConfig?.userConfig);
    return useMemo(() => componentConfig && {
        ...fontSizeConfig,
        unit: componentConfig.unit
    }, [componentConfig, fontSizeConfig]);
}
