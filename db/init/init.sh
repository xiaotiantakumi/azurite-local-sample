#!/bin/bash
host="localhost"
dbUser="root"
dbPass="root"

# DDLでパスワードの認証形式を変更する
mysql --host=$host --user=$dbUser --password=$dbPass < "/docker-entrypoint-initdb.d/init.sql"
# データ挿入
mysql --host=$host --user=$dbUser --password=$dbPass < "/docker-entrypoint-initdb.d/sql/sample.sql"