import {useRememerContext} from './rememer-provider';
import {LazyString, NumberOrLazyNumber} from "./lazy-values";

export const bp = (px: NumberOrLazyNumber): LazyString => () => useRememerContext('bp').rootFontSize.browserRelativeCssValue(px)();
