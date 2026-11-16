import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Shown for any unknown route (wildcard `**` in app.routes). */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
