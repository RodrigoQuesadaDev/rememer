export const BROWSER_DEFAULT_FONT_SIZE_PX = 16;

export type FontSizeUnit = 'rem' | 'em';

const DEFAULT_SCALE_FACTOR = 1;

abstract class FontSizeBase {
    abstract readonly px: number;
    abstract readonly cssValue: string;
    abstract readonly unit: FontSizeUnit;

    constructor(readonly scaleFactor: number = DEFAULT_SCALE_FACTOR) {}

    calcRatio = (px: number): number => px / this.px;
    relativeCssValue = (px: number): string => `${px / this.px}em`;
}

export interface IFontSize extends FontSizeBase {}

export class RootFontSize extends FontSizeBase {

    readonly px = BROWSER_DEFAULT_FONT_SIZE_PX;
    readonly cssValue: string;
    readonly unit = 'em';

    constructor(scaleFactor?: number)
    {
        super(scaleFactor);
        this.cssValue = `${this.scaleFactor}${this.unit}`;
    }

    browserRelativeCssValue = (px: number): string => this.relativeCssValue(px * this.scaleFactor);
}

export class FontSize extends FontSizeBase {

    readonly cssValue: string;

    constructor(
        readonly px: number,
        readonly unit: FontSizeUnit,
        parent: FontSizeBase,
        scaleFactor?: number
    )
    {
        super(scaleFactor);
        this.cssValue = `${this.scaleFactor * px / parent.px}${unit}`;
    }
}

export function isFontSize(value: any): value is IFontSize
{
    return value !== undefined && value.px !== undefined && value.scaleFactor !== undefined;
}
