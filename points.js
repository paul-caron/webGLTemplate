// Created by Paul Caron. No copy authorized

// Created by Paul Caron, february 2020. No copy authorized.

////////////////////////////////////////
//WebGL stuff...Shader codes and whatnot
///////////////////////////////////////

var vertexShaderCode = [
"precision mediump float;",
"",
"attribute vec4 vertPosition;",//attributes are like parameters input unique to each vertex
"attribute vec3 vertColor;",
"varying vec3 fragColor;",//varying are like outputs that goes to frag shader
"",
//uniform are like parameter input that are the same for all vertices
"uniform mat4 mProj;",
"uniform mat4 mWorldX;",
"uniform mat4 mWorldY;",
"uniform mat4 mWorldZ;",
"uniform mat4 mTranslation;",

"void main()",
"{",
"    gl_Position =mProj* mTranslation*mWorldY* mWorldX *mWorldZ * vertPosition;",
"    gl_PointSize = sqrt(2.0*pow(gl_Position.x,2.0));",
"    fragColor = vertColor-0.001*(gl_Position.z*gl_Position.z) ;",
"}"
].join("\n");

var fragmentShaderCode = [
"precision mediump float;",
"",
"varying vec3 fragColor;",
"void main()",
"{",
"    gl_FragColor = vec4(fragColor, 1.0);",
"}"
].join("\n");

var canvas;
var gl;


function init(){
////////////////////////
//rotation matrices
////////////////////////
//X
let rotationX=new Matrix(4,4);
rotationX.setAngle = function(angle){
    this.angle = angle;
    this.setValues([
    1,0,0, 0,
    0,Math.cos(this.angle),-Math.sin(this.angle),0,
    0,Math.sin(this.angle),Math.cos(this.angle),0,
    0,0,0,1
    ]);
}
rotationX.makeIdentity();
//Y
let rotationY=new Matrix(4,4);
rotationY.setAngle = function(angle){
    this.angle = angle;
    this.setValues([
    Math.cos(this.angle),0,Math.sin(this.angle), 0,
    0,1,0,0,
    -Math.sin(this.angle),0,Math.cos(this.angle),0,
    0,0,0,1
    ]);
}
rotationY.makeIdentity();
rotationY.setAngle(Math.PI);
//Z
let rotationZ=new Matrix(4,4);
rotationZ.setAngle = function(angle){
    this.angle = angle;
    this.setValues([
    Math.cos(this.angle),Math.sin(this.angle),0, 0,
    -Math.sin(this.angle),Math.cos(this.angle),0, 0,
    0,0,1,0,
    0,0,0,1
    ]);
}
rotationZ.makeIdentity();

/////
let translation = new Matrix(4,4);
translation.makeIdentity();
translation.setT = function(x,y,z){
    translation.values[3] += x;
    translation.values[7] += y;
    translation.values[11] += z;
}
translation.setT(0,0,-15);
translation =Matrix.transpose(Matrix.inverse(Matrix.mult(translation,rotationY)));//flip camera to look from back of the scene

//////////////
//projection
//////////////
let p;
function setProjection(aspectRatio,fov,nearZ,farZ){
    let pmat = new Matrix(4,4);
    
    p= [
    (1/(aspectRatio*Math.tan(fov/2))),0,0,0,
    0,(1/Math.tan(fov/2)),0,0,
    0,0,-(-nearZ-farZ)/(nearZ-farZ),(2*farZ*nearZ)/(nearZ-farZ),
    0,0,-1,0
    ]
    pmat.setValues(p);
    p=Matrix.transpose(pmat).values;
}

//////////////////////
//makes some vertices
//////////////////////
  
let vertices= [];
let k=0;
function makeShapes(){
    vertices.length=0;
    for(let i=0;i<=100.0;i+=0.02){
        const a=i*k%(2*Math.PI),r=i/5;
        const red=Math.sin(a+r);
        const green=Math.sin(a+Math.PI*2/3);
        const blue=Math.sin(a+Math.PI*4/3);
         vertices.push(r*Math.cos(a),r*Math.sin(a),100*Math.sin(r+k)/5.0,1.0,red,green,blue);
    }
}
makeShapes();


    canvas = document.getElementById("canvas");
    canvas.width=innerWidth-10;
    canvas.height=innerHeight-10;
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: false});
    if(!gl){
        gl = canvas.getContext("experimental-webgl");
    }
    if(!gl){
        alert("no webgl support");
    }    
    /////////////////////
    //SHADERS
    ////////////////////
    //Create Shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    //add shader source code
    gl.shaderSource(vertexShader, vertexShaderCode );
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    //compile shaders
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.log(gl.getShaderInfoLog(fragmentShader));       
    }
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.log(gl.getShaderInfoLog(fragmentShader));
    }
    //create program
    var program = gl.createProgram();
    //attach shaders to it
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    //link the program
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.log(gl.getProgramInfoLog(program));
    }
    //validate the program
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.log(gl.getProgramInfoLog(program));
    }    
    ////////////////////
    //Buffers
    ////////////////////            
    const vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);        
    const positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    const colorAttribLocation = gl.getAttribLocation(program, "vertColor");
    gl.vertexAttribPointer(
        positionAttribLocation,
        4,//number of elements
        gl.FLOAT,//type of element
        gl.FALSE,
        7 * Float32Array.BYTES_PER_ELEMENT,//size of each vertex
        0//offset from beginning of vertex to this attribute
    );
    gl.vertexAttribPointer(
        colorAttribLocation,
        3,//number of elements
        gl.FLOAT,//type of element
        gl.FALSE,
        7 * Float32Array.BYTES_PER_ELEMENT,//size of each 
        4 * Float32Array.BYTES_PER_ELEMENT//offset from beginning of vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    gl.useProgram(program);

    const mProjUniformLocation = gl.getUniformLocation(program, "mProj");
    const mWorldXUniformLocation = gl.getUniformLocation(program, "mWorldX");
    const mWorldYUniformLocation = gl.getUniformLocation(program, "mWorldY");
    const mWorldZUniformLocation = gl.getUniformLocation(program, "mWorldZ");
    const mTranslationUniformLocation = gl.getUniformLocation(program, "mTranslation");

  setProjection(canvas.width/canvas.height,Math.PI/1.5,1,1000.0);

    gl.uniformMatrix4fv(mProjUniformLocation, gl.FALSE, p);
    gl.uniformMatrix4fv(mWorldXUniformLocation, gl.FALSE, rotationX.values );
    gl.uniformMatrix4fv(mWorldYUniformLocation, gl.FALSE, rotationY.values );
    gl.uniformMatrix4fv(mWorldZUniformLocation, gl.FALSE, rotationZ.values );
    gl.uniformMatrix4fv(mTranslationUniformLocation, gl.FALSE, translation.values );
        
    gl.clearColor(0.0,0.0,0.0,1.0)//rgba 0-1values
    
    gl.enable(gl.DEPTH_TEST);    
    
    ////////////////////
    //Main loop
    ////////////////////

    let oldtime=0;
    let fpsDisplay=document.getElementById("fps");
    function loop(time){  
        k=Math.cos(time/10000)*10.0;
        makeShapes();     
        //rotationZ.setAngle(-time/5000);
        rotationY.setAngle(time/10000);
        rotationX.setAngle(time/15000);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);           
        fpsDisplay.innerHTML="fps "+(1000/(time-oldtime)).toFixed(1);
        oldtime=time;
        
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   
        gl.uniformMatrix4fv(mWorldXUniformLocation, gl.FALSE, rotationX.values );
    gl.uniformMatrix4fv(mWorldYUniformLocation, gl.FALSE, rotationY.values );
        gl.uniformMatrix4fv(mWorldZUniformLocation, gl.FALSE, rotationZ.values );
    
        //draw
        gl.drawArrays(gl.POINTS, 0, vertices.length/7);     
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

window.onload = init;
