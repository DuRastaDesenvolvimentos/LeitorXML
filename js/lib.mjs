

  export  async function processarArquivos() {
      const arquivos = $('#file')[0].files //FileList - Seleciona os arquivos carregados
      const xmlInst = []; //Amazena as intancias de XML
      const promises = []; //Guarda as promises das funções
      
      

      for (let i= 0; i < arquivos.length; i++) {
        try{
          const promise = await new Promise( (resolve) => {

              //Instancia de FeleReader que transforma o arquivo carregado em texto bruto
              const reader = new FileReader() //leitura do Arquivo formato texto.
              let xml = new Xml() //a cada interação do laço, um novo objeto XML é criado 
              reader.onload = (event)=>{
                const xmlString = event.target.result    
                xml.lerXML(xmlString)
                xml.parserXml()
              // xml.verficaCancelado(xml.chave, xml.status)
                //xml.buscaProduto()
                //xml.validaDados()
                xmlInst.push(xml.toTableRow())
                //console.log('Chave do XML: '+ xml.chave)
                //console.log('Codigo do Status: '+ xml.status)  
                
                resolve()
              };reader.readAsText(arquivos[i]);
              
          }); //fim promise
          
          promises.push(promise)  
        
        }catch{
          console.log('Tu Caiu no catch - hum....')
        }


      }//fim do loop

      

      // AGUARDA TODOS OS ARQUIVOS
      await Promise.all(promises);
      console.log(xmlInst)
      

          function procuraDuplicado(i,chave){
          
          const verificador = xmlInst.includes(chave)
          console.log(chave)
          console.log(i)
          console.log(verificador)
          }; 


      

      //Atualiza Barra de totalizadores
      const tArquivos = document.querySelectorAll('#tArquivos');
      const vTotal = document.querySelectorAll('#vTotal');
      const vValido = document.querySelectorAll('#vValido');
      const vContigencia = document.querySelectorAll('#vContigencia');
      const tArquivosValidos = document.querySelectorAll('#tArquivosValidos');
      const tContigencia = document.querySelectorAll('#tContigencia');

    

      
      tArquivos[0].innerHTML = arquivos.length
      //vTotal[0].innerHTML = valorTotal.toFixed(2)
      //vValido[0].innerHTML = valorValido.toFixed(2)
      //vContigencia[0].innerHTML= valorContigencia.toFixed(2)
      //tArquivosValidos[0].innerHTML= totalValido
      //tContigencia[0].innerHTML= totalContigencia 




        
                
        

  }; //Fim função async
  document.getElementById('debug').addEventListener('click', processarArquivos);

