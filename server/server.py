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

def handle_user(user):
    user['book'] = sql(f"SELECT * from book_status INNER JOIN book ON book.id = book_status.book_id WHERE student_id = '{user['roll']}';")
    socketIo.emit('user', user, broadcast=True)    

############################################ API ############################################
@app.route('/panel/id=<int:rfid>', methods=['GET'])
def handle_panel(rfid):
    user = sql(f"SELECT * FROM student WHERE rfid = '{rfid}'")
    book = sql(f"SELECT * FROM book_status INNER JOIN book ON book_status.book_id = book.id WHERE rfid = '{rfid}'")

    if len(user) and len(book):
        raise Exception('Student and book cannot have same RFID')
    elif len(user):
        print('panel -> user: ', user[0]['roll'])
        handle_user(user[0])
    elif len(book):
        print('panel -> book: ', book[0]['book_id'])
        socketIo.emit('book', book[0], broadcast=True)
    else:
        return 'NA'
    return 'OK'

@app.route('/gate/id=<int:rfid>', methods=['GET'])
def handle_gate(rfid):
    print('gate', rfid)
    book = sql(f"SELECT * FROM book_status WHERE rfid = '{rfid}'")
    if len(book) and book[0]['student_id'] == 'NULL':
        print('Book is not issued')
        return 'ALERT'
    return 'OK'

@app.route('/<string:shelf>/id=<int:rfid>', methods=['GET'])
def handle_return(shelf, rfid):
    print('return', rfid)
    row = sql(f"SELECT * FROM book_status INNER JOIN book ON book_status.book_id = book.id WHERE rfid = '{rfid}'")
    if len(row) == 0:
        print('RFID not found')
        return 'NA'
    
    row = row[0]
    print(row)
    if row['pending'] == 1:
        if row['shelf'] != shelf:
            print('Book is not for this shelf')
            return 'ALERT'
        
        print('Book is good to return')
        sql(f"UPDATE book_status SET pending = 0, student_id = 'NULL', issue_date = 'NULL', return_date = 'NULL' WHERE rfid = '{rfid}'")
        user = sql(f"SELECT * FROM student WHERE roll = '{row['student_id']}'")
        handle_user(user[0])
        return 'OK'
    
    print('Book is not issued')
    return 'NA'


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/', methods=['POST'])
def index_form_post():
    rfid = request.form['rfid']
    handle_panel(rfid)
    return render_template('index.html')

############################################ Socket ############################################
@socketIo.on('issue')
def handle_issue(rows):
    for row in rows:
        print('issue', row)
        sql(f"UPDATE book_status SET student_id = '{row['student_id']}', issue_date = DATE('NOW', 'LOCALTIME'), return_date = DATE('NOW', 'LOCALTIME', '+14 days'), pending = 0 WHERE rfid = '{row['rfid']}'")
    user = sql(f"SELECT * FROM student WHERE roll = '{rows[0]['student_id']}'")
    handle_user(user[0])

@socketIo.on('pending')
def handle_pending(row):
    print('pending', row)
    sql(f"UPDATE book_status SET pending = 1 WHERE rfid = '{row['rfid']}'")
    user = sql(f"SELECT * FROM student WHERE roll = '{row['student_id']}'")
    handle_user(user[0])

@socketIo.on('reissue')
def handle_reissue(row):
    handle_issue([row])

@socketIo.on('connect')
def handle_connect():
    book = sql(f"SELECT * FROM book;")
    socketIo.emit('booklist', book, broadcast=True)
    print('Client connected')

@socketIo.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketIo.on("message")
def handleMessage(msg):
    print(msg)
    send(msg, broadcast=True)


############################################ Main ############################################
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', type=str, default='localhost')
    parser.add_argument('--port', type=int, default=5000)
    args = parser.parse_args()
    socketIo.run(app, host=args.host, port=args.port, debug=True)
