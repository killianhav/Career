# Home panel card

A one-screen wall-tablet home page for Home Assistant (designed for the kitchen Galaxy Tab A9+,
1280 × 800 CSS px in landscape). Cream "paper" cards with serif numerals in the day; switches to a
dark palette after sunset (tap the half-moon button to override).

- **Top bar** – quote of the day, who's home, an *All clear* / *x open* / *Armed* status pill, clock.
- **Systems** – internet, lights on, estimated gas cost today, updates waiting, last backup.
- **Coming up** – the next two bin collections from `calendar.bins` (colour-coded bins, *Put out
  tonight* the evening before). Tick the next one when the bins are out; it is stored in
  `input_datetime.bins_put_out` so every screen and phone sees it, and tapping again undoes it.
- **Home** – robot vacuum (start/pause, dock, room progress) with a **today's clean** progress bar
  (`input_number.robot_vacuum_daily_progress`, reset at midnight, scheduled Tue/Thu/Sat), the open
  jobs from `todo.home_jobs` with a tick to complete each one, alarm Off/Home/Away, and people
  (hidden while there are jobs, to save space).
- **Today** – current weather, high/low, sunrise/sunset, humidity/wind/UV, 8-hour forecast.
- **Climate** – thermostat with − / + and the bedroom sensor.
- **Lights & blinds** – tap to toggle, *All off* for the whole house.
- **Cameras** – doorbell, cabin and vacuum map snapshots (refresh every 10 s, tap for live view).
- **Garden & cabin** – cabin and shed door contacts, cabin lights.
- **Camera pop-ups** – a doorbell press, or motion at the cabin, opens a full-screen live feed (HA's
  own player, so WebRTC / HLS) for 30 seconds, on both the home and transport views. *+30 s* keeps
  it open, × closes it; the doorbell takes over from a cabin pop-up but not the other way round.
  Configure with `alerts:` (`trigger`, `camera`, `title`, `seconds`, `aspect`, `priority`).
- **Cameras** tiles grey out and say *Offline* when a camera drops off.
- **Commute pill** (top bar) – drive time to work and the next bus; tap it, the bus tab on the left
  edge, or **swipe left → right** anywhere to open the Transport view.

## Install

Add `home-panel-card.js` as a dashboard resource (JavaScript module) and put the card in a
**panel** view:

```yaml
type: custom:home-panel-card
```

Every entity is overridable in the card config (see `DEFAULTS` at the top of the file). Fonts
(Fraunces, Inter) load from Google Fonts. `demo.html` renders it with simulated states.

## Transport view

`transport-panel-card` (same file) is the commute page. Put it in a second panel view with path
`transport`; swipe right → left (or the ‹ button) to go back to `home_view`.

```yaml
type: custom:transport-panel-card
```

- **Journey** – Google Maps directions Home → Work (`zone.home` → `zone.work`) with the live traffic
  layer. Switch Drive / Bus / Cycle / Walk, reverse the trip, or send the route to a phone
  (`notify.mobile_app_*`, tap the notification to open Google Maps). Set `maps_api_key` to use
  the Maps Embed API instead of the classic embed.
- **Drive to work** – a travel-time sensor (`drive_time`, minutes): time now, arrival time, traffic
  level against the free-flow time, and a bar chart of the usual weekday morning (06:30–09:30,
  averaged from the sensor's last 3 weeks of history) with the quickest time to leave.
  `drive_forecast` can point at a second sensor with a fixed departure time.
- **Bus** – departures from the TFI GTFS stop sensor(s) in `bus_stops` (live / late / timetable),
  and *Leave in x min* allowing for the `walk` to the stop.
- **This / tomorrow morning** – hourly weather across the next weekday commute with rain chance,
  plus warnings for rain, frost and strong wind.

`transport-demo.html` renders it with simulated states.
