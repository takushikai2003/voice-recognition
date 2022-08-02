//k-近傍法を実装してみる
//※2次元のみ
//labelは0~の整数とする
//labeled_data:[{x:Number, y:Number, label:Int},...]
//label_types:Int ラベルの種類数
//[issue]近い個数が同じだとどっちが取られる？
//[issue]最頻値コードをもっとキレイに書きたい

const canvas1 = document.getElementById("canvas1");
const ctx1 = canvas1.getContext("2d");

//原点を左下に移動
canvas1.width = 500;
canvas1.height = 500;

ctx1.translate(0, canvas1.height);
ctx1.scale(1, -1);

function k_NN(labeled_data, unknown_data, k){
    //とりあえず5色
    const colors = ["blue", "lime", "orange", "yellow", "pink"];
    
    const scale = 0.1; 
    //データを描画
    for(let i=0; i<labeled_data.length; i++){
        draw_point(labeled_data[i].x*scale, labeled_data[i].y*scale, colors[labeled_data[i].label], 5);
    }
    // draw_point(unknown_data.x, unknown_data.y, "red", 10);


    //unknown_dataに近い点をk個探す----
    const distances = [];//labeled_dataとの距離を全点分格納
    for(let i=0; i<labeled_data.length; i++){
        const distance = get_distance(unknown_data.x, unknown_data.y, labeled_data[i].x, labeled_data[i].y);
        distances.push({distance: distance, label: labeled_data[i].label});
    }

    distances.sort((a,b)=>{return a.distance - b.distance});

    const labels = [];//小さい方からk個のラベルを格納
    for(let i=0; i<k; i++){
        labels.push(distances.shift().label);
    }

    return get_mode(labels);
}


function get_distance(x1, y1, x2, y2){
    console.log()
    return Math.abs(Math.sqrt(Math.pow(x1-x2, 2)+Math.pow(y1-y2, 2)));
}


//最頻値 もっとキレイに書きたい
function get_mode(arr){
    const counts = [];
    for(let i=0; i<arr.length; i++){
        if(counts[arr[i]] == undefined){
            counts[arr[i]] = 0;
        }

        counts[arr[i]]++;
    }

    //最大値のインデックスを返す
    let index = 0;
	let value = -Infinity;
	for (let i=0, l=counts.length; i<l; i++) {
		if (value < counts[i]) {
			value = counts[i];
			index = i;
		}
	}

    //indexが最頻値と等しいはず
	return index;
}

function draw_point(x, y, color, size){
    size = size || 3;
    ctx1.fillStyle = color || "black";
    ctx1.fillRect(x, y, size, size);
}


export default k_NN;