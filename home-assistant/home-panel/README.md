# Home panel card

A one-screen wall-tablet home page for Home Assistant (designed for the kitchen Galaxy Tab A9+,
1280 × 800 CSS px in landscape). Cream "paper" cards with serif numerals in the day; switches to a
dark palette after sunset (tap the half-moon button to override).

- **Top bar** – quote of the day, who's home, an *All clear* / *x open* / *Armed* status pill, clock.
- **Systems** – internet, lights on, estimated gas cost today, updates waiting, last backup.
- **Coming up** – the next two bin collections from `calendar.bins` (colour-coded bins, *Put out
  tonight* the evening before).
- **Home** – robot vacuum (start/pause, dock, room progress), alarm Off/Home/Away, people.
- **Today** – current weather, high/low, sunrise/sunset, humidity/wind/UV, 8-hour forecast.
- **Climate** – thermostat with − / + and the bedroom sensor.
- **Lights & blinds** – tap to toggle, *All off* for the whole house.
- **Cameras** – doorbell, cabin and vacuum map snapshots (refresh every 10 s, tap for live view).
- **Garden & cabin** – cabin and shed door contacts, cabin lights.
- **Doorbell** – when it rings, a live camera overlay opens for two minutes.

## Install

Add `home-panel-card.js` as a dashboard resource (JavaScript module) and put the card in a
**panel** view:

```yaml
type: custom:home-panel-card
```

Every entity is overridable in the card config (see `DEFAULTS` at the top of the file). Fonts
(Fraunces, Inter) load from Google Fonts. `demo.html` renders it with simulated states.
