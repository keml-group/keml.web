export class RefMap<T> {

  refMap: Map<string, T> = new Map();
  prefix: string = '/';
  readonly isSingleton: boolean;
  // todo also know here if singleton?

  static computePrefix(formerPrefix: string, ownHeader: string): string {
    return formerPrefix+'/@'+ownHeader;
  }

  refFromIndex(index: number): string {
    if (this.isSingleton)
      return this.prefix+'.'+index
    else {
      console.error('You should not call index computation for singleton')
      return this.prefix;
    }
  }

  // works with list and singleton
  constructor(formerPrefix: string, ownHeader: string, content: T[] = [], isSingleton: boolean = false) {
    this.isSingleton = isSingleton;
    this.prefix = RefMap.computePrefix(formerPrefix, ownHeader);
    if (!this.isSingleton) {
      content.forEach((t: T, index) =>
        this.refMap.set(this.refFromIndex(index), t)
      )
    } else {
      // single elem is first list entry
      if (content.length !== 1) throw Error('Singleton input requires content to be a list of length 1')
      this.refMap.set(this.prefix, content[0])
    }
  }

  get(ref: string): T | undefined {
    return this.refMap.get(ref);
  }

  // add at first free position (if all use it)
  add(elem: T) {
    this.refMap.set(this.prefix+'.'+this.refMap.size, elem);
  }

}
