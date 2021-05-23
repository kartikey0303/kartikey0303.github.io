---
layout: post
Title: New Website... Finally
description: Why the new website was needed?
sitemap: true
category: blog
tags: [website, jekyll]
last_modified_at: 2021-10-05
---

So I finally have a new website (after about 1 year of delay). The basic website which was created for GSoC 2017 is gone now...

The website was meant to be a placeholder for just blog posts for Google Summer of Code. But now I thought maybe I can make something a little better.

I found this great theme called **Hydejack**. It looks great. But the problem is that the dark mode was paid and as were multiple other features.

Adding dark mode was pretty easy with a CSS file (parameters of which I got from the original website's css).

~~~scss
// file: "_variables.scss"
$gray: #777;
$gray-bg: rgba(255,255,255,.033);
$gray-text: #666;
$menu-text: rgba(255, 255, 255, 0.25);
$body-color: #ccc;
$body-bg: #282F31;
$border-color: #343d3f;
~~~
~~~js
// File: "code-block.js"
// Example can be run directly in your JavaScript console

// Create a function that takes two arguments and returns the sum of those
// arguments
var adder = new Function("a", "b", "return a + b");

// Call the function
adder(2, 6);
// > 8
~~~

An optional caption for a code block
{:.figcaption}
The next feature I wanted was search. For that I am using Simple Jekyll Search. It works really well. The idea is basically to create a `json` file which contains whatever you want to search e.g. Title, tags etc etc. After a little bit of *jugaad* javascript, this feature was complete too.

I did this back in August 2020.

Since then I have been procrastinating (like every project I start) putting this website on Github.

Hopefully that happens soon and hopefully with this website I get into the habit of documenting my work. I often learn something random for a random project. So, I will probably try to write a small post about a topic every week.
