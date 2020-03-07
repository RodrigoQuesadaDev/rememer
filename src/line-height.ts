import {useRememerContext} from './rememer-provider';
import {scopedFontSize} from 'scoped-font-size';

export const lineHeight = (px: number): number => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const context = useRememerContext('lineHeight');
    return (scopedFontSize() || context.fontSize).calcRatio(px);
};
