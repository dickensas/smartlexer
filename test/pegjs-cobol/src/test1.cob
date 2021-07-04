       identification division.
       program-id. gnucobolcgi.
       environment division.
       input-output section.
       data division.
       working-storage section.
         10 WS-NAME PIC A(30).
         01 WS-NEW2 REDEFINES WS-OLD PIC A(10).
         10 WS-NUM1 PIC 9(2).
         05 WS-DATE1 VALUE '20140831'.
         01 WS-DESCRIPTION.
         10 WS-CHAR2 PIC X(2) VALUE 'BB'.
       procedure division.
       MOVE 'TutorialsPoint' to a.
       display
         "Content"
       end-display
       display
       Content1
       end-display
       perform p until COUNT=5
       end-perform

