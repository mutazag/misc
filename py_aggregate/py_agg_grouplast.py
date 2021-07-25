#%%
import pandas as pd

df = pd.read_csv('agglast.csv')

df
# %%
df.groupby(['Season','Game']).apply(lambda x: x.tail(1))
#%%
print(df.groupby(['Season','Game']).tail(1))
# %%



Season  Game  Event_Num  Home  Away  Margin
4  2016-17     1          5     0     2       2
9  2017-18     5         57    17    10       7