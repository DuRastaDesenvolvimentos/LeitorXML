# Documentação do Leitor de XML

## 1. Visão Geral
Este projeto implementa um leitor de XML voltado para **Notas Fiscais Eletrônicas (NFe) e Notas Fiscais do Consumidor Eletrônica(NFCe)**.  
Ele interpreta arquivos XML, extrai informações relevantes (CNPJ, chave, data de emissão, valor, status, produtos) e disponibiliza esses dados para análise, tratando duplicidades e atualiza totalizadores, além de renderiza uma tabela interativa para visualização dos resultados.

---

## 2. Estrutura da Classe `Xml`

### Atributos
- `cnpj`, `chave`, `dataEmissao`, `naturaOp`, `valor`, `modelo`, `status`, `nfeNumero`, `numSerie` → dados principais da NFe.
- `_xmlString` → XML bruto em formato de string.
- `_parsedXml` → XML parseado em DOM.
- `_produtos` → lista de produtos extraídos.
- `#infProt` → informações de protocolo (privado).
- `#procEventoNFe` → eventos da NFe (privado).

### Métodos
- **`lerXML(xmlString)`** → armazena o XML bruto.
- **`parserXml()`** → interpreta o XML, extrai campos e trata casos de contingência.
- **`buscaProduto()`** → percorre os produtos e imprime dados e impostos.
- **`toTableRow()`** → retorna os dados em formato de array (para tabelas).
- **`validaDados()`** → imprime todos os atributos para depuração.

---

## 3. Função `processarArquivos()`

### Objetivo
Responsável por **ler múltiplos arquivos XML carregados pelo usuário**, criar instâncias da classe `Xml`, interpretar os dados e atualizar a barra de progresso conforme os arquivos são processados.

### Fluxo
1. Obtém a lista de arquivos do input `#file`.  
2. Valida a quantidade máxima permitida (1.000 arquivos).  
3. Para cada arquivo:
   - Cria um `FileReader` para ler o conteúdo como texto.  
   - Instancia um novo objeto `Xml`.  
   - Lê e interpreta o XML (`lerXML` + `parserXml`).  
   - Converte os dados para linha de tabela (`toTableRow`).  
   - Valida o valor da nota e, se válido, adiciona à lista.  
   - Chama `buscaProduto()` para detalhar os itens. (Para futuros debugs)  
   - Atualiza a barra de progresso com `atualizaBarra()`.  
   - Trata erros de leitura ou arquivos corrompidos.  
4. Aguarda todas as leituras com `Promise.all()`.  
5. Ao final, chama `procuraDuplicado()` para verificar duplicidades.

---

## 4. Função `procuraDuplicado(inst, qtd)`

### Objetivo
Eliminar duplicidades de notas fiscais com base na **chave da NFe**.  
- Mantém apenas uma linha por chave.  
- Se houver múltiplas ocorrências, escolhe a mais completa ou combina dados com `procuraEventoSozinho`.  
- Ao final, chama `atualizador()` e `viewer()` para atualizar totalizadores e renderizar a tabela.

---

## 5. Função `procuraEventoSozinho(autorizado, evento)`

### Objetivo
Combina dados de uma nota autorizada com um evento isolado.  
- Atualiza o status com o evento, se disponível.  
- Retorna a linha combinada.

---

## 6. Função `atualizador(qtd, arq)`

### Objetivo
Atualiza os **totalizadores** exibidos na interface.  
- Soma valores totais, válidos, em contingência e cancelados.  
- Atualiza elementos HTML (`#tArquivos`, `#vTotal`, `#vValido`, etc.) com os resultados.  

---

## 7. Função `viewer(xmlInst)`

### Objetivo
Renderiza os resultados em uma **tabela HTML interativa**.  
- Cria dinamicamente linhas (`<tr>`) e colunas (`<td>`).  
- Aplica classes CSS conforme o status da nota (ex.: `autorizado`, `text-danger`).  
- Formata valores monetários e datas/hora.  
- Exibe modelo da nota (NFe, NFCe, Evento).

---

## 8. Função `atualizaBarra(n)`

### Objetivo
Atualiza a **barra de progresso** conforme os arquivos são processados.  
- Ajusta largura (`width`).  
- Exibe percentual (`textContent`).  
- Atualiza atributo de acessibilidade (`aria-valuenow`).

---

## 9. Integração com Interface

### Eventos
- `#debug` → ao clicar, dispara `processarArquivos()`.  
- `#file` → ao selecionar um arquivo, reinicia a barra de progresso para 0%.  

---

---

## 10. Contato

Este projeto é desenvolvido e mantido por **DuRasta - Desenvolvimentos**.  
Programador responsável: **Wesley Cainana**

- 📧 E-mail: du.rastasolucoes@gmail.com  
- 💼 LinkedIn: [https://www.linkedin.com/in/wesleycainana/]

Para dúvidas, sugestões, suporte técnico ou propostas de parceria, entre em contato diretamente pelos canais acima.

## 11. Exemplo de Uso
```html
<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
</div>

<input type="file" id="file" multiple />
<button id="debug">Processar</button>

<table id="table">
  <tbody id="view"></tbody>
</table>




