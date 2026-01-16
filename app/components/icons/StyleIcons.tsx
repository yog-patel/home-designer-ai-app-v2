import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polygon } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const ModernIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="2" y="2" width="28" height="28" rx="4" stroke={color} strokeWidth="2" />
    <Line x1="16" y1="2" x2="16" y2="30" stroke={color} strokeWidth="2" />
    <Line x1="2" y1="16" x2="30" y2="16" stroke={color} strokeWidth="2" />
  </Svg>
);

export const MinimalistIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="16" r="12" stroke={color} strokeWidth="2" />
    <Circle cx="16" cy="16" r="6" fill={color} />
  </Svg>
);

export const BohemianIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M16 2 L22 10 L30 10 L24 15 L27 24 L16 19 L5 24 L8 15 L2 10 L10 10 Z" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

export const RusticIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M6 28 L8 14 L16 4 L24 14 L26 28 Z" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="16" y1="14" x2="16" y2="28" stroke={color} strokeWidth="2" />
    <Line x1="10" y1="20" x2="22" y2="20" stroke={color} strokeWidth="2" />
  </Svg>
);

export const VintageIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="16" r="12" stroke={color} strokeWidth="2" />
    <Circle cx="16" cy="16" r="2" fill={color} />
    <Line x1="16" y1="5" x2="16" y2="9" stroke={color} strokeWidth="2" />
    <Line x1="27" y1="16" x2="23" y2="16" stroke={color} strokeWidth="2" />
    <Line x1="16" y1="23" x2="16" y2="27" stroke={color} strokeWidth="2" />
    <Line x1="9" y1="16" x2="5" y2="16" stroke={color} strokeWidth="2" />
  </Svg>
);

export const TropicalIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M16 2 Q20 8 18 16 Q16 24 16 30" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M8 10 Q10 14 14 14" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M24 10 Q22 14 18 14" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

export const IndustrialIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="4" width="24" height="24" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="8" y1="12" x2="24" y2="12" stroke={color} strokeWidth="2" />
    <Line x1="8" y1="20" x2="24" y2="20" stroke={color} strokeWidth="2" />
  </Svg>
);

export const ScandinavianIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M16 2 L26 10 L26 28 L6 28 L6 10 Z" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="16" y1="10" x2="16" y2="28" stroke={color} strokeWidth="2" />
    <Rect x="8" y="14" width="6" height="6" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="18" y="14" width="6" height="6" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

export const BaroqueIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M16 2 L20 8 L26 10 L22 14 L23 20 L16 17 L9 20 L10 14 L6 10 L12 8 Z" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="16" cy="16" r="2" fill={color} />
  </Svg>
);

export const ChristmasIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M16 2 L20 8 L26 10 L22 14 L23 20 L16 17 L9 20 L10 14 L6 10 L12 8 Z" stroke={color} strokeWidth="2" fill={color} />
    <Line x1="16" y1="20" x2="16" y2="28" stroke={color} strokeWidth="2" />
    <Rect x="12" y="24" width="8" height="4" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

export const ContemporaryIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="8" width="10" height="18" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="18" y="4" width="10" height="22" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

export const CustomIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M26 4 L28 2 L30 4 L28 6 Z" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="26" y1="6" x2="6" y2="26" stroke={color} strokeWidth="2" />
    <Line x1="2" y1="30" x2="6" y2="26" stroke={color} strokeWidth="2" />
    <Line x1="2" y1="30" x2="6" y2="30" stroke={color} strokeWidth="2" />
  </Svg>
);
