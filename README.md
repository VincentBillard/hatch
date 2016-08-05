# Hatch

Prepare easily your deployments on FTP using GIT.

## Installation

```bash
$ npm install node-hatch
```

## Usage

1. Create a new file who will represent the project to deploy. Ex: example.js
2. Configure this file
3. Use the CLI below :

```bash
$ node example {stage} {current-commit} {wanted-commit}
```

## Example

```bash
$ node example production 71ee79dcd013f2d8f2686fe143f7d5214c07e3aa 4be9e00861866367b31798efddffd2fd44ee28bb
```
