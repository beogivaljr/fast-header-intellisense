# Fast Header Intellisense Extension for VSCode (README)

## Table of Contents

- [Features](#Features)
- [Requirements](#Requirements)
- [General](#General)
- [Installation](#Installation)
- [Extension Settings](#Extension-Settings)
- [Known Issues](#Known-Issues)
    - [General](#1.-General)
    - [UE4 ( \_\_LINE\_\_ issue )](#2.-UE4)
-----------

## Features
Switches to the faster Tag Parser Intellisense for header files.

Switches back to Context Aware Intellisense for Source files.

## Requirements
C/C++ project

VSCode **1.60.0+** with Microsoft C++ extension **1.6.0+**

(I had anomalies with previous versions of VSCode/MS C++ extension. I'm not sure when it was fixed.)

## General

In VSCode there are two different Intellisense settings:

1. Tag Parser (symbols only) fast but not smart.

2. Default (Context Aware) slow, for large projects, but smart.

Working with header files seem fine without Context Aware Intellisense. Having fast header file autocompletion, with Tag Parser Intellisense, seems the better trade off.

On the info bar, the fire icon represents Context Aware Intellisense and the cylinder icon for Tag Parser. They are only visible when they are processing Intellisense.
![](https://gist.githubusercontent.com/boocs/cacdbb0baab688d4d87c3bfebe55c553/raw/0062ac97dc8e1d02e970068b35ac5ffd2fd1fd95/tag_context_icons.JPG)

## Installation
1. Download from here: TODO

2. Click the VSIX file to download 

3. Open VSCode
   1. Click the Extensions button
   2. Click the ellipsis (3 dots) in upper-right corner of left side panel
   3. Choose **"Install from VSIX..."**
   4. Select the *.vsix file you just downloaded from GitHub


    ![](https://gist.githubusercontent.com/boocs/876a39952d6f69c82df38d6c0aa13da1/raw/4e392ddc86997d865a7dde6cc483aa09ee12570b/vsix-install.png)

## Extension Settings

#### Info Bar
You can change Intellisense modes by clicking the info bar lock icon.

![](https://gist.githubusercontent.com/boocs/cacdbb0baab688d4d87c3bfebe55c553/raw/0062ac97dc8e1d02e970068b35ac5ffd2fd1fd95/lock_icon.JPG)

* **Unlocked(default):** Headerfiles use Tag Parser. Source Files use Context Aware.

* **Locked Fire icon:** All files use Context Aware

* **Locked Cylinder icon:**  All files use Tag Parser


## Known Issues

#### 1. General
When I first tested this extension there were anomalies. VSCode didn't like switching Intellisense modes on the fly. Retesting this currently didn't reveal any.

This was also my first Typescript/VSCode API attempt. Let me know if there's anything wrong.

#### 2. UE4
Tag Parser Intellisense doesn't recognize compiler errors.

The Unreal Engine uses the \_\_LINE\_\_ preprocessor macro in the header file classes' GENERATED_* macro.

![](https://gist.githubusercontent.com/boocs/cacdbb0baab688d4d87c3bfebe55c553/raw/0062ac97dc8e1d02e970068b35ac5ffd2fd1fd95/generated_macro.JPG)

If you add a line anywhere above the GENERATED_* macro it will cause errors that will only be revealed after switching to a source file and waiting for the Context Aware Intellisense to load.

This can cause confusion.

**Fix:** Make sure to build your project if you add a line, to your header, above the GENERATED_* macro.
