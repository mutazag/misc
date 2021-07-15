#%%
import pandas as pd


#%%
dict1 = { 'a': 1, 'b': 2, 'c': 3}
df1 = pd.DataFrame(dict1.items(), columns=['name', 'value'])

print(df1)
# %%
dict2 = { 'name': ['a', 'b', 'c'], 'value': [1 ,2 ,3]}
df2 = pd.DataFrame(dict2)

print(df2)
# %%
df = pd.DataFrame([[1,2,3,4],
                 [5,6,7,8],
                 [9,10,11,12]],
                 columns= ['a','b','c','d'])

print(df)
d = df.T.stack().to_dict()
print(d)
{('a', 0): 1,
 ('a', 1): 5,
 ('a', 2): 9,
 ('b', 0): 2,
 ('b', 1): 6,
 ('b', 2): 10,
 ('c', 0): 3,
 ('c', 1): 7,
 ('c', 2): 11,
 ('d', 0): 4,
 ('d', 1): 8,
 ('d', 2): 12}
# %%
