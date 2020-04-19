# Blazorball
 
Blazorball is a work-in-progress multiplayer game built with ASP.NET Core 3.1 Blazor (Server).

The game is designed to be played in person or over a group call with screenshare support, with one person acting as host and the rest connecting to the game with their mobile devices or computers. It is a physics-based (using Matter.js) football-them-up.

# WIP, but Playable

The game is in a playable state, but still with issues. Users can join, and there is a game start and you can do stuff. Currently, issues arise with creating a new lobby after a finished game (js not disposing properly) and other various things.

# Setup

If you just want to play the game, it is available at [https://blazorball.xyz](https://blazorball.xyz) and you need to do none of these steps.

To build and run this project, you need .NET Core 3.1 installed on your system and something like Visual Studio 2019 to open the project. This project is also configured to use Docker. You will need Docker tools installed to compile and run with Docker.
