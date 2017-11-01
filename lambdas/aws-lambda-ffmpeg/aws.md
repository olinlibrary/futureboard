```
export AWS_REGION=us-east-1
export CFN_S3_BUCKET=futureboard-cloudformation
export SOURCE_BUCKET=upload.media.futureboard.olin.build
export DESTINATION_BUCKET=media.futureboard.olin.build
export FFMPEG_ARGS='-c:a copy -vf scale=\'min(320\\,iw):-2\' -movflags +faststart -metadata description=futureboardmedia out.mp4 -vf thumbnail -vf scale=\'min(320\\,iw):-2\' -vframes 1 out.png'
export USE_GZIP=false # can be true or false
export MIME_TYPES='{"png":"image/png","mp4":"video/mp4"}' # must be a JSON object with "extension": "mimeType" as the key/value pairs
export VIDEO_MAX_DURATION='10' # must be a number
```

`export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
`

run:
`gulp aws:create-cfn-bucket
gulp aws:default`



Settings in AWS:
```
FFMPEG_ARGS: -t 15 -r 30000/1001 -an -crf 23 -vf scale='-1:min(720\,ih)' -movflags +faststart -metadata description=futureboard out.mp4
DESTINATION_BUCKET: media.futureboard.olin.build
VIDEO_MAX_DURATION: 600
USE_GZIP: false
DESTINATION_PREFIX: m/
MIME_TYPES: {"png":"image/png","mp4":"video/mp4","avi":"video/avi"}
```

## [FFmpeg settings](http://ffmpeg.org/ffmpeg.html#Video-Options):

-t cutoff duration
-c:a codec:audio copy
-vf filtergraph - use supplied filtergraph on the stream s
