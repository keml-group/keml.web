import { Author } from './author';
import {RefHandler} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";
import {AuthorJson} from "@app/shared/keml/json/sequence-diagram-models";

describe('Author', () => {
  it('should create an instance', () => {
    expect(new Author()).toBeTruthy();
  });

  it('should deserialize an authorJson', () => {
    let ref = RefHandler.createRef("", EClasses.Author)
    let authorJson: AuthorJson = {}
    let author = Author.fromJson(authorJson, ref)
    expect(author.messages?.length).toBe(0);
    expect(author.preknowledge?.length).toEqual(0)
    expect(author.name).toEqual("")
    expect(author.xPosition).toEqual(0)
  })
});
