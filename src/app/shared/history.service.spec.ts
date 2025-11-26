import { HistoryService } from './history.service';

interface HistoryTester {value: string}

describe('HistoryService', () => {
  let service = new HistoryService<HistoryTester>();

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  it('should handle saves', () => {

  });
});
