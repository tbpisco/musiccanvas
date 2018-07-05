var Star = function(config){

    var self = {};

	self.context= config.context || "";
	self.scaleNum=1;
    self.interval = null;
    self.quantidade = config.quantidade || 12;
    self.colors = config.colors || ["#AACDF3","#90B1D4","#C1D9F3","#ABBFD4"];
    self.size = config.size || 30;
    self.height=self.size*2.6;
    self.width = self.height;
    self.x = config.posX || 50;
    self.y = config.posY || 50;
    self.centerX = self.x;
    self.centerY = self.y;
    self.velocidadeY = config.velocidadeY || 2;
    self.velocidadeRotacao = config.velocidadeRotacao || 5;
    self.aceleracao=-0.05;
    self.rangeHipo = self.size*0.3;
    self.hipoInicial = self.size;
    self.rotacao = 0;
    self.over = false;
    self.countCirculos =0;

    self.desenhar = function()
    {
        self.centerY = self.y += self.velocidadeY;
        self.rotacao+=self.velocidadeRotacao; 
        self.rotacao = self.rotacao%360;
        self.context.save();
        self.context.translate(self.centerX,self.centerY);
        self.context.rotate((self.rotacao-0.1)*Math.PI/180);
        self.context.translate(-self.centerX,-self.centerY);
        
        var qtd = self.quantidade;
        var hipoInicial = self.hipoInicial;

        var valoresGrafico = [];
        for (var i = 0; i < self.quantidade; i++) {
            valoresGrafico.push(1);
            valoresGrafico.push(1);
        }
        
        for (var i = 0; i < qtd; i++) {

            if(self.over){
                if(i%2==0)self.context.fillStyle = self.colors[2];
                    else self.context.fillStyle = self.colors[3];  
                self.context.strokeStyle = self.colors[3];      
            } else {
                if(i%2==0)self.context.fillStyle = self.colors[0];
                    else self.context.fillStyle = self.colors[1];  
                self.context.strokeStyle = self.colors[1];      
            }

            self.context.beginPath();
            self.context.moveTo(self.centerX, self.centerY);

            if (i % 2 === 0) {
                self.context.lineTo(Math.cos((2*Math.PI * (qtd + i)) / qtd) * hipoInicial + self.centerX, Math.sin((2*Math.PI * (qtd + i)) / qtd) * hipoInicial + self.centerY);
                self.context.lineTo(Math.cos((2*Math.PI * (qtd + i + 1)) / qtd) * (hipoInicial + self.rangeHipo * valoresGrafico[i]) + self.centerX, Math.sin((2*Math.PI * (qtd + i + 1)) / qtd) * (hipoInicial + self.rangeHipo * valoresGrafico[i]) + self.centerY);
            } else {
                self.context.lineTo(Math.cos((2*Math.PI * (qtd + i)) / qtd) * (hipoInicial + self.rangeHipo * valoresGrafico[i]) + self.centerX, Math.sin((2*Math.PI * (qtd + i)) / qtd) * (hipoInicial + self.rangeHipo * valoresGrafico[i]) + self.centerY);
                self.context.lineTo(Math.cos((2*Math.PI * (qtd + i + 1)) / qtd) * hipoInicial + self.centerX, Math.sin((2*Math.PI * (qtd + i + 1)) / qtd) * hipoInicial + self.centerY);
            }

            self.context.lineWidth = 1;
            self.context.stroke();
            self.context.closePath();
            self.context.fill();
        }

        //sombra alpha
        self.context.fillStyle = "rgba(0,0,0,0.5)";
        self.context.beginPath();
        self.context.arc(self.centerX, self.centerY, self.size/3 + self.size/10, 0, 2 * Math.PI);
        self.context.fill();

        //circluo branco
        self.context.fillStyle = "#fff";
        self.context.beginPath();
        self.context.arc(self.centerX, self.centerY, self.size/3, 0, 2 * Math.PI);
        self.context.fill();

        self.context.restore();

        if(self.over || self.countCirculos!=0)self.countCirculos+=2;
        if(self.countCirculos>self.size && !self.over)self.countCirculos=0;

        var alpha = 1 - 1/self.size*self.countCirculos;

        if(self.countCirculos!=0 && self.countCirculos<self.size){

            self.context.strokeStyle = "rgba(255,255,255,"+ alpha +")";
            self.context.lineWidth = 2;
            self.context.beginPath();
            self.context.arc(self.centerX, self.centerY, self.size/3 + 2*self.countCirculos, 0, 2 * Math.PI);
            self.context.stroke();

            self.context.strokeStyle = "rgba(255,255,255,"+ alpha +")";
            self.context.lineWidth = 2;
            self.context.beginPath();
            self.context.arc(self.centerX, self.centerY, self.size/3 + 1*self.countCirculos, 0, 2 * Math.PI);
            self.context.stroke();

            self.context.strokeStyle = "rgba(255,255,255,"+ alpha +")";
            self.context.lineWidth = 2;
            self.context.beginPath();
            self.context.arc(self.centerX, self.centerY, self.size/3 + 3*self.countCirculos, 0, 2 * Math.PI);
            self.context.stroke();
        }

      //  context.strokeStyle="#FF0000"
       // context.rect(self.x-self.width/2,self.y-self.height/2,self.width,self.height);
       // context.stroke();
        
    };

    return self;
}