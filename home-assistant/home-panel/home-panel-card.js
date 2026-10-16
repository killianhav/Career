/*
 * home-panel-card — a one-screen wall-tablet home page for Home Assistant.
 *
 * Editorial "paper" look: cream cards, serif numerals, small-caps labels. Automatically switches to
 * a dark palette after sunset (or tap the half-moon button). Everything is live from hass.
 *
 *   type: custom:home-panel-card      # put it in a panel view
 *   # every entity below is optional and overridable – defaults match this house
 */

const VERSION = '1.0.0';
const ICON = {
  sunny: "M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",
  night: "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",
  partly: "M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",
  partlyNight: "M22,10.28C21.74,10.3 21.5,10.31 21.26,10.31C19.32,10.31 17.39,9.57 15.91,8.09C14.25,6.44 13.5,4.19 13.72,2C13.77,1.53 13.22,1 12.71,1C12.57,1 12.44,1.04 12.32,1.12C12,1.36 11.66,1.64 11.36,1.94C9.05,4.24 8.55,7.66 9.84,10.46C8.31,11.11 7.13,12.43 6.69,14.06L6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22H19A3,3 0 0,0 22,19A3,3 0 0,0 19,16C18.42,16 17.88,16.16 17.42,16.45L17.5,15.5C17.5,15.28 17.5,15.05 17.46,14.83C19.14,14.67 20.77,13.94 22.06,12.64C22.38,12.34 22.64,12 22.88,11.68C23.27,11.13 22.65,10.28 22.04,10.28M19,18A1,1 0 0,1 20,19A1,1 0 0,1 19,20H6A2,2 0 0,1 4,18A2,2 0 0,1 6,16H8.5V15.5C8.5,13.94 9.53,12.64 10.94,12.18C11.1,12.13 11.26,12.09 11.43,12.06C11.61,12.03 11.8,12 12,12C12.23,12 12.45,12.03 12.66,12.07C12.73,12.08 12.8,12.1 12.87,12.13C13,12.16 13.15,12.2 13.28,12.25C13.36,12.28 13.44,12.32 13.5,12.36C13.63,12.41 13.74,12.47 13.84,12.54C13.92,12.59 14,12.64 14.07,12.7C14.17,12.77 14.25,12.84 14.34,12.92C14.41,13 14.5,13.05 14.55,13.12C14.63,13.2 14.69,13.29 14.76,13.37C14.82,13.45 14.89,13.53 14.94,13.62C15,13.71 15.04,13.8 15.09,13.9C15.14,14 15.2,14.08 15.24,14.18C15.41,14.59 15.5,15.03 15.5,15.5V18M16.83,12.86C15.9,11.16 14.08,10 12,10H11.87C11.41,9.19 11.14,8.26 11.14,7.29C11.14,6.31 11.39,5.37 11.86,4.55C12.21,6.41 13.12,8.14 14.5,9.5C15.86,10.88 17.58,11.79 19.45,12.14C18.66,12.6 17.76,12.84 16.83,12.86Z",
  cloudy: "M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",
  rainy: "M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",
  pouring: "M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z",
  snowy: "M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z",
  sleet: "M18.5,18.67C18.5,19.96 17.5,21 16.25,21C15,21 14,19.96 14,18.67C14,17.12 16.25,14.5 16.25,14.5C16.25,14.5 18.5,17.12 18.5,18.67M4,17.36C3.86,16.82 4.18,16.25 4.73,16.11L7,15.5L5.33,13.86C4.93,13.46 4.93,12.81 5.33,12.4C5.73,12 6.4,12 6.79,12.4L8.45,14.05L9.04,11.8C9.18,11.24 9.75,10.92 10.29,11.07C10.85,11.21 11.17,11.78 11,12.33L10.42,14.58L12.67,14C13.22,13.83 13.79,14.15 13.93,14.71C14.08,15.25 13.76,15.82 13.2,15.96L10.95,16.55L12.6,18.21C13,18.6 13,19.27 12.6,19.67C12.2,20.07 11.54,20.07 11.15,19.67L9.5,18L8.89,20.27C8.75,20.83 8.18,21.14 7.64,21C7.08,20.86 6.77,20.29 6.91,19.74L7.5,17.5L5.26,18.09C4.71,18.23 4.14,17.92 4,17.36M1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,11.85 3.35,12.61 3.91,13.16C4.27,13.55 4.26,14.16 3.88,14.54C3.5,14.93 2.85,14.93 2.47,14.54C1.56,13.63 1,12.38 1,11Z",
  fog: "M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",
  lightning: "M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z",
  storm: "M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z",
  windy: "M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",
  hail: "M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z",
  wifi: "M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",
  wifiOff: "M2.28,3L1,4.27L2.47,5.74C2.04,6 1.61,6.29 1.2,6.6L3,9C3.53,8.6 4.08,8.25 4.66,7.93L6.89,10.16C6.15,10.5 5.44,10.91 4.8,11.4L6.6,13.8C7.38,13.22 8.26,12.77 9.2,12.47L11.75,15C10.5,15.07 9.34,15.5 8.4,16.2L12,21L14.46,17.73L17.74,21L19,19.72M12,3C9.85,3 7.8,3.38 5.9,4.07L8.29,6.47C9.5,6.16 10.72,6 12,6C15.38,6 18.5,7.11 21,9L22.8,6.6C19.79,4.34 16.06,3 12,3M12,9C11.62,9 11.25,9 10.88,9.05L14.07,12.25C15.29,12.53 16.43,13.07 17.4,13.8L19.2,11.4C17.2,9.89 14.7,9 12,9Z",
  calendar: "M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.11 3.9 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.9 20.11 3 19 3M19 19H5V9H19V19M19 7H5V5H19V7Z",
  home: "M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22",
  thermo: "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z",
  fire: "M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z",
  bulb: "M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z",
  bulbOn: "M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z",
  blinds: "M20 19V3H4V19H2V21H22V19H20M16 9H18V11H16V9M14 11H6V9H14V11M18 7H16V5H18V7M14 5V7H6V5H14M6 19V13H14V14.82C13.55 15.14 13.25 15.66 13.25 16.25C13.25 17.22 14.03 18 15 18S16.75 17.22 16.75 16.25C16.75 15.66 16.45 15.13 16 14.82V13H18V19H6Z",
  cctv: "M6.03 12.03L8.03 15.5L5.5 18.68L2 12.62L6.03 12.03M17 18V15.29C17.88 14.9 18.5 14.03 18.5 13C18.5 12.43 18.3 11.9 17.97 11.5L19.94 10.35C20.95 9.76 21.3 8.47 20.71 7.46L19.33 5.06C18.74 4.05 17.45 3.7 16.44 4.28L8.31 9C7.36 9.53 7.03 10.75 7.58 11.71L9.08 14.31C9.63 15.26 10.86 15.59 11.81 15.04L13.69 13.96C13.94 14.55 14.41 15.03 15 15.29V18C15 19.1 15.9 20 17 20H22V18H17Z",
  door: "M16,11H18V13H16V11M12,3H19C20.11,3 21,3.89 21,5V19H22V21H2V19H10V5C10,3.89 10.89,3 12,3M12,5V19H19V5H12Z",
  doorOpen: "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z",
  trash: "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z",
  vacuum: "M12,2C14.65,2 17.19,3.06 19.07,4.93L17.65,6.35C16.15,4.85 14.12,4 12,4C9.88,4 7.84,4.84 6.35,6.35L4.93,4.93C6.81,3.06 9.35,2 12,2M3.66,6.5L5.11,7.94C4.39,9.17 4,10.57 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,10.57 19.61,9.17 18.88,7.94L20.34,6.5C21.42,8.12 22,10.04 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12C2,10.04 2.58,8.12 3.66,6.5M12,6A6,6 0 0,1 18,12C18,13.59 17.37,15.12 16.24,16.24L14.83,14.83C14.08,15.58 13.06,16 12,16C10.94,16 9.92,15.58 9.17,14.83L7.76,16.24C6.63,15.12 6,13.59 6,12A6,6 0 0,1 12,6M12,8A1,1 0 0,0 11,9A1,1 0 0,0 12,10A1,1 0 0,0 13,9A1,1 0 0,0 12,8Z",
  shield: "M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9",
  shieldAlert: "M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21M11,7H13V13H11V7M11,15H13V17H11V15Z",
  contrast: "M7.5,2C5.71,3.15 4.5,5.18 4.5,7.5C4.5,9.82 5.71,11.85 7.53,13C4.46,13 2,10.54 2,7.5A5.5,5.5 0 0,1 7.5,2M19.07,3.5L20.5,4.93L4.93,20.5L3.5,19.07L19.07,3.5M12.89,5.93L11.41,5L9.97,6L10.39,4.3L9,3.24L10.75,3.12L11.33,1.47L12,3.1L13.73,3.13L12.38,4.26L12.89,5.93M9.59,9.54L8.43,8.81L7.31,9.59L7.65,8.27L6.56,7.44L7.92,7.35L8.37,6.06L8.88,7.33L10.24,7.36L9.19,8.23L9.59,9.54M19,13.5A5.5,5.5 0 0,1 13.5,19C12.28,19 11.15,18.6 10.24,17.93L17.93,10.24C18.6,11.15 19,12.28 19,13.5M14.6,20.08L17.37,18.93L17.13,22.28L14.6,20.08M18.93,17.38L20.08,14.61L22.28,17.15L18.93,17.38M20.08,12.42L18.94,9.64L22.28,9.88L20.08,12.42M9.63,18.93L12.4,20.08L9.87,22.27L9.63,18.93Z",
  play: "M8,5.14V19.14L19,12.14L8,5.14Z",
  pause: "M14,19H18V5H14M6,19H10V5H6V19Z",
  dock: "M15 13L11 17V14H2V12H11V9L15 13M5 20V16H7V18H17V10.19L12 5.69L7.21 10H4.22L12 3L22 12H19V20H5Z",
  plus: "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",
  minus: "M19,13H5V11H19V13Z",
  chevron: "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",
  sunset: "M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,20.71L15.82,17.6C16.21,17.21 16.21,16.57 15.82,16.18C15.43,15.79 14.8,15.79 14.41,16.18L12,18.59L9.59,16.18C9.2,15.79 8.57,15.79 8.18,16.18C7.79,16.57 7.79,17.21 8.18,17.6L11.29,20.71C11.5,20.9 11.74,21 12,21C12.26,21 12.5,20.9 12.71,20.71Z",
  sunrise: "M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,16.3L15.82,19.41C16.21,19.8 16.21,20.43 15.82,20.82C15.43,21.21 14.8,21.21 14.41,20.82L12,18.41L9.59,20.82C9.2,21.21 8.57,21.21 8.18,20.82C7.79,20.43 7.79,19.8 8.18,19.41L11.29,16.3C11.5,16.1 11.74,16 12,16C12.26,16 12.5,16.1 12.71,16.3Z",
  drop: "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z",
  wind: "M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",
  uv: "M11 6C13.76 6 16 8.24 16 11S13.76 16 11 16 6 13.76 6 11 8.24 6 11 6M11 1L13.39 4.42C12.65 4.15 11.84 4 11 4S9.35 4.15 8.61 4.42L11 1M2.34 6L6.5 5.65C5.9 6.16 5.36 6.78 4.94 7.5C4.5 8.24 4.25 9 4.11 9.79L2.34 6M2.36 16L4.12 12.23C4.26 13 4.53 13.78 4.95 14.5C5.37 15.24 5.91 15.86 6.5 16.37L2.36 16M19.65 6L17.88 9.79C17.74 9 17.47 8.23 17.05 7.5C16.63 6.78 16.1 6.15 15.5 5.64L19.65 6M23 13H21C21 15.05 20.22 17.1 18.66 18.66C17.09 20.23 15.05 21 13 21V23C15.56 23 18.12 22 20.07 20.07S23 15.56 23 13M19 13H17C17 14 16.61 15.05 15.83 15.83C15.05 16.61 14 17 13 17V19C14.54 19 16.08 18.41 17.25 17.24C18.41 16.08 19 14.54 19 13",
  tree: "M10.5,3C8,3 6,5 6,7.5C6,8.11 6.13,8.71 6.37,9.27C5.5,10.12 5,11.28 5,12.5C5,15 7,17 9.5,17C10,17 10.5,16.89 11,16.72V21H13V15.77C13.5,15.91 14,16 14.5,16A5.5,5.5 0 0,0 20,10.5A5.5,5.5 0 0,0 14.5,5C14.41,5 14.33,5 14.24,5C13.41,3.76 12,3 10.5,3M10.5,5C11.82,5 12.91,6.03 13,7.35C13.46,7.12 14,7 14.5,7A3.5,3.5 0 0,1 18,10.5A3.5,3.5 0 0,1 14.5,14C13.54,14 12.63,13.61 11.96,12.91C11.76,14.12 10.72,15 9.5,15A2.5,2.5 0 0,1 7,12.5C7,11.12 7.8,10.54 9,9.79C8.2,8.76 8,8.16 8,7.5A2.5,2.5 0 0,1 10.5,5Z",
  close: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
  power: "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13",
  gas: "M16.14 8.79L16.12 8.8C16.35 9.07 16.55 9.39 16.7 9.72L16.79 9.91C17.5 11.6 17 13.55 15.69 14.77C14.5 15.86 12.84 16.15 11.3 15.95C9.84 15.77 8.5 14.85 7.73 13.58C7.5 13.19 7.3 12.75 7.2 12.3C7.07 11.93 7.03 11.57 7 11.2C6.91 9.6 7.55 7.9 8.76 6.9C8.21 8.11 8.34 9.62 9.15 10.67L9.26 10.8C9.4 10.92 9.57 10.96 9.73 10.89C9.88 10.83 10 10.68 10 10.5L9.93 10.28C9.05 7.96 9.79 5.25 11.66 3.72C12.17 3.3 12.8 2.92 13.46 2.75C12.78 4.11 13 5.89 14.09 6.96C14.55 7.43 15.1 7.74 15.58 8.18L16.14 8.79M13.86 13.43L13.85 13.42C14.3 13.03 14.55 12.36 14.53 11.76L14.5 11.44C14.3 10.44 13.43 10.11 12.87 9.38C12.7 9.16 12.55 8.88 12.44 8.6C12.22 9.1 12.2 9.57 12.29 10.11C12.39 10.68 12.62 11.17 12.5 11.76C12.34 12.41 11.83 13.06 10.94 13.27C11.44 13.76 12.25 14.15 13.06 13.87C13.32 13.8 13.65 13.61 13.86 13.43M11 18V19C11 19.55 11.45 20 12 20C12.55 20 13 19.55 13 19V18H15V19C15 19.55 15.45 20 16 20C16.55 20 17 19.55 17 19V18C18.11 18 20 18.9 20 20V22H4V20C4 18.9 5.9 18 7 18V19C7 19.55 7.45 20 8 20C8.55 20 9 19.55 9 19V18H11Z",
  update: "M20.54,5.23C20.83,5.57 21,6 21,6.5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V6.5C3,6 3.17,5.57 3.46,5.23L4.84,3.55C5.12,3.21 5.53,3 6,3H18C18.47,3 18.88,3.21 19.15,3.55L20.54,5.23M5.12,5H18.87L17.93,4H5.93L5.12,5M12,9.5L6.5,15H10V17H14V15H17.5L12,9.5Z",
  backup: "M12,3A9,9 0 0,0 3,12H0L4,16L8,12H5A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19C10.5,19 9.09,18.5 7.94,17.7L6.5,19.14C8.04,20.3 9.94,21 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M14,12A2,2 0 0,0 12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12Z",
  doorbell: "M14 15C14 16.11 13.11 17 12 17S10 16.11 10 15 10.9 13 12 13 14 13.9 14 15M18 4V20C18 21.1 17.11 22 16 22H8C6.9 22 6 21.11 6 20V4C6 2.9 6.9 2 8 2H16C17.11 2 18 2.9 18 4M10.5 7C10.5 7.83 11.17 8.5 12 8.5S13.5 7.83 13.5 7 12.83 5.5 12 5.5 10.5 6.17 10.5 7M16 10H8V20H16V10Z",
  check: "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z",
  alert: "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",
};
const svg = (d, cls = '') => `<svg viewBox="0 0 24 24" class="${cls}"><path d="${d}"/></svg>`;

const QUOTES = [
  ['Take away thy opinion, and then there is taken away the complaint, “I have been harmed.”', 'Marcus Aurelius · Meditations IV.7'],
  ['We suffer more often in imagination than in reality.', 'Seneca · Letters to Lucilius 13'],
  ['The happiness of your life depends upon the quality of your thoughts.', 'Marcus Aurelius · Meditations V.16'],
  ['It is not the man who has too little, but the man who craves more, that is poor.', 'Seneca · Letters 2'],
  ['First say to yourself what you would be; and then do what you have to do.', 'Epictetus · Discourses III.23'],
  ['Waste no more time arguing about what a good man should be. Be one.', 'Marcus Aurelius · Meditations X.16'],
  ['Luck is what happens when preparation meets opportunity.', 'Seneca'],
  ['No man is free who is not master of himself.', 'Epictetus · Fragments'],
  ['Very little is needed to make a happy life.', 'Marcus Aurelius · Meditations VII.67'],
  ['While we are postponing, life speeds by.', 'Seneca · Letters 1'],
  ['Wealth consists not in having great possessions, but in having few wants.', 'Epictetus'],
  ['The best revenge is not to be like your enemy.', 'Marcus Aurelius · Meditations VI.6'],
  ['Difficulties strengthen the mind, as labour does the body.', 'Seneca'],
  ['Don’t explain your philosophy. Embody it.', 'Epictetus'],
  ['You have power over your mind – not outside events. Realise this, and you will find strength.', 'Marcus Aurelius'],
  ['Begin at once to live, and count each separate day as a separate life.', 'Seneca · Letters 101'],
  ['Make the best use of what is in your power, and take the rest as it happens.', 'Epictetus · Enchiridion'],
  ['Dwell on the beauty of life. Watch the stars, and see yourself running with them.', 'Marcus Aurelius · Meditations VII.47'],
  ['Every new beginning comes from some other beginning’s end.', 'Seneca'],
  ['He who laughs at himself never runs out of things to laugh at.', 'Epictetus'],
  ['The impediment to action advances action. What stands in the way becomes the way.', 'Marcus Aurelius · Meditations V.20'],
];

const COND = {
  'clear-night': ['Clear', 'night'], cloudy: ['Cloudy', 'cloudy'], exceptional: ['Exceptional', 'alert'], fog: ['Fog', 'fog'],
  hail: ['Hail', 'hail'], lightning: ['Lightning', 'lightning'], 'lightning-rainy': ['Thunderstorms', 'storm'],
  partlycloudy: ['Partly cloudy', 'partly'], pouring: ['Pouring', 'pouring'], rainy: ['Rain', 'rainy'], snowy: ['Snow', 'snowy'],
  'snowy-rainy': ['Sleet', 'sleet'], sunny: ['Sunny', 'sunny'], windy: ['Windy', 'windy'], 'windy-variant': ['Windy', 'windy'],
};

const DEFAULTS = {
  persons: ['person.killian', 'person.sinead'],
  weather: 'weather.forecast_home',
  sun: 'sun.sun',
  alarm: 'alarm_control_panel.laverna_alarm',
  internet: 'binary_sensor.m4r_wan_status',
  backup: 'sensor.backup_last_successful_automatic_backup',
  gas_cost: 'sensor.estimated_daily_gas_cost',
  bins_calendar: 'calendar.bins',
  vacuum: 'vacuum.l40s_pro_ultra',
  vacuum_map: 'camera.l40s_pro_ultra_map',
  climate: 'climate.kitchen_kitchen_thermostat',
  bedroom_temp: 'sensor.temp_sensor_temperature',
  bedroom_humidity: 'sensor.temp_sensor_humidity',
  doorbell: 'binary_sensor.doorbell_visitor',
  doorbell_camera: 'camera.doorbell_fluent',
  cameras: [
    { entity: 'camera.doorbell_fluent', name: 'Front door', motion: ['binary_sensor.doorbell_person', 'binary_sensor.doorbell_motion'] },
    { entity: 'camera.cabin_cam_live_view', name: 'Cabin', motion: ['binary_sensor.cabin_cam_motion'] },
    { entity: 'camera.l40s_pro_ultra_map', name: 'Vacuum map' },
  ],
  contacts: [
    'binary_sensor.back_door', 'binary_sensor.front_door', 'binary_sensor.side_door', 'binary_sensor.front_window_left',
    'binary_sensor.front_window_right', 'binary_sensor.back_window', 'binary_sensor.back_window_bedroom',
    'binary_sensor.office_window', 'binary_sensor.spare_room_window',
  ],
  lights: [
    { name: 'Living room', entity: 'light.lamp' },
    { name: 'Kitchen', entity: 'light.kitchen_driver' },
    { name: 'Hallway', entity: 'light.hallway_lamp' },
    { name: 'Bedroom', entity: 'light.ikea_of_sweden_tradfri_bulb_e27_ws_clear_806lm' },
    { name: 'Landing', entity: 'light.landing_2' },
  ],
  all_off_target: { floor_id: ['ground_floor', 'upstair'] },
  blinds: [
    { name: 'Living', entity: 'cover.blind_2' },
    { name: 'Bedroom', entity: 'cover.blind_4' },
    { name: 'Office', entity: 'cover.blind_1' },
    { name: 'Spare', entity: 'cover.blind_3' },
  ],
  cabin_doors: [
    { name: 'Cabin door', entity: 'binary_sensor.front_door' },
    { name: 'Shed door', entity: 'binary_sensor.side_door' },
  ],
  cabin_lights: [
    { name: 'Wall lights', entity: ['light.left_up_cabin_light', 'light.left_down_cabin_light', 'light.right_up_cabin_light', 'light.right_down_cabin_light'] },
    { name: 'Shed', entity: 'light.shed_light_3' },
    { name: 'LEDs', entity: 'light.cabin_shed_leds_shed_led_strip' },
    { name: 'Floodlight', entity: 'light.cabin_cam_light' },
  ],
  camera_refresh: 10,
};

const BIN_COLOURS = { black: '#2d2d2d', green: '#4f8a4b', brown: '#8a5a3b', blue: '#3c6fb0', grey: '#8d8d8d' };

const arr = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const na = (s) => !s || s.state === 'unavailable' || s.state === 'unknown';
const num = (v, d = 0) => (v == null || v === '' || isNaN(Number(v)) ? '–' : Number(v).toFixed(d));

function ago(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

class HomePanelCard extends HTMLElement {
  setConfig(config) {
    this._config = { ...DEFAULTS, ...config };
    this._rendered = {};
    if (this._root) this._build();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (!this._root) {
      this._root = this.attachShadow({ mode: 'open' });
      this._build();
    }
    if (first) this._fetchAll();
    this._schedule();
  }

  getCardSize() {
    return 12;
  }

  connectedCallback() {
    this._tick = setInterval(() => this._schedule(true), 1000);
    this._camTimer = setInterval(() => this._refreshCameras(), (this._config?.camera_refresh || 10) * 1000);
    this._dataTimer = setInterval(() => this._fetchAll(), 15 * 60 * 1000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    clearInterval(this._camTimer);
    clearInterval(this._dataTimer);
  }

  /* ---------- data fetched by service call ---------- */
  async _fetchAll() {
    const h = this._hass, c = this._config;
    if (!h) return;
    const call = (domain, service, data, target) => h.callService(domain, service, data, target, false, true).then((r) => r?.response);
    try {
      const r = await call('weather', 'get_forecasts', { type: 'hourly' }, { entity_id: c.weather });
      this._hourly = r?.[c.weather]?.forecast || [];
    } catch (e) { /* weather provider may not support hourly */ }
    try {
      const r = await call('weather', 'get_forecasts', { type: 'daily' }, { entity_id: c.weather });
      this._daily = r?.[c.weather]?.forecast || [];
    } catch (e) { /* ignore */ }
    if (c.bins_calendar) {
      try {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date(start.getTime() + 35 * 86400000);
        const r = await call('calendar', 'get_events', { start_date_time: start.toISOString(), end_date_time: end.toISOString() }, { entity_id: c.bins_calendar });
        this._bins = (r?.[c.bins_calendar]?.events || []).sort((a, b) => String(a.start).localeCompare(String(b.start)));
      } catch (e) {
        this._bins = null;
      }
    }
    this._schedule(true);
  }

  /* ---------- render plumbing ---------- */
  _schedule(force) {
    if (this._pending && !force) return;
    this._pending = true;
    requestAnimationFrame(() => {
      this._pending = false;
      this._render();
    });
  }

  _build() {
    this._root.innerHTML = `<style>${STYLE}</style>
      <div class="wrap">
        <header class="top" data-part="top"></header>
        <main class="grid">
          <div class="col">
            <section class="card" data-part="systems"></section>
            <section class="card" data-part="bins"></section>
            <section class="card grow" data-part="home"></section>
          </div>
          <div class="col">
            <section class="card" data-part="today"></section>
            <section class="card" data-part="climate"></section>
            <section class="card grow" data-part="lights"></section>
          </div>
          <div class="col">
            <section class="card" data-part="cameras">
              <div class="hd"><span class="lbl">${svg(ICON.cctv)}Cameras</span><span class="pill" data-cam-pill></span></div>
              <div class="cams" data-cams></div>
            </section>
            <section class="card grow" data-part="cabin"></section>
          </div>
        </main>
        <div class="ring hidden" data-part="ring"></div>
      </div>`;
    this._wrap = this._root.querySelector('.wrap');
    this._rendered = {};
    this._buildCameras();
    this._root.addEventListener('click', (e) => this._onClick(e));
    // fonts live in the document so they work inside the shadow root
    if (!document.getElementById('home-panel-fonts')) {
      const l = document.createElement('link');
      l.id = 'home-panel-fonts';
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@400;500;600&display=swap';
      document.head.appendChild(l);
    }
  }

  _buildCameras() {
    const box = this._root.querySelector('[data-cams]');
    box.innerHTML = this._config.cameras
      .map((c, i) => `<button class="cam ${i === 0 ? 'wide' : ''}" data-act="more" data-entity="${c.entity}">
        <img alt="" data-cam="${c.entity}"><span class="cap">${esc(c.name)}</span><span class="dot" data-cam-dot="${i}"></span></button>`)
      .join('');
    this._refreshCameras();
  }

  _refreshCameras() {
    const h = this._hass;
    if (!h || !this._root) return;
    this._root.querySelectorAll('img[data-cam]').forEach((img) => {
      const st = h.states[img.dataset.cam];
      const token = st?.attributes?.access_token;
      if (!token) return;
      const url = `/api/camera_proxy/${img.dataset.cam}?token=${token}&t=${Date.now()}`;
      const pre = new Image();
      pre.onload = () => (img.src = url);
      pre.src = url;
    });
  }

  _set(part, html) {
    if (this._rendered[part] === html) return;
    this._rendered[part] = html;
    const el = this._root.querySelector(`[data-part="${part}"]`);
    if (el) el.innerHTML = html;
  }

  _render() {
    const h = this._hass;
    if (!h || !this._root) return;
    this._applyTheme();
    this._set('top', this._top());
    this._set('systems', this._systems());
    this._set('bins', this._binsCard());
    this._set('home', this._home());
    this._set('today', this._today());
    this._set('climate', this._climate());
    this._set('lights', this._lights());
    this._set('cabin', this._cabin());
    this._cameraStatus();
    this._doorbell();
  }

  _applyTheme() {
    let mode = null;
    try {
      mode = localStorage.getItem('home-panel-theme');
    } catch (e) { /* storage blocked */ }
    const sun = this._hass.states[this._config.sun];
    const dark = mode ? mode === 'dark' : sun?.state === 'below_horizon';
    this._wrap.classList.toggle('dark', dark);
  }

  /* ---------- sections ---------- */
  _top() {
    const h = this._hass, c = this._config, S = h.states;
    const now = new Date();
    const day = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const [q, who] = QUOTES[day % QUOTES.length];
    const avatars = arr(c.persons).map((p) => {
      const s = S[p];
      if (!s) return '';
      const pic = s.attributes.entity_picture;
      const name = s.attributes.friendly_name || p;
      return `<button class="av ${s.state === 'home' ? 'home' : 'away'}" data-act="more" data-entity="${p}" title="${esc(name)}">
        ${pic ? `<img src="${pic}" alt="">` : `<b>${esc(name[0])}</b>`}<i></i></button>`;
    }).join('');
    const status = this._securityStatus();
    const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
    return `<div class="quote"><p>“${esc(q.replace(/^“|”$/g, ''))}”</p><span>${esc(who)}</span></div>
      <div class="right">
        <div class="avs">${avatars}</div>
        <button class="pill big ${status.cls}" data-act="${status.act}" data-entity="${status.entity || ''}">${status.html}</button>
        <button class="iconbtn" data-act="theme" title="Day / night">${svg(ICON.contrast)}</button>
        <div class="clock"><b>${time}</b><span>${date}</span></div>
      </div>`;
  }

  _securityStatus() {
    const S = this._hass.states, c = this._config;
    const open = arr(c.contacts).filter((e) => S[e]?.state === 'on');
    const al = S[c.alarm];
    if (al?.state === 'triggered') return { cls: 'bad', html: `${svg(ICON.shieldAlert)}Alarm triggered`, act: 'more', entity: c.alarm };
    if (open.length) {
      const names = open.map((e) => S[e].attributes.friendly_name || e);
      return { cls: 'warn', html: `<i class="d"></i>${open.length === 1 ? esc(names[0]) + ' open' : `${open.length} open`}`, act: 'more', entity: open[0] };
    }
    if (al && al.state.startsWith('armed')) return { cls: 'ok', html: `${svg(ICON.shield)}Armed · ${esc(al.state.replace('armed_', ''))}`, act: 'more', entity: c.alarm };
    return { cls: 'ok', html: '<i class="d"></i>All clear', act: 'more', entity: c.alarm };
  }

  _systems() {
    const S = this._hass.states, c = this._config;
    const net = S[c.internet];
    const up = net?.state === 'on';
    const updates = Object.values(S).filter((s) => s.entity_id.startsWith('update.') && s.state === 'on');
    const lightsOn = Object.values(S).filter((s) => s.entity_id.startsWith('light.') && s.state === 'on' && this._isHouseLight(s.entity_id)).length;
    const gas = S[c.gas_cost];
    const bk = S[c.backup];
    const bkText = na(bk) ? 'Never' : new Date(bk.state).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const tile = (k, v, sub, extra = '') => `<div class="tile ${extra}"><span>${k}</span><b>${v}</b><small>${sub}</small></div>`;
    return `<div class="hd"><span class="lbl">${svg(up ? ICON.wifi : ICON.wifiOff)}Systems</span>
        <span class="pill ${up ? 'ok' : 'bad'}"><i class="d"></i>${up ? 'Internet up' : 'Internet down'}</span></div>
      <div class="tiles">
        ${tile('Lights on', lightsOn, lightsOn === 1 ? 'light' : 'lights')}
        ${tile('Gas today', na(gas) ? '–' : `€${num(gas.state, 2)}`, 'estimated')}
        <button class="tile ${updates.length ? 'attn' : ''}" data-act="nav" data-path="/config/updates"><span>Updates</span><b>${updates.length}</b><small>${updates.length ? 'waiting' : 'up to date'}</small></button>
        <button class="tile ${na(bk) ? 'attn' : ''}" data-act="nav" data-path="/config/backup"><span>Last backup</span><b>${bkText}</b><small>${na(bk) ? 'set up backups' : 'automatic'}</small></button>
      </div>`;
  }

  _isHouseLight(id) {
    const c = this._config;
    const ids = [...c.lights.flatMap((l) => arr(l.entity)), ...c.cabin_lights.flatMap((l) => arr(l.entity))];
    return ids.includes(id);
  }

  _binsCard() {
    const ev = this._bins;
    const hd = `<div class="hd"><span class="lbl">${svg(ICON.calendar)}Coming up</span><span class="muted">Bins</span></div>`;
    if (!ev) return `${hd}<p class="muted pad">Loading collections…</p>`;
    if (!ev.length) return `${hd}<p class="muted pad">No collections in the next few weeks.</p>`;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rows = ev.slice(0, 2).map((e, i) => {
      const d = new Date(`${String(e.start).slice(0, 10)}T00:00:00`);
      const days = Math.round((d - today) / 86400000);
      const when = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      const bins = Object.keys(BIN_COLOURS).filter((k) => e.summary.toLowerCase().includes(k));
      const icons = bins.map((b) => `<i class="bin" style="--c:${BIN_COLOURS[b]}">${svg(ICON.trash)}</i>`).join('');
      const label = bins.length ? bins.map((b) => b[0].toUpperCase() + b.slice(1)).join(' + ') : esc(e.summary);
      const hint = days === 1 ? '<em>Put out tonight</em>' : days === 0 ? '<em>Collection today</em>' : `in ${days} days`;
      return `<div class="binrow ${i === 0 ? 'next' : ''} ${days <= 1 ? 'soon' : ''}">
        <div class="bins">${icons}</div>
        <div class="bt"><b>${label}</b><small>${when} · ${hint}</small></div></div>`;
    }).join('');
    return `${hd}${rows}`;
  }

  _home() {
    const S = this._hass.states, c = this._config;
    const v = S[c.vacuum];
    let vac = '';
    if (v) {
      const a = v.attributes;
      const map = S[c.vacuum_map]?.attributes;
      const rooms = map?.rooms ? Object.keys(map.rooms).length : 0;
      const done = arr(a.completed_segments).length;
      const running = ['cleaning', 'returning'].includes(v.state);
      const label = { cleaning: 'Cleaning', returning: 'Heading home', docked: a.drying ? 'Drying mop' : 'Docked', paused: 'Paused', idle: 'Idle', error: 'Needs attention' }[v.state] || v.state;
      const batt = a.battery ?? a.battery_level;
      const dots = rooms ? Array.from({ length: rooms }, (_, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('') : '';
      vac = `<div class="vac">
        <button class="vi" data-act="more" data-entity="${c.vacuum}">${svg(ICON.vacuum)}</button>
        <div class="vt"><b>Dreame <small>${batt != null ? `${batt}%` : ''}</small></b><small>${label}${running && rooms ? ` · ${done}/${rooms} rooms` : ''}</small>
          ${running && rooms ? `<span class="dots">${dots}</span>` : ''}</div>
        <button class="iconbtn sm" data-act="call" data-svc="vacuum.${v.state === 'cleaning' ? 'pause' : 'start'}" data-entity="${c.vacuum}" title="${v.state === 'cleaning' ? 'Pause' : 'Start'}">${svg(v.state === 'cleaning' ? ICON.pause : ICON.play)}</button>
        <button class="iconbtn sm" data-act="call" data-svc="vacuum.return_to_base" data-entity="${c.vacuum}" title="Dock">${svg(ICON.dock)}</button>
      </div>`;
    }
    const al = S[c.alarm];
    const alarmTxt = al ? ({ disarmed: 'Alarm off', armed_home: 'Armed – home', armed_away: 'Armed – away', armed_night: 'Armed – night', triggered: 'Alarm triggered', pending: 'Arming…', arming: 'Arming…' }[al.state] || al.state) : '';
    const modes = [['disarmed', 'Off'], ['armed_home', 'Home'], ['armed_away', 'Away']];
    const alarm = al ? `<div class="alarm"><span class="muted">${svg(ICON.shield)}${alarmTxt}</span>
      <div class="seg">${modes.map(([m, t]) => `<button class="${al.state === m ? 'on' : ''}" data-act="alarm" data-mode="${m}">${t}</button>`).join('')}</div></div>` : '';
    const people = arr(c.persons).map((p) => {
      const s = S[p];
      if (!s) return '';
      const name = s.attributes.friendly_name || p;
      const home = s.state === 'home';
      const where = home ? 'Home' : s.state === 'not_home' ? 'Away' : s.state;
      const pic = s.attributes.entity_picture;
      return `<button class="person ${home ? 'home' : ''}" data-act="more" data-entity="${p}">
        <span class="av">${pic ? `<img src="${pic}" alt="">` : `<b>${esc(name[0])}</b>`}<i></i></span>
        <span><b>${esc(name)}</b><small>${esc(where)} · ${ago(s.last_changed).replace(' ago', '')}</small></span></button>`;
    }).join('');
    return `<div class="hd"><span class="lbl">${svg(ICON.home)}Home</span></div>${vac}${alarm}<div class="people">${people}</div>`;
  }

  _today() {
    const S = this._hass.states, c = this._config;
    const w = S[c.weather];
    if (!w) return '';
    const a = w.attributes;
    const sun = S[c.sun];
    const night = sun?.state === 'below_horizon';
    const [label, key] = COND[w.state] || [w.state, 'cloudy'];
    const icon = night && key === 'sunny' ? ICON.night : night && key === 'partly' ? ICON.partlyNight : ICON[key] || ICON.cloudy;
    const d0 = this._daily?.[0];
    const sunNext = sun ? (sun.state === 'above_horizon' ? ['Sunset', sun.attributes.next_setting] : ['Sunrise', sun.attributes.next_rising]) : null;
    const t = (iso) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const hours = (this._hourly || []).filter((f) => new Date(f.datetime) > Date.now() - 3600000).slice(0, 8);
    const strip = hours.map((f, i) => {
      const [, k] = COND[f.condition] || ['', 'cloudy'];
      const hr = new Date(f.datetime);
      const isNight = hr.getHours() < 7 || hr.getHours() > 19;
      const ic = isNight && k === 'sunny' ? ICON.night : isNight && k === 'partly' ? ICON.partlyNight : ICON[k] || ICON.cloudy;
      return `<div class="hr"><small>${i === 0 ? 'Now' : hr.toLocaleTimeString('en-GB', { hour: 'numeric' })}</small>${svg(ic, `wx ${k}`)}<b>${num(f.temperature)}°</b></div>`;
    }).join('');
    const unit = (a.wind_speed_unit || 'km/h').replace('km/h', 'km/h');
    return `<div class="hd"><span class="lbl">${svg(ICON.sunny)}Today</span>${sunNext ? `<span class="muted">${sunNext[0]} ${t(sunNext[1])}</span>` : ''}</div>
      <button class="now" data-act="more" data-entity="${c.weather}">
        ${svg(icon, `wxbig ${key}`)}
        <div><div class="temp">${num(a.temperature)}<sup>°</sup></div>
        <div class="cond">${label}</div>
        ${d0 ? `<small class="muted">High ${num(d0.temperature)}° · Low ${num(d0.templow ?? d0.temperature)}°</small>` : ''}</div>
      </button>
      <div class="facts"><span>Humidity <b>${num(a.humidity)}%</b></span><span>Wind <b>${num(a.wind_speed)}</b> ${unit}</span><span>UV <b>${num(a.uv_index, 1)}</b></span></div>
      ${strip ? `<div class="hours">${strip}</div>` : ''}`;
  }

  _climate() {
    const S = this._hass.states, c = this._config;
    const cl = S[c.climate];
    const bt = S[c.bedroom_temp], bh = S[c.bedroom_humidity];
    if (!cl) return '';
    const a = cl.attributes;
    const heating = a.hvac_action === 'heating';
    const off = cl.state === 'off';
    const status = off ? 'Off' : heating ? 'Heating' : 'Idle';
    return `<div class="hd"><span class="lbl">${svg(ICON.thermo)}Climate <span class="lbln">${num(a.current_temperature, 1)}° inside</span></span>
        <span class="pill ${heating ? 'heat' : off ? '' : 'ok'}"><i class="d"></i>${status}</span></div>
      <div class="zones">
        <div class="zone">
          <button class="zi ${heating ? 'heat' : ''}" data-act="more" data-entity="${c.climate}">${svg(ICON.fire)}</button>
          <div class="zt"><b>Downstairs</b><small>${off ? 'Heating off' : `Set to ${num(a.temperature, 1)}°`}</small></div>
          <div class="stepper">
            <button data-act="temp" data-delta="-0.5">${svg(ICON.minus)}</button>
            <span class="serif">${num(a.temperature, 1)}°</span>
            <button data-act="temp" data-delta="0.5">${svg(ICON.plus)}</button>
          </div>
        </div>
        ${bt ? `<button class="zone" data-act="more" data-entity="${c.bedroom_temp}">
          <span class="zi">${svg(ICON.thermo)}</span>
          <div class="zt"><b>Bedroom</b><small>${bh ? `Humidity ${num(bh.state)}%` : ''}</small></div>
          <span class="serif big">${num(bt.state, 1)}°</span></button>` : ''}
      </div>`;
  }

  _lights() {
    const S = this._hass.states, c = this._config;
    const chip = (l, kind) => {
      const ids = arr(l.entity);
      const sts = ids.map((i) => S[i]).filter(Boolean);
      if (!sts.length) return '';
      const unavailable = sts.every(na);
      let on, sub;
      if (kind === 'light') {
        on = sts.some((s) => s.state === 'on');
        const b = sts.find((s) => s.state === 'on')?.attributes?.brightness;
        sub = unavailable ? 'Unavailable' : on ? (b ? `${Math.round((b / 255) * 100)}%` : 'On') : 'Off';
      } else {
        on = sts[0].state === 'open';
        const p = sts[0].attributes.current_position;
        sub = unavailable ? 'Unavailable' : p != null ? `${p}% open` : sts[0].state;
      }
      return `<button class="chip ${on ? 'on' : ''} ${unavailable ? 'na' : ''} ${kind}" data-act="${kind === 'light' ? 'lights' : 'cover'}" data-entity="${ids.join(',')}">
        ${svg(kind === 'light' ? (on ? ICON.bulbOn : ICON.bulb) : ICON.blinds)}<span><b>${esc(l.name)}</b><small>${sub}</small></span></button>`;
    };
    const onCount = c.lights.flatMap((l) => arr(l.entity)).filter((i) => S[i]?.state === 'on').length;
    return `<div class="hd"><span class="lbl">${svg(ICON.bulb)}Lights <span class="lbln">· ${onCount ? `${onCount} on` : 'all off'}</span></span>
        <button class="pill btn" data-act="alloff">${svg(ICON.power)}All off</button></div>
      <div class="chips">${c.lights.map((l) => chip(l, 'light')).join('')}</div>
      <div class="sub">Blinds</div>
      <div class="chips four">${c.blinds.map((b) => chip(b, 'cover')).join('')}</div>`;
  }

  _cabin() {
    const S = this._hass.states, c = this._config;
    const doors = c.cabin_doors.map((d) => {
      const s = S[d.entity];
      const open = s?.state === 'on';
      return `<button class="door ${open ? 'open' : ''}" data-act="more" data-entity="${d.entity}">
        ${svg(open ? ICON.doorOpen : ICON.door)}<span><b>${esc(d.name)}</b><small>${na(s) ? 'Unavailable' : open ? `Open · ${ago(s.last_changed)}` : `Closed · ${ago(s.last_changed)}`}</small></span>
        <i class="tag">${open ? 'Open' : 'Closed'}</i></button>`;
    }).join('');
    const lights = c.cabin_lights.map((l) => {
      const ids = arr(l.entity);
      const on = ids.some((i) => S[i]?.state === 'on');
      return `<button class="mini ${on ? 'on' : ''}" data-act="lights" data-entity="${ids.join(',')}">${svg(on ? ICON.bulbOn : ICON.bulb)}${esc(l.name)}</button>`;
    }).join('');
    return `<div class="hd"><span class="lbl">${svg(ICON.tree)}Garden &amp; cabin</span></div>
      <div class="doors">${doors}</div><div class="minis">${lights}</div>`;
  }

  _cameraStatus() {
    const S = this._hass.states, c = this._config;
    let latest = null;
    c.cameras.forEach((cam, i) => {
      const active = arr(cam.motion).some((m) => S[m]?.state === 'on');
      const dot = this._root.querySelector(`[data-cam-dot="${i}"]`);
      if (dot) dot.classList.toggle('live', active);
      arr(cam.motion).forEach((m) => {
        const s = S[m];
        if (s && (!latest || s.last_changed > latest.s.last_changed)) latest = { s, cam };
      });
    });
    const pill = this._root.querySelector('[data-cam-pill]');
    let html, cls;
    if (latest && latest.s.state === 'on') {
      html = `<i class="d"></i>Motion · ${esc(latest.cam.name)}`;
      cls = 'pill warn';
    } else if (latest && Date.now() - new Date(latest.s.last_changed) < 3600000) {
      html = `${svg(ICON.check)}${esc(latest.cam.name)} · ${ago(latest.s.last_changed)}`;
      cls = 'pill';
    } else {
      html = `${svg(ICON.check)}No recent activity`;
      cls = 'pill ok';
    }
    if (pill && pill.innerHTML !== html) pill.innerHTML = html;
    if (pill) pill.className = cls;
  }

  _doorbell() {
    const S = this._hass.states, c = this._config;
    const ring = this._root.querySelector('[data-part="ring"]');
    const bell = S[c.doorbell];
    // open once per ring (a new last_changed), so closing it doesn't immediately reopen it
    if (bell?.state === 'on' && bell.last_changed !== this._ringKey) {
      this._ringKey = bell.last_changed;
      this._ringOpen = true;
      const tok = S[c.doorbell_camera]?.attributes?.access_token;
      ring.innerHTML = `<div class="ringbox"><div class="hd"><span class="lbl">${svg(ICON.doorbell)}Someone’s at the front door</span>
        <button class="iconbtn" data-act="closering">${svg(ICON.close)}</button></div>
        <img src="/api/camera_proxy_stream/${c.doorbell_camera}?token=${tok}" alt=""></div>`;
      ring.classList.remove('hidden');
      clearTimeout(this._ringTimer);
      this._ringTimer = setTimeout(() => this._closeRing(), 120000);
    }
  }

  _closeRing() {
    const ring = this._root.querySelector('[data-part="ring"]');
    ring.classList.add('hidden');
    ring.innerHTML = '';
    this._ringOpen = false;
  }

  /* ---------- interaction ---------- */
  _onClick(e) {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const h = this._hass, c = this._config;
    const act = el.dataset.act;
    const ids = (el.dataset.entity || '').split(',').filter(Boolean);
    const moreInfo = (entityId) => this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }));
    switch (act) {
      case 'more':
        if (ids[0]) moreInfo(ids[0]);
        break;
      case 'lights': {
        const anyOn = ids.some((i) => h.states[i]?.state === 'on');
        h.callService('homeassistant', anyOn ? 'turn_off' : 'turn_on', { entity_id: ids });
        break;
      }
      case 'cover':
        h.callService('cover', 'toggle', { entity_id: ids[0] });
        break;
      case 'alloff':
        if (confirm('Turn off all the lights in the house?')) h.callService('light', 'turn_off', {}, c.all_off_target);
        break;
      case 'temp': {
        const cl = h.states[c.climate];
        const t = Number(cl?.attributes?.temperature);
        if (!isNaN(t)) h.callService('climate', 'set_temperature', { entity_id: c.climate, temperature: t + Number(el.dataset.delta) });
        break;
      }
      case 'alarm': {
        const svc = { disarmed: 'alarm_disarm', armed_home: 'alarm_arm_home', armed_away: 'alarm_arm_away' }[el.dataset.mode];
        if (svc) h.callService('alarm_control_panel', svc, { entity_id: c.alarm });
        break;
      }
      case 'call': {
        const [d, s] = el.dataset.svc.split('.');
        h.callService(d, s, { entity_id: ids[0] });
        break;
      }
      case 'nav':
        history.pushState(null, '', el.dataset.path);
        window.dispatchEvent(new CustomEvent('location-changed'));
        break;
      case 'theme': {
        const dark = !this._wrap.classList.contains('dark');
        try {
          localStorage.setItem('home-panel-theme', dark ? 'dark' : 'light');
        } catch (err) { /* ignore */ }
        this._wrap.classList.toggle('dark', dark);
        break;
      }
      case 'closering':
        this._closeRing();
        break;
      default:
        break;
    }
  }
}

const STYLE = `
:host { display:block; height:100%; }
.wrap {
  --bg:#ece6db; --card:#f8f4ec; --line:rgba(70,55,35,.09); --ink:#2a251f; --muted:#8c8273; --label:#9a7a52;
  --chip:#efe9de; --on:#f3c969; --onink:#3a2a05; --ok:#4f8a4b; --warn:#c07a2c; --bad:#c0463b; --heat:#d9763a; --accent:#6b4f7a;
  box-sizing:border-box; height:var(--hp-height, calc(100vh - var(--header-height, 56px)));
  min-height:600px; padding:14px 16px 16px; background:var(--bg); color:var(--ink);
  font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size:13px;
  display:flex; flex-direction:column; gap:12px; overflow:hidden; transition:background .6s, color .6s;
}
.wrap.dark { --bg:#14120f; --card:#1e1b17; --line:rgba(255,240,220,.07); --ink:#f1eadf; --muted:#9a8f80; --label:#c8a679; --chip:#2a2620; --on:#e7b955; }
* { box-sizing:border-box; }
button { font:inherit; color:inherit; background:none; border:0; padding:0; cursor:pointer; text-align:left; }
svg { width:16px; height:16px; fill:currentColor; flex:none; }
.serif, .temp, .clock b, .tile b, .bt b { font-family:Fraunces, Georgia, 'Times New Roman', serif; font-weight:400; }
.muted { color:var(--muted); font-size:12px; }
.pad { padding:8px 2px; }

.top { display:flex; align-items:center; justify-content:space-between; gap:20px; min-height:52px; }
.quote { max-width:46%; }
.quote p { margin:0; font-family:Fraunces, Georgia, serif; font-style:italic; font-size:15px; line-height:1.3; }
.quote span { display:block; margin-top:4px; font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--label); font-weight:600; }
.right { display:flex; align-items:center; gap:14px; }
.avs { display:flex; }
.av { width:34px; height:34px; border-radius:50%; margin-left:-6px; position:relative; background:#b9a78d; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 2px var(--bg); }
.av:first-child { margin-left:0; }
.av img { width:100%; height:100%; border-radius:50%; object-fit:cover; }
.av b { color:#fff; font-weight:600; }
.av i { position:absolute; right:-1px; bottom:-1px; width:10px; height:10px; border-radius:50%; background:#b5ab9c; box-shadow:0 0 0 2px var(--bg); }
.av.home i { background:var(--ok); }
.av.away { opacity:.7; }
.clock { text-align:right; line-height:1; }
.clock b { display:block; font-size:30px; letter-spacing:-.5px; }
.clock span { font-size:11px; color:var(--muted); }
.iconbtn { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--card); border:1px solid var(--line); }
.iconbtn.sm { width:30px; height:30px; }

.pill { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px; font-size:11px; font-weight:600; background:var(--chip); white-space:nowrap; }
.pill.big { padding:7px 14px; font-size:12px; background:var(--card); border:1px solid var(--line); }
.pill svg { width:13px; height:13px; }
.pill .d, .tag { font-style:normal; }
.pill .d { width:7px; height:7px; border-radius:50%; background:currentColor; }
.pill.ok { color:var(--ok); } .pill.warn { color:var(--warn); } .pill.bad { color:var(--bad); } .pill.heat { color:var(--heat); }
.pill.btn { color:var(--ink); }

.grid { flex:1; min-height:0; display:grid; grid-template-columns:1fr 1.05fr 1fr; gap:12px; }
.col { display:flex; flex-direction:column; gap:12px; min-height:0; }
.card { background:var(--card); border:1px solid var(--line); border-radius:18px; padding:12px 14px; box-shadow:0 1px 0 rgba(255,255,255,.4) inset, 0 6px 20px rgba(60,40,10,.05); min-height:0; overflow:hidden; transition:background .6s; }
.card.grow { flex:1; }
.hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; gap:8px; }
.lbl { display:flex; align-items:center; gap:7px; font-size:10.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--label); font-weight:600; }
.lbl svg { width:14px; height:14px; }
.lbln { letter-spacing:0; text-transform:none; color:var(--ink); font-weight:500; font-size:12px; }

.tiles { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.tile { background:var(--chip); border-radius:12px; padding:8px 10px; display:flex; flex-direction:column; }
.tile span { font-size:9.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); font-weight:600; }
.tile b { font-size:22px; line-height:1.15; }
.tile small { color:var(--muted); font-size:10.5px; }
.tile.attn b { color:var(--warn); }

.binrow { display:flex; align-items:center; gap:12px; padding:6px 0; }
.binrow + .binrow { border-top:1px solid var(--line); opacity:.75; }
.bins { display:flex; gap:4px; min-width:52px; }
.bin { width:30px; height:34px; border-radius:7px 7px 9px 9px; background:var(--c); display:flex; align-items:center; justify-content:center; color:#fff; font-style:normal; box-shadow:inset 0 -4px 0 rgba(0,0,0,.18); }
.bin svg { width:16px; height:16px; opacity:.85; }
.bt b { display:block; font-size:18px; }
.bt small { color:var(--muted); font-size:11.5px; }
.bt em { font-style:normal; color:var(--warn); font-weight:600; }
.binrow.soon .bt em { color:var(--bad); }

.vac { display:flex; align-items:center; gap:10px; background:var(--chip); border-radius:14px; padding:10px; }
.vi { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--card); }
.vt { flex:1; }
.vt b { display:block; font-weight:600; }
.vt b small { color:var(--muted); font-weight:500; margin-left:4px; }
.vt > small { color:var(--muted); }
.dots { display:flex; gap:4px; margin-top:4px; }
.dots i { width:6px; height:6px; border-radius:50%; background:var(--line); box-shadow:inset 0 0 0 1px var(--muted); }
.dots i.on { background:var(--ok); box-shadow:none; }
.alarm { display:flex; align-items:center; justify-content:space-between; margin-top:12px; gap:8px; }
.alarm .muted { display:flex; align-items:center; gap:6px; }
.alarm .muted svg { width:14px; height:14px; }
.seg { display:flex; background:var(--chip); border-radius:999px; padding:3px; }
.seg button { padding:5px 12px; border-radius:999px; font-size:11.5px; font-weight:600; color:var(--muted); }
.seg button.on { background:var(--card); color:var(--ink); box-shadow:0 1px 3px rgba(0,0,0,.12); }

.people { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:12px; }
.person { display:flex; align-items:center; gap:10px; background:var(--chip); border-radius:14px; padding:8px 10px; }
.person .av { margin:0; box-shadow:none; }
.person .av i { box-shadow:0 0 0 2px var(--chip); }
.person b { display:block; font-weight:600; }
.person small { color:var(--muted); font-size:11px; }
.person:not(.home) { opacity:.75; }
.person.home .av i { background:var(--ok); }
.wrap.dark .bin { box-shadow:inset 0 0 0 1px rgba(255,255,255,.2), inset 0 -4px 0 rgba(0,0,0,.25); }
.now { display:flex; align-items:center; gap:14px; width:100%; }
.wxbig { width:58px; height:58px; }
.temp { font-size:52px; line-height:.95; letter-spacing:-2px; }
.temp sup { font-size:24px; vertical-align:top; position:relative; top:6px; }
.cond { font-family:Fraunces, Georgia, serif; font-size:17px; margin:2px 0; }
.facts { display:flex; justify-content:space-between; background:var(--chip); border-radius:999px; padding:6px 14px; margin:8px 0 6px; font-size:11.5px; color:var(--muted); }
.facts b { color:var(--ink); font-family:Fraunces, Georgia, serif; font-weight:500; font-size:13px; }
.hours { display:grid; grid-template-columns:repeat(8, 1fr); text-align:center; }
.hr small { display:block; font-size:10.5px; color:var(--muted); }
.hr svg { width:18px; height:18px; margin:2px auto; display:block; }
.hr b { font-family:Fraunces, Georgia, serif; font-weight:500; font-size:13px; }
.wx.sunny, .wxbig.sunny { color:#e8b33a; } .wx.partly, .wxbig.partly { color:#d7a64a; }
.wx.cloudy, .wxbig.cloudy, .wx.fog, .wxbig.fog { color:#9aa3ad; } .wx.rainy, .wxbig.rainy, .wx.pouring, .wxbig.pouring, .wx.storm, .wxbig.storm { color:#5f86b1; }
.wx.snowy, .wxbig.snowy, .wx.sleet, .wxbig.sleet { color:#9cb6cf; } .wx.night, .wxbig.night { color:#8d8fc4; }

.zones { display:flex; flex-direction:column; gap:8px; }
.zone { display:flex; align-items:center; gap:10px; background:var(--chip); border-radius:14px; padding:6px 10px; width:100%; }
.zi { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--card); color:var(--muted); }
.zi.heat { color:var(--heat); }
.zt { flex:1; }
.zt b { display:block; font-weight:600; }
.zt small { color:var(--muted); font-size:11px; }
.stepper { display:flex; align-items:center; gap:6px; }
.stepper button { width:30px; height:30px; border-radius:50%; background:var(--card); display:flex; align-items:center; justify-content:center; }
.stepper span { font-size:20px; min-width:52px; text-align:center; }
.serif.big { font-size:22px; padding-right:6px; }

.chips { display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; }
.chips.four { grid-template-columns:repeat(4, 1fr); }
.chip { display:flex; align-items:center; gap:8px; background:var(--chip); border-radius:12px; padding:6px 9px; min-width:0; transition:background .25s; }
.chip span { min-width:0; }
.chip b { display:block; font-weight:600; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.chip small { color:var(--muted); font-size:10.5px; }
.chip.on.light { background:var(--on); color:var(--onink); }
.chip.on.light small { color:rgba(58,42,5,.7); }
.chip.na { opacity:.45; }
.chips.four .chip { gap:6px; padding:5px 8px; }
.chips.four .chip svg { width:14px; height:14px; }
.chips.four .chip small { font-size:10px; }
.sub { font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); font-weight:600; margin:8px 0 5px; }

.cams { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.cam { position:relative; border-radius:12px; overflow:hidden; aspect-ratio:16/10; background:#3a352e; }
.cam.wide { grid-column:span 2; aspect-ratio:16/8.2; }
.cam img { width:100%; height:100%; object-fit:cover; display:block; }
.cap { position:absolute; left:8px; bottom:7px; font-size:11px; font-weight:600; color:#fff; text-shadow:0 1px 4px rgba(0,0,0,.6); }
.cam .dot { position:absolute; right:8px; top:8px; width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,.5); }
.cam .dot.live { background:#ff5a4e; box-shadow:0 0 0 4px rgba(255,90,78,.3); }

.doors { display:flex; flex-direction:column; gap:8px; }
.door { display:flex; align-items:center; gap:10px; background:var(--chip); border-radius:12px; padding:8px 10px; width:100%; }
.door span { flex:1; }
.door b { display:block; font-weight:600; }
.door small { color:var(--muted); font-size:11px; }
.tag { font-size:10.5px; font-weight:600; padding:3px 9px; border-radius:999px; background:var(--card); color:var(--ok); }
.door.open .tag { color:#fff; background:var(--bad); }
.minis { display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-top:10px; }
.mini { display:flex; flex-direction:column; align-items:center; gap:4px; padding:8px 4px; border-radius:12px; background:var(--chip); font-size:10.5px; font-weight:600; text-align:center; }
.mini.on { background:var(--on); color:var(--onink); }

.ring { position:absolute; inset:0; background:rgba(10,8,6,.55); display:flex; align-items:center; justify-content:center; z-index:5; }
.ring.hidden { display:none; }
.ringbox { width:min(860px, 88%); background:var(--card); border-radius:22px; padding:16px; }
.ringbox img { width:100%; border-radius:14px; display:block; background:#000; }
.wrap { position:relative; }
`;

if (!customElements.get('home-panel-card')) {
  customElements.define('home-panel-card', HomePanelCard);
  window.customCards = window.customCards || [];
  window.customCards.push({ type: 'home-panel-card', name: 'Home panel', description: 'One-screen wall tablet home page.' });
  console.info(`%c HOME-PANEL-CARD %c ${VERSION} `, 'background:#9a7a52;color:#fff;font-weight:700', 'background:#222;color:#fff');
}
