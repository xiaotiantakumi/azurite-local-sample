#!/bin/bash

host="localhost"
dbUser="root"
dbPass="root"

until mysql --host=$host --user=$dbUser --password=$dbPass --protocol=TCP -e "SELECT 1"; do
  echo "Waiting for DB to start..."
  sleep 5
done

echo "DB is ready!"
