from app import app
from datetime import datetime, timedelta
from flaskext.mysql import MySQL     #Flask-MySQL is a Flask extension that allows you to access a MySQL database.

#initializing the connection
mysql = MySQL()
 
# MySQL configurations
app.config['SECRET_KEY'] = 'Th1s1ss3cr3t'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'ginu@1610'
app.config['MYSQL_DATABASE_DB'] = 'org_db'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)