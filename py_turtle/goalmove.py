#Project 1
import turtle
import math
import random

#Screen color
background = turtle.Screen()
background.bgcolor("lightgreen")

#border
border = turtle.Turtle()
border.penup()
border.setposition(-300,-300)
border.pendown()
border.pensize(3)
for side in range(4):
    border.forward(600)
    border.left(90)
border.hideturtle()

#player turtle
player = turtle.Turtle()
player.color("#041E42")
player.shape("triangle")
player.penup()
player.speed(0)

#goal
goal = turtle.Turtle()
goal.color("red")
goal.shape("circle")
goal.penup()
goal.speed(0)
goal.setposition(random.randint(-300, 300), random.randint(-300, 300))
#speed
speed = 1

#functions
def turnleft():
    player.left(30)

def turnright():
    player.right(30)

def increasespeed():
    global speed
    speed += 1

def decreasespeed():
    global speed
    speed -= 1

def isCollision(t1, t2):
    d = math.sqrt(math.pow(player.xcor()-goal.xcor(), 2)) + math.pow(player.ycor()-goal.ycor(), 2)
    if d < 20:
        return True
    else:
        return False
#key binds
turtle.listen()
turtle.onkey(turnleft, "Left")
turtle.onkey(turnright, "Right")
turtle.onkey(increasespeed, "Up")
turtle.onkey(decreasespeed, "Down")

while True:
    player.forward(speed)

    #checking if turtle is at side borders
    if player.xcor() > 300 or player.xcor() < -300:
        player.right(180)
    #checking if turtle is at top/bottom
    if player.ycor() > 300 or player.ycor() < -300:
        player.right(180)
    #collision
    if isCollision(player, goal):
        goal.setposition(random.randint(-300, 300), random.randint(-300, 300))
        goal.right(random.randint(0,360))

        #move goal
        goal.forward(1)
