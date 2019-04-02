const Twit = require('twit')
const tumblr = require('tumblr.js');
const fs = require('fs');
const image2base64 = require('image-to-base64');

const client = new tumblr.Client({
  consumer_key: 'eiUVkoHYuTpy8gwoqlgXSIVvXyz05sKcymNPLegoqC9pWndcDS',
  consumer_secret: '4h7P5acvVJ5PKFfSCum3C1At9ztHBYe0sdqFOZ6gGI6sSkDvHx',
  token: 'eiUVkoHYuTpy8gwoqlgXSIVvXyz05sKcymNPLegoqC9pWndcDS',
  token_secret: '4h7P5acvVJ5PKFfSCum3C1At9ztHBYe0sdqFOZ6gGI6sSkDvHx'
});
const T = new Twit({
  consumer_key:         'KEiOAtJR6m4mluGWk8wUF1YRL',
  consumer_secret:      'uAWEmafuSSDFb742ZYnmYTTRKJW0DN54GgpNXMUJAkYRFphcjW',
  access_token:         '1113182254442921985-oyGVau1ZiYOhpV0LK5wBbelnZvozNQ',
  access_token_secret:  'fsdq9o3iq9t1UOgl0RpPbMlmEpthBZBq9RpMWES61MsxQ'
});

function postTweet() {

client.blogPosts('asianhotees', {type: 'photo'}, async function(err, resp) {
  let pics = resp.posts[Math.floor(Math.random()*resp.posts.length)].photos


  // We select randomly an index from the colors array
  const index = Math.floor(pics.length * Math.random());

  // We store the color to return
  pics = pics[index];

  const image = await image2base64(pics.original_size.url);


// first we must post the media to Twitter
T.post('media/upload', { media_data: image }, function (err, data, response) {
    if (err) return;
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string
    var meta_params = { media_id: mediaIdStr }
   
    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        var params = { media_ids: [mediaIdStr] }
   
        T.post('statuses/update', params, function (err, data, response) {
          console.log('Posted tweet, with this media_id: ' + mediaIdStr)
        })
      }
    })
  })
});
}

postTweet();

setInterval(postTweet, 1000 * 60 * 60)
