


# -*- coding: utf-8 -*-
import os
import math
import matplotlib.pyplot as plt
from PIL import Image
class WechatJump:
    def __init__(self):
        self._coefficient = 1.35
        self._click_count = 0
        self._coords = []
    def generate_screenshot(self):
        os.system('adb shell screencap -p /sdcard/screenshot.png')
        os.system('adb pull /sdcard/screenshot.png .')
    def jump_to_next(self, distance):
        press_time = int(distance * self._coefficient)
        cmd = 'adb shell input swipe 100 100 200 200 {}'.format(press_time)
        print(cmd)
        os.system(cmd)
    def on_click(self, event):
        self._coords.append((event.xdata, event.ydata))
        self._click_count += 1
        if self._click_count == 2:
            self._click_count = 0
            _next = self._coords.pop()
            _prev = self._coords.pop()
            self.jump_to_next(
                math.sqrt((_next[0] - _prev[0]) ** 2 + (_next[1] - _prev[1]) ** 2))
    def run(self):
        while True:
            self.generate_screenshot()
            self.generate_screenshot()
            figure = plt.figure()
            figure.canvas.mpl_connect('button_press_event', self.on_click)
            img = Image.open('screenshot.png')
            plt.imshow(img)
            plt.show()
if __name__ == "__main__":
    wechat_jump = WechatJump()
    wechat_jump.run()
# python