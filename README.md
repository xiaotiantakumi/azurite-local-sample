# 使い方

### Azure Functions Core Tools をインストール

こちらにインストーラーがあります。v４を選択してください。

https://docs.microsoft.com/ja-jp/azure/azure-functions/functions-run-local?tabs=v4%2Cwindows%2Ccsharp%2Cportal%2Cbash

## リポジトリー作成
Use this templateを押します。
![image](https://user-images.githubusercontent.com/19358182/179793260-c362e6c6-9d02-44a5-b205-f666d97156f1.png)
必要な項目を書いてCreate repository from templateを押します。
  
![image](https://user-images.githubusercontent.com/19358182/179793543-0256248e-d329-4225-a577-4eced5fb856a.png)

できたリポジトリーをgit cloneしてきます。

## ローカルで実行
local.settings.jsonを以下内容で作成します。
```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "",
    "STORAGE_CONNECTION_STRING": "",
    "DB_HOST": "localhost",
    "DB_NAME": "db",
    "DB_USER": "root",
    "DB_PASSWORD": "root"
  }
}

```
![image](https://user-images.githubusercontent.com/19358182/199638437-086d6dd2-415c-46c7-b6d7-c294cade5171.png)

### 必要なモジュールをインストール

```
npm install
```

### デバッグしたい時

```
npm run start
```

また、VSCode の任意の API の index.ts で F5 を押せばブレークポイントを設置した上でデバッグができます。
この状態でPostmanなどでHttpリクエストを送ると、ブレークポイントで停止します。
または、swagger-uiを使ってデバッグすることもできます。(後述)


```
SampleTrigger: [GET,POST] http://localhost:7072/api/SampleTrigger
```

# swagger-uiの起動

## 前提条件

必要なモジュールをインストールします。

```shell
brew update
brew install java
brew install swagger-codegen
```

## swagger-uiの起動

```shell
npm run swagger
```

こうすると、以下のように出力されます。
Your server is listening on port 8080 (http://localhost:8080)
Swagger-ui is available on http://localhost:8080/docs

./docs/swagger/README.mdを参照してください。

## swagger-uiを使ってデバッグする。

デバッグしたい時を参考に、アプリケーションを実行しておきます。
ブレークポイントを置いた状態で、swagger-uiの画面でAPIを実行します。

document.yamlで以下確認してください。
このURLに対して、swagger-uiからAPIを実行します。

```yaml
servers:
  - url: http://localhost:7071/api
```

# ローカルDBについて

ルート直下にあるdockerでdocker compose upすると、ローカルDBが起動します。
```
.
├── README.md
├── SampleTableAccess
├── SampleTrigger
├── coverage
├── db-service
├── dist
├── docker
├── docs
├── entity
├── host.json
├── jest.config.ts
├── local.settings.json
├── node_modules
├── package-lock.json
├── package.json
├── tests
└── tsconfig.json
```

### テストの実行

```
npm run test
```

テストの結果がルートの coverage に吐き出されます。

coverage/lcov-report/index.html を開くとテストのレポートが確認できます。

### Prettier でソースの整形と ESLint で構文チェックを実行する

```
npm run fix
```

### コンパイル

```
npm run  build
```

## ドキュメントの自動生成について

docs/swagger/document.yamlを修正した時に自動的にjson変換するには、Run on SaveというVisual Studio Codeのプラグインをインストールする必要があります。

仕組み的には、yamlの保存を監視し、保存されたら変換を実行するというものです。

こちらの設定は、.vscode/settings.jsonに記載してあるemeraldwalk.runonsaveで定義しています。

また、自動的に実行する方法以外にも以下コマンドでyamlファイルを変換することができます。

```
npm run docs
```

## その他
APIはAzureの仕組み上ルートディレクトリ直下に配置する必要があります。(ビルド時にdistでうまく調整すればこの限りではなさそうですが。)
本プロジェクトでは、AzureAPIの命名規則をパスカルケースにしました。
ターミナルでルートディレクトリに移動して以下を実行すると、APIの一覧が表示されます。

```bash
find . -name function.json -exec grep -o '"scriptFile": "../dist/\([^/]*\)/index.js"' {} \; | sed 's/"scriptFile": "..\/dist\/\([^/]*\)\/index.js"/\1/g' | sort -u
```