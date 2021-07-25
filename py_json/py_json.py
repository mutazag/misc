# %%
import json
from typing import NamedTuple

# open json file
with open('yoloobject.json', 'r') as f:
    jsonstring = f.read()
    f.seek(0,0)
    data = json.load(f)


print('Json String: ', jsonstring)

x1 = data['objects'][0]['points']['exterior'][0][0]
y1 = data['objects'][0]['points']['exterior'][0][1]
x2 = data['objects'][0]['points']['exterior'][1][0]
y2 = data['objects'][0]['points']['exterior'][1][1]

print(f'bounding box: ({x1},{y2}), ({x2},{y2})')

# %%
