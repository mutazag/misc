#%%
import json
import xml

#%%
xmlstr = '<?xml version="1.0" encoding="utf-8"?> <visitors> <visitor id="9615" age="68" sex="F" /> <visitor id="1882" age="34" sex="M" /> <visitor id="5987" age="23" sex="M" /> </visitors>'

#%%
def xmltoarray(xmlstr):
  from xml.etree import ElementTree as ET
  xmlroot = ET.fromstring(xmlstr)
  print(type(xmlroot))
  print(xmlroot)
  arr = []
  visitors = [list(e.attrib.values()) for e in xmlroot]
  return visitors

def xmlsize(xmlstr):
    from xml.etree import ElementTree as ET
    xmlroot = ET.fromstring(xmlstr)
    return len([e for e in xmlroot])
#%%
rr = xmltoarray(xmlstr)

print(rr)
# %%
print(xmlsize(xmlstr))
# %%
