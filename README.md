# Slugtenberg
The fastest and simplest way to build static websites with basic automation and compilers.

## Why Slugtenberg?
Start building pages instantly with [liquidjs](https://github.com/harttle/liquidjs) for templating, [SASS](https://github.com/topics/sass) for empowered styling, and [Babel](https://github.com/babel/babel) for last-gen Javascripting.

## What's included?
* **Zero-configuration required**. [Just start coding]().
* Maintain your content [using files and folders as data]().
* [Live preview your site locally]() and watch for file changes.
* Use *for* and *if* to [code your pages dynamically]() based on input data.
* Include *layouts* and *includes* to [build your pages in reusable small pieces](). 
* Use spreadsheets as database by [automatically make pages using a CSV file]().

## Instalation


## Folder structure basics

```
/media
 ↳ Image, icon, video and sound files will be compiled to the Asset folder.
 
/scripts
 ↳ Files will be parsed as Javascript (ECMA6) minized and compiled to an Asset.
 
/styles
 ↳ Files will be parsed as SASS/SCSS, minized and compiled to an Asset.
 
/slugs
 ↳ Files and folders will be compile Slug names into HTML files to be accesed via URL.
```

## Just Start Coding

Forget about server configuration, prebuilders, minificators and databases.

## Database-Free: Use Files and Folders as Data Input

```
/data
 ↳ Files will be parsed as CSV and used as input data for your pages.
```

## Use Input Data in Views

## Templates With Page Partials

```
/layouts
 ↳ Files used as layouts to be used on your page files or to print out a CSV file.
 
/includes
 ↳ Files to be include on your page files.
```

## Build Web Pages From a Csv File

