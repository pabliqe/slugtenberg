# Slugtenberg
Slugtenberg was designed to compile _clean and quick_ websites from scratch. Saves you time by not having to deal with servers, databases and packages. All thanks to the [database-free slug system](#database-free) based on [files and folders](#file--folder-basics) rendering system.

## What it can do?
* **Zero-configuration required**, just start coding.
* Maintain site contents modifying _files and folders as data_.
* Use _conditionals and iterations_ to create pages dynamically based on input data.
* Include _layouts and partials_ to separate pages in reusable smaller pieces. 
* Use _spreadsheet as database_ by builiding pages from a CSV file.
* Preview your site locally and _watch live changes_.

## Database-Free

Files and folders are the backbones of the slug system. Filenames are used to match internally views, media and data files into a page URL. Each time you create a new file in the [Slug Folder](#file--folder-basics), it will automatically attach any media or data file that shares the same folder and/or file name.

↓ In this example you can see how _duplicating a folder_, generates new site content.

<img alt="Animated image showing how duplicating a folder creates a new article" src="https://www.dropbox.com/s/3egsya7fpc6ym3v/folders.gif?raw=1" width="400">

This way, you can create `index.json` or `index.yml` to handle data for your `index.liquid`. Also you can make global data by creating these files in your [Data Folder](#file--folder-basics) to be accessed from every page view.

↓ Here you can see how _editing a text file_, updates the site content.

<img alt="Animated image showing how editin a Text file would update article title" src="https://www.dropbox.com/s/pfwdevz0ywpcxz9/contents.gif?raw=1" width="400">

## File & Folder Basics

_Each folder serves a different purpose as stated below..._

**▶︎ Data Folder**

Files here are used to create _global variables_ available in every _slug_ view.
Datasheets are useful to import your data from software such as Excel, Numbers or Google Spreadsheets.

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

**▶︎ Layout Folder**

Layout files works are base templates to build your _slug_ views on top of. [Learn more about partials on LiquidJS](https://liquidjs.com/tutorials/partials-and-layouts.html)

```
/layouts
│
└─ *(.html|.liquid)
   ├─ Partial templates invoked at {% layout 'filename' %}
   └─ also renders datasheets when 'use_layout' is present.
```

**▶︎ Include Folder**

Include files are template partials to include in your _slug_ views. [Learn more about partials on LiquidJS](https://liquidjs.com/tutorials/partials-and-layouts.html)

```
/includes
│
├─ *(.html|.liquid)
│  └─ Partial templates invoked at {% include 'filename' %}.
│
└─ *
   └─ Other files can also be invoked with the extension as {% include 'filename.svg' %}.
```

**▶︎ Media Folder**

Media files will be copied to the `/dist` folder. The filter `assetLink` converts any _filename_ into an asset URL.

```
/media
│
└─ *
   └─ Can be invoked as {{ 'filename.mov' | assetLink }}.
```

**▶︎ Script Folder**

Javascript files are unified and compressed using [Babel](https://babeljs.io/) to bring ES6+ scripting to your _slug_ views.

```
/js
│
└─ *.js
   └─ Unified script file URL always available in {{ config.scriptsLink }}.
```

**▶︎ Slug Folder**

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

**▶︎ Style Folder**

[SASS](https://sass-lang.com/guide) stylesheets are unified and compressed into CSS to quickly style your _slug_ views.

```
styles/
│
└─ *(.scss|.sass|.css)
   └─ Unified style file URL available in {{ config.stylesLink }}
```

## Getting started
This instructions assume you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Node](https://nodejs.org/es/download/) installed on your machine.

1. (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Open your favorite terminal
2. Create or access an empty directory to start.

`
cd myproject
`

3. Download and copy this repository.

`
curl -sL https://api.github.com/repos/pabliqe/slugtenberg/tarball | tar xzC . --strip 1
`

4. Install required packages.

`
npm install -D
`

5. Build your demo project.

`
npm run build
`

6. Get your site up and running.

`
npm run start
`

7. Browser will popup and you are ready to start coding.

`
http://localhost:3000
`

8. Enjoy
9. ( ͡ᵔ ͜ʖ ͡ᵔ )
10. Once you are ready to publish your site.

`
npm run prod
`

Production build will output the files compressed and optimized into your `/dist` folder. Just upload it to your server or try a serverless option such as [Now/Vercel CLI](https://vercel.com/docs/cli#getting-started) or [GitHub Pages](https://pages.github.com/) to open your site to public. Asset folder can be distributed to a CDN using settin `cdnURL` in config file.
