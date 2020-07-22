
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
        self.memory = [deque(maxlen=maxlen+1) for _ in range(USER_COUNT)]
        self.cicle = 0

    def push(self, states, actions, rewards):

        for state, action, reward in zip(states, actions, rewards):
            data = self.MemoryData(state, action, reward)
            self.memory[self.cicle].append(data)

            self.cicle += 1
            self.cicle = self.cicle % USER_COUNT

    def samples(self, count):
        result = []
        for i in self.memory:
            for _ in range(count):
                mx = len(i) - 1
                x = randint(0, mx)

                t1 = i[x]
                t2 = i[x + 1]

                result.append(t1.state, t1.action, t1.reward, t2.state)

        return result

