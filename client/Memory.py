
import numpy as np

from collections import deque

from random import randint

from config import *

class UserMemory:

    class MemoryData:
        def __init__(self, state, action, reward):
            self.state = state
            self.action = action
            self.reward = reward

    def __init__(self, maxlen):
        self.memory = [deque(maxlen=maxlen) for _ in range(USER_COUNT)]
        self.cicle = 0

    def push(self, states, actions, rewards):

        for state, action, reward in zip(states, actions, rewards):
            data = self.MemoryData(state, action, reward)
            self.memory[self.cicle].append(data)

            self.cicle += 1
            self.cicle = self.cicle % USER_COUNT

    def top(self):
        return self.memory[self.cicle][-1].state

    def samples(self, count):
        result = []
        for _ in range(count):
            i = self.memory[randint(0, USER_COUNT - 1)]
            mx = len(i) - 2
            x = randint(0, mx)

            t1 = i[x]
            t2 = i[x + 1]

            result.append({
                "state" : t1.state, "action" : t1.action,
                "reward" : t1.reward, "n_state" : t2.state
            })

        return result

    def length(self):
        result = 0
        for i in self.memory:
            result += len(i)
        return result

