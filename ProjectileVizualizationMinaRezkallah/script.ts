
//author: Mina Rezkallah
//email: mwrezkallah@gmail.com
//mob: +2 01211988436

function main() 
{
    const canvas = document.getElementById("ProjectileVisualizer") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    //userInput
    const v  = document.getElementById("velocity") as HTMLInputElement;
    const a = document.getElementById("angle") as HTMLInputElement;
    const velocity = Number(v.value);
    const angle = Number(a.value);
    const numberOfPoints = document.getElementById("points") as HTMLInputElement;
    const points = Number(numberOfPoints.value) || 100;
    const vizualizationTime = document.getElementById("vizualizationTime") as HTMLInputElement;
    const vzTime = Number(vizualizationTime.value)*1000 / points || 200;



    const startBtn = document.getElementById("start") as HTMLButtonElement ;
    startBtn.disabled = true;
    const resetBtn = document.getElementById("reset") as HTMLButtonElement ;
    resetBtn.disabled = false;
    const resultTable = document.getElementById("results") as HTMLTableElement;
    resultTable.style.display="table"

    const projectile = new Projectile(angle, velocity, points);
    const xMax = document.getElementById("totalDistance") as HTMLElement;
    xMax.innerHTML = `${projectile.getTotalDistance().toFixed(3)}`;
    const hMax = document.getElementById("hmax") as HTMLElement;
    hMax.innerHTML = `${projectile.getMaxHeight().toFixed(3)}`;
    const tMax = document.getElementById("tmax") as HTMLElement;
    tMax.innerHTML = `${projectile.getFlightTIme().toFixed(0)}`;
  


    draw(canvas, ctx, projectile, vzTime);
    }


let animationIntervalID:number;

function draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, projectile: Projectile, time=200){
    
    let i =0
    animationIntervalID = setInterval(()=>{
        update(canvas, ctx, projectile,i);
        if(i==projectile.np) clearInterval(animationIntervalID);
        i++;
    },time)
}

let oldFrame:ImageData;

function update(canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D, projectile:Projectile, i=0){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    const coordiantes = projectile.getCoordinates()
    const scaleX =  (canvas.width-20) / projectile.getTotalDistance();
    const scaleY = (canvas.height-20) / projectile.getMaxHeight();


    displayProjectileData(coordiantes, i, projectile);


    ctx.beginPath();
    if(i>0) ctx.putImageData(oldFrame, 0, 0);

    ctx.arc((canvas.width/2)  - (projectile.getTotalDistance() * scaleX/2) + ( coordiantes[i].x * scaleX) ,  canvas.height -  (coordiantes[i].y * scaleY), 1, 0, 2*Math.PI);
    ctx.fillStyle="rgb(84 20 31)"
    ctx.fill();
    oldFrame = ctx.getImageData(0,0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.arc( (canvas.width/2)  - (projectile.getTotalDistance() * scaleX/2) + ( coordiantes[i].x * scaleX)  , canvas.height -  (coordiantes[i].y * scaleY) , 5 , 0 , 2*Math.PI)
    ctx.fillStyle="rgb(166 81 199 / 59%)"
    ctx.fill();

    
}

function reset(){
    clearInterval(animationIntervalID);
    const startBtn = document.getElementById("start") as HTMLButtonElement ;
    startBtn.disabled = false;
    const resetBtn = document.getElementById("reset") as HTMLButtonElement ;
    resetBtn.disabled = true;
    const resultTable = document.getElementById("results") as HTMLTableElement;
    resultTable.innerHTML=`     
                    <tr>
                        <th>#point</th>
                        <th>X in m</th>
                        <th>Y in m</th>
                        <th>Time in seconds</th>
                    </tr>`;

    resultTable.style.display="none"
    const canvas = document.getElementById("ProjectileVisualizer") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width, canvas.height);
}

function displayProjectileData(coordinates:{x:number, y:number}[], i:number, projectile: Projectile){
    const x = `${coordinates[i].x.toFixed(3)}`;
    const y = `${coordinates[i].y.toFixed(3)}`;
    const t = `${(projectile.getFlightTIme()*i/projectile.np).toFixed(0)}`;

    const instanceX = document.getElementById("currentX") as HTMLElement;
    instanceX.innerHTML = x
    const instanceY = document.getElementById("currentY") as HTMLElement;
    instanceY.innerHTML = y
    const instanceT = document.getElementById("currentTime") as HTMLElement;
    instanceT.innerHTML = t
    const resultTable = document.getElementById("results") as HTMLTableElement;
    resultTable.innerHTML += `
                <tr>
                    <th>${i}</th>
                    <th>${x}</th>
                    <th>${y}</th>
                    <th>${t}</th>
                </tr>
    `; 
}




class Projectile {
    private static g = 9.81; // gravitational acceleration m/s^2
    private vX: number; // velocity component in x-direction m/s
    private vY: number; // velocity component in y-direction m/s
    private hMax: number; // maximum height in meter
    private tMax: number; // flight time in seconds
    private tHmax:number; // time to reach the maximum height in seconds
    private totalDistance: number; // total horizontal distance fleed by the projectile in meter
    private angle: number; // projectile's angle in radian
    private velocity: number; // projectile's lanuch velocity in m/s
    private points:{x:number, y:number}[] // coordinates to draw the projectile path
    public readonly np:number;  // number of points/coordinates to draw projectile path
    private dt: number; // the time that the projectile takes to travel from one coordiante/point to next one.
    


    constructor(angle: number, velocity:number, points:number){
        this.np = points;
        this.init(angle, velocity);
    } 

    private init(angle: number, velocity: number) {
        this.angle = (angle / 180) * Math.PI;
        this.velocity = velocity;
        this.vX = this.velocity * Math.cos(this.angle);
        this.vY = this.velocity * Math.sin(this.angle);
        this.totalDistance = velocity * velocity * Math.sin(2*this.angle) / Projectile.g ;
        this.hMax = Math.pow(this.vY, 2) / (2 * Projectile.g);
        this.tMax = 2 * this.vY / Projectile.g;
        this.tHmax = this.vY / Projectile.g;
        this.dt = this.tMax / this.np;
        this.calculatePoints();
    }
    
    private calculatePoints(){
        this.points = [];
        this.totalDistance = this.velocity * this.velocity * Math.sin(2*this.angle) / Projectile.g ;
        for(let i = 0; i <= this.np; i++){
            this.points[i] = {x: this.calcX(i * this.dt), y: this.calcY(i * this.dt)};
        }
    }
    
    private calcX(t:number){ return this.vX * t;}   
    private calcY(t:number){ return (this.vY * t) - (0.5 * Projectile.g  * t * t); }
    
    
    reset(angle: number, velocity:number){ this.init(angle, velocity); }

    getCoordinates(){ return this.points; }

    getTotalDistance(){ return this.totalDistance}

    getMaxHeight(){return this.hMax}

    getFlightTIme(){return this.tMax}
}
