---
layout: post
Title: Photospheres
description: Collection of some Photospheres
sitemap: false
accent_image: /assets/img/sidebar-bg-sphere.png
---
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/dist/photo-sphere-viewer.min.css"/>

<script src="https://cdn.jsdelivr.net/npm/three/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/uevent@2/browser.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/dist/photo-sphere-viewer.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4.0.7/dist/plugins/gyroscope.js"></script>
<script src="https://github.com/mrdoob/three.js/blob/master/examples/js/controls/DeviceOrientationControls.js"></script>

<div id="viewer"></div>

<style>
  /* the viewer container must have a defined size */
  #viewer {
    width: 100%;
    height: 50vh;
  }
</style>

<script>
  var viewer = new PhotoSphereViewer.Viewer({
    plugins: [
    PhotoSphereViewer.GyroscopePlugin,
    ],
    container: document.querySelector('#viewer'),
    panorama: 'https://i.ibb.co/xjGh239/PANO-20161219-100158.jpg',
    navbar: [
    'autorotate',
    'zoom',
    'fullscreen',
    'gyroscope',
    ]
  });
</script>
