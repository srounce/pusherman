# Pusherman
----------------------------
Some shit I wrote on a snowy sunday afternoon.
Static fileserver with live refresh capabilities.

## Usage
First, include the script in your page
```html
<html>
  <head>
  ...
  <script src="/.pusherman.js"></script>
  ...
  </head>
```

### CLI
Pusherman can be used as a static file server for authoring flat html like
so:
```bash
$ npm -g install pusherman
$ cd /path/to/html/project
$ pusherman
```
