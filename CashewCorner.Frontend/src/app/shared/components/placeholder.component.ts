import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `<div class="placeholder">Coming soon...</div>`,
  styles: [
    `.placeholder{padding:16px;border:1px dashed #e2e8f0;background:#fff;border-radius:8px;color:#64748b}`
  ]
})
export class PlaceholderComponent {}
