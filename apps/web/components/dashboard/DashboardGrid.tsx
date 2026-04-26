'use client';

import { useState } from 'react';
import ButtonWidget from './widgets/ButtonWidget';
import SliderWidget from './widgets/SliderWidget';
import ToggleWidget from './widgets/ToggleWidget';
import GaugeWidget from './widgets/GaugeWidget';
import DisplayWidget from './widgets/DisplayWidget';
import JoystickWidget from './widgets/JoystickWidget';
import { socket } from '@/lib/socket';

interface DashboardGridProps {
  widgets: any[];
  deviceId: string;
  editMode?: boolean;
}

export default function DashboardGrid({ widgets, deviceId, editMode = false }: DashboardGridProps) {
  const [widgetData, setWidgetData] = useState<Record<string, any>>({});

  const handleSend = (command: string) => {
    socket.emit('device:send', { deviceId, command });
  };

  const renderWidget = (widget: any) => {
    const props = {
      label: widget.label,
      command: widget.command,
      config: widget.config,
      onSend: handleSend,
      value: widgetData[widget.config?.dataKey]
    };

    switch (widget.type) {
      case 'button':
        return <ButtonWidget {...props} />;
      case 'slider':
        return <SliderWidget {...props} />;
      case 'toggle':
        return <ToggleWidget {...props} />;
      case 'gauge':
        return <GaugeWidget {...props} />;
      case 'display':
        return <DisplayWidget {...props} />;
      case 'joystick':
        return <JoystickWidget {...props} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {widgets.map(widget => (
        <div
          key={widget.id}
          className={`relative ${editMode ? 'border-2 border-dashed border-accent' : ''}`}
          style={{
            gridColumn: `span ${widget.position.w || 1}`,
            gridRow: `span ${widget.position.h || 1}`
          }}
        >
          {renderWidget(widget)}
        </div>
      ))}
    </div>
  );
}
