---
title: ArchLinuxにVNCを使ってサブディスプレイを作る
categories:
- 一般
author: 'ゆぴ'
tags:
- ja
- archlinux
- 解説
- vnc
excerpt: ArchLinuxにVNCを使ってサブディスプレイを作る
date: 2020-06-06
---

## まずはじめに

Ubuntu などのメジャーなディストリビューションでは多くの記事がすでに出回っています。
そこで、ArchLinux だとパッケージが変わっていたり個人的によく忘れてしまうので備忘録として残しておきます。

## やりかた

### パッケージのインストール

以下の 2 つのパッケージが必要です。

- tigervnc（公式パッケージ）
- x2vnc-no-xinerama（AUR）

```bash
sudo pacman -S tigervnc
yay -S x2vnc-no-xinerama
```

### サーバー側の準備

```bash
$ vncserver :1
You will require a password to access your desktops.
Password: ******
Verify: ******
```

### Android　側の準備

クライアント側では Android で[VNC Viewer - Remote Desktop](https://play.google.com/store/apps/details?id=com.realvnc.viewer.android&hl=ja)を今回は使用します。
その他にも私の環境では[VNC Viewer](https://play.google.com/store/apps/details?id=nine.viewer&hl=ja)での動作も確認しています。

### マウスの行き来の準備

ここで使用するパスワードはさきほど[サーバーの準備](#サーバー側の準備)で設定したパスワードを入力します

```bash
$ x2vnc -shared -west localhost:1
x2vnc: VNC server supports protocol version 3.8 (viewer 3.3)
Password: ******
```

これでマウスが行き来できるようになりました。

!!! warning
    注意点として、ウィンドウをサブディスプレイに持っていく事などはできません（その逆もしかり）


### 起動

```bash
$ vncserver :1 -geometry 1280x800 -alwaysshared
$ x2vnc -shared -west localhost:1
```

#### x2vncのオプションについて

-westなどはマウスカーソルをどの向きに持っていった際サブディスプレイに移動するかを設定するものです。
以下がその一覧です

|オプション名|使い方|
|--|--|
|-north|**北**方向にマウスを持っていくとサブディスプレイに繋がる|
|-east|**東**方向にマウスを持っていくとサブディスプレイに繋がる|
|-south|**南**方向にマウスを持っていくとサブディスプレイに繋がる|
|-west|**西**方向にマウスを持っていくとサブディスプレイに繋がる|

### xstartupの編集

xstartupとはVNCのデスクトップ環境設定ファイルです。
デフォルトではおそらく  
 ~/.vnc/xstartup  
にファイルが存在します

このファイルを編集します。

```bash
$ nano ~/.vnc/xstartup

#元からあった行を...で表しています
...

#⬇を追加
exec cinnamon &
```

今回の場合はcinnamonがvncserverに接続すると表示されるはずです。
ここを自分のすでに入れてあるデスクトップ環境のコマンドに書き換えることで変更が可能です。

## 謝辞

この記事は**ともの技術メモ**様の記事を見てArchLinuxで実際にできるのか
パッケージ名などが違う為忘れないように書かせていただきました。
内容の多くが**ともの技術メモ**様の内容と被ってしまっている事をここで謝罪します。

## 参考

- 全般コマンド
> ともの技術メモ
> <cite>https://tomono.tokyo/2016/08/09/6228/</cite>
- xstartupの意味  
[お便利サーバー.com](http://www.obenri.com/_vnc/vnc_server1.html)

