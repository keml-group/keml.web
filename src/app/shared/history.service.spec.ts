import { HistoryService } from './history.service';
import {fakeAsync, tick} from "@angular/core/testing";


describe('HistoryService', () => {
  interface HistoryTester {inside: string}
  let prefix = "TestHistory_"
  let service = new HistoryService<HistoryTester>(prefix);

  beforeEach(() => {
    localStorage.clear()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  it('should handle saves, undos and redos from a clear cache', fakeAsync(() => {
    let emitted: HistoryTester | null = null;
    service.state$.subscribe((value: HistoryTester | null) => emitted = value);

    service.init()

    expect(localStorage.getItem(service.oldestEntryName)).toEqual("-1")
    expect(localStorage.getItem(service.currentEntryName)).toEqual("-1")
    expect(localStorage.getItem(service.newestEntryName)).toEqual("-1")


    service.save({inside: "s0"})
    expect(localStorage.getItem(service.oldestEntryName)).toEqual("0")
    expect(localStorage.getItem(service.currentEntryName)).toEqual("0")
    expect(localStorage.getItem(service.newestEntryName)).toEqual("0")


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


    service.undo()
    tick()
    expect(emitted).not.toBeNull();
    expect((emitted! as HistoryTester).inside).toEqual('s0');
    expect(localStorage.getItem(service.oldestEntryName)).toEqual("0")
    expect(localStorage.getItem(service.currentEntryName)).toEqual("0")
    expect(localStorage.getItem(service.newestEntryName)).toEqual("2")

    /* would require an emit even if no op
    service.undo()
    tick()
    expect(emitted).toBeNull();
    expect(localStorage.getItem(service.oldestEntryName)).toEqual("0")
    expect(localStorage.getItem(service.currentEntryName)).toEqual("0")
    expect(localStorage.getItem(service.newestEntryName)).toEqual("2")
    */

    service.redo()
    tick()
    expect(emitted).not.toBeNull();
    expect((emitted! as HistoryTester).inside).toEqual('s1');
    expect(localStorage.getItem(service.oldestEntryName)).toEqual("0")
    expect(localStorage.getItem(service.currentEntryName)).toEqual("1")
    expect(localStorage.getItem(service.newestEntryName)).toEqual("2")


  }))

  it('should remove newer elements when saving in an intermediate situation', fakeAsync(() => {
    let emitted: HistoryTester | null = null;
    service.state$.subscribe((value: HistoryTester | null) => emitted = value);

    service.init()

    service.save({inside: "s0"})
    service.save({inside: "s1"})
    service.save({inside: "s2"})
    service.save({inside: "s3"})

    service.undo()
    service.undo()
    tick()
    expect(emitted!.inside).toEqual("s1")
    expect(localStorage.getItem(service.oldestEntryName)).toEqual("0")
    expect(localStorage.getItem(service.currentEntryName)).toEqual("1")
    expect(localStorage.getItem(service.newestEntryName)).toEqual("3")

    service.save({inside: "s4"})
    expect(localStorage.getItem(service.oldestEntryName)).toEqual("0")
    expect(localStorage.getItem(service.currentEntryName)).toEqual("2")
    expect(localStorage.getItem(service.newestEntryName)).toEqual("2")

    expect(localStorage.getItem(prefix+"2")).toEqual(JSON.stringify({inside: "s4"}))
    expect(localStorage.getItem(prefix+"1")).toEqual(JSON.stringify({inside: "s1"}))
    expect(localStorage.getItem(prefix+"0")).toEqual(JSON.stringify({inside: "s0"}))
    expect(localStorage.getItem(prefix+"3")).toBeNull()


  }))
});
