
import numpy as np

from collections import deque

from random import randint

from config import *

def state_with_loc(state, loc):
    bs = int(MODEL_INPUT / 2)
    (x, y) = (loc['x'] + bs, loc['y'] + bs)
    s = np.ones((ENV_SIZE + bs * 2, 
                 ENV_SIZE + bs * 2)) * 5
    s[bs:ENV_SIZE + bs, bs:ENV_SIZE + bs] = state
    return s[y-bs:y+bs+1, x-bs:x+bs+1]

class UserMemory:
    def __init__(self, maxlen):
        self.memory = deque(maxlen=maxlen+1)
        self.actions = deque(maxlen=maxlen)
        self.rewards = deque(maxlen=maxlen)

    def push(self, state, loc):
        state = state_with_loc(state, loc)
        self.memory.append(state)
    
    def get(self):
        r = randint(0, len(self.memory) - 1)
        return (self.memory[r], self.actions[r], 
                self.rewards[r], self.memory[r+1])
    
    def top(self):
        return self.memory[-1]
