# Code Library Guide

## Overview

The Code Library is a powerful feature that lets you create, manage, and reuse code templates independently of any device. Write your code once, then apply it to any device whenever you need it.

---

## Why Use Code Library?

### Traditional Workflow (Before)
1. Create a device
2. Connect to device
3. Write function code
4. Test on device
5. Repeat for each device

### New Workflow (With Code Library)
1. Write code in library (no device needed)
2. Test and refine
3. Apply to any device instantly
4. Reuse across multiple devices

---

## Features

### ✨ Core Features

- **Device-Independent** - Write code without needing a connected device
- **Full Monaco Editor** - VS Code-like editing experience
- **Reusable Templates** - Create once, use many times
- **Organization** - Categories and tags for easy searching
- **Version Control** - Edit and update templates anytime
- **Quick Apply** - One-click application to any device

### 📝 Template Properties

Each template includes:
- **Name** - Descriptive template name
- **Description** - What the template does
- **Type** - Code function or visual flow
- **Code** - JavaScript code with device API
- **Trigger** - Manual, interval, or event
- **Category** - Organize by type (Motors, Sensors, etc.)
- **Tags** - Keywords for searching

---

## Getting Started

### 1. Access Code Library

Click **"Code Library"** in the sidebar (📚 icon)

### 2. Create Your First Template

1. Click **"New Template"** button
2. Fill in template details:
   - Name: e.g., "Motor Forward"
   - Description: e.g., "Move motor forward at full speed"
   - Category: e.g., "Motors"
   - Tags: e.g., "motor, movement, forward"

3. Write your code:
```javascript
// Send motor forward command
await device.send('{"type":"move","direction":"forward","speed":255}');
device.log('Motor moving forward');
```

4. Set trigger type:
   - **Manual** - Run on button click
   - **Interval** - Run every X milliseconds
   - **Event** - Run on device events

5. Click **"Save Template"**

### 3. Apply Template to Device

1. From Code Library, find your template
2. Click **"Apply"** button
3. Select target device from dropdown
4. Click **"Apply to Device"**
5. Template is now a function on that device!

---

## Use Cases

### 1. Building a Function Library

Create a collection of reusable functions:
- Motor control (forward, backward, turn)
- Sensor reading (temperature, distance, light)
- LED patterns (blink, fade, rainbow)
- Communication protocols (I2C, SPI, UART)

### 2. Prototyping Without Hardware

Write and test code logic before hardware arrives:
```javascript
// Test your algorithm first
async function calculatePID(setpoint, current) {
  const error = setpoint - current;
  const output = kP * error;
  device.log(`PID Output: ${output}`);
  return output;
}
```

### 3. Sharing Code Across Projects

Create templates for common tasks:
- Initialization sequences
- Error handling patterns
- Data formatting functions
- Communication protocols

### 4. Team Collaboration

Build a shared library of tested functions:
- Standard motor control
- Sensor calibration routines
- Safety checks
- Diagnostic functions

---

## Example Templates

### Example 1: LED Blink

```javascript
// Blink LED on/off
let state = false;

async function blink() {
  state = !state;
  await device.send(`{"led": ${state}}`);
  device.log(`LED ${state ? 'ON' : 'OFF'}`);
}

// Run every 500ms
setInterval(blink, 500);
```

**Settings:**
- Trigger: Interval
- Interval: 500ms
- Category: LEDs
- Tags: led, blink, basic

---

### Example 2: Distance Sensor Reader

```javascript
// Read distance sensor
device.onData((data) => {
  try {
    const parsed = JSON.parse(data);
    if (parsed.distance) {
      device.log(`Distance: ${parsed.distance}cm`);
      
      // Alert if too close
      if (parsed.distance < 10) {
        device.log('WARNING: Object too close!');
      }
    }
  } catch (e) {
    device.log('Error parsing data');
  }
});

device.log('Distance sensor monitoring started');
```

**Settings:**
- Trigger: Event
- Category: Sensors
- Tags: distance, sensor, ultrasonic

---

### Example 3: Motor Speed Ramp

```javascript
// Gradually increase motor speed
async function rampUp() {
  device.log('Starting motor ramp');
  
  for (let speed = 0; speed <= 255; speed += 10) {
    await device.send(`{"motor": ${speed}}`);
    device.log(`Speed: ${speed}`);
    await delay(100);
  }
  
  device.log('Ramp complete');
}

rampUp();
```

**Settings:**
- Trigger: Manual
- Category: Motors
- Tags: motor, ramp, smooth

---

### Example 4: Data Logger

```javascript
// Log sensor data with timestamp
const readings = [];

device.onData((data) => {
  const reading = {
    timestamp: Date.now(),
    data: data,
    parsed: tryParse(data)
  };
  
  readings.push(reading);
  device.log(`Logged reading #${readings.length}`);
  
  // Export every 100 readings
  if (readings.length >= 100) {
    device.log('Export data: ' + JSON.stringify(readings));
    readings.length = 0;
  }
});

function tryParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}
```

**Settings:**
- Trigger: Event
- Category: Data
- Tags: logging, data, export

---

## Best Practices

### 1. Naming Conventions

Use clear, descriptive names:
- ✅ "Motor Forward Full Speed"
- ✅ "Read Temperature Sensor"
- ❌ "Function 1"
- ❌ "Test"

### 2. Add Good Descriptions

Explain what the template does:
```
Description: Reads temperature from DHT22 sensor every 5 seconds
and logs the value. Alerts if temperature exceeds 30°C.
```

### 3. Use Categories

Organize templates by function:
- Motors
- Sensors
- LEDs
- Communication
- Utilities
- Safety

### 4. Tag Appropriately

Add relevant tags for easy searching:
- Device types: arduino, esp32, raspberry-pi
- Functions: motor, sensor, led, servo
- Protocols: i2c, spi, uart, ble

### 5. Comment Your Code

```javascript
// Initialize motor controller
await device.send('{"cmd":"init"}');

// Wait for initialization
await delay(1000);

// Set motor speed (0-255)
const speed = 200;
await device.send(`{"motor":${speed}}`);
```

### 6. Handle Errors

```javascript
try {
  await device.send('{"cmd":"move"}');
  device.log('Command sent successfully');
} catch (error) {
  device.log('Error: ' + error.message);
}
```

---

## Workflow Examples

### Workflow 1: Rapid Prototyping

1. Create template: "Test Motor Control"
2. Write basic motor code
3. Apply to Device A
4. Test and debug
5. Update template with fixes
6. Apply updated version to Device B
7. Repeat until perfect

### Workflow 2: Multi-Device Setup

1. Create templates:
   - "Robot Init Sequence"
   - "Motor Control"
   - "Sensor Reading"
   - "Emergency Stop"

2. Apply all templates to Robot 1
3. Test and verify
4. Apply same templates to Robot 2, 3, 4...
5. All robots have identical functionality

### Workflow 3: Code Library Building

1. Start new project
2. Create templates for common tasks
3. Build up library over time
4. Reuse in future projects
5. Share with team

---

## Tips & Tricks

### Quick Apply to Multiple Devices

1. Create template once
2. Use "Apply" button for each device
3. All devices get the same function

### Template Versioning

1. Edit template anytime
2. Changes don't affect already-applied functions
3. Re-apply to update devices

### Testing Without Device

1. Write code in library
2. Use `device.log()` for debugging
3. Test logic before applying

### Organizing Large Libraries

1. Use consistent naming
2. Add detailed descriptions
3. Use categories and tags
4. Delete unused templates

---

## API Reference

### Available in Templates

```javascript
// Send data to device
await device.send(data);

// Receive data from device
device.onData((data) => {
  // Handle incoming data
});

// Log messages
device.log(message);

// Async delay
await delay(milliseconds);
```

---

## Keyboard Shortcuts

- `Ctrl+S` / `Cmd+S` - Save template
- `Ctrl+K` / `Cmd+K` - Command palette
- `Esc` - Close dialogs

---

## FAQ

### Q: Can I edit a template after applying it?
**A:** Yes! Edit the template anytime. Already-applied functions won't change automatically - you need to re-apply the template to update them.

### Q: Can I apply one template to multiple devices?
**A:** Absolutely! That's the main benefit. Create once, apply to as many devices as you need.

### Q: What happens if I delete a template?
**A:** The template is removed from the library, but functions already applied to devices remain unchanged.

### Q: Can I export/import templates?
**A:** Not yet, but this feature is planned for a future release.

### Q: Do templates work with both Serial and BLE devices?
**A:** Yes! Templates are device-agnostic and work with any connection type.

### Q: Can I create flow templates?
**A:** The UI is ready, but visual flow templates are coming in a future update. For now, focus on code templates.

---

## Troubleshooting

### Template won't save
- Check that name field is filled
- Ensure code has no syntax errors
- Try refreshing the page

### Can't apply template to device
- Verify device exists
- Check device is in device list
- Ensure template is saved

### Code editor not loading
- Wait a few seconds for Monaco to load
- Refresh the page
- Check browser console for errors

---

## What's Next?

Future enhancements planned:
- Visual flow templates
- Template import/export
- Template marketplace
- Template search and filtering
- Template categories sidebar
- Code snippets library
- Template testing environment

---

## Summary

The Code Library transforms how you work with RoboDesk:

1. **Write First** - Create code without hardware
2. **Organize** - Build a library of reusable functions
3. **Apply Anywhere** - Use templates on any device
4. **Save Time** - No more rewriting the same code
5. **Share** - Build team libraries

Start building your code library today! 🚀

---

**Need Help?**
- See main documentation: `README.md`
- Check examples above
- Visit: https://github.com/Daymrens/RCC
