# pure-js-slideshow
A content/gallery slideshow with fade or slide effect made with pure Javascript.
No external dependencies required (~7kb gzipped)

## Installation
#### Include the pure-js-slideshow.js script 

`<script src="pure-js-slideshow.js"></script>`

#### Minimum html required for an image slide
```
<div id="my-custom-id" class="pure-js-slideshow">
	<div class="pure-js-slideshow-container">
		<div class="pure-js-slideshow-content">
            <img src="./images/1.jpg"  />
        </div>
        <div class="pure-js-slideshow-content">
            <img src="./images/2.jpg"  />
        </div>
	</div>
</div>
```

#### Minimum html required for an image slide with text/button content
Your text content should be placed in a "div" element. You can position your text/content vertically and horizontally with 2 data attributes.
data-pos-v for vertical placement and possible values (top, middle, bottom)
data-pos-h for horizontal placement and possible values (left, center right)
By default we apply middle and center placement
```
<div id="my-custom-id" class="pure-js-slideshow">
	<div class="pure-js-slideshow-container">
		<div class="pure-js-slideshow-content">
            <img src="./images/1.jpg"  />
            <div>
                <h2>Image 1</h2>
            </div>
        </div>
        <div class="pure-js-slideshow-content">
            <img src="./images/2.jpg"  />
            <div data-pos-v="bottom" data-pos-h="center">
                <h2>Position bottom, center</h2>
            </div>
        </div>
	</div>
</div>
```

#### Javascript Code with  minimum parameters

```
new pure_js_slideshow({
    'el': document.querySelector('#my-custom-id')//or any other selector that returns one element
})
```

#### Javascript code with all available parameters

```
new pure_js_slideshow(
    {
        el:'#pure-js-slideshow',
        animation:'fade',//defaults to fade, set to "fade" or "slide"
        autoplay:true, //defaults to true, moves to next content every "timeout"
        dragContent:true, (defaults to true, drag content left or right to move to previous or next content)
        mobile:{
            enabled: false, //your custom logic to detect if its mobile or not 
            maxheight: 750, //max height of content in mobile device
            minheight: 600 //min height of content in mobile device
        },
        timeout:3000, //the time that the script waits to move to the next content/image
        transition:750, //the time that takes to move between current and next content/image
        maxheight:490, //maximum height (by default the content appears 100% in window viewport)
        minheight:390, //minimum height 
        
        //callback after the plugin inited (downloads the first 2 images and is ready to accept interaction or animate the content)
        inited:function(instance,currentIndex){
            console.log('plugin inited')
        },

        //called everytime it moves to a new content/image
        animated:function(instance,currentIndex){
            console.log('animated',currentIndex);
        },

        //called when the user clicks on a thumb
        thumbSelected:function(instance,currentIndex,imageSrc){
            console.log('thumb selected',imageSrc);
        },

        //called when the user clicks on the pagination bullets
        pageSelected:function(instance,currentIndex,imageSrc){

        },

        //called when the user clicks the content
        slideClicked:function(instance,currentIndex,imageSrc){
            console.log('slide clicked',imageSrc);
        },

        dragCallback:function(instance,currentIndex, newIndex){
            //newIndex might be undefined
            console.log(currentIndex,new Date());
        },

        //navigation appearance (the previous and next arrows)
        navigation:{
            visible:true, //hide => false or show => true (defaults to true)
            borderColor:'#000',
            backgroundColor:'#000',
            arrowColor:'#fff',
            radius:'50%',//radius of arrows px or %
            mobile:{
                visible:true //hide or show if its on mobile state (defaults to true)
            }
        },

        //pagination bullets appearance
        pagination:{
            visible:true,
            borderColor:'#fff',
            backgroundColor:'#fff',
            size: 14,//defaults to 10
            mobile:{
                visible:true
            }
        },

        //thumbnails appearance
        thumbnails:{
            visible:true,
            borderColor:'#ffffff',
            selectedBorderColor:'#000000',
            width:90, //width of a thumbnail
            height: 70, //height of a thumbnail
            mobile:{
                visible:true,
                width:100,
                height:80
            }
        }
    }
);
```

## Methods

The call to `new pure_js_slideshow({el:...}) returns an object with methods you can call

`var slide1 = new pure_js_slideshow({el:document.getElementById('pure-slideshow')})`

#### previousSlide
`slide1.previousSlide()`
moves to the previous content/image

#### nextSlide
`slide1.nextSlide()`
moves to the next content/image

#### firstSlide
`slide1.firstSlide()`
moves to the first content/image

#### lastSlide
`slide1.lastSlide()`
moves to the last content/image

#### currentIndex
`slide1.getCurrentIndex()`
gets the current index of content/image

#### thumbsVisible(true or false)
`slide1.thumbsVisible(true)`
changes visibility of thumbnails to show or hidden

#### autoPlay(true or false)
`slide1.autoPlay(false)`
stop or start the autoplay

## Examples
#### Live demo
[View here](https://pure-js-slideshow-demo.vercel.app/)