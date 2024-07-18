import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IoService {

  constructor() { }

  async loadStringFromFile(event: Event): Promise<string> {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    return files[0].text();
  }

  saveDiagram(diagramString: string, fileName: string) {
    const element = document.createElement('a')
    element.style.display = 'none'
    // Attach the content to the anchor
    element.setAttribute('href', 'application/json;charset=utf-8' + encodeURIComponent(diagramString))
    element.setAttribute('download', fileName)
    // Append to DOM and simulate click (this will trigger the download)
    document.body.appendChild(element)
    element.click()
    // Cleanup
    document.body.removeChild(element)
  }

}
