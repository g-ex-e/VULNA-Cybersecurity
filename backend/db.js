const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'projet_owasp',
    password: 'password',
    port: 5432,
});

pool.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à PostgreSQL :', err);
    } else {
        console.log('Connexion à PostgreSQL réussie !');
    }
});

module.exports = pool;
