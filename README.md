# Slugtenberg
Slugtenberg was designed to compile _clean and quick_ websites from scratch. Saves you time by not having to deal with servers, databases and packages. All thanks to the [database-free slug system](#database-free) based on files and folders rendering system.

Built thanks to amazing open-source technology such [NodeJS](https://nodejs.org/es/), [Gulp](https://gulpjs.com/), [LiquidJS](https://liquidjs.com/), [BabelJS](https://babeljs.io/), [SASS](https://sass-lang.com/) and many others.

## What it can do?
* **Zero-configuration required**, just start coding.
* Maintain site contents modifying _files and folders as data_.
* Use _conditionals and iterations_ to create pages dynamically based on input data.
* Include _layouts and partials_ to separate pages in reusable smaller pieces. 
* Use _spreadsheet as database_ by builiding pages from a CSV file.
* Preview your site locally and _watch live changes_.

## Database-Free

Slugtenberg is a Flat-File CMS, so files and folders are the backbones of the slug system. Filenames are used to match internally views, media and data files into a page URL.

Every new file and folder inside `src/slug` folder will convert to public URL and will get attached media and data files matched by _slug_. This way you can create pages by duplicating files and folders.

<img alt="Animated image showing how duplicating a folder creates a new article" src="https://www.dropbox.com/s/3egsya7fpc6ym3v/folders.gif?raw=1">

So take this for example: `testing/intro.md` or `testing/data.yml` files will handle data for `testing/index.html` view.

On the other hand, global data is handled by `src/data` folder making media and data available to *any view*.

# Getting started
This instructions assume you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Node](https://nodejs.org/es/download/) installed on your machine.

1. (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Open your favorite terminal and access your project directory to start.
2. `curl -sL https://api.github.com/repos/pabliqe/slugtenberg/tarball | tar xzC . --strip 1` will download this repository locally.
3. `npm install -D` install required packages.
4. `./bin/slugtenberg build` build your demo project.
5. `./bin/slugtenberg start` gets your site up and running.
6. Your site will instantly popup on your default browser and ready to start livepreviewing your changes.
7. ( ͡ᵔ ͜ʖ ͡ᵔ ) Enjoy
8. `./bin/slugtenberg publish` once you are ready to publish your site.

Publish will output the files compressed and optimized into your `/dist` folder. Just upload it to your server or try a serverless option such as [Now/Vercel CLI](https://vercel.com/docs/cli#getting-started) or [GitHub Pages](https://pages.github.com/) to open your site to public.

Assets such as images, videos and such can be distributed separately via CDN by setting `cdnURL` in `./slugtenberg.yml` file.

--

_Happy Coding! *:･ﾟ✧_
