# %%
from urllib.parse import urlparse
surl = "https://www.exam.org/index.html"
urlparsed = urlparse(surl)
# network location from parsed url
print(urlparsed.netloc)
# ParseResult Object
print(urlparsed)
# %%

# %%
r1 = urlsplit(surl)
r1.geturl()
# %%
urlsplit(r1.geturl())
# %%

import tldextract
# %%
from  tldextract import extract

ext = extract(surl)
print(ext.registered_domain)

# %%
