// get the config from the window
/** @type string */
const LASTFM_USER = window.config.user || '';

/** @type string */
const LASTFM_API_KEY = window.config.api_key || '';

/** @type boolean */
const BLUR_ALBUM_ART = window.config.blur;

/** @type boolean */
const DISAPPEAR_ON_NOT_PLAYING = window.config.dissapear_on_not_playing || true;

if (LASTFM_API_KEY == '' || LASTFM_USER == '') {
	console.error('MISSING API KEY AND/OR USERNAME FOR last.fm', {
		LASTFM_USER,
		LASTFM_API_KEY,
	});

	throw 'Bruh';
}

// API URL
const API_URL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&user=${LASTFM_USER}&format=json&api_key=${LASTFM_API_KEY}`;

// Update Interval
// do not set below 1
// number for seconds to update it
/** @type number */
const INTERVAL_TIME = 0.5;

// the interval id, idk why its here
/** @type number */
let interval;

// whether or not a song is currently playing
/** @type boolean */
let is_current = true;

// elements
/** @type HTMLImageElement */
const ARTWORK = document.querySelector('#artwork img');

/** @type HTMLElement */
const LOADING = document.querySelector('.load-container');

/** @type HTMLElement */
const INFO = document.querySelector('#info');

/** @type HTMLElement */
const NAME = document.querySelector('#info .song span');

/** @type HTMLElement */
const ALBUM = document.querySelector('#info .album span');

/** @type HTMLElement */
const ARTIST = document.querySelector('#info .artist span');

/** @type HTMLElement */
const IP = document.querySelector('#info footer');

/** @type HTMLElement */
const BODY = document.querySelector('body');

// Initialise blur paramenters
if (BLUR_ALBUM_ART) {
	ARTWORK.classList.toggle('blur', true);
} else {
	ARTWORK.classList.toggle('blur', false);
}

// check to see if all elements are there
if (!ARTWORK || !LOADING || !NAME || !ALBUM || !ARTIST || !INFO || !IP) {
	console.error('MISSING HTML ELEMENT', {
		ARTWORK,
		LOADING,
		NAME,
		ALBUM,
		ARTIST,
		INFO,
		IP,
	});
}

/**
 *
 * Update DOM with new value
 *
 * @param {HTMLElement} el
 * @param {string} val
 * @param {number} maxLength
 * @param {string} padding
 * @returns void
 */
const updateValueIfChanged = (el, val, maxLength) => {
	let tmp = val;

	if (tmp.length > maxLength) {
		tmp = `${tmp.substring(0, maxLength)}...`;
	}

	if (el.textContent.includes(tmp)) return;

	el.setAttribute('style', 'opacity: 0;');
	el.innerText = `${DOMPurify.sanitize(tmp)}`;

	el.removeAttribute('style');
};

// update function
const update = async () => {
	// get the data
	let api_response = await (
		await fetch(API_URL).catch((err) => {
			console.error(
				'UNABLE TO MAKE API REQUEST, PLEASE MAKE SURE THAT THE API KEY IS SET CORRECTLY'
			);
		})
	).json();

	// if the reponse doesn't have anything, assume an error and return
	if (!api_response.recenttracks) return;

	try {
		if (api_response.recenttracks.track[0]['@attr']['nowplaying']) {
			is_current = true;
		}
	} catch {
		is_current = false;
	}

	if (DISAPPEAR_ON_NOT_PLAYING) {
		BODY.classList.toggle('current', is_current);
		INFO.classList.toggle('current', is_current);
	}

	if (!is_current && DISAPPEAR_ON_NOT_PLAYING) return;

	// get the art, it is an image url
	let art =
		api_response.recenttracks.track[0].image[
			api_response.recenttracks.track[0].image.length - 1
		]['#text'];
	// the scrobbler api has some very ODD syntax

	// get the artist name
	/** @type string */
	let artist =
		api_response.recenttracks.track[0].artist['#text'] || 'unknown';

	// get the album name
	/** @type string */
	let album = api_response.recenttracks.track[0].album['#text'] || 'unknown';

	// get the track name
	/** @type string */
	let song = api_response.recenttracks.track[0].name;

	// change the image source to the wanted one, once changed, OBS holds the current image until the new one is loaded (image always 300x300)
	if (!ARTWORK.getAttribute('src').includes(art)) {
		// hide image, bring in loader
		ARTWORK.classList.toggle('empty', true);
		LOADING.classList.toggle('hidden', false);

		ARTWORK.setAttribute('src', DOMPurify.sanitize(art));
		ARTWORK.onload = () => {
			ARTWORK.classList.toggle('empty', false);
			LOADING.classList.toggle('hidden', true);
		};
	}

	// checks if value has updated

	updateValueIfChanged(NAME, song, 25);
	updateValueIfChanged(ALBUM, album, 35);
	updateValueIfChanged(ARTIST, artist, 35);

	// it is no longer empty, only effective on initial load
	INFO.classList.toggle('empty', false);
	IP.classList.toggle('hidden', false);

	const WIDTH = getMax([
		NAME.getBoundingClientRect().width + 48,
		ALBUM.getBoundingClientRect().width + 36,
		ARTIST.getBoundingClientRect().width + 36,
		300,
	]);

	// set the style of the info to the necessary width, allows for CSS animations
	INFO.setAttribute('style', `width: ${WIDTH}px;`);

	// moves the required "powered by AudioScrobbler" to keep it on the right of the content
	IP.setAttribute('style', `transform: translateX(${WIDTH - 236}px);`);
};

// get the maximum of a bunch of numbers, used to set the width of the info panel to the max size of the text
const getMax = (numbers) => {
	let max = 0;

	for (let i = 0; i < numbers.length; i++) {
		if (numbers[i] > max) max = numbers[i];
	}

	return max;
};

// start program
interval = setInterval(update, INTERVAL_TIME * 1000);
