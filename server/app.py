import os
import sqlite3
from datetime import datetime
from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit, send

app = Flask(__name__)
app.secret_key = '123123123123'
socketio = SocketIO(app)

student_at_panel = None
books_at_panel = set()
now = datetime.now()

def sql(query):
    conn = sqlite3.connect('library.db')
    cur = conn.cursor()
    cur.execute(query)
    data = cur.fetchall()
    conn.commit()
    conn.close()
    return data


@app.route('/')
def index():
    return send_from_directory('../../client/public', 'index.html')


def panel_student(student):
    global student_at_panel, books_at_panel
    roll = student[0]

    # Put card on panel for first time
    if student_at_panel == None:
        student_at_panel = roll
        print(f'{roll} at panel')
        # emit('student', student)

    # Put card on panel again to issue books
    elif student_at_panel == roll:
        for book_id in books_at_panel:
            sql(f"UPDATE BOOKS SET ISSUED_TO = '{student_at_panel}', ISSUE_DATE = DATE('NOW') WHERE BOOK_ID = '{book_id}'")
        print(f'{roll} issued {books_at_panel}')
        student_at_panel = None
        books_at_panel.clear()
        # emit('clear', 'issued')

    # Another student's card on panel
    elif student_at_panel != roll:

        # If no books at panel, change student at panel
        if len(books_at_panel) == 0:
            student_at_panel = roll
            print(f'{roll} at panel')
            # emit('student', student)

        # If books at panel, wait for books to be issued
        else:
            print('Another student at panel')
            # emit('clear', 'another student')


def panel_book(book):
    global student_at_panel, books_at_panel
    book_id = book[0]
    issued_to = book[4]

    # If no student at panel, do nothing
    if student_at_panel == None:
        print('No student at panel')
        # emit('clear', 'no student')

    # If student at panel, add book to panel
    else:

        # If book is not borrowed, add to panel
        if issued_to == 'NULL':
            print(f'Book added to panel: {books_at_panel}')
            books_at_panel.add(book_id)
            # emit('book', book)

        # If book is borrowed by student at panel, return book
        elif issued_to == student_at_panel:
            print('Book returned')
            sql(f"UPDATE BOOKS SET ISSUED_TO = 'NULL', ISSUE_DATE = 'NULL' WHERE BOOK_ID = '{book_id}'")
            # emit('return', book)

        # If book is borrowed by another student, do nothing
        else:
            print('Book is already borrowed')
            # emit('clear', 'already borrowed')
        

@app.route('/panel/id=<int:rfid>', methods=['GET'])
def panel(rfid):
    global student_at_panel, books_at_panel, now

    # Timeout after 10 seconds
    if (datetime.now() - now).total_seconds() > 30:
        print('Timeout')
        student_at_panel = None
        books_at_panel.clear()
        now = datetime.now()
        # emit('clear', 'timeout')

    students = sql(f"SELECT * FROM STUDENTS WHERE RFID = '{rfid}'")
    books = sql(f"SELECT * FROM BOOKS WHERE RFID = '{rfid}'")

    if len(students) != 0:
        panel_student(students[0])
    
    if len(books) != 0:
        panel_book(books[0])

    return 'OK'


@app.route('/gate/id=<int:rfid>', methods=['GET'])
def gate(rfid):
    print(rfid)
    book = sql('SELECT * FROM BOOKS WHERE RFID = ' + str(rfid))
    print(book)
    if len(book) != 0:
        issued_to = book[0][4]
        if issued_to == 'NULL':
            print('Book is not issued')
            return 'ALERT'
    return 'OK'


@socketio.on('connect')
def connect():
    print('Client Connected...')
    emit('Success', {'data': 'Connected'})


@socketio.on('disconnect')
def disconnect():
    print('Client Disconnected...')


@socketio.on('message')
def message(data):
    print(data)
    emit('response', data)


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 3000))
    # app.run(debug=True, use_reloader=True, host='0.0.0.0', port=port)
    socketio.run(app, debug=True, host='192.168.29.192', port=4000)