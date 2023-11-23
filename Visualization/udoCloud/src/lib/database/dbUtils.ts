const query = 'USE udocloud;\n' +
    'SELECT token.name, sum(token.amount)\n' +
    'FROM token\n' +
    'JOIN article a USING(articleID)\n' +
    'WHERE token.articleID IN \n' +
    '(    SELECT articleID\n' +
    '    FROM article JOIN topic USING(topicID)\n' +
    '    WHERE dateID IN \n' +
    '    (    SELECT dateID \n' +
    '        FROM date \n' +
    '        WHERE day LIKE 1\n' +
    '        AND month LIKE 1\n' +
    '        AND year LIKE 1970\n' +
    '    )\n' +
    '    AND topic.name IN (\'Sport\')\n' +
    ')\n' +
    'GROUP BY token.name;'