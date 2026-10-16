# Floorplan 3D card

A Home Assistant Lovelace card that renders a live 3D model of the house (traced from the
Daft.ie ground + first floor plans) using three.js.

- **Lights** glow in their rooms (colour + brightness follow the bulb). Tap a bulb marker, or tap
  a room's floor, to toggle that room's lights. Long-press any marker for the more-info dialog.
- **Blinds**, **windows/doors** (red when open), **motion** (pulsing ring), **TVs** (screen lights
  up), **temperatures** and the **thermostat** are shown in place.
- **Robot vacuum** (Dreame integration): the 3D robot follows the real robot's live position and
  heading from its map camera, with the dock where the real one is. While it cleans it leaves a
  blue trail of the floor covered (cleared at the start of each run), the room it's in pulses,
  finished rooms get a ✓, and the bottom-left chip shows room · progress · area · battery.
  **Tap the vacuum marker** to pick rooms (tap floors or room labels), then **Clean** to send it
  there (`dreame_vacuum.vacuum_clean_segment`). Long-press it for the usual vacuum dialog.
  Without a map camera it falls back to a pretend route.
- **Weather**: rain, snow, fog, drifting clouds and lightning follow `weather.forecast_home`;
  daylight and shadows follow `sun.sun` (night mode makes lit rooms pop).
- **Floors**: ground, first floor, an exploded view of both, or the garden & cabin (buttons top-left).
- **Garden cabin** (Trihold Longford 5030): main room + shed, up/down wall lights with light
  beams, shed light, LED strip around the workbench, camera + floodlight.
- **Doorbell** beside the front door (red pulse when someone rings, blue on person/motion) —
  tap it, or the cabin camera, to open the live camera view.
- HUD: who's home, lights on, heating, alarm, vacuum, open doors/windows, weather + sunset.

Drag to orbit, right-drag / shift-drag / two-finger drag to pan, scroll / pinch to zoom,
double-click to reset.

## Install

1. Copy `floorplan-3d-card.js` to `/config/www/floorplan-3d-card.js`.
2. Settings → Dashboards → ⋮ → Resources → add `/local/floorplan-3d-card.js` (JavaScript module).
3. Create a dashboard with a **Panel** view containing:

```yaml
type: custom:floorplan-3d-card
```

three.js is loaded from jsDelivr; set `three_url:` to self-host it.

## Options

| key | default | |
| --- | --- | --- |
| `height` | `calc(100vh - header)` | CSS height of the card |
| `floor` | `0` | initial view: `0`, `1`, `all` or `garden` |
| `house_bearing` | `95` | compass bearing the back of the house faces (sun direction) |
| `weather`, `sun`, `climate`, `alarm`, `vacuum` | this house's entities | |
| `vacuum_map` | `camera.l40s_pro_ultra_map` | Dreame map camera (live position, rooms, progress) |
| `vacuum_transform` | fitted for this house | `{ sx, ox, sz, oz }`: model metres = `o + s × robot mm / 1000` |
| `vacuum_clean_service` | `dreame_vacuum.vacuum_clean_segment` | service used to clean the picked rooms |
| `persons` | `[person.killian, person.sinead]` | |
| `devices` | see `DEFAULT_DEVICES` | list of `{ entity, room, at: [x, z], name?, kind?, camera?, h?, light_at?, range?, power? }` |

Room ids: `kitchen`, `living`, `hallway`, `wc`, `bedroom`, `ensuite`, `bathroom`, `landing`,
`spare` (bedroom 2, front-left), `office` (bedroom 3, front-right), `cabin`, `shed`, `garden`, `front`.
Coordinates are metres: `x` left→right on the plan, `z` back→front.

`demo.html` runs the card with simulated states (serve the folder over HTTP and open it).
