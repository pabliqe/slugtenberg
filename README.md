# Slugtenberg
The fastest and simplest way to build static websites in minutes with basic automation and compilers included.

## Why Slugtenberg?
Slugtenberg was designed to build *clean and scalable* websites from scratch in the least possible time.

Saves you time by not configuring servers, databases and infinite library packages; while keeping the benefits of using dynamic data and logic on static pages.

The template system is based on HTML semnatics powered by a handlebar `{}` language (called LiquisJS) to inject variables, conditionals and iterations from Markdown, JSON, YML, CSV and media files.

## What it can do?
* **Zero-configuration required**. Just Start Coding™️.
* Maintain your content using files and folders as data.
* Use *conditionals* and *iterations* to create your pages dynamically based on input data.
* Include *layouts* and *partials* to build your pages in reusable small pieces. 
* Use spreadsheets as database by automatically make pages using a CSV file.
* Live preview your site locally and watch for file changes.

## Getting started
This instructions assume you have **Node** ([steps](https://nodejs.org/es/download/)) and **Gulp** ([steps](https://gulpjs.com/docs/en/getting-started/quick-start/)) installed and updated on your machine.

1. Open your favorite Terminal
(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
2. Clone or download this repository
 ```
 clone https://github.com/pabliqe/slugtenberg.git ./slugtenberg
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

## Folder Structure Basics
Start a new file in the desired folder and Just Start Coding™️.

```
/src/data
 ↳ CSV files will be used as input data for site slugs,
   YML files are used as configuration.

/src/layouts
 ↳ HTML/Liquid files will be used as layouts for site slugs
   or used to render CSV files.
 
/src/includes
 ↳ Any kind of file to be included on your slug views.
 
/src/media
 ↳ Images, icons, videos and sounds will be copied
   to the public Assets folder.
 
/src/scripts
 ↳ Javascript files will be parsed as ECMA6, minized
   and compiled to an unified public Asset file.
 
/src/slugs
 ↳ Files and folders will be compiled in site URLs.
   HTML/Liquid compiles to HTML files;
   JSON, YML, Markdown and media files are used as data.
 
/src/styles
 ↳ CSS files will be parsed as SASS/SCSS, minized
   and compiled to an unified public Asset file.
```

## Database-Free

Files and folders are the backbones of our slug system. Filenames are used to internally link views, media and information to an unique URL Slug for public access.

Each time you create a page file ending on `.html|.liquid` Slugtenberg will automatically attach any data or media file that share the same folder and/or name. This way, if you have `/src/slugs/index.liquid`, you can create an `index.json` or `index.yml` to handle data for that specific page inside.

To make global data be available on every page file, add your variables on `/config[-dev]?.yml` or put a CSV file in `/src/data/` to access it from any page view.

## Available commands

```
gulp [command] [options]?

Commands:
 server:start
 server:reload
 build:all
 build:views
 build:styles
 build:scripts
 build:media
 watch
 
Options:
 --dev
```
