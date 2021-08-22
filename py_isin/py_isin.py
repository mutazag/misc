#%%
import pandas as pd
d = {'weight': [70, 10, 65, 1], 'String1': ['Labrador is a dog',
'Abyssinian is a cat',
'German Shepard is a dog',
'pigeon is a bird']}
df = pd.DataFrame(data=d)
df

#%%
search_list = ['dog','cat']
search_list
# %%
#String1 isin search_list
df['String1'].isin(search_list)


# if String1 is in search_list set column2
# to 1, else set column2 to 0
df["animal"] = df["String1"].map(lambda s: next((animal for animal in search_list if animal in s), "other"))
# %%
df
# %%
[animal for animal in search_list if animal in 'Labrador is a dog']
# %%
