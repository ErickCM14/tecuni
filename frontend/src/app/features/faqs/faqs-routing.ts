import { Routes } from "@angular/router";

export const FAQS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./ui/containers/faqs-page/faqs-page").then(m => m.FaqsPage)
  }
];
