# Slugtenberg
Slugtenberg was designed to compile *clean and quick* handy websites from scratch.

Saves you time by not having to deal with servers, databases and infinite library packages.

All of this thanks to the [database-free slug system](#database-free) based on [files and folders](#file--folder-basics) rendering system.

## What it can do?
* **Zero-configuration required**. _Just Start Coding™️_.
* Maintain your site contents manipulating files and folders as data.
* Use *conditionals* and *iterations* to create your pages dynamically based on input data.
* Include *layouts* and *partials* to build your pages in reusable small pieces. 
* Use spreadsheets as database by automatically make pages using a CSV file.
* Preview your site locally and watch for file changes.

## Database-Free

Files and folders are the backbones of our slug system. Filenames are used to internally link views, media and information into a unique site URL. Each time you create a page file ending on [Slug folder](#file--folder-basics), Slugtenberg will automatically attach any data or media file that share the same folder and/or file name.

![Animated image showing how duplicating a folder creates a new article](https://www.dropbox.com/s/3egsya7fpc6ym3v/folders.gif?raw=1)

This way, if you have `index.liquid`, you can create an `index.json` or `index.yml` to handle data for that specific page inside. Also you can make global data to be accessed from any page view, by creating these files in your [Data folder](#file--folder-basics).

![Animated image showing how editin a Text file would update article title](https://www.dropbox.com/s/pfwdevz0ywpcxz9/contents.gif?raw=1)

## File & Folder Structure

Each folder has a one or more functions as stated below...

**Data Files**

```
data/
│
├─ *.csv
│  └─ Datasheet are parsed and loopable at {{ data.filename }}.
│
├─ *(.json|.yml)
│  ├─ Datasheet configuration files matched by slug.
│  └─ Used to setup options such as 'use_layout' or column parser type.
│
└─ */
   ├─ Folders holds data files that will be available as global data.
   │
   ├─ *(.txt)
   │  └─ Template content available directly at {{ foldername.contents.filename }}.
   │
   ├─ *(.md|.markdown)
   │  ├─ Other template content parsed as Markdown.
   │  └─ Available to be iterated using {{ foldername.contents.filename }}.
   │
   ├─ *(.webloc|.xml)
   │  ├─ Template links are parsed as Safari Webloc
   │  └─ Available to be iterated using {{ foldername.links.filename }}.
   │
   └─ *(.jpg|.jpeg|.png|.gif|.ico|.mp3|.mp4|.oga|.ogg|.wav|.webm)
      ├─ Template media files are copied directly to Asset folder.
      └─ Available to be iterated using {{ foldername.media.filename }}.
```

**Template Layouts**

```
layouts/
│
└─ *(.html|.liquid)
   ├─ Partial templates invoked at {% layout 'filename' %}.
   └─ Also renders datasheets when 'use_layout' is present.
```

**Template Includes**

```
includes/
│
├─ *(.html|.liquid)
│  └─ Partial templates invoked at {% include 'filename' %}.
│
└─ *
   └─ Other files can also be invoked with the extension as {% include 'filename.svg' %}.
```

**Media & Asset Files**

```
media/
│
└─ *
   ├─ Media files will be copied to the Assets folder.
   ├─ Can be invoked as {{ 'filename.mov' | assetLink }}.
   └─ 'assetLink' filter is used to convert filename into an URL.
```

**Javascript Files**

```
scripts/
│
└─ *.js
   └─ Scripts parsed as ECMA6, minized and compiled into {{ config.scriptsLink }}.
```

**Template Views**

```
slugs/
│
├─ *(.html|.liquid)
│  ├─ Template files compiles into a site view.
│  └─ Current page slug are always available at {{ current }}.
│
├─ *(.json|.yml)
│  ├─ Data files matched by slug.
│  └─ Data variables are available directly as {{ variables }}.
│
└─ (slug)/
   ├─ Folders matching (slug) will be attached as input data to template view.
   ├─ Index files inherit slug name from folder.
   │
   ├─ *(.txt)
   │  └─ Template content available directly at {{ contents.filename }}.
   │
   ├─ *(.md|.markdown)
   │  ├─ Other template content parsed as Markdown.
   │  └─ Available to be iterated using {{ contents.filename }}.
   │
   ├─ *(.webloc|.xml)
   │  ├─ Template links are parsed as Safari Webloc
   │  └─ Available to be iterated using {{ links.filename }}.
   │
   └─ *(.jpg|.jpeg|.png|.gif|.ico|.mp3|.mp4|.oga|.ogg|.wav|.webm)
      ├─ Template media files are copied directly to Asset folder.
      └─ Available to be iterated using {{ media.filename }}.
```

**CSS Files**

```
styles/
│
└─ *(.scss|.sass|.css)
   └─ Styles are parsed as CSS, minimized and compiled into {{ config.stylesLink }}
```

## Getting started
This instructions assume you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Node](https://nodejs.org/es/download/) installed on your machine.

1. Open your favorite Terminal (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
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
( ͡ᵔ ͜ʖ ͡ᵔ )

Once you are ready to publish your site, production build will output the files compressed and optimized into your `/dist` folder. Just upload it to your server or try a serverless option such as [Now/Vercel CLI](https://vercel.com/docs/cli#getting-started) or [GitHub Pages](https://pages.github.com/) to open your site to public.
```
npm run prod
```
