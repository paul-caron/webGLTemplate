// Created by Paul Caron. No copy authorized

class Matrix{
    constructor(rows, columns){
        this.rows=rows;
        this.columns=columns;
        this.values=new Array(rows*columns);
    }
    setValues(values){
        for(let a=0;a<values.length;a++){
            this.values[a]=values[a];
        }
    }    
    printValues(mat){
        let rowstr = "";
        let index=0;
        for(let a=0;a<this.rows;a++){
            rowstr="";
            for(let b=0;b<this.columns;b++){
                rowstr+=this.values[index++].toFixed(7)+" ";               
            }
            console.log(rowstr);
        }
    }
    resetToNull(){
        for(let a=0;a<this.values.length;a++){
            this.values[a]=0;
        }    
    }
    makeIdentity(){        
        if(this.rows===this.columns){
            this.resetToNull();
            for(let a=0;a<this.rows;a++){
                this.values[a*this.columns+a]=1;
            }
        }
    }
    ///statics
    static add(mat1, mat2){
        if(mat1.rows===mat2.rows&&mat1.columns===mat2.columns){
            let result = new Matrix(mat1.rows, mat1.columns);
            for(let a=0;a<mat1.values.length;a++){
                result.values[a]=mat1.values[a]+mat2.values[a];                
            }          
            return result;
        }
    }
    static kmult(mat,k){
        let result=new Matrix(mat.rows,mat.columns 
        );
        for(let a=0;a<mat.values.length;a++){
            result.values[a]=(mat.values[a]*k);                        
        }
        return result ;
    }
    static mult(mat1,mat2){
        if(mat1.columns===mat2.rows){
            let result= new Matrix(mat1.rows, mat2.columns);
            let index = 0;
            let one=0;
            let two=0;
            for(let h=0;h<mat1.rows;h++){
            for(let i=0;i<mat2.columns;i++){
                result.values[index]=0;
                for(let j=0;j<mat1.columns;j++){
                    one=mat1.values[j+h*mat1.columns];
                    two=mat2.values[j*mat2.columns+i];
                    ;
                    result.values[index] += one * two;               
                }
                index++;
            }
            }            
            return result;           
        }
    }
    static transpose(mat){
        let result=new Matrix(mat.columns,mat.rows);
        for(let index=0;index<mat.values.length;index++){
            result.values[(index%result.rows)*result.columns+parseInt(index/result.rows)]=mat.values[index];        
        }
        return result;
    }
    static inverse(mat){
        if(mat.rows===mat.columns){
            
            if(mat.rows==2){
                let adjugate=new Matrix(mat.rows, mat.columns);
                let a=Matrix.getValueByRC(mat,0,0);
                let b=Matrix.getValueByRC(mat,0,1);
                let c=Matrix.getValueByRC(mat,1,0);
                let d=Matrix.getValueByRC(mat,1,1);
                let det=a*d-b*c;
                adjugate.setValues([d,-b, -c, a]);
                let inverse=Matrix.kmult(adjugate,1/det);
                return inverse;
            }else{
                //get matrix of minors
                let min=Matrix.minors(mat);
                //add cofactors
                Matrix.addCofactors(min);
                //transpose
                let adjugate=Matrix.transpose(min);
                //multiply by determinant
                let det = Matrix.determinant(mat);                              
                let inverse=Matrix.kmult(adjugate,1/det);
                return inverse;
            }            
        }
    }
    static minors(mat){        
        let result=[];               
        if(mat.rows==2&&mat.columns==2){
            let a=Matrix.getValueByRC(mat,0,0);
                let b=Matrix.getValueByRC(mat,0,1);
                let c=Matrix.getValueByRC(mat,1,0);
                let d=Matrix.getValueByRC(mat,1,1);
                let det=a*d-b*c;
            return det;
        }else{
        if(mat.rows===mat.columns){            
            for(let a=0;a<mat.rows;a++){
                for(let b=0;b<mat.columns;b++){
                    let det=Matrix.determinant(Matrix.removeRC(mat,a,b));
                    result.push(det);                
                }
            }
            let min= new Matrix(mat.rows,mat.columns);
            min.setValues(result);
            return min;                        
        }
        }
    }
    static getValueByRC(mat, row, col){
        return mat.values[row*mat.columns + col];
    }
    static setValueByRC(mat,row,col,val){
        mat.values[row*mat.columns + col]=val;
    }
    
    static determinant(mat){
        if(mat.rows==2){
            let a=Matrix.getValueByRC(mat,0,0);
            let b=Matrix.getValueByRC(mat,0,1);
            let c=Matrix.getValueByRC(mat,1,0);
            let d=Matrix.getValueByRC(mat,1,1);
            let det=a*d-b*c;
            return det;
        }else{
            let result=[];
            let mat2= new Matrix(mat.rows-1,mat.columns-1);
            for(let a=0;a<mat.rows;a++){
                for(let b=0;b<mat.columns;b++){
                    result.push(Matrix.removeRC(mat,a,b));
                }
            }                     
            let result2=[];
            for(let r of result){
                let matz=new Matrix(mat.rows-1,mat.columns-1);
                matz.setValues(r.values);
                result2.push(Matrix.determinant(matz));               
            }
            //cofactors
            let det=0;
            let cof=1;
            for(let a=0;a<mat.columns;a++){
                det+=result2[a]*cof*mat.values[a];
                cof*=-1;
            }            
            return det; 
        }
    }
    static removeRC(mat,row,col){
        let result = new Matrix(mat.rows-1,mat.columns-1);
        let index=0;
        for(let a=0;a<mat.rows;a++){
            for(let b=0;b<mat.columns;b++){
                if(a===row||b==col){
                    
                }else{                    
                    result.values[index]=Matrix.getValueByRC(mat,a,b);
                    index++;
                }
            }
        }
        return result;
    }
    static addCofactors(mat){
        for(let a=0;a<mat.rows;a++){
            for(let b=0;b<mat.columns;b++){                
                if((a%2===0&&b%2===1)||(a%2===1&&b%2===0)){
                    let value= Matrix.getValueByRC(mat,a,b);
                    Matrix.setValueByRC(mat,a,b,value*-1);
                }
            }
        }
    }
}//End of the Matrix Class





////////////////////////
//rotation matrices
////////////////////////
//X
var rotationX=new Matrix(4,4);
rotationX.setAngle = function(angle){
    this.angle = angle;
    this.setValues([
    1,0,0,    0,
    0,Math.cos(this.angle),-Math.sin(this.angle),0,
    0,Math.sin(this.angle),Math.cos(this.angle),0,
    0,0,0,1
    ]);
}
rotationX.makeIdentity();
//Y
var rotationY=new Matrix(4,4);
rotationY.setAngle = function(angle){
    this.angle = angle;
    this.setValues([
    Math.cos(this.angle),0,Math.sin(this.angle),    0,
    0,1,0,0,
    -Math.sin(this.angle),0,Math.cos(this.angle),0,
    0,0,0,1
    ]);
}
rotationY.makeIdentity();
rotationY.setAngle(Math.PI);
//Z
var rotationZ=new Matrix(4,4);
rotationZ.setAngle = function(angle){
    this.angle = angle;
    this.setValues([
    Math.cos(this.angle),Math.sin(this.angle),0,    0,
    -Math.sin(this.angle),Math.cos(this.angle),0, 0,
    0,0,1,0,
    0,0,0,1
    ]);
}
rotationZ.makeIdentity();

/////
var translation = new Matrix(4,4);
translation.makeIdentity();
translation.setT = function(x,y,z){
    translation.values[3] += x;
    translation.values[7] += y;
    translation.values[11] += z;
}
translation.setT(0,0,-15);
translation =Matrix.transpose(Matrix.inverse(Matrix.mult(translation,rotationY)));

//////////////
//projection
//////////////
let projection = new Matrix(4,4);
let p;
function setProjection(aspectRatio,fov,nearZ,farZ){
    var  pmat = new Matrix(4,4);
    
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
"uniform mat4 mWorld;",//uniform are like parameter input that are the same for all vertices
"uniform mat4 mView;",
"uniform mat4 mProj;",
"uniform mat4 mWorldX;",
"uniform mat4 mWorldY;",
"uniform mat4 mWorldZ;",
"uniform mat4 mProjection;",
"uniform mat4 mTranslation;",
"uniform mat4 mScale;",
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
    
    canvas = document.getElementById("canvas");
    canvas.width=innerWidth-10;
    canvas.height=innerHeight-10;
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    
    
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
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
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
    var vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);        
    var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    var colorAttribLocation = gl.getAttribLocation(program, "vertColor");
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
    
    var mViewUniformLocation = gl.getUniformLocation(program, "mView");
    var mProjUniformLocation = gl.getUniformLocation(program, "mProj");
    var mProjectionUniformLocation = gl.getUniformLocation(program, "mProjection");
    var mWorldXUniformLocation = gl.getUniformLocation(program, "mWorldX");
    var mWorldYUniformLocation = gl.getUniformLocation(program, "mWorldY");
    var mWorldZUniformLocation = gl.getUniformLocation(program, "mWorldZ");
    var mTranslationUniformLocation = gl.getUniformLocation(program, "mTranslation");

    var viewMatrix = new Float32Array(16);
  setProjection(canvas.width/canvas.height,Math.PI/1.5,1,1000.0);

    gl.uniformMatrix4fv(mViewUniformLocation, gl.FALSE, viewMatrix );
    gl.uniformMatrix4fv(mProjUniformLocation, gl.FALSE, p);
    gl.uniformMatrix4fv(mProjectionUniformLocation, gl.FALSE, projection.values );
    ///
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
        rotationZ.setAngle(-time/5000);
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

