---
title: Windowsにsudoが欲しいかい？
categories:
- 解説
author: aki
tags:
- ja
- windows
- scoop
- choco
- sudo
- 解説
excerpt: Windowsにsudoを追加する方法
date: 2020-05-01
---

<!-- more -->

!!! info tip
    欲しいときあるよね？


<!-- toc -->

## はじめに

[^0]: Linuxやmacに存在するrootに昇格するコマンド。今回は、知っていることを前提としている。

Windowsにsudo[^0]ほしいけどわからない！！とか、調べても本物に程遠い[^1]のしか見つからない！！という人に向けて書いています。

[^1]: 日本語で検索するとよく出てくるやつは、別窓だったり、色が出なかったりと色々と問題がある。

## Q.使えるものはあるの？

A.あります

### 使えるもの

- [gerardog/gsudo](https://github.com/gerardog/gsudo)
- [lukesampson/psutils(sudo.ps1)](https://github.com/lukesampson/psutils)

## どうやって入れるの？

めんどくさいのでパッケージマネージャーを使いましょう。

### 使えるやつ

*[choco]: 要administratorだが、少ない手間でたくさんのパッケージを入れられる。

!!! info tip
    chocoのインストール手順は準備中です。
    scoopのインストール方法は {%post_link 2020-05-01-install-scoop 'こちら'%}

- choco
- scoop
## インストール

実際に入れてみましょう。

### gerardog/gsudoの場合（個人的なオススメ）

```powershell
#非administratorでできるのでオススメ
scoop install gsudo

#要administrator
choco install gsudo
```

### lukesampson/psutils(sudo.ps1)の場合

```powershell
scoop install sudo
```

chocoにも同名の物があるがこれは完成度低い[^2]

[^2]: 別窓タイプ

## How to

```powershell
sudo choco install windows-terminal
```

```powershell
#hostsファイルが楽に編集できるよ！やったね！！
sudo notepad C:\Windows\System32\drivers\etc\hosts
```

!!! warning 
    何も気にせず乱用してはいけません。
    ウイルス等の感染の原因になります。


!!! error danger
    ``rm``や``rd``(及び``rmdir``)などのファイルを削除するコマンドに対して``C:\``や``/``を指定してはいけません。(OSや個人データをを破壊する可能性があります。)


## 最後に

管理者権限なので扱いには気をつけましょう。

Linuxやmacを使っているあなたもですよ？rootの扱いには気をつけましょう。
