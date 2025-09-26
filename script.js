// Espera todo o conteúdo da página carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- Selecionando os elementos do HTML ---
    const cepInput = document.getElementById('cep');
    const buscarBtn = document.getElementById('btn-buscar');
    const ruaInput = document.getElementById('rua');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');

    const buscarCep = async () => {
        const cep = cepInput.value.replace(/\D/g, '');

        // Verifica se o CEP tem 8 dígitos
        if (cep.length !== 8) {
            alert('Por favor, digite um CEP válido com 8 dígitos.');
            return;
        }

        ruaInput.value = "Buscando...";
        bairroInput.value = "Buscando...";
        cidadeInput.value = "Buscando...";
        estadoInput.value = "Buscando...";

        try {
            // A "Mágica": Faz a chamada para a API ViaCEP
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            // Verifica se a API retornou um erro (CEP não encontrado)
            if (data.erro) {
                alert('CEP não encontrado. Verifique o número digitado.');
                limparFormulario();
            } else {
                // Preenche os campos com os dados recebidos
                ruaInput.value = data.logradouro;
                bairroInput.value = data.bairro;
                cidadeInput.value = data.localidade;
                estadoInput.value = data.uf;
            }

        } catch (error) {
            // Trata erros de rede (ex: sem internet)
            alert('Não foi possível buscar o CEP. Verifique sua conexão com a internet.');
            limparFormulario();
        }
    };

    // --- Função para limpar os campos de resultado ---
    const limparFormulario = () => {
        ruaInput.value = "";
        bairroInput.value = "";
        cidadeInput.value = "";
        estadoInput.value = "";
    };

    // --- BÔNUS: Função para formatar o CEP com hífen enquanto digita ---
    const formatarCepInput = (event) => {
        let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito
        valor = valor.replace(/^(\d{5})(\d)/, '$1-$2'); // Coloca o hífen depois do 5º dígito
        event.target.value = valor;
    };

    buscarBtn.addEventListener('click', buscarCep);
    cepInput.addEventListener('input', formatarCepInput);
    cepInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            buscarCep();
        }
    });

});