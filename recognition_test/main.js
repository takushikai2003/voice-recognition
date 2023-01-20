import k_NN from "./k-NN.js";
const vowel_display = document.getElementById("vowel_display");
let labeled_data;
const volume_threshold = 20;//母音判定をするかの音量しきい値

//ファイル読み込み--------
// document.getElementById("file_input")
// .addEventListener("change", async ()=>{
//     const text = await document.getElementById("file_input").files[0].text();
//     labeled_data = JSON.parse(text);
//     // console.log(labeled_data);

//     vowel_display.innerHTML = "labeled data ready";
// });
window.addEventListener("DOMContentLoaded", function(){
const xhr = new XMLHttpRequest();
xhr.open("get", "./labeled_data.txt");
xhr.send();
xhr.onreadystatechange = function() {
    if( xhr.readyState === 4 && xhr.status === 200) {
        const text = this.responseText;
        labeled_data = JSON.parse(text);
    }
};
});


let audio_data, audioCtx, analyserNode, audioSourceNode;
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
		
		audio_data = new Uint8Array(analyserNode.fftSize / 4);
	
		// オーディオノードの設定
		audioSourceNode.connect(analyserNode);
        
        setInterval(() => {
            //音量が一定を超えていなければ判定しない
            if(getByteFrequencyDataAverage() < volume_threshold){
                vowel_display.innerHTML = "no sound";
                return;
            }

            analyserNode.getByteFrequencyData(audio_data);

            const formants = get_formant(audio_data);
            const formant1 = formants[0];
            const formant2 = formants[1];
            const unknown_data = {x: formant1, y: formant2};

            const label = k_NN(labeled_data, unknown_data, 3);

            switch (label){
                case 0:
                    vowel_display.innerHTML = "a";
                    break;
                case 1:
                    vowel_display.innerHTML = "i";
                    break;
                case 2:
                    vowel_display.innerHTML = "u";
                    break;
                case 3:
                    vowel_display.innerHTML = "e";
                    break;
                case 4:
                    vowel_display.innerHTML = "o";
                    break;
            }
           
        }, 10);
	}
	catch(e){
		alert(e);
	}

    document.getElementById("start").hidden = true;
});


function get_formant(audio_data){
	const formants = [];
	for(let i = 0; i < audio_data.length; i++) {
        if(audio_data[i-1] < audio_data[i] && audio_data[i] >= audio_data[i+1]){
            const Hz = i * 44100 / analyserNode.fftSize;
            formants.push(Hz);
        }  
	}

	return formants;
}


// 音量として、解析結果の全周波数の振幅の平均を取得する
function getByteFrequencyDataAverage() {
    const frequencies = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(frequencies);

    const volume = frequencies.reduce(function(previous, current) {
        return previous + current;
    }) / analyserNode.frequencyBinCount;


    return volume;
}
