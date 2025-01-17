# KemlWeb

This project holds the source code of the [KEML web-editor](https://keml-group.github.io/web-editor/). While the editor is public, the sources currently remain private.

A new version of the live web editor can be packaged with running 'ng run keml.graphical:package'. It will generate a browser only app version, that is then available under dist/docs and should be deployed to the web editor.

A push or pull request to main automatically triggers a pipeline that deploys the packaged web version to the web-editor project via a fine-grained access token of the group.



This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
