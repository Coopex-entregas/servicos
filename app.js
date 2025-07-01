function criarBlocoEndereco() {
  const div = document.createElement("div");
  div.className = "bloco-endereco";
  div.innerHTML = `
    <label>CEP:</label>
    <input type="text" class="cep" placeholder="CEP (somente números)" maxlength="9" />

    <label>🛣️ Rua: <span class="obrigatorio">*</span></label>
    <input type="text" class="logradouro" placeholder="Rua / Endereço" required />

    <label>🏠 Número: <span class="obrigatorio">*</span></label>
    <input type="text" class="numero" placeholder="Número" required />

    <label>📍 Bairro:</label>
    <input type="text" class="bairro" placeholder="Bairro" />

    <label>🏙️ Cidade:</label>
    <input type="text" class="cidade" placeholder="Cidade" />

    <label>📝 Complemento:</label>
    <input type="text" class="complemento" placeholder="Complemento (opcional)" />

    <label>⭐ Ponto de referência:</label>
    <input type="text" class="referencia" placeholder="Ponto de referência (opcional)" />
  `;
  aplicarEventoCep(
    div.querySelector(".cep"),
    div.querySelector(".bairro"),
    div.querySelector(".logradouro"),
    div.querySelector(".cidade")
  );
  return div;
}

function adicionarColeta() {
  const container = document.getElementById("coleta-container");
  container.innerHTML = "";
  container.appendChild(criarBlocoEndereco());
}

function adicionarEntrega() {
  const container = document.getElementById("entrega-container");
  container.innerHTML = "";
  container.appendChild(criarBlocoEndereco());
}

function adicionarParada() {
  const container = document.getElementById("parada-container");
  container.appendChild(criarBlocoEndereco());
}

function aplicarEventoCep(cepInput, bairroInput, logradouroInput, cidadeInput) {
  cepInput.addEventListener("blur", () => {
    let cep = cepInput.value.replace(/\D/g, "");
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            bairroInput.value = data.bairro || "";
            logradouroInput.value = data.logradouro || "";
            cidadeInput.value = data.localidade || "";
          } else {
            alert("CEP não encontrado.");
            bairroInput.value = "";
            logradouroInput.value = "";
            cidadeInput.value = "";
          }
        })
        .catch(() => {
          alert("Erro ao buscar CEP.");
          bairroInput.value = "";
          logradouroInput.value = "";
          cidadeInput.value = "";
        });
    }
  });
}

function mostrarOpcoesPagamento() {
  const pix = document.querySelector('input[value="Pix"]').checked;
  const dinheiro = document.querySelector('input[value="Dinheiro"]').checked;

  document.getElementById("mensagemPix").style.display = pix ? "block" : "none";
  document.getElementById("opcoesDinheiro").style.display = dinheiro ? "flex" : "none";
}

function validarEnderecoObrigatorio(containerId, tipo) {
  const blocos = document.querySelectorAll(`#${containerId} .bloco-endereco`);
  for (let bloco of blocos) {
    const rua = bloco.querySelector(".logradouro");
    const numero = bloco.querySelector(".numero");
    if (!rua.value.trim()) {
      alert(`Por favor, preencha a Rua no ${tipo}.`);
      rua.focus();
      return false;
    }
    if (!numero.value.trim()) {
      alert(`Por favor, preencha o Número no ${tipo}.`);
      numero.focus();
      return false;
    }
  }
  return true;
}

function enviarParaWhatsApp() {
  const nomeSolicitante = document.getElementById("nomeSolicitante");
  const telefoneSolicitante = document.getElementById("telefoneSolicitante");

  if (!nomeSolicitante.value.trim()) {
    alert("Por favor, preencha o Nome do Solicitante.");
    nomeSolicitante.focus();
    return;
  }
  if (!telefoneSolicitante.value.trim()) {
    alert("Por favor, preencha o Telefone do Solicitante.");
    telefoneSolicitante.focus();
    return;
  }
  if (!validarEnderecoObrigatorio("coleta-container", "Coleta")) return;
  if (!validarEnderecoObrigatorio("entrega-container", "Entrega")) return;

  // Validar Tipo de serviço
  const tiposChecked = [...document.querySelectorAll('input[type="checkbox"][name="tipoServico"]:checked')];
  const outrosMarcado = document.getElementById("outrosServico").checked;
  let tiposSelecionados = tiposChecked.map(el => el.value);
  if (outrosMarcado) {
    const desc = document.getElementById("outrosDescricao").value.trim();
    if (!desc) {
      alert("Por favor, descreva o serviço em 'Outros'.");
      document.getElementById("outrosDescricao").focus();
      return;
    }
    tiposSelecionados.push(desc);
  }
  if (tiposSelecionados.length === 0) {
    alert("Por favor, selecione ao menos um Tipo de serviço.");
    return;
  }

  // Validar forma de pagamento
  const pagamentos = [...document.querySelectorAll('input[type="checkbox"][name="pagamento"]:checked')];
  if (pagamentos.length === 0) {
    alert("Por favor, selecione ao menos uma Forma de pagamento.");
    return;
  }

  // Montar mensagem com emojis
  function formatarEnderecos(containerId, titulo) {
    let texto = `*${titulo}:*\n`;
    const blocos = document.querySelectorAll(`#${containerId} .bloco-endereco`);
    blocos.forEach((b) => {
      const rua = b.querySelector(".logradouro").value.trim();
      const numero = b.querySelector(".numero").value.trim();
      const bairro = b.querySelector(".bairro").value.trim();
      const cidade = b.querySelector(".cidade").value.trim();
      const complemento = b.querySelector(".complemento").value.trim();
      const referencia = b.querySelector(".referencia").value.trim();

      texto += `\n🛣️ Rua: ${rua}\n🏠 Número: ${numero}`;
      if (bairro) texto += `\n📍 Bairro: ${bairro}`;
      if (cidade) texto += `\n🏙️ Cidade: ${cidade}`;
      if (complemento) texto += `\n📝 Complemento: ${complemento}`;
      if (referencia) texto += `\n⭐ Ponto de referência: ${referencia}`;
      texto += `\n`;
    });
    return texto;
  }

  const textoColeta = formatarEnderecos("coleta-container", "Endereço(s) de Coleta");
  const textoEntrega = formatarEnderecos("entrega-container", "Endereço(s) de Entrega");
  const textoParadas = formatarEnderecos("parada-container", "Parada(s)");

  const nomeRecebedor = document.getElementById("nomeRecebedor").value.trim();
  const telefoneRecebedor = document.getElementById("telefoneRecebedor").value.trim();

  let msg = `*Novo Pedido*\n\n👤 Solicitante: ${nomeSolicitante.value}\n📞 Telefone: ${telefoneSolicitante.value}\n\n${textoColeta}\n${textoParadas}\n${textoEntrega}`;
  if (nomeRecebedor) msg += `\n👤 Quem recebe: ${nomeRecebedor}`;
  if (telefoneRecebedor) msg += `\n📞 Tel. de quem recebe: ${telefoneRecebedor}`;

  msg += `\n\n🛠️ *Tipo de serviço:* ${tiposSelecionados.join(", ")}`;
  msg += `\n💰 *Forma de pagamento:* ${pagamentos.map(p=>p.value).join(", ")}`;

  const retorno = document.getElementById("temRetorno").checked ? "Sim" : "Não";
  const acao = document.querySelector('input[name="acao"]:checked').value;
  msg += `\n🔄 Retorno de entrega: ${retorno}`;
  msg += `\n📝 Ação: ${acao}`;

  const mensagemFinal = encodeURIComponent(msg);
  const numeroDestino = "5584981110706"; // SEU NÚMERO AQUI SEM + OU ESPAÇOS
  const url = `https://wa.me/${numeroDestino}?text=${mensagemFinal}`;

  window.open(url, "_blank");
}

// Inicializa os blocos padrão ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  adicionarColeta();
  adicionarEntrega();
});
