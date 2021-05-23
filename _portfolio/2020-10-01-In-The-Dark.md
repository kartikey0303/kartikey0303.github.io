---
layout: post
title: In the dark
description: >-
  Mobile game, started as a Weekly game jam, built in Unity
image: /assets/img/project/In_the_dark_title.jpg
sitemap: false
categories: portfolio
images:
  - image_path: /assets/img/portfolio/In-the-dark/light.mp4
    title: Light Test level
    size: video
  - image_path: /assets/img/portfolio/In-the-dark/In-the-dark-wall-walking.mp4
    title: Wall Walking
    size: video
  - image_path: /assets/img/portfolio/In-the-dark/grass.mp4
    title: Grass Shader. Entire Credit to <a href="https://www.patreon.com/minionsart">Minions Art</a>(<a href="https://www.patreon.com/posts/47447321">link</a>)
    size: video
  - image_path: /assets/img/portfolio/In-the-dark/door.gif
    title: Door 2D sprite
    size: quater
  - image_path: /assets/img/portfolio/In-the-dark/lever.gif
    title: Lever 2D sprite
    size: quater
  - image_path: /assets/img/portfolio/In-the-dark/switch.gif
    title: Switch 2D sprite
    size: quater
  - image_path: /assets/img/portfolio/In-the-dark/back.gif
    title: Back 2D icon
    size: quater
---

A small game that was made for a Weekly Game Jam in 2020. The project is at a standstill at the moment. If someone is interested in contributing, contact me and I'll share the github repository.

In this page I'll try to combine the various shaders that I made as well as some art for 2d animation in the game. All art was made in either Blender or in GIMP. Blender at this point is the **best** open source software available. It has incredible features and can solve almost all art needs for small to medium game development.

<ul class="photo-gallery">
  {% for image in page.images %}
  {% if image.size == "half" %}
    <li class="half">
      <a href="{{ image.image_path }}" id="port_image">
        <img src="{{ image.image_path }}" alt="{{ image.title}}"/>
      </a>
      <p>{{image.title}}</p>
    </li>
  {% elsif image.size == "third" %}
    <li class="third">
      <a href="{{ image.image_path }}" id="port_image">
        <img src="{{ image.image_path }}" alt="{{ image.title}}"/>
      </a>
      <p>{{image.title}}</p>
    </li>
  {% elsif image.size == "quater" %}
    <li class="quater">
      <a href="{{ image.image_path }}" id="port_image">
        <img src="{{ image.image_path }}" alt="{{ image.title}}"/>
      </a>
      <p>{{image.title}}</p>
    </li>
  {% elsif image.size == "full" %}
    <li class="full">
      <a href="{{ image.image_path }}" id="port_image">
        <img src="{{ image.image_path }}" alt="{{ image.title}}"/>
      </a>
      <p>{{image.title}}</p>
    </li>
  {% elsif image.size == "video" %}
    <li class="full">
      <a href="{{ image.image_path }}" id="port_image">
        <video autoplay="autoplay" loop="loop">
          <source src="{{ image.image_path }}" type="video/mp4" />
        </video>
      </a>
      <p>{{image.title}}</p>
    </li>
  {% endif %}
  {% endfor %}
</ul>
