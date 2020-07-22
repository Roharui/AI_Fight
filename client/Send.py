
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

    def getScore(self):
        data = post(base_url + "score").content

        return json.loads(data)

    def clear(self):
        post(base_url + "clear")

    def testing(self):
        self.clear()

        self.join()
        self.join()

        for i in range(100):
            r = randint(0, 5)
            self.action(i%2, r)

            print(f"{i%2} : {r}")

            if i%2 == 0:
                print()
                print(self.getScore())
                print()

            input()

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