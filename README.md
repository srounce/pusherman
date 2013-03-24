# Pusherman
----------------------------
Some shit I wrote on a snowy sunday afternoon.
Static fileserver with live refresh capabilities.

## Installation
```bash
$ npm -g install pusherman
```

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
$ cd /path/to/html/project
$ pusherman
```
