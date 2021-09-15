#%%
import pandas as pd
from pandas.core.groupby import grouper
# %%
df = pd.read_csv('df2.csv', index_col=0)
# %%
df
# %%
df2 = df.pivot_table(
    values='NotionalTraded',
    columns=['Side'],
    index=['iVWAPBucket','Side']
    ).reset_index().drop(columns=['Side'])

df2.columns.rename(None, inplace=True)

# %%


# %%
print(df2)
# %%
