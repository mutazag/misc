#%%
import pandas as pd

df = pd.read_csv('df1.csv')
# %%
df.melt(id_vars=['Index']).value.notna()
# %%
df.melt(id_vars=['Index']).value.dropna()

# %%
