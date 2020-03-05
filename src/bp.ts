import {useRememerContext} from './rememer-provider';

// eslint-disable-next-line react-hooks/rules-of-hooks
export const bp = (px: number): string => useRememerContext('bp').rootFontSize.browserRelativeCssValue(px);
