// ============================================================
// Indy Pothole Runner — Tuning Constants
// ============================================================

export const GAME = {
  // Speed
  INITIAL_SPEED: 2,
  MAX_SPEED: 8,
  SPEED_INCREASE_RATE: 0.001,

  // Scoring
  MILES_PER_UNIT: 0.0001,
};

export const ROAD = {
  ROAD_WIDTH: 1200,
  LANE_COUNT: 2,
  RUMBLE_LENGTH: 3, // segments per rumble strip alternation
  DRAW_DISTANCE: 100,
  CAMERA_HEIGHT: 150,
  CAMERA_DEPTH: 0.84, // ~1/tan(25deg) — controls perspective strength
};

export const CAR = {
  MOVE_SPEED: 5,
  MOMENTUM: 0.85,
  MAX_DAMAGE: 5,
  WIDTH: 80,
  HEIGHT: 50,
  // Position from bottom of screen (percentage)
  BOTTOM_OFFSET: 0.18,
};

export const POTHOLE = {
  SPAWN_RATE_INITIAL: 0.012,
  SPAWN_RATE_MAX: 0.10,
  MIN_SIZE: 25,
  MAX_SIZE: 160,
};

export const SEASONS = {
  SUMMER: { start: 0, label: 'Late Summer' },
  FALL: { start: 1.0, label: 'Fall' },
  WINTER: { start: 2.5, label: 'Winter' },
  SPRING: { start: 4.0, label: 'Spring' },
};

// Each tier has a pool of possible damages with varied costs
// Use {street} as a placeholder — gets replaced with current street at runtime
export const DAMAGE_TIERS = [
  // Tier 1 — minor
  [
    { message: 'Your alignment is off', cost: 387 },
    { message: 'Scraped the undercarriage', cost: 295 },
    { message: 'Spilled your coffee', cost: 8 },
    { message: 'Cracked a hubcap on {street}', cost: 180 },
    { message: 'Bumper is rattling', cost: 425 },
  ],
  // Tier 2 — moderate
  [
    { message: 'Check engine light on', cost: 742 },
    { message: 'Tire pressure warning near {street}', cost: 520 },
    { message: 'Lost a side mirror on {street}', cost: 680 },
    { message: 'Muffler is dragging', cost: 890 },
    { message: 'Suspension is groaning', cost: 615 },
  ],
  // Tier 3 — significant
  [
    { message: 'Hubcap flew off near {street}', cost: 1205 },
    { message: 'Flat tire on {street}', cost: 950 },
    { message: 'Radiator is leaking', cost: 1380 },
    { message: 'Oil pan cracked open on {street}', cost: 1150 },
    { message: 'Transmission is slipping', cost: 1425 },
  ],
  // Tier 4 — severe
  [
    { message: 'Axle is hanging on by a prayer', cost: 1863 },
    { message: 'Frame is bent near {street}', cost: 2100 },
    { message: 'Steering column is loose', cost: 1750 },
    { message: 'Engine is knocking badly', cost: 1950 },
    { message: 'Wheel bearing disintegrated on {street}', cost: 1680 },
  ],
  // Tier 5 — fatal
  [
    { message: "Your car didn't make it", cost: 2450 },
    { message: 'Car broke down on {street}', cost: 2800 },
    { message: 'Engine seized on {street} — tow truck called', cost: 3200 },
    { message: 'Total loss — call your insurance', cost: 2650 },
    { message: "That's it. The car is done.", cost: 2950 },
  ],
];

export const STREET_SIGNS = [
  { distance: 0.0, name: 'Washington St', landmark: 'statehouse', landmarkLabel: 'State Capitol', side: -1 },
  { distance: 0.3, name: 'New York St', landmark: 'fieldhouse', landmarkLabel: 'Gainbridge Fieldhouse', side: 1 },
  { distance: 0.7, name: '16th St', landmark: 'speedway', landmarkLabel: 'IMS', side: -1 },
  { distance: 1.2, name: 'Fall Creek Pkwy', landmark: 'museum', landmarkLabel: 'Newfields', side: 1 },
  { distance: 1.8, name: '38th St', landmark: 'cemetery', landmarkLabel: 'Crown Hill', side: -1 },
  { distance: 2.3, name: '46th St', landmark: 'university', landmarkLabel: 'Butler Univ.', side: 1 },
  { distance: 2.8, name: '56th St & College Ave', landmark: 'monon', landmarkLabel: 'Monon Trail', side: -1 },
  { distance: 3.3, name: 'Broad Ripple Ave', landmark: 'broadripple', landmarkLabel: 'Broad Ripple', side: 1 },
  { distance: 3.9, name: '71st St', landmark: 'stripmall', landmarkLabel: 'Nora', side: -1 },
  { distance: 4.5, name: '86th St', landmark: 'bigbox', landmarkLabel: 'Castleton Mall', side: 1 },
  { distance: 5.2, name: '96th St', landmark: 'office', landmarkLabel: 'Keystone Crossing', side: -1 },
  { distance: 6.0, name: '116th St', landmark: 'arts', landmarkLabel: 'Palladium', side: 1 },
];

export const COLORS = {
  SKY_SUMMER: { top: '#4A90D9', bottom: '#87CEEB' },
  SKY_FALL: { top: '#6B7B8D', bottom: '#A0ADB8' },
  SKY_WINTER: { top: '#8895A0', bottom: '#B0BEC5' },
  SKY_SPRING: { top: '#607080', bottom: '#90A0A8' },

  ROAD_DARK: '#333333',
  ROAD_LIGHT: '#3A3A3A',
  GRASS_DARK_SUMMER: '#4A7C2E',
  GRASS_LIGHT_SUMMER: '#5A8C3E',
  GRASS_DARK_FALL: '#6B6030',
  GRASS_LIGHT_FALL: '#7B7040',
  GRASS_DARK_WINTER: '#8A8A8A',
  GRASS_LIGHT_WINTER: '#9A9A9A',
  GRASS_DARK_SPRING: '#3A6A2E',
  GRASS_LIGHT_SPRING: '#4A7A3E',

  RUMBLE_DARK: '#BBBBBB',
  RUMBLE_LIGHT: '#DD0000',
  LANE_MARKER: '#CCCCCC',

  CAR_BODY: '#2E5CB8',
  CAR_ROOF: '#1E3C78',
  CAR_WINDOW: '#7EC8E3',
  CAR_TAILLIGHT: '#FF3333',
  CAR_TAILLIGHT_OFF: '#880000',

  POTHOLE_FILL: '#1A1A1A',
  POTHOLE_RING: '#2A2A2A',

  SIGN_BG: '#006B3F',
  SIGN_TEXT: '#FFFFFF',
  SIGN_POST: '#888888',
};
