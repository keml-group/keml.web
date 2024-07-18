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
    const content = new Blob([diagramString], {type: 'application/json'});

    const link = document.createElement('a')
    link.style.display = 'none'
    // Attach the content to the anchor
    link.href = URL.createObjectURL(content);
    link.download = fileName;
    // Append to DOM and simulate click (this will trigger the download)
    document.body.appendChild(link);
    link.click();
    // Cleanup
    document.body.removeChild(link);
  }

}
