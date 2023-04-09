import sqlite3

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

if __name__ == '__main__':
    sql("drop table student;")    
    sql("CREATE TABLE student (roll INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT, dept TEXT NOT NULL, rfid INTEGER NOT NULL);")
    sql("INSERT INTO student (roll, first_name, last_name, dept, rfid) VALUES "\
        "(1901106475, 'Anup', 'Paikaray', 'Electronics & Instrumentaton Engineering', 147912274), " \
        "(1901106494, 'Gourav', 'Adhikary', 'Electronics & Instrumentaton Engineering', 22710010326), " \
        "(1901106505, 'Mannpreeti', 'Toppo', 'Electronics & Instrumentaton Engineering', 1000), " \
        "(1901106512, 'Pratiksha', 'Kullu', 'Electronics & Instrumentaton Engineering', 1001), " \
        "(1901106513, 'Pratyusha', 'Sarangi', 'Electronics & Instrumentaton Engineering', 1002);")
    
    sql("drop table book;")
    sql("CREATE TABLE book (id TEXT PRIMARY KEY, title TEXT NOT NULL, author TEXT NOT NULL, isbn TEXT UNIQUE, publisher TEXT, publication_year INTEGER, shelf TEXT);")
    sql("INSERT INTO book (id, title, author, isbn, publisher, publication_year, shelf) VALUES " \
        "('B001', 'Electronic Devices and Circuit Theory', 'Robert L. Boylestad and Louis Nashelsky', '978-0135026496', 'Pearson Education', 2010, 'EI1001'), " \
        "('B002', 'Microelectronic Circuits', 'Adel S. Sedra and Kenneth C. Smith', '978-0199339136', 'Oxford University Press', 2014, 'EI1001'), " \
        "('B003', 'Electronic Principles', 'Albert Paul Malvino and David J. Bates', '978-0073373881', 'McGraw Hill Education', 2006, 'EI1001'), " \
        "('B004', 'Solid State Electronic Devices', 'Ben G. Streetman and Sanjay Banerjee', '978-0133356038', 'Prentice Hall', 2015, 'EI1002'), " \
        "('B005', 'Principles of Electronic Communication Systems', 'Louis E. Frenzel Jr.', '978-0073373850', 'McGraw Hill Education', 2015, 'EI1002'), " \
        "('B006', 'Fundamentals of Electric Circuits', 'Charles K. Alexander and Matthew N. O. Sadiku', '978-0078028229', 'McGraw Hill Education', 2016, 'EI1002'), " \
        "('B007', 'Electronic Circuit Analysis and Design', 'Donald A. Neamen', '978-0073380643', 'McGraw Hill Education', 2016, 'EI1003'), " \
        "('B008', 'Digital Signal Processing', 'John G. Proakis and Dimitris G. Manolakis', '978-0131873742', 'Pearson Education', 2006, 'EI1003'), " \
        "('B009', 'Electronic Instrumentation and Measurements', 'David A. Bell', '978-8120349467', 'PHI Learning', 2012, 'EI1003'), " \
        "('B010', 'Op-Amps and Linear Integrated Circuits', 'Ramakant A. Gayakwad', '978-8120348927', 'PHI Learning', 2014, 'EI1003');")
    
    sql("drop table book_status;")
    sql("CREATE TABLE book_status (rfid INT PRIMARY KEY, book_id TEXT NOT NULL, student_id INTEGER, issue_date DATE, return_date DATE, pending INTEGER CHECK (pending IN (0, 1)), FOREIGN KEY (student_id) REFERENCES student(roll), FOREIGN KEY (book_id) REFERENCES book(id) );")
    sql("INSERT INTO book_status (rfid, book_id, student_id, issue_date, return_date, pending) VALUES " \
        "(3168135, 'B001', 'NULL', 'NULL', 'NULL', 0), " \
        "(671702104, 'B002', 1901106475, '2022-03-16', '2022-03-31', 0), " \
        "(1003, 'B003', 1901106513, '2022-03-18', '2022-04-02', 0), " \
        "(1004, 'B004', 'NULL', 'NULL', 'NULL', 0), " \
        "(1005, 'B005', 'NULL', 'NULL', 'NULL', 0), " \
        "(1006, 'B006', 'NULL', 'NULL', 'NULL', 0), " \
        "(1007, 'B007', 'NULL', 'NULL', 'NULL', 0), " \
        "(1008, 'B008', 'NULL', 'NULL', 'NULL', 0), " \
        "(1009, 'B009', 'NULL', 'NULL', 'NULL', 0), " \
        "(1010, 'B010', 'NULL', 'NULL', 'NULL', 0), " \
        "(1011, 'B001', 'NULL', 'NULL', 'NULL', 0), " \
        "(1012, 'B002', 'NULL', 'NULL', 'NULL', 0), " \
        "(1013, 'B003', 'NULL', 'NULL', 'NULL', 0);")
        

    # sql("drop table book_history;")
    # sql("CREATE TABLE book_history (issue_id INTEGER PRIMARY KEY, book_id TEXT NOT NULL, student_id INTEGER NOT NULL, issue_date DATE NOT NULL, return_date DATE NOT NULL, status TEXT, FOREIGN KEY (book_id) REFERENCES book (id), FOREIGN KEY (student_id) REFERENCES student (roll));")
    # sql("INSERT INTO book_history (student_id, book_id, issue_date, return_date) VALUES " \
    #     "('1901106475', '3168135', '2022-03-15', '2022-03-30'), " \
    #     "('1901106475', '671702104', '2022-03-16', '2022-03-31'), " \
    #     "('1901106494', '1111', '2022-03-17', '2022-04-01'), " \
    #     "('1901106494', '2222', '2022-03-18', '2022-04-02');")
    pass
