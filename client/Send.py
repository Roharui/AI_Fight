
from requests import post
import json

base_url = "http://localhost:5555/action"

x = post(base_url, data={"id":0, "action":0}).content

print(x)