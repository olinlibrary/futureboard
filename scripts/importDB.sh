# To Run:
# sh importDb.sh <db_username> <db_password> <local_db_name>

# Export remote database for local import.
# Get username and password from Heroku mLab instance - environment variables in settings.
mongodump -h ds113063.mlab.com:13063 -d heroku_w45g6cd6 -u $1 -p $2 -o mLabDump;

# Replace database with files exported from remote using `exportRemote.sh`
mongorestore --drop -d $3 mLabDump/heroku_w45g6cd6;
