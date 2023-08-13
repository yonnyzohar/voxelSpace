class BitmapData{

    fromImage(img)
    {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Read the pixel data
        this.imageData = ctx.getImageData(0, 0, img.width, img.height);
        this.data = this.imageData.data;
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = img.width;
        this.height = img.height;

    }


    blank(width, height, bgColor)
    {
        this.bgColor = bgColor;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        
        // Manipulate pixel data
        this.imageData = this.ctx.createImageData(width, height);
        this.data = this.imageData.data;

        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    getCanvas()
    {
        return this.canvas;
    }

    setPixel(col, row, r, g, b, a) {
        var numCols = this.imageData.width;
        const index = (parseInt(col) + parseInt(row) * numCols) * 4; // 4 channels (RGBA)
        this.data[index] = r;
        this.data[index + 1] = g;
        this.data[index + 2] = b;
        this.data[index + 3] = a;
    }

    getPixel(row, col, pixelObj, wrapAround)
    {
        var numCols = this.imageData.width;
        var numRows = this.imageData.height;
        if(wrapAround)
        {
            while(col < 0)
            {
                col += numCols;
            }
            while(col > numCols)
            {
                col -= numCols;
            }
            while(row < 0)
            {
                row += numRows;
            }
            while(row > numRows)
            {
                row -= numRows;
            }
        }
        

        const index = (parseInt(col) + parseInt(row) * numCols) * 4;
        pixelObj.r = this.data[index];
        pixelObj.g = this.data[index + 1];
        pixelObj.b = this.data[index + 2];
        pixelObj.a = this.data[index + 3];
    }

    clear()
    {
        for(var i = 0; i < this.canvas.width; i++)
        {
            for(var j = 0; j < this.canvas.height; j++)
            {
                this.setPixel(i,j, 0,0,0,255);
            }
        }
    }

    render()
    {
        // Put the modified pixel data onto the canvas
        this.ctx.putImageData(this.imageData, 0, 0);
    }
}


class MyGame extends Main {
    constructor() {
        super();
        this.inputHandler = InputHandler.getInstance();
        var app = this.app;
        var bitmapData = new BitmapData();
        bitmapData.blank(app.view.width, app.view.height, app.renderer.backgroundColor);
        this.bitmapData = bitmapData;

        // Create a Sprite to display the RenderTexture
        const textureSprite = new PIXI.Sprite();
        this.textureSprite = textureSprite;
        this.textureSprite.texture = PIXI.Texture.from(this.bitmapData.getCanvas());

        app.stage.addChild(textureSprite);

        this.x = 0;
        this.y = 0;
        this.heightFactor = 100;
        this.farPlane = 290;
        this.nearPlane = 50;
        this.turnSpeed = 2;
        this.moveSpeed = 1;

        this.player = new Player(50, 50);
        
        var img1 = new Image();
        var img = new Image();
        const handleImageLoad1 = () => {
            img.src = '../C1W.png';//C1W//D1
            img.onload = handleImageLoad;
            var depthMapData = new BitmapData();
            depthMapData.fromImage(img1);
            this.depthMapData = depthMapData;
        }
        
        img1.src = '../D1.png';//C1W//D1
        img1.onload = handleImageLoad1;
        

        const handleImageLoad = () => {
            var bitmapData2 = new BitmapData();
            bitmapData2.fromImage(img);
            this.bitmapData2 = bitmapData2;
        }

        this.easings = [this.easeOutQuint,this.easeOutQuad,this.easeOutCubic, this.easeOutQuart];
        this.currFncIndex = 0;
        this.switchTime = 5;
        this.currTime = 0;
        // Set the image source
        
       /* */

    }


    update(dt) {


             


        document.getElementById('height').innerText = "height " + this.heightFactor;
        document.getElementById('near').innerText = "near " + this.nearPlane;
        document.getElementById('far').innerText = "far " + this.farPlane;
        

        this.bitmapData.clear();
        
        if(this.bitmapData2)
        {
            var p = this.player;
            //this.floorCast(p.leftRad, p.rightRad, p.x, p.y,this.bitmapData2,this.bitmapData, this.nearPlane,this.farPlane);

            /**/
            var w = this.bitmapData2.width;
            var h = this.bitmapData2.height;
            var pixelObj = {r:0, g:0, b:0, a:0};
            for(var i = 0; i < w; i++)
            {
                for(var j = 0; j < h; j++)
                {
                    this.bitmapData2.getPixel(i,j, pixelObj);
                    this.bitmapData.setPixel(i,j, pixelObj.r, pixelObj.g, pixelObj.b,pixelObj.a);
                }
            }
            
            this.drawSightRange(p);            
            

            var keys = this.inputHandler.keys;
            if (keys['ArrowLeft']) {
                p.setAngle(p.getAngle() - this.turnSpeed);
              }
              if (keys['ArrowRight']) {
                p.setAngle(p.getAngle() + this.turnSpeed);
              }
              if (keys['ArrowUp']) {
                p.advance(this.moveSpeed);
              }
              if (keys['ArrowDown']) {
                p.advance(-this.moveSpeed);
              }
              if(keys['w'])
              {
                this.heightFactor+=this.moveSpeed;
              }
              if(keys['s'])
              {
                this.heightFactor-=this.moveSpeed;
              }
              if(keys['e'])
              {
                this.farPlane-=this.moveSpeed;
              }
              if(keys['r'])
              {
                this.farPlane+=this.moveSpeed;
              }
              if(keys['d'])
              {
                this.nearPlane-=this.moveSpeed;
              }
              if(keys['f'])
              {
                this.nearPlane+=this.moveSpeed;
              }


              if(keys['q'])
              {
                this.currFncIndex++;
                if(this.currFncIndex >= this.easings.length)
                {
                    this.currFncIndex = 0;
                }
              }

              this.fixPoint(p);

              

            
            //print(p.angleRad);
            
        }

  
    }

    fixPoint(p)
        {
            var w = this.bitmapData2.width;
            var h = this.bitmapData2.height;
            if(p.y < 0)
            {
              p.y = h;
            }

            if(p.y > h)
            {
              p.y = 0;
            }

            if(p.x < 0)
            {
              p.x = w;
            }

            if(p.x > w)
            {
              p.x = 0;
            }
        }

    drawSightRange(p)
    {
        var currPoint = {x:p.x, y:p.y};
        var cos = Math.cos(p.leftRad) * this.nearPlane;
        var sin = Math.sin(p.leftRad) * this.nearPlane;
        var startLeftPoint = {x : p.x, y : p.y};
        startLeftPoint.x += cos;
        startLeftPoint.y += sin;

        var endLeftPoint = {x : p.x, y : p.y};
        cos = Math.cos(p.leftRad) * this.farPlane;
        sin = Math.sin(p.leftRad) * this.farPlane;
        endLeftPoint.x += cos;
        endLeftPoint.y += sin;

        var startRightPoint = {x : p.x, y : p.y};
        cos = Math.cos(p.rightRad) * this.nearPlane;
        sin = Math.sin(p.rightRad) * this.nearPlane;
        startRightPoint.x += cos;
        startRightPoint.y += sin;

        var endRightPoint = {x : p.x, y : p.y};
        cos = Math.cos(p.rightRad) * this.farPlane;
        sin = Math.sin(p.rightRad) * this.farPlane;
        endRightPoint.x += cos;
        endRightPoint.y += sin;
        /**/
        this.bitmapData.setPixel(p.x , p.y , 255,0,0,255); 

        var leftDist = Math.abs(Util.distanceTwoPoints(endLeftPoint.x, startLeftPoint.x,endLeftPoint.y,startLeftPoint.y ));
        cos = Math.cos(p.leftRad);
        sin = Math.sin(p.leftRad);
        
        for(var i = 0; i < leftDist; i++)
        {
            currPoint.x = startLeftPoint.x + (cos*i);
            currPoint.y = startLeftPoint.y + (sin*i);
            this.fixPoint(currPoint);
            this.bitmapData.setPixel(currPoint.x , currPoint.y , 255,0,0,255); 
        }

        var topDist = Math.abs(Util.distanceTwoPoints(endRightPoint.x, endLeftPoint.x, endRightPoint.y, endLeftPoint.y));
        var radAngle = Util.getAngle(endRightPoint.x,endRightPoint.y,endLeftPoint.x, endLeftPoint.y );
        cos = Math.cos(radAngle);
        sin = Math.sin(radAngle);
        for(var i = 0; i < topDist; i++)
        {
            currPoint.x = endLeftPoint.x + (cos*i);
            currPoint.y = endLeftPoint.y + (sin*i);
            this.fixPoint(currPoint);
            this.bitmapData.setPixel(currPoint.x, currPoint.y, 255,0,0,255); 
        }
        
        var rightDist = Math.abs(Util.distanceTwoPoints(endRightPoint.x, startRightPoint.x, endRightPoint.y, startRightPoint.y));
        cos = Math.cos(p.rightRad);
        sin = Math.sin(p.rightRad);
        for(var i = 0; i < rightDist; i++)
        {
            currPoint.x = startRightPoint.x + (cos*i);
            currPoint.y = startRightPoint.y + (sin*i);
            this.fixPoint(currPoint);
            this.bitmapData.setPixel(currPoint.x, currPoint.y , 255,0,0,255); 
        }
        
        
        
        var btmDist = Math.abs(Util.distanceTwoPoints(startRightPoint.x, startLeftPoint.x, startRightPoint.y, startLeftPoint.y));
        cos = Math.cos(radAngle);
        sin = Math.sin(radAngle);
        for(var i = 0; i < btmDist; i++)
        {
            currPoint.x = startLeftPoint.x + (cos*i);
            currPoint.y = startLeftPoint.y + (sin*i);
            this.fixPoint(currPoint);
            this.bitmapData.setPixel(currPoint.x , currPoint.y , 255,0,0,255); 
        }
        

        this.drawImage({
            topLeft : endLeftPoint,
            topRight : endRightPoint,
            btmLeft : startLeftPoint,
            btmRight : startRightPoint
        },
        this.bitmapData2,this.bitmapData
        );
    }

    render() {
        super.render();
        this.bitmapData.render();
        this.textureSprite.texture.update();
    }

    drawImage(o, srcBD, targetBD) {
        var app = this.app;
        var windowH = app.view.height;
        var windowW = app.view.width;
        var halfBd = parseFloat(windowH / 2) * 1.5;
    
        var p1 = o.topLeft;
        var p2 = o.topRight;
        var p3 = o.btmLeft;
        var p4 = o.btmRight;
    
        var leftLen = Util.distanceTwoPoints(p1.x, p3.x, p1.y, p3.y);
        var rightLen = Util.distanceTwoPoints(p2.x, p4.x, p2.y, p4.y);
    
        var startRowsAngle;
        var startRowsLen;
        var fromPStart;
        var fromPEnd;
    
        var endRowsAngle;
        var endRowsLen;
        var toPStart;
        var toPEnd;
    
        startRowsLen = leftLen;
        endRowsLen = rightLen;
        fromPStart = p1;
        fromPEnd = p3;
        toPStart = p2;
        toPEnd = p4;
    
        startRowsAngle = Util.getAngle(fromPEnd.x, fromPEnd.y, fromPStart.x, fromPStart.y);
        endRowsAngle = Util.getAngle(toPEnd.x, toPEnd.y, toPStart.x, toPStart.y);
    
        var prevHeights = [];
        var depthBuffer = [];
        for (var row = halfBd; row >= 0; row--) {
            var rowPer = row / halfBd;
            rowPer = this.easings[this.currFncIndex](rowPer, 0,1,1);

            var currStartX = this.lerp(fromPStart.x, fromPEnd.x, rowPer);
            var currStartY = this.lerp(fromPStart.y, fromPEnd.y, rowPer);
            var currEndX = this.lerp(toPStart.x, toPEnd.x, rowPer);
            var currEndY = this.lerp(toPStart.y, toPEnd.y, rowPer);
    
            var rowDist = Math.abs(Util.distanceTwoPoints(currStartX, currEndX, currStartY, currEndY));
            var slopeStartToEndAngle = Util.getAngle(currEndX, currEndY, currStartX, currStartY);
            var COS = Math.cos(slopeStartToEndAngle);
            var SIN = Math.sin(slopeStartToEndAngle);
            var COS_dist = COS * rowDist;
            var SIN_dist = SIN * rowDist;
    
            for (var col = 0; col < targetBD.width; col++) {
                var colPer = col / windowW;
                var currColX = COS_dist * colPer + currStartX;
                var currColY = SIN_dist * colPer + currStartY;
                
                var pixel = { r: 0, g: 0, b: 0, a: 0 };
                srcBD.getPixel(currColX, currColY, pixel, true);
                
                var depthPixel = { r: 0, g: 0, b: 0, a: 0 };
                this.depthMapData.getPixel(currColX, currColY, depthPixel, true);
    
                var heightPer = (depthPixel.r / 255);
                heightPer = (heightPer + 1) / 2 * this.heightFactor;
    
                var __x = parseInt(col);
                var __y = parseInt(row + halfBd - (heightPer) + this.nearPlane);//

                
                if(__y < windowH && __x > 0 && __x < windowW)
                {
                    if(!prevHeights[__x])
                    {
                        prevHeights[__x] = windowH;
                    }
                    

                    for(var h = __y; h < prevHeights[__x]; h++)
                    {
                        if(!depthBuffer[h])
                        {
                            depthBuffer[h] = [];
                        }

                        if(!depthBuffer[h][__x])
                        {
                            depthBuffer[h][__x] = true;
                            targetBD.setPixel(__x, h, pixel.r, pixel.g, pixel.b, parseInt(rowPer * 500));
                        }

                        
                    }

                    prevHeights[__x] = __y;
                }
                /**/

                //targetBD.setPixel(__x, __y, pixel.r, pixel.g, pixel.b, pixel.a);
            }
        }
    }
    
    
    lerp(start, end, t) {
        return start + (end - start) * t;
    }

    //easings

    
    easeInQuad(t, b, c, d) {
        t /= d;
        return c * t * t + b;
    }
    

    easeOutQuint(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t * t * t * t * t + 1) + b;
    }

    easeOutQuad(t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
    }

    easeOutCubic(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    }

    easeOutQuart(t, b, c, d) {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    }
    
    
}
