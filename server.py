
import asyncio
import websockets
import os
import sys
import ssl
import pathlib


print("Starting server")
print("waiting for connections")

hasStarted = False
readyList = []
playerList = []


class Player():
    def __init__(self, name, ws, iD):
        self.name = name
        self.iD = iD
        self.ws = ws
        self.ready = False
    
    def getReady(self):
        self.ready = True


def addPlayer(playerName, ws):
    # checks to see if the playername has already been added
    
    for player in playerList:
        if player.name == playerName:
            print("player already in the list")
            return f"{playerList.index(playerName)}"
    
    # creaete new player and send it to the list
    print("new player to be added")
    playerList.append(Player(playerName, ws, len(playerList)))
    return len(playerList)

async def sendAll(message, excludeWsList = []):
    print(f"sending to all users -> {message}")
    for player in playerList:
        w = player.ws
        # print(w.state, type(w.state), w.state == w.state.OPEN)
        if w.state == w.state.OPEN: #check if the connection is still open
            await w.send(message)

async def echo(websocket, path):
    
    async for message in websocket:
        command = message.split(":")

        if command[0] == "restart":
            print("restarting the server")
            # means that I want to restart the server
            os.execl(sys.executable, 'python', __file__, *sys.argv[1:])
            # os.execv("/usr/bin/python", ["server.py"])
            # os.system(f"python startServer.py {os.getpid()}")
            
        if len(command) >= 3:
            print("\n")
            print(f"got a new message --> {message}")
            
            if command[2] == "hello":
                # goat a initialize message
                nameList = ""
                for player in playerList:
                    w = player.ws
                    # print(w.state, type(w.state), w.state == w.state.OPEN)
                    if w.state == w.state.OPEN and w.__hash__ != websocket.__hash__: #check if the connection is still open
                
                        nameList = nameList + f":{player.name}"   #create a playername list to send to the new connection
                        await w.send(f"server:all:new:{command[0]}")  #warn other connections that a new connection has been made
                
                name = await websocket.send(f"server:{command[0]}:id:{addPlayer(command[0], websocket)}{nameList}")
                            
            elif command[2] == "ready":
                # got a ready message
                await sendAll(f"server:all:ready:{command[0]}")
                readyList.append(command[0])
                if len(playerList) == len(readyList) and len(playerList) > 1:
                    await sendAll("server:all:start");
                    await websocket.send(f"server:{command[0]}:start:{len(playerList)}")
                else:
                    await websocket.send(f"server:{command[0]}:missing:{len(playerList)-len(readyList)}")

            elif command[2] == "click":
                # means that a point was clicked, need to send this information to everyone
                print(f"{command[0]} has clicked on {command[3]}")
                await sendAll(f"server:all:click:{command[0]}:{command[3]}")
            
            elif command[2] == "FINISHED":
                print(f"{command[0]} has finished the game")
                await sendAll(f"server:all:FINISHED:{command[0]}")
                os.execl(sys.executable, 'python', __file__, *sys.argv[1:])
                  
            else:
                print(f"unrecognized message {message}")
                name = await websocket.send("ERROR:unrecognized command")

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
localhost_pem = pathlib.Path(__file__).with_name("server.pem")
ssl_context.load_cert_chain(localhost_pem)

asyncio.get_event_loop().run_until_complete(websockets.serve(echo, '192.168.1.81', 4441, ssl=ssl_context))
asyncio.get_event_loop().run_forever()



"""

formato de uma mensagem -->  origem:destinatario:mensagem

portanto cliente vai mandar uma mensagem a dizer o nome
    servidor vai devolver uma mensagem a dizer o player number

    hello:name

jogo vai para o estado hasStarted quando todos os players mandarem a mensagem a dizer que estao prontos

quando o jogo comecar:
    server vai mandar campo e pontos para o primeiro jogador
    primeiro jogador vai jogar, decidir se fez um quadrado ou nao
        no fim vai mandar de volta os pontos e campo
        server vai decidir se joga outra vez ou nao
    passar para o proximo jogador e repetir
"""