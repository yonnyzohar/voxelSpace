class Main {

    constructor() {
      new InputHandler();
        this.now = Util.timestamp();
        this.last = Util.timestamp();
       
        const app = new PIXI.Application({
            width: window.innerWidth * 0.8,
            height: window.innerHeight * 0.7,
            backgroundColor: 0x000000, // Background color (change as needed)
        });
        
        // Append the PIXI canvas to the HTML body
        document.body.appendChild(app.view);
        
        

        this.app = app;
        this.stage = app.stage;
        
    }

    start()
    {
      this.frame();
    }

    frame() {
        this.now = Util.timestamp();
        this.dt  = Math.min(1, (this.now - this.last) / 1000); // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
        this.update(this.dt);
        this.render();
        this.last = this.now;
        requestAnimationFrame(this.frame.bind(this));
      }
      

      update(dt)
      {
   
        print(dt);
      }

      render()
      {

      }
  
    
  }



