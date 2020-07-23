
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
        self.epsilon = EPSILON

    def update_model(self):
        self.target_model = clone_model(self.model)

    def save_model_json(self):
        open('model/AI_FIGHT.json', 'w').write(self.model.to_json())

    def save_model(self, number):
        self.model.save_weights(f'model/AI_FIGHT_{number}.h5')

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
        if random() > self.epsilon:
            return self.model.predict(state[np.newaxis])[0].argmax()
        return randint(0, ACTION-1)

    def run_step(self):
        self.clear = True
        for i in range(STEP):
            self.action()

    def train(self):
        
        train_set = self.memory.samples(TRAIN_SIZE)
        state = np.stack([x['state'] for x in train_set])
        model_Y = self.model.predict(state)

        n_state = np.stack([x['n_state'] for x in train_set])
        target_Y = self.target_model.predict(n_state)

        for num, i in enumerate(train_set):
            model_Y[num, i['action']] = i['reward'] + r * target_Y[num].max()
        
        self.model.fit(state, model_Y, batch_size=BATCH_SIZE)

    def run(self):
        for ep in range(EPISODE):

            print(f'{ep}. 에피소드 시작 -- ')

            print(f'{ep} -- 자율 행동.')
            self.run_step()

            if self.memory.length() > MIN_MEMORY:
                print(f'{ep} -- 학습 시작.')
                self.train()
            else:
                print(f'{ep} -- 학습을 위한 데이터 셋 부족.')
                print(f'{ep} -- {self.memory.length()}.')
            
            self.epsilon = max([self.epsilon - EP_STEP, MIN_EPSILON])
            print(f'{ep} -- 앱실론 : {self.epsilon}.')

            if ep%10 == 0:
                print(f'{ep} -- 모델 갱신.')
                self.update_model()

            if ep%50 == 0:
                print(f'{ep} -- 모델 저장.')
                self.save_model(ep)

if __name__ == "__main__":
    x = DQN_CORE(300)
    x.run()