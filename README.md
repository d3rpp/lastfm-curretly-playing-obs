# lastfm-curretly-playing-obs

![Security Status](https://github.com/d3rpp/lastfm-curretly-playing-obs/actions/workflows/codeql-analysis.yml/badge.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://gitHub.com/d3rpp/lastfm-curretly-playing-obs/graphs/commit-activity)
![Maintainer](https://img.shields.io/badge/Maintainer-d3rpp-blue)
[![Latest Release](https://badgen.net/github/release/d3rpp/lastfm-curretly-playing-obs)](https://github.com/d3rpp/lastfm-curretly-playing-obs/releases/latest)

this is a package that gets the currently playing list from [last.fm](https://last.fm) and displays it in the browser

it is built to be put into OBS as a browser source

set the width to the width of the window (the program changes the width depending on the title
set the height to 300px

to get it to work, add a `constants.js` file in the root of the project (next to the HTML file) and fill it like such

```js
window.config = {
	/** @type string */
	user: '**YOUR LAST.FM USERNAME**',
	/** @type string */
	api_key: '**LAST.FM API KEY**',
};
```

where the `user` is the desired last.fm username
and the `api_key` is your api key for last.fm, you can make one [here](https://www.last.fm/api/account/create)
this is effectively the same as a `.env` file, except I don't want to setup `dotenv`

## Installation

If you would like to setup this application, feel free to go into the wiki by clicking on the `Wiki` tab above, it provides a better understanding of the installation and which music apps the software officially supports and any important details that allow it to function better.

If you have any issue with installation feel free to contact me at

- Email: [bug@d3rpp.dev](mailto:bug@d3rpp.dev?subject=OBS%20Now%20Playing%20Layer%20Question)
- Discord: d3rpp#4608



## note

this does mess with the global `window` object in order to set the config in a seperate file (i dont want my api key on here), this isnt going to be a problem on the browser, a;though any linting software may become [angery](https://youtu.be/5jO2PLqEdUY?t=67), `fix.d.ts` should fix this

this has only been tested with Tidal, i have heard about issues with spotify sometimes lagging behind, if you use tidal you need to ensure that last.fm is linked individually on both desktop and mobile (or just the one you use to play music in stream if you really want)

do **NOT** set the update rate (`INTERVAL_TIME`) below 1, or last.fm will start rate limiting you and the program will break
