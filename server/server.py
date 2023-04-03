from flask import Flask, render_template, request;
from flask_socketio import SocketIO, send
import argparse
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

def handle_student(rows):
    for row in rows:
        print('student', row['roll'])
        row['books'] = sql(f"SELECT * FROM BOOKS WHERE issuedTo = '{row['roll']}'")
        socketIo.emit('user', row, broadcast=True)

def handle_book(rows):
    for row in rows:
        print('book', row['id'])
        if row['issuedTo'] == 'NULL':
            socketIo.emit('add', row, broadcast=True)
        else:
            socketIo.emit('return', row, broadcast=True)

@app.route('/panel/id=<int:rfid>', methods=['GET'])
def handle_panel(rfid):
    print('panel', rfid)
    students = sql(f"SELECT * FROM STUDENTS WHERE rfid = '{rfid}'")
    books = sql(f"SELECT * FROM BOOKS WHERE rfid = '{rfid}'")
    if len(students) and len(books):
        raise Exception('Student and book cannot have same RFID')
    elif len(students):
        handle_student(students)
    elif len(books):
        handle_book(books)
    return 'OK'

@app.route('/gate/id=<int:rfid>', methods=['GET'])
def handle_gate(rfid):
    print('gate', rfid)
    book = sql(f"SELECT * FROM BOOKS WHERE rfid = '{rfid}'")
    if len(book) and book[0]['issuedTo'] == 'NULL':
        print('Book is not issued')
        return 'ALERT'
    return 'OK'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/', methods=['POST'])
def index_form_post():
    text = request.form['text']
    students = sql(f"SELECT * FROM STUDENTS WHERE roll = '{text}'")
    books = sql(f"SELECT * FROM BOOKS WHERE id = '{text}'")
    if len(students) and len(books):
        raise Exception('Student and book cannot have same RFID')
    elif len(students):
        handle_student(students)
    elif len(books):
        handle_book(books)
    return render_template('index.html')

@socketIo.on('issue')
def handle_issue(rows):
    for row in rows:
        sql(f"UPDATE BOOKS SET issuedTo = '{row['issuedTo']}', issueDate = DATE('NOW', 'LOCALTIME'), returnDate = DATE('NOW', 'LOCALTIME', '+14 days') WHERE id = '{row['id']}'")
    row = sql(f"SELECT * FROM STUDENTS WHERE roll = '{rows[0]['issuedTo']}'")
    handle_student(row)

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
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', type=str, default='localhost')
    parser.add_argument('--port', type=int, default=5000)
    args = parser.parse_args()
    socketIo.run(app, host=args.host, port=args.port, debug=True)
