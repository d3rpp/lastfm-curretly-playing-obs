# lastfm-curretly-playing-obs

this is a package that gets the currently playing list from [last.fm](https://last.fm) and displays it in the browser

it is built to be put into OBS as a browser source

set the width to the width of the window (the program changes the width depending on the title
set the height to 300px

to get it to work, add a `constants.js` file in the root of the project (next to the HTML file) and fill it like such

```js
window.config = {
	user: '**YOUR LAST.FM USERNAME**',
	api_key: '**LAST.FM API KEY**',
};
```

where the `user` is the desired last.fm username
and the `api_key` is your api key for last.fm, you can make one [here](https://www.last.fm/api/account/create)


## note

this does mess with the global `window` object in order to set the config in a seperate file (i dont want my api key on here), this isnt going to be a problem but any ts-lint software may become angry, `fix.d.ts` should fix this

this has only been tested with Tidal, i have heard about issues with spotify sometimes lagging behind, if you use tidal you need to ensure that last.fm is linked individually on both desktop and mobile (or just the one you use to play music in stream if you really want)

do **NOT** set the update rate (`INTERVAL_TIME`) below 1, or last.fm will start rate limiting you and the program will break
