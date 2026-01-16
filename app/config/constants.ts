// Design styles and palettes
export const DESIGN_STYLES = [
  { id: 'custom', name: 'Custom' },
  { id: 'modern', name: 'Modern' },
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'bohemian', name: 'Bohemian' },
  { id: 'rustic', name: 'Rustic' },
  { id: 'vintage', name: 'Vintage' },
  { id: 'tropical', name: 'Tropical' },
  { id: 'industrial', name: 'Industrial' },
  { id: 'scandinavian', name: 'Scandinavian' },
  { id: 'baroque', name: 'Baroque' },
  { id: 'christmas', name: 'Christmas' },
  { id: 'contemporary', name: 'Contemporary' },
];

export const COLOR_PALETTES = [
  {
    id: 'surprise',
    name: 'Surprise Me',
    colors: ['#FFD700', '#FF8C00', '#FF0000', '#00FF00', '#0000FF', '#FF00FF'],
  },
  {
    id: 'millennial-gray',
    name: 'Millennial Gray',
    colors: ['#F5F5F5', '#D3D3D3', '#A9A9A9', '#808080', '#696969'],
  },
  {
    id: 'terracotta',
    name: 'Terracotta Mirage',
    colors: ['#FFE4D6', '#FFD4C4', '#FFCAB0', '#E07856', '#D64545'],
  },
  {
    id: 'neon-sunset',
    name: 'Neon Sunset',
    colors: ['#FF8C00', '#FF1493', '#FFD700', '#FFFF00', '#F0E68C'],
  },
  {
    id: 'forest-hues',
    name: 'Forest Hues',
    colors: ['#6B8E23', '#9ACD32', '#ADFF2F', '#F0E68C', '#7CB342'],
  },
  {
    id: 'peach-orchard',
    name: 'Peach Orchard',
    colors: ['#FDBCB4', '#FDBCB4', '#FFC9B3', '#E8A87C', '#F08080'],
  },
  {
    id: 'fuschia-blossom',
    name: 'Fuschia Blossom',
    colors: ['#FFC0CB', '#FFB6C1', '#FF69B4', '#C71585', '#D63384'],
  },
  {
    id: 'emerald-gem',
    name: 'Emerald Gem',
    colors: ['#1B4D3E', '#4A7C59', '#A4D65E', '#F0E68C', '#D3D3D3'],
  },
  {
    id: 'pastel-breeze',
    name: 'Pastel Breeze',
    colors: ['#B0E0E6', '#F0E68C', '#DDA0DD', '#F5F5DC', '#E6E6FA'],
  },
];

export const ROOM_TYPES = [
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'living-room', name: 'Living Room' },
  { id: 'bedroom', name: 'Bedroom' },
  { id: 'bathroom', name: 'Bathroom' },
  { id: 'home-office', name: 'Home Office' },
  { id: 'dining-room', name: 'Dining Room' },
  { id: 'study', name: 'Study Room' },
  { id: 'gaming-room', name: 'Gaming Room' },
  { id: 'kids-room', name: "Kids' Room" },
  { id: 'laundry', name: 'Laundry Room' },
  { id: 'garage', name: 'Garage' },
  { id: 'basement', name: 'Basement' },
];

export const EXTERIOR_TYPES = [
  { id: 'front-facade', name: 'Front Facade' },
  { id: 'back-patio', name: 'Back Patio' },
  { id: 'entrance', name: 'Entrance' },
  { id: 'porch', name: 'Porch' },
  { id: 'deck', name: 'Deck' },
  { id: 'driveway', name: 'Driveway' },
];

export const GARDEN_TYPES = [
  { id: 'front-garden', name: 'Front Garden' },
  { id: 'backyard', name: 'Backyard' },
  { id: 'vegetable-garden', name: 'Vegetable Garden' },
  { id: 'patio-garden', name: 'Patio Garden' },
  { id: 'landscape', name: 'Landscape' },
  { id: 'pool-area', name: 'Pool Area' },
];

export const PAINT_TYPES = [
  { id: 'living-room', name: 'Living Room' },
  { id: 'bedroom', name: 'Bedroom' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'bathroom', name: 'Bathroom' },
  { id: 'hallway', name: 'Hallway' },
  { id: 'office', name: 'Office' },
];

export const REPLACE_TYPES = [
  { id: 'furniture', name: 'Furniture' },
  { id: 'flooring', name: 'Flooring' },
  { id: 'lighting', name: 'Lighting' },
  { id: 'fixtures', name: 'Fixtures' },
  { id: 'decorations', name: 'Decorations' },
  { id: 'hardware', name: 'Hardware' },
];

export const FLOOR_TYPES = [
  { id: 'residential', name: 'Residential' },
  { id: 'office', name: 'Office' },
  { id: 'apartment', name: 'Apartment' },
  { id: 'commercial', name: 'Commercial' },
  { id: 'studio', name: 'Studio' },
  { id: 'warehouse', name: 'Warehouse' },
];

// Generate prompt from selections
export const generatePrompt = (
  roomType: string,
  style: string,
  palette?: string,
  customPrompt?: string,
  action?: string
): string => {
  if (customPrompt) {
    return customPrompt;
  }

  let prompt = '';

  switch (action) {
    case 'exterior':
      prompt = `Exterior design of a ${roomType} in ${style} style`;
      break;
    case 'garden':
      prompt = `Garden design of a ${roomType} in ${style} style`;
      break;
    case 'paint':
      prompt = `Paint design for a ${roomType} in ${style} style`;
      break;
    case 'replace':
      prompt = `Replace ${roomType} with ${style} style design`;
      break;
    case 'floor':
      prompt = `Floor plan redesign of a ${roomType} space in ${style} style`;
      break;
    case 'interior':
    default:
      prompt = `Interior design of a ${roomType} in ${style} style`;
  }

  if (palette && palette !== 'surprise') {
    const paletteObj = COLOR_PALETTES.find((p) => p.id === palette);
    if (paletteObj) {
      prompt += ` with ${paletteObj.name.toLowerCase()} color palette`;
    }
  }

  prompt += '. High quality, realistic, professional photo.';
  return prompt;
};
