CREATE TABLE tasks (
  id bigint GENERATED ALWAYS AS IDENTITY,
  is_completed BOOLEAN DEFAULT FALSE,
  title VARCHAR(255) NOT NULL
);

INSERT INTO tasks (is_completed, title) VALUES
(DEFAULT, 'Hello world'),
(DEFAULT, 'My first task'),
(TRUE, 'My completed task');
