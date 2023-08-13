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
        this.farPlane = 20;
        this.nearPlane = 5;
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

            /*
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
            */
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
        /*
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
        */

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

    floorCast(leftRay, rightRay, playerX, playerY, srcBD , targetBD, nearPlane, farPlane) {

        var app = this.app;
        var windowH = app.view.height + farPlane;
        var windowW = app.view.width;

        var prevHeights = [];

        //print(windowH);
        //print(windowW);

        var leftRaySin = Math.sin(leftRay);
        var leftRayCos = Math.cos(leftRay);

        var rightRaySin = Math.sin(rightRay);
        var rightRayCos = Math.cos(rightRay);

        //far topleft
        var currentFarX1 = playerX + leftRayCos * farPlane;
        var currentFarY1 = playerY + leftRaySin * farPlane;

        //far top right
        var currentFarX2 = playerX + rightRayCos * farPlane;
        var currentFarY2 = playerY + rightRaySin * farPlane;

        //near bottom left
        var currentNearX1 = playerX + leftRayCos * nearPlane;
        var currentNearY1 = playerY + leftRaySin * nearPlane;

        //near bottom right
        var currentNearX2 = playerX + rightRayCos * nearPlane;
        var currentNearY2 = playerY + rightRaySin * nearPlane;

        var pixel = {r:0, g:0, b:0, a:0};
        var depthPixel = {r:0, g:0, b:0, a:0};
        //go from btm to top
        for (var _y = (windowH / 2); _y >= 0; _y--) {

            //get percentage of descent
            var sampleDepth = _y / (windowH/2);

            //print("_y " + _y + " sampleDepth " + sampleDepth);

            //get start x and y pixel at this percentage
            var startX = (currentFarX1 - currentNearX1) / sampleDepth + currentNearX1;
            var startY = (currentFarY1 - currentNearY1) / sampleDepth + currentNearY1;

            var endX = (currentFarX2 - currentNearX2) / sampleDepth + currentNearX2;
            var endY = (currentFarY2 - currentNearY2) / sampleDepth + currentNearY2;
            
            //new find e percantage
            for (var _x = 0; _x < windowW; _x++) {
                //get percentage of width
                var sampleWidth = (_x) / (windowW);
                var currX = (endX - startX) * sampleWidth + startX;
                var currY = (endY - startY) * sampleWidth + startY;
                //print(" _x " + _x + " sampleWidth " + sampleWidth);

                if (isNaN(currX)) {
                    currX = 0;
                }
                if (isNaN(currY)) {
                    currY = 0;
                }

                //wrap around

                //instead of getting the pixel from a large bitmapData, i can get it from the map
                srcBD.getPixel(currX, currY, pixel,true);
                this.depthMapData.getPixel(currX, currY, depthPixel, true);

                var heightPer = (depthPixel.r / 255);
                //make percentage between -1 and 1
                heightPer += 1;
                heightPer /= 2;
                heightPer *= this.heightFactor;

                ////////////////////////////////////////////////////////
                var __x = parseInt(_x);
                var __y = parseInt(_y + (windowH / 2) - (heightPer * sampleDepth));//

                if(__y < windowH && __x > 0 && __x < windowW)
                {

                    if(!prevHeights[__x])
                    {
                        prevHeights[__x] = windowH;
                    }
                    
                    //targetBD.setPixel(__x, __y, pixel.r, pixel.g, pixel.b, pixel.a);

                    for(var h = __y; h < prevHeights[__x]; h++)
                    {
                        var d = Math.min((255*sampleDepth)*1.1, 255);
                        targetBD.setPixel(__x, h, pixel.r, pixel.g, pixel.b, d);
                    }

                    prevHeights[__x] = __y;

                }
                //print("__x " + __x + "__y " + __y);
                

                //pixel = ceilBD.getPixel(currX, currY);
                //pixel = ceilTile.getPixel(realX / Model.TILE_SIZE, realY / Model.TILE_SIZE);

                //bmd.setPixel(_x, (Model.windowH / 2) - _y, pixel);
            }
        }

    }

     drawImage(o,srcBD , targetBD) {

        var app = this.app;
        var windowH = app.view.height;
        var windowW = app.view.width;
        var halfBd = windowH /2;
        halfBd -= this.farPlane;

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



        startRowsLen = (leftLen);
        endRowsLen = (rightLen);
        fromPStart = p1;
        fromPEnd = p3;
        toPStart = p2;
        toPEnd = p4;


        startRowsAngle = Util.getAngle(fromPEnd.x, fromPEnd.y, fromPStart.x, fromPStart.y);
        endRowsAngle = Util.getAngle(toPEnd.x, toPEnd.y, toPStart.x, toPStart.y);

        var startRowCos = -1;
        var startRowSin = -1;
        var startrowSinDist;
        var startrowCosDist;

        var endRowCos = -1;
        var endRowSin = -1;
        var endrowSinDist;
        var endrowCosDist;
        
        
       
        var pixel = {r:0, g:0, b:0, a:0};
        var depthPixel = {r:0, g:0, b:0, a:0};
        var prevHeights = [];
        var depthBuffer = [];
        for (var row = targetBD.height; row  >= halfBd; row--) {
            //looks best but does not make sense!
            var rowPer = 1 - (targetBD.height / row);
            //naive and looks like shit
            //var rowPer =  ( ((row - halfBd)/2) / halfBd);
            //this makes most sense
            
            //print(rowPer);

            //we are getting an angle from the far to the near, not near to far. hence 0 percent is exactly on FAR
            if (startRowCos == -1) {
                startRowCos = Math.cos(startRowsAngle);
                startRowSin = Math.sin(startRowsAngle);
                startrowSinDist = (startRowSin * startRowsLen);
                startrowCosDist = (startRowCos * startRowsLen);
            }

            //rows in the trapeze start at the distance and move towards the player
            var currStartX = parseInt(startrowCosDist * rowPer);
            var currStartY = parseInt(startrowSinDist * rowPer);
            //add the offset of the start pixel
            currStartX += fromPStart.x;
            currStartY += fromPStart.y;


            if (endRowCos == -1) {
                endRowCos = Math.cos(endRowsAngle);
                endRowSin = Math.sin(endRowsAngle);
                endrowSinDist = (endRowSin * endRowsLen);
                endrowCosDist = (endRowCos * endRowsLen);
            }

            var currEndX = endrowCosDist * rowPer;
            var currEndY = endrowSinDist * rowPer;
            //add the offset of the start pixel
            currEndX += toPStart.x;
            currEndY += toPStart.y;

            var cp1 = {x:currStartX, y:currStartY};
            var cp2 = {x: currEndX, y:currEndY};

            var slopeStartToEndAngle = Util.getAngle(cp2.x, cp2.y, cp1.x,cp1.y );
            var distanceBetweenCurrs = Util.distanceTwoPoints(cp1.x, cp2.x, cp1.y,cp2.y );

            var COS = -1;
            var SIN = -1;
            var SIN_dist;
            var COS_dist ;

            for (var col = 0; col < targetBD.width; col++) {

                if (COS == -1) {
                    COS = Math.cos(slopeStartToEndAngle);
                    SIN = Math.sin(slopeStartToEndAngle);
                    SIN_dist = SIN * distanceBetweenCurrs;
                    COS_dist = COS * distanceBetweenCurrs;
                    //print("COS " + COS + " SIN " + SIN + " COS_dist " + COS_dist + " SIN_dist " + SIN_dist);
                }

                var colPer = col / targetBD.width;
                var currColX = COS_dist * colPer;
                var currColY = SIN_dist * colPer;
                currColX += cp1.x;
                currColY += cp1.y;
                //print("currColX " + currColX + " currColY " + currColY);
                srcBD.getPixel(currColX, currColY,pixel, true);
                this.depthMapData.getPixel(currColX, currColY, depthPixel, true);

                var heightPer = 1-(depthPixel.r / 255);
                //make percentage between -1 and 1
                heightPer += 1;
                heightPer /= 2;
                heightPer *= this.heightFactor;

                ////////////////////////////////////////////////////////
                var __x = parseInt(col);
                var __y = parseInt(row - (heightPer * rowPer));//


                if(__y < windowH && __x > 0 && __x < windowW)
                {
                    

                    if(!prevHeights[__x])
                    {
                        prevHeights[__x] = windowH;
                    }
                    
                    //targetBD.setPixel(__x, __y, pixel.r, pixel.g, pixel.b, pixel.a);

                    for(var h = __y; h < prevHeights[__x]; h++)
                    {
                        if(!depthBuffer[h])
                        {
                            depthBuffer[h] = [];
                        }

                        if(!depthBuffer[h][__x])
                        {
                            depthBuffer[h][__x] = true;
                            targetBD.setPixel(__x, h, pixel.r, pixel.g, pixel.b, pixel.a);
                        }

                        
                    }

                    prevHeights[__x] = __y;

                }
                
                
                
                
                //targetBD.setPixel(col, row, pixel.r, pixel.g, pixel.b, pixel.a);

            }

        }

    }
    easeOutQuint(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t * t * t * t * t + 1) + b;
    }
}
