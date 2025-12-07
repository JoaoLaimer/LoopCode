INSERT INTO programming_languages (name, api_identifier)
VALUES
  ('Java', 'java'),
  ('Python', 'python'),
  ('C', 'c'),
  ('C++', 'cpp')
ON CONFLICT (name) DO NOTHING;

