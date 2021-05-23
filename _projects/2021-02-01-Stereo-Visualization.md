---
layout: post
title: Stereo Visualization
description: >-
  Unity project to visualize Stereo disparity maps
image: /assets/img/project/Stereo_Vis.webp
accent_image: /assets/img/sidebar-bg-projects.webp
sitemap: false
last_modified_at: 2021-02-01
---

Unity Project to understand depth, disparity maps and plotting a point cloud using a combination of Depth map and Camera image.
It is called **Stereo Visualization** because it was meant to serve as a visualization tool to see point cloud from the disparity maps predicted using Stereo Images.
I made the project over weekends to understand a bit about how disparity and depth maps work.

I also uses a **Pcx** point cloud shader from here [Pcx](https://github.com/keijiro/Pcx) which gave me a better understanding of how this shader worked and how Geometry shaders are written in Unity.

I still don't understand the conventional method of how disparity maps are predicted from pair of Stereo Images. (I was once asked about this in a job interview on how to get depth map from two camera images which have different FoV. I wasn't able to answer it and the interviewer did not look pleased at all. 😁)
<br/>
<br/>
<video autoplay="autoplay" loop="loop">
  <source src="/assets/img/project/stereo.mp4" type="video/mp4" />
</video>

The project uses OpenCVSharp to read Camera images and depth images.

The dataset in the video above ir from [here](https://phuang17.github.io/DeepMVS/mvs-synth.html)
The depth maps are stored in EXR format which are read using OpenCV. Using the given camera intrinsic parameters each pixel of the camera images is projected into world space.
### Github link
[Stereo Vis](https://github.com/kartikey0303/StereoVis)
