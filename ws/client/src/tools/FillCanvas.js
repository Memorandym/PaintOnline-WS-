import Tool from "./Tool";

export default class FillCanvas extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false

        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'fillCanvas',
                x: this.startX,
                y: this.startY,
                r: this.r,
                color: this.ctx.fillStyle,
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.saved = this.canvas.toDataURL();
        this.draw();
    }


    draw() {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            for (let i = 0; i < this.canvas.width * 1.2; i = i + 0.5) {
                setTimeout(() => {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
                    this.ctx.beginPath()
                    this.ctx.arc(this.startX, this.startY, Math.abs(i), 0, 2 * Math.PI, false);
                    this.ctx.fill()
                }, 350);
            }
        }
    }



    static staticDraw(ctx, x, y, r, color) {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, ctx.canvas.width * 1.2, 0, 2 * Math.PI);
        ctx.fill()
    }
}