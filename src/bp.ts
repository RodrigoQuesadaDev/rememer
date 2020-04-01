import {RememerContextValue} from "./rememer-provider";
import {NumberOrLazyNumber, val} from "./lazy-values";

export type BpFn = (px: NumberOrLazyNumber) => string;

export const bp = (context: RememerContextValue): BpFn => (px: NumberOrLazyNumber): string => context.rootFontSize.browserRelativeCssValue(val(px));
