# 使い方

データの永続化設定はしていません、

## 起動時

```
docker compose up
```

## 終了時

```
docker compose down
```

# ログの確認

MySQL のセットアップからのログはこちらから見れます。

```
docker compose logs
```

SQL のクエリーに関するログは以下でファイルの位置を確認します。

```
show variables like 'general_log%';
```

general_log_file にファイルの場所が記載されているので、そのファイルを Docker のコンテナーに入って確認してください。