
from requests import post
import json

from random import randint
from time import sleep

from config import *

from tensorflow.keras.utils import to_categorical
import numpy as np

base_url = "http://localhost:5555/"

def state_with_loc(h):
    state, loc = (h['state'], h['loc'])
    bs = int(MODEL_INPUT / 2)
    (x, y) = (loc['x'] + bs, loc['y'] + bs)
    s = np.ones((ENV_SIZE + bs * 2, 
                 ENV_SIZE + bs * 2)) * 5
    s[bs:ENV_SIZE + bs, bs:ENV_SIZE + bs] = state
    return to_categorical(s[y-bs:y+bs+1, x-bs:x+bs+1], 
                num_classes=STATE_ELE)

class Sender :
    def join(self):
        data = post(base_url + "join").content

        j = json.loads(data)

        
        return state_with_loc(j)

    def action(self, xid, x):
        data = post(base_url + "action", data={"id":xid, "action":x}).content

        j = json.loads(data)

        return state_with_loc(j)

    def getScore(self):
        data = post(base_url + "score").content

        return json.loads(data)['score']

    def clear(self):
        post(base_url + "clear")

    def init(self, user):
        self.clear()
        for _ in range(user - 1):
            self.join()
        j = self.join()

        return j

if __name__ == "__main__":
    x = Sender()
    x.join()
    print(x.action(0, 1))