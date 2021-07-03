# Manifesto Server

This the server side of our manifesto app. It's written in **NodeJs** with the help of a library called **AbletonJs** that you can check out here: https://github.com/leolabs/ableton-js. There is also a **Docker** compose file that will start up a **Kafka** instance for you. The Kafka instance will get the data the the rpi
sends and redirects it to the server which will evaluate it based on the area of interest that it gets from the Frontend.

# How to use the app

1 - First you need to start Ableton and load the the tracks that you want to play with - Follow this small tutorial to properly install abletonJs on your machine : https://github.com/leolabs/ableton-js#prerequisites
2 - npm start starts the server for you that will connect to Ableton and send the requests. This will start the server on Port 8080.
