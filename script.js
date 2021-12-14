// get the config from the window
const LASTFM_USER = window.config.user || '';
const LASTFM_API_KEY = window.config.api_key || '';

// API URL
const API_URL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&user=${LASTFM_USER}&format=json&api_key=${LASTFM_API_KEY}`;

// the icons, svgs wrapped in divs
const SONG_ICON = `<div class="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#eeeeee"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 3l.01 10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4.01 4S14 19.21 14 17V7h4V3h-6zm-1.99 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg></div>`;
const ALBUM_ICON = `<div class="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#eeeeee"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 5.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg></div>`;
const ARTIST_ICON = `<div class="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#eeeeee"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>`;

// Update Interval
// do not set below 1
// number for seconds to update it
const INTERVAL_TIME = 1;

// the interval id, idk why its here
let interval;

// elements
const ARTWORK = document.querySelector('#artwork img');
const INFO = document.querySelector('#info');
const NAME = document.querySelector('#info .song');
const ALBUM = document.querySelector('#info .album');
const ARTIST = document.querySelector('#info .artist');
const IP = document.querySelector('#info footer');

// check to see if all elements are there
if (!ARTWORK || !NAME || !ALBUM || !ARTIST || !INFO || !IP) {
	console.error({ ARTWORK, NAME, ALBUM, ARTIST, INFO, IP });
}

// update function
const update = async () => {
	// get the data
	let api_response = await (await fetch(API_URL)).json();

	// if the reponse doesn't have anything, assume an error and return
	if (!api_response.recenttracks) return;
	if (!api_response.recenttracks.track[0]['@attr'].nowplaying) return;

	// get the art, it is an image url
	let art =
		api_response.recenttracks.track[0].image[
			api_response.recenttracks.track[0].image.length - 1
		]['#text'];

	// get the artist name
	let artist = api_response.recenttracks.track[0].artist['#text'];

	// get the album name
	let album = api_response.recenttracks.track[0].album['#text'];

	// get the track name
	let song = api_response.recenttracks.track[0].name;

	// change the image source to the wanted one, once changed, OBS holds the current image until the new one is loaded (image always 300x300)
	ARTWORK.setAttribute('src', DOMPurify.sanitize(art));

	// adds the SVG and the sanitized track name
	NAME.innerHTML = `${SONG_ICON} ${DOMPurify.sanitize(song)}`;

	// adds the SVG and the sanitized album name
	ALBUM.innerHTML = `${ALBUM_ICON} ${DOMPurify.sanitize(album)}`;

	// adds the SVG and the sanitized artist name
	ARTIST.innerHTML = `${ARTIST_ICON} ${DOMPurify.sanitize(artist)}`;

	// it is no longer empty, only effective on initial load
	INFO.classList.toggle('empty', false);
	IP.classList.toggle('hidden', false);

	// set the style of the info to the necessary width, allows for CSS animations
	INFO.setAttribute(
		'style',
		`width:${getMax([
			NAME.getBoundingClientRect().width,
			ALBUM.getBoundingClientRect().width,
			ARTIST.getBoundingClientRect().width,
			300,
		])}px;`
	);

	// moves the required "powered by AudioScrobbler" to keep it on the right of the content
	IP.setAttribute(
		'style',
		`transform:translateX(${
			getMax([
				NAME.getBoundingClientRect().width,
				ALBUM.getBoundingClientRect().width,
				ARTIST.getBoundingClientRect().width,
				300,
			]) -
			300 +
			48
		}px);`
	);
};

// get the maximum of a bunch of numbers, used to set the width of the info panel to the max size of the text
const getMax = (numbers) => {
	let max = 0;

	for (let i = 0; i < numbers.length; i++) {
		if (numbers[i] > max) max = numbers[i];
	}

	return max;
};

// log out the elements, for debugging purposes
// console.info({ ARTWORK, NAME, ALBUM, ARTIST, INFO, IP });

// start program
interval = setInterval(update, INTERVAL_TIME * 1000);
