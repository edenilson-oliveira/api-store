class CodeGenerate{
  public execute(){
    let code: string = '';
      for(let i = 0; i < 3;i++){
        const numRandom = Math.random()*100
        let num = parseInt(numRandom.toString() as string).toString()
        if(Number(num) < 10){
          num = '0' + num.toString()
        }
        code += num
      }
    return code
  }
}

export default CodeGenerate