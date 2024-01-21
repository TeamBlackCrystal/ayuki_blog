---
title: PythonでMisskeyのBotFrameWorkを作ってみた
date: 2021-12-21 17:41:26
categories:
- Misskeyアドベントカレンダー2021
author: 'ゆぴ'
tags:
- misskey
- ゆぴ
- Misskeyアドベントカレンダー2021
- Mi.py
---


これは [Misskey Advent Calendar](https://adventar.org/calendars/6273) 21日目の記事です。

# はじめに

PythonでMisskeyのBotを作って見る際に第一に選択肢に出てくるのが、 YuzuRyo61さんの[Misskey.py](https://github.com/YuzuRyo61/Misskey.py) です。ですが、私はWebSocketを受信してリアルタイムにタイムラインや通知の情報を取得したかったため、このBotFrameWorkを作ってみました。

## 使い方

まず、今回作成したライブラリ [Mi.py](https://github.com/yupix/mi.py)をインストールします

```bash
pip install mi.py
```

次に実際に実行するためのコードを書きます。

```python
import asyncio
from mi import Note
from mi.ext import commands
from mi.router import Router

class MyBot(commands.Bot):
    def __init__(self, cmd_prefix: str):
        super().__init__(cmd_prefix)
    
    async def on_ready(self, ws):
        print(f'{self.i.username}' に接続しました)
        await Router(ws).connect_channel(['global', 'main'])
    
    async def on_message(self, note: Note):
        print(f'{note.author.username}: {note.content}')

if __name__ == '__main__':
    uri = "wss://example.com/streaming"
    token = "This is your token"

    bot = MyBot('!')
    asyncio.run(bot.start(url, token))
```

これで、グローバルタイムラインを受信する初期的なbotができました。

## 投稿をしてみる

今度は投稿をしてみましょう、先程のコードを一部書き換えてみます

```diff
async def on_ready(self, ws):
    print(f'{self.i.username}' に接続しました)
    await Router(ws).connect_channel(['global', 'main'])
+   res = await self.post_note('hello~')
+   print(res.author.username, res.content)
```

このように、自分で投稿し、そのレスポンスをオブジェクトとして取得することが可能です。

## 大変だったこと

今回のライブラリは絶賛開発中なのですが、Pythonの循環参照がとにかく最初の頃多く発生してとても大変でした。他には、非同期のwebsocketライブラリが少なかったことなど、色々とあり、作成にとても時間がかかりました。（まだできてないですけど）

## ドキュメントについて

!!! warning
    まだドキュメントは作成途中であり、一部のモデルが不足しています。

[ここ](https://yupix.github.io/Mi.py/mi.html) にcommitしたら自動で生成するようにしてあるドキュメントがあるので、何かわからないことがあれば参考にしてみてください。

## 最後に

このプロジェクトは一応頑張って作っているつもりなので、もしよければ、使った感想などを [私のMisskeyアカウント](https://rn.akarinext.org/@yupix) に送ってくださるとモチベーションも上がってとても嬉しいです。
あと、MIT Licenseで [GitHub](https://github.com/yupix/Mi.py) にて公開しています。 pull requestなども歓迎していますので、もしよければやってみてください。

最後になりますが、Misskeyは リアクションなどをインスタンスごとのカスタム絵文字で貰うことができ、自分のつぶやきにTwitterのようなハート以外のリアクションがほしいという方にも楽しめると思うので、Misskeyにご興味がある場合は [joinmisskey](https://join.misskey.page) をぜひご覧ください。

ここまでご覧頂きありがとうございました。
