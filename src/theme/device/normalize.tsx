import { BASE_DIMENSIONS, height, width } from "./device";

const scale = width / BASE_DIMENSIONS.width;

const normalize = (size: number) => Math.round(scale * size);

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = BASE_DIMENSIONS.width;
const guidelineBaseHeight = BASE_DIMENSIONS.height;

const normalizedWidth = (size: number) => (width / guidelineBaseWidth) * size;
const normalizedHeight = (size: number) =>
  (height / guidelineBaseHeight) * size;

const normalScale = (size: number) => normalizedWidth(size);
const verticalScale = (size: number) => normalizedHeight(size);
const moderateScale = (size: number, factor = 0.5) =>
  size + (normalScale(size) - size) * factor;
const lineHeightScale = (fontSize: number, factor = 1.2) =>
  Math.ceil(normalizedHeight(fontSize * factor));

export {
  normalScale,
  verticalScale,
  moderateScale,
  lineHeightScale,
  normalize,
};
