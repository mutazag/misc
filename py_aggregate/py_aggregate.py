#%%
import pandas as pd

#%%
month = pd.Series(['June', 'June', 'June', 'June'])
day = pd.Series(['1', '1', '1', '1'])
hour = pd.Series(['1', '2', '3', '4'])
cat1 = pd.Series(['M', 'M', 'M', 'F'])
cat2 = pd.Series(['F', 'F', 'M', 'M'])

#%%
dict1 = {'month': month, 'day': day, 'hour': hour, 'cat1': cat1, 'cat2': cat2}
df = pd.DataFrame(dict1)
#%% misses the mark
df.groupby(['month', 'day']).apply(pd.value_counts)
# %%
df2 = pd.DataFrame(df.groupby(['month','day','cat1','cat2','hour']).agg('count').to_records())
# %%
pd.get_dummies(data=df, columns=['cat1', 'cat2']).groupby(['month', 'day']).agg('sum').reset_index()

# %%
