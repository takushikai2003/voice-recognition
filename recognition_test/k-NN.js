//k-近傍法を実装してみる
//※2次元のみ
//labelは0~の整数とする
//labeled_data:[{x:Number, y:Number, label:Int},...]
//label_types:Int ラベルの種類数
//[issue]近い個数が同じだとどっちが取られる？
//[issue]最頻値コードをもっとキレイに書きたい

function k_NN(labeled_data, unknown_data, k){

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

export default k_NN;