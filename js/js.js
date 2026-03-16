
  //seletores barra totalizadores
  const tArquivos = document.querySelectorAll('#tArquivos');
  const vTotal = document.querySelectorAll('#vTotal');
  const vValido = document.querySelectorAll('#vValido');
  const vContigencia = document.querySelectorAll('#vContigencia');
  const tArquivosValidos = document.querySelectorAll('#tArquivosValidos');
  const tContigencia = document.querySelectorAll('#tContigencia');
  //fim barra totalizadores
  let cancelado = null; //
  ///////////////////////////////
  const input = document.getElementById("file")
  ///////////////////////////////

  


  
  function debug(){
    //////////////////////////
    /*barra totalizadores*/
    let valorValido = 0;
    let valorTotal = 0;
    let valorContigencia = 0;
    let totalValido = 0;
    let totalContigencia = 0;
    let temporario = null;
    ////////////////

    //Variaveis para alimentar a tabela
    let CHAVE = '' ;
    let DATA_EMISSAO= '';
    let NAT_OP= '';
    let VALOR = '';
    let MODELO= '';
    let STATUS= '';
    let NFE_NUMERO= null;
    parseInt(NFE_NUMERO)
    let N_SERIE= '';
    let contador = 0


    //console.log(input.files)
    const dados = document.getElementById("dados");
    dados.innerHTML=""
    vTotal[0].innerHTML=""
    tArquivos[0].innerHTML=""
    vValido[0].innerHTML=""
    vContigencia[0].innerHTML=""
    tArquivosValidos[0].innerHTML=""
    tContigencia[0].innerHTML=""

    //1. criar elementos
    const criarTabela = document.createElement("table")
    criarTabela.className = "table table-hover table-sm"
    
    // 2. Criar o thead e a linha (tr) do cabeçalho
    const criarThead = document.createElement("thead")
    criarThead.className = "thead-light"
    
    const criarTrThead = document.createElement("tr")
    
    //nomes dos th's a serem criados no loop
    const cabeçalhoTable = [
      "CHAVE", 
      "DATA EMISSÃO",
      "NAT. OP",
      "VALOR",
      "MODELO",
      "STATUS",
      "NFE NUMERO",
      "Nº SERIE",

    ];

  
    // 3. Criar as células de cabeçalho (th)
    for (let i = 0; i < cabeçalhoTable.length; i++){
      
      const criarTh = document.createElement('th');
      criarTh.textContent = `${cabeçalhoTable[i]}` // Texto da célula do cabeçalho

    //Logica para id de cada Th
    const idMap = {
      "CHAVE": "chave",
      "DATA EMISSÃO": "data",
      "NAT. OP": "nOp",
      "VALOR": "valor",
      "MODELO": "modelo",
      "STATUS": "status",
      "NFE NUMERO": "nNum",
      "Nº SERIE": "nSerie",

      };
    const valorId = idMap[cabeçalhoTable[i]];
      if (valorId) {
        criarTh.id = valorId;
      }
      // Adicionar a célula à linha do cabeçalho
      criarTrThead.appendChild(criarTh)
    };
    // Adicionar a linha ao thead
    criarThead.appendChild(criarTrThead);

    // 4. Criar o tbody (corpo da tabela)
    const criaTbody = document.createElement('tbody')


  //5. Criar  linhas e células no tbody (baseado do atributo input.files.length)
    
    for (let i = 0; i < input.files.length; i++) {

      ///////Função para leitura dos arquivos////////
      const arquivo = input.files[i]  //seleciona o arquivo com base no indice
      const leitor = new FileReader()  //cria uma nova instancia do Leitor de Arquivos
    
      leitor.onload = function (event) {
        const conteudo = event.target.result; // O conteúdo do arquivo como texto
        const parser = new DOMParser() //Paeser e exibição do conteudo no console
        const DOMxml = parser.parseFromString(conteudo, 'text/xml')
        contador +=1
        //console.log(DOMxml)
        //console.log(contador)
        const testeXML = DOMxml.documentElement

        const chNFe = testeXML.querySelectorAll("chNFe");
        const dhEmi = testeXML.querySelectorAll('dhEmi')
        const natOp = testeXML.querySelectorAll('natOp')
        const mod   = testeXML.querySelectorAll('mod')
        const cStat = testeXML.querySelectorAll('cStat')
        const vNF   = testeXML.querySelectorAll('vNF')
        const nNF   = testeXML.querySelectorAll('nNF')
        const serie = testeXML.querySelectorAll('serie')

        //Informações para alimentar a tabela
        CHAVE = chNFe[0].textContent ;
        DATA_EMISSAO= dhEmi[0].textContent;
        NAT_OP= natOp[0].textContent;
        VALOR = vNF[0].textContent;
        let tot = parseFloat(VALOR)
        MODELO= mod[0].textContent;
        STATUS= cStat[0].textContent;
        NFE_NUMERO= nNF[0].textContent;
        N_SERIE= serie[0].textContent;
        valorTotal += tot

        
        if (STATUS === '100' || STATUS === '150') {
          valorValido += tot
          totalValido ++ 
        }else if (STATUS == 2){
          valorContigencia += tot
          totalContigencia ++  
        }

        vTotal[0].innerHTML = valorTotal.toFixed(2)
        vValido[0].innerHTML = valorValido.toFixed(2)
        vContigencia[0].innerHTML= valorContigencia.toFixed(2)
        tArquivosValidos[0].innerHTML= totalValido
        tContigencia[0].innerHTML= totalContigencia
       /////////TESTES//////////

      
       const criarTr = document.createElement('tr')

        if (STATUS === '100' || '150') {
          criarTr.className='autorizado'
          if(STATUS==='150'){
            STATUS = "Autorizado NF-e, fora de prazo"
          }else{
            STATUS = "Autorizado"
          }
        }else if (STATUS == 2){
          STATUS = "Contigencia"
          criarTr.className= "text-danger"
        }else if (STATUS == 3){
          STATUS = "Cancelamento NF"
          valorContigencia += VALOR
          criarTr.className='text-info'
          totalContigencia ++
        }else if (STATUS == 4){
          STATUS = "Inutilização Nº"
          valorContigencia += VALOR
          criarTr.className='text-secondary'
          totalContigencia ++
        }else if (STATUS == 5){
          STATUS = "Denegado"
          valorContigencia += VALOR
          criarTr.className='denegado'
          totalContigencia ++
        }
      
      //Cria as Td's dentro das linhas
      for(let j = 0; j < cabeçalhoTable.length; j++){
        
        
  
        const criarTd = document.createElement('td')
        const tdMap = {
          "CHAVE": { headers: "chave", valor: CHAVE },
          "DATA EMISSÃO": { headers: "data", valor: DATA_EMISSAO },
          "NAT. OP": { headers: "nOp", valor: NAT_OP },
          "VALOR": { headers: "valor", valor: VALOR },
          "MODELO": { headers: "modelo", valor: MODELO },
          "STATUS": { headers: "status", valor: STATUS },
          "NFE NUMERO": { headers: "nNum", valor: NFE_NUMERO },
          "Nº SERIE": { headers: "nSerie", valor: N_SERIE }
        };
      
        const tdInfo = tdMap[cabeçalhoTable[j]];
        if (tdInfo) {
          criarTd.headers = tdInfo.headers;
          criarTd.innerHTML = tdInfo.valor;
            
          
        }
          
        
        criarTr.appendChild(criarTd)      
      }
        
      criaTbody.appendChild(criarTr)
            
    };
      leitor.readAsText(arquivo)
    
      ///////FIM-Função para leitura dos arquivos////////


    
            tArquivos[0].innerHTML = input.files.length
    }
    






   ////////Montando a tabela com os dados////////
    criarTabela.appendChild(criarThead)
    criarTabela.appendChild(criaTbody)
    dados.appendChild(criarTabela)
  }








    

  