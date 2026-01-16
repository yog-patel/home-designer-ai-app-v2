import React from 'react';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const FrontFacadeIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M16 2 L26 10 L26 28 L6 28 L6 10 Z" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="8" y="14" width="5" height="6" stroke={color} strokeWidth="1.5" fill="none" />
    <Rect x="19" y="14" width="5" height="6" stroke={color} strokeWidth="1.5" fill="none" />
    <Circle cx="16" cy="20" r="1" fill={color} />
  </Svg>
);

export const BackPatioIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="6" width="24" height="22" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="8" y1="10" x2="24" y2="10" stroke={color} strokeWidth="1" />
    <Line x1="8" y1="14" x2="24" y2="14" stroke={color} strokeWidth="1" />
    <Line x1="8" y1="18" x2="24" y2="18" stroke={color} strokeWidth="1" />
    <Line x1="8" y1="22" x2="24" y2="22" stroke={color} strokeWidth="1" />
  </Svg>
);

export const EntranceIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="6" y="2" width="20" height="28" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="10" y="10" width="12" height="16" stroke={color} strokeWidth="1.5" fill="none" />
    <Circle cx="21" cy="18" r="1.5" fill={color} />
  </Svg>
);

export const PorchIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M8 10 L8 28 L24 28 L24 10" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="8" y1="10" x2="10" y2="4" stroke={color} strokeWidth="2" />
    <Line x1="16" y1="8" x2="16" y2="2" stroke={color} strokeWidth="2" />
    <Line x1="24" y1="10" x2="22" y2="4" stroke={color} strokeWidth="2" />
  </Svg>
);

export const DeckIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="8" width="24" height="20" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="4" y1="12" x2="28" y2="12" stroke={color} strokeWidth="1" />
    <Line x1="4" y1="16" x2="28" y2="16" stroke={color} strokeWidth="1" />
    <Line x1="4" y1="20" x2="28" y2="20" stroke={color} strokeWidth="1" />
    <Line x1="4" y1="24" x2="28" y2="24" stroke={color} strokeWidth="1" />
  </Svg>
);

export const DrivewayIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="6" y="2" width="20" height="28" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="6" y1="10" x2="26" y2="10" stroke={color} strokeWidth="1.5" />
    <Line x1="6" y1="18" x2="26" y2="18" stroke={color} strokeWidth="1.5" />
    <Line x1="6" y1="26" x2="26" y2="26" stroke={color} strokeWidth="1.5" />
  </Svg>
);
