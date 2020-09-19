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

# Old way of Getting started
This instructions assume you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Node](https://nodejs.org/es/download/) installed on your machine.

1. (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Open your favorite terminal
2. `cd myproject` access an empty directory to start.
3. `curl -sL https://api.github.com/repos/pabliqe/slugtenberg/tarball | tar xzC . --strip 1` will download this repository locally.
4. `npm install -D` install required packages.
5. `./bin/slugtenberg build` build your demo project.
6. `./bin/slugtenberg start` gets your site up and running.
7. `http://localhost:xxxx` browser will popup and you are ready to start coding.
9. ( ͡ᵔ ͜ʖ ͡ᵔ ) Enjoy
10. [not ready yet] `./bin/slugtenberg publish` once you are ready to publish your site.

Publish will output the files compressed and optimized into your `/dist` folder. Just upload it to your server or try a serverless option such as [Now/Vercel CLI](https://vercel.com/docs/cli#getting-started) or [GitHub Pages](https://pages.github.com/) to open your site to public.

Assets such as images, videos and such can be distributed separately via CDN by setting `cdnURL` in config file.

--

_Happy Coding! *:･ﾟ✧_
