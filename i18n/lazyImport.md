## CN

模块懒加载，底层使用 Proxy。

|参数名|说明|
|-----|---|
|importFn|实际引入模块的方法|
|dirname|当前脚本所在目录|
|返回值|用于引入模块的新方法|