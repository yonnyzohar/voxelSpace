class Player{
    constructor(_x, _y)
    {
        this.angle = 0;
        this.angleRad = Util.radFromDeg(this.angle);
        this.left = this.angle - 30;
        this.right = this.angle + 30;
        this.leftRad = Util.radFromDeg(this.left);
        this.rightRad = Util.radFromDeg(this.right);
        this.x = _x;
        this.y = _y;

    }

    getAngle()
    {
        return this.angle;
    }

    setAngle(_angle)
    {
        this.angle = Util.degFromRot(_angle);
        this.left = Util.degFromRot(this.angle - 30);
        this.right = Util.degFromRot(this.angle + 30);
        this.angleRad = Util.radFromDeg(this.angle);
        this.leftRad = Util.radFromDeg(this.left);
        this.rightRad = Util.radFromDeg(this.right);

    }

    advance(speed)
    {
        var cos = Math.cos(this.angleRad) * speed;
        var sin = Math.sin(this.angleRad) * speed;
        this.x += cos;
        this.y += sin;
    }

    update(dt)
    {

    }
}