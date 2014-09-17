
function canvaIntro(){

    var map = [],
        imgCanvas = document.createElement('canvas'),
        imgTag = document.getElementById('me'),
        imgCtx = imgCanvas.getContext('2d');

    imgCanvas.height = imgTag.height;
    imgCanvas.width = imgTag.width;

    imgCtx.drawImage(imgTag, 0, 0, imgTag.width, imgTag.height);

    var data = imgCtx.getImageData(0, 0, imgCanvas.width, imgCanvas.height).data;

    console.log(data);

    // lines and dot
    this.canvas = document.querySelector('#introduction-canvas');

    var _this = this,
        ctx = this.canvas.getContext('2d'),
        color = '#ffffff';

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.display = 'block';
    ctx.fillStyle = color;
    ctx.lineWidth = .1;
    ctx.strokeStyle = color;


    this.resize = function(){
        _this.canvas.width = window.innerWidth;
        _this.canvas.height = window.innerHeight;
        ctx.fillStyle = color;
        ctx.lineWidth = .1;
        ctx.strokeStyle = color;
    }

    $(window).on('resize', _this.resize);

    var mousePosition = {
        x: 30 * _this.canvas.width / 100,
        y: 30 * _this.canvas.height / 100
    };

    var dots = {
        nb: 100,
        distance: 80,
        d_radius: 150,
        array: []
    };

    function Dot(){
        this.x = Math.random() * _this.canvas.width;
        this.y = Math.random() * _this.canvas.height;

        this.vx = -.5 + Math.random();
        this.vy = -.5 + Math.random();

        this.modifierX = 0;
        this.modifierY = 0;

        this.radius = Math.random();

        //this.create();
    }

    Dot.prototype = {
        create: function(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fill();
        }
    };

    Dot.animate = function(){
        var i, dot, moveX, moveY;

        for(i = 0; i < dots.nb; i++){
            dot = dots.array[i];

            if(dot.y < 0 || dot.y > _this.canvas.height){
                dot.vx = dot.vx;
                dot.vy = - dot.vy;
            }
            else if(dot.x < 0 || dot.x > _this.canvas.width){
                dot.vx = - dot.vx;
                dot.vy = dot.vy;
            }

            if (mousePosition.y - dot.y > -100 && mousePosition.y - dot.y < 100 && mousePosition.x - dot.x > -100 && mousePosition.x - dot.x < 100) {
                dot.modifierY = 1 / (mousePosition.y - dot.y);
                dot.modifierX = 1 / (mousePosition.x - dot.x);
            }
            else
            {
                dot.modifierY = dot.modifierY > 0 ? dot.modifierY - 1 : 0;  //dot.modifierY - 1/dot.modifierY;
                dot.modifierX = dot.modifierX > 0 ? dot.modifierX - 1 : 0;// dot.modifierX - 1/dot.modifierX;
            }
           
            moveX = dot.vx - dot.modifierX * 40;
            moveY = dot.vy - dot.modifierY * 40;

            dot.x += moveX;
            dot.y += moveY;
        }
    };

    Dot.line = function(){
        var i, j, i_dot, j_dot;

        for(i = 0; i < dots.nb; i++){
            for(j = 0; j < dots.nb; j++){
                i_dot = dots.array[i];
                j_dot = dots.array[j];

                if((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > - dots.d_radius && (i_dot.y - mousePosition.y) > - dots.d_radius){
                    if((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > - dots.distance && (i_dot.y - j_dot.y) > - dots.distance){
                        ctx.beginPath();
                        ctx.moveTo(i_dot.x, i_dot.y);
                        ctx.lineTo(j_dot.x, j_dot.y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }
    };

    function createDots(){
        var i;

        ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);

        if(dots.array.length < 1) {
            for(i = 0; i < dots.nb; i++){
                dots.array.push(new Dot());
            }
        }

        for(i = 0; i < dots.nb; i++){
            var dot = dots.array[i];
            dot.create();
        }

        Dot.line();
        Dot.animate();
    }

    $('#home').on('mousemove mouseleave', function(e){
        if(e.type == 'mousemove'){
            mousePosition.x = e.pageX;
            mousePosition.y = e.pageY;
        }
        if(e.type == 'mouseleave'){
            mousePosition.x = _this.canvas.width / 2;
            mousePosition.y = _this.canvas.height / 2;
        }
    });
    
    this.interval = setInterval(createDots, 1000/30);   

}