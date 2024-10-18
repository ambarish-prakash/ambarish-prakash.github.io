---
layout: new_post
title: Find The Fox
subtitle: OCR and Digital Text Recognition
author: Ambarish Prakash
---

# What the Fox?

<div style="display: grid; grid-template-columns: 150px auto; gap: 10px;">
  <img src="{{'/assets/img/ftf/cover.jpg' | relative_url }}" alt="Cover" style="width:150px; height:200px;">
  <p>For those of you who have not heard of it, let me be the one to introduce you to the amazing book 'Find The Fox', by Alex Cheddar.  Its basically a 200 page word search where in all the pages, there is only ONE 3 letter word to find haha. Alex describes the hunt as 'finding a needle in a haystack, if the haystack was made entirely of needles.' and I couldn't think of a more apt description.</p>
</div>


<div style="display: grid; grid-template-columns: auto 150px; gap: 10px;">
  <p>Trying to solve it manually page by page could literally drive you crazy (try looking at page one for yourself!). You need to be meticulous with every line as a single slip and you could end up reaching the final page without finding the fox.</p>
  <img src="{{'/assets/img/ftf/ftf_p1.jpg' | relative_url }}" alt="Cover" style="width:150px; height:200px;">
</div>


Sooooo...... Obviously there's got to be a better way right? Programatically it is quite easy to go through text grids. Basically in a 2d array, you can loop through each point and check the letters in all 8 directions for the word fox. The main challenge here is to get that digital grid, ie, to convert the physical pages in my hand to a 2d digital grid per page and then search for the work fox in each. 


# OCR with Pytesseract
We can use OCR to extract the text from the page to digital strings. There are already inbuilt python libraries such as pytesseract that have trained OCR models that can be used. 

Using that I could convert an image of the page into text strings. Prior to the digital scanning, we also need to preprocess the image in order to rempve any shading issues or shadows and make the letters more clear. In order to preprocess the image I used 3 steps:
<ul>
    <li> Grayscale: Convert the image from RGB to Grayscale. In our case we have images of the page and we only want the words which are basically black on white. By converting the image to Grayscale, we can remove all the color and ensure the image has only 1 channel.  </li>
    <li> Threshold: Apply a mask to make the image into binary segments - character or not. By using the cv2 'threshold' method, we can set every pixel to either 0 or 255 based on a given threshold value. </li>
    <li> Dilation: Based on the photo, the lighting and the threshold value, the characters can get pixelated. Using the 'dilate' method from cv2, we can smooth out the image to make the characters more recognizable. </li>
</ul>

![Preprocessing]({{'/assets/img/ftf/ftf_preprocess.jpg' | relative_url }}){: .mx-auto.d-block : width="400" height="500"}
<div style="text-align: center;">
    <em>Preprocessing of the photo of the page.</em>
</div>

Post the preprocessing, we can pass the image through pytesseract to extract the characters. To do this we can use the 'image_to_string' method in pytesseract to get the string. Tesseract also has multiple page segmentation modes when identifying text, ranging from psm 3 (default) to psm 6 (assume single uniform block of text) to psm 11 (sparse text, find in any order). However the results were not ideal. For example this was the string extracted from the above image:

![OCR Result]({{'/assets/img/ftf/ftf_ocr_result.jpg' | relative_url }}){: .mx-auto.d-block : width="900" height="200"}

There are multiple issues with this. Firstly we dont get 20 characters per line. Secondly we get letters that are not F O or X such as 0 or K or r. Pytesseract also has another method called 'image_to_data' which extracts the bounding boxes as well as the corresponding string. Plotting the bounding boxes on the image we can get an idea of what is happening behind to scenes to understand our problem elements.

![OCR Bounding Boxes]({{'/assets/img/ftf/ftf_pytesseract_boxes.jpg' | relative_url }}){: .mx-auto.d-block : width="800" height="200"}
<div style="text-align: center;">
    <em>Pytesseract OCR bounding boxes.</em>
</div>

Looking at the boxes we can see that the OCR extraction had a lot of issues. There were multiple overlapping bounding boxes leading to additional letters being extracted. Also certain boxes only covered parts of the letters leading to it detecting letters like 'K' from parts of the X. And these were issues with 5 lines from a single page. Learning how Tessarct was identifying characters and understanding how to preprocess the image such that it could extract all the letters properly without errors seemed like it would take a lot more challenging. 

I needed a different method with better control in order to solve this. 

# TO DO
I still need to type out these sections. Come back in a bit and it should be done.


# Final Solution
After running this on a lot of pages, I finally got a hit on the fox. Here is the solution along with hints in case you want to try and solve it manually.

<details style="margin-bottom: 20px;">
  <summary>Spoiler Alert: Hint 1 - Which quarter of the book</summary>
  The FOX is found somewhere in the last quarter of the book, i.e. in pages 150 - 201.
</details>
<details style="margin-bottom: 20px;">
  <summary>Spoiler Alert: Hint 2 - Orientation</summary>
  The FOX is found in a vertical alignment with F on top and O below that with X below that.
  <img src="{{'/assets/img/ftf/ftf_spoiler_orientation.jpg' | relative_url }}" alt="Spoiler 2" style="display: block; margin: 0 auto; width: 80px; height: 150px;">
</details>
<details>
    <summary>Spoiler Alert: Solution</summary>
  <details style="margin-left: 20px;">
    <summary>Are you sure you want to see the solution? Theres no turning back!</summary>
      The FOX is found in page 157!
    <img src="{{'/assets/img/ftf/ftf_solution.jpg' | relative_url }}" alt="Spoiler 2" style="display: block; margin: 0 auto; width: 250px; height: 400px;">
  </details>
</details>
<br>