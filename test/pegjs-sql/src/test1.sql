SELECT 'm1' = a.x, a.y,
    CASE
    WHEN Quantity > 30 THEN 
    'The quantity is greater than 30'
    END as M1,
    b.v
FROM vmployee e ,   department   d   ,     profile p
where p.x = e.m AND p.x = 20 AND e.x = d.x OR e.x = 900 OR e.x IS NULL 
UNION
SELECT 'm2' = a.x, a.y,
    CASE
    WHEN Quantity > 60 THEN 
    'The quantity is greater than 60'
    END as M2,
    b.v
FROM vmployee e ,   department   d   ,     profile p2
where p2.x1 =* e.m2 AND p.x = 20 AND e.x5 = d.x8 OR e.x = 901 OR e.x IS NULL
UNION
SELECT 'm3' = a.x, a.y,
    CASE
    WHEN Quantity > 70 THEN 
    'The quantity is greater than 70'
    END as M2,
    b.v
FROM vmployee e ,   department   d   ,     profile p1
where p1.x7 =* e.m9 AND p.x = 34 AND e.x7 = d.x2 OR e.x = 905 OR e.x IS NULL
ORDER BY x