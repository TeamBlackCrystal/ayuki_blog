---
title: 'gpgが動かなくなった話'
categories:
- 日記
author: 'ゆぴ'
tags:
- ja
- ゆぴ
- gpg
- メモ
excerpt: 'gpgが gpg: skipped: secret key not avaliable になって動かなくなった話'
date: 2021-05-21
---

<!-- toc -->

# 前置き

久々にWindows10 Insidersになってみたら、いろいろとアプリとの相性が悪く、ブルスク吐きまくるわ、更新したらブルスク吐いて起動できなくなって結局巻き戻すわでキリがなかったので、クリーンインストールして、環境を作り直して、いざ開発に取り掛かろうと
思いGitのGPG署名を有効にしようとしたところで今回の出来事は起きています（（

## 何が起きたの?

以下のようにシークレットキーが使用できないといった感じのエラーが出ました。
```
gpg: skipped "*******": secret key not available
gpg: signing failed: secret key not available
error: gpg failed to sign the data
fatal: failed to write commit object
```

## 解決策

まあ、これはいたって単純で、gpgがどこにいるのか認識できていないので、以下のようにコマンドを打つと修正されます。

```powershell
# gpgがC:\Program Files (x86)\GnuPGにインストールされている場合
git config --global gpg.program "C:\Program Files (x86)\GnuPG\bin\gpg.exe"
```

これでもう一度コミットを行ってみると無事にコミットできました！

## 最後に

最近はほんとに忙しくて開発事とかあんまりできないけど、環境だけは整えていつでも開発できるようにしときたいから、今後の後学のためにも残しておきます！それではまたこんど！

## 参考

https://stackoverflow.com/questions/36810467/git-commit-signing-failed-secret-key-not-available

