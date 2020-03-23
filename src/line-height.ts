import {RememerContextValue} from './rememer-provider';
import {IFontSize} from "./font-size";
import {NumberOrLazyNumber, val} from "./lazy-values";

export const lineHeight = (context: RememerContextValue, assumedFontSize?: IFontSize) => (px: NumberOrLazyNumber): number => {
    return (assumedFontSize || context.fontSize).calcRatio(val(px))
};

//region Types
export type LineHeightFn = ReturnType<typeof lineHeight>;
//endregion
