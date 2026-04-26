# RoboDesk — Fullstack Device Management & Control Platform
## Kiro Spec

---

## Project Overview

**RoboDesk** is a localhost-first fullstack web platform for connecting, managing, programming, and controlling Arduino, ESP32, and any serial/BLE robot devices. It combines a **visual node-based function builder** (like Node-RED) with a **Monaco code editor**, a **real-time device dashboard**, and a **plugin-style device profile system** — all running locally with zero cloud dependency.

---

## Tech Stack

### Frontend
| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Visual Builder | React Flow (`@xyflow/react`) |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| State Management | Zustand |
| Real-time | Socket.io client |
| Charts/Telemetry | Recharts |
| Icons | Lucide React |
| Notifications | Sonner (toast) |

### Backend
| Layer | Choice |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Real-time | Socket.io server |
| Database | SQLite via Prisma ORM |
| Serial Port | `serialport` npm package |
| BLE Bridge | `@abandonware/noble` (Node BLE) |
| Script Runner | Node.js `vm` module (sandboxed) |
| Package Manager | pnpm (monorepo) |

### Monorepo Structure
```
robodesk/
  apps/
    web/          # Next.js frontend
    server/       # Express + Socket.io backend
  packages/
    shared/       # Shared TypeScript types
  prisma/
    schema.prisma
  package.json    # pnpm workspace root
```

---

## Core Concepts

| Concept | Description |
|---|---|
| **Device** | A physical Arduino/ESP32/robot — has a profile, connection config, and state |
| **Function** | A reusable script or node graph that runs commands on a device |
| **Flow** | A visual node graph (React Flow) that chains functions, triggers, and conditions |
| **Widget** | A UI control (button, slider, toggle, gauge) bound to a device command |
| **Dashboard** | A customizable grid of Widgets for a specific device |
| **Plugin** | A device-specific preset (e.g. "ESP32 Motor Car", "Arduino Uno Sensor Board") |

---

## Database Schema (Prisma + SQLite)

```prisma
model Device {
  id            String    @id @default(uuid())
  name          String
  type          String    // 'serial' | 'ble'
  connectionConfig Json   // port/baudRate or BLE UUIDs
  pluginId      String?
  status        String    @default("disconnected")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  functions     Function[]
  flows         Flow[]
  dashboards    Dashboard[]
  logs          DeviceLog[]
}

model Function {
  id          String   @id @default(uuid())
  deviceId    String
  device      Device   @relation(fields: [deviceId], references: [id])
  name        String
  description String?
  type        String   // 'code' | 'flow'
  code        String?  // JS code string (for code type)
  flowData    Json?    // React Flow nodes/edges (for flow type)
  trigger     String   // 'manual' | 'interval' | 'onData' | 'onConnect'
  intervalMs  Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Flow {
  id        String   @id @default(uuid())
  deviceId  String
  device    Device   @relation(fields: [deviceId], references: [id])
  name      String
  nodes     Json     // React Flow nodes
  edges     Json     // React Flow edges
  isActive  Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Dashboard {
  id        String   @id @default(uuid())
  deviceId  String
  device    Device   @relation(fields: [deviceId], references: [id])
  name      String
  layout    Json     // grid-layout positions
  widgets   Widget[]
}

model Widget {
  id          String   @id @default(uuid())
  dashboardId String
  dashboard   Dashboard @relation(fields: [dashboardId], references: [id])
  type        String   // 'button' | 'slider' | 'toggle' | 'gauge' | 'display' | 'joystick'
  label       String
  command     String   // command string sent to device
  config      Json     // type-specific config (min/max, colors, etc.)
  position    Json     // {x, y, w, h} grid position
}

model DeviceLog {
  id        String   @id @default(uuid())
  deviceId  String
  device    Device   @relation(fields: [deviceId], references: [id])
  direction String   // 'in' | 'out'
  data      String
  timestamp DateTime @default(now())
}

model Plugin {
  id          String @id @default(uuid())
  name        String
  description String?
  deviceType  String
  config      Json   // default connection config
  functions   Json   // preset functions
  dashboards  Json   // preset dashboard layout
}
```

---

## Backend Architecture (`apps/server`)

### Directory Structure
```
apps/server/
  src/
    index.ts              # Express + Socket.io entry
    routes/
      devices.ts          # CRUD /api/devices
      functions.ts        # CRUD /api/functions
      flows.ts            # CRUD /api/flows
      dashboards.ts       # CRUD /api/dashboards
      plugins.ts          # GET /api/plugins
      serial.ts           # Serial port scan/connect
    services/
      SerialService.ts    # serialport wrapper
      BleService.ts       # noble BLE wrapper
      DeviceManager.ts    # active connection registry
      FunctionRunner.ts   # vm sandbox executor
      FlowEngine.ts       # React Flow graph executor
    socket/
      deviceSocket.ts     # Socket.io device events
      flowSocket.ts       # Socket.io flow events
    plugins/
      esp32-motor-car.ts
      arduino-sensor-board.ts
      generic-ble.ts
    prisma/
      client.ts
```

### REST API Endpoints

```
# Devices
GET    /api/devices              # list all devices
POST   /api/devices              # create device
GET    /api/devices/:id          # get device
PUT    /api/devices/:id          # update device
DELETE /api/devices/:id          # delete device
POST   /api/devices/:id/connect  # connect device
POST   /api/devices/:id/disconnect
POST   /api/devices/:id/send     # send raw command

# Functions
GET    /api/devices/:id/functions
POST   /api/devices/:id/functions
PUT    /api/functions/:id
DELETE /api/functions/:id
POST   /api/functions/:id/run    # execute function

# Flows
GET    /api/devices/:id/flows
POST   /api/devices/:id/flows
PUT    /api/flows/:id
DELETE /api/flows/:id
POST   /api/flows/:id/start
POST   /api/flows/:id/stop

# Dashboards
GET    /api/devices/:id/dashboards
POST   /api/devices/:id/dashboards
PUT    /api/dashboards/:id
DELETE /api/dashboards/:id

# Serial
GET    /api/serial/ports         # list available COM ports

# Plugins
GET    /api/plugins              # list built-in plugins
POST   /api/plugins/:id/apply/:deviceId  # apply plugin to device
```

### Socket.io Events

```ts
// Server → Client
'device:data'       // incoming data from device { deviceId, data, timestamp }
'device:status'     // connection status change { deviceId, status }
'device:log'        // new log entry { deviceId, direction, data }
'flow:log'          // flow execution log { flowId, nodeId, message }
'function:result'   // function execution result { functionId, output, error }

// Client → Server
'device:send'       // send command to device { deviceId, command }
'flow:start'        // start a flow { flowId }
'flow:stop'         // stop a flow { flowId }
'function:run'      // run a function { functionId, params }
```

### FunctionRunner (Sandboxed JS Execution)
```ts
// Runs user-written JS in a vm sandbox with device API injected
const sandbox = {
  device: {
    send: (cmd: string) => deviceManager.send(deviceId, cmd),
    onData: (cb: Function) => deviceManager.subscribe(deviceId, cb),
    log: (msg: string) => emitLog(deviceId, msg),
  },
  delay: (ms: number) => new Promise(r => setTimeout(r, ms)),
  console: { log: (...args) => emitLog(deviceId, args.join(' ')) },
};
vm.createContext(sandbox);
vm.runInContext(userCode, sandbox, { timeout: 30000 });
```

### FlowEngine
- Parses React Flow `nodes` + `edges` from DB
- Topological sort → execute nodes in order
- Node types: `trigger`, `send`, `condition`, `delay`, `transform`, `log`
- Runs on `setInterval` or event-triggered basis

---

## Frontend Architecture (`apps/web`)

### Directory Structure
```
apps/web/
  app/
    page.tsx                    # Home — device list
    devices/
      [id]/
        page.tsx                # Device overview
        dashboard/page.tsx      # Widget dashboard
        functions/page.tsx      # Function list
        functions/[fnId]/page.tsx  # Function editor
        flows/page.tsx          # Flow list
        flows/[flowId]/page.tsx # Flow builder
        logs/page.tsx           # Device logs
        settings/page.tsx       # Device settings
    plugins/page.tsx            # Plugin browser
    settings/page.tsx           # Global settings
  components/
    devices/
      DeviceCard.tsx
      DeviceStatusBadge.tsx
      AddDeviceDialog.tsx
      ConnectionConfigForm.tsx
    dashboard/
      DashboardGrid.tsx         # react-grid-layout
      widgets/
        ButtonWidget.tsx
        SliderWidget.tsx
        ToggleWidget.tsx
        GaugeWidget.tsx
        DisplayWidget.tsx
        JoystickWidget.tsx
      AddWidgetDialog.tsx
      WidgetConfigDialog.tsx
    flow-builder/
      FlowCanvas.tsx            # React Flow canvas
      nodes/
        TriggerNode.tsx
        SendNode.tsx
        ConditionNode.tsx
        DelayNode.tsx
        TransformNode.tsx
        LogNode.tsx
      FlowToolbar.tsx
      NodeConfigPanel.tsx
    function-editor/
      CodeEditor.tsx            # Monaco Editor
      FunctionToolbar.tsx
      OutputConsole.tsx
    logs/
      LogViewer.tsx
      LogEntry.tsx
    layout/
      Sidebar.tsx
      TopBar.tsx
      DeviceContextBar.tsx
  lib/
    socket.ts                   # Socket.io client singleton
    api.ts                      # API fetch helpers
    store/
      deviceStore.ts
      connectionStore.ts
      logStore.ts
  hooks/
    useDevice.ts
    useSocket.ts
    useDeviceLogs.ts
    useFlow.ts
```

---

## Pages & Features

---

### 1. Home Page (`/`)

- Header: "RoboDesk" wordmark + **+ New Device** button
- Grid of `DeviceCard` components
- Each card shows: name, type (Serial/BLE), status badge, last connected, quick-connect button
- Filter bar: All / Serial / BLE / Connected
- Empty state: illustration + "Add your first device"

---

### 2. Add Device Dialog

**Step 1 — Choose connection type:**
- Serial (USB) → shows available COM ports (fetched from `/api/serial/ports`)
- Bluetooth (BLE) → triggers WebBluetooth scan in browser

**Step 2 — Configure connection:**

*Serial config:*
```
Port:      [/dev/ttyUSB0 ▼]   (dropdown from scanned ports)
Baud Rate: [115200 ▼]
Data Bits: [8 ▼]
Parity:    [None ▼]
Stop Bits: [1 ▼]
```

*BLE config:*
```
Device Name:        [auto-filled from scan]
Service UUID:       [auto-detect or manual]
Write Char UUID:    [_______________]
Notify Char UUID:   [_______________]
Protocol:           [UART ▼] [Custom GATT ▼]
```

**Step 3 — Apply plugin (optional):**
- Browse plugin cards: ESP32 Motor Car, Arduino Sensor Board, Generic BLE, Custom
- Applying a plugin pre-fills functions, dashboard widgets, and connection config

**Step 4 — Name & Save**

---

### 3. Device Overview Page (`/devices/[id]`)

- Top: `DeviceContextBar` — device name, status, connect/disconnect button, breadcrumb nav
- Tab navigation: **Dashboard | Functions | Flows | Logs | Settings**
- Quick stats row: uptime, messages sent, messages received, last data

---

### 4. Dashboard Page (`/devices/[id]/dashboard`)

**Layout**
- `react-grid-layout` drag-and-drop widget grid
- Top toolbar: **+ Add Widget**, **Edit Layout** toggle, **Save Layout**
- Edit mode: widgets show resize handles + drag handles + config/delete icons

**Widget Types**

| Widget | Config | Sends |
|---|---|---|
| Button | label, command, color, size | `command` string on press |
| Slider | label, min, max, step, command prefix | `{prefix}{value}` on change |
| Toggle | label, onCommand, offCommand, color | on/off command on toggle |
| Gauge | label, min, max, unit, dataKey | reads incoming telemetry |
| Display | label, dataKey, unit, fontSize | shows incoming data value |
| Joystick | size, sensitivity, commandTemplate | `{dir, x, y, speed}` |

**Add Widget Dialog**
- Widget type picker (icon grid)
- Config form (type-specific)
- Preview of widget before adding

**Edit Widget Dialog**
- Same config form, pre-filled
- Delete button

**Real-time data binding**
- Gauge + Display widgets subscribe to `device:data` Socket.io events
- Data parsed by `dataKey` (e.g. `"sensor.temperature"` from JSON payload)

---

### 5. Functions Page (`/devices/[id]/functions`)

- List of functions: name, type (Code/Flow), trigger type, last run, run button
- **+ New Function** button → dialog: name, type (Code or Flow), trigger
- Quick **Run** button on each row → executes and shows inline output toast

---

### 6. Function Editor (`/devices/[id]/functions/[fnId]`)

**Layout — split pane:**
```
┌─────────────────────────────────────────────────────────┐
│  [▶ Run]  [💾 Save]  Trigger: [Manual ▼]   [Interval: 1000ms] │
├──────────────────────────────┬──────────────────────────┤
│                              │                          │
│   Monaco Editor              │   Output Console         │
│   (JS code)                  │   (logs + results)       │
│                              │                          │
│                              │   > Connecting...        │
│                              │   > Sent: {"type":"move"}│
│                              │   > Received: OK         │
│                              │                          │
└──────────────────────────────┴──────────────────────────┘
```

**Monaco Editor config:**
- Language: JavaScript
- Theme: matches app dark/light theme (`vs-dark` / `vs`)
- IntelliSense: inject `device` API type definitions so autocomplete works
- Snippets: `device.send()`, `device.onData()`, `delay()`

**Device API available in editor:**
```ts
// Type definitions injected into Monaco
declare const device: {
  send(command: string): Promise<void>;
  onData(callback: (data: string) => void): void;
  log(message: string): void;
};
declare function delay(ms: number): Promise<void>;
```

**Trigger types:**
- `Manual` — run button only
- `Interval` — runs every N ms while device connected
- `On Data` — runs every time device sends data
- `On Connect` — runs once when device connects

**Output Console:**
- Real-time logs via `function:result` Socket.io event
- Color-coded: grey (log), green (success), red (error)
- Clear button, copy button, max 500 lines

---

### 7. Flow Builder (`/devices/[id]/flows/[flowId]`)

**Layout:**
```
┌──────────┬─────────────────────────────────┬────────────┐
│          │                                 │            │
│ Node     │   React Flow Canvas             │  Node      │
│ Palette  │   (drag, connect, arrange)      │  Config    │
│          │                                 │  Panel     │
│ Trigger  │                                 │            │
│ Send     │   [Trigger] ──→ [Delay 500ms]   │  Selected  │
│ Condition│         ──→ [Send "lights_on"]  │  node      │
│ Delay    │         ──→ [Condition] ──→ ... │  settings  │
│ Transform│                                 │            │
│ Log      │                                 │            │
│          │                                 │            │
├──────────┴─────────────────────────────────┴────────────┤
│  [▶ Start Flow]  [⏹ Stop]  [💾 Save]  Status: ● Active  │
└─────────────────────────────────────────────────────────┘
```

**Node Types:**

| Node | Config | Behavior |
|---|---|---|
| Trigger | type: manual/interval/onData, interval ms | Entry point of flow |
| Send | command string, template vars | Sends command to device |
| Condition | expression (e.g. `data > 50`), true/false ports | Branches flow |
| Delay | milliseconds | Waits before next node |
| Transform | JS expression to transform data | Mutates flow data |
| Log | message template | Emits to flow log |

**Node Config Panel** (right sidebar):
- Shows config fields for currently selected node
- Live validation
- Template variable support: `{{data}}`, `{{timestamp}}`, `{{deviceId}}`

**Flow toolbar:**
- Start / Stop flow
- Save (PUT to `/api/flows/:id`)
- Auto-layout button (dagre layout)
- Zoom controls
- Mini-map toggle

---

### 8. Logs Page (`/devices/[id]/logs`)

- Real-time scrolling log feed via Socket.io
- Color coding: 🟦 sent, 🟩 received, 🟥 error
- Filter bar: All / Sent / Received / Errors
- Search input (filter by content)
- Timestamp toggle (relative / absolute)
- Export as `.txt` or `.csv` button
- Auto-scroll toggle
- Max 2000 entries in memory (virtual list via `@tanstack/virtual`)

---

### 9. Device Settings Page (`/devices/[id]/settings`)

- Edit device name
- Re-configure connection (port, baud rate, BLE UUIDs)
- Re-apply or change plugin
- Reset device (clear all functions, flows, dashboards)
- Delete device (with confirmation dialog)
- Connection test button

---

### 10. Plugin Browser (`/plugins`)

- Grid of plugin cards
- Each card: icon, name, description, compatible devices, **Preview** + **Apply to Device**
- Preview shows: preset functions list, default dashboard screenshot
- Filter: Serial / BLE / All

**Built-in Plugins:**
| Plugin | For | Presets |
|---|---|---|
| ESP32 Motor Car | ESP32 BLE | Move, Stop, Lights, Horn, Speed slider, Joystick dashboard |
| Arduino Sensor Board | Arduino Serial | Read sensors, log data, telemetry dashboard |
| Generic BLE UART | Any BLE | Basic send/receive, raw console dashboard |
| Generic Serial | Any Serial | Terminal-style dashboard, raw send input |

---

## WebSerial Integration (Browser-side)

```ts
// lib/webserial.ts
export async function connectSerial(baudRate = 115200) {
  const port = await navigator.serial.requestPort();
  await port.open({ baudRate });

  const reader = port.readable.getReader();
  const writer = port.writable.getWriter();

  return { port, reader, writer };
}
```

- WebSerial API used **browser-side** for direct USB connection
- Falls back to **server-side `serialport`** if WebSerial not available (Firefox)
- Server-side serial proxied via Socket.io (`device:send` / `device:data` events)

---

## WebBluetooth Integration (Browser-side)

```ts
// lib/webbluetooth.ts
export async function connectBLE(serviceUUID: string, writeCharUUID: string) {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [serviceUUID] }],
  });
  const server = await device.gatt!.connect();
  const service = await server.getPrimaryService(serviceUUID);
  const writeChar = await service.getCharacteristic(writeCharUUID);

  return { device, server, writeChar };
}
```

- WebBluetooth API used browser-side
- Server-side BLE via `noble` as fallback (Linux/headless)

---

## Global UI / UX

### Theme
- Dark mode default, light mode toggle (persisted in localStorage)
- Accent color: Electric blue `#3B82F6` (Tailwind blue-500)
- Font: `Geist Mono` for code/data, `Inter` for UI
- shadcn/ui component library throughout

### Layout
```
┌────────────────────────────────────────────────────┐
│  TopBar: RoboDesk logo | breadcrumb | theme toggle  │
├────────┬───────────────────────────────────────────┤
│        │                                           │
│ Side-  │   Main Content Area                       │
│ bar    │                                           │
│        │                                           │
│ Devices│                                           │
│ ──     │                                           │
│ [dev1] │                                           │
│ [dev2] │                                           │
│ ──     │                                           │
│ Plugin │                                           │
│ Settings│                                          │
│        │                                           │
└────────┴───────────────────────────────────────────┘
```

- Sidebar: collapsible, shows device list with status dots
- Active device highlighted in sidebar
- `DeviceContextBar` (sub-nav tabs) shown when inside a device route

---

## Features Checklist

### Core (Must Have)
- [ ] Add/edit/delete devices (Serial + BLE)
- [ ] WebSerial connect/disconnect + data stream
- [ ] WebBluetooth connect/disconnect + data stream
- [ ] Server-side serial fallback via `serialport` + Socket.io
- [ ] Function editor (Monaco) with device API + sandboxed execution
- [ ] Visual flow builder (React Flow) with all node types
- [ ] Flow engine execution (server-side)
- [ ] Dashboard with drag-and-drop widgets
- [ ] All 6 widget types (button, slider, toggle, gauge, display, joystick)
- [ ] Real-time log viewer
- [ ] Plugin system (4 built-in plugins)
- [ ] SQLite persistence via Prisma
- [ ] Dark/light theme

### Nice to Have
- [ ] Export/import device configs as JSON
- [ ] Function versioning (save history)
- [ ] Flow execution history + replay
- [ ] Custom plugin creator UI
- [ ] Serial terminal widget (raw REPL)
- [ ] Telemetry charts (time-series via Recharts)
- [ ] Multiple device multi-control (control 2+ devices simultaneously)
- [ ] Keyboard shortcuts (Ctrl+S save, Ctrl+R run)
- [ ] Command palette (Ctrl+K)

---

## Getting Started (README scaffold)

```bash
# Clone & install
git clone <repo>
cd robodesk
pnpm install

# Setup DB
pnpm prisma migrate dev --name init
pnpm prisma generate

# Run dev (both frontend + backend)
pnpm dev

# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

---

## Acceptance Criteria

1. App starts with `pnpm dev` and both frontend + backend run without errors
2. User can add a Serial device, connect via WebSerial, and send/receive data
3. User can add a BLE device, connect via WebBluetooth, and send/receive data
4. Function editor runs JS code against a connected device with live console output
5. Visual flow builder saves and executes a multi-node flow on a device
6. Dashboard widgets send commands and display incoming telemetry in real-time
7. Device logs stream live and are searchable/exportable
8. Applying a plugin pre-fills functions and dashboard for a new device
9. All data persists in SQLite across server restarts
10. UI works in Chrome/Edge (WebSerial + WebBluetooth support required)
