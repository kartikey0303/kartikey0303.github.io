---
layout: post
title: Raspberry Pi Attendance System
image: /assets/img/project/raspberry.jpg
accent_image: /assets/img/raspberry-bg.jpg
description: >-
  Raspberry Pi based Attendance system with College ID
sitemap: false
---
This is project which I started with a friend back in college.
The idea was to make an Attendance system for our [Manas](https://projectmanas.in/) Workshop so that people could sign in using their College IDs.
The College ID had an RFID tag. We connected an RFID scanner to the raspberry pi.

Earlier this was being done on an Arduino Uno. So we needed an extra RTC (Real Time Clock) module to keep time. Later when the project was shifted to Raspberry Pi this RTC module could be avoided as time could directly be updated from the internet.

We has an SQLite database. The entire application was written in Python (not a great idea). Later an touch screen and a fingerprint module (it was a pain to get it working with a Raspberry pi) as also added to the setup. So we could sign in using our fingerprint. The UI to be displayed on the screen was written in Tkinter.

#### Registration
The user could swipe their College ID or use their fingerprint to sign in. If a match was not found then the sign up screen was displayed. Here the college registration ID of the user could be added and it would be checked in the database. If not present a QR code was generate which the user could scan. The QR code would take to a Google form (with the registration number pre filled in from the entry earlier). Here the user to register and using Google Scripts this data was synced to the offline data stored on the Raspberry Pi. Now the user could scan their card as well as their fingerprint.

#### Workshop Automation
We also added workshop automation to the project as we has spare relays lying around. There relay modules were connected to the GPIO of the Raspberry pi and could control light and fans of the workshop.

Although a great project, the project came to an abrupt end when my term at Project Manas came to an end (at the end of the 3rd year students are supposed to pass on the responsibility to the then 2nd year students). I will try to find the source code for the project and put it on GitHub as well as add more details to this page.
