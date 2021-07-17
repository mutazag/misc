#!python


# import sys
from glob import glob
from os import path
import argparse
import pandas as pd
from datetime import datetime



def main(args):
    print(f'process {args.path}')

    if path.isdir(args.path):
        print(f'{args.path} is a directory')
        files = glob(path.join(args.path, '*'))
        print(f'{len(files)} files found')
    else:
        files = glob(args.path)
        print(f'{len(files)} files found')


    date_cols = ['year', 'month', 'day']

    # create a dataframe from the files
    df = pd.DataFrame(files, columns=['file'])
    df['path'] = df['file'].apply(lambda x: path.dirname(x))
    df['name'] = df['file'].apply(lambda x: path.basename(x))
    df['ext'] = df['file'].apply(lambda x: path.splitext(x)[1])
    df['size'] = df['file'].apply(lambda x: path.getsize(x))
    df['date'] = df['file'].apply(lambda x: datetime.utcfromtimestamp(path.getmtime(x)))
    df['year'] = df.date.dt.year
    df['month'] = df.date.dt.month
    df['day'] =  df.date.dt.day

    df['destnation_folder'] = df.year.map(str) + '/' + df.month.map(str) + '/' + df.day.map(str)
    df['dest_folder'] = df[date_cols].apply(lambda x: f'/{x.year:04}/{x.month:02}/{x.day:02}/', axis=1)



    df_folders_dates = df.groupby(date_cols).file.count().reset_index().rename(columns={'file':'count'})
    # print(df_folders_dates.head())

    print('groupby')
    for fldr, groupdf in df.groupby(['dest_folder']):
        print(f'group:  {fldr}')
        print(','.join(groupdf.name.to_list()))


    # print(df.head())
    # print(df.describe())

    print(len(df))
    pass


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Organise a folder')
    parser.add_argument('path', help='path to folder')
    args = parser.parse_args()
    print(args)
    main(args)
