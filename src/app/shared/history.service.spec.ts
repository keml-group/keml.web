import { HistoryService } from './history.service';
import {fakeAsync, tick} from "@angular/core/testing";


describe('HistoryService', () => {
  interface HistoryTester {inside: string}
  let prefix = "TestHistory_"
  let service = new HistoryService<HistoryTester>(prefix);

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  it('should handle situations from a clear cache', fakeAsync(() => {
    localStorage.clear()
    let emitted: HistoryTester | null = null;
    service.state$.subscribe((value: HistoryTester | null) => emitted = value);

    service.init()

    service.save({inside: "s0"})
    service.save({inside: "s1"})
    service.save({inside: "s2"})

    tick();
    expect(emitted).toEqual(null)
    expect(localStorage.getItem(service.oldestEntryName)).toEqual("0")
    expect(localStorage.getItem(service.currentEntryName)).toEqual("2")
    expect(localStorage.getItem(service.newestEntryName)).toEqual("2")

    service.undo()
    tick()
    expect(emitted).not.toBeNull();
    expect((emitted! as HistoryTester).inside).toEqual('s1');
    expect(localStorage.getItem(service.oldestEntryName)).toEqual("0")
    expect(localStorage.getItem(service.currentEntryName)).toEqual("1")
    expect(localStorage.getItem(service.newestEntryName)).toEqual("2")

    


  }))
});
