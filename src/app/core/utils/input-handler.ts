export class InputHandler {

  //helps with converting an event from a number input (!) into a number...
  // should be called on (input) while (ngModelChange) delivers the value immediately on $event
  static getNewValueFromEvent($event: Event): number {
    const input = $event.target as HTMLInputElement;
    return Number(input.value);
  }
}
