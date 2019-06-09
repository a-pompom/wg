module.exports = {
  entry: './js/script.js', // entry pointを起点にバンドルしていきます
  output: { // 出力に関して
    filename: 'dailyReport.js', // 出力するファイル名    
    path: `${__dirname}/js/` // 出力するディレクトリ階層
    // pathは絶対パスで指定、そのため __dirname でディレクトリ階層を取得しています
  }
};