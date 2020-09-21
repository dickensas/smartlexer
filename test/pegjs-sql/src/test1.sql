SELECT 'm1' = a.x, a.y,
    CASE
    WHEN Quantity > 30 THEN 
    'The quantity is greater than 30'
    END as M1,
    b.v
FROM vmployee e ,   department   d   ,     profile p
where p.x = e.m AND p.x = 20 AND e.x = d.x OR e.x = 900 OR e.x IS NULL
ORDER BY x