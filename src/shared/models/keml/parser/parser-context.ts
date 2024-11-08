export class ParserContext {

  context: Map<string, any> = new Map<string, any>();

  private static computePrefix(formerPrefix: string, ownHeader: string): string {
    return formerPrefix+'/@'+ownHeader;
  }

  get<T>(key: string): T {
    return (this.context.get(key) as T);
  }

  // todo when? on singletons? will we ever need that?
  put<T>(ref: string, elem: T ) {
    this.context.set(ref, elem);
  }

  putList<T>(formerPrefix: string, ownHeader: string, content: T[]) {
    const prefix = ParserContext.computePrefix(formerPrefix, ownHeader);
    content?.forEach((t: T, index) =>
      this.context.set(prefix+'.'+index, t)
    )
  }

}
