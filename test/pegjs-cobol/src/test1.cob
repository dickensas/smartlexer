       identification division.
       program-id. gnucobolcgi.
       environment division.
       input-output section.
       data division.
       working-storage section.
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

