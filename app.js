let totalColetas = 0;
let totalEntregas = 0;
let totalParadas = 0;

function criarBlocoEndereco(tipo, index) {
  return `
    <div class="bloco-endereco">
      <label>CEP (opcional):</label>
      <input type="text" id="cep${tipo}${index}" />
      <button type="button" onclick="buscarEndereco('${tipo}', ${index})">Buscar Endereço</button>
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
  const pix = document.querySelector("input[value='Pix']");
  const dinheiro = document.querySelector("input[value='Dinheiro']");
  document.getElementById("mensagemPix").style.display = pix && pix.checked ? "block" : "none";
  document.getElementById("opcoesDinheiro").style.display = dinheiro && dinheiro.checked ? "flex" : "none";
}

function enviarParaWhatsApp() {
  const nome = document.getElementById("nomeSolicitante").value.trim();
  if (!nome) {
    alert("Por favor, preencha o nome do solicitante.");
    return;
  }

  if (totalColetas === 0) {
    alert("Adicione pelo menos um endereço de coleta.");
    return;
  }

  if (totalEntregas === 0) {
    alert("Adicione pelo menos um endereço de entrega.");
    return;
  }

  const tipoServicoSelecionado = Array.from(document.querySelectorAll('input[type="checkbox"]'))
    .some(cb => ["Coleta/Entrega", "Cartório", "Correios", "Compras"].includes(cb.value) && cb.checked || cb.id === "outrosServico" && cb.checked);

  if (!tipoServicoSelecionado) {
    alert("Selecione pelo menos um tipo de serviço.");
    return;
  }

  const formaPagamentoSelecionada = Array.from(document.querySelectorAll('input[type="checkbox"]'))
    .some(cb => ["Pix", "Dinheiro", "Contrato"].includes(cb.value) && cb.checked);

  if (!formaPagamentoSelecionada) {
    alert("Selecione pelo menos uma forma de pagamento.");
    return;
  }

  let mensagem = "📦 *Novo Pedido - COOPEX ENTREGAS*\n\n";

  mensagem += "👤 *Solicitante:*\n";
  mensagem += `• Nome: ${nome}\n`;
  mensagem += `• Telefone: ${document.getElementById("telefoneSolicitante").value}\n\n`;

  for (let i = 1; i <= totalColetas; i++) {
    mensagem += `🏁 *Coleta ${i}:*\n`;
    mensagem += `• Rua: ${document.getElementById("ruaColeta" + i).value}\n`;
    mensagem += `• Número: ${document.getElementById("numeroColeta" + i).value}\n`;
    mensagem += `• Bairro: ${document.getElementById("bairroColeta" + i).value}\n`;
    mensagem += `• Cidade: ${document.getElementById("cidadeColeta" + i).value}\n\n`;
  }

  for (let i = 1; i <= totalEntregas; i++) {
    mensagem += `📍 *Entrega ${i}:*\n`;
    mensagem += `• Rua: ${document.getElementById("ruaEntrega" + i).value}\n`;
    mensagem += `• Número: ${document.getElementById("numeroEntrega" + i).value}\n`;
    mensagem += `• Bairro: ${document.getElementById("bairroEntrega" + i).value}\n`;
    mensagem += `• Cidade: ${document.getElementById("cidadeEntrega" + i).value}\n\n`;
  }

  mensagem += "📨 *Tipo de Serviço:*\n";
  document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
    if (cb.id !== "temRetorno") {
      if (cb.id === "outrosServico") {
        mensagem += `• Outros: ${document.getElementById("outrosDescricao").value}\n`;
      } else {
        mensagem += `• ${cb.value}\n`;
      }
    }
  });

  mensagem += "\n💰 *Forma de Pagamento:*\n";
  document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
    if (["Pix", "Dinheiro", "Contrato"].includes(cb.value)) {
      mensagem += `• ${cb.value}\n`;
    }
  });

  const radioDinheiro = document.querySelector('input[name="receberDinheiro"]:checked');
  if (radioDinheiro) {
    mensagem += `• Receber na ${radioDinheiro.value}\n`;
  }

  if (document.getElementById("temRetorno").checked) {
    mensagem += "\n🔁 *Retorno de Entrega: Sim*\n";
  }

  mensagem += "\n⚙️ *Ação:*\n";
  mensagem += `• ${document.querySelector('input[name="acao"]:checked').value}\n`;

  const numeroWhatsApp = "5584981110706";
  const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
  window.open(urlWhatsApp, "_blank");
}