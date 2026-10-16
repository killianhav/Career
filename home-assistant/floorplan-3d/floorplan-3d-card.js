/*
 * floorplan-3d-card — a live 3D model of the house for Home Assistant.
 *
 * Geometry is traced from the estate-agent floor plans (Daft.ie, ground + 1st floor).
 * Units are metres. +x runs east (left → right on the plan), +z runs to the FRONT of the
 * house (bottom of the plan), so the back garden / kitchen is at negative z.
 *
 * Usage (Lovelace, panel view):
 *   type: custom:floorplan-3d-card
 *   # everything below is optional – defaults match this house
 *   height: 100%            # css height; default fills a panel view
 *   floor: 0                # initial floor: 0 | 1 | all
 *   house_bearing: 95       # compass bearing the BACK of the house faces (for the sun)
 *   devices: [...]          # replace the default entity → room mapping (see DEFAULT_DEVICES)
 *   vacuum_map: camera.xxx_map   # Dreame map camera: live robot position, rooms, progress
 */

const VERSION = '1.1.0';
const DEFAULT_THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

/* ------------------------------------------------------------------ icons (MDI) */
const ICON = {
  bulb: 'M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z',
  bulbOff: 'M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z',
  thermo: 'M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z',
  blindOpen: 'M20 19V3H4V19H2V21H22V19H20M16 9H18V11H16V9M14 11H6V9H14V11M18 7H16V5H18V7M14 5V7H6V5H14M6 19V13H14V14.82C13.55 15.14 13.25 15.66 13.25 16.25C13.25 17.22 14.03 18 15 18S16.75 17.22 16.75 16.25C16.75 15.66 16.45 15.13 16 14.82V13H18V19H6Z',
  blindClosed: 'M20 19V3H4V19H2V21H13.25C13.25 21.97 14.03 22.75 15 22.75S16.75 21.97 16.75 21H22V19H20M18 11H16V9H18V11M14 11H6V9H14V11M14 13V15H6V13H14M16 13H18V15H16V13M18 7H16V5H18V7M14 5V7H6V5H14M6 19V17H14V19H6M16 19V17H18V19H16Z',
  windowClosed: 'M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z',
  windowOpen: 'M21 20V2H3V20H1V23H23V20M19 4V11H17V4M5 4H7V11H5M5 20V13H7V20M9 20V4H15V20M17 20V13H19V20Z',
  doorClosed: 'M16,11H18V13H16V11M12,3H19C20.11,3 21,3.89 21,5V19H22V21H2V19H10V5C10,3.89 10.89,3 12,3M12,5V19H19V5H12Z',
  doorOpen: 'M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z',
  motion: 'M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z',
  tv: 'M21,17H3V5H21M21,3H3A2,2 0 0,0 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5A2,2 0 0,0 21,3Z',
  vacuum: 'M12,2C14.65,2 17.19,3.06 19.07,4.93L17.650,6.35C16.15,4.85 14.12,4 12,4C9.88,4 7.84,4.840 6.35,6.35L4.93,4.93C6.81,3.06 9.35,2 12,2M3.66,6.5L5.11,7.94C4.39,9.17 4,10.57 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,10.57 19.61,9.17 18.88,7.94L20.34,6.5C21.42,8.12 22,10.04 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12C2,10.04 2.58,8.12 3.66,6.5M12,6A6,6 0 0,1 18,12C18,13.59 17.37,15.12 16.24,16.24L14.83,14.83C14.08,15.58 13.06,16 12,16C10.94,16 9.92,15.58 9.17,14.83L7.76,16.24C6.63,15.12 6,13.59 6,12A6,6 0 0,1 12,6M12,8A1,1 0 0,0 11,9A1,1 0 0,0 12,10A1,1 0 0,0 13,9A1,1 0 0,0 12,8Z',
  shield: 'M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z',
  shieldOff: 'M1,4.27L2.28,3L20.5,21.22L19.23,22.5L17,20.25C15.57,21.57 13.87,22.54 12,23C6.84,21.74 3,16.55 3,11V6.27L1,4.27M12,1L21,5V11C21,13.28 20.35,15.5 19.23,17.41L5.65,3.82L12,1Z',
  fire: 'M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.850 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z',
  floorG: 'M12,3L2,12H5V20H19V12H22L12,3M11,8H15V10H11V16H13V12H15V16C15,17.11 14.1,18 13,18H11A2,2 0 0,1 9,16V10C9,8.89 9.9,8 11,8Z',
  floor1: 'M12,3L2,12H5V20H19V12H22L12,3M10,8H14V18H12V10H10V8Z',
  layers: 'M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z',
  home: 'M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z',
  doorbell: 'M14 15C14 16.11 13.11 17 12 17S10 16.11 10 15 10.9 13 12 13 14 13.9 14 15M18 4V20C18 21.1 17.11 22 16 22H8C6.9 22 6 21.11 6 20V4C6 2.9 6.9 2 8 2H16C17.11 2 18 2.9 18 4M10.5 7C10.5 7.83 11.17 8.5 12 8.5S13.5 7.830 13.5 7 12.83 5.5 12 5.5 10.5 6.17 10.5 7M16 10H8V20H16V10Z',
  cctv: 'M6.03 12.03L8.03 15.5L5.5 18.68L2 12.62L6.03 12.03M17 18V15.29C17.88 14.9 18.5 14.03 18.5 13C18.5 12.43 18.3 11.9 17.97 11.5L19.94 10.35C20.95 9.76 21.3 8.47 20.71 7.46L19.33 5.06C18.74 4.05 17.45 3.7 16.44 4.28L8.31 9C7.36 9.53 7.03 10.75 7.58 11.71L9.08 14.31C9.63 15.26 10.86 15.59 11.81 15.04L13.69 13.96C13.94 14.55 14.41 15.03 15 15.29V18C15 19.1 15.9 20 17 20H22V18H17Z',
  tree: 'M11,21V16.74C10.53,16.91 10.03,17 9.5,17C7,17 5,15 5,12.5C5,11.23 5.5,10.09 6.36,9.27C6.13,8.73 6,8.13 6,7.5C6,5 8,3 10.5,3C12.06,3 13.44,3.8 14.25,5C14.33,5 14.41,5 14.5,5A5.5,5.5 0 0,1 20,10.5A5.5,5.5 0 0,1 14.5,16C14,16 13.5,15.93 13,15.79V21H11Z',
};
const svg = (d, cls = '') => `<svg viewBox="0 0 24 24" class="${cls}"><path d="${d}"/></svg>`;

/* ------------------------------------------------------------------ house model */
const WALL_H = 2.4;
const SLAB = 0.3;
const STOREY = WALL_H + SLAB;
const EXT = 0.16; // exterior wall thickness
const INT = 0.1; // interior wall thickness

// Opening types: w = window (sill 0.9m, head 2.1m), d = door, g = glazed door, o = open
// Each wall: { a:[x,z], b:[x,z], t, o:[[from,to,type], ...] } – opening offsets are metres from `a`.
const FLOORS = [
  {
    id: 0,
    name: 'Ground floor',
    walls: [
      // exterior
      { a: [-0.06, 1.32], b: [-0.06, 9.82], t: EXT },
      { a: [-0.06, 1.32], b: [2.82, 1.32], t: EXT, o: [[0.64, 1.94, 'g']] }, // dining french doors
      { a: [2.82, 1.32], b: [2.82, 0.07], t: EXT, o: [[0.17, 0.6, 'w']] },
      { a: [2.82, 0.07], b: [5.0, 0.07], t: EXT, o: [[0.35, 1.57, 'w']] }, // kitchen sink window
      { a: [5.0, 0.07], b: [5.0, 9.45], t: EXT, o: [[4.83, 5.27, 'w']] }, // WC window
      { a: [5.0, 9.45], b: [3.15, 9.45], t: EXT, o: [[0.08, 0.53, 'w'], [0.68, 1.38, 'D']] }, // black composite front door, doorbell to its right
      { a: [3.15, 9.45], b: [3.15, 9.82], t: EXT },
      { a: [3.15, 9.82], b: [-0.06, 9.82], t: EXT, o: [[0.43, 2.72, 'w']] }, // living bay window
      // interior
      { a: [-0.06, 4.81], b: [3.53, 4.81], o: [[0.64, 1.94, 'g']] }, // dining ↔ living double doors
      { a: [3.53, 4.66], b: [3.53, 9.45], o: [[3.51, 4.14, 'd']] }, // living ↔ hall
      { a: [3.53, 4.66], b: [5.0, 4.66], o: [[0.08, 0.62, 'd']] }, // hall ↔ kitchen
      { a: [4.18, 4.66], b: [4.18, 6.11], o: [[0.24, 0.9, 'd']] }, // WC
      { a: [4.18, 6.11], b: [5.0, 6.11] },
      { a: [4.18, 6.11], b: [4.18, 8.61], t: 0.05, h: 1.0 }, // stair balustrade
    ],
    rooms: [
      { id: 'kitchen', name: 'Kitchen / Dining', finish: 'tile', rects: [[-0.06, 1.32, 2.82, 4.81], [2.82, 0.07, 5.0, 4.66], [2.82, 4.66, 3.53, 4.81]] },
      { id: 'living', name: 'Living room', finish: 'wood', rects: [[-0.06, 4.81, 3.53, 9.82]] },
      { id: 'hallway', name: 'Hallway', finish: 'woodDark', rects: [[3.53, 4.66, 4.18, 9.45], [4.18, 6.11, 5.0, 9.45]] },
      { id: 'wc', name: 'WC', finish: 'tileBlue', rects: [[4.18, 4.66, 5.0, 6.11]] },
    ],
    furniture: [
      // kitchen
      ['counter', 4.33, 0.15, 4.92, 4.6],
      ['counter', 2.9, 0.15, 4.33, 0.72],
      ['box', 4.42, 2.0, 4.86, 2.6, 0.02, '#1b1b1b', 0.93], // hob
      ['box', 3.5, 0.22, 4.1, 0.6, 0.02, '#a9b2ba', 0.93], // sink
      ['box', 4.33, 3.95, 4.92, 4.6, 1.95, '#e9ebed'], // fridge
      ['table', 0.75, 2.35, 1.95, 3.55, '#9a6a3f'],
      ['chair', 0.55, 2.65, 0], ['chair', 0.55, 3.25, 0], ['chair', 2.15, 2.65, 180], ['chair', 2.15, 3.25, 180],
      ['plant', 0.25, 1.6],
      // living
      ['box', -0.06, 6.49, 0.34, 7.74, WALL_H, 'wall'], // chimney breast
      ['box', 0.33, 6.8, 0.37, 7.43, 0.75, '#2a2420'], // fireplace
      ['tvcorner', 0.42, 5.23, 45, 'media_player.living_room_tv'], // TV in the back-left corner
      ['rug', 0.9, 5.9, 2.45, 8.5, '#c8b48a'],
      ['sofa', 2.5, 5.9, 3.42, 8.1, 'w'],
      ['box', 1.35, 6.55, 2.05, 7.7, 0.4, '#7a5636'], // coffee table
      ['couch', 0.3, 8.85, 2.75, 9.72, '#4e7d4c', 's'], // green couch under the front window
      ['lamp', 3.25, 5.1, 'light.lamp'], // floor lamp in the back-right corner
      ['plant', 3.25, 9.15],
      // hallway / wc
      ['stairs', 4.2, 4.93, 8.61, 6.11],
      ['toilet', 4.6, 5.55, 4.95, 6.02, 'n'],
      ['box', 4.62, 4.72, 4.94, 5.08, 0.85, '#f4f6f7'],
      ['box', 3.6, 8.95, 3.9, 9.38, 0.85, '#6c5a48'], // console
    ],
  },
  {
    id: 1,
    name: 'First floor',
    walls: [
      { a: [-0.06, 1.32], b: [-0.06, 9.82], t: EXT },
      { a: [-0.06, 1.32], b: [5.0, 1.32], t: EXT, o: [[0.67, 2.44, 'w'], [3.63, 4.26, 'w']] },
      { a: [5.0, 1.32], b: [5.0, 9.26], t: EXT, o: [[2.25, 3.28, 'w'], [3.84, 4.45, 'w']] },
      { a: [5.0, 9.26], b: [2.3, 9.26], t: EXT, o: [[0.47, 1.76, 'w']] },
      { a: [2.3, 9.26], b: [2.3, 9.82], t: EXT },
      { a: [2.3, 9.82], b: [-0.06, 9.82], t: EXT, o: [[0.43, 2.01, 'w']] },
      { a: [3.11, 1.32], b: [3.11, 4.93], o: [[0.28, 0.93, 'd']] }, // bedroom ↔ en-suite
      { a: [3.11, 2.86], b: [5.0, 2.86] },
      { a: [3.11, 4.93], b: [5.0, 4.93], o: [[0.38, 0.96, 'd']] }, // bathroom door
      { a: [-0.06, 4.7], b: [3.11, 4.7], o: [[2.55, 3.12, 'd']] }, // bedroom door
      { a: [2.82, 5.75], b: [2.82, 9.26], o: [[0.1, 0.75, 'd']] }, // spare room door
      { a: [2.82, 6.57], b: [5.0, 6.57], o: [[0.46, 1.08, 'd']] }, // office door
      { a: [4.11, 4.93], b: [4.11, 5.7], t: 0.05, h: 1.0 }, // balustrade
    ],
    rooms: [
      { id: 'bedroom', name: 'Main bedroom', finish: 'carpet', rects: [[-0.06, 1.32, 3.11, 4.7]] },
      { id: 'ensuite', name: 'En-suite', finish: 'tileBlue', rects: [[3.11, 1.32, 5.0, 2.86]] },
      { id: 'bathroom', name: 'Bathroom', finish: 'tileBlue', rects: [[3.11, 2.86, 5.0, 4.93]] },
      { id: 'landing', name: 'Landing', finish: 'carpetGrey', rects: [[2.41, 4.7, 3.11, 4.93], [2.41, 4.93, 4.11, 5.75], [2.82, 5.75, 4.11, 6.57]] },
      { id: 'spare', name: 'Bedroom 2', finish: 'carpet', rects: [[-0.06, 4.7, 1.83, 5.75], [-0.06, 5.75, 2.82, 9.82]] },
      { id: 'office', name: 'Bedroom 3', finish: 'wood', rects: [[2.82, 6.57, 5.0, 9.26]] },
    ],
    furniture: [
      ['box', 1.83, 4.7, 2.41, 5.75, WALL_H, 'wall'], // hot-press
      ['bed', -0.02, 2.1, 2.05, 3.75, 'e'],
      ['box', 0.0, 1.62, 0.45, 2.04, 0.5, '#8a6b4c'], ['box', 0.0, 3.81, 0.45, 4.23, 0.5, '#8a6b4c'],
      ['tv', 3.0, 2.3, 3.06, 3.5, 1.1, 'media_player.bedroom_tv'],
      ['box', 2.55, 1.42, 3.04, 2.1, 0.8, '#d8d0c4'], // dresser
      // en-suite
      ['box', 4.2, 1.42, 4.93, 2.15, 0.06, '#eef2f4'], ['glass', 4.2, 2.15, 4.93, 2.17],
      ['toilet', 3.2, 2.32, 3.62, 2.78, 'e'],
      ['box', 3.62, 1.42, 4.05, 1.78, 0.85, '#f4f6f7'],
      // bathroom
      ['bath', 3.2, 2.96, 4.93, 3.7],
      ['toilet', 4.5, 3.95, 4.93, 4.38, 'w'],
      ['box', 4.55, 4.45, 4.93, 4.85, 0.85, '#f4f6f7'],
      // bedroom 2
      ['box', 0.0, 4.78, 1.78, 5.68, 2.1, '#ece6dd'], // wardrobes
      ['bed', -0.02, 6.6, 2.0, 8.2, 'e'],
      ['box', 0.0, 8.3, 0.42, 8.7, 0.5, '#8a6b4c'],
      // bedroom 3 / office: desk with monitors on the east wall, day bed on the west wall
      ['desk', 4.25, 7.0, 4.95, 8.7],
      ['daybed', 2.88, 7.15, 3.72, 9.1],
      ['plant', 4.7, 9.0],
      // stair void
      ['stairsDown', 4.15, 4.95, 4.97, 6.55],
    ],
  },
];

// Garden cabin: Trihold "Longford two room 5030" log cabin (5.0 x 3.0 m) at the end of the garden.
// Main room on the left, 1.2 m shed on the right (as seen from the house).
const CABIN = { x0: 0.2, x1: 5.2, zf: -6.2, zb: -9.2, xp: 3.8, floor: 0.15, wall: 2.21, t: 0.07 };

// Outdoor zones are always visible.
const OUTSIDE_ROOMS = [
  { id: 'garden', name: 'Back garden', center: [2.5, -3] },
  { id: 'front', name: 'Front', center: [2.5, 11.5] },
];

/* ------------------------------------------------------------------ default entity mapping */
// room: one of the room ids above. at: [x, z] marker position (metres).
const DEFAULT_DEVICES = [
  // Ground floor
  { entity: 'light.lamp', room: 'living', at: [3.2, 5.2] },
  { entity: 'cover.blind_2', room: 'living', at: [1.55, 9.45] },
  { entity: 'binary_sensor.front_window_left', room: 'living', at: [0.75, 9.55] },
  { entity: 'binary_sensor.front_window_right', room: 'living', at: [2.4, 9.55] },
  { entity: 'media_player.living_room_tv', room: 'living', at: [0.75, 5.45] },
  { entity: 'light.kitchen_driver', room: 'kitchen', at: [3.6, 2.6] },
  { entity: 'climate.kitchen_kitchen_thermostat', room: 'kitchen', at: [1.3, 4.25] },
  { entity: 'binary_sensor.kitchen_md', room: 'kitchen', at: [4.6, 0.6] },
  { entity: 'binary_sensor.back_door', kind: 'door', name: 'Back door', room: 'kitchen', at: [1.3, 1.6] }, // French doors to the garden
  { entity: 'binary_sensor.back_window', room: 'kitchen', at: [3.8, 0.35] },
  { entity: 'vacuum.l40s_pro_ultra', room: 'kitchen', at: [2.35, 4.45] },
  { entity: 'light.hallway_lamp', room: 'hallway', at: [3.85, 7.3] },
  { entity: 'binary_sensor.hallway_motion', room: 'hallway', at: [3.85, 6.0] },
  { entity: 'binary_sensor.laverna_hallway_md', room: 'hallway', at: [3.85, 5.1] },
  // First floor
  { entity: 'light.ikea_of_sweden_tradfri_bulb_e27_ws_clear_806lm', room: 'bedroom', at: [1.4, 2.9] },
  { entity: 'cover.blind_4', room: 'bedroom', at: [1.55, 1.6] },
  { entity: 'binary_sensor.back_window_bedroom', room: 'bedroom', at: [2.2, 1.6] },
  { entity: 'sensor.temp_sensor_temperature', room: 'bedroom', at: [1.4, 4.2] },
  { entity: 'media_player.bedroom_tv', room: 'bedroom', at: [2.7, 2.9] },
  { entity: 'light.landing_2', room: 'landing', at: [3.3, 5.4] },
  { entity: 'cover.blind_3', room: 'spare', at: [1.1, 9.5] },
  { entity: 'binary_sensor.spare_room_window', room: 'spare', at: [1.7, 9.5] },
  { entity: 'cover.blind_1', room: 'office', at: [3.6, 8.95] },
  { entity: 'binary_sensor.office_window', room: 'office', at: [4.2, 8.95] },
  // Front
  { entity: ['binary_sensor.doorbell_visitor', 'binary_sensor.doorbell_person', 'binary_sensor.doorbell_motion'], kind: 'doorbell', camera: 'camera.doorbell_fluent', name: 'Doorbell', room: 'front', at: [4.39, 9.8], h: 1.3 },
  // Garden cabin – up/down wall lights on the front, camera + floodlight on the front-left corner
  // (h = marker height, light_at = [x, y, z] of the 3D light, range in metres, power = brightness scale)
  { entity: 'light.left_up_cabin_light', room: 'garden', at: [0.78, -6.0], h: 2.7, light_at: [0.78, 2.45, -6.05], range: 2.5, power: 0.5 },
  { entity: 'light.left_down_cabin_light', room: 'garden', at: [0.78, -6.0], h: 1.2, light_at: [0.78, 0.7, -5.7], range: 3.5, power: 0.7 },
  { entity: 'light.right_up_cabin_light', room: 'garden', at: [3.93, -6.0], h: 2.7, light_at: [3.93, 2.45, -6.05], range: 2.5, power: 0.5 },
  { entity: 'light.right_down_cabin_light', room: 'garden', at: [3.93, -6.0], h: 1.2, light_at: [3.93, 0.7, -5.7], range: 3.5, power: 0.7 },
  { entity: 'binary_sensor.cabin_cam_motion', kind: 'camera', camera: 'camera.cabin_cam_live_view', name: 'Cabin camera', room: 'garden', at: [0.3, -6.0], h: 2.7 },
  { entity: 'light.cabin_cam_light', room: 'garden', at: [0.3, -6.0], h: 1.2, light_at: [0.3, 2.3, -5.85], range: 8 },
  { entity: 'light.shed_light_3', room: 'shed', at: [4.2, -7.4], light_at: [3.92, 1.95, -7.6], range: 3 },
  { entity: 'light.cabin_shed_leds_shed_led_strip', room: 'shed', at: [4.75, -8.35], h: 1.1, light_at: [4.6, 1.05, -8.35], range: 2.5, power: 0.6 },
  { entity: 'media_player.cabin', room: 'cabin', at: [3.1, -8.75], h: 1.6 },
  // cabin doors on the alarm: French doors (main room) and the shed door
  { entity: 'binary_sensor.front_door', kind: 'door', name: 'Cabin door', room: 'cabin', at: [2.7, -6.0], h: 1.6 },
  { entity: 'binary_sensor.side_door', kind: 'door', name: 'Shed door', room: 'shed', at: [4.48, -6.0], h: 1.6 },
];

// Robot-vacuum map (Dreame integration) → model metres. Fitted from the robot's room outlines against
// the floor plan (max error ≈ 0.3 m). Robot map units are mm; its x axis runs opposite to the model's.
const VACUUM_TRANSFORM = { sx: -0.9688, ox: 0.265, sz: 0.9372, oz: 4.001 };

// Fallback when no live map is available: a loop through the ground floor via real doorways.
const VACUUM_PATH = [
  [2.35, 4.45], [2.35, 3.95], [0.3, 3.95], [0.3, 1.7], [2.45, 1.7], [3.1, 0.95], [4.1, 0.95],
  [4.1, 3.7], [3.1, 3.7], [3.1, 2.1], [2.45, 4.3], [1.3, 4.4], [1.3, 5.3], [0.6, 5.3], [0.6, 9.3],
  [1.3, 9.3], [1.3, 5.5], [2.15, 5.3], [2.15, 8.45], [3.25, 8.45], [3.85, 8.45], [3.85, 9.1],
  [3.85, 4.95], [3.85, 4.35], [2.35, 4.35],
];

const CONDITIONS = {
  'clear-night': 'Clear', cloudy: 'Cloudy', exceptional: 'Exceptional', fog: 'Fog', hail: 'Hail',
  lightning: 'Lightning', 'lightning-rainy': 'Thunderstorms', partlycloudy: 'Partly cloudy',
  pouring: 'Pouring', rainy: 'Rain', snowy: 'Snow', 'snowy-rainy': 'Sleet', sunny: 'Sunny',
  windy: 'Windy', 'windy-variant': 'Windy',
};
const WEATHER_FX = {
  // clouds 0..1, rain 0..1, snow 0..1, fog 0..1, gloom (how much the sun is dimmed)
  sunny: { clouds: 0.05 }, 'clear-night': { clouds: 0.05 },
  partlycloudy: { clouds: 0.45, gloom: 0.15 }, cloudy: { clouds: 0.9, gloom: 0.45 },
  fog: { clouds: 0.5, fog: 1, gloom: 0.5 }, rainy: { clouds: 0.9, rain: 0.55, gloom: 0.55 },
  pouring: { clouds: 1, rain: 1, gloom: 0.7 }, 'lightning-rainy': { clouds: 1, rain: 0.8, gloom: 0.7, lightning: 1 },
  lightning: { clouds: 1, gloom: 0.6, lightning: 1 }, snowy: { clouds: 0.9, snow: 1, gloom: 0.45 },
  'snowy-rainy': { clouds: 0.9, snow: 0.5, rain: 0.4, gloom: 0.55 }, hail: { clouds: 1, rain: 0.7, gloom: 0.6 },
  windy: { clouds: 0.5, gloom: 0.1, wind: 1 }, 'windy-variant': { clouds: 0.7, gloom: 0.3, wind: 1 },
};

/* ------------------------------------------------------------------ helpers */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const arr = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);
const domainOf = (id) => id.split('.')[0];
const isUnavail = (s) => !s || s.state === 'unavailable' || s.state === 'unknown';

function kelvinToRgb(k) {
  const t = k / 100;
  let r, g, b;
  if (t <= 66) {
    r = 255;
    g = 99.47 * Math.log(t) - 161.12;
    b = t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04;
  } else {
    r = 329.7 * Math.pow(t - 60, -0.1332);
    g = 288.12 * Math.pow(t - 60, -0.0755);
    b = 255;
  }
  return [clamp(r, 0, 255) / 255, clamp(g, 0, 255) / 255, clamp(b, 0, 255) / 255];
}

function seeded(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/* ------------------------------------------------------------------ the card */
class Floorplan3DCard extends HTMLElement {
  static getStubConfig() {
    return {};
  }

  setConfig(config) {
    this._config = {
      floor: 0,
      house_bearing: 95,
      weather: 'weather.forecast_home',
      sun: 'sun.sun',
      climate: 'climate.kitchen_kitchen_thermostat',
      alarm: 'alarm_control_panel.laverna_alarm',
      vacuum: 'vacuum.l40s_pro_ultra',
      vacuum_map: 'camera.l40s_pro_ultra_map',
      vacuum_clean_service: 'dreame_vacuum.vacuum_clean_segment',
      vacuum_transform: VACUUM_TRANSFORM,
      persons: ['person.killian', 'person.sinead'],
      devices: DEFAULT_DEVICES,
      three_url: DEFAULT_THREE_URL,
      ...config,
    };
    this._floorMode = String(this._config.floor);
    // re-initialise if the config changes after the scene was built (e.g. in the card editor)
    if (this._started) {
      this._teardown();
      if (this._hass) this._start();
    }
  }

  _teardown() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
    this._ro?.disconnect();
    clearInterval(this._forecastTimer);
    this._renderer?.dispose();
    this._renderer = null;
    this._started = this._ready = false;
  }

  set hass(hass) {
    this._hass = hass;
    this._dirty = true;
    if (!this._started) this._start();
  }

  get hass() {
    return this._hass;
  }

  getCardSize() {
    return 10;
  }

  getGridOptions() {
    return { columns: 'full', rows: 10, min_rows: 6 };
  }

  connectedCallback() {
    if (this._ready && !this._raf) this._loop();
  }

  disconnectedCallback() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
  }

  /* ---------------- setup */
  async _start() {
    if (!this._config) return;
    this._started = true;
    this._root = this._root || this.attachShadow({ mode: 'open' });
    this._buildDom();
    try {
      this.THREE = await import(this._config.three_url);
    } catch (e) {
      this._msg.textContent = `Could not load three.js from ${this._config.three_url}`;
      return;
    }
    this._msg.textContent = '';
    this._initScene();
    this._ready = true;
    this._loop();
    this._fetchForecast();
    this._forecastTimer = setInterval(() => this._fetchForecast(), 30 * 60 * 1000);
  }

  _buildDom() {
    const h = this._config.height || 'calc(100vh - var(--header-height, 56px))';
    this._root.innerHTML = `
      <style>${STYLE}</style>
      <ha-card style="height:${h}">
        <div class="stage">
          <canvas></canvas>
          <div class="markers"></div>
          <div class="hud top"><div class="pill people"></div></div>
          <div class="hud floors">
            <button data-f="0" title="Ground floor">${svg(ICON.floorG)}</button>
            <button data-f="1" title="First floor">${svg(ICON.floor1)}</button>
            <button data-f="all" title="Both floors">${svg(ICON.layers)}</button>
            <button data-f="garden" title="Garden &amp; cabin">${svg(ICON.tree)}</button>
          </div>
          <div class="hud bl"></div>
          <div class="hud br weather"></div>
          <div class="hud vbar"></div>
          <div class="msg">Loading 3D model…</div>
        </div>
      </ha-card>`;
    this._canvas = this._root.querySelector('canvas');
    this._markerLayer = this._root.querySelector('.markers');
    this._msg = this._root.querySelector('.msg');
    this._root.querySelectorAll('.floors button').forEach((b) =>
      b.addEventListener('click', () => this._setFloor(b.dataset.f)),
    );
    this._root.querySelector('.bl').addEventListener('click', (e) => {
      const el = e.target.closest('[data-entity]');
      if (el) this._moreInfo(el.dataset.entity);
    });
    this._root.querySelector('.weather').addEventListener('click', () => this._moreInfo(this._config.weather));
    this._root.querySelector('.vbar').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.act === 'clean') this._startSegmentClean();
      else this._setVacSelect(false);
    });
    this._updateFloorButtons();
  }

  _initScene() {
    const THREE = this.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas: this._canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    this._renderer = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1c2126');
    scene.fog = new THREE.Fog('#1c2126', 30, 90);
    this._scene = scene;

    this._camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
    this._orbit = {
      target: new THREE.Vector3(2.5, 0, 3.2),
      goalTarget: new THREE.Vector3(2.5, 0, 3.2),
      theta: -0.28, goalTheta: -0.28,
      phi: 0.62, goalPhi: 0.62,
      radius: 27, goalRadius: 27,
    };

    this._tex = this._makeTextures();
    this._mats = this._makeMaterials();

    // lights
    this._hemi = new THREE.HemisphereLight('#dfe9f3', '#4a4436', 1.0);
    scene.add(this._hemi);
    const sun = new THREE.DirectionalLight('#fff3e0', 2.2);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -16; sun.shadow.camera.right = 16;
    sun.shadow.camera.top = 16; sun.shadow.camera.bottom = -16;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 80;
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.02;
    scene.add(sun, sun.target);
    this._sun = sun;
    this._flash = 0;

    this._lightFx = {}; // light entity → extra visuals (lamp shades, LED strips, wall-light beams)
    this._cutWalls = []; // exterior wall pieces that drop to a cutaway height when facing the camera
    this._roomMeshes = []; // raycast targets
    this._rooms = {}; // id → { glowMats, floor, lights }
    this._floorGroups = [];
    this._screens = {}; // media_player → material

    this._buildEnvironment();
    FLOORS.forEach((f) => this._buildFloor(f));
    this._buildDevices();
    this._buildWeather();

    this._floorAnim = { 0: { y: 0, goalY: 0, vis: 1, goalVis: 1 }, 1: { y: STOREY, goalY: STOREY, vis: 0, goalVis: 0 } };
    this._applyFloorMode(true);

    this._bindControls();
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(this._canvas.parentElement);
    this._resize();
    this._clock = new THREE.Clock();
  }

  /* ---------------- textures & materials */
  _canvasTex(size, draw, repeatMetres) {
    const THREE = this.THREE;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    draw(g, size);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    t.userData.metres = repeatMetres;
    return t;
  }

  _makeTextures() {
    const wood = (base, seed) => (g, s) => {
      const rnd = seeded(seed);
      const rows = 10;
      const rh = s / rows;
      for (let r = 0; r < rows; r++) {
        let x = -rnd() * s;
        while (x < s) {
          const len = s * (0.35 + rnd() * 0.5);
          const l = (rnd() - 0.5) * 18;
          g.fillStyle = `hsl(${base[0]}, ${base[1]}%, ${base[2] + l}%)`;
          g.fillRect(x, r * rh, len, rh);
          g.strokeStyle = 'rgba(0,0,0,0.05)';
          for (let k = 0; k < 4; k++) {
            g.beginPath();
            const yy = r * rh + rnd() * rh;
            g.moveTo(x, yy);
            g.bezierCurveTo(x + len / 3, yy + 3, x + (2 * len) / 3, yy - 3, x + len, yy);
            g.stroke();
          }
          g.fillStyle = 'rgba(0,0,0,0.25)';
          g.fillRect(x, r * rh, 1.5, rh);
          x += len;
        }
        g.fillStyle = 'rgba(0,0,0,0.22)';
        g.fillRect(0, r * rh, s, 1.5);
      }
    };
    const tile = (base, grout, n) => (g, s) => {
      const rnd = seeded(7);
      const ts = s / n;
      g.fillStyle = grout;
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          const l = (rnd() - 0.5) * 5;
          g.fillStyle = `hsl(${base[0]}, ${base[1]}%, ${base[2] + l}%)`;
          g.fillRect(i * ts + 1.5, j * ts + 1.5, ts - 3, ts - 3);
        }
    };
    const noise = (base, amp, seed, dots = 9000) => (g, s) => {
      const rnd = seeded(seed);
      g.fillStyle = `hsl(${base[0]}, ${base[1]}%, ${base[2]}%)`;
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < dots; i++) {
        const l = base[2] + (rnd() - 0.5) * amp;
        g.fillStyle = `hsla(${base[0] + (rnd() - 0.5) * 8}, ${base[1]}%, ${l}%, 0.6)`;
        const r = 1 + rnd() * 2.5;
        g.fillRect(rnd() * s, rnd() * s, r, r);
      }
    };
    const paving = (g, s) => {
      const rnd = seeded(3);
      g.fillStyle = '#6d6a66';
      g.fillRect(0, 0, s, s);
      const n = 8, bw = s / n, bh = s / (n * 2);
      for (let r = 0; r < n * 2; r++)
        for (let c = -1; c < n; c++) {
          const off = (r % 2) * bw * 0.5;
          const l = 52 + (rnd() - 0.5) * 10;
          g.fillStyle = `hsl(30, 4%, ${l}%)`;
          g.fillRect(c * bw + off + 1, r * bh + 1, bw - 2, bh - 2);
        }
    };
    const cloud = (g, s) => {
      const rnd = seeded(11);
      for (let i = 0; i < 40; i++) {
        const x = s * (0.2 + rnd() * 0.6), y = s * (0.3 + rnd() * 0.4), r = s * (0.08 + rnd() * 0.16);
        const grd = g.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, 'rgba(255,255,255,0.35)');
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grd;
        g.beginPath();
        g.arc(x, y, r, 0, Math.PI * 2);
        g.fill();
      }
    };
    const logs = (g, s) => {
      const rnd = seeded(9);
      const n = 8, bh = s / n;
      for (let i = 0; i < n; i++) {
        g.fillStyle = `hsl(31, 58%, ${44 + (rnd() - 0.5) * 6}%)`;
        g.fillRect(0, i * bh, s, bh);
        g.fillStyle = 'rgba(255,230,180,0.18)';
        g.fillRect(0, i * bh + 2, s, bh * 0.25);
        g.fillStyle = 'rgba(40,20,5,0.55)';
        g.fillRect(0, (i + 1) * bh - 3, s, 3);
      }
    };
    const beam = (g, s) => {
      // light cone from a wall light, bright at the top fading downwards
      for (let y = 0; y < s; y++) {
        const f = y / s, half = (0.08 + 0.42 * f) * s, a = Math.pow(1 - f, 1.6);
        const grd = g.createLinearGradient(s / 2 - half, 0, s / 2 + half, 0);
        grd.addColorStop(0, 'rgba(255,255,255,0)');
        grd.addColorStop(0.5, `rgba(255,255,255,${a})`);
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grd;
        g.fillRect(0, y, s, 1);
      }
    };
    const lattice = (g, s) => {
      g.clearRect(0, 0, s, s);
      g.strokeStyle = '#b89567';
      g.lineWidth = 7;
      for (let i = -s; i < 2 * s; i += s / 4) {
        g.beginPath(); g.moveTo(i, 0); g.lineTo(i + s, s); g.stroke();
        g.beginPath(); g.moveTo(i, s); g.lineTo(i + s, 0); g.stroke();
      }
    };
    const frontDoor = (g, s) => {
      // black composite door: raised panels, small glazed top light, chrome handle and letterbox
      const w = s, h = s;
      g.fillStyle = '#141516';
      g.fillRect(0, 0, w, h);
      const panel = (x, y, pw, ph) => {
        g.fillStyle = '#1d1f21';
        g.fillRect(x, y, pw, ph);
        g.strokeStyle = 'rgba(255,255,255,0.10)';
        g.lineWidth = 3;
        g.strokeRect(x + 4, y + 4, pw - 8, ph - 8);
      };
      g.fillStyle = '#8fb4c9';
      g.fillRect(w * 0.2, h * 0.08, w * 0.6, h * 0.12); // glazing
      panel(w * 0.15, h * 0.26, w * 0.7, h * 0.26);
      panel(w * 0.15, h * 0.6, w * 0.7, h * 0.32);
      g.fillStyle = '#c9ccd0';
      g.fillRect(w * 0.3, h * 0.545, w * 0.4, h * 0.025); // letterbox
      g.fillRect(w * 0.78, h * 0.47, w * 0.05, h * 0.1); // handle
    };
    const beamTex = this._canvasTex(128, beam, 1);
    beamTex.wrapS = beamTex.wrapT = this.THREE.ClampToEdgeWrapping;
    return {
      logs: this._canvasTex(256, logs, 1.2),
      frontDoor: this._canvasTex(512, frontDoor, 1),
      beam: beamTex,
      lattice: this._canvasTex(256, lattice, 0.7),
      lawn: this._canvasTex(512, noise([98, 42, 36], 10, 12, 30000), 3),
      soil: this._canvasTex(256, noise([22, 30, 22], 12, 13, 9000), 1.5),
      wood: this._canvasTex(512, wood([32, 45, 52], 1), 2.2),
      woodDark: this._canvasTex(512, wood([25, 40, 36], 2), 2.2),
      tile: this._canvasTex(512, tile([40, 10, 86], '#b9b4ad', 4), 1.6),
      tileBlue: this._canvasTex(512, tile([200, 18, 84], '#a8b3ba', 6), 1.2),
      carpet: this._canvasTex(256, noise([35, 18, 74], 8, 4), 1.5),
      carpetGrey: this._canvasTex(256, noise([30, 5, 62], 8, 5), 1.5),
      grass: this._canvasTex(512, noise([95, 32, 30], 14, 6, 26000), 4),
      paving: this._canvasTex(512, paving, 4),
      gravel: this._canvasTex(256, noise([35, 8, 60], 25, 8, 12000), 2),
      cloud: this._canvasTex(256, cloud, 1),
    };
  }

  _makeMaterials() {
    const THREE = this.THREE;
    const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, ...o });
    return {
      wall: std({ color: '#f3f0ea' }),
      wallTop: std({ color: '#2b2d30', roughness: 0.6 }),
      slab: std({ color: '#7f7a74' }),
      glass: new THREE.MeshStandardMaterial({ color: '#a9d8ff', transparent: true, opacity: 0.35, roughness: 0.1, metalness: 0.2, depthWrite: false }),
      white: std({ color: '#f4f6f7', roughness: 0.4 }),
      dark: std({ color: '#25272a', roughness: 0.5 }),
      worktop: std({ color: '#4f4b47', roughness: 0.4 }),
      cabinet: std({ color: '#dcd9d3' }),
      leaf: std({ color: '#3f6b35' }),
      trunk: std({ color: '#5a4330' }),
      pot: std({ color: '#c46a45' }),
      fabric: std({ color: '#5d6874' }),
      fabric2: std({ color: '#c9a64a' }),
      duvet: std({ color: '#7c8ea8' }),
      linen: std({ color: '#efece6' }),
      fence: std({ color: '#6b5640' }),
      roof: std({ color: '#3a3d42', roughness: 0.7 }),
      cabinWall: std({ color: '#8a6a4a' }),
      car: std({ color: '#9aa0a6', roughness: 0.25, metalness: 0.6 }),
      deck: std({ color: '#7d5934', roughness: 0.7 }),
      frontDoor: std({ map: this._tex.frontDoor, roughness: 0.45, metalness: 0.15 }),
      render: std({ color: '#ece2c2' }),
      block: std({ color: '#9b978f' }),
      conifer: std({ color: '#2d4a2b' }),
      bush: std({ color: '#4d7a3a' }),
      cabinGlass: new THREE.MeshStandardMaterial({ color: '#3a4550', transparent: true, opacity: 0.55, roughness: 0.1, metalness: 0.3, depthWrite: false }),
      frosted: new THREE.MeshStandardMaterial({ color: '#e4eaee', transparent: true, opacity: 0.85, roughness: 0.6 }),
    };
  }

  _tiledPlane(x1, z1, x2, z2, tex, y = 0, matOpts = {}) {
    const THREE = this.THREE;
    const w = x2 - x1, d = z2 - z1;
    const geo = new THREE.PlaneGeometry(w, d);
    const m = tex.userData.metres;
    const uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (x1 + uv.getX(i) * w) / m, (z1 + (1 - uv.getY(i)) * d) / m);
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8, ...matOpts }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x1 + w / 2, y, z1 + d / 2);
    mesh.receiveShadow = true;
    return mesh;
  }

  _box(parent, x1, z1, x2, z2, h, mat, y0 = 0, shadow = true) {
    const THREE = this.THREE;
    const m = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(x2 - x1), h, Math.abs(z2 - z1)), mat);
    m.position.set((x1 + x2) / 2, y0 + h / 2, (z1 + z2) / 2);
    m.castShadow = shadow;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  _cyl(parent, x, z, r, h, mat, y0 = 0, seg = 16) {
    const THREE = this.THREE;
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat);
    m.position.set(x, y0 + h / 2, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  /* ---------------- environment */
  _buildEnvironment() {
    const THREE = this.THREE;
    const env = new THREE.Group();
    this._scene.add(env);
    const T = this._tex, M = this._mats;
    const box = (...a) => this._box(env, ...a);
    const bush = (x, z, r, y = 0, mat = M.bush) => {
      const rnd = seeded(Math.round(x * 131 + z * 17));
      for (let i = 0; i < 3; i++) {
        const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r * (0.7 + rnd() * 0.4), 1), mat);
        m.position.set(x + (rnd() - 0.5) * r, y + r * (0.7 + rnd() * 0.4), z + (rnd() - 0.5) * r);
        m.castShadow = true;
        env.add(m);
      }
    };

    // ground
    env.add(this._tiledPlane(-28, -30, 34, 36, T.grass, -0.02));

    // ---- back garden (runs east from the house; north is to the left when looking from the house)
    env.add(this._tiledPlane(-0.9, -9.65, 5.75, 1.32, T.soil, -0.014)); // planting beds
    env.add(this._tiledPlane(-0.9, -1.6, 2.82, 1.32, T.paving, -0.006)); // patio by the dining doors
    env.add(this._tiledPlane(2.82, -1.6, 5.75, 0.07, T.paving, -0.006)); // patio behind the kitchen
    env.add(this._tiledPlane(4.55, -6.2, 5.15, -1.6, T.paving, -0.006)); // path to the shed door
    env.add(this._tiledPlane(-0.9, -6.2, 5.75, -5.1, T.gravel, -0.008)); // gravel in front of the cabin
    env.add(this._lawn());

    // boundaries: timber fence (left), rendered block wall with trellis (right), block wall (back)
    box(-0.97, -9.65, -0.9, 1.32, 1.8, M.fence);
    box(5.75, -9.65, 5.95, 9.95, 1.9, M.render);
    box(-0.97, -9.85, 5.95, -9.65, 2.0, M.block);
    const trellis = new THREE.MeshStandardMaterial({ map: T.lattice, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.8 });
    for (const [z1, z2] of [[-5.0, -3.3], [-3.1, -1.4]]) {
      const pl = this._tiledPlane(z1, 0, z2, 0.75, T.lattice, 0);
      pl.material = trellis;
      pl.rotation.set(0, Math.PI / 2, 0);
      pl.position.set(5.85, 1.9 + 0.375, (z1 + z2) / 2);
      pl.castShadow = true;
      env.add(pl);
    }
    // conifers behind the back wall
    for (let i = 0; i < 7; i++) {
      const h = 5 + (i % 3) * 0.8;
      const c = new THREE.Mesh(new THREE.ConeGeometry(1.3, h, 10), M.conifer);
      c.position.set(-1.5 + i * 1.3, h / 2, -10.9 - (i % 2) * 0.6);
      c.castShadow = true;
      env.add(c);
    }
    // neighbour's shed over the left fence
    box(-3.2, -9.3, -1.2, -6.9, 2.0, new THREE.MeshStandardMaterial({ color: '#7a3e2c', roughness: 0.8 }));
    box(-3.3, -9.4, -1.1, -6.8, 0.1, M.roof, 2.0);

    // patio: corner bench, table and pots
    box(-0.85, -1.55, 0.9, -1.1, 0.45, M.deck);
    box(-0.85, -1.58, 0.9, -1.5, 0.9, M.deck);
    box(-0.85, -1.1, -0.4, 0.4, 0.45, M.deck);
    box(-0.9, -1.1, -0.82, 0.4, 0.9, M.deck);
    this._buildFurniture(env, ['table', -0.15, -0.8, 0.6, -0.1, '#8a5a32']);
    this._buildFurniture(env, ['plant', 1.15, -1.3]);
    this._buildFurniture(env, ['plant', 1.5, -0.95]);
    // planting
    bush(-0.35, -2.5, 0.7);
    bush(-0.45, -3.8, 0.55);
    bush(-0.4, -4.7, 0.45);
    bush(5.4, -3.9, 0.55);
    // in front of the cabin: water butt, planters, steps
    this._cyl(env, 0.5, -5.85, 0.27, 1.0, M.dark);
    box(1.05, -6.05, 1.9, -5.65, 0.45, M.deck);
    bush(1.47, -5.85, 0.3, 0.45, M.leaf);
    box(3.62, -6.05, 3.95, -5.72, 0.4, M.deck);
    this._cyl(env, 3.78, -5.88, 0.025, 1.1, M.trunk, 0.4);
    const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 1), M.leaf);
    ball.position.set(3.78, 1.6, -5.88);
    ball.castShadow = true;
    env.add(ball);
    box(1.99, -6.2, 3.41, -5.82, CABIN.floor, M.deck);
    box(4.05, -6.2, 4.9, -5.85, CABIN.floor, M.deck);

    this._buildCabin(env);

    // ---- front & side
    env.add(this._tiledPlane(5.08, 0.07, 5.75, 9.95, T.gravel, -0.005)); // side passage
    env.add(this._tiledPlane(-2.2, 9.95, 7.6, 16.5, T.paving, -0.004)); // driveway
    env.add(this._tiledPlane(-9, 16.5, 16, 19.5, T.gravel, -0.006)); // footpath
    box(-2.2, 16.2, 1.0, 16.6, 0.9, M.leaf); // hedge
    const bell = box(4.355, 9.53, 4.425, 9.56, 0.14, M.dark, 1.2); // video doorbell, right of the front door
    this._cutWalls.push({ m: bell, y0: 1.2, y1: 1.34, top: 1.34, nx: 0, nz: 1, floor: 0 }); // hides with the wall cutaway
    const tree = (x, z, sc = 1) => {
      this._cyl(env, x, z, 0.15 * sc, 1.6 * sc, M.trunk);
      const rnd = seeded(Math.round(x * 100 + z * 7));
      for (let i = 0; i < 4; i++) {
        const m = new THREE.Mesh(new THREE.IcosahedronGeometry((0.9 + rnd() * 0.6) * sc, 1), M.leaf);
        m.position.set(x + (rnd() - 0.5) * 1.2 * sc, (1.9 + rnd() * 1.1) * sc, z + (rnd() - 0.5) * 1.2 * sc);
        m.castShadow = true;
        env.add(m);
      }
    };
    tree(-1.3, 14.8, 1.0);
    tree(9.5, 13, 1.2);

    // car on the drive
    const car = new THREE.Group();
    this._box(car, -0.9, -2.2, 0.9, 2.2, 0.75, M.car, 0.2);
    this._box(car, -0.8, -0.9, 0.8, 1.1, 0.55, M.dark, 0.95);
    [[-0.85, -1.4], [0.85, -1.4], [-0.85, 1.4], [0.85, 1.4]].forEach(([x, z]) => {
      const w = this._cyl(car, 0, 0, 0.33, 0.25, M.dark, 0);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.33, z);
    });
    car.position.set(1.2, 0, 13.2);
    car.rotation.y = 0.06;
    env.add(car);
  }

  _lawn() {
    const THREE = this.THREE;
    // wavy-edged lawn; shape coords are (x, -z)
    const shape = new THREE.Shape();
    shape.moveTo(0.55, 1.6);
    shape.lineTo(4.55, 1.6);
    shape.lineTo(4.55, 5.0);
    for (let i = 0; i <= 24; i++) {
      const x = 4.55 - (4.0 * i) / 24;
      shape.lineTo(x, 5.05 + 0.25 * Math.sin((i / 24) * Math.PI * 2.2));
    }
    for (let i = 0; i <= 16; i++) {
      const z = 5.0 - (3.4 * i) / 16;
      shape.lineTo(0.55 + 0.3 * Math.sin((i / 16) * Math.PI), z);
    }
    const geo = new THREE.ShapeGeometry(shape, 4);
    const m = this._tex.lawn.userData.metres;
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / m, pos.getY(i) / m);
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: this._tex.lawn, roughness: 0.95 }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -0.003;
    mesh.receiveShadow = true;
    return mesh;
  }

  _buildCabin(env) {
    const THREE = this.THREE;
    const M = this._mats, T = this._tex;
    const { x0, x1, zf, zb, xp, t } = CABIN;
    this._box(env, x0 - 0.05, zb - 0.05, x1 + 0.05, zf + 0.05, CABIN.floor, M.deck); // foundation
    const g = new THREE.Group();
    g.position.y = CABIN.floor;
    env.add(g);

    const logs = new THREE.MeshStandardMaterial({ map: T.logs, roughness: 0.75 });
    const style = { mats: [logs, logs, M.wallTop, logs, logs, logs], h: CABIN.wall, glass: M.cabinGlass, frosted: M.frosted, uvMetres: T.logs.userData.metres };
    [
      // front: window, French doors (main room), frosted door (shed)
      { a: [x0, zf], b: [x1, zf], t, o: [[0.525, 1.275, 'w', 0.455, 2.035], [1.79, 3.21, 'g', 0, 2.065], [3.85, 4.7, 'f', 0, 2.065]] },
      { a: [x0, zf], b: [x0, zb], t },
      { a: [x1, zf], b: [x1, zb], t },
      { a: [x0, zb], b: [x1, zb], t },
      { a: [xp, zf], b: [xp, zb], t }, // partition between cabin and shed
    ].forEach((w) => this._buildWall(g, w, style));

    this._addRoom(g, { id: 'cabin', name: 'Cabin', finish: 'tile', rects: [[x0 + t / 2, zb + t / 2, xp - t / 2, zf - t / 2]] }, -1);
    this._addRoom(g, { id: 'shed', name: 'Shed', finish: 'carpetGrey', rects: [[xp + t / 2, zb + t / 2, x1 - t / 2, zf - t / 2]] }, -1);

    // cabin = home gym: squat rack on the left, treadmill on the right facing the TV in the back-right corner
    this._buildFurniture(g, ['squatrack', 0.6, -8.95, 1.8, -7.75]);
    this._buildFurniture(g, ['treadmill', 2.65, -8.85, 3.45, -6.95]);
    this._buildFurniture(g, ['tv', 2.5, zb + 0.04, 3.7, zb + 0.1, 1.25, 'media_player.cabin']);

    // shed: L-shaped workbench in the back-left corner with an LED strip around its edge
    const bench = new THREE.MeshStandardMaterial({ color: '#9c7a52', roughness: 0.7 });
    this._box(g, xp + 0.04, zb + 0.04, x1 - 0.04, zb + 0.6, 0.9, bench);
    this._box(g, xp + 0.04, zb + 0.6, xp + 0.6, zb + 1.8, 0.9, bench);
    const led = new THREE.MeshStandardMaterial({ color: '#222', emissive: '#ffffff', emissiveIntensity: 0 });
    this._box(g, xp + 0.6, zb + 0.6, x1 - 0.04, zb + 0.63, 0.025, led, 0.86, false);
    this._box(g, xp + 0.6, zb + 0.6, xp + 0.63, zb + 1.8, 0.025, led, 0.86, false);
    this._box(g, xp + 0.6, zb + 1.77, xp + 0.04, zb + 1.8, 0.025, led, 0.86, false);
    this._addLightFx('light.cabin_shed_leds_shed_led_strip', { mat: led, gain: 3 });
    // shed wall light on the left wall (the partition)
    const lamp = new THREE.MeshStandardMaterial({ color: '#eee', emissive: '#ffffff', emissiveIntensity: 0 });
    this._box(g, xp + 0.035, -7.7, xp + 0.09, -7.5, 0.16, lamp, 1.72, false);
    this._addLightFx('light.shed_light_3', { mat: lamp, gain: 2 });

    // front: two up/down wall lights and the camera with its floodlight
    const fz = zf + t / 2;
    for (const [x, side] of [[0.78, 'left'], [3.93, 'right']]) {
      const fx = new THREE.MeshStandardMaterial({ color: '#1d1f22', emissive: '#ffffff', emissiveIntensity: 0, roughness: 0.4 });
      this._box(g, x - 0.04, fz, x + 0.04, fz + 0.08, 0.2, fx, 1.6);
      this._addLightFx(`light.${side}_up_cabin_light`, { mat: fx, gain: 0.8 });
      this._addLightFx(`light.${side}_down_cabin_light`, { mat: fx, gain: 0.8 });
      for (const dir of ['up', 'down']) {
        const h = dir === 'up' ? CABIN.wall - 1.8 + 0.05 : 1.6;
        const mat = new THREE.MeshBasicMaterial({ map: T.beam, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
        const p = new THREE.Mesh(new THREE.PlaneGeometry(dir === 'up' ? 0.5 : 1.1, h), mat);
        p.position.set(x, dir === 'up' ? 1.8 + h / 2 : 1.6 - h / 2, fz + 0.005);
        if (dir === 'up') p.rotation.z = Math.PI;
        p.renderOrder = 4;
        g.add(p);
        this._addLightFx(`light.${side}_${dir}_cabin_light`, { mat, beam: true });
      }
    }
    const cam = new THREE.MeshStandardMaterial({ color: '#f2f2f2', emissive: '#ffffff', emissiveIntensity: 0 });
    this._box(g, 0.24, fz, 0.38, fz + 0.12, 0.1, cam, 1.95);
    this._addLightFx('light.cabin_cam_light', { mat: cam, gain: 2 });
  }

  _addLightFx(entity, fx) {
    (this._lightFx[entity] = this._lightFx[entity] || []).push(fx);
  }

  /* ---------------- floors */
  _buildFloor(f) {
    const THREE = this.THREE;
    const group = new THREE.Group();
    group.userData.floor = f.id;
    this._scene.add(group);
    this._floorGroups[f.id] = group;
    const M = this._mats;

    // slab under the whole storey (first floor leaves a hole for the stairs)
    const slabs = f.id === 0
      ? [[-0.14, 1.24, 5.08, 9.9], [2.74, -0.01, 5.08, 1.24]]
      : [[-0.14, 1.24, 5.08, 4.93], [-0.14, 4.93, 4.11, 6.57], [-0.14, 6.57, 5.08, 9.9]];
    for (const [x1, z1, x2, z2] of slabs) this._box(group, x1, z1, x2, z2, SLAB, M.slab, -SLAB, false);

    for (const r of f.rooms) this._addRoom(group, r, f.id);

    for (const w of f.walls) this._buildWall(group, w, { cutCenter: [2.5, 5.5], floor: f.id });
    for (const item of f.furniture) this._buildFurniture(group, item);

    // flat roof over the single-storey kitchen extension (shown when looking at the first floor)
    if (f.id === 0) {
      this._extRoof = this._box(group, 2.74, -0.01, 5.08, 1.24, 0.18, M.roof, WALL_H, true);
      this._extRoof.visible = false;
    }
  }

  _addRoom(group, r, floor) {
    const THREE = this.THREE;
    const room = { id: r.id, name: r.name, floor, rects: r.rects, lights: [] };
    room.glowMat = new THREE.MeshBasicMaterial({ color: '#ffc46b', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    for (const [x1, z1, x2, z2] of r.rects) {
      const fl = this._tiledPlane(x1, z1, x2, z2, this._tex[r.finish], 0.002);
      fl.userData.room = r.id;
      group.add(fl);
      this._roomMeshes.push(fl);
      const g = new THREE.Mesh(new THREE.PlaneGeometry(x2 - x1, z2 - z1), room.glowMat);
      g.rotation.x = -Math.PI / 2;
      g.position.set((x1 + x2) / 2, 0.02, (z1 + z2) / 2);
      g.renderOrder = 2;
      group.add(g);
    }
    const xs = r.rects.flatMap((q) => [q[0], q[2]]), zs = r.rects.flatMap((q) => [q[1], q[3]]);
    room.center = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...zs) + Math.max(...zs)) / 2];
    this._rooms[r.id] = room;
  }

  _buildWall(group, w, style = {}) {
    const THREE = this.THREE;
    const M = this._mats;
    const [ax, az] = w.a, [bx, bz] = w.b;
    const dx = bx - ax, dz = bz - az;
    const len = Math.hypot(dx, dz);
    const ux = dx / len, uz = dz / len;
    const t = w.t || INT;
    const H = w.h || style.h || WALL_H;
    const mats = style.mats || [M.wall, M.wall, M.wallTop, M.wall, M.wall, M.wall];
    const glass = style.glass || M.glass;
    // outward normal for exterior walls (used by the cutaway)
    let cut = null;
    if (style.cutCenter && t >= EXT) {
      let nx = -uz, nz = ux;
      const mx = (ax + bx) / 2 - style.cutCenter[0], mz = (az + bz) / 2 - style.cutCenter[1];
      if (nx * mx + nz * mz < 0) [nx, nz] = [-nx, -nz];
      cut = { nx, nz, floor: style.floor };
    }
    const piece = (s, e, y0, y1, mat = mats, cast = true) => {
      if (s === 0) s -= t / 2;
      if (e === len) e += t / 2;
      if (e - s < 0.005 || y1 - y0 < 0.005) return;
      const geo = new THREE.BoxGeometry(e - s, y1 - y0, t);
      if (style.uvMetres) {
        // world-scaled UVs on the wall faces so boards line up across pieces
        const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
        const yc = (y0 + y1) / 2, xc = (s + e) / 2;
        for (let i = 0; i < p.count; i++) {
          if (Math.abs(n.getY(i)) < 0.5) uv.setXY(i, (p.getX(i) + p.getZ(i) + xc) / style.uvMetres, (p.getY(i) + yc) / style.uvMetres);
        }
      }
      const m = new THREE.Mesh(geo, mat);
      const mid = (s + e) / 2;
      m.position.set(ax + ux * mid, y0 + (y1 - y0) / 2, az + uz * mid);
      m.rotation.y = -Math.atan2(dz, dx);
      m.castShadow = cast;
      m.receiveShadow = true;
      group.add(m);
      if (cut) this._cutWalls.push({ m, y0, y1, top: y1, ...cut });
    };
    const ops = (w.o || []).slice().sort((p, q) => p[0] - q[0]);
    let cur = 0;
    for (const [s, e, type, sill = 0.9, head = 2.1] of ops) {
      piece(cur, s, 0, H);
      if (type === 'w') {
        piece(s, e, 0, sill);
        piece(s, e, head, H);
        piece(s, e, sill, head, glass, false);
      } else if (type === 'g' || type === 'f') {
        piece(s, e, head, H);
        piece(s, e, 0, head, type === 'f' ? style.frosted || M.glass : glass, false);
      } else if (type === 'd') {
        piece(s, e, head, H);
      } else if (type === 'D') {
        // closed solid door leaf
        piece(s, e, head, H);
        piece(s, e, 0, head, M.frontDoor);
      }
      cur = e;
    }
    piece(cur, len, 0, H);
  }

  _buildFurniture(g, item) {
    const THREE = this.THREE;
    const M = this._mats;
    const [type, ...a] = item;
    const mat = (c) => (c === 'wall' ? M.wall : new THREE.MeshStandardMaterial({ color: c, roughness: 0.75 }));
    switch (type) {
      case 'box': {
        const [x1, z1, x2, z2, h, c, y0 = 0] = a;
        this._box(g, x1, z1, x2, z2, h, mat(c), y0);
        break;
      }
      case 'counter': {
        const [x1, z1, x2, z2] = a;
        this._box(g, x1, z1, x2, z2, 0.88, M.cabinet);
        this._box(g, x1, z1, x2, z2, 0.04, M.worktop, 0.88);
        break;
      }
      case 'table': {
        const [x1, z1, x2, z2, c] = a;
        const m = mat(c);
        this._box(g, x1, z1, x2, z2, 0.05, m, 0.7);
        for (const [x, z] of [[x1 + 0.08, z1 + 0.08], [x2 - 0.08, z1 + 0.08], [x1 + 0.08, z2 - 0.08], [x2 - 0.08, z2 - 0.08]])
          this._box(g, x - 0.03, z - 0.03, x + 0.03, z + 0.03, 0.7, m);
        break;
      }
      case 'chair': {
        const [x, z, rot] = a;
        const c = new THREE.Group();
        this._box(c, -0.2, -0.2, 0.2, 0.2, 0.06, M.fabric2, 0.42);
        this._box(c, -0.2, -0.2, -0.16, 0.2, 0.5, M.fabric2, 0.42);
        for (const [px, pz] of [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]]) this._box(c, px - 0.02, pz - 0.02, px + 0.02, pz + 0.02, 0.42, M.dark);
        c.position.set(x, 0, z);
        c.rotation.y = (-rot * Math.PI) / 180;
        g.add(c);
        break;
      }
      case 'sofa': {
        const [x1, z1, x2, z2, back] = a;
        this._box(g, x1, z1, x2, z2, 0.42, M.fabric);
        if (back === 'w') this._box(g, x2 - 0.22, z1, x2, z2, 0.85, M.fabric);
        this._box(g, x1, z1, x2, z1 + 0.2, 0.62, M.fabric);
        this._box(g, x1, z2 - 0.2, x2, z2, 0.62, M.fabric);
        // cushions
        this._box(g, x1 + 0.4, z1 + 0.5, x1 + 0.6, z1 + 0.9, 0.18, M.fabric2, 0.42);
        this._box(g, x1 + 0.4, z2 - 0.9, x1 + 0.6, z2 - 0.5, 0.18, M.fabric2, 0.42);
        break;
      }
      case 'armchair': {
        const [x1, z1, x2, z2] = a;
        this._box(g, x1, z1, x2, z2, 0.42, M.fabric2);
        this._box(g, x1, z2 - 0.18, x2, z2, 0.85, M.fabric2);
        break;
      }
      case 'rug': {
        const [x1, z1, x2, z2, c] = a;
        this._box(g, x1, z1, x2, z2, 0.012, mat(c), 0.003, false);
        break;
      }
      case 'tv': {
        const [x1, z1, x2, z2, y0, entity] = a;
        const screen = new THREE.MeshStandardMaterial({ color: '#0d0f12', emissive: '#7fb2ff', emissiveIntensity: 0, roughness: 0.25 });
        this._box(g, x1, z1, x2, z2, 0.68, screen, y0);
        if (entity) this._screens[entity] = screen;
        break;
      }
      case 'tvcorner': {
        // TV on a corner unit, angled across the corner (rotation in degrees)
        const [x, z, deg, entity] = a;
        const c = new THREE.Group();
        this._box(c, -0.45, -0.2, 0.45, 0.2, 0.45, M.cabinet);
        const screen = new THREE.MeshStandardMaterial({ color: '#0d0f12', emissive: '#7fb2ff', emissiveIntensity: 0, roughness: 0.25 });
        this._box(c, -0.62, -0.03, 0.62, 0.03, 0.72, screen, 0.55);
        this._box(c, -0.12, -0.06, 0.12, 0.06, 0.1, M.dark, 0.45);
        c.position.set(x, 0, z);
        c.rotation.y = (deg * Math.PI) / 180;
        g.add(c);
        if (entity) this._screens[entity] = screen;
        break;
      }
      case 'couch': {
        // [x1, z1, x2, z2, colour, back side n|s|e|w]
        const [x1, z1, x2, z2, color, back] = a;
        const m = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
        const m2 = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.8), roughness: 0.9 });
        const bd = 0.22, arm = 0.18;
        this._box(g, x1, z1, x2, z2, 0.42, m);
        if (back === 's') this._box(g, x1, z2 - bd, x2, z2, 0.85, m);
        if (back === 'n') this._box(g, x1, z1, x2, z1 + bd, 0.85, m);
        if (back === 'e') this._box(g, x2 - bd, z1, x2, z2, 0.85, m);
        if (back === 'w') this._box(g, x1, z1, x1 + bd, z2, 0.85, m);
        const alongX = back === 's' || back === 'n';
        if (alongX) {
          this._box(g, x1, z1, x1 + arm, z2, 0.62, m);
          this._box(g, x2 - arm, z1, x2, z2, 0.62, m);
          const n = 3, w = (x2 - x1 - 2 * arm) / n, zc0 = back === 's' ? z1 + 0.05 : z1 + bd, zc1 = back === 's' ? z2 - bd : z2 - 0.05;
          for (let i = 0; i < n; i++) this._box(g, x1 + arm + i * w + 0.02, zc0, x1 + arm + (i + 1) * w - 0.02, zc1, 0.1, m2, 0.42);
        } else {
          this._box(g, x1, z1, x2, z1 + arm, 0.62, m);
          this._box(g, x1, z2 - arm, x2, z2, 0.62, m);
        }
        break;
      }
      case 'lamp': {
        const [x, z, entity] = a;
        this._cyl(g, x, z, 0.16, 0.03, M.dark);
        this._cyl(g, x, z, 0.02, 1.45, M.dark);
        const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 0.25, 20, 1, true), new THREE.MeshStandardMaterial({ color: '#f1e3c8', side: THREE.DoubleSide, emissive: '#ffcf86', emissiveIntensity: 0 }));
        shade.position.set(x, 1.5, z);
        g.add(shade);
        if (entity) this._addLightFx(entity, { mat: shade.material, gain: 1.5 });
        break;
      }
      case 'plant': {
        const [x, z] = a;
        this._cyl(g, x, z, 0.16, 0.35, M.pot);
        const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 0), M.leaf);
        m.position.set(x, 0.65, z);
        m.castShadow = true;
        g.add(m);
        break;
      }
      case 'bed': {
        const [x1, z1, x2, z2, foot] = a;
        // head against x1 (west); foot towards x2
        this._box(g, x1, z1, x2, z2, 0.3, M.fence);
        this._box(g, x1 + 0.05, z1 + 0.04, x2 - 0.04, z2 - 0.04, 0.2, M.linen, 0.3);
        this._box(g, x1 + 0.7, z1 + 0.02, x2 - 0.02, z2 - 0.02, 0.07, M.duvet, 0.47);
        const pw = (z2 - z1) / 2;
        this._box(g, x1 + 0.12, z1 + 0.1, x1 + 0.5, z1 + pw - 0.05, 0.12, M.white, 0.5);
        this._box(g, x1 + 0.12, z1 + pw + 0.05, x1 + 0.5, z2 - 0.1, 0.12, M.white, 0.5);
        this._box(g, x1 - 0.02, z1, x1 + 0.06, z2, 1.0, M.fence);
        void foot;
        break;
      }
      case 'daybed': {
        // single day bed, long side against the x1 wall
        const [x1, z1, x2, z2] = a;
        this._box(g, x1, z1, x2, z2, 0.3, M.fence);
        this._box(g, x1 + 0.06, z1 + 0.06, x2 - 0.03, z2 - 0.06, 0.16, M.linen, 0.3);
        this._box(g, x1, z1, x1 + 0.08, z2, 0.85, M.fence);
        this._box(g, x1, z1, x2, z1 + 0.06, 0.65, M.fence);
        this._box(g, x1, z2 - 0.06, x2, z2, 0.65, M.fence);
        this._box(g, x1 + 0.08, z1 + 0.15, x1 + 0.28, z1 + 0.85, 0.3, M.fabric2, 0.46);
        this._box(g, x1 + 0.08, z2 - 0.85, x1 + 0.28, z2 - 0.15, 0.3, M.fabric, 0.46);
        this._box(g, x1 + 0.35, (z1 + z2) / 2 - 0.4, x2 - 0.05, (z1 + z2) / 2 + 0.5, 0.04, M.duvet, 0.46);
        break;
      }
      case 'squatrack': {
        const [x1, z1, x2, z2] = a;
        const steel = new THREE.MeshStandardMaterial({ color: '#2b2e33', roughness: 0.4, metalness: 0.6 });
        this._box(g, x1 - 0.3, z1 - 0.1, x2 + 0.3, z2 + 0.6, 0.015, new THREE.MeshStandardMaterial({ color: '#1c1d1f', roughness: 0.95 }), 0.002, false); // rubber mat
        const u = 0.06;
        for (const [x, z] of [[x1, z1], [x2 - u, z1], [x1, z2 - u], [x2 - u, z2 - u]]) this._box(g, x, z, x + u, z + u, 2.05, steel);
        this._box(g, x1, z1, x2, z1 + u, u, steel, 2.0);
        this._box(g, x1, z2 - u, x2, z2, u, steel, 2.0);
        this._box(g, x1, z1, x1 + u, z2, u, steel, 2.0);
        this._box(g, x2 - u, z1, x2, z2, u, steel, 2.0);
        // barbell racked on the front uprights with plates
        const bz = z2 - 0.1, xm = (x1 + x2) / 2;
        const bar = this._cyl(g, 0, 0, 0.016, 1.9, new THREE.MeshStandardMaterial({ color: '#b9bec4', metalness: 0.9, roughness: 0.3 }));
        bar.rotation.z = Math.PI / 2;
        bar.position.set(xm, 1.35, bz);
        const plate = new THREE.MeshStandardMaterial({ color: '#111214', roughness: 0.6 });
        for (const side of [-1, 1]) {
          for (let i = 0; i < 2; i++) {
            const p = this._cyl(g, 0, 0, i ? 0.17 : 0.225, 0.05, plate);
            p.rotation.z = Math.PI / 2;
            p.position.set(xm + side * (0.72 + i * 0.06), 1.35, bz);
          }
        }
        // weight plate storage on the floor
        for (let i = 0; i < 3; i++) this._cyl(g, x1 + 0.25, z1 + 0.25, 0.225 - i * 0.03, 0.05, plate, i * 0.05);
        break;
      }
      case 'treadmill': {
        // runs along z, user faces -z (towards the console at z1)
        const [x1, z1, x2, z2] = a;
        const body = new THREE.MeshStandardMaterial({ color: '#3a3d42', roughness: 0.5, metalness: 0.3 });
        this._box(g, x1, z1 + 0.1, x2, z2, 0.18, body);
        this._box(g, x1 + 0.1, z1 + 0.25, x2 - 0.1, z2 - 0.1, 0.01, new THREE.MeshStandardMaterial({ color: '#121314', roughness: 0.9 }), 0.18, false);
        this._box(g, x1 + 0.02, z1 + 0.12, x1 + 0.08, z1 + 0.25, 1.3, body);
        this._box(g, x2 - 0.08, z1 + 0.12, x2 - 0.02, z1 + 0.25, 1.3, body);
        this._box(g, x1, z1, x2, z1 + 0.3, 0.08, body, 1.25); // console
        this._box(g, x1 + 0.15, z1 + 0.18, x2 - 0.15, z1 + 0.2, 0.18, new THREE.MeshStandardMaterial({ color: '#0d0f12', emissive: '#4fa3ff', emissiveIntensity: 0.25 }), 1.3, false);
        break;
      }
      case 'toilet': {
        const [x1, z1, x2, z2] = a;
        this._box(g, x1, z1, x2, z2, 0.4, M.white);
        break;
      }
      case 'bath': {
        const [x1, z1, x2, z2] = a;
        this._box(g, x1, z1, x2, z1 + 0.06, 0.55, M.white);
        this._box(g, x1, z2 - 0.06, x2, z2, 0.55, M.white);
        this._box(g, x1, z1, x1 + 0.06, z2, 0.55, M.white);
        this._box(g, x2 - 0.06, z1, x2, z2, 0.55, M.white);
        this._box(g, x1, z1, x2, z2, 0.15, new THREE.MeshStandardMaterial({ color: '#cfe6f2', roughness: 0.2 }));
        break;
      }
      case 'glass': {
        const [x1, z1, x2, z2] = a;
        this._box(g, x1, z1, x2, z2, 2.0, M.glass, 0, false);
        break;
      }
      case 'desk': {
        const [x1, z1, x2, z2] = a;
        this._box(g, x1, z1, x2, z2, 0.04, M.fence, 0.72);
        this._box(g, x1, z1, x2, z1 + 0.05, 0.72, M.fence);
        this._box(g, x1, z2 - 0.05, x2, z2, 0.72, M.fence);
        const mon = new THREE.MeshStandardMaterial({ color: '#111', emissive: '#7fb2ff', emissiveIntensity: 0.15 });
        const zm = (z1 + z2) / 2;
        this._box(g, x2 - 0.14, zm - 0.62, x2 - 0.1, zm - 0.04, 0.36, mon, 0.86);
        this._box(g, x2 - 0.14, zm + 0.04, x2 - 0.1, zm + 0.62, 0.36, mon, 0.86);
        this._box(g, x1 - 0.5, (z1 + z2) / 2 - 0.25, x1 - 0.05, (z1 + z2) / 2 + 0.25, 0.5, M.dark);
        break;
      }
      case 'stairs': {
        // [x1, x2, zBottom, zTop] – rises from zBottom (front) to zTop (back)
        const [x1, x2, zb, zt] = a;
        const n = 13, run = (zb - zt) / n, rise = STOREY / (n + 1);
        const m = new THREE.MeshStandardMaterial({ map: this._tex.woodDark, roughness: 0.7 });
        for (let i = 0; i < n; i++) this._box(g, x1, zb - (i + 1) * run, x2, zb - i * run, (i + 1) * rise, m);
        break;
      }
      case 'stairsDown': {
        const [x1, x2, z1, z2] = a; // stair void: top step at z1, going down towards z2
        const n = 7, run = (z2 - z1) / n, drop = STOREY / 14;
        const m = new THREE.MeshStandardMaterial({ map: this._tex.woodDark, roughness: 0.7 });
        for (let i = 0; i < n; i++) this._box(g, x1, z1 + i * run, x2, z1 + (i + 1) * run, 0.05, m, -drop * (i + 1));
        break;
      }
      default:
        break;
    }
  }

  /* ---------------- devices: lights, markers */
  _buildDevices() {
    const THREE = this.THREE;
    this._devices = [];
    for (const d of this._config.devices) {
      const ids = arr(d.entity);
      if (!ids.length) continue;
      const room = this._rooms[d.room];
      const outside = OUTSIDE_ROOMS.find((r) => r.id === d.room);
      const floor = room ? room.floor : -1;
      const at = d.at || (room ? room.center : outside ? outside.center : [2.5, 5]);
      const kind = d.kind || this._kindOf(ids[0]);
      const dev = { ...d, ids, kind, floor, at, room: d.room };

      if (kind === 'light') {
        const la = d.light_at || [at[0], floor === -1 ? 2.2 : 2.1, at[1]];
        const light = new THREE.PointLight('#ffc98a', 0, d.range || (floor === -1 ? 9 : 5), 1.5);
        light.position.set(la[0], la[1], la[2]);
        (floor >= 0 ? this._floorGroups[floor] : this._scene).add(light);
        dev.light = light;
        dev.level = 0;
        if (room) room.lights.push(dev);
      }
      if (kind === 'motion') {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.42, 0.5, 48),
          new THREE.MeshBasicMaterial({ color: '#4fc3f7', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(at[0], 0.04, at[1]);
        ring.renderOrder = 3;
        this._floorGroups[Math.max(0, floor)].add(ring);
        dev.ring = ring;
      }
      if (kind === 'vacuum') {
        const bot = new THREE.Group();
        this._cyl(bot, 0, 0, 0.17, 0.09, new THREE.MeshStandardMaterial({ color: '#f2f2f2', roughness: 0.35 }), 0, 28);
        this._cyl(bot, 0.07, 0, 0.045, 0.03, this._mats.dark, 0.09);
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), new THREE.MeshBasicMaterial({ color: '#4fc3f7' }));
        led.position.set(0.12, 0.1, 0);
        bot.add(led);
        bot.position.set(at[0], 0.01, at[1]);
        this._floorGroups[0].add(bot);
        dev.bot = bot;
        dev.pathIdx = 0;
        dev.pos = new THREE.Vector2(VACUUM_PATH[0][0], VACUUM_PATH[0][1]);
        dev.dock = new THREE.Group();
        this._box(dev.dock, -0.32, -0.22, -0.12, 0.22, 0.45, this._mats.dark); // base station behind the docked robot
        this._box(dev.dock, -0.18, -0.2, 0.15, 0.2, 0.012, this._mats.dark); // ramp
        dev.dock.position.set(at[0], 0, at[1]);
        dev.dock.rotation.y = Math.PI / 2;
        this._floorGroups[0].add(dev.dock);
        this._vacDev = dev;
        this._buildVacuumTrail();
      }

      // HTML marker
      const el = document.createElement('button');
      el.className = `mk k-${kind}`;
      el.addEventListener('pointerdown', (e) => e.stopPropagation());
      let pressTimer, long = false;
      el.addEventListener('pointerdown', () => {
        long = false;
        pressTimer = setTimeout(() => {
          long = true;
          this._moreInfo(dev.camera || ids[0]);
        }, 550);
      });
      el.addEventListener('pointerup', () => clearTimeout(pressTimer));
      el.addEventListener('pointerleave', () => clearTimeout(pressTimer));
      el.addEventListener('contextmenu', (e) => e.preventDefault());
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!long) this._tapDevice(dev);
      });
      this._markerLayer.appendChild(el);
      dev.el = el;
      dev.world = new THREE.Vector3();
      this._devices.push(dev);
    }
  }

  _kindOf(id) {
    const dom = domainOf(id);
    if (dom === 'light' || dom === 'switch') return 'light';
    if (dom === 'cover') return 'cover';
    if (dom === 'climate') return 'climate';
    if (dom === 'media_player') return 'media';
    if (dom === 'vacuum') return 'vacuum';
    if (dom === 'sensor') return 'temp';
    if (dom === 'binary_sensor') {
      const dc = this._hass?.states[id]?.attributes?.device_class;
      if (dc === 'motion' || dc === 'occupancy' || dc === 'presence' || /motion|_md$/.test(id)) return 'motion';
      if (dc === 'door' || dc === 'garage_door' || /door/.test(id)) return 'door';
      return 'window';
    }
    return 'generic';
  }

  _tapDevice(dev) {
    const h = this._hass;
    if (!h) return;
    if (dev.kind === 'light') {
      const anyOn = dev.ids.some((i) => h.states[i]?.state === 'on');
      h.callService('homeassistant', anyOn ? 'turn_off' : 'turn_on', { entity_id: dev.ids });
    } else if (dev.kind === 'cover') {
      h.callService('cover', 'toggle', { entity_id: dev.ids[0] });
    } else if (dev.kind === 'vacuum' && this._segments?.length) {
      this._setVacSelect(!this._vacSelect);
    } else {
      this._moreInfo(dev.camera || dev.ids[0]);
    }
  }

  _moreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }));
  }

  _tapRoom(roomId) {
    const room = this._rooms[roomId];
    const lights = room ? room.lights : this._devices.filter((d) => d.room === roomId && d.kind === 'light');
    const ids = lights.flatMap((d) => d.ids);
    if (!ids.length || !this._hass) return;
    const anyOn = ids.some((i) => this._hass.states[i]?.state === 'on');
    this._hass.callService('homeassistant', anyOn ? 'turn_off' : 'turn_on', { entity_id: ids });
  }

  /* ---------------- weather FX */
  _buildWeather() {
    const THREE = this.THREE;
    const N = 2600;
    const pos = new Float32Array(N * 6);
    const rnd = seeded(42);
    this._rainSeed = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      this._rainSeed[i * 3] = -14 + rnd() * 34;
      this._rainSeed[i * 3 + 1] = rnd() * 16;
      this._rainSeed[i * 3 + 2] = -14 + rnd() * 34;
    }
    const rg = new THREE.BufferGeometry();
    rg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this._rain = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: '#b8cde0', transparent: true, opacity: 0.45 }));
    this._rain.frustumCulled = false;
    this._scene.add(this._rain);

    const sp = new Float32Array(N * 3);
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    this._snow = new THREE.Points(sg, new THREE.PointsMaterial({ color: '#ffffff', size: 0.09, transparent: true, opacity: 0.9 }));
    this._snow.frustumCulled = false;
    this._scene.add(this._snow);

    this._clouds = [];
    const crnd = seeded(5);
    for (let i = 0; i < 9; i++) {
      const s = 9 + crnd() * 10;
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(s, s * 0.7),
        new THREE.MeshBasicMaterial({ map: this._tex.cloud, transparent: true, opacity: 0, depthWrite: false, color: '#ffffff' }),
      );
      m.rotation.x = -Math.PI / 2;
      m.rotation.z = crnd() * Math.PI;
      m.position.set(-20 + crnd() * 45, 9 + crnd() * 4, -16 + crnd() * 36);
      m.renderOrder = 10;
      m.userData.speed = 0.25 + crnd() * 0.35;
      this._scene.add(m);
      this._clouds.push(m);
    }
    this._fx = { clouds: 0, rain: 0, snow: 0, fog: 0, gloom: 0, lightning: 0, wind: 0 };
  }

  /* ---------------- floors / view */
  _setFloor(f) {
    this._floorMode = f;
    this._updateFloorButtons();
    if (this._ready) this._applyFloorMode(false);
  }

  _updateFloorButtons() {
    this._root?.querySelectorAll('.floors button').forEach((b) => b.classList.toggle('on', b.dataset.f === this._floorMode));
  }

  _applyFloorMode(instant) {
    const mode = this._floorMode;
    const a = this._floorAnim;
    const o = this._orbit;
    if (mode === 'all') {
      a[0].goalVis = 1;
      a[1].goalVis = 1;
      a[1].goalY = STOREY + 4.2;
      o.goalTarget.set(2.5, 3.2, 4.5);
      o.goalPhi = 0.95;
      o.goalRadius = 30;
    } else if (mode === 'garden') {
      a[0].goalVis = 1;
      a[1].goalVis = 0;
      a[1].goalY = STOREY + 6;
      o.goalTarget.set(2.6, 0.4, -5.6);
      o.goalPhi = 0.5;
      o.goalRadius = 16;
    } else if (mode === '1') {
      a[0].goalVis = 1;
      a[1].goalVis = 1;
      a[1].goalY = STOREY;
      o.goalTarget.set(2.5, STOREY, 3.6);
      o.goalPhi = 0.62;
      o.goalRadius = 25;
    } else {
      a[0].goalVis = 1;
      a[1].goalVis = 0;
      a[1].goalY = STOREY + 6;
      o.goalTarget.set(2.5, 0, 3.2);
      o.goalPhi = 0.62;
      o.goalRadius = 27;
    }
    if (instant) {
      for (const k of [0, 1]) {
        a[k].y = a[k].goalY;
        a[k].vis = a[k].goalVis;
      }
      o.target.copy(o.goalTarget);
      o.phi = o.goalPhi;
      o.radius = o.goalRadius;
    }
    if (this._extRoof) this._extRoof.visible = mode === '1';
  }

  _visibleFloor(floor) {
    if (floor === -1) return true;
    const mode = this._floorMode === 'garden' ? '0' : this._floorMode;
    if (mode === 'all') return true;
    return String(floor) === mode;
  }

  /* ---------------- controls */
  _bindControls() {
    const c = this._canvas;
    c.style.touchAction = 'none';
    const pointers = new Map();
    let start = null, pinch = null;
    const o = this._orbit;
    const THREE = this.THREE;

    const pan = (dx, dy) => {
      const k = o.goalRadius * 0.0016;
      const right = new THREE.Vector3(Math.cos(o.theta), 0, -Math.sin(o.theta));
      const fwd = new THREE.Vector3(Math.sin(o.theta), 0, Math.cos(o.theta));
      o.goalTarget.addScaledVector(right, -dx * k).addScaledVector(fwd, -dy * k);
      o.goalTarget.x = clamp(o.goalTarget.x, -10, 15);
      o.goalTarget.z = clamp(o.goalTarget.z, -12, 18);
    };

    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, button: e.button, shift: e.shiftKey });
      if (pointers.size === 1) start = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
      if (pointers.size === 2) {
        const [p1, p2] = [...pointers.values()];
        pinch = { d: Math.hypot(p1.x - p2.x, p1.y - p2.y), mx: (p1.x + p2.x) / 2, my: (p1.y + p2.y) / 2, r: o.goalRadius };
      }
    });
    c.addEventListener('pointermove', (e) => {
      const p = pointers.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      if (start) start.moved += Math.abs(dx) + Math.abs(dy);
      if (pointers.size === 1) {
        if (p.button === 2 || p.shift || e.shiftKey) pan(dx, dy);
        else {
          o.goalTheta -= dx * 0.006;
          o.goalPhi = clamp(o.goalPhi - dy * 0.005, 0.12, 1.32);
        }
      } else if (pointers.size === 2 && pinch) {
        const [p1, p2] = [...pointers.values()];
        const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        o.goalRadius = clamp((pinch.r * pinch.d) / Math.max(d, 1), 8, 60);
        const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
        pan(mx - pinch.mx, my - pinch.my);
        pinch.mx = mx;
        pinch.my = my;
      }
    });
    const up = (e) => {
      const wasSingle = pointers.size === 1;
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (wasSingle && start && start.moved < 8 && performance.now() - start.t < 450) this._handleTap(e);
      if (!pointers.size) start = null;
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', (e) => {
      pointers.delete(e.pointerId);
      start = null;
      pinch = null;
    });
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      o.goalRadius = clamp(o.goalRadius * (1 + e.deltaY * 0.0012), 8, 60);
    }, { passive: false });
    c.addEventListener('dblclick', () => {
      o.goalTheta = -0.28;
      this._applyFloorMode(false);
    });
  }

  _handleTap(e) {
    const THREE = this.THREE;
    const rect = this._canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, this._camera);
    const targets = this._roomMeshes.filter((m) => {
      const room = this._rooms[m.userData.room];
      return !room || this._visibleFloor(room.floor);
    });
    const hit = ray.intersectObjects(targets, false)[0];
    if (!hit) return;
    if (this._vacSelect) {
      const local = this._floorGroups[0].worldToLocal(hit.point.clone());
      const seg = this._segmentAt(local.x, local.z);
      if (seg) this._toggleSegment(seg);
      return;
    }
    this._tapRoom(hit.object.userData.room);
  }

  /* ---------------- robot vacuum: live map, trail, rooms, cleaning */
  _vacToModel(p) {
    const T = this._config.vacuum_transform;
    return [T.ox + (T.sx * p.x) / 1000, T.oz + (T.sz * p.y) / 1000];
  }

  _vacHeading(a) {
    // robot heading (degrees, robot frame) → model rotation.y
    const T = this._config.vacuum_transform;
    const r = (a * Math.PI) / 180;
    return -Math.atan2(Math.sign(T.sz) * Math.sin(r), Math.sign(T.sx) * Math.cos(r));
  }

  _buildVacuumTrail() {
    const THREE = this.THREE;
    const b = (this._trailBounds = { x0: -0.4, z0: -0.4, x1: 5.4, z1: 10.2, ppm: 80 });
    const c = document.createElement('canvas');
    c.width = Math.round((b.x1 - b.x0) * b.ppm);
    c.height = Math.round((b.z1 - b.z0) * b.ppm);
    this._trailCtx = c.getContext('2d');
    this._trailTex = new THREE.CanvasTexture(c);
    this._trailTex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(b.x1 - b.x0, b.z1 - b.z0),
      new THREE.MeshBasicMaterial({ map: this._trailTex, transparent: true, opacity: 0.38, depthWrite: false }),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set((b.x0 + b.x1) / 2, 0.03, (b.z0 + b.z1) / 2);
    m.renderOrder = 3;
    this._floorGroups[0].add(m);
    this._trailLast = null;
  }

  _trailClear() {
    const c = this._trailCtx.canvas;
    this._trailCtx.clearRect(0, 0, c.width, c.height);
    this._trailTex.needsUpdate = true;
    this._trailLast = null;
  }

  _trailAdd(x, z) {
    const b = this._trailBounds, g = this._trailCtx;
    const px = (x - b.x0) * b.ppm, py = (z - b.z0) * b.ppm;
    const last = this._trailLast;
    if (last && Math.hypot(px - last[0], py - last[1]) < 3) return;
    g.strokeStyle = 'rgb(41, 160, 246)';
    g.lineCap = g.lineJoin = 'round';
    g.lineWidth = 0.3 * b.ppm; // robot width
    g.beginPath();
    g.moveTo(...(last || [px, py]));
    g.lineTo(px, py);
    g.stroke();
    this._trailLast = [px, py];
    this._trailTex.needsUpdate = true;
  }

  _syncSegments(map) {
    const THREE = this.THREE;
    const rooms = map?.rooms || {};
    const key = `${map?.map_id}:${Object.keys(rooms).join(',')}`;
    if (key === this._segKey) return;
    this._segKey = key;
    for (const sg of this._segments || []) {
      sg.group.removeFromParent();
      sg.el.remove();
    }
    this._segments = Object.values(rooms).map((r) => {
      const [ax, az] = this._vacToModel({ x: r.x0, y: r.y0 });
      const [bx, bz] = this._vacToModel({ x: r.x1, y: r.y1 });
      const x0 = Math.min(ax, bx), x1 = Math.max(ax, bx), z0 = Math.min(az, bz), z1 = Math.max(az, bz);
      const group = new THREE.Group();
      const fill = new THREE.MeshBasicMaterial({ color: '#3ea6ff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      const edge = new THREE.MeshBasicMaterial({ color: '#7cc4ff', transparent: true, opacity: 0, depthWrite: false });
      const plane = (w, d, x, z, mat) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
        m.rotation.x = -Math.PI / 2;
        m.position.set(x, 0.04, z);
        m.renderOrder = 4;
        group.add(m);
      };
      const inset = 0.08, e = 0.04;
      const [ix0, ix1, iz0, iz1] = [x0 + inset, x1 - inset, z0 + inset, z1 - inset];
      plane(ix1 - ix0, iz1 - iz0, (ix0 + ix1) / 2, (iz0 + iz1) / 2, fill);
      plane(ix1 - ix0, e, (ix0 + ix1) / 2, iz0, edge);
      plane(ix1 - ix0, e, (ix0 + ix1) / 2, iz1, edge);
      plane(e, iz1 - iz0, ix0, (iz0 + iz1) / 2, edge);
      plane(e, iz1 - iz0, ix1, (iz0 + iz1) / 2, edge);
      this._floorGroups[0].add(group);
      const el = document.createElement('button');
      el.className = 'seg';
      el.addEventListener('pointerdown', (ev) => ev.stopPropagation());
      this._markerLayer.appendChild(el);
      const sg = { id: r.room_id, name: r.custom_name || r.name || `Room ${r.room_id}`, x0, x1, z0, z1, group, fill, edge, el, world: new THREE.Vector3() };
      [sg.cx, sg.cz] = this._vacToModel({ x: r.x, y: r.y });
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (this._vacSelect) this._toggleSegment(sg);
        else this._setVacSelect(true);
      });
      return sg;
    });
    this._vacPicked = new Set();
  }

  _segmentAt(x, z) {
    const inside = (this._segments || []).filter((s) => x >= s.x0 && x <= s.x1 && z >= s.z0 && z <= s.z1);
    inside.sort((a, b) => (a.x1 - a.x0) * (a.z1 - a.z0) - (b.x1 - b.x0) * (b.z1 - b.z0));
    return inside[0];
  }

  _setVacSelect(on) {
    this._vacSelect = on;
    this._vacPicked = new Set();
    if (on && this._floorMode !== '0') this._setFloor('0');
    this._renderVacBar();
    this._dirty = true;
  }

  _toggleSegment(sg) {
    if (this._vacPicked.has(sg.id)) this._vacPicked.delete(sg.id);
    else this._vacPicked.add(sg.id);
    this._renderVacBar();
  }

  _renderVacBar() {
    const bar = this._root.querySelector('.vbar');
    if (!this._vacSelect) {
      bar.innerHTML = '';
      return;
    }
    const names = this._segments.filter((s) => this._vacPicked.has(s.id)).map((s) => s.name);
    bar.innerHTML = names.length
      ? `${svg(ICON.vacuum)}<span>Clean <b>${names.join(', ')}</b>?</span><button data-act="clean" class="go">Clean</button><button data-act="cancel">Cancel</button>`
      : `${svg(ICON.vacuum)}<span>Tap the rooms to clean</span><button data-act="cancel">Cancel</button>`;
  }

  _startSegmentClean() {
    const ids = [...this._vacPicked];
    if (!ids.length || !this._hass) return;
    const [domain, service] = this._config.vacuum_clean_service.split('.');
    this._hass.callService(domain, service, { segments: ids.length === 1 ? ids[0] : ids }, { entity_id: this._config.vacuum });
    this._setVacSelect(false);
  }

  _resize() {
    const el = this._canvas.parentElement;
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    this._renderer.setSize(w, h, false);
    this._camera.aspect = w / h;
    // keep the house framed on narrow (portrait) screens
    this._camera.fov = w / h < 1 ? 32 / Math.max(w / h, 0.4) ** 0.45 : 32;
    this._camera.updateProjectionMatrix();
    this._size = { w, h };
  }

  /* ---------------- state → scene */
  _syncState() {
    const h = this._hass;
    if (!h) return;
    const S = h.states;

    // lights
    let lightsOn = 0;
    for (const d of this._devices) {
      const states = d.ids.map((i) => S[i]);
      const st = states[0];
      const el = d.el;
      let icon = ICON.bulbOff, label = '', cls = '';
      switch (d.kind) {
        case 'light': {
          const on = states.filter((s) => s?.state === 'on');
          lightsOn += on.length;
          d.target = on.length ? 1 : 0;
          if (on.length) {
            const a = on[0].attributes || {};
            let rgb = [1, 0.78, 0.52];
            if (a.rgb_color) rgb = a.rgb_color.map((v) => v / 255);
            else if (a.color_temp_kelvin) rgb = kelvinToRgb(a.color_temp_kelvin);
            d.color = rgb;
            d.target = 0.35 + 0.65 * ((a.brightness ?? 255) / 255);
          }
          icon = on.length ? ICON.bulb : ICON.bulbOff;
          cls = on.length ? 'on' : states.every(isUnavail) ? 'na' : '';
          break;
        }
        case 'cover': {
          const open = st?.state === 'open' || st?.state === 'opening';
          icon = open ? ICON.blindOpen : ICON.blindClosed;
          const p = st?.attributes?.current_position;
          label = p != null ? `${p}%` : '';
          cls = isUnavail(st) ? 'na' : open ? 'open' : '';
          break;
        }
        case 'door':
        case 'window': {
          const open = st?.state === 'on';
          icon = d.kind === 'door' ? (open ? ICON.doorOpen : ICON.doorClosed) : open ? ICON.windowOpen : ICON.windowClosed;
          cls = isUnavail(st) ? 'na' : open ? 'alert' : 'quiet';
          break;
        }
        case 'motion': {
          const on = st?.state === 'on';
          d.active = on;
          icon = ICON.motion;
          cls = on ? 'active' : 'quiet';
          break;
        }
        case 'temp': {
          icon = '';
          label = isUnavail(st) ? '–' : `${Number(st.state).toFixed(1)}°`;
          cls = 'text';
          break;
        }
        case 'climate': {
          const a = st?.attributes || {};
          const heating = a.hvac_action === 'heating';
          icon = heating ? ICON.fire : '';
          label = a.current_temperature != null ? `${Number(a.current_temperature).toFixed(1)}°` : '–';
          cls = `text ${heating ? 'heat' : ''}`;
          break;
        }
        case 'media': {
          const on = st && !['off', 'unavailable', 'unknown', 'standby'].includes(st.state);
          icon = ICON.tv;
          cls = on ? 'on-blue' : isUnavail(st) ? 'na' : '';
          if (this._screens[d.ids[0]]) this._screens[d.ids[0]].emissiveIntensity = on ? 1.2 : 0;
          break;
        }
        case 'doorbell': {
          const ringing = st?.state === 'on';
          const seen = states.slice(1).some((x) => x?.state === 'on');
          icon = ICON.doorbell;
          cls = ringing ? 'alert ring' : seen ? 'active' : '';
          break;
        }
        case 'camera': {
          icon = ICON.cctv;
          cls = states.some((x) => x?.state === 'on') ? 'active' : '';
          break;
        }
        case 'vacuum': {
          icon = ICON.vacuum;
          const prev = d.mode;
          d.mode = st?.state;
          d.attrs = st?.attributes || {};
          cls = this._vacSelect ? 'on-blue active' : st?.state === 'cleaning' ? 'on-blue' : '';
          const map = S[this._config.vacuum_map]?.attributes;
          if (map?.vacuum_position) {
            d.live = true;
            d.goal = this._vacToModel(map.vacuum_position);
            d.goalHeading = this._vacHeading(map.vacuum_position.a ?? 0);
            if (!d.placed) {
              d.pos.set(d.goal[0], d.goal[1]);
              d.bot.rotation.y = d.goalHeading;
              d.placed = true;
            }
            const ch = map.charger_position;
            if (ch) {
              const [cx, cz] = this._vacToModel(ch);
              d.dock.position.set(cx, 0, cz);
              d.dock.rotation.y = this._vacHeading(ch.a ?? 0);
            }
            this._syncSegments(map);
          }
          // a new run starts with a clean trail
          if (d.mode === 'cleaning' && prev && !['cleaning', 'paused'].includes(prev)) this._trailClear();
          break;
        }
        default:
          icon = ICON.home;
      }
      const html = `${icon ? svg(icon) : ''}${label ? `<span>${label}</span>` : ''}`;
      if (el._html !== html) {
        el.innerHTML = html;
        el._html = html;
      }
      el.className = `mk k-${d.kind} ${cls}`;
      el.title = d.name || d.ids.map((i) => S[i]?.attributes?.friendly_name || i).join(', ');
    }

    this._hudPeople(S, lightsOn);
    this._hudBottom(S);
    this._hudWeather(S);
    this._syncEnvironment(S);
  }

  _hudPeople(S, lightsOn) {
    const people = arr(this._config.persons).map((p) => S[p]).filter(Boolean);
    const home = people.filter((p) => p.state === 'home');
    const fmt = (p) => (p.attributes.friendly_name || p.entity_id).split(' ')[0];
    let text;
    if (!people.length) text = 'Home';
    else if (home.length === people.length) text = people.length > 1 ? 'Everyone is home' : `${fmt(people[0])} is home`;
    else if (!home.length) text = 'Nobody home';
    else text = `${home.map(fmt).join(' & ')} ${home.length > 1 ? 'are' : 'is'} home`;
    const away = people.filter((p) => p.state !== 'home');
    const sub = away.length && home.length ? `${away.map((p) => `${fmt(p)} ${p.state === 'not_home' ? 'away' : p.state}`).join(' · ')}` : '';
    const avatars = people
      .map((p) => {
        const pic = p.attributes.entity_picture;
        const inner = pic ? `<img src="${pic}">` : `<b>${fmt(p)[0]}</b>`;
        return `<i class="av ${p.state === 'home' ? 'home' : 'away'}" data-entity="${p.entity_id}" title="${fmt(p)}">${inner}</i>`;
      })
      .join('');
    const html = `<div class="who"><div class="t">${text}</div>${sub ? `<div class="s">${sub}</div>` : ''}</div>
      <div class="sep"></div><div class="lights">${svg(ICON.bulb)}<span>${lightsOn ? `${lightsOn} light${lightsOn > 1 ? 's' : ''} on` : 'All lights off'}</span></div>
      <div class="avs">${avatars}</div>`;
    const el = this._root.querySelector('.people');
    if (el._html !== html) {
      el.innerHTML = html;
      el._html = html;
      el.querySelectorAll('[data-entity]').forEach((a) => a.addEventListener('click', () => this._moreInfo(a.dataset.entity)));
    }
  }

  _hudBottom(S) {
    const chips = [];
    const cl = S[this._config.climate];
    if (cl) {
      const a = cl.attributes;
      const heating = a.hvac_action === 'heating';
      chips.push(`<div class="chip wide" data-entity="${cl.entity_id}">
        <i class="ring ${heating ? 'heat' : ''}">${svg(ICON.fire)}</i>
        <div><b>${a.current_temperature != null ? Number(a.current_temperature).toFixed(1) + '°' : '–'}</b>
        <small>${cl.state === 'off' ? 'Heating off' : `${heating ? 'Heating' : 'Idle'} · set ${a.temperature ?? '–'}°`}</small></div></div>`);
    }
    const al = S[this._config.alarm];
    if (al) {
      const armed = al.state.startsWith('armed');
      const bad = al.state === 'triggered' || al.state === 'pending';
      chips.push(`<div class="chip ${bad ? 'alert' : armed ? 'ok' : ''}" data-entity="${al.entity_id}" title="Alarm: ${al.state}">
        ${svg(armed || bad ? ICON.shield : ICON.shieldOff)}</div>`);
    }
    const vc = S[this._config.vacuum];
    if (vc) {
      const a = vc.attributes;
      const active = ['cleaning', 'returning', 'paused'].includes(vc.state);
      const seg = this._segments?.find((sg) => sg.id === a.current_segment);
      let title = '', sub = '';
      if (vc.state === 'cleaning') {
        title = a.segment_cleaning && seg ? seg.name : 'Cleaning';
        sub = [a.cleaning_progress != null ? `${a.cleaning_progress}%` : '', a.cleaned_area != null ? `${a.cleaned_area} m²` : ''].filter(Boolean).join(' · ');
      } else if (vc.state === 'returning') title = 'Returning';
      else if (vc.state === 'paused') title = 'Paused';
      else if (a.washing) title = 'Washing mop';
      else if (a.drying) {
        title = 'Drying mop';
        sub = a.drying_left ? `${a.drying_left} min left` : '';
      }
      const batt = a.battery ?? a.battery_level;
      if (title && batt != null) sub = `${sub ? sub + ' · ' : ''}${batt}%`;
      chips.push(title
        ? `<div class="chip wide ${active ? 'blue' : ''}" data-entity="${vc.entity_id}"><i class="ring">${svg(ICON.vacuum)}</i><div><b>${title}</b><small>${sub}</small></div></div>`
        : `<div class="chip" data-entity="${vc.entity_id}" title="Vacuum: ${vc.state}${batt != null ? ` · ${batt}%` : ''}">${svg(ICON.vacuum)}</div>`);
    }
    const open = this._devices.filter((d) => (d.kind === 'door' || d.kind === 'window') && S[d.ids[0]]?.state === 'on');
    chips.push(`<div class="chip ${open.length ? 'alert' : ''}" title="${open.length ? open.map((d) => S[d.ids[0]].attributes.friendly_name).join(', ') + ' open' : 'All doors & windows closed'}"
      ${open.length ? `data-entity="${open[0].ids[0]}"` : ''}>${svg(open.length ? ICON.windowOpen : ICON.windowClosed)}${open.length ? `<span class="badge">${open.length}</span>` : ''}</div>`);
    const html = chips.join('');
    const el = this._root.querySelector('.bl');
    if (el._html !== html) {
      el.innerHTML = html;
      el._html = html;
    }
  }

  _hudWeather(S) {
    const w = S[this._config.weather];
    const el = this._root.querySelector('.weather');
    if (!w) {
      el.style.display = 'none';
      return;
    }
    const a = w.attributes;
    const unit = a.temperature_unit || '°';
    const today = this._forecast?.[0];
    const sun = S[this._config.sun];
    let sunLine = '';
    if (sun) {
      const next = sun.state === 'above_horizon' ? sun.attributes.next_setting : sun.attributes.next_rising;
      if (next) {
        const t = new Date(next).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        sunLine = `${sun.state === 'above_horizon' ? 'Sunset' : 'Sunrise'} <b>${t}</b>`;
      }
    }
    const hiLo = today ? ` · ${Math.round(today.temperature)}° / ${Math.round(today.templow ?? today.temperature)}°` : '';
    const precip = today?.precipitation_probability != null ? `${today.precipitation_probability}% rain today` : a.humidity != null ? `Humidity ${a.humidity}%` : '';
    const html = `<div class="big">${Math.round(a.temperature)}<sup>${unit.replace('C', '').replace('F', '')}</sup></div>
      <div class="desc"><b>${CONDITIONS[w.state] || w.state}</b><span>${precip}</span><span>${sunLine}${hiLo}</span></div>`;
    if (el._html !== html) {
      el.innerHTML = html;
      el._html = html;
    }
  }

  async _fetchForecast() {
    const h = this._hass, w = this._config.weather;
    if (!h || !w) return;
    try {
      const res = await h.callService('weather', 'get_forecasts', { type: 'daily' }, { entity_id: w }, false, true);
      this._forecast = res?.response?.[w]?.forecast;
      this._dirty = true;
    } catch (e) {
      this._forecast = null;
    }
  }

  _syncEnvironment(S) {
    // sun position & daylight
    const sun = S[this._config.sun];
    const elev = sun?.attributes?.elevation ?? (sun?.state === 'below_horizon' ? -20 : 35);
    const azim = sun?.attributes?.azimuth ?? 180;
    this._day = clamp((elev + 4) / 22, 0, 1);
    const rel = ((azim - this._config.house_bearing) * Math.PI) / 180;
    const e = (Math.max(elev, 8) * Math.PI) / 180;
    this._sunDir = [Math.sin(rel) * Math.cos(e), Math.sin(e), -Math.cos(rel) * Math.cos(e)];
    // weather
    const w = S[this._config.weather];
    this._fxGoal = { clouds: 0, rain: 0, snow: 0, fog: 0, gloom: 0, lightning: 0, wind: 0, ...(WEATHER_FX[w?.state] || {}) };
    this._windSpeed = w?.attributes?.wind_speed ?? 10;
  }

  /* ---------------- render loop */
  _loop() {
    this._raf = requestAnimationFrame(() => this._loop());
    if (!this._ready || !this._size) return;
    if (this._dirty) {
      this._dirty = false;
      this._syncState();
    }
    const dt = Math.min(this._clock.getDelta(), 0.1);
    const t = this._clock.elapsedTime;
    const k = 1 - Math.exp(-dt * 6);
    const THREE = this.THREE;

    // camera
    const o = this._orbit;
    o.theta = lerp(o.theta, o.goalTheta, k);
    o.phi = lerp(o.phi, o.goalPhi, k);
    o.radius = lerp(o.radius, o.goalRadius, k);
    o.target.lerp(o.goalTarget, k);
    const sp = Math.sin(o.phi);
    this._camera.position.set(
      o.target.x + o.radius * sp * Math.sin(o.theta),
      o.target.y + o.radius * Math.cos(o.phi),
      o.target.z + o.radius * sp * Math.cos(o.theta),
    );
    this._camera.lookAt(o.target);

    // cutaway: exterior walls facing the camera drop to 1 m so rooms stay visible
    const vx = Math.sin(o.theta), vz = Math.cos(o.theta), kc = 1 - Math.exp(-dt * 5);
    const focus = this._floorMode === 'all' ? null : this._floorMode === '1' ? 1 : 0;
    for (const c of this._cutWalls) {
      const facing = c.nx * vx + c.nz * vz > 0.3 && o.phi > 0.2;
      const goal = facing && (focus === null || c.floor === focus) ? 1.0 : c.y1;
      c.top = lerp(c.top, goal, kc);
      const top = Math.min(c.y1, c.top);
      if (top <= c.y0 + 0.01) {
        c.m.visible = false;
        continue;
      }
      c.m.visible = true;
      c.m.scale.y = (top - c.y0) / (c.y1 - c.y0);
      c.m.position.y = c.y0 + (top - c.y0) / 2;
    }

    // floors
    for (const id of [0, 1]) {
      const a = this._floorAnim[id];
      a.y = lerp(a.y, a.goalY, k);
      a.vis = lerp(a.vis, a.goalVis, k * 1.3);
      const g = this._floorGroups[id];
      g.position.y = a.y;
      g.visible = a.vis > 0.02;
    }

    // environment light
    const fx = this._fx, goal = this._fxGoal || fx;
    for (const key in fx) fx[key] = lerp(fx[key], goal[key] || 0, 1 - Math.exp(-dt * 1.5));
    const day = this._day ?? 1;
    const gloom = fx.gloom;
    const dir = this._sunDir || [0.4, 0.8, -0.4];
    const night = 1 - day;
    this._sun.position.set(2.5 + dir[0] * 30, dir[1] * 30, 4.5 + dir[2] * 30);
    this._sun.target.position.set(2.5, 0, 4.5);
    this._sun.intensity = lerp(0.4, 2.6, day) * (1 - gloom * 0.8);
    this._sun.color.set(day > 0.5 ? '#fff1dc' : '#9fb4d8');
    if (fx.lightning > 0.5 && Math.random() < dt * 0.25) this._flash = 1;
    this._flash = Math.max(0, this._flash - dt * 4);
    this._hemi.intensity = lerp(0.6, 1.25, day) * (1 - gloom * 0.4) + this._flash * 3;
    this._hemi.color.set(day > 0.5 ? '#e2ecf6' : '#7d93b8');
    const bg = new THREE.Color('#0e1420').lerp(new THREE.Color(gloom > 0.4 ? '#4b5560' : '#6f8aa3'), day);
    this._scene.background.copy(bg);
    this._scene.fog.color.copy(bg);
    this._scene.fog.near = lerp(30, 6, fx.fog);
    this._scene.fog.far = lerp(90, 40, fx.fog);
    this._renderer.toneMappingExposure = lerp(0.9, 1.05, day);

    // room lights & glow
    for (const d of this._devices) {
      if (d.kind !== 'light') continue;
      d.level = lerp(d.level, d.target || 0, 1 - Math.exp(-dt * 8));
      const c = d.color || [1, 0.78, 0.52];
      d.light.color.setRGB(c[0], c[1], c[2]);
      d.light.intensity = d.level * (d.floor === -1 ? 14 : 9) * (d.power ?? 1) * lerp(0.7, 1.6, night);
      for (const id of d.ids) {
        for (const fx of this._lightFx[id] || []) {
          if (fx.beam) {
            fx.mat.color.setRGB(c[0], c[1], c[2]);
            fx.mat.opacity = d.level * lerp(0.35, 0.8, night);
          } else {
            fx.mat.emissive.setRGB(c[0], c[1], c[2]);
            fx.mat.emissiveIntensity = d.level * fx.gain;
          }
        }
      }
    }
    for (const r of Object.values(this._rooms)) {
      const lvl = r.lights.reduce((m, d) => Math.max(m, d.level), 0);
      const c = r.lights.find((d) => d.color)?.color || [1, 0.78, 0.52];
      r.glowMat.color.setRGB(c[0], c[1], c[2]);
      r.glowMat.opacity = lvl * lerp(0.05, 0.16, night);
    }

    // motion rings
    for (const d of this._devices) {
      if (d.kind !== 'motion') continue;
      const ph = (t * 0.8) % 1;
      d.ring.material.opacity = d.active ? (1 - ph) * 0.9 : 0;
      d.ring.scale.setScalar(d.active ? 0.6 + ph * 2.2 : 1);
    }

    // vacuum
    for (const d of this._devices) {
      if (d.kind !== 'vacuum') continue;
      const cleaning = d.mode === 'cleaning';
      const atDock = d.pathIdx === 0;
      if (d.live) {
        const k2 = 1 - Math.exp(-dt * 2.5);
        d.pos.x = lerp(d.pos.x, d.goal[0], k2);
        d.pos.y = lerp(d.pos.y, d.goal[1], k2);
        let diff = d.goalHeading - d.bot.rotation.y;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        d.bot.rotation.y += diff * Math.min(1, dt * 4);
        if (cleaning) this._trailAdd(d.pos.x, d.pos.y);
      } else if (cleaning || !atDock) {
        const next = VACUUM_PATH[(d.pathIdx + 1) % VACUUM_PATH.length];
        const dx = next[0] - d.pos.x, dz = next[1] - d.pos.y;
        const dist = Math.hypot(dx, dz);
        const step = dt * (cleaning ? 0.35 : 0.6);
        if (dist <= step) {
          d.pos.set(next[0], next[1]);
          d.pathIdx = (d.pathIdx + 1) % VACUUM_PATH.length;
        } else {
          d.pos.x += (dx / dist) * step;
          d.pos.y += (dz / dist) * step;
          const want = -Math.atan2(dz, dx);
          let diff = want - d.bot.rotation.y;
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          d.bot.rotation.y += diff * Math.min(1, dt * 6);
        }
      }
      d.bot.position.set(d.pos.x, 0.01, d.pos.y);
      d.at = [d.pos.x, d.pos.y];
    }

    // weather particles
    this._animateWeather(dt, t);

    this._renderer.render(this._scene, this._camera);
    this._placeMarkers();
  }

  _placeSegments(w, h, cam) {
    if (!this._segments) return;
    const vd = this._vacDev;
    const a = vd?.attrs || {};
    const running = ['cleaning', 'returning', 'paused'].includes(vd?.mode);
    const show = (this._vacSelect || running) && this._visibleFloor(0);
    const done = new Set(arr(a.completed_segments));
    const queued = new Set(arr(a.active_segments));
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 300);
    for (const sg of this._segments) {
      const picked = this._vacPicked?.has(sg.id);
      const current = vd?.mode === 'cleaning' && a.current_segment === sg.id;
      const isDone = running && done.has(sg.id);
      let fill = 0, edge = 0;
      if (this._vacSelect) {
        fill = picked ? 0.28 : 0.06;
        edge = picked ? 0.95 : 0.45;
      } else if (running) {
        fill = current ? 0.1 + 0.14 * pulse : isDone ? 0.06 : 0;
        edge = current ? 0.9 : queued.has(sg.id) || isDone ? 0.35 : 0;
      }
      sg.fill.opacity = fill;
      sg.edge.opacity = edge;
      sg.fill.color.set(isDone && !this._vacSelect ? '#4caf50' : '#3ea6ff');
      sg.group.visible = show;
      const el = sg.el;
      if (!show) {
        el.style.display = 'none';
        continue;
      }
      const label = `${isDone && !this._vacSelect ? '<i>✓</i>' : ''}${sg.name}`;
      if (el._html !== label) {
        el.innerHTML = label;
        el._html = label;
      }
      el.className = `seg ${picked ? 'picked' : ''} ${current && !this._vacSelect ? 'current' : ''} ${isDone ? 'done' : ''}`;
      sg.world.set(sg.cx, this._floorAnim[0].y + 0.2, sg.cz).project(cam);
      el.style.display = '';
      el.style.transform = `translate(${((sg.world.x * 0.5 + 0.5) * w).toFixed(1)}px, ${((-sg.world.y * 0.5 + 0.5) * h).toFixed(1)}px) translate(-50%, -50%)`;
    }
  }

  _animateWeather(dt, t) {
    const fx = this._fx;
    const N = this._rainSeed.length / 3;
    const seed = this._rainSeed;
    const wind = 0.15 + fx.wind * 0.6;
    // rain
    const rainN = Math.floor(N * fx.rain);
    this._rain.visible = rainN > 0;
    if (rainN) {
      const p = this._rain.geometry.attributes.position.array;
      for (let i = 0; i < rainN; i++) {
        const y = 16 - ((seed[i * 3 + 1] + t * 14) % 16);
        const x = seed[i * 3] + y * wind * 0.2;
        const z = seed[i * 3 + 2];
        p.set([x, y, z, x - wind * 0.06, y + 0.45, z], i * 6);
      }
      this._rain.geometry.setDrawRange(0, rainN * 2);
      this._rain.geometry.attributes.position.needsUpdate = true;
    }
    // snow
    const snowN = Math.floor(N * fx.snow);
    this._snow.visible = snowN > 0;
    if (snowN) {
      const p = this._snow.geometry.attributes.position.array;
      for (let i = 0; i < snowN; i++) {
        const y = 16 - ((seed[i * 3 + 1] + t * 1.2) % 16);
        p[i * 3] = seed[i * 3] + Math.sin(t * 0.7 + i) * 0.4 + y * wind * 0.1;
        p[i * 3 + 1] = y;
        p[i * 3 + 2] = seed[i * 3 + 2] + Math.cos(t * 0.5 + i * 1.3) * 0.4;
      }
      this._snow.geometry.setDrawRange(0, snowN);
      this._snow.geometry.attributes.position.needsUpdate = true;
    }
    // clouds drift
    const tint = this._day > 0.5 ? (fx.gloom > 0.4 ? 0.75 : 1) : 0.35;
    this._clouds.forEach((c, i) => {
      c.position.x += dt * c.userData.speed * (0.5 + fx.wind * 2);
      if (c.position.x > 26) c.position.x = -24;
      c.material.opacity = clamp(fx.clouds * 1.4 - i * 0.12, 0, 0.75) + fx.fog * 0.2;
      c.material.color.setScalar(tint);
    });
  }

  _placeMarkers() {
    const { w, h } = this._size;
    const cam = this._camera;
    this._placeSegments(w, h, cam);
    for (const d of this._devices) {
      const visible = this._visibleFloor(d.floor) && (d.floor < 0 || this._floorAnim[d.floor].vis > 0.5);
      if (!visible) {
        if (d.el.style.display !== 'none') d.el.style.display = 'none';
        continue;
      }
      const fy = d.floor >= 0 ? this._floorAnim[d.floor].y : 0;
      const hgt = d.h ?? (d.kind === 'vacuum' ? 0.35 : d.kind === 'temp' || d.kind === 'climate' ? 0.9 : 1.2);
      d.world.set(d.at[0], fy + hgt, d.at[1]).project(cam);
      if (d.world.z > 1) {
        d.el.style.display = 'none';
        continue;
      }
      d.el.style.display = '';
      const x = (d.world.x * 0.5 + 0.5) * w, y = (-d.world.y * 0.5 + 0.5) * h;
      d.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
    }
  }
}

const STYLE = `
:host { display:block; height:100%; }
ha-card { display:block; position:relative; overflow:hidden; height:100%; min-height:420px; border-radius:var(--ha-card-border-radius, 12px); background:#111; }
.stage { position:absolute; inset:0; font-family: var(--paper-font-body1_-_font-family, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif); color:#fff; -webkit-user-select:none; user-select:none; }
canvas { width:100%; height:100%; display:block; cursor:grab; }
canvas:active { cursor:grabbing; }
.markers { position:absolute; inset:0; pointer-events:none; }
.msg { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:#aaa; font-size:14px; pointer-events:none; }
.msg:empty { display:none; }
svg { width:18px; height:18px; fill:currentColor; flex:none; }
.glass { background:rgba(22,24,28,.72); backdrop-filter:blur(14px) saturate(1.3); -webkit-backdrop-filter:blur(14px) saturate(1.3); box-shadow:0 4px 18px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.08); }

.mk { position:absolute; left:0; top:0; pointer-events:auto; border:0; padding:0; cursor:pointer; display:flex; align-items:center; gap:3px;
  height:28px; min-width:28px; justify-content:center; border-radius:14px; color:#fff; font:600 11px/1 inherit;
  background:rgba(22,24,28,.72); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
  box-shadow:0 2px 10px rgba(0,0,0,.4), inset 0 0 0 1px rgba(255,255,255,.12); transition:background .25s, color .25s, opacity .25s; will-change:transform; }
.mk svg { width:16px; height:16px; }
.mk.text { padding:0 8px; height:22px; font-size:11px; background:rgba(22,24,28,.6); }
.mk.text svg { width:13px; height:13px; color:#ff8a3d; }
.mk.on { background:#ffb938; color:#2b1d00; box-shadow:0 0 0 4px rgba(255,185,56,.25), 0 2px 12px rgba(255,170,40,.6); }
.mk.on-blue { background:#3ea6ff; color:#fff; box-shadow:0 0 0 4px rgba(62,166,255,.25); }
.mk.open { background:rgba(22,24,28,.72); }
.mk.alert { background:#ef5350; box-shadow:0 0 0 4px rgba(239,83,80,.3); }
.mk.active { background:#29b6f6; animation:pulse 1.2s infinite; }
.mk.quiet { opacity:.55; transform-origin:center; height:22px; min-width:22px; }
.mk.quiet svg { width:13px; height:13px; }
.mk.na { opacity:.35; }
.mk.k-cover span { font-size:10px; padding-right:7px; }
.mk.k-cover { padding-left:6px; }
.mk.k-cover:not(:has(span)) { padding:0; }
.mk.ring { animation:pulseRed 1s infinite; }
@keyframes pulseRed { 0%{ box-shadow:0 0 0 0 rgba(239,83,80,.8);} 100%{ box-shadow:0 0 0 14px rgba(239,83,80,0);} }
@keyframes pulse { 0%{ box-shadow:0 0 0 0 rgba(41,182,246,.7);} 100%{ box-shadow:0 0 0 12px rgba(41,182,246,0);} }

.seg { position:absolute; left:0; top:0; pointer-events:auto; border:0; cursor:pointer; padding:4px 9px; border-radius:10px; font:600 11px/1.2 inherit;
  color:#fff; background:rgba(20,60,100,.7); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); box-shadow:inset 0 0 0 1px rgba(124,196,255,.5); white-space:nowrap; }
.seg i { font-style:normal; color:#7ee787; margin-right:4px; }
.seg.picked { background:#3ea6ff; box-shadow:0 0 0 3px rgba(62,166,255,.35); }
.seg.current { background:#3ea6ff; }
.seg.done { background:rgba(30,80,40,.75); box-shadow:inset 0 0 0 1px rgba(126,231,135,.5); }
.vbar { left:50%; bottom:14px; transform:translateX(-50%); gap:10px; padding:6px 6px 6px 14px; border-radius:22px; font-size:13px;
  background:rgba(22,24,28,.85); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); box-shadow:0 4px 18px rgba(0,0,0,.35), inset 0 0 0 1px rgba(62,166,255,.5); }
.vbar:empty { display:none; }
.vbar svg { color:#3ea6ff; }
.vbar button { border:0; border-radius:16px; padding:7px 14px; font:600 12px inherit; cursor:pointer; background:rgba(255,255,255,.12); color:#fff; }
.vbar button.go { background:#3ea6ff; }
.hud { position:absolute; display:flex; gap:8px; align-items:center; pointer-events:none; }
.hud > * { pointer-events:auto; }
.top { top:14px; left:50%; transform:translateX(-50%); }
.pill { display:flex; align-items:center; gap:10px; padding:6px 8px 6px 16px; border-radius:24px; white-space:nowrap;
  background:rgba(22,24,28,.72); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); box-shadow:0 4px 18px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.08); }
.who .t { font-size:13px; font-weight:600; }
.who .s { font-size:10.5px; opacity:.65; margin-top:2px; }
.sep { width:1px; height:22px; background:rgba(255,255,255,.15); }
.lights { display:flex; align-items:center; gap:5px; font-size:12px; font-weight:500; }
.lights svg { width:15px; height:15px; color:#ffc84a; }
.avs { display:flex; }
.av { width:28px; height:28px; border-radius:50%; overflow:hidden; display:flex; align-items:center; justify-content:center; font-style:normal;
  background:#4a5260; margin-left:-6px; box-shadow:0 0 0 2px #23262b; cursor:pointer; position:relative; }
.av:first-child { margin-left:0; }
.av img { width:100%; height:100%; object-fit:cover; }
.av b { font-size:12px; }
.av.home { box-shadow:0 0 0 2px #23262b, 0 0 0 4px #4caf50; }
.av.away { filter:grayscale(1); opacity:.6; }

.floors { top:14px; left:14px; flex-direction:column; gap:0; border-radius:14px; overflow:hidden;
  background:rgba(22,24,28,.72); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); box-shadow:0 4px 18px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.08); }
.floors button { border:0; background:transparent; color:rgba(255,255,255,.65); width:40px; height:40px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.floors button.on { color:#fff; background:rgba(255,255,255,.14); }
.floors button svg { width:20px; height:20px; }

.bl { left:14px; bottom:14px; }
.chip { display:flex; align-items:center; gap:8px; height:40px; min-width:40px; justify-content:center; border-radius:20px; cursor:pointer; position:relative;
  background:rgba(22,24,28,.72); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); box-shadow:0 4px 18px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.08); }
.chip.wide { padding:0 14px 0 5px; }
.chip.wide b { font-size:14px; display:block; }
.chip.wide small { font-size:10px; opacity:.65; display:block; margin-top:1px; }
.chip .ring { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-style:normal; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); color:rgba(255,255,255,.5); }
.chip .ring.heat { box-shadow:inset 0 0 0 2px #ff8a3d; color:#ff8a3d; }
.chip.ok { color:#66bb6a; }
.chip.alert { color:#fff; background:#ef5350; }
.chip.blue { color:#fff; background:#3ea6ff; }
.badge { position:absolute; top:-4px; right:-4px; background:#fff; color:#ef5350; font-size:10px; font-weight:700; border-radius:8px; min-width:16px; height:16px; display:flex; align-items:center; justify-content:center; }

.weather { right:18px; bottom:14px; gap:10px; cursor:pointer; text-shadow:0 1px 8px rgba(0,0,0,.6); align-items:flex-end; }
.weather .big { font-size:44px; font-weight:250; line-height:.9; letter-spacing:-1px; }
.weather .big sup { font-size:20px; vertical-align:top; position:relative; top:4px; }
.weather .desc { display:flex; flex-direction:column; gap:2px; font-size:11px; padding-bottom:2px; }
.weather .desc b { font-size:13px; font-weight:600; }
.weather .desc span { opacity:.8; }

@media (max-width: 600px) {
  .top { top:62px; left:14px; right:14px; transform:none; justify-content:center; }
  .pill { padding-left:12px; }
  .who .s { display:none; }
  .weather { right:14px; bottom:64px; }
  .vbar { bottom:120px; max-width:calc(100% - 28px); }
  .weather .big { font-size:34px; }
}
`;

if (!customElements.get('floorplan-3d-card')) {
  customElements.define('floorplan-3d-card', Floorplan3DCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'floorplan-3d-card',
    name: 'Floorplan 3D',
    description: 'Live 3D model of the house with lights, sensors and weather.',
    preview: false,
  });
  console.info(`%c FLOORPLAN-3D-CARD %c ${VERSION} `, 'background:#ffb938;color:#000;font-weight:700', 'background:#222;color:#fff');
}
