import React from 'react';

// Style Icons
import {
  ModernIcon,
  MinimalistIcon,
  BohemianIcon,
  RusticIcon,
  VintageIcon,
  TropicalIcon,
  IndustrialIcon,
  ScandinavianIcon,
  BaroqueIcon,
  ChristmasIcon,
  ContemporaryIcon,
  CustomIcon,
} from './StyleIcons';

// Room Icons
import {
  KitchenIcon,
  LivingRoomIcon,
  BedroomIcon,
  BathroomIcon,
  HomeOfficeIcon,
  DiningRoomIcon,
  StudyIcon,
  GamingRoomIcon,
  KidsRoomIcon,
  LaundryIcon,
  GarageIcon,
  BasementIcon,
} from './RoomIcons';

// Exterior Icons
import {
  FrontFacadeIcon,
  BackPatioIcon,
  EntranceIcon,
  PorchIcon,
  DeckIcon,
  DrivewayIcon,
} from './ExteriorIcons';

// Garden Icons
import {
  FrontGardenIcon,
  BackyardIcon,
  VegetableGardenIcon,
  PatioGardenIcon,
  LandscapeIcon,
  PoolAreaIcon,
} from './GardenIcons';

// Paint Icons
import {
  PaintIcon,
  BrushIcon,
  ColorIcon,
  WallIcon,
  RoomIcon,
  HallwayIcon,
  OfficeIcon,
} from './PaintIcons';

interface IconProps {
  size?: number;
  color?: string;
}

export const getIconComponent = (iconId: string) => {
  const iconMap: { [key: string]: React.FC<IconProps> } = {
    // Style Icons
    'custom': CustomIcon,
    'modern': ModernIcon,
    'minimalist': MinimalistIcon,
    'bohemian': BohemianIcon,
    'rustic': RusticIcon,
    'vintage': VintageIcon,
    'tropical': TropicalIcon,
    'industrial': IndustrialIcon,
    'scandinavian': ScandinavianIcon,
    'baroque': BaroqueIcon,
    'christmas': ChristmasIcon,
    'contemporary': ContemporaryIcon,

    // Room Icons (Interior)
    'kitchen': KitchenIcon,
    'living-room': LivingRoomIcon,
    'bedroom': BedroomIcon,
    'bathroom': BathroomIcon,
    'home-office': HomeOfficeIcon,
    'dining-room': DiningRoomIcon,
    'study': StudyIcon,
    'gaming-room': GamingRoomIcon,
    'kids-room': KidsRoomIcon,
    'laundry': LaundryIcon,
    'garage': GarageIcon,
    'basement': BasementIcon,

    // Exterior Icons
    'front-facade': FrontFacadeIcon,
    'back-patio': BackPatioIcon,
    'entrance': EntranceIcon,
    'porch': PorchIcon,
    'deck': DeckIcon,
    'driveway': DrivewayIcon,

    // Garden Icons
    'front-garden': FrontGardenIcon,
    'backyard': BackyardIcon,
    'vegetable-garden': VegetableGardenIcon,
    'patio-garden': PatioGardenIcon,
    'landscape': LandscapeIcon,
    'pool-area': PoolAreaIcon,

    // Paint Icons (these are duplicate IDs but used in different contexts)
    // Using the Paint context icons for paint-specific rooms
  };

  return iconMap[iconId] || CustomIcon;
};

export {
  CustomIcon,
  ModernIcon,
  MinimalistIcon,
  BohemianIcon,
  RusticIcon,
  VintageIcon,
  TropicalIcon,
  IndustrialIcon,
  ScandinavianIcon,
  BaroqueIcon,
  ChristmasIcon,
  ContemporaryIcon,
  KitchenIcon,
  LivingRoomIcon,
  BedroomIcon,
  BathroomIcon,
  HomeOfficeIcon,
  DiningRoomIcon,
  StudyIcon,
  GamingRoomIcon,
  KidsRoomIcon,
  LaundryIcon,
  GarageIcon,
  BasementIcon,
  FrontFacadeIcon,
  BackPatioIcon,
  EntranceIcon,
  PorchIcon,
  DeckIcon,
  DrivewayIcon,
  FrontGardenIcon,
  BackyardIcon,
  VegetableGardenIcon,
  PatioGardenIcon,
  LandscapeIcon,
  PoolAreaIcon,
  PaintIcon,
  BrushIcon,
  ColorIcon,
  WallIcon,
  RoomIcon,
  HallwayIcon,
  OfficeIcon,
};
