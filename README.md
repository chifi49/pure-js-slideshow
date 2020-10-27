# pure-js-slideshow
A content/gallery slideshow with fade effect made with pure Javascript.
No external dependencies required

## Installation
####Include the pure-js-slideshow.js script 

`<script src="pure-js-slideshow.js"></script>`

####Minimum html required
```
<div id="my-custom-id" class="pure-js-slideshow">
	<div class="pure-js-slideshow-container">
		<div class="pure-js-slideshow-content">
            <img src="https://media.publit.io/file/islands/1.jpg"  />
        </div>
        <div class="pure-js-slideshow-content">
            <img src="https://media.publit.io/file/islands/2.jpg"  />
        </div>
	</div>
</div>
```

####Javascript Code with  minimum parameters

```
new pure_js_slideshow({
    'el': document.querySelector('#my-custom-id'),//or any other selector that returns one element
})
```

####Javascript code with all available parameters

```
new pure_js_slideshow(
    {
        el:'#pure-js-slideshow',
        autoplay:true,
        mobile:{
            enabled: false, //your custom logic to detect if its mobile or not 
            maxheight: 750,
            minheight: 600
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

        //navigation appearance (the previous and next arrows)
        navigation:{
            visible:true, //hide => false or show => true
            borderColor:'#000',
            backgroundColor:'#000',
            arrowColor:'#fff',
            mobile:{
                visible:true //hide or show if its on mobile state
            }
        },

        //pagination bullets appearance
        pagination:{
            visible:true,
            borderColor:'#fff',
            backgroundColor:'#fff',
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

### Methods

The call to `new pure_js_slideshow({el:...}) returns an object with methods you can call

`var slide1 = new pure_js_slideshow({el:document.getElementById('pure-slideshow')})`

#### previousContent
`slide1.previousContent()`
moves to the previous content/image

#### nextContent
`slide1.nextContent()`
moves to the next content/image

#### first
`slide1.first()`
moves to the first content/image

#### last
`slide1.last()`
moves to the last content/image

#### currentIndex
`slide1.getCurrentIndex()`
gets the current index of content/image
