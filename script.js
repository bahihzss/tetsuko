/**
 * ミリ単重外径計算機
 * @class Tetsuko
 */
class Tetsuko {
    /**
     * Tetsukoクラスのコンストラクタ
     * @constructs Tetsuko
     */
    constructor() {
        /**
         * IDリスト
         * 
         * @member Tetsuko#id_list
         * @type {string[]}
         */
        this.id_list = ['weight', 'width', 'coef', 'split_num', 'inside'];
        
        /**
         * コイル重量
         * 
         * @member Tetsuko#weight
         * @type {number}
         */
        this.weight = 100;
     
        /**
         * コイル幅
         * 
         * @member Tetsuko#width
         * @type {number}
         */
        this.width = 25;
        
        /**
         * 係数
         * 
         * @member Tetsuko#coef
         * @type {number}
         */
        this.coef = 162278;
        
        /**
         * コイル分割数
         * 
         * @member Tetsuko#split_num
         * @type {number}
         */   
        this.split_num = 1;
        
        /**
         * 分割後のコイル内径
         * 
         * @member Tetsuko#inside
         * @type {number}
         */
        this.inside = 508;
    }

    /**
     * Inputの初期化処理
     * 
     * @return {void}
     */
    init() {
        // Inputに初期値を設定
        this.id_list.forEach(id => HTML.setInputValue(id, this[id]));
    }

    /**
     * 計算処理
     * 
     * @return {void}
     */
    calc() {
        // Inputから値を取得する
        this.id_list.forEach(id => this[id] = HTML.getInputValue(id));
       
        const result = {};

        result.kg_mm = (this.weight / this.width).toFixed(2);
        result.outside = this.getOutside();

        for (let split_num = 1; split_num <= 5; split_num++) {
            [508, 305].forEach(inside => {
                result[`outside_${inside}_${split_num}`] = this.getOutside(inside, split_num);
            })
        }

        this.output(result);
    }

    /**
     * 内径と分割数から外径を算出する
     * 
     * @param {inside} コイル内径（未指定の場合はInput値）
     * @param {split_num} コイル分割数（未指定の場合はInput値）
     * 
     * @return {number}
     */
    getOutside(inside = this.inside, split_num = this.split_num) {
        const weight = this.weight;
        const width = this.width;
        const coef = this.coef;

        // 外径を算出後小数点２桁で出力
        const outside = Math.sqrt(weight * coef / (width * split_num) + Math.pow(inside,2));
        return outside.toFixed(2);
    }

    /**
     * 結果を出力
     * 
     * @param {object} result
     * 
     * @return {void}
     */
    output(result) {
        // resultのkeyからidを取得
        const id_list = Object.keys(result);

        // idの各要素に各値を設定
        id_list.forEach(id => HTML.setText(id, result[id]));

        // 結果画面を表示
        HTML.showResult();
    }
}

/**
 * HTML操作用のオブジェクト
 * 
 * @class HTML
 */
class HTML {
    /**
     * 指定されたidのinputから値を取得
     * 取得した値を整数型にパースして返す
     * 
     * @param {string} id
     * 
     * @return {number}
     */
    static getInputValue(id) {
        return parseInt(document.getElementById(id).value);
    }
    
    /**
     * 指定されたidのinputへ値を設定
     * 
     * @param {string} id
     * @param {number} value 
     * 
     * @return {void}
     */
    static setInputValue(id, value) {
        document.getElementById(id).value = value;
    }

    /**
     * 指定されたidの要素のテキストを変更する
     * 
     * @param {string} id
     * @param {string} text
     * 
     * @return {void}
     */
    static setText(id, text) {
        document.getElementById(id).innerText = text;
    }

    /**
     * 結果画面を表示する（計算画面は非表示になる）
     * 
     * @return {void}
     */
    static showResult() {
        document.getElementById('form').classList.remove('current');
        document.getElementById('result').classList.add('current');
    }

    /**
     * 計算画面を表示する（結果画面は非表示になる）
     * 
     * @return {void}
     */
    static showForm() {
        document.getElementById('result').classList.remove('current');
        document.getElementById('form').classList.add('current');
        // 一番最初のInputにフォーカスする
        document.getElementById('form').getElementsByTagName('input')[0].focus();
    }
}

// DOM読み込み完了時の処理
window.onload =function() {
    const tetsuko = new Tetsuko();

    // 計算ボタンクリック時に計算処理を登録
    document.getElementById('calcButton')
        .addEventListener('click', () => tetsuko.calc());

    // 再計算ボタンクリック時に計算画面表示処理を登録
    document.getElementById('backButton')
        .addEventListener('click', () => HTML.showForm());

    // 各Inputに初期値をセット
    tetsuko.init();
};