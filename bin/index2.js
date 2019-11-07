#!/usr/bin/env node
let fs = require('fs')
let path = require('path')
let regStr = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/i
let regStrM = /(.?refs\/heads\/)+(\w+)/i
let reg1 = new RegExp(/\.git\\config$/i)
let reg2 = new RegExp(/\.git\\HEAD$/i)
let reg3 = new RegExp(regStr)
//扫描全盘
for (let i = 67; i <= 74; i++) {
  const disk = String.fromCharCode(i)
  const filePath = path.resolve(disk + ':/')
  fileDisplay(filePath)
}
//读取文件内容函数
function readFile (path,token) {
  fs.readFile(path, (err,data) => {
   if(err){
    throw err
   }
    //读取文件，把buffer转换成字符串
    let bin = data.toString('utf-8')
    if(bin.match(reg3) !==null && token == 1){
      console.log('账户地址:'+ bin.match(reg3)[0])
    }
    if(token == 2){
      console.log('账户分支:'+bin.match(regStrM)[0])
    }
  })
}
// 扫描全部路径，查找正则匹配的选项
function fileDisplay (filePath) {
  fs.readdir(filePath, function (err, files) {
    if (err) {
      if (err.code == 'ENOENT'){
        return
      }
    } else {
      files.forEach((filename)=> {
        let filedir = path.join(filePath, filename)
        fs.stat(filedir, function (error, stats) {
          if (error) {
            return
          } else {
            // let isFile = stats.isFile();
            let isDir = stats.isDirectory()
            while(!isDir){
              let res1 = filedir.match(reg1)
              if (res1!=null){
                readFile(res1.input,1)
              }
              let res2 = filedir.match(reg2)
              if (res2!=null){
                readFile(res2.input,2)
              }
            }
          }
        })  
      })
    }
  })
}
