#!/bin/bash

# Ожидание запуска PostgreSQL
echo "Waiting for PostgreSQL to start..."
sleep 10

# Применение миграций к базе данных
echo "Applying migrations..."
PGPASSWORD=postgrespassword psql -h postgres -U postgres -d tasks_db -f /hasura-migrations/1_create_tables.sql
PGPASSWORD=postgrespassword psql -h postgres -U postgres -d tasks_db -f /hasura-migrations/2_sample_data.sql

# Ожидание запуска Hasura
echo "Waiting for Hasura to start..."
sleep 5

# Применение метаданных Hasura (автоматическое отслеживание таблиц и отношений)
echo "Applying Hasura metadata..."
curl -d'{"type":"pg_track_table","args":{"table":{"schema":"public","name":"users"},"source":"default"}}' http://graphql-engine:8080/v1/metadata
curl -d'{"type":"pg_track_table","args":{"table":{"schema":"public","name":"labels"},"source":"default"}}' http://graphql-engine:8080/v1/metadata
curl -d'{"type":"pg_track_table","args":{"table":{"schema":"public","name":"tasks"},"source":"default"}}' http://graphql-engine:8080/v1/metadata
curl -d'{"type":"pg_track_table","args":{"table":{"schema":"public","name":"task_labels"},"source":"default"}}' http://graphql-engine:8080/v1/metadata

# Отслеживание отношений
echo "Setting up relationships..."
# users -> tasks (array)
curl -d'{"type":"pg_create_array_relationship","args":{"table":{"schema":"public","name":"users"},"name":"tasks","using":{"foreign_key_constraint_on":{"table":{"schema":"public","name":"tasks"},"column":"assignee_id"}},"source":"default"}}' http://graphql-engine:8080/v1/metadata

# tasks -> assignee (object)
curl -d'{"type":"pg_create_object_relationship","args":{"table":{"schema":"public","name":"tasks"},"name":"assignee","using":{"foreign_key_constraint_on":"assignee_id"},"source":"default"}}' http://graphql-engine:8080/v1/metadata

# tasks -> task_labels (array)
curl -d'{"type":"pg_create_array_relationship","args":{"table":{"schema":"public","name":"tasks"},"name":"task_labels","using":{"foreign_key_constraint_on":{"table":{"schema":"public","name":"task_labels"},"column":"task_id"}},"source":"default"}}' http://graphql-engine:8080/v1/metadata

# labels -> task_labels (array)
curl -d'{"type":"pg_create_array_relationship","args":{"table":{"schema":"public","name":"labels"},"name":"task_labels","using":{"foreign_key_constraint_on":{"table":{"schema":"public","name":"task_labels"},"column":"label_id"}},"source":"default"}}' http://graphql-engine:8080/v1/metadata

# task_labels -> task (object)
curl -d'{"type":"pg_create_object_relationship","args":{"table":{"schema":"public","name":"task_labels"},"name":"task","using":{"foreign_key_constraint_on":"task_id"},"source":"default"}}' http://graphql-engine:8080/v1/metadata

# task_labels -> label (object)
curl -d'{"type":"pg_create_object_relationship","args":{"table":{"schema":"public","name":"task_labels"},"name":"label","using":{"foreign_key_constraint_on":"label_id"},"source":"default"}}' http://graphql-engine:8080/v1/metadata

echo "Initialization completed successfully!" 