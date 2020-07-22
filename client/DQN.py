
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Input, Conv2D, MaxPool2D, BatchNormalization, Dropout, Flatten, Cropping1D
from tensorflow.keras.models import clone_model, Model

from Send import Sender
from Memory import UserMemory
from config import *

from random import random, randint

import numpy as np

class DQN_CORE:            

    def __init__(self, episode):
        self.episode = episode
        self.memory = UserMemory(MEMORY_SIZE)
        self.sender = Sender()
        
        self.model = self.getModel()
        self.target_model = clone_model(self.model)

        self.clear = True

    def update_model(self):
        self.target_model = clone_model(self.model)

    def getModel(self):
        result = Sequential()

        sip = Input(shape=(MODEL_INPUT, MODEL_INPUT, STATE_ELE))

        result.add(sip)
        result.add(Conv2D(16, (3,3), padding='same', activation='relu'))
        result.add(BatchNormalization())

        result.add(MaxPool2D((2,2)))

        result.add(Conv2D(16, (3,3), padding='same', activation='relu'))
        result.add(BatchNormalization())

        result.add(Flatten())
        result.add(Dropout(0.25))
        result.add(Dense(200))
        result.add(Dropout(0.25))
        result.add(Dense(ACTION))

        result.compile(optimizer='adam', loss='mse')

        return result

    def action(self):
        state = None
        if self.clear:
            state = self.sender.init(USER_COUNT)
            self.clear = False
        else:
            state = self.memory.top()

        states = []
        actions = []

        for i in range(USER_COUNT):
            states.append(state)
            action = self.get_Action(state)
            actions.append(action)
            state = self.sender.action(i, action)

        rewards = self.sender.getScore()

        self.memory.push(states, actions, rewards)

    def get_Action(self, state):
        # if random() > EPSILON:
        #     return self.model.predict(state[np.newaxis])[0].argmax()
        return randint(0, ACTION-1)

    def run_step(self):
        for i in range(STEP):
            self.action()

    

if __name__ == "__main__":
    x = DQN_CORE(300)
    x.run_step()

    xx = x.memory.samples(1)
    print(xx)