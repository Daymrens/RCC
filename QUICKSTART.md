# RoboDesk Quick Start Guide

Get up and running with RoboDesk in 5 minutes!

## Installation

```bash
# 1. Install pnpm (if not already installed)
npm install -g pnpm

# 2. Install dependencies
pnpm install

# 3. Setup database
pnpm db:migrate
pnpm db:generate

# 4. Start the app
pnpm dev
```

Open http://localhost:3000 in Chrome or Edge.

## Your First Device

### Adding a Serial Device (Arduino/ESP32 via USB)

1. Click **+ New Device** on the home page
2. Select **Serial (USB)**
3. Choose your COM port from the dropdown
4. Select baud rate (usually 115200 for ESP32, 9600 for Arduino)
5. Name your device and click **Save Device**

### Adding a BLE Device

1. Click **+ New Device**
2. Select **Bluetooth BLE**
3. Enter device name and UUIDs
4. Click **Save Device**

## Creating Your First Function

1. Go to your device page
2. Click **Functions** tab
3. Click **+ New Function**
4. Write JavaScript code using the device API:

```javascript
// Send a command
await device.send('{"type":"ping"}');

// Log a message
device.log('Hello from RoboDesk!');

// Listen for data
device.onData((data) => {
  device.log('Received: ' + data);
});

// Wait/delay
await delay(1000);
```

5. Click **Run** to test
6. Click **Save** to keep it

## Building Your First Flow

1. Go to **Flows** tab
2. Click **+ New Flow**
3. Drag nodes from the left palette:
   - **Trigger** - Start point (manual or interval)
   - **Send** - Send command to device
   - **Delay** - Wait before next step
   - **Log** - Output a message
4. Connect nodes by dragging from output to input handles
5. Click **Save**, then **Start** to run

## Creating a Dashboard

1. Go to **Dashboard** tab
2. Click **+ Add Widget**
3. Choose widget type:
   - **Button** - Send a command on click
   - **Slider** - Send values from min to max
   - **Toggle** - On/off switch
   - **Gauge** - Display incoming sensor data
   - **Display** - Show text/numbers
   - **Joystick** - 2D control (x, y coordinates)
4. Configure and click **Add Widget**

## Using Plugins

1. Go to **Plugins** page
2. Browse available plugins:
   - **ESP32 Motor Car** - BLE car control
   - **Arduino Sensor Board** - Serial sensor reading
3. Click **Apply** on a plugin
4. Select your device
5. Plugin will add preset functions and dashboard!

## Tips

- Use **WebSerial** in Chrome for direct USB connection (no server needed)
- Check **Logs** tab to see all communication
- Use **Settings** to test connection or delete device
- Set function trigger to **Interval** for automatic execution
- Use **{{variable}}** in flow nodes for dynamic values

## Troubleshooting

**Device won't connect?**
- Check USB cable is data-capable (not charge-only)
- Verify correct COM port and baud rate
- Try clicking "Test Connection" in Settings

**WebSerial not working?**
- Use Chrome or Edge browser
- Grant permission when prompted
- Check device isn't already open in another app

**Function errors?**
- Check syntax in Monaco editor
- Use `console.log()` for debugging
- View errors in Output Console

## Next Steps

- Explore the flow builder for complex automation
- Create custom dashboards for your devices
- Check out the plugin system for presets
- Read the full README for API documentation

Happy building! 🚀
