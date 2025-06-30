let totalColetas = 0;
let totalParadas = 0;
let totalEntregas = 0;

function criarBlocoEndereco(tipo, index) {
  return `
    <div class="bloco-endereco">
      <label>🔢 CEP (opcional):</label>
      <input type="text" id="cep${tipo}${index}" />
      <button type="button" onclick="buscarEndereco('${tipo}', ${index})">Buscar Endereço</button>
      <label>🛣️ Rua:</label>
      <input type="text" id="rua${tipo}${index}" />
      <label>🏠 Número:</label>
      <input type="text" id="numero${tipo}${index}" />
      <label>📍 Bairro:</label>
      <input type="text" id="bairro${tipo}${index}" />
      <label>🏙️ Cidade:</label>
      <input type="text" id="cidade${tipo}${index}" />
      <label>📝 Complemento:</label>
      <input type="text" id="complemento${tipo}${index}" />
      <label>⭐ Ponto de referência:</label>
      <input type="text" id="referencia${tipo}${index}" />
    </div>
  `;
}

function adicionarColeta() {
  if (totalColetas >= 3) {
    alert("Máximo 3 coletas.");
    return;
  }
  totalColetas++;
  document.getElementById("coleta-container").insertAdjacentHTML("beforeend", criarBlocoEndereco("Coleta", totalColetas));
}

function adicionarParada() {
  totalParadas++;
  document.getElementById("parada-container").insertAdjacentHTML("beforeend", criarBlocoEndereco("Parada", totalParadas));
}

function adicionarEntrega() {
  if (totalEntregas >= 20) {
    alert("Máximo 20 entregas.");
    return;
  }
  totalEntregas++;
  document.getElementById("entrega-container").insertAdjacentHTML("beforeend", criarBlocoEndereco("Entrega", totalEntregas));
}

function buscarEndereco(tipo, index) {
  const cep = document.getElementById(`cep${tipo}${index}`).value.replace(/\D/g, "");
  if (cep.length !== 8) {
    alert("CEP inválido para busca.");
    return;
  }
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(resp => resp.json())
    .then(data => {
      if (data.erro) {
        alert("CEP não encontrado.");
        return;
      }
      document.getElementById(`rua${tipo}${index}`).value = data.logradouro || "";
      document.getElementById(`bairro${tipo}${index}`).value = data.bairro || "";
      document.getElementById(`cidade${tipo}${index}`).value = data.localidade || "";
    });
}

function enviarParaWhatsApp() {
  let mensagem = "🚀 *Novo Pedido COOPEX ENTREGAS*\n\n";

  const nomeSolicitante = document.getElementById("nomeSolicitante").value.trim();
  const telSolicitante = document.getElementById("telefoneSolicitante").value.trim();
  if (nomeSolicitante || telSolicitante) {
    mensagem += "🙋 *Solicitante:*\n";
    if (nomeSolicitante) mensagem += `👤 ${nomeSolicitante}\n`;
    if (telSolicitante) mensagem += `📞 ${telSolicitante}\n`;
    mensagem += "\n";
  }

  for (let i = 1; i <= totalColetas; i++) {
    let bloco = "";
    const cep = document.getElementById(`cepColeta${i}`).value.trim();
    const rua = document.getElementById(`ruaColeta${i}`).value.trim();
    const numero = document.getElementById(`numeroColeta${i}`).value.trim();
    const bairro = document.getElementById(`bairroColeta${i}`).value.trim();
    const cidade = document.getElementById(`cidadeColeta${i}`).value.trim();
    const complemento = document.getElementById(`complementoColeta${i}`).value.trim();
    const ref = document.getElementById(`referenciaColeta${i}`).value.trim();

    if (cep || rua || numero || bairro || cidade || complemento || ref) {
      bloco += `📦 *Coleta ${i}:*\n`;
      if (cep) bloco += `🔢 CEP: ${cep}\n`;
      if (rua) bloco += `🛣️ Rua: ${rua}\n`;
      if (numero) bloco += `🏠 Número: ${numero}\n`;
      if (bairro) bloco += `📍 Bairro: ${bairro}\n`;
      if (cidade) bloco += `🏙️ Cidade: ${cidade}\n`;
      if (complemento) bloco += `📝 Complemento: ${complemento}\n`;
      if (ref) bloco += `⭐ Referência: ${ref}\n`;
      bloco += "\n";
      mensagem += bloco;
    }
  }

  for (let i = 1; i <= totalParadas; i++) {
    let bloco = "";
    const cep = document.getElementById(`cepParada${i}`).value.trim();
    const rua = document.getElementById(`ruaParada${i}`).value.trim();
    const numero = document.getElementById(`numeroParada${i}`).value.trim();
    const bairro = document.getElementById(`bairroParada${i}`).value.trim();
    const cidade = document.getElementById(`cidadeParada${i}`).value.trim();
    const complemento = document.getElementById(`complementoParada${i}`).value.trim();
    const ref = document.getElementById(`referenciaParada${i}`).value.trim();

    if (cep || rua || numero || bairro || cidade || complemento || ref) {
      bloco += `⏸️ *Parada ${i}:*\n`;
      if (cep) bloco += `🔢 CEP: ${cep}\n`;
      if (rua) bloco += `🛣️ Rua: ${rua}\n`;
      if (numero) bloco += `🏠 Número: ${numero}\n`;
      if (bairro) bloco += `📍 Bairro: ${bairro}\n`;
      if (cidade) bloco += `🏙️ Cidade: ${cidade}\n`;
      if (complemento) bloco += `📝 Complemento: ${complemento}\n`;
      if (ref) bloco += `⭐ Referência: ${ref}\n`;
      bloco += "\n";
      mensagem += bloco;
    }
  }

  for (let i = 1; i <= totalEntregas; i++) {
    let bloco = "";
    const cep = document.getElementById(`cepEntrega${i}`).value.trim();
    const rua = document.getElementById(`ruaEntrega${i}`).value.trim();
    const numero = document.getElementById(`numeroEntrega${i}`).value.trim();
    const bairro = document.getElementById(`bairroEntrega${i}`).value.trim();
    const cidade = document.getElementById(`cidadeEntrega${i}`).value.trim();
    const complemento = document.getElementById(`complementoEntrega${i}`).value.trim();
    const ref = document.getElementById(`referenciaEntrega${i}`).value.trim();

    if (cep || rua || numero || bairro || cidade || complemento || ref) {
      bloco += `📬 *Entrega ${i}:*\n`;
      if (cep) bloco += `🔢 CEP: ${cep}\n`;
      if (rua) bloco += `🛣️ Rua: ${rua}\n`;
      if (numero) bloco += `🏠 Número: ${numero}\n`;
      if (bairro) bloco += `📍 Bairro: ${bairro}\n`;
      if (cidade) bloco += `🏙️ Cidade: ${cidade}\n`;
      if (complemento) bloco += `📝 Complemento: ${complemento}\n`;
      if (ref) bloco += `⭐ Referência: ${ref}\n`;
      bloco += "\n";
      mensagem += bloco;
    }
  }

  const nomeRecebedor = document.getElementById("nomeRecebedor").value.trim();
  const telRecebedor = document.getElementById("telefoneRecebedor").value.trim();
  if (nomeRecebedor || telRecebedor) {
    mensagem += "🙍 *Recebedor:*\n";
    if (nomeRecebedor) mensagem += `👤 ${nomeRecebedor}\n`;
    if (telRecebedor) mensagem += `📞 ${telRecebedor}\n`;
    mensagem += "\n";
  }

  let tiposServico = [];
  document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
    if (cb.id === "outrosServico") return;
    if (["Pix", "Dinheiro", "Contrato", "temRetorno"].includes(cb.value)) return;
    tiposServico.push(cb.value);
  });
  if (document.getElementById("outrosServico").checked) {
    const outrosDesc = document.getElementById("outrosDescricao").value.trim();
    if (outrosDesc) tiposServico.push(`Outros: ${outrosDesc}`);
  }
  if (tiposServico.length > 0) {
    mensagem += "🛠️ *Tipo de Serviço:*\n";
    tiposServico.forEach(ts => {
      mensagem += `- ${ts}\n`;
    });
    mensagem += "\n";
  }

  let formasPagamento = [];
  document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
    if (["Pix", "Dinheiro", "Contrato"].includes(cb.value)) {
      formasPagamento.push(cb.value);
    }
  });
  if (formasPagamento.length > 0) {
    mensagem += "💰 *Forma de Pagamento:*\n";
    formasPagamento.forEach(fp => {
      mensagem += `- ${fp}\n`;
    });
    mensagem += "\n";
  }

  const dinheiroOpcao = document.querySelector('input[name="receberDinheiro"]:checked');
  if (dinheiroOpcao) {
    mensagem += `💵 *Receber Dinheiro:*\n- ${dinheiroOpcao.value}\n\n`;
  }

  if (document.getElementById("temRetorno").checked) {
    mensagem += "🔄 *Tem Retorno de Entrega: Sim*\n\n";
  }

  const acao = document.querySelector('input[name="acao"]:checked');
  if (acao) {
    mensagem += `⚡ *Ação Desejada:*\n- ${acao.value}\n\n`;
  }

  const numeroWhatsApp = "5584981110706";
  const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
  window.open(urlWhatsApp, "_blank");
}
