import React from 'react';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const PaintIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M4 6 Q4 4 6 4 L26 4 Q28 4 28 6 L28 20 Q28 24 24 24 L8 24 Q4 24 4 20 Z" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="8" y="12" width="16" height="8" stroke={color} strokeWidth="1.5" fill="none" />
  </Svg>
);

export const BrushIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M6 4 L10 8 L10 24 Q10 26 8 26 L6 26 Q4 26 4 24 L4 8 Z" stroke={color} strokeWidth="1.5" fill="none" />
    <Line x1="28" y1="4" x2="10" y2="26" stroke={color} strokeWidth="2" />
  </Svg>
);

export const ColorIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="16" r="12" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="16" cy="16" r="6" stroke={color} strokeWidth="1.5" fill="none" />
    <Circle cx="16" cy="16" r="2" fill={color} />
  </Svg>
);

export const WallIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="6" width="24" height="22" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="16" y1="6" x2="16" y2="28" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const RoomIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="8" width="24" height="20" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="6" y="10" width="20" height="16" stroke={color} strokeWidth="1.5" fill="none" />
  </Svg>
);

export const HallwayIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="8" width="24" height="20" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="4" y1="16" x2="28" y2="16" stroke={color} strokeWidth="1.5" />
    <Line x1="4" y1="24" x2="28" y2="24" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const OfficeIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="6" width="24" height="22" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="8" y="10" width="8" height="8" stroke={color} strokeWidth="1.5" fill="none" />
    <Rect x="18" y="10" width="8" height="8" stroke={color} strokeWidth="1.5" fill="none" />
  </Svg>
);
