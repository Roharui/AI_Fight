
from requests import post
import json

from random import randint
from time import sleep

base_url = "http://localhost:5555/"

class Sender :
    def join(self):
        data = post(base_url + "join").content

        j = json.loads(data)

        return j

    def action(self, xid, x):
        data = post(base_url + "action", data={"id":xid, "action":x}).content

        j = json.loads(data)

        return j

    def clear(self):
        post(base_url + "clear")

    def testing(self):
        self.clear()

        self.join()
        self.join()

        for i in range(100):
            self.action(i%2, randint(0, 6))
            sleep(0.1)
            

if __name__ == "__main__":
    x = Sender()
    x.testing()