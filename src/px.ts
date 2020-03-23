import {RememerContextValue} from './rememer-provider';
import {IFontSize} from './font-size';
import {NumberOrLazyNumber, val} from "./lazy-values";

export const px = (context: RememerContextValue, assumedFontSize?: IFontSize) =>
    (value?: NumberOrLazyNumber): string => {

        assumedFontSize = assumedFontSize || context.fontSize;
        if (value === undefined) {
            return assumedFontSize.cssValue;
        }
        else {
            return assumedFontSize.relativeCssValue(val(value));
        }
    };


//region Types
export type PxFn = ReturnType<typeof px>;
//endregion
