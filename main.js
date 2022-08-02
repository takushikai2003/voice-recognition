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

document.getElementById("start").addEventListener("click", async ()=>{
	try{
		
		// AudioContextの生成
		audioCtx =  new AudioContext();
		// マイクから音声を取得する
		const stream = await navigator.mediaDevices.getUserMedia({audio: true});
		audioSourceNode = audioCtx.createMediaStreamSource(stream);
		
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
		// analyserNode.connect(audioCtx.destination);
		
		// ctx2.fillStyle = "gray";
		// ctx2.fillRect(0,0, canvas2.width, canvas2.height);
		draw();  
	}
	catch(e){
		alert(e);
	}
});


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
	const formants = get_formant();
	// 極大値だけ描画したい
    

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


function get_formant(){
	const formants = [];
	for(let i = 0; i < data2.length; i++) {
        if(data2[i-1] < data2[i] && data2[i] >= data2[i+1]){
            ctx3.fillStyle = "blue";
            ctx3.fillRect(c3_pos_x, canvas3.height - i*3, 1, 3);

            const Hz = i * 44100 / analyserNode.fftSize;
            formants.push(Hz);
        }  
	}


	return formants;
}


//スペースキーが押されているときだけformant記録-----------
let keydown = false;
document.documentElement.addEventListener("keydown",(e)=>{
	if(e.key==" "){
		keydown = true;
	}
});

document.documentElement.addEventListener("keyup",(e)=>{
	if(e.key==" "){
		keydown = false;
	}
});

const labeled_data = [];

setInterval(() => {
	//キャプチャ
	if(keydown){
		let label;

		switch(true){
			case document.getElementById("radio1").checked:
				label = 0;
				break;
			case document.getElementById("radio2").checked:
				label = 1;
				break;
			case document.getElementById("radio3").checked:
				label = 2;
				break;
			case document.getElementById("radio4").checked:
				label = 3;
				break;
			case document.getElementById("radio5").checked:
				label = 4;
				break;
		}

		const formants = get_formant();
		const formant1 = formants[0];
		const formant2 = formants[1];

		const data = {x: formant1, y:formant2, label: label};

		//formant1,2にどちらも値が存在すれば
		if(formant1!=undefined && formant2!=undefined){
			labeled_data.push(data);
		}
	}
}, 10);


//終了------------
document.getElementById("finish").addEventListener("click",()=>{
	console.log(labeled_data);
	download(JSON.stringify(labeled_data));
});

function download(text) {
	const blob = new Blob([text], { type: "text/plain" });
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = "labeled_data.txt";
	a.click();
	URL.revokeObjectURL(a.href);
	a.remove();
}
