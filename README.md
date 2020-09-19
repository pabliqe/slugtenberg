# Slugtenberg
Slugtenberg was designed to compile _clean and quick_ websites from scratch. Saves you time by not having to deal with servers, databases and packages. All thanks to the [database-free slug system](#database-free) based on [files and folders](#files--folders-basics) rendering system.

## What it can do?
* **Zero-configuration required**, just start coding.
* Maintain site contents modifying _files and folders as data_.
* Use _conditionals and iterations_ to create pages dynamically based on input data.
* Include _layouts and partials_ to separate pages in reusable smaller pieces. 
* Use _spreadsheet as database_ by builiding pages from a CSV file.
* Preview your site locally and _watch live changes_.

## Database-Free

Files and folders are the backbones of the slug system. Filenames are used to match internally views, media and data files into a page URL. Every new file and folder inside [Slug folder](#slug--views) will automatically attach media and data files sharing the same slug name. Allowing you to create pages by duplicating files and folders.

<img alt="Animated image showing how duplicating a folder creates a new article" src="https://www.dropbox.com/s/3egsya7fpc6ym3v/folders.gif?raw=1">

This way `index.json`, `index.yml`, `index/title.txt` will handle data for `index` slug view. Global data is handled by files in your [Data folder](#global-data-files) making it accessible from any slug or partial view.

<img alt="Animated image showing how editing a Text file would update article title" src="https://www.dropbox.com/s/pfwdevz0ywpcxz9/contents.gif?raw=1">

# Getting started
This instructions assume you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Node](https://nodejs.org/es/download/) installed on your machine.

1. (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Open your favorite terminal
2. `cd myproject` access an empty directory to start.
3. `curl -sL https://api.github.com/repos/pabliqe/slugtenberg/tarball | tar xzC . --strip 1` will download this repository locally.
4. `npm install -D` install required packages.
5. `npm run build` build your demo project.
6. `npm run start` gets your site up and running.
7. `http://localhost:3000` browser will popup and you are ready to start coding.
9. ( ͡ᵔ ͜ʖ ͡ᵔ ) Enjoy
10. `npm run prod` once you are ready to publish your site.

Production build will output the files compressed and optimized into your `/dist` folder. Just upload it to your server or try a serverless option such as [Now/Vercel CLI](https://vercel.com/docs/cli#getting-started) or [GitHub Pages](https://pages.github.com/) to open your site to public.

The [Asset folder](#file--folder-basics) can be distributed separately via CDN by setting `cdnURL` in config file.

# Files & Folders Basics

## Global Data Files

Files here are used to create global variables available in every slug or partial view.
Datasheets are useful to import your big amount of data from any spreadsheet editor.

```
/data
│
├─ *.csv
│  └─ Datasheets are attached at {{ data.filename }}.
│
├─ *(.json|.yml)
│  └─ Options to setup Datasheet parser:
│         'use_layout' selects a layout to print data rows in pages.
│         'column_slug' indicates the column used in output's slugs.
│         'columns' holds columns id to set data parsing options (type:array)
│
└─ /dirname
   │
   ├─ *(.txt)
   │  └─ Data file attached as variable in {{ contents.filename }}.
   │
   ├─ *(.md|.markdown) 
   │  └─ Content file attached at {{ contents.filename }}.
   │
   ├─ *(.webloc)
   │  └─ Link file attached at {{ links.filename }}.
   │
   └─ *(.jpg|.jpeg|.png|.gif|.ico|.mp3|.mp4|.oga|.ogg|.wav|.webm)
      └─ Media file URL attached in {{ media.filename }}.
```

## View Partials

Layout files works are base templates to build your slug views on top of. [Learn more about layouts on LiquidJS](https://liquidjs.com/tutorials/partials-and-layouts.html)

```
/layouts
│
└─ *(.html|.liquid)
   ├─ Partial templates invoked at {% layout 'filename' %}
   └─ also renders datasheets when 'use_layout' is present.
```

Include files are template partials to include in your slug views. [Learn more about includes on LiquidJS](https://liquidjs.com/tutorials/partials-and-layouts.html)

```
/includes
│
├─ *(.html|.liquid)
│  └─ Partial templates invoked at {% include 'filename' %}.
│
└─ *
   └─ Other files can also be invoked with the extension as {% include 'filename.svg' %}.
```

## Media & Asset Files

Media files will be copied to the `/dist` folder. The filter `assetLink` converts any _filename_ into an asset URL.

```
/media
│
└─ *
   └─ Can be invoked as {{ 'filename.mov' | assetLink }}.
```

[SASS](https://sass-lang.com/guide) stylesheets are unified and compressed into CSS to quickly style your slug views.

```
/styles
│
└─ *(.scss|.sass|.css)
   └─ Unified style file URL available in {{ config.stylesLink }}
```


Javascript files are unified and compressed using [Babel](https://babeljs.io/) to bring ES6+ scripting to your slug views.

```
/js
│
└─ *.js
   └─ Unified script file URL always available in {{ config.scriptsLink }}.
```

## Slug views

Files here will be used to build the site hierarchy. Filenames are _slugs_, used to match media and data files.

```
/slugs
│
├─ *(.html|.liquid) 
│  ├─ Template views will serve as direct pages URL.
│  ├─ Current page slug is always available at {{ current }}.
│  └─ File slug will attach matching data files or folders in this folder.
│
├─ *(.json|.yml)
│  └─ Data variables are available directly as {{ variables }}.
│
└─ /dirname
   │
   ├─ *(.txt)
   │  └─ Data file attached as variable in {{ contents.filename }}.
   │
   ├─ *(.md|.markdown) 
   │  └─ Content file attached at {{ contents.filename }}.
   │
   ├─ *(.webloc)
   │  └─ Safari link file attached at {{ links.filename }}.
   │
   ├─ *(.jpg|.jpeg|.png|.gif|.ico|.mp3|.mp4|.oga|.ogg|.wav|.webm)ing
   │  └─ Media file URL attached in {{ media.filename }}.
   │  
   └─ *(.html|.liquid) 
      ├─ Other template views will serve as internal pages URL.
      └─ File slug also searchs for data files and folders.
```

--

_Happy Coding! *:･ﾟ✧_
