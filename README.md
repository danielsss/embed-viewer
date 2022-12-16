![](https://img.shields.io/github/license/danielsss/embed-viewer?style=flat-square)
![](https://img.shields.io/npm/v/embed-viewer?style=flat-square)
[![Build status](https://ci.appveyor.com/api/projects/status/60xy90pqqv6janfy/branch/main?svg=true)](https://ci.appveyor.com/project/danielsss/embed-viewer/branch/main)
[![codecov](https://codecov.io/gh/danielsss/embed-viewer/branch/main/graph/badge.svg?token=52L3PM939J)](https://codecov.io/gh/danielsss/embed-viewer)
# embed-viewer

The `embed-viewer` is used for converting XMind file to html and viewing pages via GitHub.
It will scan all the `*.xmind` file from your local `Git Repository` automatically. After that, 
the original file will be compiled as a format in `html` and then, you can deploy the `Pages` via `Github`.

# Requirements

* Node.js >= 8.0.0

# Supported System

| Name | Supported |
|:----:|:--------: |
| Linux | Y |
| MacOS | Y |
| Win32 | Y |

# Example

* [Github Page](https://danielsss.github.io/embed-viewer)

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
viewer -i . -o ./docs -p -e dist,src -t MyTitle -l https://logo.com/logo.svg
```

> Commit the `docs` directory to your git repository


# Setup GitHub Repository

1. Visit your `GitHub` repository.

2. Click `Settings`.

3. Click `Pages`.

4. Select the `branch` name and the `folder` name.

> You can access your `GitHub Pages` after all the operations.

# More Information

```shell
viewer --help

Usage: viewer -i . -o ./docs/pages -f -e node_modules,src,...

This tool is used for converting "*.xmind" file to Gitlab pages

Options:
  -t, --title <value>     specify the page title (default: "Embed Viewer")
  -i, --input <value>     the "*.xmind" source folder
  -o, --output <value>    the output folder where the converted pages are stored
  -p, --purge             purge the target folder before output pages
  -e, --excludes <value>  specify folder that will excluded during the process of scanning (default: "node_modules")
  -l, --logo <value>      specify the logo address
  -V, --version           output the version number
  -h, --help              display help for command
```

# LICENSE

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdanielsss%2Fembed-viewer.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fdanielsss%2Fembed-viewer?ref=badge_large)
