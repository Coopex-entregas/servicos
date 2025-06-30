let totalColetas = 0;
let totalEntregas = 0;
let totalParadas = 0;

function criarBlocoEndereco(tipo, index) {
  return `
    <div class="bloco-endereco">
      <label>CEP (opcional):</label>
      <input type="text" id="cep${tipo}${index}" />
      <button type="button" onclick="buscarEndereco(\'${tipo}\', ${index})">Buscar Endereço</button>
      <label>Rua:</label>
      <input type="text" id="rua${tipo}${index}" />
      <label>Número:</label>
      <input type="text" id="numero${tipo}${index}" />
      <label>Bairro:</label>
      <input type="text" id="bairro${tipo}${index}" />
      <label>Cidade:</label>
      <input type="text" id="cidade${tipo}${index}" />
      <label>Complemento:</label>
      <input type="text" id="complemento${tipo}${index}" />
      <label>Ponto de referência:</label>
      <input type="text" id="referencia${tipo}${index}" />
    </div>
  `;
}

function adicionarColeta() {
  if (totalColetas >= 3) return;
  totalColetas++;
  document.getElementById("coleta-container").insertAdjacentHTML("beforeend", criarBlocoEndereco("Coleta", totalColetas));
}

function adicionarEntrega() {
  if (totalEntregas >= 20) return;
  totalEntregas++;
  document.getElementById("entrega-container").insertAdjacentHTML("beforeend", criarBlocoEndereco("Entrega", totalEntregas));
}

function adicionarParada() {
  totalParadas++;
  document.getElementById("parada-container").insertAdjacentHTML("beforeend", criarBlocoEndereco("Parada", totalParadas));
}

function buscarEndereco(tipo, index) {
  const cep = document.getElementById(`cep${tipo}${index}`).value.replace(/\D/g, "");
  if (cep.length !== 8) return;
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(resp => resp.json())
    .then(data => {
      if (data.erro) return;
      document.getElementById(`rua${tipo}${index}`).value = data.logradouro || "";
      document.getElementById(`bairro${tipo}${index}`).value = data.bairro || "";
      document.getElementById(`cidade${tipo}${index}`).value = data.localidade || "";
    });
}

function mostrarOpcoesPagamento() {
  const pix = document.querySelector("input[value=\"Pix\"]");
  const dinheiro = document.querySelector("input[value=\"Dinheiro\"]");
  document.getElementById("mensagemPix").style.display = pix && pix.checked ? "block" : "none";
  document.getElementById("opcoesDinheiro").style.display = dinheiro && dinheiro.checked ? "flex" : "none";
}

function enviarParaWhatsApp() {
  let mensagem = "*Novo Pedido COOPEX ENTREGAS*\n\n";

  mensagem += "*Dados do Solicitante:*\n";
  mensagem += `Nome: ${document.getElementById("nomeSolicitante").value}\n`;
  mensagem += `Telefone: ${document.getElementById("telefoneSolicitante").value}\n\n`;

  // Coletas
  for (let i = 1; i <= totalColetas; i++) {
    mensagem += `*Endereço de Coleta ${i}:*\n`;
    mensagem += `CEP: ${document.getElementById("cepColeta" + i).value || "Não informado"}\n`;
    mensagem += `Rua: ${document.getElementById("ruaColeta" + i).value}\n`;
    mensagem += `Número: ${document.getElementById("numeroColeta" + i).value}\n`;
    mensagem += `Bairro: ${document.getElementById("bairroColeta" + i).value}\n`;
    mensagem += `Cidade: ${document.getElementById("cidadeColeta" + i).value}\n`;
    mensagem += `Complemento: ${document.getElementById("complementoColeta" + i).value || "N/A"}\n`;
    mensagem += `Ponto de Referência: ${document.getElementById("referenciaColeta" + i).value || "N/A"}\n\n`;
  }

  // Paradas
  for (let i = 1; i <= totalParadas; i++) {
    mensagem += `*Parada ${i}:*\n`;
    mensagem += `CEP: ${document.getElementById("cepParada" + i).value || "Não informado"}\n`;
    mensagem += `Rua: ${document.getElementById("ruaParada" + i).value}\n`;
    mensagem += `Número: ${document.getElementById("numeroParada" + i).value}\n`;
    mensagem += `Bairro: ${document.getElementById("bairroParada" + i).value}\n`;
    mensagem += `Cidade: ${document.getElementById("cidadeParada" + i).value}\n`;
    mensagem += `Complemento: ${document.getElementById("complementoParada" + i).value || "N/A"}\n`;
    mensagem += `Ponto de Referência: ${document.getElementById("referenciaParada" + i).value || "N/A"}\n\n`;
  }

  // Entregas
  for (let i = 1; i <= totalEntregas; i++) {
    mensagem += `*Endereço de Entrega ${i}:*\n`;
    mensagem += `CEP: ${document.getElementById("cepEntrega" + i).value || "Não informado"}\n`;
    mensagem += `Rua: ${document.getElementById("ruaEntrega" + i).value}\n`;
    mensagem += `Número: ${document.getElementById("numeroEntrega" + i).value}\n`;
    mensagem += `Bairro: ${document.getElementById("bairroEntrega" + i).value}\n`;
    mensagem += `Cidade: ${document.getElementById("cidadeEntrega" + i).value}\n`;
    mensagem += `Complemento: ${document.getElementById("complementoEntrega" + i).value || "N/A"}\n`;
    mensagem += `Ponto de Referência: ${document.getElementById("referenciaEntrega" + i).value || "N/A"}\n\n`;
  }

  mensagem += "*Dados do Recebedor:*\n";
  mensagem += `Nome: ${document.getElementById("nomeRecebedor").value || "Não informado"}\n`;
  mensagem += `Telefone: ${document.getElementById("telefoneRecebedor").value || "Não informado"}\n\n`;

  mensagem += "*Tipo de Serviço:*\n";
  document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
    if (checkbox.id !== "outrosServico" && checkbox.id !== "temRetorno") {
      mensagem += `- ${checkbox.value}\n`;
    }
  });
  if (document.getElementById("outrosServico").checked) {
    mensagem += `- Outros: ${document.getElementById("outrosDescricao").value}\n`;
  }
  mensagem += "\n";

  mensagem += "*Forma de Pagamento:*\n";
  document.querySelectorAll('input[name="receberDinheiro"]:checked').forEach(radio => {
    mensagem += `- ${radio.value}\n`;
  });
  document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
    if (checkbox.value === "Pix" || checkbox.value === "Dinheiro" || checkbox.value === "Contrato") {
      mensagem += `- ${checkbox.value}\n`;
    }
  });
  mensagem += "\n";

  if (document.getElementById("temRetorno").checked) {
    mensagem += "*Tem Retorno de Entrega: Sim*\n\n";
  }

  mensagem += "*Ação Desejada:*\n";
  mensagem += `- ${document.querySelector('input[name="acao"]:checked').value}\n\n`;

  const numeroWhatsApp = "5584981110706"; // Número fornecido pelo usuário
  const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;

  window.open(urlWhatsApp, "_blank");
}

