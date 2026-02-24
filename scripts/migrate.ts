import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { config } from 'dotenv';

// .envファイルを読み込む
config();

const MICROCMS_SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const MICROCMS_API_KEY = process.env.MICROCMS_API_KEY;

if (
    !MICROCMS_SERVICE_DOMAIN ||
    MICROCMS_SERVICE_DOMAIN === 'your-service-id' ||
    !MICROCMS_API_KEY ||
    MICROCMS_API_KEY === 'your-api-key'
) {
    console.error("❌ エラー: .env ファイルの MICROCMS_SERVICE_DOMAIN および MICROCMS_API_KEY を正しく設定してください。");
    process.exit(1);
}

const API_URL = `https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/blogs`;
const POSTS_DIR = path.join(process.cwd(), '.hugo_backup', 'content', 'post');

async function deleteAllPosts() {
    console.log("🗑️  既存の記事を削除しています...");
    try {
        let hasMore = true;
        while (hasMore) {
            const res = await fetch(`${API_URL}?limit=100`, {
                headers: {
                    'X-MICROCMS-API-KEY': MICROCMS_API_KEY as string,
                } as HeadersInit
            });
            if (!res.ok) {
                console.error("❌ 既存記事の取得に失敗しました:", res.status, res.statusText);
                break;
            }
            const data = await res.json();
            if (data.contents.length === 0) {
                hasMore = false;
                break;
            }

            for (const post of data.contents) {
                console.log(`🗑️ 削除中: ${post.title} (${post.id})`);
                const delRes = await fetch(`${API_URL}/${post.id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-MICROCMS-API-KEY': MICROCMS_API_KEY as string,
                    } as HeadersInit
                });
                if (!delRes.ok) {
                    console.error(`❌ 削除エラー (${post.id}):`, delRes.status, await delRes.text());
                }
            }
        }
        console.log("✅ 既存記事の削除が完了しました！");
    } catch (e: any) {
        console.error("🚨 削除中に予期せぬエラーが発生しました:", e.message);
    }
}

async function migrate() {
    console.log("🚀 マイグレーションスクリプトを開始します...");

    // await deleteAllPosts();

    if (!fs.existsSync(POSTS_DIR)) {
        console.error(`❌ エラー: ${POSTS_DIR} が見つかりませんでした。`);
        process.exit(1);
    }

    const folders = fs.readdirSync(POSTS_DIR);

    for (const folder of folders) {
        const folderPath = path.join(POSTS_DIR, folder);
        const postPath = path.join(folderPath, 'index.md');

        const stat = fs.statSync(folderPath);
        if (!stat.isDirectory()) {
            continue;
        }

        if (!fs.existsSync(postPath)) {
            console.warn(`⚠️ スキップ: ${folder} の中に index.md が存在しません。`);
            continue;
        }

        const fileContent = fs.readFileSync(postPath, 'utf8');
        const { data: frontmatter, content } = matter(fileContent);
        const htmlContent = marked.parse(content);

        console.log(htmlContent);
        if (frontmatter.title !== 'Kubernetesを生やす (containerd)') {
            continue
        }
        // APIへ送るデータ
        const payload: any = {
            title: String(frontmatter.title || 'No Title'),
            content: htmlContent,
        };

        // frontmatterにauthorがあれば追加する。
        // ※MicroCMS側で「複数選択」にしている場合は配列にする必要があります。
        // Schema設定に合わせて型エラーになる場合は、以下のコメントアウトを調整してください。
        console.log(frontmatter.author, typeof frontmatter.author);
        if (frontmatter.author) {
            // payload.author = String(frontmatter.author); // テキストフィールド、または単一選択の場合
            payload.author = [String(frontmatter.author)]; // もし「複数選択」にしているならこっちのコメントを外す
        } else {
            payload.author = 'aki'; // デフォルト値
        }

        if (frontmatter.date) {
            try {
                payload.publishedAt = new Date(frontmatter.date).toISOString();
            } catch (e) {
                console.warn(`🕒 警告: 日付のパースに失敗しました (${frontmatter.date})`);
            }
        }
        console.log(`📤 移行中: ${payload.title}`);

        try {
            // contentConfig などのID制約: 小文字大文字英数字ハイフンアンダースコア。
            // 末尾のハイフンや50文字超の制限に合わせて切り取る。
            let contentId = folder.toLowerCase().replace(/[^a-z0-9_\-]/g, '').slice(0, 40).replace(/[-_]+$/, '');
            if (contentId.length < 3) {
                // 最低3文字以上にするためにデフォルトをつける
                contentId = 'migrated-post-' + Math.floor(Math.random() * 10000);
            }

            // IDを指定して作成・更新する場合はPUTを使用する
            const res = await fetch(`${API_URL}/${contentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-MICROCMS-API-KEY': MICROCMS_API_KEY as string,
                } as HeadersInit,
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`❌ エラー (${payload.title}): ${res.status} ${res.statusText}`, errorText);
            } else {
                console.log(`✅ 成功: ${payload.title}`);
            }
        } catch (e: any) {
            console.error(`🚨 例外エラー (${payload.title}):`, e.message);
        }
    }

    console.log("🎉 すべてのマイグレーション処理が完了しました！");
}

migrate();
