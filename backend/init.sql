CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    has_seen_intro BOOLEAN DEFAULT FALSE,
    time_spent INTEGER DEFAULT 0
);

CREATE TABLE user_modules (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL,
    progress DECIMAL(3,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 1),
    UNIQUE(user_id, module_id)
);
