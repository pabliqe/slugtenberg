# Slugtenberg
The fastest and simplest way to build static websites with basic automation and compilers.

## Why Slugtenberg?
Start building pages instantly with [liquidjs](https://github.com/harttle/liquidjs) for templating, [SASS](https://github.com/topics/sass) for empowered styling, and [Babel](https://github.com/babel/babel) for last-gen Javascripting.

## What's included?
* **Zero-configuration required**. [Just start coding]().
* Maintain your content [using files and folders as data]().
* Use *for* and *if* to [code your pages dynamically]() based on input data.
* Include *layouts* and *includes* to [build your pages in reusable small pieces](). 
* Use spreadsheets as database by [automatically make pages using a CSV file]().
* [Live preview your site locally]() and watch for file changes.

## Getting started


## Folder startucture basics

Forget about server configuration, prebuilders, minificators and databases.

Slug Files and Folders as Site Pages

```
/src/media
 ↳ Image, icon, video and sound files will be compiled to the Asset folder.
 
/src/scripts
 ↳ Files will be parsed as Javascript (ECMA6) minized and compiled to an Asset.
 
/src/styles
 ↳ Files will be parsed as SASS/SCSS, minized and compiled to an Asset.
 
/src/slugs
 ↳ Files and folders will be compile Slug names into HTML files to be accesed via URL.
```

## Database-Free

Slug Files and Folders as Data Input


## Using Data on your Pages


## Templating with Page Partials

```
/src/layouts
 ↳ Files used as layouts to be used on your page files or to print out a CSV file.
 
/src/includes
 ↳ Files to be include on your page files.
```

## Building Pages From a Csv File

```
/src/data
 ↳ Files will be parsed as CSV and used as input data for your pages.
```
