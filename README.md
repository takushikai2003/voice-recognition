# 母音の音素認識（勉強目的。実用性皆無）

* 音声をフーリエ変換して第一、第二フォルマントを抽出し、k近傍法を用いて母音を認識したい

### 使い方
#### make_dataフォルダ
* その場でマイクからフォルマントのデータを作る
1. 発声するa~oを選択し、開始ボタンを押す
2. スペースキーを押している間だけ音声データが作成される
3. a~oを切り替えながら全ての音を取る
4. 終了ボタンを押す
5. labeled_data.txtがダウンロードされる

#### recognition_testフォルダ
* 作成したデータを用いて母音認識をする
1. labeled_data.txtをフォルダ内に配置する（デフォルトのものでも良い）
2. Startボタンを押す
3. 認識された音素が表示される


#### k-NNフォルダ
* ボロノイ境界図を作成する
1. ファイルを選択から、labeled_data.txtを選択する
2. しばらく待つと、ボロノイ境界図が表示される

### 問い合わせ
takushikai@gmail.com
