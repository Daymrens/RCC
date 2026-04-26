# RoboDesk Testing Checklist

Use this checklist to verify all features are working correctly.

## ✅ Setup & Installation

- [ ] Node.js 20+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Dependencies installed (`pnpm install`)
- [ ] Database migrated (`pnpm db:migrate`)
- [ ] Prisma client generated (`pnpm db:generate`)
- [ ] Dev servers start (`pnpm dev`)
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend accessible at http://localhost:3001
- [ ] No console errors on startup

## ✅ Home Page

- [ ] Page loads without errors
- [ ] "RoboDesk" logo visible in sidebar
- [ ] "Devices" heading visible
- [ ] "+ New Device" button visible
- [ ] Empty state shows when no devices
- [ ] Sidebar is collapsible
- [ ] Theme toggle works (dark/light)

## ✅ Add Device - Serial

- [ ] Click "+ New Device" opens dialog
- [ ] Step indicator shows (1-2-3)
- [ ] Can select "Serial (USB)" type
- [ ] "Next" button works
- [ ] Port dropdown shows available ports
- [ ] Baud rate selector works (9600, 115200, etc.)
- [ ] Data bits, parity, stop bits selectors work
- [ ] Can enter device name
- [ ] "Save Device" button works
- [ ] Device appears in home page grid
- [ ] Device appears in sidebar

## ✅ Add Device - BLE

- [ ] Can select "Bluetooth BLE" type
- [ ] Device name input works
- [ ] Service UUID input works
- [ ] Write Characteristic UUID input works
- [ ] Notify Characteristic UUID input works
- [ ] Protocol selector works (UART/Custom)
- [ ] Summary shows configuration
- [ ] Device saves successfully

## ✅ Device Card

- [ ] Device name displays
- [ ] Device type displays (Serial/Bluetooth)
- [ ] Status badge shows correct state
- [ ] Status dot color matches state
- [ ] Hover effect works
- [ ] Click navigates to device page

## ✅ Device Overview Page

- [ ] Device name in header
- [ ] Status badge visible
- [ ] Connect/Disconnect button visible
- [ ] Tab navigation visible (Dashboard, Functions, Flows, Logs, Settings)
- [ ] Stats cards show (Uptime, Messages Sent, Messages Received)
- [ ] Device info card shows type, status, created date
- [ ] Clicking tabs navigates correctly

## ✅ Device Connection

- [ ] Click "Connect" button
- [ ] Status changes to "Connecting..."
- [ ] Status changes to "Connected" (if device available)
- [ ] Status dot animates (pulse)
- [ ] Click "Disconnect" button
- [ ] Status changes to "Disconnected"
- [ ] Connection persists across page refreshes

## ✅ Dashboard Page

- [ ] "Dashboard" heading visible
- [ ] "+ Add Widget" button visible
- [ ] "Edit Layout" button visible
- [ ] Empty state shows when no widgets
- [ ] Widget grid displays when widgets exist

## ✅ Add Widget Dialog

- [ ] Click "+ Add Widget" opens dialog
- [ ] 6 widget types visible (Button, Slider, Toggle, Gauge, Display, Joystick)
- [ ] Can select widget type
- [ ] Label input works
- [ ] Command input works
- [ ] Type-specific config shows (min/max for slider, etc.)
- [ ] "Add Widget" button works
- [ ] Widget appears in dashboard
- [ ] Dialog closes after adding

## ✅ Button Widget

- [ ] Widget displays with label
- [ ] Button is clickable
- [ ] Button shows press animation
- [ ] Command sends on click (check logs)

## ✅ Slider Widget

- [ ] Widget displays with label
- [ ] Slider is draggable
- [ ] Current value displays
- [ ] Min/max labels show
- [ ] Command sends on change (check logs)

## ✅ Toggle Widget

- [ ] Widget displays with label
- [ ] Toggle is clickable
- [ ] Toggle animates on/off
- [ ] ON/OFF text displays
- [ ] Correct command sends for each state

## ✅ Gauge Widget

- [ ] Widget displays with label
- [ ] Arc gauge renders
- [ ] Value displays in center
- [ ] Min/max labels show
- [ ] Updates when data received (if device connected)

## ✅ Display Widget

- [ ] Widget displays with label
- [ ] Value displays (large text)
- [ ] Unit displays (if configured)
- [ ] Value flashes on update

## ✅ Joystick Widget

- [ ] Widget displays with label
- [ ] Canvas renders
- [ ] Joystick circle visible
- [ ] Can drag joystick
- [ ] Joystick returns to center on release
- [ ] X/Y coordinates display
- [ ] Commands send on move

## ✅ Functions Page

- [ ] "Functions" heading visible
- [ ] "+ New Function" button visible
- [ ] Empty state shows when no functions
- [ ] Function list displays when functions exist
- [ ] Each function shows name, type, trigger
- [ ] Run button visible on each function

## ✅ Function Editor - New Function

- [ ] Click "+ New Function" navigates to editor
- [ ] Monaco Editor loads
- [ ] Default code template appears
- [ ] Syntax highlighting works
- [ ] "Run" button visible
- [ ] "Save" button visible
- [ ] Trigger selector visible (Manual, Interval, OnData, OnConnect)
- [ ] Interval input shows when "Interval" selected
- [ ] Output console visible (right side)

## ✅ Function Editor - Code Editing

- [ ] Can type in editor
- [ ] Autocomplete works (Ctrl+Space)
- [ ] `device.` shows IntelliSense
- [ ] Code formatting works
- [ ] Line numbers visible
- [ ] Syntax errors highlighted

## ✅ Function Editor - Execution

- [ ] Click "Run" button
- [ ] Output console shows "Running..."
- [ ] Logs appear in console
- [ ] Errors show in red
- [ ] Sent commands show in blue
- [ ] Received data shows in green
- [ ] Clear button works
- [ ] Copy button works

## ✅ Function Editor - Save

- [ ] Click "Save" button
- [ ] Function saves successfully
- [ ] URL updates with function ID (if new)
- [ ] Can navigate away and back
- [ ] Code persists

## ✅ Flows Page

- [ ] "Flows" heading visible
- [ ] "+ New Flow" button visible
- [ ] Empty state shows when no flows
- [ ] Flow list displays when flows exist
- [ ] Each flow shows name, active status
- [ ] Start/Stop button visible on each flow

## ✅ Flow Builder - Canvas

- [ ] Click "+ New Flow" navigates to builder
- [ ] React Flow canvas loads
- [ ] Background grid visible
- [ ] Node palette visible (left side)
- [ ] 6 node types listed (Trigger, Send, Condition, Delay, Transform, Log)
- [ ] Flow toolbar visible (top)
- [ ] Controls visible (zoom, fit view)
- [ ] MiniMap visible (bottom right)

## ✅ Flow Builder - Adding Nodes

- [ ] Click node type in palette
- [ ] Node appears on canvas
- [ ] Can drag node to reposition
- [ ] Node shows correct icon and label
- [ ] Can add multiple nodes
- [ ] Each node has unique ID

## ✅ Flow Builder - Connecting Nodes

- [ ] Can drag from output handle
- [ ] Edge follows cursor
- [ ] Can connect to input handle
- [ ] Edge appears between nodes
- [ ] Edge is styled (blue, 2px)
- [ ] Can delete edge (select + Delete key)

## ✅ Flow Builder - Node Types

- [ ] Trigger node: No input handle, has output
- [ ] Send node: Has input and output
- [ ] Condition node: Has input, two outputs (true/false)
- [ ] Delay node: Has input and output
- [ ] Transform node: Has input and output
- [ ] Log node: Has input and output

## ✅ Flow Builder - Toolbar

- [ ] "Start" button visible
- [ ] "Stop" button visible
- [ ] "Save" button visible
- [ ] "Auto-layout" button visible
- [ ] Status indicator shows (Active/Inactive)
- [ ] Node count displays
- [ ] Edge count displays

## ✅ Flow Builder - Execution

- [ ] Click "Save" to save flow
- [ ] Click "Start" to run flow
- [ ] Status changes to "Active"
- [ ] Active nodes pulse/glow (if implemented)
- [ ] Flow logs appear (check console)
- [ ] Click "Stop" to stop flow
- [ ] Status changes to "Inactive"

## ✅ Logs Page

- [ ] "Logs" heading visible
- [ ] Filter buttons visible (All, In, Out, Error)
- [ ] Search input visible
- [ ] Export button visible
- [ ] Auto-scroll toggle visible
- [ ] Empty state shows when no logs
- [ ] Log entries display when logs exist

## ✅ Log Viewer

- [ ] Logs stream in real-time (when device connected)
- [ ] Timestamp displays for each entry
- [ ] Direction icon shows (→ sent, ← received)
- [ ] Sent logs are blue
- [ ] Received logs are green
- [ ] Error logs are red
- [ ] Filter buttons work
- [ ] Search filters logs
- [ ] Export downloads CSV
- [ ] Auto-scroll works
- [ ] Entry count displays

## ✅ Settings Page

- [ ] "Device Settings" heading visible
- [ ] Device name input shows current name
- [ ] Can edit device name
- [ ] "Save Changes" button works
- [ ] Connection info displays (type, status, port/UUIDs)
- [ ] "Test Connection" button visible
- [ ] "Delete Device" button visible (red)
- [ ] Delete shows confirmation dialog
- [ ] Confirm delete removes device
- [ ] Redirects to home after delete

## ✅ Plugins Page

- [ ] "Plugins" heading visible
- [ ] Plugin grid displays
- [ ] 4 plugins visible:
  - [ ] ESP32 Motor Car
  - [ ] Arduino Sensor Board
  - [ ] Generic BLE UART
  - [ ] Generic Serial
- [ ] Each plugin shows icon, name, description, type
- [ ] "Apply" button visible on each plugin

## ✅ Apply Plugin

- [ ] Click "Apply" on a plugin
- [ ] Dialog opens
- [ ] Device selector shows compatible devices only
- [ ] Can select device
- [ ] "Apply Plugin" button works
- [ ] Plugin applies successfully
- [ ] Redirects to device page
- [ ] Preset functions created
- [ ] Preset dashboard created
- [ ] Preset widgets created

## ✅ Sidebar

- [ ] Sidebar visible on left
- [ ] "RoboDesk" logo at top
- [ ] Collapse button works
- [ ] Collapsed state shows icons only
- [ ] Device list shows all devices
- [ ] Status dots show for each device
- [ ] Status dot colors correct
- [ ] Clicking device navigates to device page
- [ ] Active device highlighted
- [ ] "Plugins" link visible
- [ ] Hover effects work

## ✅ Theme Toggle

- [ ] Theme toggle button visible (top right)
- [ ] Click toggles between dark/light
- [ ] Dark theme: dark backgrounds, light text
- [ ] Light theme: light backgrounds, dark text
- [ ] Theme persists across page refreshes
- [ ] All components respect theme
- [ ] Transitions are smooth

## ✅ Real-time Features

- [ ] Device data streams in real-time
- [ ] Logs update in real-time
- [ ] Widget values update in real-time
- [ ] Connection status updates in real-time
- [ ] Flow logs stream in real-time
- [ ] Multiple tabs stay in sync

## ✅ Browser APIs (Chrome/Edge only)

### WebSerial
- [ ] Can request serial port
- [ ] Permission prompt appears
- [ ] Can connect to device
- [ ] Can send data
- [ ] Can receive data
- [ ] Connection is stable

### WebBluetooth
- [ ] Can request BLE device
- [ ] Permission prompt appears
- [ ] Can scan for devices
- [ ] Can connect to device
- [ ] Can send data
- [ ] Can receive data
- [ ] Connection is stable

## ✅ Database Persistence

- [ ] Stop dev servers
- [ ] Restart dev servers
- [ ] All devices still exist
- [ ] All functions still exist
- [ ] All flows still exist
- [ ] All dashboards still exist
- [ ] All widgets still exist
- [ ] All settings preserved

## ✅ Error Handling

- [ ] Invalid device config shows error
- [ ] Function execution errors show in console
- [ ] Flow execution errors show in logs
- [ ] Connection failures show error status
- [ ] API errors show toast notifications
- [ ] 404 pages work for invalid routes

## ✅ Performance

- [ ] Pages load quickly (<1s)
- [ ] No lag when typing in editor
- [ ] Smooth animations
- [ ] No memory leaks (check DevTools)
- [ ] Logs handle 100+ entries smoothly
- [ ] Dashboard handles 10+ widgets smoothly
- [ ] Flow builder handles 20+ nodes smoothly

## ✅ Responsive Design

- [ ] Works at 1920x1080
- [ ] Works at 1366x768
- [ ] Works at 1280x720
- [ ] Sidebar collapses on smaller screens
- [ ] Grid layouts adapt
- [ ] No horizontal scrolling (except logs)

## ✅ Accessibility

- [ ] All buttons have hover states
- [ ] All buttons have focus indicators
- [ ] Can navigate with Tab key
- [ ] Can activate with Enter key
- [ ] Icon buttons have tooltips
- [ ] Color is not the only indicator

## ✅ Documentation

- [ ] README.md is clear and complete
- [ ] QUICKSTART.md helps get started
- [ ] ARCHITECTURE.md explains system
- [ ] All code has comments where needed
- [ ] API endpoints documented

## 🎉 Final Verification

- [ ] All core features work
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Can build for production (`pnpm build`)
- [ ] Production build runs (`pnpm start`)

---

## Bug Report Template

If you find issues, report them with:

```
**Issue:** Brief description

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. See error

**Expected:** What should happen

**Actual:** What actually happens

**Browser:** Chrome 120 / Edge 120 / etc.

**Console Errors:** (paste any errors)

**Screenshots:** (if applicable)
```

---

## Testing Tips

1. **Use Chrome or Edge** for full WebSerial/BLE support
2. **Check browser console** for errors (F12)
3. **Test with real devices** if available
4. **Test without devices** to verify UI works
5. **Try different screen sizes**
6. **Test both themes** (dark and light)
7. **Test with multiple devices** simultaneously
8. **Test persistence** by restarting servers
9. **Test error cases** (invalid input, connection failures)
10. **Test performance** with many logs/widgets/nodes

---

## Automated Testing (Future)

Consider adding:
- Unit tests (Jest)
- Integration tests (Playwright)
- E2E tests (Cypress)
- API tests (Supertest)
- Component tests (React Testing Library)
