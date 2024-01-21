---
title: qt5をbuildしてみる
categories:
- 解説
author: 'あき'
tags:
- ja
- windows
- qt5
- choco
- 解説
excerpt: qt5をwindowsでビルドする方法を解説します
date: 2020-07-04
---

<!-- markdownlint-disable MD033 -->

<!-- more -->

!!! info tip
    chocoにもscoop[^0]にもねぇ


[^0]: 古いのはあるがないのと同じ

<!-- toc -->

## はじめに

なぜか知らんが、mozcをwindowsでbuildしたくなったが、qtがないのでbuildしてみる。

## 環境

- git
- python2.7
- perl
- make (いるのこれ？)

!!! info tip
    追加でvsを準備してください。C関係が必要です。


### どうやって入れるの？

めんどくさいのでパッケージマネージャーを使いましょう。

``` powershell
scoop bucket add versions

scoop install git python27 perl make
```

## 下準備

!!! info tip
    ``~/work``を作業場所として想定しています。


まずは、git cloneをしましょう。これをしないと始まらないもんね。

```bash
git clone git://code.qt.io/qt/qt5.git
#リポジトリ内に移動
cd qt5
```

このままでもいいのですが、ときが進みqt6が出たときに問題が発生しそうなので、しっかりとcheckoutしましょう。

```bash
git checkout v5.15.0
```

このままだと、準備が完璧ではないので、仕上げに次のものを実行します。

```bash
perl init-repository --module-subset=qtbase
#エラーが出たら "-f" をつけましょう。

#~/work直下に移動
cd ..
mkdir qt5_build
```

## build start!!!

!!! info tip
    スタートメニューから``x64 Native Tools Command Prompt for VS 2019``を探して実行しましょう。(2019は環境によっては、2017や2015)
    windowがおかしくなる場合は``x64 Native Tools Command Prompt for VS 2019``の実態のbatファイルをwindows-terminal等で動いたcmdで実行することができます。
    例:``H:\VisualStudio\2019\Community\VC\Auxiliary\Build\vcvars64.bat``


いざ、びるど

```bash
#~/work/qt5_build
..\qt5\configure -developer-build -opensource -nomake examples -nomake tests

nmake
```

## 最後に

~~これを書いてる時点では結果が出てないけど、多分動くと思う。~~
32bitでビルドしないと、mozc用としては使えないの忘れてた・・・
