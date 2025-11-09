function validarFormulario(dados) {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (dados.nome.length < 3 || dados.nome.length > 50) return "Nome deve ter entre 3 e 50 caracteres.";
  if (dados.sobrenome.length < 3 || dados.sobrenome.length > 50) return "Sobrenome deve ter entre 3 e 50 caracteres.";
  if (!emailRegex.test(dados.email)) return "Email inválido.";
  if (!(Number.isInteger(+dados.idade) && +dados.idade > 0 && +dados.idade < 120)) return "Idade deve ser um número entre 1 e 119.";

  return null;
}

// --- Página do Formulário ---
const form = document.getElementById("formulario");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = {
      nome: form.nome.value.trim(),
      sobrenome: form.sobrenome.value.trim(),
      email: form.email.value.trim(),
      idade: form.idade.value.trim(),
    };

    const erro = validarFormulario(dados);
    const msgErro = document.getElementById("mensagem-erro");

    if (erro) {
      msgErro.textContent = erro;
      msgErro.style.color = "red";
    } else {
      localStorage.setItem("dadosFormulario", JSON.stringify(dados));
      window.location.href = "confirmation.html";
    }
  });
}

// --- Página de Confirmação ---
if (window.location.pathname.endsWith("confirmation.html")) {
  const dados = JSON.parse(localStorage.getItem("dadosFormulario") || "{}");
  const container = document.getElementById("dados-confirmacao");

  container.innerHTML = `
    <p><strong>Nome:</strong> ${dados.nome}</p>
    <p><strong>Sobrenome:</strong> ${dados.sobrenome}</p>
    <p><strong>Email:</strong> ${dados.email}</p>
    <p><strong>Idade:</strong> ${dados.idade}</p>
  `;

  document.getElementById("editar").onclick = () => {
    window.location.href = "form.html";
  };

  document.getElementById("confirmar").onclick = async () => {
    try {
      const resposta = await fetch("/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (resposta.ok) {
        alert("✅ Dados salvos com sucesso!");
        localStorage.removeItem("dadosFormulario");
        window.location.href = "index.html";
      } else {
        alert("❌ Erro ao salvar os dados no servidor.");
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);
      alert("❌ Erro de conexão com o servidor.");
    }
  };
}
