function pure_js_slideshow(options){
    /** ghost element to measure window viewport dimensions **/
    var me = this;
    //did the plugin inited???
    this.inited = false;
    //is the plugin animating the images???
    this.animating = false;
    //timeout handler to clearit in case of next previous clicks
    this.animate_timeout_handler = 0;
    //pause animation
    this.paused = false;

    //init function callback
    this.inited_callback = options.inited?options.inited:function(){}
    //animated function callback
    this.animated_callback = options.animated?options.animated:function(){}
    //thumb selected function callback
    this.thumb_callback = options.thumbSelected?options.thumbSelected:function(){}
    //page selected function callback
    this.page_callback = options.pageSelected?options.pageSelected:function(){}
    //navication callback
    this.navigation_callback = options.navigationSelected?options.navigationSelected:function(){}
    
    this.autoplay = typeof options.autoplay!=='undefined'?options.autoplay:true;

    this.mobile = options.mobile && typeof options.mobile.enabled!=='undefined'?options.mobile.enabled:false;
    
    /** position ghost div element with fixed to top, right, left and bottom and measure this element dimensions to find the window viewport**/
    this.ghost = document.getElementById('pure-js-slideshow-ghost');
    if(this.ghost==null){
        this.ghost = document.createElement('div');
        this.ghost.setAttribute('id','pure-js-slideshow-ghost');
        this.ghost.style.cssText = 'margin:0;padding:0;position:fixed;top:0px;left:0px;right:0px;bottom:0px;opacity:0;z-index:-1;-moz-opacity:0;-webkit-opacity:0;'
        document.body.appendChild(this.ghost);
    }
    this.drag_ghost = document.createElement('div');
    this.drag_ghost.style.cssText = 'position:absolute;top:0px;left:0px;right:0px;bottom:0px;';
    this.drag_ghost.setAttribute('class','pure-js-slideshow-drag');

    this.dragging= false;
    this.drag_callback = options.dragCallback?options.dragCallback:function(){};
    this.dragStartX = 0;
    this.dragDiff = 0;
    this.drag_autoplay = false;
    this.ondragstart = function(event){
        if(me.animating){
            event.preventDefault();
            return;
        }

        clearTimeout(me.animate_timeout_handler);
        //save the previous autoplay state
        me.drag_autoplay = me.autoplay;
        me.autoplay = false;
        

        me.dragging = true;
        me.dragStartX = event.touches && event.touches.length>0?event.touches[0].pageX:event.pageX;

        document.addEventListener('mouseup',me.ondragend)
        document.addEventListener('mousemove',me.ondragging);

        document.addEventListener('touchend',me.ondragend);
        document.addEventListener('touchmove',me.ondragging);

        if(me.animation=='fade'){
            for(var i in me.children){
                me.children[i].style.opacity = 1;
                if(i!=me.currentIndex){
                me.children[i].style.left=me.width+'px';
                }
            }
        }
    };
    this.ondragend = function(){
        me.dragging = false;
        var diff = me.dragDiff;
        
        function reset(){
            
            //reset to old previous behavior
            me.dragDiff = 0;
            //restore the old autoplay
            me.autoplay = me.drag_autoplay;
            if(me.animation=='fade'){
                for(var i in me.children){
                    me.children[i].style.left='0px';
                    if(i!=me.currentIndex){
                        me.children[i].style.opacity=0;
                    }
                }
            }

            if(me.autoplay){
                me.animate_timeout_handler = setTimeout(function(){me.animate(me.currentIndex);},me.timeout);
            }
        }//reset state function

        var should_reset = false;
        
        //if we dragged more than 25% of the content on either side than animate to next or previous content
        if(me.width/4<Math.abs(diff)){
            

            if(diff<0){
                var current_child = me.children[me.currentIndex];
                var nindex = me.currentIndex+1>=me.children_size?0:me.currentIndex+1;
                if(nindex>0){
                    
                    var next_child = me.children[nindex];
                   
                    var nnewleft = me.width + diff;
                    next_child.style.left = nnewleft+'px'; 

                    var c=0;
                    var done = function(){
                        c++;
                        if(c==2){
                            me.currentIndex = nindex;
                            me.selectPage(nindex);
                            me.selectThumb(nindex);
                            reset();
                        }
                    };

                    me.slideleft(current_child,me.transition,me.width,me.width*-1,done)
                    me.slideleft(next_child,me.transition,me.width,0,done)
                    
                }else{
                    current_child.style.left = '0px';
                    
                    should_reset=true;
                }
            }else{
                var current_child = me.children[me.currentIndex];
                var pindex = me.currentIndex-1<0?-1:me.currentIndex-1;
                if(pindex>=0){
                    var prev_child = me.children[pindex];

                    var left = 0;
                    prev_child.style.left = me.width*-1+diff+'px';
                    
                    var c=0;
                    var done = function(){
                        c++;
                        if(c==2){
                            me.currentIndex = pindex;
                            me.selectPage(pindex);
                            me.selectThumb(pindex);
                            reset();
                        }
                    };
                    me.slideright(current_child,me.transition,me.width,me.width,done)
                    me.slideright(prev_child,me.transition,me.width,0,done)
                    
                }else{
                    current_child.style.left='0px';
                    should_reset=true;
                }
            }
        }else{
            var current_child = me.children[me.currentIndex];
            if(diff<0){
                var nindex = me.currentIndex+1>=me.children_size?0:me.currentIndex+1;
                if(nindex>0){
                    var next_child = me.children[nindex];
                    next_child.style.left = me.width+'px';
                }
            }else{
                var pindex = me.currentIndex-1<0?-1:me.currentIndex-1;
                if(pindex>=0){
                    var prev_child = me.children[pindex];
                    prev_child.style.left = me.width*-1+'px';
                }
            }
            current_child.style.left='0px';
            should_reset=true;
        }

        if(should_reset){
            reset();
        }
        
        document.removeEventListener('mouseup',me.ondragend);
        document.removeEventListener('mousemove',me.ondragging)

        document.removeEventListener('touchend',me.ondragend);
        document.removeEventListener('touchmove',me.ondragging);
        
    }
    this.ondragging = function(event){
        if(me.dragging){
            
            var pagex = event.touches && event.touches.length>0?event.touches[0].pageX:event.pageX;
            var diff = ( pagex - me.dragStartX );
            me.dragDiff = diff;
            
            

            if(diff<0){
                
                var current_child = me.children[me.currentIndex];
                
                current_child.style.left =  diff +'px';

                var nindex = me.currentIndex+1>=me.children_size?0:me.currentIndex+1;
                if(nindex>0){
                    var next_child = me.children[nindex];
                   
                    var nnewleft = me.width + diff;
                    next_child.style.left = nnewleft+'px'; 

                    me.drag_callback(me, me.currentIndex, nindex);
                }else{
                    //do not make a drag
                    me.drag_callback(me, me.currentIndex);
                }
            }else{
                
                var current_child = me.children[me.currentIndex];
                current_child.style.left = diff+'px';

                var pindex = me.currentIndex-1<0?-1:me.currentIndex-1;
                if(pindex>=0){
                    var prev_child = me.children[pindex];
                    var pnewleft = me.width *-1 + diff;
                    prev_child.style.left = pnewleft+'px';

                    me.drag_callback(me, me.currentIndex, pindex);
                }else{
                    me.drag_callback(me, me.currentIndex);
                }
            }
        }
    }
    this.dragContent = typeof options.dragContent!=='undefined'?options.dragContent:true;
    if(this.dragContent){
        this.drag_ghost.addEventListener('mousedown',this.ondragstart);
        this.drag_ghost.addEventListener('touchstart',this.ondragstart);
        this.drag_ghost.addEventListener('click',function(){
          me.slide_clicked(me,me.currentIndex,me.children[me.currentIndex]);  
        })
    }
    

    this.prnt = typeof options.el=='string'?document.querySelector(options.el):options.el;
    this.prnt.style.position = 'relative';

    this.elem = this.prnt.querySelector('.pure-js-slideshow-container');
    this.elem.style.position = 'relative';
    this.elem.style.overflowX='hidden';
    this.elem.style.overflowY = 'hidden';

    


    this.children_list = this.elem.querySelectorAll('.pure-js-slideshow-content');
    this.children = [];
    this.images = [];
    this.image_thumbs = [];
    //transform the content node list to an array
    [].forEach.call(this.children_list,function(celem){
        me.children.push(celem);
    })
    this.children_size = this.children.length;

    this.previousContent = function(){
        if(!me.inited){
            return;
        }
        if(!me.animating){
            clearTimeout(me.animate_timeout_handler);
            
            var cindex = me.currentIndex;
            if(cindex-1<0){
                cindex=me.children_size-1;
            }else{
                cindex--;
            }
            
            me.animate(me.currentIndex,cindex);
            
        }
    };
    this.nextContent = function(){
        if(!me.inited){
            return;
        }
        if(!me.animating){
            clearTimeout(me.animate_timeout_handler);
            
            var cindex = me.currentIndex;
            if(cindex+1>=me.children_size){
                cindex = 0;
            }else{
                cindex++;
            }
            
            me.animate(me.currentIndex);
            
        }
    };
    this.moveTo = function(index){
        if(!me.inited){
            return;
        }
        if(!me.animating){
            clearTimeout(me.animate_timeout_handler);
            var cindex = index;
            me.animate(me.currentIndex, cindex);
        }
    }

    this.navigation = options.navigation && options.navigation.visible?options.navigation.visible:false;
    if(this.mobile && options.navigation &&  options.navigation.mobile && typeof options.navigation.mobile.visible!=='undefined'){
        this.navigation=options.navigation.mobile.visible;
    }
    this.navRadius = options.navigation && options.navigation.radius?options.navigation.radius:'0px';
    this.navBorderColor = options.navigation && options.navigation.borderColor?options.navigation.borderColor:'#fff';
    this.navBackgroundColor = options.navigation && options.navigation.backgroundColor?options.navigation.backgroundColor:'#fff';
    this.navArrowColor = options.navigation && options.navigation.arrowColor?options.navigation.arrowColor:'#fff';

    this.previous = null;
    this.next = null;
    this.renderNavigation = function(){
        me.previous = document.createElement('a');
        me.previous.onclick = function(){
            me.previousContent();
        }
        me.previous.style.cssText = 'position:absolute;top:45%;left:10px;z-index:'+(me.children_size+1)+';border:solid 1px '+me.navBorderColor+';padding:7px 14px;cursor:pointer;display:inline-block;background-color:'+me.navBackgroundColor+';border-radius:'+this.navRadius+';';
        var previousc = document.createElement('span');
        previousc.style.cssText = 'margin:0;padding:0;width:0px;height:0px;display:inline-block;border-top:7px solid transparent;border-bottom:7px solid transparent;border-right:9px solid '+me.navArrowColor+';margin-top:3px;';
        me.previous.appendChild(previousc);

        me.elem.appendChild(me.previous);
        me.next = document.createElement('a');
        me.next.onclick = function(){
            me.nextContent();
        }
        me.next.style.cssText = 'position:absolute;top:45%;right:10px;z-index:'+(me.children_size+1)+';border:solid 1px '+me.navBorderColor+';padding:7px 14px;cursor:pointer;display:inline-block;background-color:'+me.navBackgroundColor+';border-radius:'+this.navRadius+';';
        var nextc = document.createElement('span');
        nextc.style.cssText = 'margin:0;padding:0;width:0px;height:0px;display:inline-block;border-top:7px solid transparent;border-bottom:7px solid transparent;border-left:9px solid '+me.navArrowColor+';margin-top:3px;';
        me.next.appendChild(nextc);
        me.elem.appendChild(me.next);
    }
    if(this.navigation){
        this.renderNavigation();
    }

    this.pagination = options.pagination && options.pagination.visible?options.pagination.visible:false;
    if(this.mobile && options.pagination &&  options.pagination.mobile && typeof options.pagination.mobile.visible!=='undefined'){
        this.pagination=options.pagination.mobile.visible;
    }
    this.pageSize = options.pagination && options.pagination.size?options.pagination.size:10;

    this.page_clicked = function(event){
        var t = event.currentTarget;
        var index = t.getAttribute('data-index');
        me.moveTo(index);
    }
    this.renderPage = function(index){
        var pagea = document.createElement('span');
        pagea.style.cssText = 'border-radius:'+me.pageSize+'px;border:solid 1px #fff;width:'+me.pageSize+'px;height:'+me.pageSize+'px;display:inline-block;cursor:pointer;margin-left:2px;margin-right:2px;'
        pagea.setAttribute('data-index',index);
        pagea.onclick = function(){
            var cindex = parseInt(this.getAttribute('data-index'))
            
            me.moveTo(cindex)

            me.page_callback(me,cindex,me.images[cindex])
        }
        return pagea;
    };
    this.selectPage = function(index){
        if(me.paginationElem==null){
            return;
        }
        [].forEach.call(me.paginationElem.querySelectorAll('span'),function(el){
            el.style.backgroundColor='transparent';
        });

        me.paginationElem.querySelector('span:nth-child('+(index+1)+')').style.backgroundColor='#fff';
    }
    this.paginationElem = null;
    this.renderPagination = function(){
        var total = me.children_size;
        me.paginationElem = document.createElement('div');
        me.paginationElem.style.cssText = 'position:absolute;left:0px;bottom:10px;width:100%;text-align:center;z-index:'+(me.children_size+1)+';';
        for(var p=0;p<me.children_size;p++){
            var pagea = me.renderPage(p);
            me.paginationElem.appendChild(pagea);
        }
        me.elem.appendChild(me.paginationElem);
    }
    if(this.pagination){
        this.renderPagination();
        this.selectPage(0);
    }

    
    this.getWidth = function(){
        return parseFloat(getComputedStyle(me.ghost,null).width.replace('px',''));
    }
    this.getHeight = function(){
        return parseFloat(getComputedStyle(this.ghost,null).height.replace('px',''));
    }

    this.width = this.getWidth();
    this.maxheight = options.maxheight?options.maxheight:0;
    if(this.mobile && options.mobile && options.mobile.maxheight){
        this.maxheight= options.mobile.maxheight;
    }
    this.minheight = options.minheight?options.minheight:0;
    if(this.mobile && options.mobile && options.mobile.minheight){
        this.minheight = options.mobile.minheight;
    }
    this.height = this.getHeight();

    this.elem.style.width=this.width+'px';
    var heighttmp = this.height;
    if(this.maxheight>0){
        if(this.maxheight<heighttmp){
            heighttmp = this.maxheight;
        }
    }
    if(this.minheight>0){
        if(this.minheight>heighttmp){
            heighttmp = this.minheight;
        }
    }
    this.elem.style.height = heighttmp+'px';

    
    this.currentIndex = 0;
    this.animation = options.animation || 'fade';

    this.slide_callback = options.slideClicked?options.slideClicked:function(){}
    
    this.slide_clicked = function(){
        me.slide_callback(me, me.currentIndex, me.images[me.currentIndex])
    }
    this.setupBackground = function(content,src,tsrc){
        content.style.backgroundImage = 'url('+src+')';
        content.style.backgroundPosition = 'center';
        content.style.backgroundSize = 'cover';
        content.style.backgroundRepeat = 'no-repeat';
        content.onclick = me.slide_clicked;
        me.images.push(src);
        me.image_thumbs.push(tsrc);

    }//setup background image style attribute to div.pure-js-slideshow-content
    this.setupText = function(parent,child){
        var posv = child.getAttribute('data-pos-v') || 'middle';
        var posh = child.getAttribute('data-pos-h') || 'center';
        var card = document.createElement('div');
        card.style.cssText = 'display:table;height:100%;width:100%;';
        card.style.textAlign=posh;
        var cell = document.createElement('div');
        cell.style.cssText = 'display:table-cell;';
        cell.style.verticalAlign= posv;
        var text = document.createElement('div');
        text.style.cssText = 'position:relative;display:inline-block;z-index:'+me.children_size+1;
        text.innerHTML = child.innerHTML;
        cell.appendChild(text);
        card.appendChild(cell);
        parent.removeChild(child);
        parent.appendChild(card);
    }
    this.setupBackgrounds = function(){
        for(var i in me.children){
            var content = me.children[i];
            content.setAttribute('data-index',i);
            var img = content.querySelector('img:first-child');
            //remove image from the dom and set it as a background to the parent div
            content.removeChild(img);
            //me.images.push(img.src);
            var tsrc = img.getAttribute('data-thumb');
            if(tsrc==null){
                tsrc = content.getAttribute('data-thumb');
                if(tsrc==null){
                    tsrc = img.src;
                }
            }
            var text = content.querySelector('div:first-child');
            if(text!=null){
                me.setupText(content, text);
            }
            me.setupBackground(content,img.src,tsrc);
        }
    }
    this.setupBackgrounds();

    
    this.renderBackgrounds = function(){
        for(var i in me.children){
            var content = me.children[i];
            var heighttmp = me.height;
            if(me.maxheight>0){
                if(me.maxheight<heighttmp){
                    heighttmp = me.maxheight;
                }
            }
            if(me.minheight>0){
                if(me.minheight>heighttmp){
                    heighttmp = me.minheight;
                }
            }
            content.style.height = heighttmp+'px';
            content.style.width= me.width+'px';
            content.style.position='absolute';
            content.style.top='0px';
            if(me.animation=='slide'){
                if(i==me.currentIndex){
                    content.style.left='0px';
                }else{
                    content.style.left = me.width+'px';
                }
            }else if(me.animation=='fade'){
                content.style.left='0px';
            }
            
        }
    };
    this.renderBackgrounds();
    this.resizeBackgrounds = function(){
        for(var i in me.children){
            var content = me.children[i];
            var heighttmp = me.height;
            if(me.maxheight>0){
                if(me.maxheight<heighttmp){
                    heighttmp = me.maxheight;
                }
            }
            if(me.minheight>0){
                if(me.minheight>heighttmp){
                    heighttmp = me.minheight;
                }
            }
            content.style.height = heighttmp+'px';
            content.style.width= me.width+'px';
            if(me.animation=='slide'){
                if(i==me.currentIndex){
                    content.style.left='0px';
                }else{
                    content.style.left = me.width+'px';
                }
            }else if(me.animation=='fade'){
                content.style.left='0px';
            }
        }
    }//resizeBackgrounds (div.pure-js-slideshow-content)

    this.thumbnails = options.thumbnails && options.thumbnails.visible?options.thumbnails.visible:false;
    if(this.mobile && options.thumbnails &&  options.thumbnails.mobile && typeof options.thumbnails.mobile.visible!=='undefined'){
        this.thumbnails=options.thumbnails.mobile.visible;
    }

    this.thumbsBorderColor = options.thumbnails && options.thumbnails.borderColor?options.thumbnails.borderColor:'#fff';
    this.thumbsSelBorderColor = options.thumbnails && options.thumbnails.selectedBorderColor?options.thumbnails.selectedBorderColor:'#000';
    this.thumbWidth = options.thumbnails && options.thumbnails.width?parseInt(options.thumbnails.width):80;
    this.thumbHeight = options.thumbnails && options.thumbnails.height?parseInt(options.thumbnails.height):70;
    this.thumbElem = null;
    this.thumbTbl = null;
    this.moveThumbs = function(direction,fromIndex,toIndex){
        if(!me.animating){
            
            if(direction=='left' && fromIndex!=toIndex){
                
                var twidth = me.width;
                var fromX = parseInt(this.thumbTbl.style.left);
                var distance = (toIndex-fromIndex) * me.thumbWidth;
                
                var toX = (Math.abs(fromX) + distance) *-1;
                
                var diff = me.thumbTbl.offsetWidth-me.width;
                if(diff>0 && Math.abs(toX)>diff){
                    toX = diff*-1;
                }
                
                me.slideleft(me.thumbTbl,me.transition,distance,(toX),function(){})
            }else if(direction=='right' && fromIndex!=toIndex){
                var twidth = me.width;
                var fromX = parseInt(this.thumbTbl.style.left);
               
                var distance = (fromIndex-toIndex) * me.thumbWidth;
                
                var toX = (fromX + distance);
                
                if(toX>0){
                    toX = 0;
                }
                
                me.slideright(me.thumbTbl,me.transition,distance,(toX),function(){})
            }
        }
    }
    this.slideleft = function(el,time,distance,toX,done){
        var last = +new Date();
        
        var pixel = parseFloat(distance/parseFloat((time/20)));
        
        function tick(){
            
            var left = parseFloat(el.style.left.replace('px',''));
            el.style.left = left-pixel+'px';
            last = +new Date();
            

            if ( parseFloat(el.style.left.replace('px','')) > toX) {
           // (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 20);
                setTimeout(tick,20);
            }else{
                el.style.left = toX  +'px';
                done();
            }
        }
        tick();
    }
    this.slideright = function(el,time,distance,toX,done){
        var last = +new Date();
        
        var pixel = parseFloat(distance/parseFloat((time/20)));

        function tick(){
            
        
            var left = parseFloat(el.style.left.replace('px',''));
            el.style.left = left+pixel+'px';
        
            last = +new Date();
        
            if ( (parseFloat(el.style.left.replace('px',''))) < toX) {
           // (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
           setTimeout(tick,20);
            }else{
                el.style.left = toX +'px';
                done();
            }
        }
        tick();
    }
    //cindex=currentIndex, pindex==previousIndex
    this.selectThumb = function(cindex,pindex){
        if(me.thumbElem==null){
            return;
        }
        [].forEach.call(me.thumbElem.querySelectorAll('div'),function(el){
            el.style.border='solid 1px '+me.thumbsBorderColor;
        })
        var t = me.thumbElem.querySelector("div[data-index='"+cindex+"']")
        var left = parseInt(t.getAttribute('data-x'));
        var twidth = me.width;
        var tblwidth = me.thumbTbl.offsetWidth;
        var smove = false;
        if(twidth<tblwidth){
            smove = true;
        }

        if(smove){
            if(pindex<cindex){
                me.moveThumbs('left',pindex,cindex)
            }else{
                me.moveThumbs('right',pindex,cindex);
            }
        }
        t.style.borderStyle='solid';
        t.style.borderColor=me.thumbsSelBorderColor;
        t.style.borderWidth = '2px';
    }
    this.renderThumb = function(index,src){
        var cell = document.createElement('td');
        cell.setAttribute('cellpadding',0);
        cell.setAttribute('cellspacing',0);
        cell.setAttribute('data-x',index*me.thumbWidth)
        cell.style.cssText = 'border-width:1px;padding:0;margin:0;border-spacing:0;border-spacing:0;box-sizing:border-box;'
        var tdhtml = '<div data-index="'+index+'" style="cursor:pointer;background-image:url('+src+');background-position:center;background-size:cover;background-repeat:no-repeat;width:'+me.thumbWidth+'px;height:'+me.thumbHeight+'px;border:solid 1px '+me.thumbsBorderColor+';box-sizing:border-box;"></div>';
        cell.innerHTML = tdhtml;
        cell.onclick = function(){
            var cindex = parseInt(this.firstChild.getAttribute('data-index'));
            me.moveTo(cindex);
            me.thumb_callback(me,cindex,me.images[cindex])
        };
        return cell;
    }
    this.renderThumbs = function(){
        me.thumbElem = document.createElement('div');
        var visible = me.thumbnails?'block':'none';
        me.thumbElem.style.cssText = 'position:relative;width:100%;overflow-x:hidden;height:'+me.thumbHeight+'px;display:'+visible+';';
        me.thumbTbl = document.createElement('table');
        me.thumbTbl.style.cssText = 'position:absolute;top:0px;left:0px;border-style:none;padding:0;margin:0;border-width:0px;border-spacing:0;';
        var row = document.createElement('tr');
        me.thumbTbl.appendChild(row);
        for(var i in me.image_thumbs){
            
            var imgs = me.image_thumbs[i];
            var cell = me.renderThumb(i,imgs)
            row.appendChild(cell);
        }
        me.thumbElem.appendChild(me.thumbTbl);
        me.prnt.appendChild(me.thumbElem);
    }
    
    this.renderThumbs();
    this.selectThumb(0,0);

    this.resize_timeout = 0;
    this.onresized = function(){
        if(me.thumbnails){
            var mewidth = me.width;
            var twidth = me.thumbTbl.offsetWidth;
            if(me.width>twidth){
                me.thumbTbl.style.left = '0px';
            }
        }
    };
    window.addEventListener('resize',function(){
        me.width = me.getWidth();
        me.height = me.getHeight();
        me.elem.style.width = me.width+'px';
        var heighttmp = me.height;
        if(me.maxheight>0){
            if(me.maxheight<heighttmp){
                heighttmp = me.maxheight;
            }
        }
        if(me.minheight>0){
            if(me.minheight>heighttmp){
                heighttmp = me.minheight;
            }
        }
        me.elem.style.height = heighttmp+'px';
        me.resizeBackgrounds();
        clearTimeout(me.resize_timeout);
        setTimeout(function(){
            me.onresized();
        },100);
    })

    this.fadeIn = function(el, time, done) {
        el.style.opacity = 0;

        var last = +new Date();
        var tick = function() {
            
            el.style.opacity = +el.style.opacity + (new Date() - last) / time;
            last = +new Date();

            if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }else{
                el.style.opacity = 1;
                done();
            }
        
        };

        tick();
    }
    this.fadeOut = function(el, time, done){
        
        el.style.opacity = 1;

        var last = +new Date();
        var tick = function() {
            
            el.style.opacity = el.style.opacity -  (new Date() - last) / time;
            last = +new Date();

            if (parseFloat(el.style.opacity) > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }else{
                el.style.opacity = 0;
                done();
            }
        
        };

        tick();
    
    }
    this.loadImage = function(src,index,done){
        var img = new Image();
        img.onload = function(){
            
            var w = img.width;
            var h = img.height;
            var direction = 'horizontal';
            if(h>w){
                direction = 'vertical';
            }
            var content = me.children[index];
            content.setAttribute('data-img-dir',direction);
            content.setAttribute('data-img-width',w);
            content.setAttribute('data-img-height',h);
            if(index<2)done();
        }
        img.onerror = function(){
            if(index<2)done();
        }
        img.src = src;
    }
    this.loadImages = function(images){
        var total = images.length;
        
        var counter = 0;
        function images_loaded(){
            counter++;
            //after the first 2 images are loaded or at least the total (could be zero or 1) then start the animation
            if(counter==2 || counter==total){
                
                me.inited = true;//plugin inited
                
                me.inited_callback(me,me.currentIndex);

                if(me.autoplay){
                    me.animate_timeout_handler = setTimeout(function(){
                        me.animate(me.currentIndex);//start the animation one the first 2 images are loaded
                    },me.timeout);
                }
            }
        }
        for(var m in images){
            
            me.loadImage(images[m],m,images_loaded)
            
        }
    }
    
    
    if(this.animation=='fade'){
        //fix the z-indexes
        for(var i in me.children){
            var content = me.children[i];
            content.style.zIndex = me.children-i;
            content.style.left = '0px';
            if(i>0){
                content.style.opacity=0;
            }
        }
    }
    this.timeout = options.timeout?options.timeout:(this.prnt.getAttribute('data-timeout')!=null?parseInt(this.prnt.getAttribute('data-timeout')):2500);
    this.transition = options.transition?options.transition:(this.prnt.getAttribute('data-transition')!=null?parseInt(this.prnt.getAttribute('data-transition')):500);
    
    this.syncs = 0;
    this.synced = function(done){
        this.syncs++;
        if(this.syncs==2){
            this.syncs = 0;
            me.animating = false;
            done();
        }
    }
    this.animate = function(currentIndex,toIndex){

        me.currentIndex = currentIndex;
        
        var cindex = currentIndex;
        var nindex = cindex+1>=me.children_size?0:cindex+1;


        if(typeof toIndex!=='undefined' && toIndex!=currentIndex){
            nindex = toIndex;
        }else if(typeof toIndex!=='undefined' && toIndex==currentIndex){
            
            return;
        }
        var current_child = me.children[cindex];
        var next_child = me.children[nindex];

        if(me.animation=='fade'){
            current_child.style.opacity = 1;
            next_child.style.opacity = 0;
        }else if(me.animation=='slide'){
            current_child.style.left = '0px';
            //we need to check if its programmatically or it is from user interaction
            if(nindex<cindex){
                //it will slide on the right
                next_child.style.left = me.width * -1 +'px';
            }else{
                //it will slide on the left
                next_child.style.left = me.width +'px';
            }
        }

        me.selectPage(nindex);
        me.selectThumb(nindex,cindex);//give also the previous index

        //swap indexes like in sorting algorithm
        var czindex = current_child.style.zIndex;
        var nzindex = next_child.style.zIndex;
        current_child.style.zIndex = nzindex;
        next_child.style.zIndex = czindex;

        me.animating = true;

        if(me.animation=='fade'){
            me.fadeOut(current_child, me.transition, function(){
                
                me.synced(function(){
                    me.currentIndex = nindex;
                    
                    me.animated_callback(me,nindex)
                    if(me.autoplay){
                        me.animate_timeout_handler = setTimeout(function(){
                            me.animate(nindex);
                        },me.timeout);
                    }
                })
            })
            me.fadeIn(next_child, me.transition, function(){
                
                me.synced(function(){
                    me.currentIndex = nindex;
                    
                    me.animated_callback(me,nindex);
                    if(me.autoplay){
                        me.animate_timeout_handler = setTimeout(function(){
                            me.animate(nindex);
                        },me.timeout);
                    }
                })
            })
        }else if(me.animation=='slide'){
            if(nindex<cindex){
                var distance = me.width;
                me.slideright(next_child,me.transition,distance,0,function(){
                    me.synced(function(){
                        me.currentIndex = nindex;
                        
                        me.animated_callback(me,nindex)
                        if(me.autoplay){
                            me.animate_timeout_handler = setTimeout(function(){
                                me.animate(nindex);
                            },me.timeout);
                        }
                    })
                })
                me.slideright(current_child,me.transition,distance, me.width,function(){
                    me.synced(function(){
                        me.currentIndex = nindex;
                        
                        me.animated_callback(me,nindex);
                        if(me.autoplay){
                            me.animate_timeout_handler = setTimeout(function(){
                                me.animate(nindex);
                            },me.timeout);
                        }
                    })
                })
            }else if(nindex>cindex){
                //the normal one
                var distance = me.width;
                me.slideleft(next_child,me.transition,distance,0,function(){
                    me.synced(function(){
                        me.currentIndex = nindex;
                        
                        me.animated_callback(me,nindex)
                        if(me.autoplay){
                            me.animate_timeout_handler = setTimeout(function(){
                                me.animate(nindex);
                            },me.timeout);
                        }
                    })
                })
                me.slideleft(current_child,me.transition,distance, me.width*-1,function(){
                    me.synced(function(){
                        me.currentIndex = nindex;
                        
                        me.animated_callback(me,nindex);
                        if(me.autoplay){
                            me.animate_timeout_handler = setTimeout(function(){
                                me.animate(nindex);
                            },me.timeout);
                        }
                    })
                })
            }
        }
        
    }//this.animate
    this.loadImages(this.images);
    this.drag_ghost.style.zIndex = this.images.length;
    this.elem.appendChild(this.drag_ghost);
    return this;
}
pure_js_slideshow.prototype.thumbsVisible = function(visible){
    if(visible){
        this.thumbElem.style.display='block';
    }else{
        this.thumbElem.style.display='none';
    }
}
pure_js_slideshow.prototype.getCurrentIndex = function(){
    return this.currentIndex;
}
pure_js_slideshow.prototype.totalChildren = function(){
    return this.children.length;
}
pure_js_slideshow.prototype.appendImage = function(src){
    var div = document.createElement('div')
    this.loadImage(src,function(){
        div.style.setAttribute('class','pure-js-slideshow-content');
        me.setupBackground(div,src);
        me.children.push(div);
        me.children_size+=1;
    })
}
pure_js_slideshow.prototype.previousSlide = function(){
    this.previousContent();
}
pure_js_slideshow.prototype.nextSlide = function(){
    this.nextContent();
}
pure_js_slideshow.prototype.firstSlide = function(){
    this.moveTo(0);
}
pure_js_slideshow.prototype.lastSlide = function(){
    this.moveTo(this.children_size-1);
}
pure_js_slideshow.prototype.autoPlay = function(play){
    this.autoplay = play
    if(play){
        this.animate(this.currentIndex);
    }else{
        clearTimeout(this.animate_timeout_handler);
    }
}
pure_js_slideshow.prototype.getImages = function(){
    return this.images;
}
pure_js_slideshow.prototype.getContents = function(){
    return this.children;
}
