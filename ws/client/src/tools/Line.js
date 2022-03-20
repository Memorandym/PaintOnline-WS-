import Tool from "./Tool";

export default class Line extends Tool{
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen(){
        this.canvas.onmousemove =  this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e){
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'line',
                x: this.startX,
                y: this.startY,
                cx: this.currentX,
                cy: this.currentY,
                lineWidth: this.ctx.lineWidth,
                strokeStyle: this.ctx.strokeStyle
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.currentX = e.pageX - e.target.offsetLeft;
            this.currentY = e.pageY - e.target.offsetTop;
            this.draw(this.startX, this.startY, this.currentX, this.currentY)
        }
    }

    draw(x,y,cx,cy){
        const img = new Image()
        img.src = this.saved
        img.onload=()=>{
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
            this.ctx.drawImage(img,0,0,this.canvas.width,this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(x, y)
            this.ctx.lineTo(cx,cy);
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx, x, y, cx, cy, lineWidth, strokeStyle) {
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = strokeStyle
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(cx, cy);
        ctx.stroke()
    }

}