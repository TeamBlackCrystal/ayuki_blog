---
title: Remixの流儀
date: 2022-07-19
categories:
- dev
author: 'ゆぴ'
tags:
- Dev
- Remix
- React
- React18
- remix-run
- SSR
- Server-side render
- TypeScript
comments: true
---

# 概要

この記事では結構新しめなReactベースのフレームワークであるRemixについてご紹介します。

## 初めに

Remixってなんだよ！って人のために少しだけご紹介します。Remixはサーバーサイドレンダリング（SSR）の最近よく聞くSPAとは少し違ったアプローチをとっているフレームワークです。
Remixの特徴は以下のような点にあります。
コンポーネントでエラーが出ても、そのコンポーネントのみがエラーを出すこれにより、一部のコンポーネントがエラーを出してもページ全体がエラーで汚染されることが無くなり、原因が分かりやすくなっています。
SSRなのでOGPなどが容易に設定できます。これに関しては後述しますが、取得したデータをもとにOGPを設定できて非常に便利です。
他にも多くの機能がありますが、ここから先はあなたご自身の手でお試しください！では記事をどうぞ！

## データの取得

Remixには LoaderFunction という物があります。例として以下のように書くことができます。今回は例としてPrismaを用いたデータの取得を行ってみます。

```tsx
export const loader: LoaderFunction = async({params}) => {
	return await prisma.user.findFirst({where: {id: params.userId}}
}

export default function ShowUser() {
	const user = useLoaderData();
    return <div>Hello {user.name}!</div>
}
```

この方法の素晴らしい点は`loader`という名前の関数をexportしておくことで自動で実行できる点です。ただ、loaderは定義した場合必ず何か値を返す必要があります。返さないと`loader`が定義されていますが、何も返されませんでしたみたいなエラーが出ると思います。

## データの取得（上級）

さて、先ほどのコードを書いていてTypeScriptを使っている皆さんはきっとこう思ったことでしょう。「これ、Prismaのincludeとか使ってリレーション入れた場合の型どうすればいいんだ?」とその回答はRemixの公式ドキュメントの[このセクション](https://remix.run/docs/en/v1/guides/data-loading#databases)にあります。ですが、一応見つけるのに苦労する方もいると思うのでここで紹介しておきます。コードはRemixのドキュメントからお借りしました。

```tsx
import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react";

import { db } from "~/db.server";

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;

async function getLoaderData(productId: string) {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
      imgSrc: true,
    },
  });

  return product;
}

export const loader: LoaderFunction = async ({
  params,
}) => {
  return json<LoaderData>(
    await getLoaderData(params.productId)
  );
};

export default function Product() {
  const product = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Product {product.id}</p>
      {/* ... */}
    </div>
  );
}
```

先ほどのデータの取得と何が違うのかというと`getLoaderData`という関数を作成し、`LoaderData`という定数に`getLoaderData`の戻り値を型として取得し、`useLoaderData`の型は`LoaderData`だよ！と伝えています。いたって普通のことかもしれないですが、TypeScriptに慣れてないと案外出てこない考えでした。

## データの送信

データの送信はデータの取得と似た名前の関数 `actionFunction` と `useFetcher` を使用します。

```tsx
export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const intent = formData.get("intent");
    const name = formData.get("name");
    if (intent === "createUser") {
        return json(await createUser(name));
    }
};

export default function CreateUser() {
	const fetcher = useFetcher();
    
    useEffect(() => { // データに変更が生じた際に発火する
    	console.log(fetcher.data)
    }, [fetcher.data])
    
    const submitUserData = () => {
    	fetcher.submit({intent: "createUser", name: "exampleUser"}, {method: "post"})
    }

	return <button onClick={() => submitUserData()}/>
}
```

このコードではintentにどういうアクションを起こさせるかを渡しています。これは何故かというとactionはルーターごとに一つであり、Remixの公式Discordなどを見ていてもこの書き方が主流だと思っているからです。（他にいい方法あったら教えてください）また、 `fetcher.data` はちゃんとuseEffectなどを用いて待機してあげる必要があります。いきなり使おうとするとundefinedになったりnullになったりするかもしれません（普通はそうなると思います）

## コンポーネントからデータの取得がしたい

正直私は気にしないのですが、デザインパターン的によくない場合もあるのかな?まあよくわかりませんが、ひとまずご紹介します。
まず、前提として、コンポーネントにはloaderやactionは用意できない（すべきじゃない）です。これを解決する方法として先ほどのデータの送信を応用します。まず、ページにactionを作成しておき、そこにfetcherを用いてデータを送信します。
私が実際に必要となった際の条件とどんなことをしたかを記載しておきます。
- データのIDがコンポーネントに来る
- データのIDからアイテムのデータを取得してコンポーネントとして表示したい

### routes/index.tsx

```tsx
export const action: ActionFunction = async({request}) => {
    const formData = await request.formData();
    const intent = formData.get('intent')
    const id = Number(formData.get('id'))
    if (intent === "getItemById") {
        return json(await getItemById(id))
    }
}
```

### components/item.tsx

```tsx
export const Item = () => {
	const [item, setItem] = useState(null)
	const fetcher = useFetcher()
    useEffect(() => {
        fetcher.submit({intent: "getItemById", id: 1234567890}, {method: "post", action: "/?index"})
    }, [])
    
    useEffect(() => {
    	setItem(fetcher.data)
    }, [fetcher.data])

	return <>{item.name}</>
}
```

あくまでこのコードは例です。私がこういうコードを書く必要があったのはSupaBaseを用いてリアルタイム通信を行っていましたがリレーションは取得できない為（少なくとも私にはやり方がわからなかった）、prismaのリレーションを取得する必要があったためです。

あとindexとかに集中させるのは良くないと思うので適度分けるといいと思います。なんならapi/item.tsx みたいにしたほうがいいのかも? そこらへんは人によると思います。APIみたいにデータを触ることしかしないならそういうのでもいいのかなと個人的には思います。

## OGPの設定

OGP...設定したいですよね?個人的にはアイテムの詳細ページとかを作るならぜひとも欲しいと思います。SPAだとちょっとめんどくさくてやる気になりませんでしたが、そう、Remixなら簡単です。

OGPの設定には `MetaFunction` を使用します

```tsx
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;


export const meta: MetaFunction = ({ data }) => {
    let _data: LoaderData = data
    return {
        charset: "utf-8",
        title: _data?.data.name,
        "og:title": _data?.data.name,
        "og:site_name": "テスト",
        "og:image": _data?.data.icon_url,
    };
};

async function getLoaderData() {
	return {name: "ゆぴ", image: "リンク"}
}

export const loader: LoaderFunction = async () => {
    return json(await getLoaderData());
};
```

こんな感じにloaderで取得したデータをmetaで使用することができます。loaderでparamsを取得してパラメータのIDを用いてデータベースからアイテム情報を取得、OGPに表示みたいなことが簡単にできます。

## 最後に

正直fetcherに関しては2日ぐらい苦しんでいろいろとGitHubの数少ないリポジトリを探して、使い方が分かりました。fetcher.dataが空にしかならなくて、割とマジで苦しんだ覚えがあります...記事とかでもfetcher使ってる人全くいなくて、大変でした。そういう方のお役に立てれば幸いです。最後にコードに関しては確認せず書いてるので少し間違ってたり、普通に動かないやつあるかもしれないので、見つけたら[ここ](https://github.com/TeamPimcServer/ayuki_blog/issues)とかに連絡ください。