-- sql8からパスワードの認証形式が変更されたのでその対応
-- https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server/50961428:embed:cite
ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'root';
flush privileges;