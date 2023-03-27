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

@app.route('/book')
def book():
    return render_template('book.html')

@app.route('/book', methods=['POST'])
def book_form_post():
    id = request.form['text']
    rows = sql(f"SELECT * FROM BOOKS WHERE id = '{id}'")
    for row in rows:
        if row['issuedTo'] == 'NULL' or row['issuedTo'] == 'None':
            socketIo.emit('add', row, broadcast=True)
        else:
            socketIo.emit('return', row, broadcast=True)
    return render_template('book.html')

@app.route('/user')
def user():
    return render_template('user.html')
    
@app.route('/user', methods=['POST'])
def user_form_post():
    roll = request.form['text']
    handle_user(roll)
    return render_template('user.html')

@socketIo.on('issue')
def handle_issue(rows):
    for row in rows:
        sql(f"UPDATE BOOKS SET issuedTo = '{row['issuedTo']}', issueDate = DATE('NOW'), returnDate = DATE('NOW', '+14 days') WHERE id = '{row['id']}'")
    handle_user(rows[0]['issuedTo'])

@socketIo.on('returned')
def handle_return(row):
    print('returned', row)
    sql(f"UPDATE BOOKS SET issuedTo = 'NULL', issueDate = 'NULL', returnDate = 'NULL' WHERE id = '{row['id']}'")

@socketIo.on('reissue')
def handle_return(row):
    socketIo.emit('add', row, broadcast=True)

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
    return None

if __name__ == '__main__':
    socketIo.run(app, host='localhost', debug=True)
