#%%

import pandas as pd


# %%
df = pd.read_csv('agg2.csv', index_col=0)
df.d1 = pd.to_datetime(df.d1)
df.d2 = pd.to_datetime(df.d2)
df.merge_time = pd.to_datetime(df.merge_time)
# %%
s = (df["d1"] != (df["d2"].shift() + pd.Timedelta("1H"))).cumsum()

# %%
df2=(df.groupby(['latitude', 'longitude',s])
    .agg(
        ar=('ar', 'sum'),
        d1=('d1', 'min'),
        d2=('d2', 'max')
        )
    ).reset_index(level=-1, drop=True)
# %%
df['s'] = s
# %%
df = df.assign(**{c:pd.to_datetime(df[c]) for c in ["d1","d2","merge_time"]})

df.groupby(["latitude", "longitude"]).apply(
    lambda d: d.groupby(
        (d["d1"] != (d["d2"].shift() + pd.Timedelta("1H"))).cumsum(), as_index=False
    ).agg({"d1": "min", "d2": "max", "ar": "sum"})
).droplevel(2,0).reset_index()
# %%
10.1    12/1/1981 0:00  12/1/1981 3:00  2.293604127  1981-12-01 04:00:00
10.1    12/1/1981 4:00  12/1/1981 22:00  2.168275766  1981-12-01 23:00:00
10.1    12/2/1981 8:00  12/2/1981 11:00  2.293604127  1981-12-01 12:00:00