import { createClient, type MicroCMSQueries } from "microcms-js-sdk";

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

if (!serviceDomain || serviceDomain === "your-service-id") {
    throw new Error("\n[ERROR] microCMSの初期化に失敗しました: .env ファイルの MICROCMS_SERVICE_DOMAIN が設定されていないか、デフォルト値のままです。実際のサービスドメインに書き換えてください。\n");
}

if (!apiKey || apiKey === "your-api-key") {
    throw new Error("\n[ERROR] microCMSの初期化に失敗しました: .env ファイルの MICROCMS_API_KEY が設定されていないか、デフォルト値のままです。実際のAPIキーに書き換えてください。\n");
}

export const microcmsClient = createClient({
    serviceDomain,
    apiKey,
});

export type Category = {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
    name: string;
};

export type Blog = {
    id: string;
    title: string;
    content: string;
    author?: string;
    category?: Category;
    eyecatch?: {
        url: string;
        height: number;
        width: number;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
};

export type BlogResponse = {
    totalCount: number;
    offset: number;
    limit: number;
    contents: Blog[];
};

export const getBlogs = async (queries?: MicroCMSQueries) => {
    return await microcmsClient.get<BlogResponse>({ endpoint: "blogs", queries });
};

export const getBlogDetail = async (
    contentId: string,
    queries?: MicroCMSQueries
) => {
    return await microcmsClient.getListDetail<Blog>({
        endpoint: "blogs",
        contentId,
        queries,
    });
};
