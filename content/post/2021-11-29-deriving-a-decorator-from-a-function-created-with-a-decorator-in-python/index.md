---
title: Pythonでデコレーターで作った関数からデコレーターを派生させる
date: 2021-11-29 21:42:46
categories:
- メモ
author: 'ゆぴ'
tags:
- ja
- Zorin OS 16 Core
- Python3
- メモ
- 独学
---

# まずはじめに

タイトルで????となった方も多いでしょう。正直私の知識ではうまく言い表せないので変な違和感を覚えること請け合いです。
実際にコードを見てもらいましょう。今回の例はDiscord.pyのCogなどを使用できる CommandFrameWorkを用いた際にできるサブコマンドの作り方です。

```python

class (commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @commands.group()
    async def main():
        pass

    @main.command()
    async def sub():
        pass
```

さて、いいたいことは伝わったでしょうか?ようは commands.group デコレーターをつけた main関数から main.commandデコレーターを作成する方法になります。

## どうやるの？

では完成品からお見せします。

```python
class Command:
    @classmethod
    def command(cls):
        def wrapper(func):
            return func()

        return wrapper


def group(name=None):
    def wrapper(func):
        func()
        return Command

    return wrapper


@group()
def test():
    print("test")


@test.command()
def sub_test():
    print('test2')

test()
```

では、完成品をお見せしたところでどのような原理になっているのかの解説です。

!!! warning
    ここからは完璧な私の独学によるもので、あっているのかいまいちわからない解説です。その点をご理解の上ご覧ください。

まず以下のコードをご覧ください。
```python
def group(name=None):
    def wrapper(func):
        func()
        return Command

    return wrapper
```
このコードは `group` というデコレーターを作成している部分になるのですが、この時点で大事なところがあります。それは一番最初に引数で `func` を受け取っていないことです。
Googleなどで `デコレーター 作り方` などと調べてみた際に一般的に出てくるデコレーターは以下のようなコードだと私は思っています

```python
def group():
    def decorator(func):
        return func
    return decorator()
```

ではなぜ今回のコードでは、一番最初に `name` を受け取っているのでしょうか。そこから解説します。  
今回のコードでは、2つのデコレーターを作成する必要があります、１つは `group` 次に Command クラスにある `command` デコレーターです。
そして、 `group` デコレーターでは今回の仕様上 Commandを呼び出す必要があります。そうしたら先程の検索で出てきたコードで再現してみましょう

```python
class Command:
    @classmethod
    def command(cls):
        def wrapper(func):
            return func()

        return wrapper


def group():
    def wrapper(func):
        func()
        return Command

    return wrapper


@group()
def test():
    print("test")


@test.command()
def sub_test():
    print('test2')

test()

>>> group() missing 1 required positional argument 'func' # あっているかイマイチ覚えてません
```

さて、実装してみました。おや？一番最後にエラーが出ていますね...なぜでしょう。これは デコレーターを 呼び出す際に 関数として成り立つ都合上 func がなくなるからだと考えています。
これを解決するにはどうしましょう、そうです、引数を最初に受け取ればいいですね、ではまた調べてみましょう。 `python デコレーター 引数` そしたら出てくるコードはこんな感じでした。

```python
def group(name=None):
    def _group(func):
        def decorator():
            return Command
        return decorator
    return _group
```

さて、すごいネストしてますね、これの何が問題かというとこれでは先程言った `group` を呼び出す都合上 確かに `_group` までは行きますが、 decorator が呼び出されなくなってしまいます。
じゃあ、どうするかというと最初のコードに戻ることです。これを解決するのにとても時間がかかりました。これさえ乗り越えれば簡単です。


### なんで Command クラスの commandデコレーターは classmethod?

これはいくつかの理由があります、まず通常のクラスで作ると次に示す2つめのコードになります。
これの何が問題なのでしょうか、これは実行してみるとよく分かることなのですが、`@test.command()` の部分で selfが渡されていないと怒られてしまいます。
そのため、classmethod にしています。

```python
class Command:
    @classmethod
    def command(cls):
        def wrapper(func):
            return func()

        return wrapper


def group(name=None):
    def wrapper(func):
        func()
        return Command

    return wrapper

@group()
def test():
    print("test")

@test.command()  # 問題なく動く
def sub_test():
    print('test2')
```

```python
class Command:
    def command(self):
        def wrapper(func):
            return func()

        return wrapper


def group(name=None):
    def wrapper(func):
        func()
        return Command

    return wrapper

@group()
def test():
    print("test")

@test.command()  # selfが無いと怒られる
def sub_test():
    print('test2')
```

### ラストに testを実行

さて、これで終わりです。最後に `test` 関数を追加しましょう！

```python
class Command:
    @classmethod
    def command(cls):
        def wrapper(func):
            return func()

        return wrapper


def group(name=None):
    def wrapper(func):
        func()
        return Command

    return wrapper


@group()
def test():
    print("test")


@test.command()
def sub_test():
    print('test2')

test()
```

動きましたね！

## 最後に

何かわからない点があれば github の方に issueを建てていただけるとありがたいです！
今回のは記事で見たことがなかったので一応書いてみました、既存のものがあったらごめんなさい！
それではまた別の記事でお会いしましょう〜
