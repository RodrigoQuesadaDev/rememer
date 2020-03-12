import {useRememerContext} from './rememer-provider';
import {LazyString, NumberOrLazyNumber} from "./global-types";

export const bp = (px: NumberOrLazyNumber): LazyString => () => useRememerContext('bp').rootFontSize.browserRelativeCssValue(px)();
