from flask import Flask, render_template, request;
from flask_socketio import SocketIO, send
import sqlite3

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'

socketIo = SocketIO(app, cors_allowed_origins="*")

def sql(query):
    conn = sqlite3.connect('library.db')
    cur = conn.cursor()
    cur.execute(query)
    if (cur.description == None):
        conn.commit()
        conn.close()
        return None
    fields = [description[0] for description in cur.description]
    values = cur.fetchall()
    data = [dict(zip(fields, value)) for value in values]
    conn.close()
    return data

def handle_user(roll):
    rows = sql(f"SELECT * FROM STUDENTS WHERE roll = '{roll}'")
    for row in rows:
        row['books'] = sql(f"SELECT * FROM BOOKS WHERE issuedTo = '{roll}'")
        socketIo.emit('user', row, broadcast=True)

def handle_book(id):
    rows = sql(f"SELECT * FROM BOOKS WHERE id = '{id}'")
    for row in rows:
        if row['issuedTo'] == 'NULL':
            socketIo.emit('add', row, broadcast=True)
        else:
            socketIo.emit('return', row, broadcast=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/', methods=['POST'])
def index_form_post():
    text = request.form['text']
    if len(sql(f"SELECT * FROM STUDENTS WHERE roll = '{text}'")):
        print('user', text)
        handle_user(text)
    elif len(sql(f"SELECT * FROM BOOKS WHERE id = '{text}'")):
        print('book', text)
        handle_book(text)
    return render_template('index.html')

@socketIo.on('issue')
def handle_issue(rows):
    for row in rows:
        sql(f"UPDATE BOOKS SET issuedTo = '{row['issuedTo']}', issueDate = STRFTIME('%d-%m-%Y', 'NOW', 'LOCALTIME'), returnDate = STRFTIME('%d-%m-%Y', 'NOW', 'LOCALTIME', '+14 days') WHERE id = '{row['id']}'")
    handle_user(rows[0]['issuedTo'])

@socketIo.on('returned')
def handle_return(row):
    print('returned', row)
    sql(f"UPDATE BOOKS SET issuedTo = 'NULL', issueDate = 'NULL', returnDate = 'NULL' WHERE id = '{row['id']}'")

@socketIo.on('reissue')
def handle_reissue(row):
    handle_issue([row])

@socketIo.on('connect')
def handle_connect():
    print('Client connected')

@socketIo.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketIo.on("message")
def handleMessage(msg):
    print(msg)
    send(msg, broadcast=True)

if __name__ == '__main__':
    socketIo.run(app, host='localhost', debug=True)
