![](https://img.shields.io/github/license/danielsss/embed-viewer?style=flat-square)
![](https://img.shields.io/npm/v/embed-viewer?style=flat-square)
[![Build status](https://ci.appveyor.com/api/projects/status/60xy90pqqv6janfy/branch/main?svg=true)](https://ci.appveyor.com/project/danielsss/embed-viewer/branch/main)
# embed-viewer

The `embed-viewer` is used for converting XMind file to html and viewing pages via GitHub.
It will scan the file of XMind type from your local `Git Repository` automatically. After that, 
you will receive a lot of `html` pages which `Github Pages` are going to deploy.

# Example Demo

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

* Generate GitHub Pages

```shell
viewer -i . -o ./docs -p -e node_modules,dist,src
```

> Commit the `docs` directory to your git repository


# Setup GitHub Repository

1. Visit your `GitHub` repository.

2. Click `Settings`.

3. Click `Pages`.

4. Select the `branch` and the `folder` that pages are stored.

> If all operations are done, then you can access your `GitHub Pages`.

# More Information

```shell
viewer --help
```

# LICENSE

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdanielsss%2Fembed-viewer.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fdanielsss%2Fembed-viewer?ref=badge_large)