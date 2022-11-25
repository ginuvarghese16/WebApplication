from app import app
from flaskext.mysql import MySQL

mysql = MySQL()
 
# MySQL configurations
app.config['SECRET_KEY'] = 'Th1s1ss3cr3t'
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'ginu@1610'
app.config['MYSQL_DATABASE_DB'] = 'org_db'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)