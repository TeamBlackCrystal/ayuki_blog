# あゆき's BLOG

@yupix と @sousuke0422 による共同ブログです。
このブログは Hugo を使用しています。 テーマは [hugo-theme-stack](https://github.com/CaiJimmy/hugo-theme-stack) を一部変更した上で使用しています。 
実際に使用している[テンプレート](https://github.com/TeamBlackCrystal/hugo-theme-stack)

## 動かし方・ビルド

Hugoのインストール(scoop を使うことを想定しています)

```bash
# Windows
scoop install hugo-extended
```

ローカル用のサーバーを起動する

```bash
hugo server
```

お試しビルドの方法

```bash
hugo
```

実行後に生成された `public` ディレクトリがビルド成果

## 記事の追加方法

> [!NOTE]
> 記事の名前には英数記号のみがサポートされています。日本語はどうなるか分かりません。

```bash
python helper.py new <post name>
```

記事内の `draft = true` を `false` に変更すると表示されるようになります

## 構文

### noticeに関する構文

```
{{< notice error >}}
This is a warning notice. Be warned!
{{< /notice >}}


{{< notice info >}}
This is a warning notice. Be warned!
{{< /notice >}}

{{< notice tip >}}
This is a warning notice. Be warned!
{{< /notice >}}

{{< notice note >}}
This is a warning notice. Be warned!
{{< /notice >}}


{{< notice warning >}}
This is a warning notice. Be warned!
{{< /notice >}}
```

### ブログカード

ogp等の取得は独自の専用urlを使用しています。
許可なく本ブログ以外で使用されていることが確認された場合はブロック等を行います。

```
{{% blogcard "https://nr.akarinext.org/@yupix" %}}
```

![blogcard example](<_docs/blogcard.png>)
