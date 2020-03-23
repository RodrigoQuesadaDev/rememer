import {RememerContextValue} from "./rememer-provider";
import {NumberOrLazyNumber, val} from "./lazy-values";

export const bp = (context: RememerContextValue) => (px: NumberOrLazyNumber): string => context.rootFontSize.browserRelativeCssValue(val(px));

//region Types
export type BpFn = ReturnType<typeof bp>;
//endregion
