# embed-viewer

The `embed-viewer` is used for viewing `.xmind` file on GitHub Page. 
It will scan all `*.xmind` file from you project automatically.
After that, you will receive all `html` pages which `Github Pages` are going to deploy.

# Demo

[Demo Pages](https://danielsss.github.io/embed-viewer)

# Install

```shell
npm i --save-dev embed-viewer
```

# Usage

* Switch to your local project directory

```shell
cd $project
```

* Help information

```shell
viewer --help
```

* Generate GitHub Pages

```shell
viewer -i . -o ./docs
```

> Commit the `docs` directory to your git repository


# Setup GitHub Repository

1. Visit your `GitHub` repository.

2. Click `Settings`.

3. Click `Pages`.

4. Select the `branch` and the `folder` that pages are stored.

> If all operations are done, then you can access your `GitHub Pages`.