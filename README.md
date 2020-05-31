# Slugtenberg
Slugtenberg was designed to compile _clean and quick_ handy websites from scratch.

Saves you time by not having to deal with servers, databases and packages.

All thanks to the [database-free slug system](#database-free) based on [files and folders](#file--folder-basics) rendering system.

## What it can do?
* **Zero-configuration required**, just start coding.
* Maintain your site contents manipulating files and folders as data.
* Use *conditionals* and *iterations* to create your pages dynamically based on input data.
* Include *layouts* and *partials* to build your pages in reusable small pieces. 
* Use _spreadsheet as database_ by automatically make pages using a CSV file.
* Preview your site locally and _watch live file changes_.

## Database-Free

Files and folders are the backbones of the slug system. Filenames are used to match internally views, media and data files into a site URL. Each time you create a new file in the [Slug Folder](#file--folder-basics), Slugtenberg will automatically attach any media or data file that shares the same folder and/or file name.

![Animated image showing how duplicating a folder creates a new article](https://www.dropbox.com/s/3egsya7fpc6ym3v/folders.gif?raw=1)

This way, if you have `index.liquid`, you can create an `index.json` or `index.yml` to handle data for that specific page inside. Also you can make global data to be accessed from any page view, by creating these files in your [Data Folder](#file--folder-basics).

![Animated image showing how editin a Text file would update article title](https://www.dropbox.com/s/pfwdevz0ywpcxz9/contents.gif?raw=1)

## File & Folder Basics

Each folder has a one or more functions as stated below...

**▶︎ Data Folder**

Files in Data folder are used to create global variables available in every slug view.
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
   ├─ *(.webloc|.xml)
   │  └─ Link file attached at {{ links.filename }}.
   │
   └─ *(.jpg|.jpeg|.png|.gif|.ico|.mp3|.mp4|.oga|.ogg|.wav|.webm)
      └─ Media file URL attached in {{ media.filename }}.
```

**▶︎ Layout Folder**

Layout files works are base templates to build your slug views on top of. [Learn more about partials on LiquidJS](https://liquidjs.com/tutorials/partials-and-layouts.html)

```
/layouts
│
└─ *(.html|.liquid)
   ├─ Partial templates invoked at {% layout 'filename' %}
   └─ also renders datasheets when 'use_layout' is present.
```

**▶︎ Include Folder**

Include files are template partials to include in your slug views. [Learn more about partials on LiquidJS](https://liquidjs.com/tutorials/partials-and-layouts.html)

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

Media files will be copied to the `/dist` folder. `assetLink` is a filter to converts any filename into an asset URL.

```
/media
│
└─ *
   └─ Can be invoked as {{ 'filename.mov' | assetLink }}.
```

**▶︎ Script Folder**

Javascript files are unified and compressed using [Babel](https://babeljs.io/) to bring ES6+ scripting to your slug views.

```
/js
│
└─ *.js
   └─ Unified script file URL always available in {{ config.scriptsLink }}.
```

**▶︎ Slug Folder**

Files into Slug Folder will be used to build the site hierarchy. Filenames are _slugs_, used to match media and data files.

```
/slugs
│
├─ *(.html|.liquid) 
│  ├─ Template views will serve as direct URL pages.
│  ├─ Filename will search for any matching data file or directory.
│  └─ Current page slug are always available at {{ current }}.
│
├─ *(.json|.yml)
│  └─ Data variables are available directly as {{ variables }}.
│
└─ /dirname
   │
   │─ *(.html|.liquid) 
   │  ├─ Template views will serve as sub-folder URL pages.
   │  └─ Filename will search for any matching data file or directory.
   │
   ├─ *(.txt)
   │  └─ Data file attached as variable in {{ contents.filename }}.
   │
   ├─ *(.md|.markdown) 
   │  └─ Content file attached at {{ contents.filename }}.
   │
   ├─ *(.webloc|.xml)
   │  └─ Safari link file attached at {{ links.filename }}.
   │
   └─ *(.jpg|.jpeg|.png|.gif|.ico|.mp3|.mp4|.oga|.ogg|.wav|.webm)
      └─ Media file URL attached in {{ media.filename }}.
```

**▶︎ Style Folder**

[SASS](https://sass-lang.com/guide) stylesheets are unified and compressed into CSS to quickly style your slug views.

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
```
cd myproject
```
3. Download and copy this repository.
```
curl -sL https://api.github.com/repos/pabliqe/slugtenberg/tarball | tar xzC . --strip 1
```
4. Install required packages.
```
npm install -D
```
5. Build your demo project.
```
npm run build
```
6. Get your site up and running.
```
npm run start
```
7. Browser will popup and you are ready to start coding.
```
http://localhost:3000
```
8. Enjoy
9. ( ͡ᵔ ͜ʖ ͡ᵔ )
10. Once you are ready to publish your site.
```
npm run prod
```

Production build will output the files compressed and optimized into your `/dist` folder. Just upload it to your server or try a serverless option such as [Now/Vercel CLI](https://vercel.com/docs/cli#getting-started) or [GitHub Pages](https://pages.github.com/) to open your site to public.
