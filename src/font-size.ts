const BROWSER_DEFAULT_FONT_SIZE_PX = 16;

export type FontSizeUnit = 'rem' | 'em';

abstract class FontSizeBase {
    abstract readonly px: number;
    abstract readonly cssValue: string;
    abstract readonly unit: FontSizeUnit;
    abstract readonly isRoot: boolean;

    constructor(readonly scaleFactor: number = 1) {
    }

    calcRatio = (px: number): number => px / this.px;
    relativeCssValue = (px: number): string => `${px / this.px}em`;
    toString = () => this.cssValue;
}

export interface IFontSize extends FontSizeBase {}

export class RootFontSize extends FontSizeBase {

    readonly isRoot = false;
    readonly px = BROWSER_DEFAULT_FONT_SIZE_PX;
    readonly cssValue: string;
    readonly unit = 'em';

    constructor(scaleFactor?: number) {
        super(scaleFactor);
        this.cssValue = `${this.scaleFactor}${this.unit}`;
    }

    browserRelativeCssValue = (px: number): string => this.relativeCssValue(px * this.scaleFactor);
}

export class FontSize extends FontSizeBase {

    readonly isRoot = false;
    readonly cssValue: string;

    constructor(
        readonly px: number,
        readonly unit: FontSizeUnit,
        parent: FontSizeBase,
        scaleFactor?: number
    ) {
        super(scaleFactor);
        this.cssValue = `${this.scaleFactor * px / parent.px}${unit}`;
    }
}
