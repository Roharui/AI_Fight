
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Input, Conv2D, MaxPool2D, BatchNormalization, Dropout, Flatten, Cropping1D
from tensorflow.keras.models import clone_model, Model

import numpy as np

MEMORY_SIZE = 5000
STEP = 200
STATE_HISTORY = 16
BATCH_SIZE = 64

USER_COUNT = 4

MODEL_INPUT = 5
STATE_ELE = 6

ACTION = 6

r = 0.9

class DQN_CORE:
    class MemoryData:
        def __init__(self, state, action, cost):
            self.state = state
            self.action = action
            self.cost = cost

    def __init__(self, episode):
        self.episode = episode
        self.memory = [[] for _ in range(USER_COUNT)]

        self.target_model = self.getModel()
        self.nerual_model = clone_model(self.target_model)

    def Q_reward(self, reward, state, action):
        future_reward = r * np.max(self.nerual_model.predict(state))
        return (reward + future_reward)

    def getModel(self):
        result = Sequential()

        sip = Input(shape=(MODEL_INPUT, MODEL_INPUT, STATE_ELE))

        result.add(sip)
        result.add(Conv2D(16, (2,2), padding='same', activation='relu'))
        result.add(BatchNormalization())

        # result.add(Conv2D(4, (3,3), padding='same', activation='relu'))
        # result.add(MaxPool2D(pool_size=(3,3)))
        # result.add(BatchNormalization())

        result.add(Flatten())
        result.add(Dropout(0.25))
        result.add(Dense(200))
        result.add(Dropout(0.25))
        result.add(Dense(ACTION))

        return sip, result

    


if __name__ == "__main__":
    x = DQN_CORE(300)
    x.getModel().summary()