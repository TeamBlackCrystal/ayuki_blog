import type { ImageMetadata } from 'astro';
import akiIcon from '../assets/authors/aki.webp';
import yupixIcon from '../assets/authors/yupix.webp';

export type AuthorId = 'aki' | 'yupix';

export interface Author {
    id: AuthorId;
    name: string;
    icon: ImageMetadata;
}

export const AUTHORS: Record<string, Author> = {
    aki: {
        id: 'aki',
        name: 'aki',
        icon: akiIcon,
    },
    yupix: {
        id: 'yupix',
        name: 'yupix',
        icon: yupixIcon,
    },
} as const;
