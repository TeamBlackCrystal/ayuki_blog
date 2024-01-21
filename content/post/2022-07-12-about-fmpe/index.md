---
title: FMProjectEについて
date: 2022-07-12
categories:
- dev
author: 'あき'
tags:
- Dev
- Minecraft
- Modding
- Forge
---

# 最近作った動画版

<script type="application/javascript" src="https://embed.nicovideo.jp/watch/sm40731600/script?w=640&h=360"></script><noscript><a href="https://www.nicovideo.jp/watch/sm40731600">FMProjectEの紹介 [1.7.10]</a></noscript>

## 要約

最近(2年前)作ったModです。1.12.2のProjectEからEMC上限変更を移植したModです。

## 何を変えた？

動画にある通り、EMC上限を``Long.MAX_VALUE``にしました。

## BREAKING CHANGE💥

* ``PEAA``と``PEEX``と互換性が無いです。
  * ``PEAA``に関しては``FMPEAA``として対応版を配布予定。
  * ``PEEX``はライセンス的にわからんし、なんか知らんけどデコンパイルがうまくできなかった記憶がある。
* ProjectE本体は消して入れてください。

## ダウンロード

[ここ](https://www.curseforge.com/minecraft/mc-mods/fmprojecte-fmpe)
[src](https://lab.teamblackcrystal.com/aki/fmprojecte) (for developer)

## 注意

何があっても責任は取りません。必ずバックアップしてください。
本家にバグ報告を送らないでください。