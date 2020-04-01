import {NumberOrLazyNumber, PossiblyLazyValue, val} from "./lazy-values";
import {mapValues} from 'lodash-es';
import {FontSizeUnit} from "./font-size";
import {ComponentType, useMemo} from "react";
import {RememerComponent} from './rememer';

export type FontSizeConfiguration = {
    fontSize: number;
    scaleFactor?: number;
    overriddenComponent?: RememerComponent<ComponentType<any>>;
};

export type UserFontSizeConfigurationValue = {
    fontSize?: NumberOrLazyNumber;
    scaleFactor?: NumberOrLazyNumber;
    overriddenComponent?: RememerComponent<ComponentType<any>>;
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
