#%% 

import pandas as pd

#%%

df1 = pd.read_csv('df1.csv', index_col=0)
# %%
df2 = pd.read_csv('df2.csv', index_col=0)
# %%
df3 = pd.read_csv('df3.csv', index_col=0)
# %%
df1.merge(df2, on='proj_id').merge(df3, on='doc_id')
# %%
df1.merge(df2, on='proj_id', how='left').merge(df3, on='doc_id', how='left')
# %%
