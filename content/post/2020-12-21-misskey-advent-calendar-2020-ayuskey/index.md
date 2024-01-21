---
title: Ayuskeyって何？
categories:
- Ayuskey
author: 'あき'
tags:
- ja
- Advent Calendar
- Advent Calendar 2020
- Misskey
excerpt: XEのEOLに伴いこっちに移植
date: 2020-12-21
custom_cover: '/image/cover/ayuskey.svg'
---

**[Misskey Advent Calendar 2020](https://adventar.org/calendars/5026)の21日目の記事です。**

## はじめに

多分多くの人が初めてだと思います。[aki](https://kr.akirin.xyz/@aki)といいます。
今回は私と[@yupix@ne.akarinext.org](https://kr.akirin.xyz/@yupix@ne.akarinext.org)氏で作っているAyuskeyについてお話させていただきたいと思います。

### 名前の由来について

名前の由来は、**a**kiと**yu**pixからとってAyuとなっています。(このブログも同じ)
なお、初期の頃は私一人で開発していたのでReiskeyという名前をつけておりました。その頃の名残として、バージョンに`rei0784`をつけるのを継承しています。

## 技術的なあれこれ

現在もパッケージ更新などのメンテナンスがされている[mei23/misskey-v11](https://github.com/mei23/misskey-v11)をベースに開発しています。
また、筆頭となる[私のインスタンス](https://kr.akirin.xyz)と[yupix氏のインスタンス](https://ne.akarinext.org)は、Raspberry Pi 4で運用しているため、arm64で動かしやすいようにDockerfile等が調整されていたりします。

動かなかったり、ビルドができなかったりした場合は気軽に[@aki](https://kr.akirin.xyz/@aki)までご連絡ください。

## 鯖缶にやさしく

全文検索で重いElasticsearchを使う必要がなくなりました！！
本流にある~~放置されていそうな~~[#5138](https://github.com/syuilo/misskey/pull/5138)をマージしてsonicという検索エンジンを使えるようにしました。とても軽く、Raspberry Pi 4であっても軽快に動作します。実際に、私のインスタンスで使用しております。(ただ、短い単語とかだと精度が終わってるので、要調整)

他の鯖にある絵文字をコピーしたいときありますよね？
本流のapiを移植してできるようにしました！！
現在はapiを直接叩くのが1番安定していますが、GUIでのコピーができるように作業中です。

### より高機能を目指して

本来のmisskey v11にはあまりぼかし(blur)や透明度がついていないのですが、より近代的な見た目を目指しています。現在は未実装ですが重い環境では`インスタンスのurl/flags`(例:[kr.akirin.xyz/flags](https://kr.akirin.xyz/flags))から無効化できるようにする予定です。最終的には他の設定と同じ場所に配置されます。

### MFMの拡張

基本的に文法はm544と互換性があります。[チートシート](https://ti.akirin.xyz/mfm-cheat-sheet)(私のm544インスタンスに飛びます)
`:@aki:`や`:@rei_k@misskey.io:`でアバター絵文字が使えます。なお、一部の場所(こことか)だと動きませんが、普通にノートを投稿する分には問題なく使えます。

<style>
@keyframes mfm-rainbow {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}
</style>

Groundpolisからも一部取り入れさせて頂いている文法があります。
`[rainbow kr更新しようぜ]`
<p style="color: #99CC00; animation: mfm-rainbow 1s linear infinite both;">kr更新しようぜ</p>

`[font.size=20px,color=#86b300 みすきーぐりーん]`
<p style="font-size: 20px; color: #86b300">みすきーぐりーん</p>

ただ、Ayuskey同士だと正常に表示できていますが、他の実装からだとうまく表示されないことが多いです。(逆は回転速度とかの指定に`ms`を使わないようにすればだいたいいけそう)

### 独自機能

他のMisskeyには存在しない独自の機能としてbotであることを宣言するのと同じようにお嬢様(Lady)であることを宣言できます。しっかりと連合できるように作ってあります。

ブラーのところで書きましたが、実験的な機能を`/flags`で有効化できます。~~まあ、これ書いてる時点だとどれも今は機能しないんですけど~~

## 最後に

読んでいただきありがとうございます。
もしよろしければ[私のインスタンス](https://kr.akirin.xyz)に登録していただけると幸いです。

## おまけ

### 既知のバグ

トークの読み込みが終わらない=>~~原因調査中...~~[#61](https://github.com/TeamOrangeServer/misskey/issues/61) => [5.0.0-rc.10](https://github.com/TeamOrangeServer/misskey/releases/tag/11.37.1-rei0784-5.0.0-rc.10)で解決
モバイルで引用RNできない=>原因調査中...

### 夢は大きく 〜今後の目標〜

独自にVue3対応=>v12と根本的に作りが違うのでほとんどバックポートで対応できないので、少なくともinitはほとんど書き直しです。
それと、BootstrapVueの対応ができたら少しずつやってみたいと思います。

### XEの終了に伴う記事の移植

最初はXE(私の旧インスタンス)のpagesで書いていたのですが、諸事情でKrに移行することになったのでここのブログに移植することにしました。MFM周りは実際のAyuskeyのcssを引っ張ってMarkdownに書いて実現しているため、疲れました・・・
