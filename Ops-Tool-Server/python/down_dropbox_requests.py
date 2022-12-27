import requests
import re
from urllib.parse import urlparse
import os
import sys
print(sys.argv[1])
print(sys.argv[2])
output_filepath = sys.argv[1]
dl_url = re.sub(r"\?dl\=\b([0-9]|[1-9][0-9]|100)\b", "?dl=1", sys.argv[2])
r = requests.get(dl_url, allow_redirects=True)
parsed = urlparse(dl_url)
filename = os.path.basename(parsed.path)
print(os.path.splitext(filename)[1])
extension = os.path.splitext(filename)[1]
id = os.path.split(os.path.dirname(parsed.path))[1]
with open(output_filepath  +str(id)+ extension, 'wb') as f:
    f.write(r.content)
print ('file has been written')