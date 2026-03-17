// Função 1: Bloqueio de dispositivos pequenos
function bloquearDispositivosPequenos() {
  if (window.innerWidth < 1024) {
    document.body.innerHTML = `
      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
        font-family:Arial, sans-serif;
        text-align:center;
        color:#d9534f;
      ">
        <div>
          <h1>⚠️ Acesso restrito</h1>
          <p>Este sistema só pode ser usado em computadores.<br>
          Por favor, utilize um dispositivo com tela maior.</p>
        </div>
      </div>
    `;
    return true;
  }
  return false;
}

// Função 2: Exibir termos de uso
function exibirTermosDeUso() {
  Swal.fire({
    title: 'Licença de Uso',
    html: `
      <p>Este software é fornecido gratuitamente por DuRasta Desenvolvimentos.</p>
      <p>Uso permitido apenas para consulta e análise de NF-e.</p>
      <p>É proibida a reprodução, modificação ou comercialização sem autorização.</p>
      <p><a href="https://github.com/DuRastaDesenvolvimentos/LeitorXML?tab=License-1-ov-file" target="_blank">Leia os termos completos</a></p>
    `,
    icon: 'info',
    confirmButtonText: 'Aceito',
    showCancelButton: true,
    cancelButtonText: 'Não aceito',
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#dc3545',
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then((result) => {
    if (!result.isConfirmed) {
      document.body.innerHTML = "<h2>Você precisa aceitar os termos para usar o sistema.</h2>";
    }
  });
}



$(document).ready(()=>{ 
  const bloqueado = bloquearDispositivosPequenos();
  if (bloqueado) return; // se bloqueou, não continua

  exibirTermosDeUso();   // só chama se não bloqueou

 
 //Entidade XML
  class Xml {
      #infProt = null
      #procEventoNFe = null;
      cnpj = 'Ausente'
      chave = 'Ausente'
      dataEmissao = 'Ausente'
      naturaOp = 'Ausente'
      valor = 'Ausente'
      modelo = 'Ausente'
      status = 'Ausente'
      nfeNumero = 'Ausente'
      numSerie = 'Ausente'
      _xmlString = null;       // Armazena o XML bruto
      _parsedXml = null;       // Armazena o XML já parseado
      _produtos = 'Ausente';          // Amarzena os produtos para futura analise
    
    //Ler o retorno de FileRead como string
    lerXML(xmlString){
      this._xmlString = xmlString  ;
      
    };

    parserXml() {

        //Recebe a String do XML bruto
        if(!this._xmlString){
          throw new Error ("Arquivo não carregado")
        };
        //Faz o Parse do txt do XML para um elemento DOM
        const parser = new DOMParser()
          this._parsedXml = parser.parseFromString(this._xmlString, 'text/xml')
          this.cnpj = this._parsedXml.querySelector("CNPJ")?.textContent ?? this.cnpj;
          this.chave = this._parsedXml.querySelector("chNFe")?.textContent || this.chave;
          this.dataEmissao = this._parsedXml.querySelector("dhEmi")?.textContent || this.dataEmissao;
          this.naturaOp = this._parsedXml.querySelector("natOp")?.textContent || this.naturaOp;
          this.modelo = this._parsedXml.querySelector("mod")?.textContent || this.modelo;
          this.valor = this._parsedXml.querySelector("vNF")?.textContent || this.valor;
          this.status = this._parsedXml.querySelector("cStat")?.textContent || this.status;
          this.nfeNumero = this._parsedXml.querySelector("nNF")?.textContent || this.nfeNumero;
          this.numSerie = this._parsedXml.querySelector("serie")?.textContent || this.numSerie;
          this._produtos =this._parsedXml.querySelectorAll("det") //?.textContent || this._produtos;
          this.#infProt = this._parsedXml.querySelector('infProt')?.childNodes 
          this.#procEventoNFe = this._parsedXml.querySelectorAll('infEvento')[1]?.children[3]?.textContent || this._parsedXml.querySelectorAll('infEvento')[0]?.children[3]?.textContent
          
          /*
          if(this.#procEventoNFe == 135 && this.valor !== 'Ausente' && this.valor !== 'R$: Ausente'){
            console.log(this.#procEventoNFe)
            this.status = this.#procEventoNFe
          }*/
          
          
          

          if(this.cnpj === 'Ausente' || this.chave === 'Ausente' || this.dataEmissao === 'Ausente' ||   this.    naturaOp === 'Ausente' || this.valor === 'Ausente' || this.modelo === 'Ausente' || this.status === 'Ausente' || this.nfeNumero === 'Ausente' || this.numSerie === 'Ausente'){
            //throw new Error ("Arquivo com estrutura diferente")
            if(this._parsedXml.querySelector("Reference") != undefined || this._parsedXml.querySelector("Reference") != null){
              this.chave = this._parsedXml.querySelector("Reference").attributes[0].value.replace('#NFe', '')
              this.status = 'Contingência'
              
            } else {
              this.chave = this.chave 
              this.status = this.status
            }

            //console.log(this.chave)
            
            
          }
      };



    

     buscaProduto(){
      for (let i = 0; i < this._produtos.length; i++) {
        const produtos = this._produtos[i].children[0].children;
        const impostos = this._produtos[i].children[1].children;
        //console.log(produtos)
        //console.log(impostos)
        
      }
    }

    
    //retorna as informações do objeto em questão em formato de array.
    toTableRow() {
      return  [
        this.cnpj,          //0
        this.chave,        //1
        this.dataEmissao,  //2
        this.naturaOp,    //3
        this.valor,      //4
        this.modelo,    //5
        this.status,   //6
        this.nfeNumero,//7
        this.numSerie,//8
        this.#procEventoNFe, //9
        this._produtos       //10 
      ]
    };
  }; 



  
 ////////// Ajustes do sincronismo das funções//////
  async function processarArquivos() {
    const arquivos = $('#file')[0].files //FileList - Seleciona os arquivos carregados
    let arqLido = 0
    if(arquivos.length > 1_000){
      alert('Quantidade maior que a permitida. Por favor reduza a quantidade!!')
      throw new Error ("Quantidade maior que a permitida")
    };
    const xmlInst = []; //Amazena as intancias de XML
    const promises = []; //Guarda as promises das funções
    for (let i= 0; i < arquivos.length; i++) {
      
        const promise = new Promise( (resolve) => {
          //Instancia de FeleReader que transforma o arquivo carregado em texto bruto
          const reader = new FileReader() //leitura do Arquivo formato texto.
          let xml = new Xml() //a cada interação do laço, um novo objeto XML é criado 
          
          reader.onload = (event)=>{
            const xmlString = event.target.result
            //Tratativa para evitar leitura de corrompidos
            if (!xmlString || typeof xmlString !== 'string') {
              console.warn('Arquivo corrompido ou ilegível, ignorado:', arquivos[i].name);
              resolve();
              return;
            }


            try{
            xml.lerXML(xmlString)
            xml.parserXml()
            const row = xml.toTableRow()
           // console.log(row)
            if(row && row[1]&& !isNaN(parseFloat(row[1]))){
              xmlInst.push(row)
              xml.buscaProduto()
            }else{
              console.warn('Valor inválido no arquivo, pulado:', arquivos[i].name);
              alert('Valor inválido no arquivo: ' + arquivos[i].name + '. O arquivo será pulado.')
            }
            }catch(e){
            console.warn('O arquivo corrompido foi pulado:', arquivos[i].name, e);
            }finally{
              arqLido++
              const porcetagemTotal = (arqLido / arquivos.length)*100
              atualizaBarra(porcetagemTotal)
              resolve() 
            }
              /*
            reader.addEventListener("loadend", ()=>{
              arqLido++
              const porcetagemTotal = (arqLido / arquivos.length)*100
              atualizaBarra(porcetagemTotal)
             
            });*/

            reader.onerror = (e) => {
              console.error('Erro ao ler o arquivo:', arquivos[i].name, e);
              arqLido++
              const porcetagemTotal = (arqLido / arquivos.length)*100
              atualizaBarra(porcetagemTotal)
              resolve() 
     
            };
            /*
            reader.onloadend = (e) => {
             arqLido++
              const porcetagemTotal = (arqLido / arquivos.length)*100
              atualizaBarra(porcetagemTotal)
              resolve() 
            }*/

            
          };reader.readAsText(arquivos[i]);//Fim FileReader

          /*///// vamos abrir alguns precedentes aqui //////////
          reader.addEventListener("progress",(event)=>{
            if(event.lengthComputable){
            const porcentagem = (event.loaded / event.total)*100;
            console.log(porcentagem)
            }
          });
          ////// finalizados /////////*/
        }); //fim promise
        promises.push(promise)   
      
    }//fim do loop
  
  await Promise.all(promises); // AGUARDA TODOS OS ARQUIVOS
  procuraDuplicado(xmlInst, arquivos.length)
  }; //Fim função async
 
 /*
  //procura valores duplicados e salva a primeira ocorrencia
  async function procuraDuplicado(inst, qtd){
    const confere = new Set();
    const filtrado = inst.filter(([a, chave]) => {
    if (confere.has(chave)) return false; // já vimos essa chave = descarta
    confere.add(chave);                   // primeira vez → guarda
    return true;
   });
   /*procuraEventoSozinho(qtd, filtrado)
   atualizador(qtd, filtrado)
   viewer(filtrado)
   console.log(filtrado)
  };*/




//procura valores duplicados e salva a segunda ocorrencia
  function procuraDuplicado(inst, qtd) {
    const confere = new Map();
    
    // percorre todas as linhas
    inst.forEach(linha => {
      const chave = linha[1]; // posição 1 = chave
      // sempre sobrescreve: se já existe, substitui pela nova (segunda ocorrência)
      if(confere.has(chave)){
        const existente = confere.get(chave);
        const completo = linha[0] !=='Ausente' && linha[4] !== 'R$: Ausente';
        if(completo){
          if(linha[9]){
            linha[6] = linha[9]; // Atualiza o status com o valor do evento, se disponível
          }
           confere.set(chave, linha);
        }else {
        const combinado =  procuraEventoSozinho(existente, linha);
        confere.set(chave, combinado);
        }

      }else{
      confere.set(chave, linha);
      }
    });
    

    // resultado final: apenas uma linha por chave
    
    const filtrado = Array.from(confere.values());

   //console.log(filtrado)
   atualizador(qtd, filtrado);
    viewer(filtrado);
 }


  function procuraEventoSozinho(autorizado, evento){
    const resultado = [...autorizado];
    if (!resultado[9] && evento[9]){
      resultado[9] = evento[9];
    }
    if(resultado[9]){
      resultado[6] = evento[9];
    }
    return resultado;
  };
  ////Atualiza Barra de Totalizadores///////
  function atualizador(qtd,arq){
  
    let vT = 0
    let vV = 0
    let vC = 0
    let tV = 0
    let tC = 0
    let vCc = 0

    //Selecionando elementos da barra de totalizadores
    const tArquivos = document.querySelectorAll('#tArquivos');
    const vTotal = document.querySelectorAll('#vTotal');
    const vValido = document.querySelectorAll('#vValido');
    const vContigencia = document.querySelectorAll('#vContigencia');
    const tArquivosValidos = document.querySelectorAll('#tArquivosValidos');
    const tContigencia = document.querySelectorAll('#tContigencia');
    const vCancelado = document.querySelectorAll('#vCancelado');

    //Loop para soma dos valores  
    for(let i in arq){
      const vX = arq[i][4]
      let valor = parseFloat(vX)
      const sX = arq[i][6]
      vT += valor
      if(sX === "100" || sX === "150"){
        vV += valor
        tV +=1
      }else if(sX === "135" ){
        vCc += valor
        tC +=1
      }else{
       vC +=valor
        tC +=1
      }
    };//Fim do Loop

    let valido = vV.toFixed(2)
    valido = valido.replace('.', ',')
    let contigencia = vC.toFixed(2)
    contigencia = contigencia.replace('.', ',')
    let total = vT.toFixed(2)
    total = total.replace('.', ',')

    //Atribução dinamica de valores da barra
    tArquivos[0].innerHTML = qtd
    vTotal[0].innerHTML = total
    vValido[0].innerHTML = valido
    vContigencia[0].innerHTML= contigencia
    tArquivosValidos[0].innerHTML= tV
    tContigencia[0].innerHTML= tC 
    vCancelado[0].innerHTML = vCc.toFixed(2).replace('.', ',')

  };

  ///Renderização da tabela pra vizualização
  function viewer(xmlInst){
  
    const criarTabela = document.getElementById('table')
    const criaTbody = document.getElementById('view')
    criaTbody.innerHTML=''
    criarTabela.className = "table table-hover table-sm"

    //Container Temporario
    const temp = document.createDocumentFragment();

    for (const key in xmlInst) {    
    
      if(xmlInst[key][9]){
        xmlInst[key][6] = xmlInst[key][9]
      }
      /* kaymap = 
        [CHAVE = xmlInst[key][1]
         DATA = xmlInst[key][2]
         NAT_OP = xmlInst[key][3]
         VALOR = xmlInst[key][4]
         MODELO = xmlInst[key][5]
         status = xmlInst[key][6]
         NFE_NUMERO = xmlInst[key][7]
         N_SERIE = xmlInst[key][8]
        ]
      */
      criaTr = document.createElement('tr')
      //Tratativa Retorno Status
      if(xmlInst[key][9] != 135 && (xmlInst[key][6] == 100 || xmlInst[key][6] == 150)){
        xmlInst[key][6] = 'Autorizado'
        criaTr.className='autorizado'
      }else if (xmlInst[key][6] == 2){
        xmlInst[key][6] = "Consultar SEFAZ"
        criaTr.className= "text-danger"
      }else if (xmlInst[key][6] == 101 || xmlInst[key][6] == 135){
        xmlInst[key][6] = "Cancelamento NF"
        criaTr.className='text-danger'
      }else if (xmlInst[key][6] == 128){
        xmlInst[key][6] = "Evento NFE"
        criaTr.className='text-info'
        xmlInst[key][5] = 'Evento'
      }else(
        xmlInst[key][6] = 'Status Desconecido'
      )

      //Tratativa Retorno Modelo
      if(xmlInst[key][5] == 65){
          xmlInst[key][5] = 'NFCe'
        }else if(xmlInst[key][5]== 55){
          xmlInst[key][5] = 'NFe'
        }else if(xmlInst[key][6] == 128){
          xmlInst[key][5] = 'Evento'
        }else(
        xmlInst[key][5] = 'NOTA FISCAL'
      );
      //Criar as linhas automaticamente
      for(let i = 1; i<9; i++){
        const criarTd = document.createElement('td')
        if(i === 4){
          
            xmlInst[key][i] = "R$: " + xmlInst[key][i].replace('.', ',')
          }
        
        if(i === 2){
          
          data = xmlInst[key][i].split("T")[0].replaceAll("-", "/").split("/").reverse().join("/")
          hora = xmlInst[key][i].split("T")[1].replaceAll("-03:00", "")
          xmlInst[key][i] = data + " - " + hora
         }
        criarTd.innerHTML = xmlInst[key][i]; 
        criaTr.appendChild(criarTd)
      }
     temp.appendChild(criaTr)
    }   
    criaTbody.appendChild(temp)
  };
  function atualizaBarra(n){
    const progress = document.querySelector(".progress-bar");
    progress.style.width = n + "%"
    progress.textContent = Math.floor(n)+ '%';
    progress.setAttribute('aria-valuenow', n);
  }
 
  document.getElementById('debug').addEventListener('click', processarArquivos)

 
 document.getElementById('file').addEventListener('change', async (e) => {
  const progress = document.querySelector(".progress-bar")
    progress.style.width = 0 + "%"
    progress.textContent = 0 + '%';
    progress.setAttribute('aria-valuenow', 0);

   }
);

});

 

 




/*
// Uso: quando o input de arquivo muda
document.getElementById('file').addEventListener('change', async (e) => {
    const files = e.target.files;
    const xmlInstances = await processFiles(files);
    renderTable(xmlInstances);
});
// EXECUTAR QUANDO SELECIONAR ARQUIVOS:
document.getElementById('file').addEventListener('change', processarArquivos);
*/
