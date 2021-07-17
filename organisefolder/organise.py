#!python

# %%

# import sys
from glob import glob
from os import path
import argparse
import os
import pandas as pd
from datetime import datetime
import shutil
import sys

# %%
import logging
logging.basicConfig(level=logging.DEBUG)


# %%
def main(args):
    print(f'process {args.path}')

    if path.isdir(args.path):
        print(f'{args.path} is a directory')
        files = glob(path.join(args.path, '*'))
        root_folder = args.path
        print(f'{len(files)} files found')
    else:
        files = glob(args.path)
        root_folder = path.dirname(args.path)
        print(f'{len(files)} files found')

    if args.destination is not None:
        root_folder = args.destination


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
    df['day'] = df.date.dt.day
    df['isdir'] = df.file.apply(lambda x: path.isdir(x))

    df = df.query('isdir != True')

    # df['destination_folder'] = df.year.map(str) + '/' + df.month.map(str) + '/' + df.day.map(str)
    # df['dest_folder'] = df[date_cols].apply(lambda x: f'{x.year:04}/{x.month:02}/{x.day:02}', axis=1)

    df_folders_dates = df.groupby(date_cols).file \
        .count().reset_index() \
        .rename(columns={'file': 'count'})
    df_folders_dates['subfolder'] = df_folders_dates[date_cols] \
        .apply(lambda x: f'{x.year:04}/{x.month:02}/{x.day:02}', axis=1)
    df_folders_dates['ensureFolder'] = df_folders_dates.subfolder \
        .apply(lambda x: ensureFolder(root_folder, x))
    print(df_folders_dates)

    df_folders_dates \
        .query('ensureFolder !="failed"') \
        .merge(df, on=date_cols) \
        .apply(lambda x: moveFile(x.file, root_folder, x.subfolder), axis=1).iloc[0]
    pass


# %%

def ensureFolder(root_folder, subfolder):
    folder = path.join(root_folder, subfolder)
    if not path.exists(folder):
        print(f'create folder {folder}')
        try:
            os.makedirs(folder)
        except OSError as e:
            logging.exception(f'error creating folder {folder}: {e}')
            return 'failed'
        return 'created'
    else:
        print(f'{folder} exists')
        return 'exists'

    return 'failed'


def moveFile(file, root_folder, subfolder):
    try:
        shutil.move(file, path.join(root_folder, subfolder))
    except OSError as e:
        logging.exception(f'error moving file {file}: {e.args[0]}')
        return 'failed'

    return f'move {file} to {root_folder}/{subfolder}'


def jupyterArgs(path=None):
    if path is None:
        args = {'path': 'C:/Users/mutaz/OneDrive/Pictures/Samsung Gallery/DCIM/Camera'}
    else:
        args = {'path': path}

    return DictObj(args)


# %%

class DictObj:
    def __init__(self, in_dict: dict):
        assert isinstance(in_dict, dict)
        for key, val in in_dict.items():
            if isinstance(val, (list, tuple)):
                setattr(self, key, [DictObj(x) if isinstance(x, dict) else x for x in val])
            else:
                setattr(self, key, DictObj(val) if isinstance(val, dict) else val)

# %%


if __name__ == '__main__':
    print(sys.argv)
    parser = argparse.ArgumentParser(description='Organise a folder')
    parser.add_argument('path', help='path to folder')
    parser.add_argument(
        '-d', '--destination',
        help='destination folder, leave empty if files are organised in place.')
    args = parser.parse_args()
    print(args)
    main(args)
