import * as cheerio from "cheerio";
import { createHighlighter } from "shiki";

// Create highlighter instance once
const highlighter = await createHighlighter({
    themes: ["tokyo-night"],
    langs: [
        "javascript",
        "typescript",
        "bash",
        "json",
        "yaml",
        "css",
        "html",
        "astro",
        "tsx",
        "jsx",
        "python",
        "go",
        "rust",
        "c",
        "cpp",
    ],
});

const ICONS: Record<string, string> = {
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notice-icon"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    note: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notice-icon"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    tip: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notice-icon"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notice-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notice-icon"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
};

export const processHtml = async (html: string) => {
    // 1. Pre-process Hugo-style shortcodes before loading into Cheerio
    // e.g. {{< notice info >}} or {{&lt; notice info &gt;}}
    let processedRawHtml = html;

    // Process :::info ... ::: (Docusaurus style)
    processedRawHtml = processedRawHtml.replace(
        /(?:<p>)?\s*:::(info|note|tip|warning|error)\s*(?:<\/p>)?([\s\S]*?)(?:<p>)?\s*:::\s*(?:<\/p>)?/gi,
        (match, type, content) => `<div class="notice notice-${type.toLowerCase()}"><div class="notice-icon-wrapper">${ICONS[type.toLowerCase()]}</div><div class="notice-content">${content}</div></div>`
    );

    // Process {{< notice info >}} ... {{< /notice >}} (Hugo style)
    processedRawHtml = processedRawHtml.replace(
        /(?:<p>)?\s*(?:\{\{&lt;|\{\{<)\s*notice\s+(info|note|tip|warning|error)\s*(?:&gt;\}\}|>\}\})\s*(?:<\/p>)?/gi,
        (match, type) => `<div class="notice notice-${type.toLowerCase()}"><div class="notice-icon-wrapper">${ICONS[type.toLowerCase()]}</div><div class="notice-content">`
    );
    processedRawHtml = processedRawHtml.replace(
        /(?:<p>)?\s*(?:\{\{&lt;|\{\{<)\s*\/notice\s*(?:&gt;\}\}|>\}\})\s*(?:<\/p>)?/gi,
        '</div></div>'
    );

    const $ = cheerio.load(processedRawHtml);

    // Process blockquotes looking for [!info] (GitHub style)
    $("blockquote").each((_, element) => {
        const $element = $(element);
        const text = $element.text().trim();
        const match = text.match(/^\[!(info|note|tip|warning|error)\]/i);

        if (match) {
            const type = match[1].toLowerCase();
            const icon = ICONS[type];
            $element.replaceWith(`<div class="notice notice-${type}"><div class="notice-icon-wrapper">${icon}</div><div class="notice-content">${$element.html()?.replace(/^.*?\[!(info|note|tip|warning|error)\](<br\/>|<br>|\n)?/i, '') || ''}</div></div>`);
        }
    });

    const promises: Promise<void>[] = [];

    async function fetchOGP(url: string) {
        try {
            const urlObj = new URL(url);
            const res = await fetch(url, { headers: { "User-Agent": "bot" }, signal: AbortSignal.timeout(5000) });
            if (!res.ok) return null;
            const html = await res.text();
            const _$ = cheerio.load(html);
            const title = _$('meta[property="og:title"]').attr('content') || _$('title').text() || url;
            const description = _$('meta[property="og:description"]').attr('content') || _$('meta[name="description"]').attr('content') || '';
            let image = _$('meta[property="og:image"]').attr('content') || '';

            if (image && !image.startsWith('http')) {
                image = new URL(image, urlObj.origin).toString();
            }

            const siteName = _$('meta[property="og:site_name"]').attr('content') || urlObj.hostname;
            const favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;

            return { title, description, image, siteName, url, favicon };
        } catch (e) {
            console.error("Failed to fetch OGP for", url, e);
            return null;
        }
    }

    $("a").each((_, a) => {
        const $a = $(a);
        const href = $a.attr("href");
        let text = $a.text().trim();

        // Remove trailing slashes for comparison logic, as sometimes URLs displayed in text drop them
        const normalize = (u: string) => u.replace(/\/$/, "");

        if (href && (normalize(href) === normalize(text) || text.startsWith("http"))) {
            promises.push((async () => {
                const ogp = await fetchOGP(href);
                if (ogp) {
                    const cardHtml = `
                        <a href="${ogp.url}" target="_blank" rel="noopener noreferrer" class="not-prose flex border border-border rounded-xl overflow-hidden bg-bg-primary hover:bg-bg-tertiary transition-colors !no-underline group h-[120px] max-h-[120px] my-6 shadow-sm hover:shadow-md">
                            <span class="flex-1 p-3 md:p-4 flex flex-col justify-between overflow-hidden">
                                <span class="block">
                                    <span class="font-bold text-text-primary text-sm md:text-base line-clamp-1 mb-1 tracking-tight block">${ogp.title}</span>
                                    <span class="text-xs md:text-sm text-text-secondary line-clamp-2 leading-relaxed block">${ogp.description}</span>
                                </span>
                                <span class="flex items-center gap-2 mt-2">
                                    <img src="${ogp.favicon}" alt="" class="w-4 h-4 rounded-sm shadow-none !m-0 inline-block" />
                                    <span class="text-xs font-medium text-text-tertiary truncate leading-none">${ogp.siteName}</span>
                                </span>
                            </span>
                            ${ogp.image ? `
                            <span class="w-[120px] md:w-[240px] h-full shrink-0 border-l border-border relative block">
                                <img src="${ogp.image}" alt="" class="w-full h-full object-cover !m-0 !rounded-none absolute inset-0 block" />
                            </span>
                            ` : ''}
                        </a>
                        `;
                    $a.replaceWith(cardHtml);
                }
            })());
        }
    });

    $("pre code").each((_, element) => {
        const $element = $(element);
        const className = $element.attr("class") || "";
        const match = className.match(/language-(\w+)/);
        const lang = match ? match[1] : "text";
        const code = $element.text();

        promises.push(
            (async () => {
                try {
                    const isLangLoaded = highlighter
                        .getLoadedLanguages()
                        .includes(lang as any);
                    let finalLang = lang;

                    if (!isLangLoaded && lang !== "text") {
                        try {
                            await highlighter.loadLanguage(lang as any);
                        } catch {
                            finalLang = "text";
                        }
                    }

                    const highlightedHtml = highlighter.codeToHtml(code, {
                        lang: finalLang,
                        theme: "tokyo-night",
                    });

                    $element.parent().replaceWith(highlightedHtml);
                } catch (error) {
                    console.error(
                        `Error highlighting code with language ${lang}:`,
                        error
                    );
                }
            })()
        );
    });

    await Promise.all(promises);

    // cheerio.load wraps content in <html><head><body>... this extracts just the body content
    const bodyHtml = $("body").html();
    return bodyHtml || $.html();
};
