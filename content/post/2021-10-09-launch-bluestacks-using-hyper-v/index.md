---
title: Hyper-V環境でBlueStacksを使う方法
categories:
- 解説
author: 'ゆぴ'
tags:
- ja
- Windows10
- Windows11
- BlueStacks
- Hyper-V
excerpt: 'Hyper-V環境でBlueStacksを動かそう！'
date: 2021-10-09
---

<!-- toc -->

## Hyper-V環境で動くAndroidエミュレーター欲しくない？

Hyper-V環境で動くAndroidエミュレーターを求めて我々はジャングル（Google）の奥地へと向かった。

## BlueStacks (Hyper-V) Beta

さて、今回の本題であるBlueStacksですが、なんと公式がHyper-Vに対応しているものをBetaながら公開しています。
公式サイトは[こちら](https://support.bluestacks.com/hc/ja/articles/360041390952-BlueStacks-Hyper-V%E7%89%88%E3%82%92%E5%88%A9%E7%94%A8%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95)

## インストールするだけじゃないの？

ならそれ使えば終わりじゃん！お疲れ！とは行きません、確かにインストール直後ならそれでいいのかもしれませんが、2回目の起動後やPCを
再起動すると途端に起動ができなくなってしまいます。

## 解決策

以下のコマンドを管理者プロンプトで実行することで修正が可能です

```bash
netsh advfirewall firewall add rule name="BlueStacks Service" dir=in action=allow remoteip=any localport=2860-2892 protocol=TCP enable=yes
```


## 参考

https://www.youtube.com/watch?v=A7USXXZ04eM
https://markdevel.hatenablog.com/entry/2021/04/27/024314

