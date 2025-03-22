-- Tạo 200 user
INSERT INTO "user" (email, password, username, avatar, bio, website, birthday, gender, address, privacy, last_active, user_category, company, education, role, created_at)
SELECT
    'user' || i || '@gmail.com' AS email,
    '$2b$10$c3fD0cw/Mi4/xBLvXIOEB.rWSskSxUGxx5AYW8kkGVrz99Q35F/7y' AS password,
    'user' || i AS username,
    'avatar' || i || '.png' AS avatar,
    CASE WHEN i % 2 = 0 THEN 'I am user ' || i ELSE NULL END AS bio,
    'https://github.com/ntthanh2603' AS website,
    ('1990-01-01'::DATE + (i * INTERVAL '1 month'))::DATE AS birthday,
    CASE
        WHEN i % 3 = 0 THEN 'male'::user_gender_enum
        WHEN i % 3 = 1 THEN 'female'::user_gender_enum
        ELSE 'other'::user_gender_enum
    END AS gender,
    'Address ' || i AS address,
    CASE
        WHEN i % 3 = 0 THEN 'public'::user_privacy_enum
        WHEN i % 3 = 1 THEN 'private'::user_privacy_enum
        ELSE 'friend'::user_privacy_enum
    END AS privacy,
    ('2025-03-01'::TIMESTAMP + (i * INTERVAL '1 hour')) AS last_active,
    'casualuser'::user_user_category_enum AS user_category,
    CASE WHEN i % 3 = 0 THEN ARRAY['Company ' || i]::TEXT[] ELSE ARRAY[]::TEXT[] END AS company,
    CASE WHEN i % 2 = 0 THEN ARRAY['Education ' || i]::TEXT[] ELSE ARRAY[]::TEXT[] END AS education,
    'user'::user_role_enum AS role,
    CURRENT_TIMESTAMP AS created_at
FROM generate_series(1, 200) AS i;



-- Tạo 5 admin
INSERT INTO "user" (email, password, username, avatar, bio, website, birthday, gender, address, privacy, last_active, user_category, company, education, role, created_at)
SELECT
    'admin' || i || '@gmail.com' AS email,
    '$2b$10$c3fD0cw/Mi4/xBLvXIOEB.rWSskSxUGxx5AYW8kkGVrz99Q35F/7y' AS password,
    'admin' || i AS username,
    'avatar' || i || '.png' AS avatar,
    CASE WHEN i % 2 = 0 THEN 'I am admin ' || i ELSE NULL END AS bio,
    'https://github.com/ntthanh2603' AS website,
    ('1990-01-01'::DATE + (i * INTERVAL '1 month'))::DATE AS birthday,
    CASE
        WHEN i % 3 = 0 THEN 'male'::user_gender_enum
        WHEN i % 3 = 1 THEN 'female'::user_gender_enum
        ELSE 'other'::user_gender_enum
    END AS gender,
    'Address ' || i AS address,
    CASE
        WHEN i % 3 = 0 THEN 'public'::user_privacy_enum
        WHEN i % 3 = 1 THEN 'private'::user_privacy_enum
        ELSE 'friend'::user_privacy_enum
    END AS privacy,
    ('2025-03-01'::TIMESTAMP + (i * INTERVAL '1 hour')) AS last_active,
    'casualuser'::user_user_category_enum AS user_category,
    CASE WHEN i % 3 = 0 THEN ARRAY['Company ' || i]::TEXT[] ELSE ARRAY[]::TEXT[] END AS company,
    CASE WHEN i % 2 = 0 THEN ARRAY['Education ' || i]::TEXT[] ELSE ARRAY[]::TEXT[] END AS education,
    'admin'::user_role_enum AS role,
    CURRENT_TIMESTAMP AS created_at
FROM generate_series(1, 5) AS i;