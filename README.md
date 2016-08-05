# Hatch

## Installation

```bash
$ npm install hatch
```

## Usage

1. Créer un fichier qui va représenter le projet à déployer. Ex: example.js
2. Configurer le fichier
3. Utiliser la commande ci-dessous :

```bash
$ node example {stage} {current-commit} {wanted-commit}
```

## Example

```bash
$ node example production 71ee79dcd013f2d8f2686fe143f7d5214c07e3aa 4be9e00861866367b31798efddffd2fd44ee28bb
```