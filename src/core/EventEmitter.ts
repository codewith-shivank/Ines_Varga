/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Typed lightweight Event Emitter for decoupled lifecycle, scroll, and creative state events.
 */

type EventCallback<T = unknown> = (data: T) => void;

export class EventEmitter {
  private events: Map<string, Set<EventCallback>> = new Map();

  public on<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    const set = this.events.get(event)!;
    set.add(callback as EventCallback);

    return () => this.off(event, callback);
  }

  public off<T = unknown>(event: string, callback: EventCallback<T>): void {
    const set = this.events.get(event);
    if (!set) return;
    set.delete(callback as EventCallback);
    if (set.size === 0) {
      this.events.delete(event);
    }
  }

  public emit<T = unknown>(event: string, data?: T): void {
    const set = this.events.get(event);
    if (!set) return;
    for (const callback of set) {
      try {
        callback(data);
      } catch (err) {
        console.error(`Error in event listener for "${event}":`, err);
      }
    }
  }

  public once<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    const unsubscribe = this.on<T>(event, (data) => {
      unsubscribe();
      callback(data);
    });
    return unsubscribe;
  }

  public clear(): void {
    this.events.clear();
  }
}

/** Global singleton instance */
export const globalEmitter = new EventEmitter();
