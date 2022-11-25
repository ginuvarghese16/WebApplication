import pymysql
import db
from app import app
from db import mysql
from flask import Flask, request, abort, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
import bcrypt
from flask_redis import Redis
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'redis', 'CACHE_REDIS_URL': 'redis://localhost:6379/0','REDIS_HOST' :'localhost', 'REDIS_PORT': 6379, 'REDIS_DB': 0})
jwt = JWTManager(app)

cors = CORS(app, resources={r'/api/user/*' : {'origins':'*' }}, methods= ["GET", "POST", "HEAD", "OPTIONS", "PUT", "PATCH", "DELETE"])

access_token = None
token = None

def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header
    """
    global token
    auth = request.headers.get("Authorization", None)
    if not auth:
        abort(401, "Authorization header is expected")

    parts = auth.split()

    if parts[0].lower() != "bearer":
        abort(401, "Authorization header must start with Bearer")
    elif len(parts) == 1:
        abort(401, "Invalid header, token not found")
    elif len(parts) > 2:
        abort(401, 'Authorization header must be in the form of "Bearer token"')
    
    token = parts[1]
    print("tk = ",token)
    #return token
    if (access_token == token):
        print("test1 = ", access_token)
        print("test2 = ", token)
        print(access_token == token)
        return token
    else:
         abort(401, 'Authorization needed"')


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
# passwords are verified using brcypt.checkpw and passwords are encoded
#To cache view functions you will use the cached() decorator
# timeout is the time that this response will be cached in Redis memory.
@app.route("/api/login", methods=["POST"])
@cache.cached(timeout=10)
def login():
    global access_token
    user_name = request.json.get("user_name", None)
    password = request.json.get("password", None)
    #sets up a connection, establishing a session with the MySQL server
    conn = mysql.connect()
    # to enable traversing through the db, cursor() is used
    cursor = conn.cursor()
    query = ("SELECT users.user_name,users.password FROM users WHERE users.user_name = %s")
    data =(user_name)
    # executing the query and fetching records,
    cursor.execute(query,data)
    row = cursor.fetchone()
    actual_value = row[1]
    print("p = ", password.encode('utf-8'))
    print("ac = ", actual_value)
    resp = jsonify(row)
    if bcrypt.checkpw(password.encode('utf-8'), actual_value.encode('utf-8')):
        resp.status_code = 200
        resp.headers.add('Access-Control-Allow-Origin', '*')
        access_token = create_access_token(identity=user_name)
        print("tkn =  ", access_token)
        return jsonify(access_token=access_token)
    else:
        return jsonify({"msg": "Bad username or password"}), 401

    

# Function to craete new user in users table
# bcrypt is used to hash the password
@app.route('/api/createuser', methods=['POST'])
@cache.cached(timeout=10)
def createuser():
    _json = request.json
    _id = _json['user_id']
    _name = _json['user_name']
    _pwd = _json['password']
    #hashed_password = generate_password_hash(_pwd, method='sha256')
    hashed_password = bcrypt.hashpw(_pwd.encode('utf-8'), bcrypt.gensalt())
    conn = mysql.connect()
    cursor = conn.cursor()
    sql = "INSERT INTO users ( users.user_id, users.user_name, users.password) values (%s, %s, %s)"
    data = ( _id, _name, hashed_password)
 
    cursor.execute(sql, data)
    conn.commit()
    resp = jsonify('User created successfully!')
    resp.status_code = 200
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp



# function to get users with specified pswd and username
@app.route('/api/userdetails', methods=['GET','POST'])
@cache.cached(timeout=10)
def userdetails():
    _json = request.json
    _id = _json['user_name']
    _pwd = _json['password']
    if _id and _pwd and request.method == 'POST':
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        query = ("SELECT users.user_name, users.user_id, users.password FROM users WHERE users.user_name = %s AND users.password =%s")
        data =(_id, _pwd)
        cursor.execute(query,data)
        rows = cursor.fetchall()
        resp = jsonify(rows)
        count = cursor.rowcount
        if count !=0:
            resp.status_code = 200
            resp.headers.add('Access-Control-Allow-Origin', '*')
            return resp
        else:
            not_found
    else:
        return not_found


 


#function to acess the employee details from the table using GET api
#get_token_auth_header is used to validate the token
@app.route('/api/users', methods=['GET'])
@cache.cached(timeout=10)
def users():
    get_token_auth_header()
    conn = None
    cursor = None
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        query = "SELECT employees.emp_id, employees.first_name, employees.last_name, employees.emp_skilllevel, employees.active, employees.emp_age, employees.emp_email,employees.emp_dob FROM employees "
        cursor.execute(query)


        rows = cursor.fetchall()
        resp = jsonify(rows)
        resp.status_code = 200
        resp.headers.add('Access-Control-Allow-Origin', '*')
        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close() 
        conn.close()



#function to acess the employee details from the table using GET api for a specified employee
#get_token_auth_header is used to validate the token
# pymysql.cursors.DictCursor to fetch rows as a data dictionary so that we retrieve each column value as a key/value pair 
# (column name/column value) that will help us to display data in json format using flask’s jsonify API.
@app.route('/api/user/<int:id>', methods=['GET'])
@cache.cached(timeout=10)
def user(id):
    get_token_auth_header()
    try: 
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor) 
        cursor.execute("SELECT employees.emp_id, employees.first_name, employees.last_name, employees.emp_dob, employees.emp_skilllevel, employees.active, employees.emp_age, employees.emp_email FROM employees WHERE employees.emp_id = %s", (id,))

        rows = cursor.fetchone()
        resp = jsonify(rows)
        resp.status_code = 200
        resp.headers.add('Access-Control-Allow-Origin', '*')
        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close() 
        conn.close()


#function to add the employee details from the table using POST api method
#get_token_auth_header is used to validate the token
@app.route('/api/add', methods=['POST'])
@cache.cached(timeout=10)
def add_user():
    get_token_auth_header()
    conn = None
    cursor = None
    try:
        _json = request.json
        _id = _json['emp_id']
        _fname = _json['first_name']
        _lname = _json['last_name']
        _dob = _json['emp_dob']
        _skill = _json['emp_skilllevel']
        _bactive = _json['active']
        _age = _json['emp_age']
        _email = _json['emp_email']

        conn = mysql.connect()
        cursor = conn.cursor()
        sql = "INSERT INTO employees ( employees.emp_id, employees.first_name, employees.last_name, employees.emp_dob, employees.emp_skilllevel, employees.active, employees.emp_age, employees.emp_email) values (%s, %s, %s, %s, %s, %s, %s, %s)"
        data = ( _id, _fname, _lname, _dob, _skill, _bactive, _age, _email)
 
        cursor.execute(sql, data)
        # commiting the modifications
        conn.commit() 
        resp = jsonify(_id)
        resp.status_code = 200
        resp.headers.add('Access-Control-Allow-Origin', '*')
        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close() 
        conn.close()


#function to update the employee details from the table using PUT api method
#get_token_auth_header is used to validate the token
@app.route('/api/update/<int:id>', methods=['PUT'])
@cache.cached(timeout=10)
def update_user(id):
    get_token_auth_header()
    conn = None
    cursor = None
    try:
        _json = request.json
        #id = _json['emp_id']
        _fname = _json['first_name']
        _lname = _json['last_name']
        _dob = _json['emp_dob']
        _skill = _json['emp_skilllevel']
        _bactive = _json['active']
        _age = _json['emp_age']
        _email = _json['emp_email']

        # sql query to update the details
        sql = "UPDATE employees SET employees.first_name=%s, employees.last_name=%s, employees.emp_dob=%s, employees.emp_skilllevel=%s, employees.active=%s, employees.emp_age=%s, employees.emp_email=%s WHERE employees.emp_id=%s "
        data = ( _fname, _lname, _dob, _skill, _bactive, _age, _email, id,)
        conn = mysql.connect()
        cursor = conn.cursor()
        cursor.execute(sql, data)
        conn.commit()
        resp = jsonify('User updated successfully!')
        resp.status_code = 200
        resp.headers.add('Access-Control-Allow-Origin', '*')
        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close() 
        conn.close()

    
#function to delete the employee details from the table using DELETE api method
#get_token_auth_header is used to validate the token
@app.route('/api/delete/<int:id>', methods=['DELETE'])
@cache.cached(timeout=10)
def delete_user(id):
    get_token_auth_header()
    conn = None
    cursor = None
    try:
        conn = mysql.connect()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM employees WHERE emp_id=%s", (id,))
        conn.commit()
        resp = jsonify('User deleted successfully!')
        resp.status_code = 200
        resp.headers.add('Access-Control-Allow-Origin', '*')
        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close() 
        conn.close()
		


@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'Not Found: ' + request.url,
    }
    resp = jsonify(message)
    resp.status_code = 404

    return resp
		
if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000)