---
title: 'hexoのpwa化pluginが動かなかくなった話'
categories:
- 一般
author: 'ゆぴ'
tags:
- ja
- ゆぴ
- hexo
- 不具合
excerpt: 'hexoのpwa化pluginが動かなかった話'
date: 2021-03-23
---

<!-- toc -->

# はじめに

まず初めに、このサイトはhexoというprojectを用いて作成されているのですが、そのhexoには[hexo-pwa](https://github.com/lavas-project/hexo-pwa)
という物があり、これを使うことで簡単にpwaに対応することができます、ですが大本が既に更新されていない状態になっており2020/12月頃には既に動作しなかった覚えがありますが、
私はそのforkである[hexo-pwa](https://github.com/marcofranssen/hexo-pwa) を使わせていただいていました。ですが少し前に[hexo v5.4.0](https://github.com/hexojs/hexo/releases/tag/5.4.0)
がリリースされました。これには依存関係の更新として`js-yaml`という物が含まれていました。そしてjs-yamlの更新でsafeloadがデフォルトで使用されるようになった
というのが今回の問題点です。そちらを理解しつつご覧ください。

## 直し方

はじめにでも言った通り、今回の不具合というかは`js-yaml`にはsafeloadという機能があり、hexo-pwaではそれを使用していました。READMEのconfigの書き方を引用してみましょう。
```yml
    routes:
      - pattern: !!js/regexp /hm.baidu.com/
        strategy: networkOnly
      - pattern: !!js/regexp /.*\.(js|css|jpg|jpeg|png|gif)$/
        strategy: cacheFirst
      - pattern: !!js/regexp /\//
        strategy: networkFirst
```
引用元: https://github.com/lavas-project/hexo-pwa

このように書かれているわけですが、引用したymlにもある`!!js/regexp`という部分がsafeloadを使うという明言です、そして最初にも言った通り、safeloadはjs-yamlの更新で
**デフォルトで使用するようになったわけです**つまり、これは既にjs-yamlでは存在しないtagになったわけです、そしてエラーでは存在しないtagだという事を示唆しています。
なので`!!js/regexp`を削除し、以下のようにすると正常に動作します。
```yml
    routes:
      - pattern: /hm.baidu.com/
        strategy: networkOnly
      - pattern: /.*\.(js|css|jpg|jpeg|png|gif)$/
        strategy: cacheFirst
      - pattern: /\//
        strategy: networkFirst
```
これらの点を変更し、依存関係を更新したforkを作成したので是非使ってみてください。 [hexo-pwa](https://github.com/yupix/hexo-pwa)


## 最後に

hexoはとても軽量で、便利な物ですが、plugin等の多くは更新されていない事が多いです。他にもwordpressの用に多機能なpluginは少なく、
自分で作成するなどしないと使えない機能等があります。なので好き嫌いが分かれそうですが、好きという方で助かったという方がいれば幸いです。