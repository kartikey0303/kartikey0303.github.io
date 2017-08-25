---
layout: post
title: "GSOC wrap-up"
permalink: "GSOC-wrapup"
---

<style type="text/css">
	.page-header { color: #fff; text-align: center; background-color: #159957; background-image: linear-gradient(120deg, #1D976C, #93F9B9); }/*mojito*/
</style>
### Project - [Improving blender addon for Terasology](https://summerofcode.withgoogle.com/projects/#5727406135443456)
### Organisation - [Moving Block](https://github.com/MovingBlocks)

The project involved improving the addon for Blender to be better suited for exporting meshes and animations for Terasology.

[Here](https://github.com/MovingBlocks/TeraMisc/pulls?utf8=%E2%9C%93&q=is%3Apr%20author%3Akartikey0303%20) is a link to all my Pull Requests to the [TeraMisc](https://github.com/MovingBlocks/TeraMisc/) repository and [here](https://github.com/MovingBlocks/TeraMisc/commits?author=kartikey0303) is a list of all of my commits. The code that I edited can be found [here](https://github.com/MovingBlocks/TeraMisc/tree/master/blender_addons/io_md5_exporter).

### Pull requests
[Pull Request #49](https://github.com/MovingBlocks/TeraMisc/pull/49): Initially the exporter was not working properly as it could not export animations directly. This Pull request fixed that issue and also added prefab exporting feature. Also a UIList was added to displaying the list of actions.

[Pull Request #51](https://github.com/MovingBlocks/TeraMisc/pull/51): Exporting the mesh as a complete module was implemented to be directly used in game. Also texture, prefab and material export were added. A "+" button was also added which could export the could entire module to a directory.

[Pull Request #52](https://github.com/MovingBlocks/TeraMisc/pull/52): JSON file was added as a string to the code to make the addon more user friendly.

[Pull Requests #53](https://github.com/MovingBlocks/TeraMisc/pull/53): More error statements and notifications were added to warn user of missing info and items.


As a part of the project I also created [tutorials](https://github.com/Terasology/TutorialAssetSystem/wiki/Installing-Blender-Add-on) which would prove helpful in using the addon.

During this process I learnt a lot about the [Blender python API](https://docs.blender.org/api/current/) in which I had little experience before.

I also created a [tool](https://github.com/MovingBlocks/Terasology/pull/3070) for the game so that the models that were exported could be tested in game. This helped me in understanding about how prefabs and entities work in game.

![Animation Speed]({{ site.url }}/assets/deerAnim.gif)  
<small>Deer animation at different speeds</small>

More details about the project can be found [here]({{ site.url }}//GSOC-2017/).