# Slugtenberg
The fastest and simplest compiler to build static websites in minutes with basic automation and many parsers included.

## Why this?
Slugtenberg was designed to build *clean and scalable* websites from scratch in the least possible time. Saves you time by not having to deal with servers, databases and infinite library packages; while keeping the benefits of using dynamic data and logic on static.

All of this thanks to the [database-free slug system](#database-free) based on [files and folders](#file--folder-basics) rendering system that use HTML semantics powered with LiquidJS (a handlebar `{}` language) to inject data from Markdown, JSON, YML, CSV and media files.

## What it can do?
* **Zero-configuration required**. Just Start Coding™️.
* Maintain your site contents manipulating files and folders as data.
* Use *conditionals* and *iterations* to create your pages dynamically based on input data.
* Include *layouts* and *partials* to build your pages in reusable small pieces. 
* Use spreadsheets as database by automatically make pages using a CSV file.
* Live preview your site locally and watch for file changes.

## Database-Free

Files and folders are the backbones of our slug system. Filenames are used to internally link views, media and information to an unique URL Slug for public access.

Each time you create a page file ending on `.html|.liquid`, Slugtenberg will automatically attach any data or media file that share the same folder and/or name. This way, if you have `index.liquid`, you can create an `index.json` or `index.yml` to handle data for that specific page inside.

Otherwise, to make global data be available on every page file, add your variables on global config files (`/config[-dev]?.yml`) or put a `.csv` file in the [Data](#file--folder-basics) folder to access it from any page view.

## File & Folder Basics
Start a new file in the desired folder and Just Start Coding™️.

```
src/
│
├─ data/
│  ├─ *.csv
│  │  └─ Datasheets are parsed and loopable as {{ data.filename }}
│  │
│  └─ *.yml
│     ├─ Data files sharing the same slug will be used as Datasheet's configuration file.
│     └─ This helps setup parser options such 'use_layout' or column types, among others.
│
├─ layouts/
│  └─ *(.html|.liquid)
│     ├─ Partial layouts can be invoked as {% layout 'filename' %}
│     └─ also used to render out CSV Datasheets when 'use_layout' is present.
│
├─ includes/
│  ├─ *(.html|.liquid)
│  │  └─ Partial includes can be invoked as {% include 'filename' %}.
│  │
│  └─ *[^.html|.liquid]
│     └─ Any other file can be invoked adding the extension as {% include 'filename.svg' %}.
│
├─ media/
│  └─ *
│     ├─ Media files are just copied to the Assets folder
│     └─ and can be invoked as {{ 'filename.mov' | assetLink }}.
│
├─ scripts/
│  └─ *.js
│     └─ Scripts are parsed as ECMA6, minized and compiled into {{ config.scriptsLink }}.
│   
├─ slugs/
│  ├─ *(.html|.liquid)
│  │  ├─ Templates compile into a site view using filename slug as URL.
│  │  └─ Current slug are always available at {{ current }}.
│  │
│  ├─ *(.json|.yml)
│  │  └─ Data files that shares the same slug, will be available directly as {{ variables }}.
│  │
│  └─ [slug]/
│     ├─ Files inside slug matching folders will be linked to use as data.
│     ├─ Index files inside this folder are used as main folder view.
│     │
│     ├─ *(.md|.markdown)
│     │  ├─ Content files are parsed as Markdown
│     │  └─ and available to be iterated using {{ contents.filename }}.
│     │
│     ├─ *(.webloc|.xml)
│     │  ├─ Link files are parsed as Safari Webloc files
│     │  └─ and available to be iterated using {{ links.filename }}.
│     │
│     └─ *(.jpg|.jpeg|.png|.gif|.ico|.mp3|.mp4|.oga|.ogg|.wav|.webm)
│        ├─ Asset files are copied to Asset folder
│        └─ and available as URL to be iterated using {{ media.filename }}.
│
└─ styles/
   └─ *(.scss|.sass|.css)
      └─ Styles are parsed as CSS, minimized and compiled into {{ config.stylesLink }}
```

## Getting started
This instructions assume you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Node](https://nodejs.org/es/download/), [Gulp](https://gulpjs.com/docs/en/getting-started/quick-start/) installed and updated on your machine.

1. Open your favorite Terminal
(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
2. Clone or download this repository
 ```
 git clone https://github.com/pabliqe/slugtenberg.git ./slugtenberg
 ```
3. Enter project folder
 ```
 cd slugtenberg
 ```
4. Install required packages
 ```
 npm install -D
 ```
5. Build demo project
 ```
 gulp build --dev
 ```
6. Start the local server
 ```
 gulp server:start --dev
 ```
7. Browser will popup with your site running on
 ```
 http://localhost:3000
 ```
8. Enjoy
( ͡ᵔ ͜ʖ ͡ᵔ )

## Available commands

```
gulp [command] [options]?

Commands:
 server:start
 server:reload
 build
 build:views
 build:styles
 build:scripts
 build:media
 watch
 
Options:
 --dev
```
