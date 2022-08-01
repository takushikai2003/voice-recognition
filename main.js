const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const canvas3 = document.getElementById("canvas3");
const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");
const ctx3 = canvas3.getContext("2d");

ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
 
ctx1.lineWidth = ctx2.lineWidth =  1;
ctx1.strokeStyle = ctx2.strokeStyle = "rgb(0, 0, 255)";

ctx1.fillStyle = ctx2.fillStyle = "rgb(255, 255, 255)";

let audioCtx;
let audioSourceNode;
let analyserNode;
let data1,data2;
let audioEle;
let firstflg = true;
 
function play(){
	try{
		if(firstflg){
            // AudioContextの生成
            audioCtx =  new AudioContext(); 
            firstflg = false;  
		}
		
		if(audioEle){
		    audioEle.pause();
		}
		
		audioEle = new Audio();    
		
		audioEle.src = "./こんにちは.mp3";
		
		
		audioEle.autoplay = true;
		audioEle.preload = "auto";
		
		// MediaElementAudioSourceNodeの生成
		if(audioSourceNode){
		    audioSourceNode.disconnect();
		}
		audioSourceNode = audioCtx.createMediaElementSource(audioEle);
		
		// AnalyserNodeの生成 
		// ※音声の時間と周波数を解析する
		if(analyserNode){
		    analyserNode.disconnect();
		}    
		analyserNode = audioCtx.createAnalyser();
		
		// FFT(高速フーリエ変換)においての周波数領域
		analyserNode.fftSize = 256;
		
		data1 = new Uint8Array(analyserNode.fftSize);
		data2 = new Uint8Array(analyserNode.fftSize / 4);
	
		// オーディオノードの設定
		audioSourceNode.connect(analyserNode);
		analyserNode.connect(audioCtx.destination);
		
        // ctx2.fillStyle = "gray";
        // ctx2.fillRect(0,0, canvas2.width, canvas2.height);
		draw();  
	}
	catch(e){
		alert(e);
	}
} 


let c3_pos_x = 0;
let threshold = 100;

function draw() {
	requestAnimationFrame(draw);
	
	// TimeDomain(波形データ)------------------
	analyserNode.getByteTimeDomainData(data1);  
	ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
	
	ctx1.strokeStyle = "blue";
	ctx1.beginPath();
	ctx1.moveTo(0, data1[0]);
	for(let i = 0; i < data1.length; i++) {
		ctx1.lineTo(i, data1[i]);
	}
	ctx1.stroke();
	
	ctx1.strokeStyle = "red";  
	ctx1.beginPath();
    ctx1.moveTo(0, 127);
    ctx1.lineTo(256, 127);
	ctx1.stroke();



    // Frequency(周波数スペクトル)-------------
    analyserNode.getByteFrequencyData(data2);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    
    // 周波数を簡易的に表示する
    ctx2.beginPath();
    ctx2.moveTo(0,  255 - data2[0]);
    for(var i = 0; i < data2.length; i++) {
        ctx2.lineTo(i*4, 255 - data2[i]);   
    }
    ctx2.stroke();
	


	// Formant-------------------------------
	// analyserNode.getByteFrequencyData(data2);

	// 極大値だけ描画したい
    const formants = [];
	for(let i = 0; i < data2.length; i++) {
        if(data2[i-1] < data2[i] && data2[i] >= data2[i+1]){
            ctx3.fillStyle = "blue";
            ctx3.fillRect(c3_pos_x, canvas3.height - i*3, 1, 3);

            const Hz = i * 44100 / analyserNode.fftSize;
            formants.push(Hz);
        }
       
	}

    // console.log(formants.length);
    document.getElementById("formant_length").innerHTML = formants.length;
	

    //canvas2に赤点を打つ
    for(let i=0; i<formants.length; i++){
        ctx2.fillStyle = "red";
        const j = formants[i] * analyserNode.fftSize / 44100;
        ctx2.fillRect(j*4, 255 - data2[j], 2, 2);
    }


    c3_pos_x++;
};
 
function stop(){  
  	audioEle.pause();
}