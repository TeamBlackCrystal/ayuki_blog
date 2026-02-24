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
