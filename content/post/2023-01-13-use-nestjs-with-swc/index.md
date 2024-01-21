---
title: Nest.jsでSWCを使う
date: 2023-01-13
categories:
- 開発
author: 'ゆぴ'
tags:
- swc
- nest.js
- node.js
comments: false
---

# 初めに

この記事ではbuild, devでSWCを使うようにするという記事となっています。また、この記事ではパッケージ管理にpnpmを用いていますが、npm等をご利用の場合はpnpmをnpm等といった具合に置き換えてください。

## 依存関係を追加する

```bash
# buildだけやる方
pnpm add -D @swc/cli @swc/core

# build, devどちらもやる方
pnpm add -D @swc/cli @swc/core @swc/register chokidar
```

## swcの設定を追加する

プロジェクトルートに`.swcrc`という名前で以下の内容を記載します。

```bash
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "decorators": true,
    },
    "target": "es2020",
    "keepClassNames": true,
    "transform": {
      "legacyDecorator": true,
      "decoratorMetadata": true,
    }
  },
  "module": {
    "type": "commonjs",
    "noInterop": true
  }
}
```

## nest-cli.jsonを編集する

sourceRootがあれば問題ないですが、一応全て載せておきます。（そもそも普通にプロジェクト作ったなら最初からあると思いますが）

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "plugins": []
  }
}
```

## devでホットリロードできるようにする

今回紹介する方法は以下のプロジェクトの方法です。ライセンスは`MIT`です。作者の`manuschillerdev`さんとcontributorの皆さんに感謝です！

https://github.com/manuschillerdev/nestjs-swc


### main.tsを編集する

まず初めにmain.tsで`bootstrap`関数をexportするようにします。
また、あとで作成するホットリロードのスクリプトから呼び出す関係上`bootstrap()`という呼び出しを`process.env.NODE_ENV`環境変数によって行うかどうか決めます。
最後に重要なポイントとして`bootstrap`関数で`return app`するようにしてください。これはあとで作成するホットリロード部分で、nestを止める為に必要になります。
```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  return app;
}

if (!process.env.NODE_ENV !== 'development') bootstrap();
```

### hmr.tsを作成する

`src/hmr.ts`に作成します。
ここでは、chokidarを用いてnestプロジェクトの変更を検知し、先ほどexportした`bootstrap`を呼び出し、nestを起動します。また、変更が発生した場合は自動で`bootstrap`の戻り値である`app`を用いて、`app.close()`を実行します。

import等を本家のプロジェクトから変更しています。

```ts
import * as chokidar from 'chokidar';
import { INestApplication, Logger } from '@nestjs/common';
import * as path from 'path';
import * as nestCliConfig from '../nest-cli.json';

const SRC_PATH = path.resolve(nestCliConfig.sourceRoot);
const MAIN_PATH = path.resolve(SRC_PATH, 'main.ts');

class HMR {
  private app: INestApplication;
  private logger = new Logger('HMR');

  constructor() {
    chokidar.watch(`${SRC_PATH}/**/*.ts`).on('change', (path) => {
      this.logger.log(`Detected changes in file: ${path}`);
      this.reload();
    });

    // naive error handling - source maps should work
    process.on('unhandledRejection', (reason) => this.logger.error(reason));
  }

  async reload() {
    this.logger.log('Starting HMR cycle');

    await this.executeAndLogWithDuration('Finished HMR cycle', async () => {
      // delete all require caches for SRC_PATH
      // TODO: check how to handle node_modules
      for (const key in require.cache)
        if (key.includes(SRC_PATH)) delete require.cache[key];

      // get fresh instance of main
      const { bootstrap } = await import(MAIN_PATH);
      // close server if running
      if (this.app) {
        await this.executeAndLogWithDuration('Closed server', this.app.close);
      }

      // reinitialize server
      await this.executeAndLogWithDuration(
        'Started Server',
        async () =>
          (this.app = await bootstrap().catch((err) => console.log(err))),
      );
    });
  }

  async executeAndLogWithDuration(msg: string, cb: () => Promise<any>) {
    const start = performance.now();
    await cb();

    const duration = Number(performance.now() - start).toFixed(0);
    this.logger.log(`${msg} +${duration}ms`);
  }
}

const hmr = new HMR();
hmr.reload();
```

## packages.jsonのscriptsを更新する

```json
{
  "scripts": {
    "build": "npx swc src -d dist -D",
    "start:dev": "NODE_ENV='development' node -r @swc/register src/hmr.ts",
  }
}
```

## 参考にさせていただいた記事

https://zenn.dev/cohky/articles/use-swc-performance
