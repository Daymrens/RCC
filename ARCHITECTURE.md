# RoboDesk Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js Frontend (Port 3000)              │ │
│  │                                                        │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │ │
│  │  │ Monaco   │  │  React   │  │ Dashboard│           │ │
│  │  │ Editor   │  │  Flow    │  │ Widgets  │           │ │
│  │  └──────────┘  └──────────┘  └──────────┘           │ │
│  │                                                        │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │         Socket.io Client                       │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐                 │ │
│  │  │ WebSerial    │  │ WebBluetooth │                 │ │
│  │  │ API          │  │ API          │                 │ │
│  │  └──────────────┘  └──────────────┘                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Express Backend (Port 3001)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   REST API                             │ │
│  │  /api/devices  /api/functions  /api/flows             │ │
│  │  /api/dashboards  /api/plugins  /api/serial           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Socket.io Server                          │ │
│  │  device:data  device:status  flow:log                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Device       │  │ Function     │  │ Flow         │    │
│  │ Manager      │  │ Runner       │  │ Engine       │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │ Serial       │  │ BLE          │                       │
│  │ Service      │  │ Service      │                       │
│  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Prisma ORM
                            ▼
                    ┌───────────────┐
                    │    SQLite     │
                    │   Database    │
                    └───────────────┘
                            │
                            │ Serial/BLE
                            ▼
                ┌───────────────────────┐
                │  Physical Devices     │
                │  Arduino / ESP32      │
                └───────────────────────┘
```

## Data Flow

### Device Connection Flow

```
User clicks "Connect"
    │
    ├─→ Browser: WebSerial.requestPort()
    │       │
    │       └─→ Direct USB connection
    │
    └─→ Server: POST /api/devices/:id/connect
            │
            ├─→ DeviceManager.connect()
            │       │
            │       ├─→ SerialService (serialport)
            │       └─→ BleService (noble)
            │
            └─→ Socket.io: emit('device:status')
                    │
                    └─→ Browser: Update UI
```

### Function Execution Flow

```
User clicks "Run"
    │
    └─→ POST /api/functions/:id/run
            │
            └─→ FunctionRunner.run()
                    │
                    ├─→ Create VM sandbox
                    │       │
                    │       └─→ Inject device API
                    │
                    ├─→ Execute user code
                    │       │
                    │       ├─→ device.send()
                    │       │       │
                    │       │       └─→ DeviceManager.send()
                    │       │               │
                    │       │               └─→ Physical device
                    │       │
                    │       └─→ device.log()
                    │               │
                    │               └─→ Socket.io: emit('function:log')
                    │
                    └─→ Return result
```

### Flow Execution Flow

```
User clicks "Start Flow"
    │
    └─→ POST /api/flows/:id/start
            │
            └─→ FlowEngine.start()
                    │
                    ├─→ Load nodes & edges from DB
                    │
                    ├─→ Topological sort
                    │       │
                    │       └─→ [Trigger] → [Send] → [Delay] → [Log]
                    │
                    └─→ Execute nodes in order
                            │
                            ├─→ TriggerNode: Start
                            │
                            ├─→ SendNode: device.send()
                            │
                            ├─→ DelayNode: await delay()
                            │
                            ├─→ ConditionNode: eval expression
                            │       │
                            │       ├─→ true → next node
                            │       └─→ false → alternate path
                            │
                            └─→ LogNode: emit log
```

### Widget Interaction Flow

```
User interacts with widget
    │
    ├─→ ButtonWidget: onClick
    │       │
    │       └─→ socket.emit('device:send', command)
    │
    ├─→ SliderWidget: onChange
    │       │
    │       └─→ socket.emit('device:send', value)
    │
    └─→ JoystickWidget: onMove
            │
            └─→ socket.emit('device:send', {x, y})

Server receives command
    │
    └─→ DeviceManager.send()
            │
            └─→ Physical device

Device sends data back
    │
    └─→ Socket.io: emit('device:data')
            │
            └─→ GaugeWidget: Update display
            └─→ DisplayWidget: Update value
```

## Component Hierarchy

```
App Layout
├── Sidebar
│   ├── Device List
│   │   └── Device Status Dots
│   └── Navigation Links
│
├── TopBar
│   ├── Breadcrumbs
│   └── Theme Toggle
│
└── Main Content
    ├── Home Page
    │   ├── Device Grid
    │   │   └── Device Cards
    │   └── Add Device Dialog
    │       ├── Connection Type Selector
    │       ├── Connection Config Form
    │       └── Plugin Selector
    │
    ├── Device Page
    │   ├── Device Header
    │   │   ├── Status Badge
    │   │   └── Connect/Disconnect Button
    │   │
    │   ├── Dashboard Tab
    │   │   ├── Dashboard Grid
    │   │   │   ├── Button Widget
    │   │   │   ├── Slider Widget
    │   │   │   ├── Toggle Widget
    │   │   │   ├── Gauge Widget
    │   │   │   ├── Display Widget
    │   │   │   └── Joystick Widget
    │   │   └── Add Widget Dialog
    │   │
    │   ├── Functions Tab
    │   │   ├── Function List
    │   │   └── Function Editor
    │   │       ├── Monaco Editor
    │   │       ├── Function Toolbar
    │   │       └── Output Console
    │   │
    │   ├── Flows Tab
    │   │   ├── Flow List
    │   │   └── Flow Builder
    │   │       ├── Node Palette
    │   │       ├── React Flow Canvas
    │   │       │   ├── Trigger Node
    │   │       │   ├── Send Node
    │   │       │   ├── Condition Node
    │   │       │   ├── Delay Node
    │   │       │   ├── Transform Node
    │   │       │   └── Log Node
    │   │       └── Flow Toolbar
    │   │
    │   ├── Logs Tab
    │   │   └── Log Viewer
    │   │       ├── Filter Bar
    │   │       ├── Search Input
    │   │       └── Log Entries
    │   │
    │   └── Settings Tab
    │       ├── General Settings
    │       ├── Connection Config
    │       └── Danger Zone
    │
    └── Plugins Page
        ├── Plugin Grid
        │   └── Plugin Cards
        └── Apply Plugin Dialog
```

## State Management

### Client State (Zustand - if needed)
- Device list
- Active device
- Connection status
- Theme preference

### Server State (Database)
- Devices
- Functions
- Flows
- Dashboards
- Widgets
- Logs
- Plugins

### Real-time State (Socket.io)
- Device data stream
- Connection status
- Log stream
- Flow execution logs
- Function results

## Security Model

```
Browser
    │
    ├─→ WebSerial: User permission required
    ├─→ WebBluetooth: User permission required
    └─→ Socket.io: Origin validation

Server
    │
    ├─→ CORS: Configured origins only
    ├─→ VM Sandbox: Isolated function execution
    │       │
    │       ├─→ Limited API surface
    │       ├─→ 30s timeout
    │       └─→ No file system access
    │
    └─→ Input validation: All API endpoints
```

## Plugin Architecture

```
Plugin Definition
    │
    ├─→ Metadata
    │   ├─→ id, name, description
    │   └─→ deviceType (serial/ble)
    │
    ├─→ Connection Config
    │   ├─→ baudRate, port (serial)
    │   └─→ UUIDs, protocol (BLE)
    │
    ├─→ Preset Functions
    │   ├─→ name, type, trigger
    │   └─→ code
    │
    └─→ Preset Dashboards
        ├─→ name, layout
        └─→ widgets[]
            ├─→ type, label, command
            └─→ config, position

Apply Plugin
    │
    ├─→ Update device config
    ├─→ Create functions
    ├─→ Create dashboard
    └─→ Create widgets
```

## Technology Stack Details

### Frontend Stack
```
Next.js 14 (App Router)
    ├─→ React 18
    ├─→ TypeScript
    └─→ Tailwind CSS

React Flow
    └─→ Visual flow builder

Monaco Editor
    └─→ Code editor

Socket.io Client
    └─→ Real-time communication

Zustand (optional)
    └─→ State management

Lucide React
    └─→ Icons

Sonner
    └─→ Toast notifications
```

### Backend Stack
```
Node.js 20+
    └─→ Express.js
        ├─→ REST API
        └─→ Middleware

Socket.io Server
    └─→ Real-time events

Prisma ORM
    └─→ SQLite
        └─→ Database

serialport
    └─→ Serial communication

@abandonware/noble
    └─→ BLE communication

vm (Node.js)
    └─→ Sandboxed execution
```

## Performance Considerations

- Virtual scrolling for logs (2000+ entries)
- Debounced widget updates
- Lazy loading for Monaco Editor
- React Flow optimizations
- Socket.io event throttling
- Database indexing on deviceId
- Connection pooling (if PostgreSQL)

## Scalability

Current design supports:
- Single user / small team
- Multiple devices per user
- Hundreds of functions/flows
- Thousands of log entries
- Real-time updates for 10+ concurrent devices

For larger scale:
- Add Redis for Socket.io adapter
- Use PostgreSQL with pooling
- Add load balancer
- Implement caching layer
- Add message queue for device commands
