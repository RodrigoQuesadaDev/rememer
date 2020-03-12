import {useRememerContext} from './rememer-provider';
import {scopedFontSize} from 'scoped-font-size';
import {LazyNumber, NumberOrLazyNumber} from "./lazy-values";

export function lineHeight(px: NumberOrLazyNumber): LazyNumber
{
    const scopedFontSizeValue = scopedFontSize();
    return () => {

        const context = useRememerContext('lineHeight');
        return (scopedFontSizeValue || context.fontSize).calcRatio(px)();
    }
}
