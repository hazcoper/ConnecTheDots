import os
import time 
import sys
import signal


os.kill(int(sys.argv[1]), 9)
print("Killed prev")
time.sleep(1)
print("starting server again")
os.system("python server.py")
exit()