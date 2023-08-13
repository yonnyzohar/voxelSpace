class InputHandler{
    constructor()
    {
        if (InputHandler.instance) {
            return InputHandler.instance; // Return the existing instance
          }
                
          // Store the instance in a static property
          InputHandler.instance = this;
          this.keys = {
            ArrowLeft : false,
            ArrowRight : false,
            ArrowUp : false,
            ArrowDown: false
        };

        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(event)
    {
        this.keys[event.key] = true;
        print(event.key);
    }

    onKeyUp(event)
    {
        this.keys[event.key] = false;
    }

    static getInstance(){
        return InputHandler.instance;
    }
}

