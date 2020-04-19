# Blazorball
 
Blazorball is a work-in-progress multiplayer game built with ASP.NET Core 3.1 Blazor (Server).

The game is designed to be played in person or over a group call with screenshare support, with one person acting as host and the rest connecting to the game with their mobile devices or computers. It is a physics-based (using Matter.js) football-them-up.

# Currently WIP

A large percentage of the game is implemented but core features are still missing. Teams management and joining a room is entirely functional. Core gameplay is essentially finished. However, things such as updating client scores, end-of-game screens, rematches within the same room, better error handling, and more still need to be implemented. This will come over the next week or so.

# Setup

If you just want to play the game, it is available at [https://blazorball.xyz](https://blazorball.xyz) and you need to do none of these steps.

To build and run this project, you need .NET Core 3.1 installed on your system and something like Visual Studio 2019 to open the project. This project is also configured to use Docker. You will need Docker tools installed to compile and run with Docker.
