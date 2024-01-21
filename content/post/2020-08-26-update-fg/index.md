---
title: 1.7.10のmodding環境構築方法
author: 'あき'
tags:
- ja
- minecraft
- modding
- forge
- gradle
excerpt: moddingを楽しもう!
date: 2020-08-26
---

<!-- more -->

!!! warning
    現在この方法ではセットアップすることができません。かわりに[ここ](https://github.com/GTNewHorizons/lwjgl3ify/issues/20#issuecomment-1441396877)の2つの方法のいずれかを行ってください。

!!! info tip
    https使えないのは・・・

<!-- toc -->

## はじめに

Forge 1.7.10で環境構築ができないので、色々調べてみたのでその結果をまとめてみる。

## 環境

- IDEA Community
- java 8

## どうやるの？

方法は大きく分けて2つあります。

1. gradleのバージョンを上げる
2. 改造版のForgeGradleを使う

どちらがいいかは好みの問題です。

### gradleのバージョンを上げる

デフォルトのForgeGradleは実は4.4.1辺りまで対応しているので、HTTPSに対応した2.1以降にするだけです。

``gradle/wrapper/gradle-wrapper.properties``を編集します

2.1にする場合

```sh
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-2.1-bin.zip
```

4.4.1にする場合

```sh
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-4.4.1-bin.zip
```

### 改造版のForgeGradleを使う

公式からsrcをダウンロードする代わりに、[anatawa12/ForgeGradle-1.2](https://github.com/anatawa12/ForgeGradle-example)から``code``ボタンを押して``Download ZIP``を押してダウンロードするか、git cloneし通常どうりに使用します。

## 最後に

実は3つ目に既存のbuild.gradleを書き換えて対応させる方法もありますが、それは[ここ](https://github.com/anatawa12/ForgeGradle-example#how-to-replace-forgegradle-12-with-anatawa12s-fork)に書いてあるので、頑張ってみてください！！

