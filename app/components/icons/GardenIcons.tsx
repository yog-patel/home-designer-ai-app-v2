import React from 'react';
import Svg, { Path, Rect, Circle, Line, Polygon } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const FrontGardenIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="10" width="24" height="18" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M8 26 Q8 20 10 16" stroke={color} strokeWidth="1.5" fill="none" />
    <Path d="M16 26 Q16 18 18 12" stroke={color} strokeWidth="1.5" fill="none" />
    <Path d="M24 26 Q24 20 22 16" stroke={color} strokeWidth="1.5" fill="none" />
  </Svg>
);

export const BackyardIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="6" width="24" height="22" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M10 28 Q10 22 12 18" stroke={color} strokeWidth="1.5" fill="none" />
    <Path d="M22 28 Q22 22 20 18" stroke={color} strokeWidth="1.5" fill="none" />
    <Circle cx="16" cy="14" r="3" stroke={color} strokeWidth="1.5" fill="none" />
  </Svg>
);

export const VegetableGardenIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="10" width="24" height="18" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="8" y1="28" x2="8" y2="20" stroke={color} strokeWidth="1.5" />
    <Line x1="16" y1="28" x2="16" y2="20" stroke={color} strokeWidth="1.5" />
    <Line x1="24" y1="28" x2="24" y2="20" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const PatioGardenIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="18" r="12" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="16" y1="6" x2="16" y2="30" stroke={color} strokeWidth="1.5" />
    <Line x1="4" y1="18" x2="28" y2="18" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const LandscapeIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M4 20 Q8 10 12 14 Q16 8 20 16 Q24 12 28 20 L28 28 L4 28 Z" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

export const PoolAreaIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="10" width="24" height="16" rx="4" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="8" y1="14" x2="24" y2="14" stroke={color} strokeWidth="1" />
    <Line x1="8" y1="18" x2="24" y2="18" stroke={color} strokeWidth="1" />
    <Line x1="8" y1="22" x2="24" y2="22" stroke={color} strokeWidth="1" />
  </Svg>
);
