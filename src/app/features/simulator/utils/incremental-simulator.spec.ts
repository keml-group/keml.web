import { IncrementalSimulator } from './incremental-simulator';
import {Conversation} from "@app/shared/keml/models/core/conversation";

describe('IncrementalSimulator', () => {
  it('should create an instance', () => {
    expect(new IncrementalSimulator(
      {defaultsPerCp: new Map()}, new Conversation()
    )).toBeTruthy();
  });
});
