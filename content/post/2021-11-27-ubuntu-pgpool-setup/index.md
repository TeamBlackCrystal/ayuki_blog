---
title: Pgpool-IIを導入するだけ
categories:
- Ayuskey
author: 'あき'
tags:
- ja
- ubuntu
- Misskey
- PostgreSQL
- pgpool
excerpt: レプリケーション何もわからん
date: 2021-11-27
---

### はじめに

また、結構期間空いてしまいましたね・・・
3ヶ月ぶりです。

さて、今回はMisskeyをPgpool-IIに載せたいと思います。レプリケーションは別の機会にやります。

### 前提

- Ubuntu 20.4
- PostgreSQL 13 (pgdg)
- pgpool-II version 4.1.4

!!! info
    pgdgのリポジトリを事前に追加していることを想定しています。


### インストール

```bash
sudo apt install pgpool2
```

### 設定

ここからが本番ですよ〜~~めんどくさい~~

事前にpostgres本体のポートを変えておきましょう。(今回は`60001`にします。)

```diff
# /etc/postgresql/13/main/postgresql.conf
- port = 5432
+ port = 60001
```

`/etc/pgpool2/pgpool.conf`を編集していきます。

```diff
- port = 5433
+ port = 5432

# 一応変えてある
- backend_hostname0 = 'localhost'
+ backend_hostname0 = '192.168.1.90'

# 変更したpostgresのポートを書く
- backend_port0 = 5432
+ backend_port0 = 60001

# 今はデフォルトでok
backend_weight0 = 1

# 一応合わせてある
- backend_data_directory0 = '/var/lib/pgsql/data'
+ backend_data_directory0 = '/var/lib/postgresql/13/main'

# レプリケーション関係。今は触らないでok
backend_flag0 = 'ALLOW_TO_FAILOVER'

# 一台なら多分適当でいい。デフォルトのまま
backend_application_name0 = 'server0'

# パフォーマンス関係はお好みに
# pgpool ubuntu [検索]
```

!!! error
    misskey用に使う場合、TLが壊れるなどの不具合が出るため**絶対に**`memory_cache_enabled`をonにしないこと

以上で設定はおしまい。

### 最後に

あとはpostgresとpgpoolを再起動しておしまい

```bash
# 失敗する場合は再起動するといいらしい。
sudo systemctl restart postgresql
sudo systemctl restart pgpool2
```