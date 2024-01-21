---
title: MisskeyのBotをPythonで開発できるライブラリを公開しました
categories:
- 開発
author: 'ゆぴ'
tags:
- ja
- Python
- Misskey
- Ayuskey
- BotFrameWork
- Mi.py
- 配布物
excerpt: 'PythonでMisskeyで使えるBotを作ろう!'
date: 2021-10-19
---

<!-- toc -->

# はじめに

Misskeyって何?って人もいると思うのでまずMisskeyのご紹介から  
MisskeyはActivityPubというプロトコルを用いて作成された分散型SNSです。特徴として誰でもサーバーを作成し自分自身で運営することができます。
義類のアプリではMastodonと言われるものもあります。今回はそんな分散型SNSのMisskeyでPythonを用いて開発ができるBotFrameWorkを開発したのでご紹介します。


## Misskey.pyってのがあるけど何が違うの?

はい、Misskey.pyというライブラリが実はすでに存在します。ですが、これはあくまでWebSocketを用いない方法を使っており,これでBotを作るには自分でWebSocketの接続部分
や帰ってきた情報を処理するパーサーを作成しないといけません。正直な話一度作ってしまえばいいだけですが、どうせやるなら使いまわしたいですよね。  
そんなこんなで開発したのが今回紹介するMi.pyです。

## Mi.pyの主な特徴
- Discord.pyライクな文法
- taskなどの定期実行に対応
- cogシステムというファイルを分割して書くDiscord.pyの機能を搭載
- コマンドを楽に作成可能
- **バグが多い**

はい、最後のバグが多いは事実です、悲しいですね。正直な話私一人で開発しているのでテストしてる人物が私しかいないという状況です。

## 実際に使ってみる

```bash
pip install mi.py
```

```python
from mi.ext.commands import Bot
from mi.note import Note
from mi.router import Router

uri = 'ws://localhost:3300/streaming'
token = ''

class MyBot(Bot):
    def __init__(self):
        super().__init__(command_prefix='!')

    async def on_ready(self, ws):
        await Router(ws).channels(['home'])
        print(self.i.username)

    async def on_message(self, ctx: Note):
        print(f'{ctx.created_at} | {ctx.author.instance.name} | {ctx.author.username}がノートしました: {ctx.text}')
        await self.process_commands(ctx)

if __name__ == '__main__':
    bot = MyBot()
    bot.run(uri, token)
```

このようにある程度少ないコードでノートを受け取るだけのBotが作成できます。
ノートの投稿をするには次のようなコードを用います。

```python
await Note(text='Hello Mi.py').send()
```

もちろんファイルのアップロードにも対応しています。

```python
res = Drive().upload('/home/example/example.png', 'example.png')  # ドライブに画像をアップロード
print(res.url)
```

これらを先程のノートに追加することでノートに画像を乗っけることもできます。

## ドキュメントなど

Mi.pyではなるべく多くの情報を皆さんに見ていただくためにSphinxを用いたドキュメントとMkDocsを用いた私自身が一つ一つ書いた2つのサイトがあります。
この2つを用いることでより多くの情報を入手することが可能です。

[APIドキュメント](https://mipy.readthedocs.io/ja/latest/)
[チュートリアルなど](https://mipy-hub.readthedocs.io/ja/latest/)

## 最後に

Mi.pyでは現状私が欲しい機能だけをちょこちょこと追加しています。そのため機能が少ないという問題があります。なので皆さんが実際に使ってみてこんな機能がほしい、
こんなバグが有るなどと行った情報をくださると開発の励みになります。ぜひMi.pyを使ってみてください。

## バグ報告など

[私のMisskeyアカウント](https://ar.akarinext.org/@yupix)
[Mi.pyのIssues](https://github.com/yupix/Mi.py/issues)
[Discordサーバー](https://discord.gg/CcT997U)
