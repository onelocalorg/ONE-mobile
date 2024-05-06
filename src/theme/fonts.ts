import { moderateScale, normalize, normalScale } from "./device/normalize";

const type = {
  bold: "NotoSerif-Bold",
  light: "NotoSerif-Light",
  medium: "NotoSerif-Medium",
  regular: "NotoSerif-Regular",
  semiBold: "NotoSerif-SemiBold",
  thin: "NotoSerif-Thin",
  extraBold: "NotoSerif-ExtraBold",
  extraLight: "NotoSerif-ExtraLight",
};

const size = {
  font7: normalize(7),
  font8: normalize(8),
  font10: normalize(10),
  font11: normalize(11),
  font12: normalize(12),
  font14: normalize(14),
  font16: normalize(16),
  font18: normalize(18),
  font20: normalize(20),
  font22: normalize(22),
  font24: normalize(24),
  font26: normalize(26),
  font28: normalize(28),
  font30: normalize(30),
  font32: normalize(32),
  font34: normalize(34),
  font36: normalize(36),
  font40: normalize(40),
  font64: normalize(64),
};

const opacity = {
  opacity15: 0.15,
  opacity2: 0.2,
  opacity3: 0.3,
  opacity4: 0.4,
  opacity5: 0.5,
  opacity6: 0.6,
  opacity7: 0.7,
  opacity8: 0.8,
  opacity9: 0.9,
};

const borderWidth = {
  borderWidth1: normalScale(1),
  borderWidth2: normalScale(2),
  borderWidth1p5: normalScale(1.5),
  borderWidth10: normalScale(10),
  borderWidth6: normalScale(6),
};

const borderRadius = {
  radius1: moderateScale(1),
  radius3: moderateScale(3),
  radius4: moderateScale(4),
  radius6: moderateScale(6),
  radius8: moderateScale(8),
  radius10: moderateScale(10),
  radius12: moderateScale(12),
  radius14: moderateScale(14),
  radius16: moderateScale(16),
  radius18: moderateScale(18),
  radius20: moderateScale(20),
  radius35: moderateScale(35),
  radius40: moderateScale(40),
  radius50: moderateScale(50),
  radius58: moderateScale(58),
  radius64: moderateScale(64),
};

export { borderRadius, borderWidth, opacity, size, type };
