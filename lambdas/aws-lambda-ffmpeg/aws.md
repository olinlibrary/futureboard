`
export AWS_REGION=us-east-1
export CFN_S3_BUCKET=futureboard-cloudformation
export SOURCE_BUCKET=upload.media.futureboard.olin.build
export DESTINATION_BUCKET=media.futureboard.olin.build
export FFMPEG_ARGS='-c:a copy -vf scale=\'min(320\\,iw):-2\' -movflags +faststart -metadata description=futureboardmedia out.mp4 -vf thumbnail -vf scale=\'min(320\\,iw):-2\' -vframes 1 out.png'
export USE_GZIP=false # can be true or false
export MIME_TYPES='{"png":"image/png","mp4":"video/mp4"}' # must be a JSON object with "extension": "mimeType" as the key/value pairs
export VIDEO_MAX_DURATION='10' # must be a number
`

`export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
`

run:
`gulp aws:create-cfn-bucket
gulp aws:default`


-c:a copy -vf scale='min(320\,iw):-2' -movflags +faststart -metadata description=futureboardmedia out.mp4 -vf thumbnail -vf scale='min(320\,iw):-2' -vframes 1 out.png

-t 10 -c:a copy -vf scale='min(1360\,iw):-2' -movflags +faststart -metadata description=futureboardmedia out.mp4
