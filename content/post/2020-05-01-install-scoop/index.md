---
title: scoopを入れよう！！
categories:
- 解説
author: 'あき'
tags:
- ja
- windows
- scoop
- 解説
excerpt: scoopを導入してwindowsライフを楽に！
date: 2020-05-01
---

<!-- markdownlint-disable MD033 -->

<!-- more -->

!!! info tip
    scoopって知ってる？便利だよ～


<!-- toc -->

## はじめに

sudo回で使ってる``scoop``を入れます。~~投稿順序逆だね~~

## 前提環境

- PowerShell (^5) または　PowerShell Core
- .Net Framework (^4.5)

!!! info tip
    サポート中のWindowsなら問題ないはずです。


## インストール

```powershell
#非administrator
iwr -useb get.scoop.sh | iex
```

上記のコマンドを実行した際以下のようなエラーが発生した場合は、次のコマンドを実行した後に再度上記のコマンドを実行してください。

```powershell
#エラー内容
PowerShell requires an execution policy in [Unrestricted, RemoteSigned, ByPass] to run Scoop.
For example, to set the execution policy to 'RemoteSigned' please run :
'Set-ExecutionPolicy RemoteSigned -scope CurrentUser'
```

```powershell
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
```

## How to

```powershell
scoop install git
```

## 最後に

便利でしょ？
追加でjavaやphpなどのbucket（scoopでのリポジトリ）もあるので追加することが可能です。

じゃんじゃん使っていこうね～

!!! info tip
    もしかすると、応用編も出るかもしれません。

~~<div v-twemoji>投稿順序はGitHub行かないと基本的にはバレない:thinking:</div>~~
