// Dean Attali / Beautiful Jekyll 2023

let BeautifulJekyllJS = {

  bigImgEl : null,
  numImgs : null,
  typewriterEl: null,
  quoteIdx: -1,
  quotes: [
    'Life before Death, Strength before Weakness, Journey before Destination.', 
    'Always remember you are braver than you believe, stronger than you seem, smarter than you think, and loved more than you know.',
    'Any sufficiently advanced technology is indistinguishable from magic.',
    'If good things lasted forever, would we appreciate how precious they are? - Hobbes.',
    'Dad: Life isn\'t fair. Calvin: I know, but why isn\'t it ever unfair in my favour? ',
    'Today you are you! That is truer than true! There is no one alive who is you-er than you!',
  ],

  init : function() {
    setTimeout(BeautifulJekyllJS.initNavbar, 10);

    // Shorten the navbar after scrolling a little bit down
    $(window).scroll(function() {
        if ($(".navbar").offset().top > 50) {
            $(".navbar").addClass("top-nav-short");
        } else {
            $(".navbar").removeClass("top-nav-short");
        }
    });

    // On mobile, hide the avatar when expanding the navbar menu
    $('#main-navbar').on('show.bs.collapse', function () {
      $(".navbar").addClass("top-nav-expanded");
    });
    $('#main-navbar').on('hidden.bs.collapse', function () {
      $(".navbar").removeClass("top-nav-expanded");
    });

    // show the big header image
    BeautifulJekyllJS.initImgs();

    BeautifulJekyllJS.initSearch();

    let elements = document.getElementsByClassName('typewriter');
    if (elements.length > 0) {
      BeautifulJekyllJS.typewriterEl = elements[0];
      BeautifulJekyllJS.selectQuote();
    }
  },

  selectQuote: function() {
    //BeautifulJekyllJS.quoteIdx = (BeautifulJekyllJS.quoteIdx + 1) % BeautifulJekyllJS.quotes.length;
    let new_idx = Math.floor((Math.random() * BeautifulJekyllJS.quotes.length));
    if(new_idx == BeautifulJekyllJS.quoteIdx){
      BeautifulJekyllJS.selectQuote();
    } else {
      BeautifulJekyllJS.quoteIdx = new_idx;
      let selected_quote = BeautifulJekyllJS.quotes[BeautifulJekyllJS.quoteIdx];
      BeautifulJekyllJS.typeQuote(selected_quote, 0);
    }
  },

  typeQuote: function(quote, idx) {
    idx++;
    let len = quote.length + 1;
    
    if(idx == len) {
      timeOut = setTimeout(BeautifulJekyllJS.untypeQuote, 2000, quote, idx);
    } else {
      var texx = quote.substring(0,idx);
      $('.typewriter').text(texx);
      timeOut = setTimeout(BeautifulJekyllJS.typeQuote, 40, quote, idx);
    }

  },

  untypeQuote: function(quote, idx){
    idx --;
    if (idx == -1){
      timeOut = setTimeout(BeautifulJekyllJS.selectQuote, 100);
    } else {
      var texx = quote.substring(0,idx);
      $('.typewriter').text(texx);
      timeOut = setTimeout(BeautifulJekyllJS.untypeQuote, 15, quote, idx);
    }
  },

  initNavbar : function() {
    // Set the navbar-dark/light class based on its background color
    const rgb = $('.navbar').css("background-color").replace(/[^\d,]/g,'').split(",");
    const brightness = Math.round(( // http://www.w3.org/TR/AERT#color-contrast
      parseInt(rgb[0]) * 299 +
      parseInt(rgb[1]) * 587 +
      parseInt(rgb[2]) * 114
    ) / 1000);
    if (brightness <= 125) {
      $(".navbar").removeClass("navbar-light").addClass("navbar-dark");
    } else {
      $(".navbar").removeClass("navbar-dark").addClass("navbar-light");
    }
  },

  initImgs : function() {
    // If the page was large images to randomly select from, choose an image
    if ($("#header-big-imgs").length > 0) {
      BeautifulJekyllJS.bigImgEl = $("#header-big-imgs");
      BeautifulJekyllJS.numImgs = BeautifulJekyllJS.bigImgEl.attr("data-num-img");

      // 2fc73a3a967e97599c9763d05e564189
      // set an initial image
      const imgInfo = BeautifulJekyllJS.getImgInfo();
      const src = imgInfo.src;
      const desc = imgInfo.desc;
      BeautifulJekyllJS.setImg(src, desc);

      // For better UX, prefetch the next image so that it will already be loaded when we want to show it
      const getNextImg = function() {
        const imgInfo = BeautifulJekyllJS.getImgInfo();
        const src = imgInfo.src;
        const desc = imgInfo.desc;

        const prefetchImg = new Image();
        prefetchImg.src = src;
        // if I want to do something once the image is ready: `prefetchImg.onload = function(){}`

        setTimeout(function(){
          const img = $("<div></div>").addClass("big-img-transition").css("background-image", 'url(' + src + ')');
          $(".intro-header.big-img").prepend(img);
          setTimeout(function(){ img.css("opacity", "1"); }, 50);

          // after the animation of fading in the new image is done, prefetch the next one
          //img.one("transitioned webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
          setTimeout(function() {
            BeautifulJekyllJS.setImg(src, desc);
            img.remove();
            getNextImg();
          }, 1000);
          //});
        }, 6000);
      };

      // If there are multiple images, cycle through them
      if (BeautifulJekyllJS.numImgs > 1) {
        getNextImg();
      }
    }
  },

  getImgInfo : function() {
    const randNum = Math.floor((Math.random() * BeautifulJekyllJS.numImgs) + 1);
    const src = BeautifulJekyllJS.bigImgEl.attr("data-img-src-" + randNum);
    const desc = BeautifulJekyllJS.bigImgEl.attr("data-img-desc-" + randNum);

    return {
      src : src,
      desc : desc
    }
  },

  setImg : function(src, desc) {
    $(".intro-header.big-img").css("background-image", 'url(' + src + ')');
    if (typeof desc !== typeof undefined && desc !== false) {
      $(".img-desc").text(desc).show();
    } else {
      $(".img-desc").hide();
    }
  },

  initSearch : function() {
    if (!document.getElementById("beautifuljekyll-search-overlay")) {
      return;
    }

    $("#nav-search-link").click(function(e) {
      e.preventDefault();
      $("#beautifuljekyll-search-overlay").show();
      $("#nav-search-input").focus().select();
      $("body").addClass("overflow-hidden");
    });
    $("#nav-search-exit").click(function(e) {
      e.preventDefault();
      $("#beautifuljekyll-search-overlay").hide();
      $("body").removeClass("overflow-hidden");
    });
    $(document).on('keyup', function(e) {
      if (e.key == "Escape") {
        $("#beautifuljekyll-search-overlay").hide();
        $("body").removeClass("overflow-hidden");
      }
    });
  }
};

// 2fc73a3a967e97599c9763d05e564189

document.addEventListener('DOMContentLoaded', BeautifulJekyllJS.init);
