var app = (function($) {

    var self = {};

    self.canvas;
    self.context;
    self.interval = null;
    self.objects = [];
    self.mouse = {x:0,y:0};
    self.star;

    self.ns = 25; 
    self.initialSize = 10;
    self.initialSizeRange = 2;
    self.sources = ["sons/C.mp3","sons/D.mp3","sons/E.mp3","sons/F.mp3","sons/G.mp3","sons/A.mp3","sons/B.mp3"];
    self.sounds = []; 
    self.playing = []; 
    self.audioLoad =0;
    self.isClick = false;
    self.isMobile = false;

    self.init = function () {
        self.canvas = $("canvas")[0];
        //self.canvas.style.maxWidth = "100%";
        //self.canvas.style.maxHeight = "100%";
        self.updateSizeCanvas();
        self.context = self.canvas.getContext("2d");

        self.starImage = new Image();
        self.starImage.src ="imgs/star.png";

        $(document).ready(function(){
            if(self.detectDevice()!=="computer"){
                self.isMobile = true;
            } 
            self.initSounds();
            self.consoleText();
        });

        $(window).resize(function(){
            self.updateSizeCanvas();
        });
        
    };

    self.updateSizeCanvas = function(){
        self.canvas.width = $(window).width();
        self.canvas.height = $(window).height();
    };

    self.initSounds = function(){
        if(self.isMobile){
            self.ns = 25;
            self.initialSize = 25;
            self.initialSizeRange = 10;
        }

        for (i = 0; i < self.ns; i ++){
            self.sounds.push([]);
        }

        for (i = 0; i < self.sources.length; i ++){
            for (j = 0; j < self.ns; j ++){
                self.sounds[j].push(new Audio(self.sources[i])); 
            }
        }

        for (i = 0; i < self.sources.length; i ++){
            self.playing[i] = 0; 
        }

        self.addEventCheckAudioLoad();

        if(self.isMobile){
            self.initSoundsMobile();
            self.isMobile = true;
        } else {
            $(".loading p").html("0%<br>Loading");
        }
        
    };

    self.addEventCheckAudioLoad = function(){
        for (i = 0; i < self.sources.length; i ++){
            for (j = 0; j < self.ns; j ++){
                self.sounds[j][i].addEventListener('loadeddata', self.checkAudioLoad, false);
            }
        }
    };

    self.initSoundsMobile = function(){
        $(".loading p").html("Music Canvas<br>Click here!");
        
        if(!self.isMobile){
            $("canvas")[0].addEventListener("click",self.playAllSoundsMute);
            $(".loading")[0].addEventListener("click",self.playAllSoundsMute);
        }else{
            $("canvas")[0].addEventListener("touchstart",self.playAllSoundsMute);
            $(".loading")[0].addEventListener("touchstart",self.playAllSoundsMute);
        }
    };

    self.playAllSoundsMute = function(){
        $(".loading p").html("0%<br>Loading");
        for (var j = 0; j < self.ns; j++) {
            for (var i = 0; i < self.sources.length; i++) {
                self.playSound(i,0);        
            };
        };

        for (var j = 0; j < self.ns; j++) {
            for (var i = 0; i < self.sources.length; i++) {
               self.sounds[j][i].pause();     
            };
        };
        if(!self.isMobile)$("canvas")[0].removeEventListener("click",self.playAllSoundsMute);
            else $("canvas")[0].removeEventListener("touchstart",self.playAllSoundsMute);
    };

    self.checkAudioLoad = function(){
        self.audioLoad++
        var amount = (self.sources.length*self.ns);
         $(".loading p").html(Math.floor(self.audioLoad/amount*100)+"%<br>Loading");
        if(self.audioLoad >= (amount)){

           $(".loading p").html("Click to play!");

           $("canvas")[0].addEventListener("mousemove",function(e){
               if(!self.isMobile)self.mouse = self.getMousePos(e);
            });

            if(!self.isMobile){
                $("canvas")[0].addEventListener("click", self.clickonscreen);
                $(".loading")[0].addEventListener("click", self.clickonscreen);
            }else {
                $("canvas")[0].addEventListener("touchstart", self.clickonscreen);
                $(".loading")[0].addEventListener("touchstart", self.clickonscreen);
            }
            self.interval = setInterval(self.loop,1000/12);
        }
    };

    self.clickonscreen = function(e){
        if(!self.isClick){
            $(".loading").hide();
            self.isClick = true;
        }
        self.mouse = self.getMousePos(e);
        if(self.objects.length<self.ns){
            if(!self.isMobile){
                self.create(self.mouse);
            } else {
                var x = self.mouse.x;
                var y = self.mouse.y;
                var objectClicked = -1;
                for (var i = 0; i < self.objects.length; i++) {
                    if(x>self.objects[i].x-self.objects[i].width/2 && x<self.objects[i].x+self.objects[i].width && y > self.objects[i].y-self.objects[i].height/2 && y < self.objects[i].y+self.objects[i].height){
                        objectClicked = i;
                        break;
                    } 
                };

                if(objectClicked === -1){
                    self.create(self.mouse);
                    objectClicked = self.objects.length-1;
                }

                self.objects[objectClicked].over = true;
                setTimeout(function(){self.objects[objectClicked].over=false},1000/12-1);

                for (var k = 0; k < self.sources.length; k++) {
                    if(self.objects[i].size==self.initialSize + self.initialSizeRange*(Math.abs(k-6)))self.playSound(k,1);
                };
            } 
        }             
    }

    self.playSound = function(id, vol){
        if (vol <= 1 && vol >= 0){
            self.sounds[self.playing[id]][id].volume = vol;
        }else{
            self.sounds[self.playing[id]][id].volume = 1;
        }
        self.sounds[self.playing[id]][id].play();
        ++ self.playing[id]; 

        if (self.playing[id] >= self.ns){
            self.playing[id] = 0;
        }
    }

    self.create = function(config){
        positionX = config.x;
        positionY = config.y;
        var velocidadeR = Math.floor(Math.random()*3)+2;
        var velocidade = Math.floor(Math.random()*2)+2;
        var qtd = 12*Math.floor(Math.random()*3); 
        var tamanho = self.initialSize + self.initialSizeRange*Math.floor(Math.random()*7);
        self.star = new Star({context:self.context, posX:positionX, posY:positionY, quantidade:qtd, velocidadeY:velocidade, velocidadeRotacao:velocidadeR, size:tamanho});
        self.objects.push(self.star);
    };

    self.loop = function(){
        self.context.clearRect(0,0,self.canvas.width, self.canvas.height);
        var listaDeletar = [];
        for (var i = 0; i < self.objects.length; i++) {
            self.objects[i].desenhar();
            if(self.objects[i].y - self.objects[i].height/2 > $(window).height()){
                listaDeletar.push(i);
            }
        };

        for (var i = 0; i < listaDeletar.length; i++) {
            self.objects.splice(listaDeletar[i], 1);
        };

        if(!self.isMobile){
            var x = self.mouse.x;
            var y = self.mouse.y;
            for (var i = 0; i < self.objects.length; i++) {
                if(x>self.objects[i].x-self.objects[i].width/2 && x<self.objects[i].x+self.objects[i].width && y > self.objects[i].y-self.objects[i].height/2 && y < self.objects[i].y+self.objects[i].height){
                    self.objects[i].over = true;
                    if(self.objects[i].countCirculos==0){
                        for (var k = 0; k < self.sources.length; k++) {
                            if(self.objects[i].size==self.initialSize + self.initialSizeRange*(Math.abs(k-6)))self.playSound(k,1);
                        };
                    }
                } else {
                    self.objects[i].over = false;
                }
            };
        }

        self.context.drawImage(self.starImage,10,10,40,40);
        self.context.font="30px BELLABOO-Regular";
        self.context.fillStyle="white";
        self.context.fillText(self.ns-self.objects.length,54,40);
    };

    self.getMousePos = function(evt){
        var xoff = $($(".music-painting")[0]).offset().left;
        var yoff = $($(".music-painting")[0]).offset().top;
        var clientX = evt.clientX || evt.touches[0].clientX;
        var clientY = evt.clientY || evt.touches[0].clientY;
        return {
            x: Math.floor(clientX  - xoff + $("body").scrollLeft()),
            y: Math.floor(clientY - yoff + $("body").scrollTop())
        };
    }

    self.detectBrowser = function(){
        var browserName;
        var browserVersion;

        if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ 
            browserName = "firefox";            
            var ffversion=new Number(RegExp.$1) 
            browserVersion = Math.floor(ffversion);
        }

        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ 
            browserName = "internet explorer";
            var ieversion=new Number(RegExp.$1) 
            browserVersion = Math.floor(ieversion);
        }

        if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
            browserName = "opera";
            var oprversion=new Number(RegExp.$1) 
            browserVersion = Math.floor(oprversion);
        }

        if((navigator.userAgent.toLowerCase().indexOf('chrome') > -1) &&
         (navigator.userAgent.toLowerCase().indexOf('safari') !=-1)){
            browserName = "chrome";
            browserVersion = "";
        }

        if((navigator.userAgent.toLowerCase().indexOf('chrome') == -1) &&
         (navigator.userAgent.toLowerCase().indexOf('safari') !=-1)){
            browserName = "safari";
            browserVersion = "";
        }
    };
   

    self.detectDevice = function(){
        var deviceName;
        if ((navigator.userAgent.match(/iPhone/i))||
        (navigator.userAgent.match(/iPod/i))||
        (navigator.userAgent.match(/iPad/i))){
            deviceName = "iosdevice";
        } else if (navigator.userAgent.match(/Android/i)){
            deviceName = "android";
        } else if (navigator.userAgent.match(/BlackBerry/i)){
            deviceName = "blackberry";
        } else if (navigator.userAgent.match(/IEMobile/i)){
            deviceName = "iemobile";
        } else if (navigator.userAgent.match(/Silk/i)){
            deviceName = "kindle";
        } else {
            deviceName = "computer";
        }
        
        return(deviceName);
    }

    self.gotoWebsite = function(){
        window.open('http://www.thatianepisco.com');
    }

    self.consoleText = function(){
        console.log('%c made with <3 ', 'background: #E9ECEC; color: #8C254E');
        console.log('%c by Thatiane Pisco - www.thatianepisco.com', 'background: #E9ECEC; color: #8C254E');
        console.log('%c Would you like to see more? -> seeMore()', 'background: #E9ECEC; color: #8C254E');
    }

    self.init();

    window.seeMore = self.gotoWebsite;


}($));