# RoboDesk File Structure

Complete file tree with descriptions.

```
robodesk/
│
├── 📄 README.md                          # Main project documentation
├── 📄 QUICKSTART.md                      # 5-minute setup guide
├── 📄 ARCHITECTURE.md                    # System architecture overview
├── 📄 DEPLOYMENT.md                      # Production deployment guide
├── 📄 CONTRIBUTING.md                    # Contribution guidelines
├── 📄 IMPLEMENTATION_SUMMARY.md          # Feature completion checklist
├── 📄 PROJECT_SUMMARY.md                 # High-level project overview
├── 📄 FILE_STRUCTURE.md                  # This file
├── 📄 LICENSE                            # MIT License
│
├── 📄 package.json                       # Root package.json (workspace)
├── 📄 pnpm-workspace.yaml                # pnpm workspace config
├── 📄 .gitignore                         # Git ignore rules
├── 📄 .env.example                       # Environment variables template
├── 📄 .prettierrc                        # Prettier configuration
│
├── 📁 .vscode/                           # VSCode settings
│   ├── settings.json                     # Editor settings
│   └── extensions.json                   # Recommended extensions
│
├── 📁 prisma/                            # Database
│   ├── schema.prisma                     # Database schema
│   └── dev.db                            # SQLite database (generated)
│
├── 📁 packages/                          # Shared packages
│   └── 📁 shared/                        # Shared TypeScript types
│       ├── package.json
│       ├── tsconfig.json
│       └── 📁 src/
│           └── index.ts                  # Shared type definitions
│
├── 📁 apps/                              # Applications
│   │
│   ├── 📁 web/                           # Next.js Frontend
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   ├── .eslintrc.json
│   │   │
│   │   ├── 📁 app/                       # Next.js App Router
│   │   │   ├── layout.tsx                # Root layout with sidebar
│   │   │   ├── page.tsx                  # Home page (device list)
│   │   │   ├── globals.css               # Global styles
│   │   │   │
│   │   │   ├── 📁 devices/[id]/          # Device pages
│   │   │   │   ├── page.tsx              # Device overview
│   │   │   │   │
│   │   │   │   ├── 📁 dashboard/
│   │   │   │   │   └── page.tsx          # Widget dashboard
│   │   │   │   │
│   │   │   │   ├── 📁 functions/
│   │   │   │   │   ├── page.tsx          # Function list
│   │   │   │   │   └── 📁 [fnId]/
│   │   │   │   │       └── page.tsx      # Function editor
│   │   │   │   │
│   │   │   │   ├── 📁 flows/
│   │   │   │   │   ├── page.tsx          # Flow list
│   │   │   │   │   └── 📁 [flowId]/
│   │   │   │   │       └── page.tsx      # Flow builder
│   │   │   │   │
│   │   │   │   ├── 📁 logs/
│   │   │   │   │   └── page.tsx          # Log viewer
│   │   │   │   │
│   │   │   │   └── 📁 settings/
│   │   │   │       └── page.tsx          # Device settings
│   │   │   │
│   │   │   └── 📁 plugins/
│   │   │       └── page.tsx              # Plugin browser
│   │   │
│   │   ├── 📁 components/                # React components
│   │   │   │
│   │   │   ├── 📁 devices/               # Device components
│   │   │   │   ├── DeviceCard.tsx
│   │   │   │   ├── DeviceStatusBadge.tsx
│   │   │   │   ├── AddDeviceDialog.tsx
│   │   │   │   └── ConnectionConfigForm.tsx
│   │   │   │
│   │   │   ├── 📁 dashboard/             # Dashboard components
│   │   │   │   ├── DashboardGrid.tsx
│   │   │   │   ├── AddWidgetDialog.tsx
│   │   │   │   └── 📁 widgets/
│   │   │   │       ├── ButtonWidget.tsx
│   │   │   │       ├── SliderWidget.tsx
│   │   │   │       ├── ToggleWidget.tsx
│   │   │   │       ├── GaugeWidget.tsx
│   │   │   │       ├── DisplayWidget.tsx
│   │   │   │       └── JoystickWidget.tsx
│   │   │   │
│   │   │   ├── 📁 flow-builder/          # Flow builder components
│   │   │   │   ├── FlowToolbar.tsx
│   │   │   │   └── 📁 nodes/
│   │   │   │       ├── TriggerNode.tsx
│   │   │   │       ├── SendNode.tsx
│   │   │   │       ├── ConditionNode.tsx
│   │   │   │       ├── DelayNode.tsx
│   │   │   │       ├── TransformNode.tsx
│   │   │   │       └── LogNode.tsx
│   │   │   │
│   │   │   ├── 📁 function-editor/       # Function editor components
│   │   │   │   ├── FunctionToolbar.tsx
│   │   │   │   └── OutputConsole.tsx
│   │   │   │
│   │   │   ├── 📁 logs/                  # Log components
│   │   │   │   ├── LogViewer.tsx
│   │   │   │   └── LogEntry.tsx
│   │   │   │
│   │   │   └── 📁 layout/                # Layout components
│   │   │       ├── Sidebar.tsx
│   │   │       └── ThemeToggle.tsx
│   │   │
│   │   ├── 📁 lib/                       # Utilities
│   │   │   ├── socket.ts                 # Socket.io client
│   │   │   ├── webserial.ts              # WebSerial API wrapper
│   │   │   └── webbluetooth.ts           # WebBluetooth API wrapper
│   │   │
│   │   └── 📁 hooks/                     # Custom React hooks
│   │       ├── useDevice.ts              # Device state hook
│   │       ├── useDeviceLogs.ts          # Log streaming hook
│   │       ├── useFlow.ts                # Flow state hook
│   │       └── useSocket.ts              # Socket event hook
│   │
│   └── 📁 server/                        # Express Backend
│       ├── package.json
│       ├── tsconfig.json
│       ├── .eslintrc.json
│       │
│       └── 📁 src/
│           ├── index.ts                  # Server entry point
│           │
│           ├── 📁 routes/                # REST API routes
│           │   ├── devices.ts            # Device CRUD + connect/disconnect
│           │   ├── functions.ts          # Function CRUD + run
│           │   ├── flows.ts              # Flow CRUD + start/stop
│           │   ├── dashboards.ts         # Dashboard + widget CRUD
│           │   ├── plugins.ts            # Plugin list + apply
│           │   └── serial.ts             # Serial port scanning
│           │
│           ├── 📁 services/              # Business logic
│           │   ├── DeviceManager.ts      # Device connection management
│           │   ├── FunctionRunner.ts     # Sandboxed JS execution
│           │   ├── FlowEngine.ts         # Flow execution engine
│           │   └── BleService.ts         # BLE communication
│           │
│           ├── 📁 socket/                # Socket.io handlers
│           │   ├── deviceSocket.ts       # Device events
│           │   └── flowSocket.ts         # Flow events
│           │
│           └── 📁 plugins/               # Built-in plugins
│               ├── esp32-motor-car.ts    # ESP32 BLE car plugin
│               └── arduino-sensor-board.ts # Arduino sensor plugin
│
└── 📁 node_modules/                      # Dependencies (generated)
```

## Key Directories Explained

### `/apps/web/app/`
Next.js 14 App Router pages. Each folder represents a route:
- `/` → Home page
- `/devices/[id]` → Device overview
- `/devices/[id]/dashboard` → Widget dashboard
- `/devices/[id]/functions` → Function list
- `/devices/[id]/functions/[fnId]` → Function editor
- `/devices/[id]/flows` → Flow list
- `/devices/[id]/flows/[flowId]` → Flow builder
- `/devices/[id]/logs` → Log viewer
- `/devices/[id]/settings` → Device settings
- `/plugins` → Plugin browser

### `/apps/web/components/`
Reusable React components organized by feature:
- `devices/` → Device-related UI
- `dashboard/` → Dashboard and widgets
- `flow-builder/` → Flow nodes and canvas
- `function-editor/` → Code editor UI
- `logs/` → Log display
- `layout/` → App layout components

### `/apps/server/src/`
Backend organized by responsibility:
- `routes/` → Express route handlers (REST API)
- `services/` → Business logic and device communication
- `socket/` → Socket.io event handlers
- `plugins/` → Built-in plugin definitions

### `/packages/shared/`
TypeScript types shared between frontend and backend:
- Device, Function, Flow, Widget types
- Connection config types
- API request/response types

### `/prisma/`
Database schema and migrations:
- `schema.prisma` → Database models
- `dev.db` → SQLite database file (generated)

## Important Files

### Configuration
- `package.json` → Workspace root, defines scripts
- `pnpm-workspace.yaml` → Monorepo configuration
- `.env.example` → Environment variables template
- `tsconfig.json` → TypeScript configuration (per app)
- `tailwind.config.ts` → Tailwind CSS configuration
- `.prettierrc` → Code formatting rules
- `.eslintrc.json` → Linting rules

### Documentation
- `README.md` → Main documentation
- `QUICKSTART.md` → Quick setup guide
- `ARCHITECTURE.md` → System design
- `DEPLOYMENT.md` → Production guide
- `CONTRIBUTING.md` → Development guide
- `IMPLEMENTATION_SUMMARY.md` → Feature checklist
- `PROJECT_SUMMARY.md` → Project overview
- `FILE_STRUCTURE.md` → This file

### Entry Points
- `apps/web/app/layout.tsx` → Frontend root layout
- `apps/web/app/page.tsx` → Frontend home page
- `apps/server/src/index.ts` → Backend server

## File Naming Conventions

- **Pages:** `page.tsx` (Next.js convention)
- **Components:** `PascalCase.tsx` (e.g., `DeviceCard.tsx`)
- **Hooks:** `useCamelCase.ts` (e.g., `useDevice.ts`)
- **Services:** `PascalCase.ts` (e.g., `DeviceManager.ts`)
- **Routes:** `kebab-case.ts` (e.g., `devices.ts`)
- **Config:** `kebab-case.js/json` (e.g., `next.config.js`)

## Generated Files (Not in Git)

```
node_modules/           # Dependencies
.next/                  # Next.js build output
apps/server/dist/       # TypeScript compiled output
prisma/dev.db           # SQLite database
prisma/dev.db-journal   # SQLite journal
.env                    # Environment variables (local)
```

## Total File Count

- **Source files:** ~80
- **Documentation:** 8
- **Configuration:** 10
- **Total (excluding node_modules):** ~100 files

## Quick Navigation

**Want to modify...**
- Device connection logic? → `apps/server/src/services/DeviceManager.ts`
- Function execution? → `apps/server/src/services/FunctionRunner.ts`
- Flow execution? → `apps/server/src/services/FlowEngine.ts`
- Widget behavior? → `apps/web/components/dashboard/widgets/`
- Flow nodes? → `apps/web/components/flow-builder/nodes/`
- API endpoints? → `apps/server/src/routes/`
- Database schema? → `prisma/schema.prisma`
- UI theme? → `apps/web/app/globals.css` + `tailwind.config.ts`
- Plugin presets? → `apps/server/src/plugins/`

**Want to add...**
- New page? → `apps/web/app/[route]/page.tsx`
- New component? → `apps/web/components/[feature]/`
- New API endpoint? → `apps/server/src/routes/`
- New widget type? → `apps/web/components/dashboard/widgets/`
- New flow node? → `apps/web/components/flow-builder/nodes/`
- New plugin? → `apps/server/src/plugins/`
