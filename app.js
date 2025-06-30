function enviarParaWhatsApp() {
  let mensagem = "🚀 *Novo Pedido COOPEX ENTREGAS*\n\n";

  // Dados do solicitante
  const nomeSolicitante = document.getElementById("nomeSolicitante").value.trim();
  const telSolicitante = document.getElementById("telefoneSolicitante").value.trim();
  if (nomeSolicitante || telSolicitante) {
    mensagem += "🙋 *Solicitante:*\n";
    if (nomeSolicitante) mensagem += `👤 ${nomeSolicitante}\n`;
    if (telSolicitante) mensagem += `📞 ${telSolicitante}\n`;
    mensagem += "\n";
  }

  // Coletas
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

  // Paradas
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

  // Entregas
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

  // Recebedor
  const nomeRecebedor = document.getElementById("nomeRecebedor").value.trim();
  const telRecebedor = document.getElementById("telefoneRecebedor").value.trim();
  if (nomeRecebedor || telRecebedor) {
    mensagem += "🎯 *Recebedor:*\n";
    if (nomeRecebedor) mensagem += `👤 ${nomeRecebedor}\n`;
    if (telRecebedor) mensagem += `📞 ${telRecebedor}\n`;
    mensagem += "\n";
  }

  // Tipo de Serviço
  const servicosSelecionados = [];
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    if (checkbox.checked && ["Coleta/Entrega", "Cartório", "Correios", "Compras"].includes(checkbox.value)) {
      servicosSelecionados.push(`✅ ${checkbox.value}`);
    }
  });
  if (document.getElementById("outrosServico").checked) {
    const outrosDesc = document.getElementById("outrosDescricao").value.trim();
    if (outrosDesc) servicosSelecionados.push(`✅ Outros: ${outrosDesc}`);
  }
  if (servicosSelecionados.length) {
    mensagem += "🛠️ *Tipo de Serviço:*\n";
    servicosSelecionados.forEach(s => mensagem += `${s}\n`);
    mensagem += "\n";
  }

  // Forma de Pagamento
  const pagamentosSelecionados = [];
  document.querySelectorAll('input[type="checkbox"]').forEach(c => {
    if (c.checked && ["Pix", "Dinheiro", "Contrato"].includes(c.value)) {
      pagamentosSelecionados.push(`💵 ${c.value}`);
    }
  });
  const dinheiroOpcao = document.querySelector('input[name="receberDinheiro"]:checked');
  if (pagamentosSelecionados.length || dinheiroOpcao) {
    mensagem += "💰 *Forma de Pagamento:*\n";
    pagamentosSelecionados.forEach(p => mensagem += `${p}\n`);
    if (dinheiroOpcao) {
      mensagem += `🪙 Dinheiro: Receber na ${dinheiroOpcao.value}\n`;
    }
    mensagem += "\n";
  }

  // Retorno
  if (document.getElementById("temRetorno").checked) {
    mensagem += "🔄 *Tem Retorno de Entrega*\n\n";
  }

  // Ação
  const acao = document.querySelector('input[name="acao"]:checked');
  if (acao) {
    mensagem += `📌 *Ação Desejada:*\n➡️ ${acao.value}\n`;
  }

  // Envia mesmo se tudo estiver vazio
  const numeroWhatsApp = "5584981110706";
  const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
  window.open(urlWhatsApp, "_blank");
}
