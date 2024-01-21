---
title: Ayuskey v6 Changelog
date: 2022-11-16
categories:
- dev
author: 'ゆぴ'
tags:
- Dev
- Ayuskey
comments: false
---

# はじめに

Ayuskeyって何？って方は{% post_link 2020-12-21-misskey-advent-calendar-2020-ayuskey こちら %}の記事を先にお読みください。

## 注意事項

6.0.0以下のバージョンから更新する際はマイグレーションが必要です。

### 機能の追加

- 引っ越し先をユーザーページに表示するように
- 投稿ページのURLで埋め込みプレイヤーを提供するように
- Bull Dashboard を組み込み、ジョブキューの確認や操作を行えるように
- welcome ページでcwが設定されている場合は 「もっと見る」ボタンを出すように [TeamBlackCrystal/misskey#1813](https://github.com/TeamBlackCrystal/misskey/issues/1813)
- blurをoffにする設定を追加しました
- toolsにアプリケーションを作るためのサンプルを追加 [#30](https://github.com/TeamBlackCrystal/ayuskey/issues/30)
- ハイライトがない際は無いと表示する [#120](https://github.com/TeamBlackCrystal/ayuskey/issues/120)
- パスワードリマインダー(パスワードリセット)

### 破壊的変更

- node 12, 14をドロップしました。16または18に移行してください

### 変更点

-  pnpmに変更
- リバーシのグラデーションを変更 [#71](https://github.com/TeamBlackCrystal/ayuskey/issues/71)
- メニューのアイコンの位置を統一 [#68](https://github.com/TeamBlackCrystal/ayuskey/issues/68)
- renoteした際のHeaderの位置を変える [#33](https://github.com/TeamBlackCrystal/ayuskey/issues/33)
- emojilist を更新
- クエリの最適化
- docker で node@18 を使用します
- 既存のファイルにsensitiveフラグが飛んできたときの挙動
- CORSを調整
- ビルド時の出力を調整

### 非推奨

- Elasticsearchやsonicを利用した検索
  -  これらを使用している場合は検索の修正は提供されていません

### 修正

デザインに関する修正が多いです

- channels/follow エンドポイントで既にfollowしてる物をfollowしようとするとdbのエラーが直接帰ってきてしまう [#362](https://github.com/TeamBlackCrystal/ayuskey/issues/362)
- メンション時にアバターの比率が異なるとアバターのデザインが崩れる [#164](https://github.com/TeamBlackCrystal/ayuskey/issues/164)
- メンション時アバターが取得できない [#163](https://github.com/TeamBlackCrystal/ayuskey/issues/163)
- モバイル時にRenoteするとボーダーがうまく表示されない [#31](https://github.com/TeamBlackCrystal/ayuskey/issues/31)
- アプリケーションの認証時、ログインしていないとテーマが白すぎる [TeamBlackCrystal/misskey#477](https://github.com/TeamBlackCrystal/misskey/issues/477)
- リモートユーザーでも可能であれば誕生日と場所を表示
- noteの検索が正常に動作しない

### セキュリティー

依存関係が更新されました。脆弱性が修正されている場合があります。

- [CVE-2022-29256](https://github.com/advisories/GHSA-gp95-ppv5-3jc5) (sharp)
- [CVE-2022-33987](https://github.com/advisories/GHSA-pfrx-2q88-qq97) (got)
- [CVE-2022-24434](https://github.com/advisories/GHSA-wm7h-9275-46v2) (multer)


## 目玉機能

Bull Dashboardが組み込まれたのでジョブキューをご自分の目で今まで以上に身近に感じることができます。

## 将来的な予定

APIに関してはジョブキュー周りで詰まっているのでv7で実装されるかは怪しいです。今後の更新にご期待ください！

- v2 APIの搭載(GETメソッド等が使用できる)
- VuexからPiniaへの置き換え
