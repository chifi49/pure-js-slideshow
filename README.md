# pure-js-slideshow
A content/gallery slideshow with fade effect made with pure Javascript.
No external dependencies required

## Installation
Include the pure-js-slideshow.js script 
<script src="pure-js-slideshow.js"></script>

Minimum html required
```
<div id="my-custom-id" class="pure-js-slideshow">
	<div class="pure-js-slideshow-container">
		<div class="pure-js-slideshow-content">
            <img src="https://media.publit.io/file/islands/1.jpg"  />
        </div>
        <div class="pure-js-slideshow-content">
            <img src="https://media.publit.io/file/islands/2.jpg"  />
        </div>
        <div class="pure-js-slideshow-content">
            <img src="https://media.publit.io/file/islands/3.jpg"  />
        </div>
	</div>
</div>

```

Javascript Code

```
new pure_js_slideshow({
    'el': document.querySelector('#my-custom-id'),//or any other selector that returns one element
})

```


