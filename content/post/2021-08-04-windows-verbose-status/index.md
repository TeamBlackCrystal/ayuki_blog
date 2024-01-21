---
title: Windowsの起動時とかの詳細メッセージを表示する
categories:
- 一般
author: 'あき'
tags:
- ja
- windows
- メモ
excerpt: 'ログを見るのは楽しいね！！'
date: 2021-08-04
---

<!-- toc -->

## はじめに

お久しぶりです。前回の記事から8ヶ月ぶりですね。

最近久しぶりにWindows ServerのVMを触ったら起動時とかの詳細メッセージを表示したくなったので調べてみました。
次にWindows入れるときには絶対に忘れていそうなので、忘れてもいいようにメモしておきます。

## 環境

- Windows11 (win2k以降)

## やり方

### かんたん

```reg
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System]
"VerboseStatus"=dword:00000001
```

上のをわかりやすい名前(例: ``VerboseStatus.reg``)で保存します。
その後ダブルクリックまたは、右クリック > 結合でレジストリエディターに許可を与えます。

### ローカル グループポリシー エディターを使う

コンピューターの構成 > システム > 詳細な状態メッセージを表示する

有効をオンにする。

### レジストリエディタを使う

``regedit``を起動し、``HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System``へ移動する。
``VerboseStatus``をdwordで作成し、編集して``1``をセットする。

## 最後に

これで一度ログアウトしてログインし、正しく動作することを確認して完了です。

## 参考

- [Win 8/8.1編: サインアウト時などに詳細メッセージを表示する](https://news.mynavi.jp/article/windows-297/)
- [詳細な状態メッセージを表示する](https://admx.help/?Category=Windows_10_2016&Policy=Microsoft.Policies.WindowsLogon::VerboseStatus&Language=ja-jp)
