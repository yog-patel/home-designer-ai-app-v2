import React from 'react';
import Svg, { Path, Rect, Circle, Line, Polygon } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const KitchenIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="4" width="24" height="24" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="10" cy="10" r="3" stroke={color} strokeWidth="1.5" />
    <Circle cx="10" cy="18" r="3" stroke={color} strokeWidth="1.5" />
    <Circle cx="22" cy="10" r="3" stroke={color} strokeWidth="1.5" />
    <Circle cx="22" cy="18" r="3" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const LivingRoomIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="12" width="24" height="14" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="6" y="14" width="6" height="4" stroke={color} strokeWidth="1.5" fill="none" />
    <Rect x="14" y="14" width="6" height="4" stroke={color} strokeWidth="1.5" fill="none" />
    <Rect x="22" y="14" width="4" height="4" stroke={color} strokeWidth="1.5" fill="none" />
  </Svg>
);

export const BedroomIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="6" width="24" height="22" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="6" y="8" width="20" height="12" stroke={color} strokeWidth="1.5" fill="none" />
    <Line x1="6" y1="20" x2="26" y2="20" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const BathroomIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="6" width="24" height="22" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="6" y="8" width="8" height="8" stroke={color} strokeWidth="1.5" fill="none" />
    <Circle cx="20" cy="12" r="4" stroke={color} strokeWidth="1.5" fill="none" />
    <Rect x="8" y="22" width="16" height="4" stroke={color} strokeWidth="1.5" fill="none" />
  </Svg>
);

export const HomeOfficeIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="6" width="24" height="22" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="6" y="8" width="12" height="8" stroke={color} strokeWidth="1.5" fill="none" />
    <Rect x="20" y="8" width="4" height="8" stroke={color} strokeWidth="1.5" fill="none" />
    <Line x1="6" y1="20" x2="26" y2="20" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const DiningRoomIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="6" y="8" width="20" height="12" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="16" cy="14" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    <Line x1="16" y1="20" x2="16" y2="26" stroke={color} strokeWidth="2" />
    <Rect x="14" y="26" width="4" height="2" stroke={color} strokeWidth="1.5" fill="none" />
  </Svg>
);

export const StudyIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="4" width="24" height="24" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="8" y="8" width="8" height="8" stroke={color} strokeWidth="1.5" fill="none" />
    <Rect x="18" y="8" width="8" height="8" stroke={color} strokeWidth="1.5" fill="none" />
    <Line x1="8" y1="20" x2="24" y2="20" stroke={color} strokeWidth="1.5" />
    <Line x1="8" y1="24" x2="24" y2="24" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const GamingRoomIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="8" width="24" height="18" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="10" cy="14" r="2" fill={color} />
    <Circle cx="10" cy="20" r="2" fill={color} />
    <Circle cx="22" cy="17" r="2" fill={color} />
    <Line x1="8" y1="26" x2="24" y2="26" stroke={color} strokeWidth="2" />
  </Svg>
);

export const KidsRoomIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="8" width="24" height="20" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="12" cy="14" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    <Path d="M10 18 L14 18 L13 22 L11 22 Z" stroke={color} strokeWidth="1.5" fill="none" />
    <Circle cx="22" cy="14" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    <Path d="M20 18 L24 18 L23 22 L21 22 Z" stroke={color} strokeWidth="1.5" fill="none" />
  </Svg>
);

export const LaundryIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="16" r="12" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="16" cy="16" r="6" stroke={color} strokeWidth="1.5" fill="none" />
    <Line x1="16" y1="4" x2="16" y2="10" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const GarageIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="6" width="24" height="22" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Line x1="16" y1="6" x2="16" y2="28" stroke={color} strokeWidth="1.5" />
    <Line x1="4" y1="16" x2="28" y2="16" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const BasementIcon = ({ size = 32, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="4" y="8" width="24" height="20" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="10" cy="12" r="2" fill={color} />
    <Circle cx="16" cy="12" r="2" fill={color} />
    <Circle cx="22" cy="12" r="2" fill={color} />
    <Line x1="6" y1="20" x2="26" y2="20" stroke={color} strokeWidth="1.5" />
  </Svg>
);
