# RoboDesk — UI/UX Spec

---

## Design Philosophy

RoboDesk should feel like a **professional developer tool** — think VS Code meets Node-RED. Dense, information-rich, dark by default, with every pixel earning its place. No marketing fluff, no onboarding carousels. You open it and it's immediately obvious what to do.

---

## Design System

### Colors

```css
/* Dark theme (default) */
--bg:          #0A0A0B;   /* Near black — main background */
--surface:     #111113;   /* Cards, panels */
--surface-2:   #1A1A1E;   /* Elevated surfaces, inputs */
--surface-3:   #242428;   /* Hover states, borders */
--border:      #2A2A30;   /* Dividers */
--accent:      #3B82F6;   /* Primary blue — buttons, active states */
--accent-dim:  #1D3461;   /* Dimmed accent — backgrounds */
--success:     #22C55E;   /* Connected, ok */
--warning:     #F59E0B;   /* Reconnecting, caution */
--danger:      #EF4444;   /* Error, disconnect, delete */
--text:        #F0F0F5;   /* Primary text */
--text-muted:  #6B7280;   /* Secondary text, labels */
--text-dim:    #374151;   /* Disabled text */

/* Light theme */
--bg:          #F8F9FA;
--surface:     #FFFFFF;
--surface-2:   #F1F3F5;
--surface-3:   #E9ECEF;
--border:      #DEE2E6;
--text:        #0A0A0B;
--text-muted:  #6B7280;
```

### Typography

```css
/* UI text */
font-family: 'Inter', system-ui, sans-serif;

/* Code, data, telemetry, UUIDs, terminals */
font-family: 'Geist Mono', 'JetBrains Mono', monospace;
```

| Scale | Size | Usage |
|---|---|---|
| xs | 11px | Labels, badges, timestamps |
| sm | 12px | Secondary text, log entries |
| base | 14px | Default UI text |
| md | 16px | Section titles |
| lg | 20px | Page titles |
| xl | 24px | Empty state headlines |

### Spacing
Base unit: `4px`. Use multiples: `4 / 8 / 12 / 16 / 24 / 32 / 48`

### Border Radius
- Components: `6px`
- Cards: `8px`
- Dialogs: `10px`
- Badges/pills: `999px`

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
--shadow-md: 0 4px 12px rgba(0,0,0,0.5);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.6);
```

---

## Layout System

### App Shell
```
┌────────────────────────────────────────────────────────────┐
│  TopBar  [h-12, border-bottom]                             │
├──────────┬─────────────────────────────────────────────────┤
│          │                                                 │
│ Sidebar  │   Content Area                                  │
│ [w-56]   │   [flex-1, overflow-auto]                       │
│          │                                                 │
│          │                                                 │
└──────────┴─────────────────────────────────────────────────┘
```

### TopBar (`h-12`)
```
[☰ collapse]  RoboDesk  /  Device Name  /  Tab     [● Connected] [☀ theme] [⚙ settings]
```
- Left: hamburger (sidebar collapse), logo, breadcrumb
- Right: global connection status, theme toggle, settings link

### Sidebar (`w-56`, collapsible to `w-14`)
```
DEVICES
  ● My ESP32 Car         (green dot = connected)
  ○ Arduino Uno          (grey dot = disconnected)
  + Add Device

──────────
WORKSPACE
  🧩 Plugins
  ⚙  Settings
```
- Hovering a device shows quick-connect icon
- Active route highlighted with accent left border
- Collapsed state: shows only icons + status dots (tooltip on hover)

### Device Sub-nav (shown inside `/devices/[id]/*`)
```
[Dashboard]  [Functions]  [Flows]  [Logs]  [Settings]
```
Underline-style tabs, full width, `border-bottom`

---

## Component Specs

---

### DeviceCard (Home page)

```
┌─────────────────────────────────────────────────────┐
│  ● My ESP32 Car                    [Connect ▶]      │
│  Serial · /dev/ttyUSB0 · 115200                     │
│  Last seen: 2 min ago              Plugin: Motor Car │
└─────────────────────────────────────────────────────┘
```
- Status dot: `animate-pulse` when connected
- Hover: `surface-3` background, border brightens
- Right-click or `⋮` menu: Edit, Duplicate, Delete

---

### DeviceStatusBadge

| State | Color | Label | Animation |
|---|---|---|---|
| Connected | `success` | ● Connected | Pulse |
| Connecting | `warning` | ◌ Connecting… | Spin |
| Disconnected | `text-dim` | ○ Disconnected | None |
| Error | `danger` | ✕ Error | None |

---

### Add Device Dialog — Step Wizard

**Step indicator:** `1 — 2 — 3 — 4` (filled circles, connected by line)

**Step 1: Connection Type**
- Two large cards side by side:
  ```
  ┌───────────────┐  ┌───────────────┐
  │  🔌            │  │  📡            │
  │  Serial (USB) │  │  Bluetooth BLE│
  │               │  │               │
  │  Direct cable │  │  Wireless     │
  │  connection   │  │  connection   │
  └───────────────┘  └───────────────┘
  ```
  Selected card has accent border + accent-dim background

**Step 2: Configure**
- Serial: COM port dropdown (fetched live), baud rate, data bits, parity, stop bits
- BLE: Scan button → device list with RSSI → select → UUID fields

**Step 3: Plugin (optional)**
- `Skip` link top right
- 2×2 grid of plugin cards with icon + name + description
- "None / Custom" option at bottom

**Step 4: Name**
- Large name input (auto-filled from device or plugin)
- Summary of config below (read-only)
- `Save Device` button

---

### Dashboard — Widget Grid

**Edit mode toggle:** top-right button → border dashes appear on all widgets, resize handles visible

**Widget shell (all types):**
```
┌─ [⠿ drag] ─────────────────── [⚙] [✕] ─┐
│  Label                                   │
│  [widget content]                        │
└──────────────────────────────────────────┘
```
- Drag handle top-left (shown only in edit mode)
- Config + delete icons top-right (shown only in edit mode)

**Widget Designs:**

*Button Widget*
```
┌──────────────────┐
│   💡  Lights     │
│   ────────────   │
│   [  ON / OFF  ] │
└──────────────────┘
```
- `ElevatedButton`, full width, accent color
- Press: `scale(0.97)` transition, success flash

*Slider Widget*
```
┌──────────────────────┐
│  Speed               │
│  ████████░░░  75%   │
│  0              255  │
└──────────────────────┘
```
- Custom styled `<input type="range">` with accent thumb + track fill
- Value readout right-aligned (monospace)

*Toggle Widget*
```
┌─────────────┐
│  Headlights │
│    ◉ ON     │  ← green background
└─────────────┘
```
- Pill toggle, green when ON, surface when OFF
- Smooth `transition: background-color 150ms`

*Gauge Widget*
```
┌─────────────────────┐
│   Temperature  🌡   │
│      ╭──────╮       │
│   ╭──┤  42  ├──╮   │
│   │  ╰──────╯  │   │
│  0°C         100°C  │
└─────────────────────┘
```
- SVG arc gauge, accent colored fill
- Center value: monospace, large
- Min/max labels below

*Display Widget*
```
┌─────────────┐
│  Uptime     │
│  02:14:33   │  ← monospace, large
└─────────────┘
```
- Minimal, just label + value
- Value updates with `transition: color 200ms` flash on change

*Joystick Widget*
```
┌────────────────────┐
│   Movement         │
│   ╭──────────╮     │
│   │    ●     │     │
│   │          │     │
│   ╰──────────╯     │
│   x: 0  y: 0       │
└────────────────────┘
```
- Canvas-based joystick (same `CustomPainter` concept, ported to HTML Canvas)
- x/y readout below in monospace

---

### Function Editor

**Toolbar:**
```
[▶ Run]  [💾 Save]  Trigger: [Manual ▼]  Interval: [___ms]  [⋮ More]
```

**Monaco Editor:**
- Theme: `vs-dark` (dark mode) / `vs` (light mode)
- Font: `Geist Mono 13px`, line height `1.6`
- Minimap: disabled (too small for snippets)
- Folding: enabled
- Tab size: 2 spaces
- Format on save: enabled (Prettier via Monaco)
- Starter template injected on new function:
  ```js
  // Available: device.send(), device.onData(), delay(), console.log()

  async function main() {
    device.log('Function started');
    await device.send('{"type":"ping"}');

    device.onData((data) => {
      device.log('Received: ' + data);
    });
  }

  main();
  ```

**Output Console:**
```
┌─────────────────────────────────────────────── [Clear] [Copy] ──┐
│  > [10:42:01] Function started                                   │
│  > [10:42:01] → Sent: {"type":"ping"}                           │
│  > [10:42:01] ← Received: pong                                  │
│  ✕ [10:42:05] Error: device timeout                             │
└─────────────────────────────────────────────────────────────────┘
```
- Monospace 12px
- Color: grey (log), blue (sent →), green (received ←), red (error ✕)
- Auto-scroll to bottom (toggle-able)
- Max 500 lines

**Split layout:**
- Default: 60% editor / 40% console
- Draggable divider
- Console collapsible to `h-8` header bar

---

### Flow Builder

**Canvas:**
- Background: `#0A0A0B` with dot grid pattern (`radial-gradient`)
- Controls: zoom in/out, fit view, lock (bottom-left)
- Minimap: bottom-right corner, toggleable

**Node designs:**

All nodes follow this shell:
```
┌─────────────────────────────┐
│  [icon]  Node Type    [●]── │  ← output handle
│──────────────────────────── │
│  config preview text        │
└─────────────────────────────┘
```
- Input handle: left edge (circle, accent color)
- Output handle: right edge
- Selected: accent border glow
- Error state: danger red border

| Node | Icon | Color accent | Handle layout |
|---|---|---|---|
| Trigger | ⚡ | Yellow | Output only |
| Send | 📤 | Blue | Input + Output |
| Condition | 🔀 | Purple | Input + True/False outputs |
| Delay | ⏱ | Orange | Input + Output |
| Transform | ⚙ | Teal | Input + Output |
| Log | 📋 | Grey | Input + Output |

**Node Palette (left sidebar, `w-48`):**
```
NODES
─────
⚡ Trigger
📤 Send
🔀 Condition
⏱ Delay
⚙  Transform
📋 Log
```
Drag from palette → drop on canvas

**Node Config Panel (right sidebar, `w-64`):**
- Appears when a node is selected
- Title: node type + node ID
- Config fields specific to node type
- Validation inline (red border on invalid)
- `Delete Node` button at bottom (danger)

**Flow Toolbar (bottom bar):**
```
[▶ Start]  [⏹ Stop]  [💾 Save]  [⊞ Auto-layout]  Status: ● Active  Nodes: 6  Edges: 5
```

**Execution visualization:**
- When flow is running, active node pulses with accent glow
- Data flowing through an edge: animated dashed line in accent color
- Error node: shakes + red border flash

---

### Log Viewer

```
┌─ Filters: [All ●] [Sent] [Received] [Errors]    Search: [________] [Export ▼] ──┐
│                                                                                   │
│  10:42:01.234  →  {"type":"move","dir":"F","speed":200}                          │
│  10:42:01.891  ←  OK                                                             │
│  10:42:02.100  →  {"type":"cmd","action":"lights_on"}                            │
│  10:42:05.000  ✕  Connection timeout                                             │
│                                                                                   │
│  [Auto-scroll ●]                                           Showing 42 / 2000     │
└───────────────────────────────────────────────────────────────────────────────────┘
```
- Monospace 12px
- Row hover: `surface-2` background
- Click row: expands to show full payload (for long JSON)
- Direction icons: `→` blue (sent), `←` green (received), `✕` red (error)
- Virtual scroll (`@tanstack/virtual`) — handles 2000+ entries smoothly

---

## Micro-Interactions

| Interaction | Implementation |
|---|---|
| Device connect | Status dot color transition + sidebar pulse |
| Incoming data | Log row slides in from bottom (`translate-y` animation) |
| Widget data update | Value flashes accent color for 300ms |
| Node selected | Panel slides in from right (`transform: translateX`) |
| Flow running | Active node border pulses (`box-shadow` keyframe) |
| Edge data flow | SVG `stroke-dashoffset` animation along edge path |
| Save success | Toolbar "Save" button briefly shows ✓ checkmark |
| Run function | Console clears + "Running…" grey text appears |
| Theme toggle | `transition: background-color 200ms` on all surfaces |
| Sidebar collapse | `transition: width 200ms ease-in-out` |

---

## Empty States

| Page | Illustration | Headline | CTA |
|---|---|---|---|
| Home (no devices) | Robot with plug icon | "No devices yet" | + Add Device |
| Functions (none) | Code icon | "No functions yet" | + New Function |
| Flows (none) | Node graph icon | "No flows yet" | + New Flow |
| Dashboard (no widgets) | Grid icon | "Empty dashboard" | + Add Widget |
| Logs (none) | Terminal icon | "No logs yet" | Connect a device |

---

## Responsiveness

This is a **desktop-first localhost tool**. Minimum supported width: `1024px`.
- No mobile layout needed
- Sidebar collapses at `< 1280px` by default
- Flow builder and Monaco editor are desktop-only experiences

---

## Accessibility

- All icon-only buttons have `title` tooltip + `aria-label`
- Keyboard navigable: `Tab` through all controls, `Enter` to activate
- Monaco editor fully keyboard accessible (built-in)
- React Flow: keyboard pan (`Arrow` keys), zoom (`+/-`)
- Focus indicators: `outline: 2px solid var(--accent)` on all focusable elements
- Color not used as the only indicator (icons + labels alongside colors)
