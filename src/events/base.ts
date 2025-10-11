type MessageHandler = (payload: any) => void;

class BroadcastChannelManager {
  private channel: BroadcastChannel;
  private listeners: Map<string, Set<MessageHandler>> = new Map();

  constructor(channelName: string) {
    this.channel = new BroadcastChannel(channelName);
    this.channel.onmessage = (event) => {
      const eventType = event.data.type;
      console.log("Received message:", event.data);
      if (this.listeners.has(eventType)) {
        const handlers = this.listeners.get(eventType);
        console.log(`Notifying ${handlers?.size} listeners for event: ${eventType}`);
        if (handlers && handlers.size > 0) {
          handlers.forEach(handler => handler(event.data.payload));
        }
      }

    };
  }

  broadcast(message: any) {
    console.log("Broadcasting message:", message, this.channel);
    this.channel.postMessage(message);
    this.channel.onmessage?.({ data: message } as MessageEvent); // Also notify self
  }

  register(eventType: string, handler: MessageHandler) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(handler);
    console.log(`Registered handler for event: ${eventType}`, this.listeners);
  }

  deregister(eventType: string, handler: MessageHandler) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType)?.delete(handler);
      if (this.listeners.get(eventType)?.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }
}

export const bcm = new BroadcastChannelManager('aispl-events');