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
          }
        })
        .catch(() => alert("Erro ao buscar CEP."));
    }
  });
}

function mostrarOpcoesPagamento() {
  const pix = document.querySelector('input[name="pagamento"][value="Pix"]').checked;
  const dinheiro = document.querySelector('input[name="pagamento"][value="Dinheiro"]').checked;

  document.getElementById("mensagemPix").style.display = pix ? "block" : "none";
  document.getElementById("opcoesDinheiro").style.display = dinheiro ? "flex" : "none";
}

function validarEnderecoObrigatorio(containerId, tipo) {
  const blocos = document.querySelectorAll(`#${containerId} .bloco-endereco`);
  for (let i = 0; i < blocos.length; i++) {
    const bloco = blocos[i];
    const rua = bloco.querySelector(".logradouro");
    const numero = bloco.querySelector(".numero");
    if (!rua.value.trim()) {
      alert(`Preencha a Rua no ${tipo}.`);
      rua.focus();
      return false;
    }
    if (!numero.value.trim()) {
      alert(`Preencha o Número no ${tipo}.`);
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

  const tipos = [...document.querySelectorAll('input[name="tipoServico"]:checked')];
  const outrosMarcado = document.getElementById("outrosServico").checked;
  if (tipos.length === 0 && !outrosMarcado) {
    alert("Selecione ao menos um tipo de serviço.");
    return;
  }
  if (outrosMarcado && !document.getElementById("outrosDescricao").value.trim()) {
    alert("Descreva o serviço em 'Outros'.");
    return;
  }
  const pagamentos = [...document.querySelectorAll('input[name="pagamento"]:checked')];
  if (pagamentos.length === 0) {
    alert("Selecione ao menos uma forma de pagamento.");
    return;
  }

  // Aqui vai o restante do envio da mensagem
  alert("Tudo validado. Aqui você pode montar a mensagem e abrir o WhatsApp.");
}
