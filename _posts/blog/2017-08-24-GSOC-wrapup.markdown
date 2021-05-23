---
layout: post
title: "GSOC wrap-up"
permalink: "GSOC-wrapup"
description: First and Last blog  entry for GSoC 2017
sitemap: false
category: blog
tags: [GSoC, blender, python, java]
last_modified_at: 2017-08-24
---

<style type="text/css">
	a { color: #1e6bb8; text-decoration: underline; }
	.page-header { color: #fff; text-align: center; background-color: #159957; background-image: radial-gradient(circle , #dbd534 1%, #3CA55C 30%,#3CA55C 100%);
		background-size: 400% 400%;
		padding: 5rem 6rem;
		background-position: 100% 100%;
		-webkit-animation: Gradient 25s cubic-bezier(0.25, 0.47, 0.66, 0.4) infinite;
		-moz-animation: Gradient 25s cubic-bezier(0.25, 0.47, 0.66, 0.4) infinite;
		animation: Gradient 25s cubic-bezier(0.25, 0.47, 0.66, 0.4) infinite;
	}
	@-webkit-keyframes Gradient {
			0% {
				background-position: 80% 0%;
			}
			25%{
				background-position: 60% 40%;
			}
			50%{
				background-position: 52% 70%;
			}
			75%{
				background-position: 37% 40%;
			}
			90%{
				background-position: 25% 20%;
			}
			100%{
				background-position: 80% 0%;
			}
		}/*summer*/
		@-moz-keyframes Gradient {
			0% {
				background-position: 80% 0%;
			}
			25%{
				background-position: 60% 40%;
			}
			50%{
				background-position: 52% 70%;
			}
			75%{
				background-position: 37% 40%;
			}
			90%{
				background-position: 25% 20%;
			}
			100%{
				background-position: 80% 0%;
			}
		}/*summer*/
		@keyframes Gradient {
			0% {
				background-position: 80% 0%;
			}
			25%{
				background-position: 60% 40%;
			}
			50%{
				background-position: 52% 70%;
			}
			75%{
				background-position: 37% 40%;
			}
			90%{
				background-position: 25% 20%;
			}
			100%{
				background-position: 80% 0%;
			}
		}/*summer*/
		}/*mojito*/
</style>
### Project - [Improving blender addon for Terasology](https://summerofcode.withgoogle.com/projects/#5727406135443456)
### Organisation - [Moving Block](https://github.com/MovingBlocks)  
Terasology the game being developed by Moving Blocks uses a custom version of an md5 exporter for Blender. This exporter is used to exporting creature models, animatations and some game specific asset files. The project was aimed at improving the usability of the addon by adding more features and making the addon more user friendly. The addon is now being able to export complete modules (which can be directly used in the game), specific assets for game or the complete module in a specific folder.


[Follow this link](https://github.com/MovingBlocks/TeraMisc/pulls?utf8=%E2%9C%93&q=is%3Apr%20author%3Akartikey0303%20) to my Pull Requests for the [TeraMisc repository](https://github.com/MovingBlocks/TeraMisc/).  
[Here](https://github.com/MovingBlocks/TeraMisc/commits?author=kartikey0303) is a list of all of my commits.  
The addon code that I edited can be found [here](https://github.com/MovingBlocks/TeraMisc/tree/master/blender_addons/io_md5_exporter).  
[Here](https://github.com/MovingBlocks/Terasology/pull/3070) is a link to the Pull request to the tool that I created for testing animations.

### Pull requests
[Pull Request #49](https://github.com/MovingBlocks/TeraMisc/pull/49): Initially the exporter was not working properly as it could not export animations directly. This Pull request fixed that issue and also added prefab exporting feature. Also a UIList was added to displaying the list of actions.

[Pull Request #51](https://github.com/MovingBlocks/TeraMisc/pull/51): Exporting the mesh as a complete module was implemented to be directly used in game. Also texture, prefab and material export were added. A "+" button was also added which could export the could entire module to a directory.

[Pull Request #52](https://github.com/MovingBlocks/TeraMisc/pull/52): JSON file was added as a string to the code to make the addon more user friendly.

[Pull Requests #53](https://github.com/MovingBlocks/TeraMisc/pull/53): More error statements and notifications were added to warn user of missing info and items.


As a part of the project I also created [tutorials](https://github.com/Terasology/TutorialAssetSystem/wiki/Installing-Blender-Add-on) which would prove helpful in using the addon.

During this process I learnt a lot about the [Blender python API](https://docs.blender.org/api/current/) in which I had little experience before.

I also created a [tool](https://github.com/MovingBlocks/Terasology/pull/3070) for the game so that the models that were exported could be tested in game. This helped me in understanding about how prefabs and entities work in game.

![Animation Speed]({{ site.url }}/assets/deerAnim.gif)  
<small>Deer animation at different speeds configured using the new in-game tool</small>

More details about the project can be found [here]({{ site.url }}//GSOC-2017/).
