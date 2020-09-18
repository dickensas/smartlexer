SELECT 'm1' = a.x, a.y,
    CASE
    WHEN Quantity > 30 THEN 
    'The quantity is greater than 30'
    END,
    b.v AS c
FROM vmployee  ,   department   d   ,     profile 
where x = y OR y = m 
ORDER BY x