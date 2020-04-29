# Slugtenberg
The fastest and simplest way to build static websites in minutes with basic automation and compilers included.

## Why Slugtenberg?
Slugtenberg was designed to help you build *clean and scalable* websites from scratch in the least time possible. Saving you time by not configuring servers, databases and infinite library packages but keeping the benefits of using dynamic data and logic on static pages.

Said that, Slugtenberg template system trust on HTML semantics empowered with a handlebar `{}` language to inject variables, conditionals and iterations from Markdown, JSON, YML, CSV and other files.

## What it can do?
* **Zero-configuration required**. Just start coding.
* Maintain your content using files and folders as data.
* Use *conditionals* and *iterations* to create your pages dynamically based on input data.
* Include *layouts* and *partials* to build your pages in reusable small pieces. 
* Use spreadsheets as database by automatically make pages using a CSV file.
* Live preview your site locally and watch for file changes.

## Getting started
This instructions assume you have **Node** ([steps](https://nodejs.org/es/download/)) and **Gulp** ([steps](https://gulpjs.com/docs/en/getting-started/quick-start/)) installed and updated on your machine.

1. Open your favorite Terminal (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
2. Clone or download this repository
 ```
 clone https://github.com/pabliqe/slugtenberg.git ./slugtenberg
 ```
3. Enter project folder using
 ```
 cd slugtenberg
 ```
4. Install required packages
 ```
 npm install -D
 ```
5. Build demo project using
 ```
 gulp build --dev
 ```
6. Start the local server
 ```
 gulp server:start --dev
 ```
7. Browser will popup with your site running on `http://localhost:3000`
8. Enjoy ( ͡ᵔ ͜ʖ ͡ᵔ )

## Base Folder Structure

```
/dist
/dist-dev
 ↳ Output files will be printed here based.
 
/gulp-tasks
 ↳ Files added here will be converted to command-line tasks to run using gulp.
 
/config.yml
/config-dev.yml
 ↳ Configuration data files attached to every page.
```

## Source Folder Structure

```
/src/data/
 ↳ CSV files will be used as input data for your pages. YML files are used as configuration.

/src/layouts/
 ↳ HTML/Liquid files will be used as layouts other pages or to print out CSV files.
 
/src/includes
 ↳ HTML/Liquid files to be included on your pages.
 
/src/media
 ↳ Images, icons, videos and sounds will be copied to the Asset folder.
 
/src/scripts
 ↳ Javascript files will be parsed as ECMA6, minized and compiled to an unified Asset file.
 
/src/slugs
 ↳ Files and folders will be compile into the Slug system: HTML/Liquid compiles to HTML files; JSON, YML, Markdown and media files are attached as data.
 
/src/styles
 ↳ CSS files will be parsed as SASS/SCSS, minized and compiled to an unified Asset file.
```

## Database-Free

Files and folders are the backbones of our slug system, using names to link internally views, media and information to an uniqe public URL slug.

## Available commands

| Command | Usage |
| ------- | ----- |
| gulp server:start [--dev?] | |
| gulp server:reload [--dev?] | |
| gulp build [--dev?] | |
| gulp watch [--dev?] | |
| gulp views [--dev?] | |
| gulp styles [--dev?] | |
| gulp scripts [--dev?] | |
| gulp media [--dev?] | |
