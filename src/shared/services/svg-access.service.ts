import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SVGAccessService {

  constructor() { }

  getElemById(id: string): SVGGraphicsElement | undefined {
    let elem = document.getElementById(id)
    return elem as unknown as SVGGraphicsElement
  }
}
