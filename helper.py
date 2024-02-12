#!/usr/bin/env python3

from datetime import datetime
import os
import shutil
import subprocess
import sys

def create_new_post(post_name: str):
    date = datetime.now().strftime('%Y-%m-%d')
    dir_name = f'{date}-{post_name}'
    try:
        os.mkdir(f'content/post/{dir_name}')
    except FileExistsError:
        print('An article with the same title already exists.')
        exit(1)
    proc = subprocess.Popen(['hugo', 'new', f'post/{post_name}.md'])
    proc.wait()
    shutil.move(f'content/post/{post_name}.md', f'content/post/{dir_name}/index.md')

def main():
    match sys.argv[1]:
        case 'new':
            try:
                post_name = sys.argv[2:]
                create_new_post('-'.join(post_name))

            except IndexError:
                print('Please provide a post name')
        case _:
            print('- new <post name> - create a new post')


if __name__ == '__main__':
    main()
