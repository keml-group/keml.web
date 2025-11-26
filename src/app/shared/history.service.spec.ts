import { HistoryService } from './history.service';
import {Observable} from "rxjs";

interface HistoryTester {value: string}

describe('HistoryService', () => {
  let prefix = "TestHistory_"
  let service = new HistoryService<HistoryTester>(prefix);

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  it('should handle situations from a clear cache', () => {
    localStorage.clear()
    let emitted: HistoryTester | null = null;
    service.state$.subscribe(value => emitted = value);

    service.init()

    service.save({value: "s0"})
    service.save({value: "s1"})
    service.save({value: "s2"})

    expect(emitted).toEqual(null)
    expect(localStorage.getItem(service.oldestEntryName)).toEqual("0")
    expect(localStorage.getItem(service.currentEntryName)).toEqual("2")
    expect(localStorage.getItem(service.newestEntryName)).toEqual("2")

  });
});
