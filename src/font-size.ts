import {LazyNumber, LazyString, LazyValue, NumberOrLazyNumber, val} from "./lazy-values";

export const BROWSER_DEFAULT_FONT_SIZE_PX = 16;

export type FontSizeUnit = 'rem' | 'em';

const DEFAULT_SCALE_FACTOR = () => 1;

abstract class FontSizeBase {
    abstract readonly px: NumberOrLazyNumber;
    abstract readonly cssValue: LazyString;
    abstract readonly unit: FontSizeUnit;

    constructor(readonly scaleFactor: NumberOrLazyNumber = DEFAULT_SCALE_FACTOR) {}

    calcRatio = (px: NumberOrLazyNumber): LazyNumber => () => val(px) / val(this.px);
    relativeCssValue = (px: NumberOrLazyNumber): LazyString => () => `${val(px) / val(this.px)}em`;
}

export interface IFontSize extends FontSizeBase {}

const ROOT_PX_VALUE = () => BROWSER_DEFAULT_FONT_SIZE_PX;

export class RootFontSize extends FontSizeBase {

    readonly px = ROOT_PX_VALUE;
    readonly cssValue: LazyString;
    readonly unit = 'em';

    constructor(scaleFactor?: NumberOrLazyNumber)
    {
        super(scaleFactor);
        this.cssValue = () => `${this.scaleFactor}${this.unit}`;
    }

    browserRelativeCssValue = (px: NumberOrLazyNumber): LazyString => this.relativeCssValue(val(px) * val(this.scaleFactor));
}

export class FontSize extends FontSizeBase {

    readonly cssValue: LazyString;

    constructor(
        readonly px: NumberOrLazyNumber,
        readonly unit: FontSizeUnit,
        parent: LazyValue<FontSizeBase>,
        scaleFactor?: NumberOrLazyNumber
    )
    {
        super(scaleFactor);
        this.cssValue = () => `${val(this.scaleFactor) * val(px) / val(parent().px)}${unit}`;
    }
}
