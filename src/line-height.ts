import {RememerContextValue} from './rememer-provider';
import {IFontSize} from "./font-size";
import {NumberOrLazyNumber, val} from "./lazy-values";

export type LineHeightFn = (px: NumberOrLazyNumber) => number;

export const lineHeight = (context: RememerContextValue, assumedFontSize?: IFontSize): LineHeightFn => (px: NumberOrLazyNumber): number => {
    return (assumedFontSize || context.fontSize).calcRatio(val(px))
};
