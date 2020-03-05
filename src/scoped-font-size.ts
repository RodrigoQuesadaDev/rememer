import {IFontSize} from './font-size';

let scopedFontSizeValue: IFontSize | undefined;

export function withScopedFontSize<T>(fontSize: IFontSize | undefined, body: () => T): T {
    if (scopedFontSizeValue !== undefined) throw new Error(`[withScopedFontSize] You are not supposed to nest px calls.`);

    try {
        scopedFontSizeValue = fontSize;
        return body();
    } finally {
        scopedFontSizeValue = undefined;
    }
}

export const scopedFontSize = (): IFontSize | undefined => scopedFontSizeValue;
