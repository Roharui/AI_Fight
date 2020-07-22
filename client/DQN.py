
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Input, Conv2D, MaxPool2D, BatchNormalization, Dropout, Flatten, Cropping1D
from tensorflow.keras.models import clone_model, Model

from Send import Sender
from Memory import UserMemory, state_with_loc
from config import *

import numpy as np

class DQN_CORE:            

    def __init__(self, episode):
        self.episode = episode
        self.memory = [UserMemory(int(MEMORY_SIZE / USER_COUNT))
                        for _ in range(USER_COUNT)]
        self.sender = Sender()
        
        self.model = self.getModel()
        self.target_model = clone_model(self.model)

        self.clear = True

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
            h = self.sender.init(USER_COUNT)
            self.memory[0].push(h['stage'], h['loc'])
            state = self.memory[0].top()
            self.clear = False
        else:
            state = self.memory[-1].top()
        
        for i in range(USER_COUNT):
            _i = (i + 1) % USER_COUNT
            action = self.model.predict(state[np.newaxis])[0].argmax()
            self.memory[i].actions.append(action)

            h = self.sender.action(i, action)

            self.memory[_i].push(h['stage'], h['loc'])

        [self.memory[num].rewards.append(i) 
            for num, i in enumerate(self.sender.getScore()['score'])]

        

if __name__ == "__main__":
    x = DQN_CORE(300)
    x.action()