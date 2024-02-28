---
layout: new_post
title: The many faces of Polyterasse
subtitle: Just me experimenting with Hugging Face and some ML models

thumbnail-img: /assets/img/poly_phases.gif
author: Ambarish Prakash
---


<div class="megaslider">
    <div class="subslider">
        <div class="subslide">
            <img src="/assets/img/polypics/img8.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img1.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img2.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img3.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img4.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img5.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img6.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img7.jpg" alt="Polyterasse" />
        </div>
    </div>

    <div class="slider">
        <div class="slide">
            <img src="/assets/img/polypics/img1.jpg" alt="Polyterasse" />
        </div>
        <div class="slide">
            <img src="/assets/img/polypics/img2.jpg" alt="Polyterasse" />
        </div>
        <div class="slide">
            <img src="/assets/img/polypics/img3.jpg" alt="Polyterasse" />
        </div>
        <div class="slide">
            <img src="/assets/img/polypics/img4.jpg" alt="Polyterasse" />
        </div>
        <div class="slide">
            <img src="/assets/img/polypics/img5.jpg" alt="Polyterasse" />
        </div>
        <div class="slide">
            <img src="/assets/img/polypics/img6.jpg" alt="Polyterasse" />
        </div>
        <div class="slide">
            <img src="/assets/img/polypics/img7.jpg" alt="Polyterasse" />
        </div>
        <div class="slide">
            <img src="/assets/img/polypics/img8.jpg" alt="Polyterasse" />
        </div>
        <a class="prev" onclick="prevSlide()">&lt;</a>
        <a class="next" onclick="nextSlide()">&gt;</a>
    </div>

    <div class="subslider">
        <div class="subslide">
            <img src="/assets/img/polypics/img2.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img3.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img4.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img5.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img6.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img7.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img8.jpg" alt="Polyterasse" />
        </div>
        <div class="subslide">
            <img src="/assets/img/polypics/img1.jpg" alt="Polyterasse" />
        </div>
    </div>

</div>


# Polyterrase <3

On of the many perks of studying here at ETH Zürich is the view from Polyterasse, the terrace in front of the main building. I can still remember my first time walking by this place, and overlooking the amazing city of Zürich. Safe to say I have tons of photos of Polyterasse in my photos album taken at different times in the year and at different times of the day. I knew I wanted to play with these photos in some way or the other.

At the same time, I wanted to play around with more AI models and concepts. So why not combine the two? :D

Just as a pet project these are some of the goals I wanted to achieve:
- Filter my polyterasse photos: Having multiple photos across the years somewhere in my google photos, I wanted to be able to collect all of them together.
- Morph photos: I wanted to play around to morph them from one to another in a smooth way. Just to play around with other models and their representation.
- Stylize polyterasse: With many models performing Image to Image style transfer, I wanted to try the same for some of the pictures I took.



**Code** : All my code for this can be found on my [Colab notebook here!](https://colab.research.google.com/drive/1CZnFV9Mq_HgMWBTqksZ5BXVDJcQlkiqA?usp=sharing)


Let's get into it shall we?


## Classification / Filtering
Now Google Photos already comes up with a way to filter photos in your library either via a location, or a face, or even a tag (outdoors). Hence it was easy enough to get my photos by just searching for Polyterasse, but wheres the fun in that?

Instead I wanted to use HuggingFace to fine tune some models and filter out all the photos in my Google Album since I moved here to Switzerland :D

### Setup
I ran my code on Google Colab, using their free GPU servers, and my Drive mounted for easy access to the training data. 

### Training
In order to train my model, I needed some positive and negative examples of pictures to feed into the model. I created two sets of images, a sub collection of polyterrasse pictures in my album as well as a larger subset of random photos in my camera roll, from other buildings to people to food.
Overall there were 15 positive pictures and around 35 negative images. Using the `load_dataset` function you can easily load the photos into a data loader!

I used Hugging Face to instantiate a pre trained image classification model. For this case I used the [Google ViT Patch 16](https://huggingface.co/google/vit-base-patch16-224) version.

Training was straight forward. I ran the training for 5 epochs (due to the small data size) using the default optimizer with a LR of 5e-5 and a CrossEntropy Loss.

### Inference
For the inference, I used the Google Photos API - [MediaItems Search](https://developers.google.com/photos/library/reference/rest/v1/mediaItems/search) in order to fetch all photos from my library in a paginated manner, and then classify them using my model.

![Google Photos API request]({{'/assets/img/photosapi.png' | relative_url }}){: .mx-auto.d-block : width="420" height="500"}


Results were unfortunately not great. A lot of unseen pictures were also being classified as pictures of Polyterasse - aka a lot of **False Positives**. In order to overcome this, I used a threshold in the final model output rather than using the argmax. This reduced the false positives to just a few. 

I wanted to automatically add these classified pictures to an album in Google Photos, unfortunately the API only allows you to use the API to edit / move albums and pictures that were created via the API..... WHY GOOGLE WHY!! 
So I just manually added the photos to an album instead :P

The final result was an album containing all my images of Polyterassee taken in the last two years, 8 of which are shown in the Image display above :D

## Photo Morphing
<p id="typing-text">Still typing...</p>

 <script>
    function simulateTyping() {
    var dots = '';
    var typingText = document.getElementById('typing-text');

    setInterval(function() {
        dots += '.';
        if (dots.length > 3) {
            dots = ''; // Reset dots when it reaches 4
        }
        typingText.textContent = 'Still typing' + dots; // Update text with dots
        }, 500); // Adjust the typing speed (milliseconds)
    }

    simulateTyping();
 </script>
