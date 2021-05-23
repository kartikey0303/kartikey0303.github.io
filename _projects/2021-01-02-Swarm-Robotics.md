---
layout: post
title: Swarm Robotics
description: >-
  Mini robotics project, I started, probably abandoned now.
image: /assets/img/project/SwarmV1.png
accent_image: /assets/img/electronics-bg.jpg
sitemap: true
last_modified_at: 2021-02-01
---
1. Table of contents
{:toc .large-only}
Started a robotics project in late 2018, during recruitment season at my college. The idea was to build a small multi-purpose robot. Later odometry, sensing, communication and multiple other types of algorithms could be tested on it.  
### Design
Early on I decided I wanted to have a small robot. I decided that a size of around **5x5cm** should be good enough. The robot would be a two floor kind of structure. The top part would have all the electronics and the bottom part would have the two or 4 motors that would be required to drive the robot. The bottom part could also house the encoders (for odometry) and the various proximity sensors (to check distance from objects and to check if the robot was going to fall off from an edge).

The design was very much inspired *(cough)(copied)* by the [Jasmine Robot Platform](http://www.swarmrobot.org/). It was also inspired from the [Anki Cozmo](https://www.digitaldreamlabs.com/pages/cozmo) in terms of the electronics involved.

## Hardware
### Part Selection
#### ESP-32
The most important factor was cost (because... well, I had no money). The components that I used on the board had to available on AliExpress, as it was the place where I could get cheap components. Sometimes these components were removed from older boards, but mostly they were part of a bigger spool and the seller sold these as loose components.

So the process went like this:
1. Search for an old chip on Texas instruments, Analog, Maxim etc.
2. Search for the same chip on AliExpress.
3. Search for variations of that chip on TI etc.
4. If a match is found, make a note of that chip

The chip schematic should not be too complicated. I could not understand 32-48 pin ICs and their schematics. They were usually super efficient and had various features which would have been good to have. But again they were difficult to understand and had multiple external components which were again difficult to source (MOSFETs etc - I did not really understand the various properties and applications of MOSFETs as I had never used them in real life (just studied them in theory which I have never understood), so seeing them in a schematic did make no sense to me). Also the board had to be small. This was the major reason I wanted to make a new design so that I could incorporate various features not included in usual robotics kits.

**Micro-controller**: I chose **ESP-32** because it served multiple purposes
1. It has bluetooth and WiFi communication
2. The processor was pretty good
3. The chip itself was small
4. Tutorials on the platform were great
5. Some machine learning applications were also possible on the platform

### Implementation
I wanted to learn something new. So I thought I'll start from scratch and start building the circuit and the PCB. I had some basic idea about power electronics, little bit of communication protocols (I2C, UART etc) and the basic circuit design.

### *To Be Continued...*
