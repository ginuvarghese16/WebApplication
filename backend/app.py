from flask import Flask
from flask_cors import CORS, cross_origin
from flask_redis import Redis

app = Flask(__name__)
redis = Redis(app)

cors = CORS(app, resources={r'/api/*' : {'origins':'*' }}, methods= ["GET", "POST", "HEAD", "OPTIONS", "PUT", "PATCH", "DELETE"])
app.config['CORS_HEADERS'] = 'Content-Type'