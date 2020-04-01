import {RememerContextValue} from './rememer-provider';
import {IFontSize} from './font-size';
import {NumberOrLazyNumber, val} from "./lazy-values";

export type PxFn = (value?: NumberOrLazyNumber) => string;

export const px = (context: RememerContextValue, assumedFontSize?: IFontSize): PxFn =>
    (value?: NumberOrLazyNumber): string => {

        assumedFontSize = assumedFontSize || context.fontSize;
        if (value === undefined) {
            return assumedFontSize.cssValue;
        }
        else {
            return assumedFontSize.relativeCssValue(val(value));
        }
    };
