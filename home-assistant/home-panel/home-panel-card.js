/*
 * home-panel-card — a one-screen wall-tablet home page for Home Assistant.
 *
 * Editorial "paper" look: cream cards, serif numerals, small-caps labels. Automatically switches to
 * a dark palette after sunset (or tap the half-moon button). Everything is live from hass.
 *
 *   type: custom:home-panel-card      # put it in a panel view
 *   # every entity below is optional and overridable – defaults match this house
 */

const VERSION = '1.2.0';
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
  bus: "M18,11H6V6H18M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M4,16C4,16.88 4.39,17.67 5,18.22V20A1,1 0 0,0 6,21H7A1,1 0 0,0 8,20V19H16V20A1,1 0 0,0 17,21H18A1,1 0 0,0 19,20V18.22C19.61,17.67 20,16.88 20,16V6C20,2.5 16.42,2 12,2C7.58,2 4,2.5 4,6V16Z",
  car: "M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z",
  bike: "M5,20.5A3.5,3.5 0 0,1 1.5,17A3.5,3.5 0 0,1 5,13.5A3.5,3.5 0 0,1 8.5,17A3.5,3.5 0 0,1 5,20.5M5,12A5,5 0 0,0 0,17A5,5 0 0,0 5,22A5,5 0 0,0 10,17A5,5 0 0,0 5,12M14.8,10H19V8.2H15.8L13.86,4.93C13.57,4.43 13,4.1 12.4,4.1C11.93,4.1 11.5,4.29 11.2,4.6L7.5,8.29C7.19,8.6 7,9 7,9.5C7,10.13 7.33,10.66 7.85,10.97L11.2,13V18H13V11.5L10.75,9.85L13.07,7.5M19,20.5A3.5,3.5 0 0,1 15.5,17A3.5,3.5 0 0,1 19,13.5A3.5,3.5 0 0,1 22.5,17A3.5,3.5 0 0,1 19,20.5M19,12A5,5 0 0,0 14,17A5,5 0 0,0 19,22A5,5 0 0,0 24,17A5,5 0 0,0 19,12M16,4.8C17,4.8 17.8,4 17.8,3C17.8,2 17,1.2 16,1.2C15,1.2 14.2,2 14.2,3C14.2,4 15,4.8 16,4.8Z",
  walk: "M14.12,10H19V8.2H15.38L13.38,4.87C13.08,4.37 12.54,4.03 11.92,4.03C11.74,4.03 11.58,4.06 11.42,4.11L6,5.8V11H7.8V7.33L9.91,6.67L6,22H7.8L10.67,13.89L13,17V22H14.8V15.59L12.31,11.05L13.04,8.18M14,3.8C15,3.8 15.8,3 15.8,2C15.8,1 15,0.2 14,0.2C13,0.2 12.2,1 12.2,2C12.2,3 13,3.8 14,3.8Z",
  swap: "M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z",
  phone: "M17,1H7A2,2 0 0,0 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3A2,2 0 0,0 17,1M17,19H7V5H17V19M16,13H13V8H11V13H8L12,17L16,13Z",
  back: "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z",
  umbrella: "M12,4C8.9,4 6.18,6.03 5.3,9H18.7C17.82,6.04 15.09,4 12,4M12,2A9,9 0 0,1 21,11H13V19A3,3 0 0,1 10,22A3,3 0 0,1 7,19V18H9V19A1,1 0 0,0 10,20A1,1 0 0,0 11,19V11H3A9,9 0 0,1 12,2Z",
  work: "M20,6C20.58,6 21.05,6.2 21.42,6.59C21.8,7 22,7.45 22,8V19C22,19.55 21.8,20 21.42,20.41C21.05,20.8 20.58,21 20,21H4C3.42,21 2.95,20.8 2.58,20.41C2.2,20 2,19.55 2,19V8C2,7.45 2.2,7 2.58,6.59C2.95,6.2 3.42,6 4,6H8V4C8,3.42 8.2,2.95 8.58,2.58C8.95,2.2 9.42,2 10,2H14C14.58,2 15.05,2.2 15.42,2.58C15.8,2.95 16,3.42 16,4V6H20M4,8V19H20V8H4M14,6V4H10V6H14Z",
  route: "M18,15A3,3 0 0,1 21,18A3,3 0 0,1 18,21C16.69,21 15.58,20.17 15.17,19H14V17H15.17C15.58,15.83 16.69,15 18,15M18,17A1,1 0 0,0 17,18A1,1 0 0,0 18,19A1,1 0 0,0 19,18A1,1 0 0,0 18,17M18,8A1.43,1.43 0 0,0 19.43,6.57C19.43,5.78 18.79,5.14 18,5.14C17.21,5.14 16.57,5.78 16.57,6.57A1.43,1.43 0 0,0 18,8M18,2.57A4,4 0 0,1 22,6.57C22,9.56 18,14 18,14C18,14 14,9.56 14,6.57A4,4 0 0,1 18,2.57M8.83,17H10V19H8.83C8.42,20.17 7.31,21 6,21A3,3 0 0,1 3,18C3,16.69 3.83,15.58 5,15.17V14H7V15.17C7.85,15.47 8.53,16.15 8.83,17M6,17A1,1 0 0,0 5,18A1,1 0 0,0 6,19A1,1 0 0,0 7,18A1,1 0 0,0 6,17M6,3A3,3 0 0,1 9,6C9,7.31 8.17,8.42 7,8.83V10H5V8.83C3.83,8.42 3,7.31 3,6A3,3 0 0,1 6,3M6,5A1,1 0 0,0 5,6A1,1 0 0,0 6,7A1,1 0 0,0 7,6A1,1 0 0,0 6,5M11,19V17H13V19H11M7,13H5V11H7V13Z",
  train: "M12,2C8,2 4,2.5 4,6V15.5A3.5,3.5 0 0,0 7.5,19L6,20.5V21H8.23L10.23,19H14L16,21H18V20.5L16.5,19A3.5,3.5 0 0,0 20,15.5V6C20,2.5 16.42,2 12,2M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M11,10H6V6H11V10M13,10V6H18V10H13M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17Z",
  live: "M4.93,4.93C3.12,6.74 2,9.24 2,12C2,14.76 3.12,17.26 4.93,19.07L6.34,17.66C4.89,16.22 4,14.22 4,12C4,9.79 4.89,7.78 6.34,6.34L4.93,4.93M19.07,4.93L17.66,6.34C19.11,7.78 20,9.79 20,12C20,14.22 19.11,16.22 17.66,17.66L19.07,19.07C20.88,17.26 22,14.76 22,12C22,9.24 20.88,6.74 19.07,4.93M7.76,7.76C6.67,8.85 6,10.35 6,12C6,13.65 6.67,15.15 7.76,16.24L9.17,14.83C8.45,14.11 8,13.11 8,12C8,10.89 8.45,9.89 9.17,9.17L7.76,7.76M16.24,7.76L14.83,9.17C15.55,9.89 16,10.89 16,12C16,13.11 15.55,14.11 14.83,14.83L16.24,16.24C17.33,15.15 18,13.65 18,12C18,10.35 17.33,8.85 16.24,7.76M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z",
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
  vacuum_progress: 'input_number.robot_vacuum_daily_progress', // reset at midnight by an automation
  vacuum_days: [2, 4, 6], // scheduled clean days (0 = Sunday): Tue, Thu, Sat
  jobs_todo: 'todo.home_jobs', // tick-off jobs (vacuum maintenance etc.)
  bins_done: 'input_datetime.bins_put_out', // date of the collection the bins were put out for
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
  transport_view: 'transport', // swipe right (or tap the commute pill) to open it
  bus_stop: { entity: 'sensor.tfi_gtfs_stop_1682', walk: 4 },
  drive_time: 'sensor.drive_to_work',
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


const hhmm = (d) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

// Switch dashboard view (same dashboard) and remember which way to slide the new view in.
function goView(view, from) {
  const dash = location.pathname.split('/').filter(Boolean)[0] || 'lovelace';
  window.__hpSlide = { from, t: Date.now() };
  history.pushState(null, '', `/${dash}/${view}`);
  window.dispatchEvent(new CustomEvent('location-changed'));
}

function slideIn(wrap) {
  const s = window.__hpSlide;
  if (!wrap || !s || Date.now() - s.t > 1500) return;
  window.__hpSlide = null;
  wrap.classList.remove('in-left', 'in-right');
  void wrap.offsetWidth;
  wrap.classList.add(`in-${s.from}`);
}

// Horizontal swipe (finger or mouse drag): cb('right') when the finger moves left → right.
function onSwipe(el, cb) {
  let s = null;
  const start = (x, y) => (s = { x, y, t: Date.now() });
  const end = (x, y) => {
    if (!s) return;
    const dx = x - s.x, dy = y - s.y, dt = Date.now() - s.t;
    s = null;
    if (Math.abs(dx) > 90 && Math.abs(dx) > 2 * Math.abs(dy) && dt < 900) cb(dx > 0 ? 'right' : 'left');
  };
  el.addEventListener('touchstart', (e) => (e.touches.length === 1 ? start(e.touches[0].clientX, e.touches[0].clientY) : (s = null)), { passive: true });
  el.addEventListener('touchend', (e) => end(e.changedTouches[0].clientX, e.changedTouches[0].clientY), { passive: true });
  el.addEventListener('mousedown', (e) => start(e.clientX, e.clientY));
  window.addEventListener('mouseup', (e) => end(e.clientX, e.clientY));
}

// TFI GTFS stop sensor → upcoming departures. Times are local and carry no offset.
function departures(st, walk = 0) {
  const now = Date.now();
  return (st?.attributes?.arrivals || [])
    .map((a) => {
      const at = new Date(a.real_time_arrival || a.scheduled_arrival).getTime();
      const sched = new Date(a.scheduled_arrival).getTime();
      const live = !!a.real_time_arrival;
      const mins = Math.floor((at - now) / 60000);
      return { ...a, at, live, mins, late: live ? Math.round((at - sched) / 60000) : 0, leave: mins - walk };
    })
    .filter((d) => d.mins >= 0)
    .sort((a, b) => a.at - b.at);
}

// Travel-time sensors report minutes as the state; attributes vary by integration.
function minutesOf(v) {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  const m = String(v).match(/(?:(\d+)\s*h\w*)?\s*(\d+(?:\.\d+)?)\s*m/i);
  if (m) return Number(m[1] || 0) * 60 + Number(m[2]);
  return isNaN(Number(v)) ? null : Number(v);
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

  get hass() {
    return this._hass;
  }

  getCardSize() {
    return 12;
  }

  connectedCallback() {
    this._tick = setInterval(() => this._schedule(true), 1000);
    this._camTimer = setInterval(() => this._refreshCameras(), (this._config?.camera_refresh || 10) * 1000);
    this._dataTimer = setInterval(() => this._fetchAll(), 15 * 60 * 1000);
    slideIn(this._wrap);
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
    await this._fetchJobs();
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

  async _fetchJobs() {
    const h = this._hass, c = this._config;
    if (!h || !c.jobs_todo || !h.states[c.jobs_todo]) return;
    try {
      const r = await h.callService('todo', 'get_items', { status: 'needs_action' }, { entity_id: c.jobs_todo }, false, true);
      this._jobs = r?.response?.[c.jobs_todo]?.items || [];
    } catch (e) {
      this._jobs = [];
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
        ${this._config.transport_view ? `<button class="edge" data-act="transport" title="Transport">${svg(ICON.bus)}</button>` : ''}
      </div>`;
    this._wrap = this._root.querySelector('.wrap');
    this._rendered = {};
    this._buildCameras();
    this._root.addEventListener('click', (e) => this._onClick(e));
    if (this._config.transport_view) onSwipe(this._wrap, (dir) => dir === 'right' && goView(this._config.transport_view, 'left'));
    slideIn(this._wrap);
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
    const todo = h.states[this._config.jobs_todo];
    if (todo && todo.last_updated !== this._jobsKey) {
      this._jobsKey = todo.last_updated;
      this._fetchJobs();
    }
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
        ${this._commutePill()}
        <button class="pill big ${status.cls}" data-act="${status.act}" data-entity="${status.entity || ''}">${status.html}</button>
        <button class="iconbtn" data-act="theme" title="Day / night">${svg(ICON.contrast)}</button>
        <div class="clock"><b>${time}</b><span>${date}</span></div>
      </div>`;
  }

  // Next bus (and drive time when there's a sensor) – opens the transport view.
  _commutePill() {
    const S = this._hass.states, c = this._config;
    if (!c.transport_view) return '';
    const bits = [];
    const drive = S[c.drive_time];
    if (!na(drive) && Date.now() - new Date(drive.last_reported || drive.last_updated) < 20 * 60000) bits.push(`${svg(ICON.car)}${Math.round(minutesOf(drive.state))} min`);
    const stop = c.bus_stop && S[c.bus_stop.entity];
    const next = stop && departures(stop, c.bus_stop.walk || 0).find((d) => d.leave >= 0);
    if (next) bits.push(`${svg(ICON.bus)}${esc(next.route)} · ${next.mins < 1 ? 'due' : `${next.mins} min`}`);
    if (!bits.length) bits.push(`${svg(ICON.route)}Transport`);
    return `<button class="pill big commute" data-act="transport">${bits.join('<i class="sep"></i>')}</button>`;
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
    const doneFor = this._hass.states[this._config.bins_done]?.state || '';
    const rows = ev.slice(0, 2).map((e, i) => {
      const dateStr = String(e.start).slice(0, 10);
      const d = new Date(`${dateStr}T00:00:00`);
      const done = /^\d{4}-/.test(doneFor) && doneFor >= dateStr;
      const days = Math.round((d - today) / 86400000);
      const when = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      const bins = Object.keys(BIN_COLOURS).filter((k) => e.summary.toLowerCase().includes(k));
      const icons = bins.map((b) => `<i class="bin" style="--c:${BIN_COLOURS[b]}">${svg(ICON.trash)}</i>`).join('');
      const label = bins.length ? bins.map((b) => b[0].toUpperCase() + b.slice(1)).join(' + ') : esc(e.summary);
      const hint = done ? '<strong>Out ✓</strong>' : days === 1 ? '<em>Put out tonight</em>' : days === 0 ? '<em>Collection today</em>' : `in ${days} days`;
      const tick = i === 0 ? `<button class="tick ${done ? 'done' : ''}" data-act="bins" data-date="${dateStr}" title="${done ? 'Undo' : 'Bins are out'}">${svg(ICON.check)}</button>` : '';
      return `<div class="binrow ${i === 0 ? 'next' : ''} ${days <= 1 && !done ? 'soon' : ''} ${done ? 'done' : ''}">
        <div class="bins">${icons}</div>
        <div class="bt"><b>${label}</b><small>${when} · ${hint}</small></div>${tick}</div>`;
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
      // rooms in this run (falls back to every room on the map)
      const rooms = arr(a.active_segments).length || (map?.rooms ? Object.keys(map.rooms).length : 0);
      const done = arr(a.completed_segments).length;
      const running = ['cleaning', 'returning'].includes(v.state);
      const label = { cleaning: 'Cleaning', returning: 'Heading home', docked: a.drying ? 'Drying mop' : 'Docked', paused: 'Paused', idle: 'Idle', error: 'Needs attention' }[v.state] || v.state;
      const batt = a.battery ?? a.battery_level;
      const dots = rooms ? Array.from({ length: rooms }, (_, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('') : '';
      // today's scheduled clean, tracked by input_number (0 % at midnight, live while cleaning)
      const prog = S[c.vacuum_progress];
      const pct = na(prog) ? null : Math.round(Number(prog.state));
      const dow = new Date().getDay();
      const scheduled = arr(c.vacuum_days).includes(dow);
      const nextDay = (() => {
        for (let k = 1; k <= 7; k++) if (arr(c.vacuum_days).includes((dow + k) % 7)) return new Date(Date.now() + k * 86400000).toLocaleDateString('en-GB', { weekday: 'long' });
        return null;
      })();
      let progress = '';
      if (pct != null && (scheduled || pct > 0)) {
        const msg = pct >= 100 ? 'Done for today' : v.state === 'cleaning' ? `Cleaning${a.segment_cleaning && S['sensor.l40s_pro_ultra_current_room'] ? ' · ' + esc(S['sensor.l40s_pro_ultra_current_room'].state) : ''}` : pct > 0 ? 'Paused part-way' : 'Starts when the alarm is set to Away';
        progress = `<div class="prog ${pct >= 100 ? 'full' : ''}"><div class="pt"><span>Today's clean · ${msg}</span><b>${pct}%</b></div><div class="bar"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div></div>`;
      } else if (nextDay) {
        progress = `<div class="prog idle"><div class="pt"><span>Next scheduled clean · ${nextDay}</span></div></div>`;
      }
      vac = `<div class="vac">
        <button class="vi" data-act="more" data-entity="${c.vacuum}">${svg(ICON.vacuum)}</button>
        <div class="vt"><b>Dreame <small>${batt != null ? `${batt}%` : ''}</small></b><small>${label}${running && rooms ? ` · ${done}/${rooms} rooms` : ''}</small>
          ${running && rooms ? `<span class="dots">${dots}</span>` : ''}</div>
        <button class="iconbtn sm" data-act="call" data-svc="vacuum.${v.state === 'cleaning' ? 'pause' : 'start'}" data-entity="${c.vacuum}" title="${v.state === 'cleaning' ? 'Pause' : 'Start'}">${svg(v.state === 'cleaning' ? ICON.pause : ICON.play)}</button>
        <button class="iconbtn sm" data-act="call" data-svc="vacuum.return_to_base" data-entity="${c.vacuum}" title="Dock">${svg(ICON.dock)}</button>
      </div>${progress}`;
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
    const jobs = (this._jobs || []).filter((j) => !this._ticked?.has(j.uid));
    const jobList = jobs.length ? `<div class="jobs">${jobs.slice(0, 3).map((j) => `<div class="job">
        <button class="tick" data-act="job" data-uid="${esc(j.uid)}" title="Mark done">${svg(ICON.check)}</button>
        <span><b>${esc(j.summary)}</b>${j.description ? `<small>${esc(j.description)}</small>` : ''}</span></div>`).join('')}
        ${jobs.length > 3 ? `<button class="more" data-act="nav" data-path="/todo?entity_id=${c.jobs_todo}">+${jobs.length - 3} more</button>` : ''}</div>` : '';
    const jobPill = jobs.length ? `<button class="pill warn" data-act="nav" data-path="/todo?entity_id=${c.jobs_todo}">${svg(ICON.alert)}${jobs.length} job${jobs.length > 1 ? 's' : ''}</button>` : '';
    // people move to the top bar avatars when there are jobs to make room
    return `<div class="hd"><span class="lbl">${svg(ICON.home)}Home</span>${jobPill}</div>${vac}${jobList}${alarm}${jobs.length ? '' : `<div class="people">${people}</div>`}`;
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
      case 'job': {
        const uid = el.dataset.uid;
        this._ticked = this._ticked || new Set();
        this._ticked.add(uid); // hide straight away, the list refreshes when HA confirms
        this._rendered.home = null;
        this._schedule(true);
        h.callService('todo', 'update_item', { item: uid, status: 'completed' }, { entity_id: c.jobs_todo });
        break;
      }
      case 'bins': {
        const date = el.dataset.date;
        const cur = h.states[c.bins_done]?.state || '';
        const undo = /^\d{4}-/.test(cur) && cur >= date;
        const prev = new Date(`${date}T00:00:00`);
        prev.setDate(prev.getDate() - 7);
        const value = undo ? `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-${String(prev.getDate()).padStart(2, '0')}` : date;
        h.callService('input_datetime', 'set_datetime', { entity_id: c.bins_done, date: value });
        break;
      }
      case 'transport':
        goView(c.transport_view, 'left');
        break;
      case 'closering':
        this._closeRing();
        break;
      default:
        break;
    }
  }
}

/* ---------------------------------------------------------------------------------------------
 * transport-panel-card — the commute page: Google Maps journey, live drive time + the usual
 * morning traffic, bus departures from the stop, and the weather for the trip.
 *
 *   type: custom:transport-panel-card     # panel view, swipe left to go back to `home_view`
 * ------------------------------------------------------------------------------------------- */
const TRANSPORT_DEFAULTS = {
  home: 'zone.home',
  work: 'zone.work', // zone, "lat,lng" or an address
  work_name: 'Work',
  weather: 'weather.forecast_home',
  sun: 'sun.sun',
  persons: ['person.killian', 'person.sinead'],
  drive_time: 'sensor.drive_to_work', // travel-time sensor (minutes), optional
  drive_forecast: null, // a travel-time sensor with a fixed departure time, optional
  bus_stops: [{ entity: 'sensor.tfi_gtfs_stop_1682', walk: 4 }],
  commute: ['06:30', '09:30'], // the weekday morning window for the traffic chart + weather
  history_days: 21,
  mode: 'driving',
  maps_api_key: null, // Google Maps Embed API key; without one the classic embed is used
  notify: [
    { name: 'Killian', service: 'notify.mobile_app_killian_s_samsung' },
    { name: 'Sinéad', service: 'notify.mobile_app_sinead_s_iphone' },
  ],
  home_view: 'home',
};

const MODES = [
  { id: 'driving', name: 'Drive', icon: 'car', flag: 'd' },
  { id: 'transit', name: 'Bus', icon: 'bus', flag: 'r' },
  { id: 'bicycling', name: 'Cycle', icon: 'bike', flag: 'b' },
  { id: 'walking', name: 'Walk', icon: 'walk', flag: 'w' },
];

const toMin = (hm) => {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
};

class TransportPanelCard extends HTMLElement {
  setConfig(config) {
    this._config = { ...TRANSPORT_DEFAULTS, ...config };
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem('transport-panel') || 'null');
    } catch (e) { /* storage blocked */ }
    this._mode = saved?.mode || this._config.mode;
    this._reverse = false;
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

  get hass() {
    return this._hass;
  }

  getCardSize() {
    return 12;
  }

  connectedCallback() {
    this._tick = setInterval(() => this._schedule(true), 1000);
    this._dataTimer = setInterval(() => this._fetchAll(), 15 * 60 * 1000);
    // the embedded map has no live feed of its own – reload it so the traffic colours stay fresh
    this._mapTimer = setInterval(() => this._map(true), 10 * 60 * 1000);
    slideIn(this._wrap);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    clearInterval(this._dataTimer);
    clearInterval(this._mapTimer);
  }

  async _fetchAll() {
    const h = this._hass, c = this._config;
    if (!h) return;
    try {
      const r = await h.callService('weather', 'get_forecasts', { type: 'hourly' }, { entity_id: c.weather }, false, true);
      this._hourly = r?.response?.[c.weather]?.forecast || [];
    } catch (e) { /* weather provider may not support hourly */ }
    if (c.drive_time && h.states[c.drive_time] && h.callWS) {
      try {
        const end = new Date();
        const start = new Date(end.getTime() - c.history_days * 86400000);
        const r = await h.callWS({
          type: 'history/history_during_period', start_time: start.toISOString(), end_time: end.toISOString(),
          entity_ids: [c.drive_time], minimal_response: true, no_attributes: true, significant_changes_only: false,
        });
        this._typical = this._buildTypical(r?.[c.drive_time] || []);
      } catch (e) {
        this._typical = null;
      }
    }
    this._schedule(true);
  }

  // Average weekday drive time for each 15 minutes of the morning window, from the sensor history.
  _buildTypical(hist) {
    const pts = hist
      .map((p) => ({ t: (p.lu ?? p.lc ?? 0) * 1000 || new Date(p.last_updated || p.last_changed).getTime(), v: Number(p.s ?? p.state) }))
      .filter((p) => !isNaN(p.v) && p.v > 0)
      .sort((a, b) => a.t - b.t);
    const [from, to] = this._config.commute.map(toMin);
    const slots = [];
    for (let m = from; m <= to; m += 15) slots.push({ m, sum: 0, n: 0 });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let d = 1; d <= this._config.history_days; d++) {
      const day = new Date(today.getTime() - d * 86400000);
      if (day.getDay() === 0 || day.getDay() === 6) continue;
      for (const s of slots) {
        const t = day.getTime() + s.m * 60000;
        let v = null;
        for (const p of pts) {
          if (p.t > t) break;
          if (t - p.t < 2 * 3600000) v = p.v;
        }
        if (v != null) {
          s.sum += v;
          s.n++;
        }
      }
    }
    const out = slots.map((s) => ({ m: s.m, v: s.n ? s.sum / s.n : null, n: s.n }));
    return out.some((s) => s.v != null) ? out : null;
  }

  _schedule(force) {
    if (this._pending && !force) return;
    this._pending = true;
    requestAnimationFrame(() => {
      this._pending = false;
      this._render();
    });
  }

  _build() {
    this._root.innerHTML = `<style>${STYLE}${TRANSPORT_STYLE}</style>
      <div class="wrap transport">
        <header class="top" data-part="top"></header>
        <main class="tgrid">
          <section class="card mapcard">
            <div class="hd" data-part="maphd"></div>
            <div class="map"><iframe title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
          </section>
          <div class="col">
            <section class="card" data-part="drive"></section>
            <section class="card" data-part="bus"></section>
            <section class="card grow" data-part="trip"></section>
          </div>
        </main>
        <div class="toast" data-part="toast"></div>
      </div>`;
    this._wrap = this._root.querySelector('.wrap');
    this._frame = this._root.querySelector('iframe');
    this._rendered = {};
    this._mapUrl = null;
    this._root.addEventListener('click', (e) => this._onClick(e));
    onSwipe(this._wrap, (dir) => dir === 'left' && goView(this._config.home_view, 'right'));
    slideIn(this._wrap);
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
    const sun = h.states[this._config.sun];
    let theme = null;
    try {
      theme = localStorage.getItem('home-panel-theme');
    } catch (e) { /* ignore */ }
    this._wrap.classList.toggle('dark', theme ? theme === 'dark' : sun?.state === 'below_horizon');
    this._set('top', this._top());
    this._set('maphd', this._mapHead());
    this._set('drive', this._drive());
    this._set('bus', this._bus());
    this._set('trip', this._trip());
    this._map();
  }

  /* ---------- places ---------- */
  _place(ref) {
    const z = this._hass.states[ref];
    if (z && z.attributes.latitude != null) return { q: `${z.attributes.latitude},${z.attributes.longitude}`, name: z.attributes.friendly_name };
    return ref ? { q: ref, name: ref } : null;
  }

  _route() {
    const c = this._config;
    const home = this._place(c.home), work = this._place(c.work);
    const a = { ...home, name: 'Home' }, b = work ? { ...work, name: c.work_name } : null;
    return this._reverse ? [b, a] : [a, b];
  }

  _map(force) {
    const c = this._config;
    const [from, to] = this._route();
    if (!from || !to || !this._frame) return;
    const mode = MODES.find((m) => m.id === this._mode) || MODES[0];
    const e = encodeURIComponent;
    const url = c.maps_api_key
      ? `https://www.google.com/maps/embed/v1/directions?key=${e(c.maps_api_key)}&origin=${e(from.q)}&destination=${e(to.q)}&mode=${mode.id}&region=ie&language=en-GB`
      : `https://maps.google.com/maps?saddr=${e(from.q)}&daddr=${e(to.q)}&dirflg=${mode.flag}${mode.id === 'driving' ? '&layer=t' : ''}&hl=en-GB&output=embed`;
    if (url === this._mapUrl && !force) return;
    this._mapUrl = url;
    this._frame.src = url;
  }

  _mapsLink() {
    const [from, to] = this._route();
    const e = encodeURIComponent;
    return `https://www.google.com/maps/dir/?api=1&origin=${e(from.q)}&destination=${e(to.q)}&travelmode=${this._mode}`;
  }

  /* ---------- sections ---------- */
  _top() {
    const S = this._hass.states, c = this._config;
    const now = new Date();
    const people = arr(c.persons).map((p) => {
      const s = S[p];
      if (!s) return '';
      const name = (s.attributes.friendly_name || p).split(' ')[0];
      const where = s.state === 'home' ? 'Home' : s.state === 'not_home' ? 'Away' : s.state;
      const pic = s.attributes.entity_picture;
      return `<button class="who ${s.state === 'home' ? 'home' : ''}" data-act="more" data-entity="${p}">
        <span class="av ${s.state === 'home' ? 'home' : 'away'}">${pic ? `<img src="${pic}" alt="">` : `<b>${esc(name[0])}</b>`}<i></i></span>
        <span><b>${esc(name)}</b><small>${esc(where)}</small></span></button>`;
    }).join('');
    return `<div class="title">
        <button class="iconbtn" data-act="home" title="Home">${svg(ICON.back)}</button>
        <div><h1>Transport</h1><span>${now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</span></div>
      </div>
      <div class="right">
        <div class="whos">${people}</div>
        <div class="clock"><b>${hhmm(now)}</b><span>Swipe left for home</span></div>
      </div>`;
  }

  _mapHead() {
    const [from, to] = this._route();
    if (!to) return `<span class="lbl">${svg(ICON.route)}Journey</span><span class="muted">Set <code>work:</code> to a zone or address</span>`;
    const modes = MODES.map((m) => `<button class="${m.id === this._mode ? 'on' : ''}" data-act="mode" data-mode="${m.id}">${svg(ICON[m.icon])}${m.name}</button>`).join('');
    const phones = arr(this._config.notify).filter((n) => this._hass.services?.notify?.[n.service.split('.')[1]] ?? true)
      .map((n, i) => `<button class="pill btn" data-act="send" data-i="${i}" title="Send directions to ${esc(n.name)}'s phone">${svg(ICON.phone)}${esc(n.name)}</button>`).join('');
    return `<div class="journey">
        <span class="lbl">${svg(ICON.route)}Journey</span>
        <span class="ends"><b>${esc(from.name)}</b><button class="iconbtn sm" data-act="swap" title="Reverse">${svg(ICON.swap)}</button><b>${esc(to.name)}</b></span>
      </div>
      <div class="seg modes">${modes}</div>
      <div class="phones">${phones}</div>`;
  }

  _driveState() {
    const S = this._hass.states, c = this._config;
    const st = S[c.drive_time];
    if (na(st)) return null;
    const a = st.attributes;
    const now = minutesOf(st.state);
    let free = minutesOf(a.duration_without_traffic ?? a.static_duration ?? (a.duration_in_traffic != null ? a.duration : null));
    const typical = this._typical?.filter((s) => s.v != null) || [];
    if (!free && typical.length) free = Math.min(...typical.map((s) => s.v));
    const ratio = free ? now / free : 1;
    const level = ratio < 1.15 ? ['Light traffic', 'ok'] : ratio < 1.4 ? ['Moderate traffic', 'warn'] : ['Heavy traffic', 'bad'];
    const checked = new Date(st.last_reported || st.last_updated);
    return { st, now, free, level, route: a.route, distance: parseFloat(a.distance) || null, checked, stale: Date.now() - checked > 20 * 60000 };
  }

  _drive() {
    const S = this._hass.states, c = this._config;
    const d = this._driveState();
    const hd = `<div class="hd"><span class="lbl">${svg(ICON.car)}Drive to ${esc(c.work_name)}</span>${d ? `<span class="pill ${d.stale ? '' : d.level[1]}"><i class="d"></i>${d.stale ? `Checked ${this._when(d.checked)}` : d.level[0]}</span>` : ''}</div>`;
    if (!d) {
      return `${hd}<div class="empty">${svg(ICON.car)}<div><b>Live traffic is on the map</b>
        <small>Add a travel-time sensor (<code>${esc(c.drive_time || 'drive_time')}</code>) for drive times and the usual morning pattern.</small></div></div>`;
    }
    const arrive = new Date(Date.now() + d.now * 60000);
    const delay = d.free ? Math.round(d.now - d.free) : 0;
    const fc = S[c.drive_forecast];
    const fcHtml = !na(fc) ? `<small class="fc">Forecast ${esc(fc.attributes.friendly_name?.match(/\d{1,2}[:.]\d{2}/)?.[0] || 'later')}: <b>${Math.round(minutesOf(fc.state))} min</b></small>` : '';
    return `${hd}
      <button class="drive" data-act="more" data-entity="${c.drive_time}">
        <div class="big"><b>${Math.round(d.now)}</b><span>min</span></div>
        <div class="dt">
          <b>${d.stale ? `${d.level[0]} at ${hhmm(d.checked)}` : `Leave now, arrive ${hhmm(arrive)}`}</b>
          <small>${delay > 0 ? `+${delay} min on a clear road` : d.stale ? 'Roads were clear' : 'Roads are clear'}${d.distance ? ` · ${esc(num(d.distance, 1))} km` : ''}</small>
          ${d.route ? `<small>via ${esc(d.route)}</small>` : ''}${fcHtml}
        </div>
      </button>
      ${this._chart(d)}`;
  }

  _when(d) {
    const today = new Date().toDateString() === d.toDateString();
    return today ? hhmm(d) : `${d.toLocaleDateString('en-GB', { weekday: 'short' })} ${hhmm(d)}`;
  }

  // Bar chart of the usual weekday morning, today's live value marked.
  _chart(d) {
    const t = this._typical;
    if (!t) return '<div class="muted small">The usual morning traffic appears here after a few weekdays of history.</div>';
    const vals = t.filter((s) => s.v != null).map((s) => s.v);
    const max = Math.max(...vals, d?.now || 0), min = Math.min(...vals);
    const best = t.reduce((b, s) => (s.v != null && (b == null || s.v < b.v) ? s : b), null);
    const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    const bars = t.map((s) => {
      const hgt = s.v == null ? 4 : 18 + (82 * (s.v - min * 0.8)) / (max - min * 0.8 || 1);
      const lvl = s.v == null ? '' : s.v / min < 1.15 ? 'ok' : s.v / min < 1.4 ? 'warn' : 'bad';
      const cur = nowMin >= s.m && nowMin < s.m + 15 ? 'cur' : '';
      const lab = s.m % 60 === 0 ? `${String(s.m / 60).padStart(2, '0')}:00` : '';
      return `<div class="b ${lvl} ${cur} ${s === best ? 'best' : ''}" title="${Math.floor(s.m / 60)}:${String(s.m % 60).padStart(2, '0')} · ${s.v == null ? '–' : Math.round(s.v) + ' min'}">
        <i style="height:${Math.min(100, hgt).toFixed(0)}%"></i><small>${lab}</small></div>`;
    }).join('');
    const bt = best ? `${Math.floor(best.m / 60)}:${String(best.m % 60).padStart(2, '0')}` : '';
    return `<div class="sub">Usual weekday morning${best ? ` · quickest leaving ${bt} (${Math.round(best.v)} min)` : ''}</div><div class="bars">${bars}</div>`;
  }

  _bus() {
    const S = this._hass.states, c = this._config;
    const stops = arr(c.bus_stops).filter((b) => S[b.entity]);
    if (!stops.length) return `<div class="hd"><span class="lbl">${svg(ICON.bus)}Bus</span></div><div class="muted">No bus stop sensor</div>`;
    return stops.map((b) => {
      const st = S[b.entity];
      const walk = b.walk || 0;
      const list = departures(st, walk);
      const next = list.find((x) => x.leave >= 0);
      let lead = '<div class="leave muted">No more buses listed</div>';
      if (next) {
        const cls = next.leave <= 1 ? 'bad' : next.leave <= 5 ? 'warn' : 'ok';
        lead = `<div class="leave ${cls}"><b>${next.leave <= 1 ? 'Leave now' : `Leave in ${next.leave} min`}</b>
          <span>for the ${esc(next.route)} at ${hhmm(next.at)}${walk ? ` · ${walk} min walk` : ''}</span></div>`;
      }
      const rows = list.slice(0, 4).map((x) => `<div class="dep ${x.leave < 0 ? 'gone' : ''}">
          <span class="route">${esc(x.route)}</span>
          <span class="to"><b>${esc(x.headsign)}</b><small>${x.live ? `<i class="livedot"></i>${x.late > 1 ? `${x.late} min late` : x.late < -1 ? `${-x.late} min early` : 'On time'}` : 'Timetable'}</small></span>
          <span class="due"><b>${x.mins < 1 ? 'Due' : `${x.mins}<small>min</small>`}</b><small>${hhmm(x.at)}</small></span>
        </div>`).join('');
      return `<div class="hd"><span class="lbl">${svg(ICON.bus)}${esc(st.attributes.stop_name || 'Bus stop')}</span>
          <span class="muted">updated ${ago(st.last_updated)}</span></div>${lead}<div class="deps">${rows}</div>`;
    }).join('');
  }

  // Weather for the next commute: this morning while it's still on, otherwise the next weekday morning.
  _trip() {
    const S = this._hass.states, c = this._config;
    const w = S[c.weather];
    const [from, to] = c.commute.map(toMin);
    const now = new Date();
    const day = new Date(now);
    day.setHours(0, 0, 0, 0);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    if (nowMin > to) day.setDate(day.getDate() + 1);
    while (day.getDay() === 0 || day.getDay() === 6) day.setDate(day.getDate() + 1);
    const start = day.getTime() + Math.max(from, day.toDateString() === now.toDateString() ? nowMin - 30 : 0) * 60000;
    const end = day.getTime() + to * 60000;
    const hours = (this._hourly || []).filter((f) => {
      const t = new Date(f.datetime).getTime();
      return t >= start - 1800000 && t <= end;
    });
    const isToday = day.toDateString() === now.toDateString();
    const tomorrow = new Date(now.getTime() + 86400000).toDateString() === day.toDateString();
    const when = isToday ? 'This morning' : tomorrow ? 'Tomorrow morning' : `${day.toLocaleDateString('en-GB', { weekday: 'long' })} morning`;
    const sun = S[c.sun];
    const rise = sun?.attributes?.next_rising;
    const hd = `<div class="hd"><span class="lbl">${svg(ICON.umbrella)}${when}</span>${rise ? `<span class="muted">Sunrise ${hhmm(rise)}</span>` : ''}</div>`;
    if (!w || !hours.length) {
      return `${hd}<div class="muted">${w ? 'Hourly forecast not available that far ahead yet.' : 'No weather entity.'}</div>`;
    }
    const rainy = (f) => /rain|pour|snow|hail|sleet|lightning/.test(f.condition) || (f.precipitation_probability ?? 0) >= 50;
    const wet = hours.filter(rainy);
    const cold = hours.some((f) => f.temperature <= 1);
    const windy = hours.some((f) => (f.wind_speed ?? 0) >= 40);
    const tips = [];
    if (wet.length) tips.push(['bad', `Rain from ${hhmm(wet[0].datetime)} – wet roads, allow 10 min extra`]);
    if (cold) tips.push(['warn', 'Near freezing – check for ice and frost on the car']);
    if (windy) tips.push(['warn', 'Strong wind – take care on the M50']);
    if (!tips.length) tips.push(['ok', 'Dry and settled for the drive']);
    const strip = hours.slice(0, 6).map((f) => {
      const [, k] = COND[f.condition] || ['', 'cloudy'];
      const p = f.precipitation_probability;
      return `<div class="hr"><small>${hhmm(f.datetime)}</small>${svg(ICON[k] || ICON.cloudy, `wx ${k}`)}<b>${num(f.temperature)}°</b>
        ${p != null ? `<span class="rain"><i style="height:${Math.max(4, p)}%"></i></span><small>${num(p)}%</small>` : ''}</div>`;
    }).join('');
    return `${hd}<div class="hours trip" style="grid-template-columns:repeat(${Math.min(6, hours.length)}, 1fr)">${strip}</div>
      <div class="tips">${tips.map(([cls, t]) => `<div class="tip ${cls}"><i class="d"></i>${esc(t)}</div>`).join('')}</div>`;
  }

  _toast(msg) {
    const el = this._root.querySelector('[data-part="toast"]');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => el.classList.remove('show'), 2500);
  }

  _onClick(e) {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const h = this._hass, c = this._config;
    switch (el.dataset.act) {
      case 'home':
        goView(c.home_view, 'right');
        break;
      case 'more':
        this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: el.dataset.entity }, bubbles: true, composed: true }));
        break;
      case 'mode':
        this._mode = el.dataset.mode;
        try {
          localStorage.setItem('transport-panel', JSON.stringify({ mode: this._mode }));
        } catch (err) { /* ignore */ }
        this._schedule(true);
        break;
      case 'swap':
        this._reverse = !this._reverse;
        this._schedule(true);
        break;
      case 'send': {
        const n = arr(c.notify)[Number(el.dataset.i)];
        if (!n) break;
        const [, to] = this._route();
        const url = this._mapsLink();
        const [d, s] = n.service.split('.');
        h.callService(d, s, {
          title: `Directions to ${to.name}`,
          message: `${MODES.find((m) => m.id === this._mode)?.name || 'Route'} – tap to open Google Maps`,
          data: { clickAction: url, url, actions: [{ action: 'URI', title: 'Open Maps', uri: url }] },
        }).then(() => this._toast(`Sent to ${n.name}'s phone`), () => this._toast('Could not send'));
        break;
      }
      default:
        break;
    }
  }
}

const TRANSPORT_STYLE = `
.title { display:flex; align-items:center; gap:12px; }
.title h1 { margin:0; font-family:Fraunces, Georgia, serif; font-weight:400; font-size:28px; letter-spacing:-.5px; line-height:1; }
.title span { font-size:11px; color:var(--muted); }
.whos { display:flex; gap:8px; }
.who { display:flex; align-items:center; gap:8px; background:var(--card); border:1px solid var(--line); border-radius:999px; padding:3px 12px 3px 3px; }
.who .av { width:30px; height:30px; margin:0; box-shadow:none; }
.who b { display:block; font-size:12px; font-weight:600; line-height:1.1; }
.who small { color:var(--muted); font-size:10.5px; }
.tgrid { flex:1; min-height:0; display:grid; grid-template-columns:1.55fr 1fr; gap:12px; }
.mapcard { display:flex; flex-direction:column; padding-bottom:14px; }
.mapcard .hd { flex-wrap:wrap; }
.journey { display:flex; align-items:center; gap:12px; }
.ends { display:flex; align-items:center; gap:8px; font-family:Fraunces, Georgia, serif; font-size:17px; }
.ends b { font-weight:400; }
.modes button { display:flex; align-items:center; gap:5px; }
.modes svg { width:14px; height:14px; }
.phones { display:flex; gap:6px; }
.phones .pill { padding:6px 11px; }
.map { flex:1; min-height:0; border-radius:14px; overflow:hidden; background:var(--chip); }
.map iframe { width:100%; height:100%; border:0; display:block; }
.wrap.dark .map iframe { filter:invert(.92) hue-rotate(180deg) saturate(.7) brightness(.95); }
.empty { display:flex; gap:12px; align-items:center; background:var(--chip); border-radius:14px; padding:12px; }
.empty > svg { width:28px; height:28px; color:var(--muted); }
.empty b { display:block; font-weight:600; }
.empty small, .small { color:var(--muted); font-size:11px; }
code { font-size:10.5px; background:var(--card); padding:1px 4px; border-radius:4px; }
.drive { display:flex; align-items:center; gap:14px; width:100%; }
.big { display:flex; align-items:baseline; gap:4px; }
.big b { font-family:Fraunces, Georgia, serif; font-weight:400; font-size:54px; line-height:.9; letter-spacing:-2px; }
.big span { color:var(--muted); font-size:14px; }
.dt b { display:block; font-weight:600; font-size:13px; }
.dt small { display:block; color:var(--muted); font-size:11.5px; }
.dt .fc b { display:inline; }
.bars { display:flex; align-items:flex-end; gap:3px; height:64px; }
.bars .b { flex:1; height:100%; display:flex; flex-direction:column; justify-content:flex-end; position:relative; }
.bars i { display:block; border-radius:4px 4px 2px 2px; background:var(--line); }
.bars .ok i { background:#9cc39a; } .bars .warn i { background:#e2b06c; } .bars .bad i { background:#d98577; }
.bars .best i { box-shadow:0 0 0 2px var(--ok); }
.bars .cur i { outline:2px solid var(--ink); outline-offset:1px; }
.bars small { position:absolute; bottom:-15px; left:0; font-size:9.5px; color:var(--muted); white-space:nowrap; }
.card[data-part="drive"] { padding-bottom:22px; }
.leave { display:flex; align-items:baseline; gap:8px; padding:8px 12px; border-radius:12px; background:var(--chip); margin-bottom:8px; }
.leave b { font-family:Fraunces, Georgia, serif; font-weight:500; font-size:19px; }
.leave span { color:var(--muted); font-size:11.5px; }
.leave.ok b { color:var(--ok); } .leave.warn b { color:var(--warn); } .leave.bad b { color:var(--bad); }
.deps { display:flex; flex-direction:column; }
.dep { display:flex; align-items:center; gap:10px; padding:6px 2px; }
.dep + .dep { border-top:1px solid var(--line); }
.dep.gone { opacity:.45; }
.route { min-width:38px; height:26px; padding:0 6px; border-radius:7px; background:#f2c200; color:#1c1c1c; font-weight:700; display:flex; align-items:center; justify-content:center; font-size:13px; }
.to { flex:1; min-width:0; }
.to b { display:block; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.to small { color:var(--muted); font-size:11px; display:flex; align-items:center; gap:5px; }
.livedot { width:7px; height:7px; border-radius:50%; background:var(--ok); animation:pulse 1.6s infinite; font-style:normal; }
@keyframes pulse { 50% { box-shadow:0 0 0 4px rgba(79,138,75,.2); } }
.due { text-align:right; }
.due b { display:block; font-family:Fraunces, Georgia, serif; font-weight:500; font-size:20px; line-height:1; }
.due b small { font-family:Inter, sans-serif; font-size:10px; color:var(--muted); margin-left:2px; }
.due > small { color:var(--muted); font-size:10.5px; }
.hours.trip .rain { display:flex; align-items:flex-end; width:6px; height:22px; margin:4px auto 0; background:var(--chip); border-radius:3px; overflow:hidden; }
.hours.trip .rain i { display:block; width:100%; background:#5f86b1; }
.tips { display:flex; flex-direction:column; gap:6px; margin-top:10px; }
.tip { display:flex; align-items:center; gap:8px; font-size:12px; font-weight:500; background:var(--chip); border-radius:10px; padding:7px 10px; }
.tip .d { width:7px; height:7px; border-radius:50%; flex:none; }
.tip.ok .d { background:var(--ok); } .tip.warn .d { background:var(--warn); } .tip.bad .d { background:var(--bad); }
.toast { position:absolute; left:50%; bottom:22px; transform:translate(-50%, 20px); background:var(--ink); color:var(--bg); padding:9px 16px; border-radius:999px; font-weight:600; opacity:0; transition:all .25s; pointer-events:none; }
.toast.show { opacity:1; transform:translate(-50%, 0); }
`;

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

.tick { width:28px; height:28px; flex:none; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1.5px solid var(--muted); color:transparent; margin-left:auto; transition:all .2s; }
.tick svg { width:18px; height:18px; }
.tick:hover { color:var(--muted); }
.tick.done { background:var(--ok); border-color:var(--ok); color:#fff; }
.binrow.done .bins { opacity:.45; }
.bt strong { color:var(--ok); font-weight:600; }
.prog { margin-top:8px; padding:0 2px; }
.pt { display:flex; justify-content:space-between; align-items:baseline; font-size:11px; color:var(--muted); margin-bottom:5px; }
.pt b { font-family:Fraunces, Georgia, serif; font-weight:500; font-size:15px; color:var(--ink); }
.bar { height:7px; border-radius:99px; background:var(--chip); overflow:hidden; box-shadow:inset 0 0 0 1px var(--line); }
.bar i { display:block; height:100%; border-radius:99px; background:linear-gradient(90deg, #8fb3d9, #5f86b1); transition:width 1s ease; }
.prog.full .bar i { background:linear-gradient(90deg, #7fb07b, var(--ok)); }
.prog.idle { margin-top:6px; }
.jobs { display:flex; flex-direction:column; gap:6px; margin-top:10px; }
.job { display:flex; align-items:center; gap:10px; background:var(--chip); border-radius:12px; padding:6px 10px; border-left:3px solid var(--warn); }
.job .tick { margin-left:0; order:2; margin-left:auto; }
.job span { min-width:0; }
.job b { display:block; font-weight:600; font-size:12.5px; }
.job small { display:block; color:var(--muted); font-size:10.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.more { font-size:11px; color:var(--muted); font-weight:600; padding:2px 4px; }
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
.wrap { position:relative; touch-action:pan-y; }
.wrap.in-left { animation:inL .35s ease-out; } .wrap.in-right { animation:inR .35s ease-out; }
@keyframes inL { from { transform:translateX(-60px); opacity:.2; } } @keyframes inR { from { transform:translateX(60px); opacity:.2; } }
.commute { color:var(--ink); gap:7px; }
.commute .sep { width:1px; height:12px; background:var(--line); margin:0 2px; }
.edge { position:absolute; left:0; top:50%; transform:translateY(-50%); width:14px; height:64px; border-radius:0 10px 10px 0; background:var(--card); border:1px solid var(--line); border-left:0; display:flex; align-items:center; justify-content:center; color:var(--muted); opacity:.8; z-index:2; }
.edge svg { width:11px; height:11px; }
`;

if (!customElements.get('home-panel-card')) {
  customElements.define('home-panel-card', HomePanelCard);
  window.customCards = window.customCards || [];
  window.customCards.push({ type: 'home-panel-card', name: 'Home panel', description: 'One-screen wall tablet home page.' });
  console.info(`%c HOME-PANEL-CARD %c ${VERSION} `, 'background:#9a7a52;color:#fff;font-weight:700', 'background:#222;color:#fff');
}

if (!customElements.get('transport-panel-card')) {
  customElements.define('transport-panel-card', TransportPanelCard);
  window.customCards.push({ type: 'transport-panel-card', name: 'Transport panel', description: 'Commute page: map, drive time, buses, trip weather.' });
}
