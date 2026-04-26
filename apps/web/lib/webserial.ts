export async function connectSerial(baudRate = 115200) {
  if (!('serial' in navigator)) {
    throw new Error('Web Serial API not supported');
  }

  const port = await (navigator as any).serial.requestPort();
  await port.open({ baudRate });

  const reader = port.readable.getReader();
  const writer = port.writable.getWriter();

  return { port, reader, writer };
}

export async function disconnectSerial(port: any) {
  if (port) {
    await port.close();
  }
}

export async function sendSerial(writer: any, data: string) {
  const encoder = new TextEncoder();
  await writer.write(encoder.encode(data));
}

export async function readSerial(reader: any, callback: (data: string) => void) {
  const decoder = new TextDecoder();
  
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      callback(decoder.decode(value));
    }
  } catch (error) {
    console.error('Serial read error:', error);
  }
}
