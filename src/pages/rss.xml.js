import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getBlogs } from '../lib/microcms';

export async function GET(context) {
	const response = await getBlogs({ limit: 100 });
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: response.contents.map((post) => ({
			title: post.title,
			pubDate: new Date(post.publishedAt),
			description: post.title, // or a snippet if available
			link: `/blog/${post.id}/`,
		})),
	});
}
