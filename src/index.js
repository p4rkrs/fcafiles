const Twit = require('twit')
const tumblr = require('tumblr.js');
const image2base64 = require('image-to-base64');
const logger = require('../utils/Logger');
const path = require('path');
require('longjohn')
require('dotenv-safe').config({
	path: path.join(__dirname, '..', '.env'),
	allowEmptyValues: true
});

const { TUMBLR_CONSUMER_KEY, TUMBLR_CONSUMER_SECRET, TUMBLR_CONSUMER_TOKEN, TUMBLR_CONSUMER_TOKEN_SECRET, TWIT_CONSUMER_KEY, TWIT_CONSUMER_SECRET, TWIT_ACCESS_TOKEN, TWIT_ACCESS_TOKEN_SECRET } = process.env;

const pictures = [];


const client = new tumblr.Client({
	consumer_key: TUMBLR_CONSUMER_KEY,
	consumer_secret: TUMBLR_CONSUMER_SECRET,
	token: TUMBLR_CONSUMER_TOKEN,
	token_secret: TUMBLR_CONSUMER_TOKEN_SECRET
});
const twitter = new Twit({
	consumer_key: TWIT_CONSUMER_KEY,
	consumer_secret: TWIT_CONSUMER_SECRET,
	access_token: TWIT_ACCESS_TOKEN,
	access_token_secret: TWIT_ACCESS_TOKEN_SECRET
});

global.logger = logger;

function postTweet() {
	const offset = Math.floor(Math.random() * 399) + 1

	client.blogPosts('world-asian', { type: 'photo', offset: offset }, async(err, resp) => {
		if (err) return logger.error(err);

		if (!resp.posts[Math.floor(Math.random() * resp.posts.length)].photos) return postTweet();

		let pics = resp.posts[Math.floor(Math.random() * resp.posts.length)].photos

		// We select randomly an index from the colors array
		const index = Math.floor(pics.length * Math.random());

		// We store the color to return
		pics = pics[index];

		const buff = Buffer.from(pics.original_size.url);
		const base64data = buff.toString('base64');
		if (pictures.includes(base64data)) return postTweet();

		pictures.push(base64data)

		const image = await image2base64(pics.original_size.url);


		// first we must post the media to Twitter
		twitter.post('media/upload', { media_data: image }, (error, data) => {
			if (error) return;
			// now we can assign alt text to the media, for use by screen readers and
			// other text-based presentations and interpreters
			var mediaIdStr = data.media_id_string
			var meta_params = { media_id: mediaIdStr }

			twitter.post('media/metadata/create', meta_params, (er) => {
				if (er) return;

				// now we can reference the media and post a tweet (media will attach to the tweet)
				var params = { media_ids: [mediaIdStr] }

				twitter.post('statuses/update', params, (errors) => {
					if (errors) logger.error(errors);
					logger.info(`Posted tweet, with this base64: ${base64data}`)
				})
			})
		})
	});
}

postTweet();

setInterval(postTweet, 1000 * 60 * 60)
