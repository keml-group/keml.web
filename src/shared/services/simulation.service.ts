import { Injectable } from '@angular/core';
import {Information} from "../models/keml/msg-info";

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  constructor() { }

  openInfoTrusts(info: Information) {
    console.log("Open trust view on info")
  }
}
