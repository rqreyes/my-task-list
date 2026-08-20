-- create table
-- ------------------------------------------------------------
DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
  id bigint GENERATED ALWAYS AS IDENTITY,
  is_completed BOOLEAN DEFAULT FALSE,
  title VARCHAR(255) NOT NULL
);

-- add data
-- ------------------------------------------------------------
INSERT INTO tasks (is_completed, title) VALUES
(TRUE, 'Update resume'),
(TRUE, 'Develop task list application'),
(DEFAULT, 'Apply to jobs'),
(DEFAULT, 'Get a job'),
(DEFAULT, 'Take over the world');
