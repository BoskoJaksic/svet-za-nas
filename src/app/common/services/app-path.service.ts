// app-path.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppPathService {
  private appPath: string = '';

  constructor() { }

  setAppPath(path: string) {
    this.appPath = path;
  }

  getAppPath(): string {
    return this.appPath;
  }
}
