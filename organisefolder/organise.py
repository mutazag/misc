#!python


# import sys
from glob import glob
from os import path
import argparse
import pandas as pd


def main(args):
    print(f'process {args.path}')

    if path.isdir(args.path):
        print(f'{args.path} is a directory')
        files = glob(path.join(args.path, '*'))
        print(f'{len(files)} files found')
    else:
        files = glob(args.path)
        print(f'{len(files)} files found')

    df = pd.DataFrame(files, columns=['file'])
    df['path'] = df['file'].apply(lambda x: path.dirname(x))
    df['name'] = df['file'].apply(lambda x: path.basename(x))
    df['ext'] = df['file'].apply(lambda x: path.splitext(x)[1])
    df['size'] = df['file'].apply(lambda x: path.getsize(x))

    print(df)
    print(df.describe())

    print(len(df))
    pass


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Organise a folder')
    parser.add_argument('path', help='path to folder')
    args = parser.parse_args()
    print(args)
    main(args)
