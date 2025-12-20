# 📜 Histórico de Prompts

Este arquivo registra cronologicamente todos os comandos enviados pelo usuário e as ações realizadas pela IA para manter a transparência e rastreabilidade da evolução do projeto.

---

## 📅 2025-12-19

### 🟢 Prompt 1: Configuração de Contexto
- **Usuário (Literal):** "Eu tenho os arquivos @[CHANGELOG.md]e @[README.md] e a pasta @[versions]. É imprescindível que a cada prompt que eu fizer nesta conversa, você acesse estes arquivos e faça as devidas inserções e alterações."
- **Ações:**
    - Leitura e análise dos arquivos de documentação para mapeamento do estado atual.
    - Confirmação do compromisso de manter a documentação sincronizada com o desenvolvimento.

### 🟢 Prompt 2: Planejamento do Roadmap
- **Usuário (Literal):** "Antes de mexermos no sistema, quero que você construa um roadmap. Vou te dizer qual serão os próximos prompts que vou enviar para que você planeje este roadmap primeiro. Quero que você estruture muito bem e profissionalmente este roadmap. Após concluir isso você irá aguardar os meus prompts. [Lista de prompts futuros incluída no corpo do pedido]"
- **Ações:**
    - Criação do arquivo [ROADMAP.md](../ROADMAP.md) organizado em 5 fases (Arquitetura, Gestão por UC, Métricas, Afastamentos e Exportação).
    - Atualização do [README.md](../README.md) com link para o roadmap.
    - Atualização do [CHANGELOG.md](../CHANGELOG.md) com a seção de planejamento.

### 🟢 Prompt 3: Registro de Histórico de Prompts
- **Usuário (Literal):** "Antes de iniciarmos a modificação do sistema. Mais uma regra imprescindível para você seguir. Agora quero que você crie uma pasta chamada prompts. Esta pasta será onde você organizará após cada prompt que eu fiz. Você vai criar um arquivo semelhante a um changelog porém focado em prompts, onde você irá registrar cada pedido que eu fiz e um resumo do que você fez naquele pedido. Já faça isso começando com todos os prompts que fiz nesta conversa."
- **Ações:**
    - Criação da pasta `prompts/`.
    - Inicialização do arquivo `history.md` com o retroativo desta conversa.

### 🟢 Prompt 6: Fase 1 - Cores e Reposições
- **Usuário (Literal):** "Quando eu clico em um dia no calendário, eu posso trocar a cor. Faça com que a partir de agora eu não possa mais trocar a cor dos dias individuais, mas somente das legendas. Faça com que no campo de nome do dia de reposição, na verdade não seja pra escrever e sim uma caixa seletora para escolher qual Unidade Curricular vai ser a reposição. Nisso deverá entrar no cálculo da carga horária total se tiver ativo.;"
- **Ações:**
    - Atualização da lógica de seleção de cores.
    - Implementação de Select para UCs no modal de Reposição.
    - Documentação da versão 1.3.0.

### 🟢 Prompt 7: Limite de Horas Diárias
- **Usuário (Literal):** "Limite as horas de aula por dia até no máximo 8.;"
- **Ações:**
     - Adição de validação de input max=8.

### 🟢 Prompt 8: Cálculo por UC
- **Usuário (Literal):** "Implemente a opção de preencher e calcular "Carga Horária do Curso (horas)" e o toggle "Calcular fim do curso automaticamente com base na carga horária" dentro do "Adicionar Unidade Curricular", para que ele possa calcular automaticamente cada unidade curricular.;"
- **Ações:**
    - Início da **Fase 2** do Roadmap.
    - Implementação de campos de carga horária e cálculo automático dentro do formulário de UCs.
    - Criação de função reutilizável para cálculo de datas.

### 🟢 Prompt 9: Métricas e Estatísticas
- **Usuário (Literal):** "Melhore a visualização dos dados. Quero que exiba quantos dias/aulas/horas totais reais o curso tem (descontando feriados/emendas). E quero que exiba isso também individualmente em cada UC na lista lateral."
- **Ações:**
    - **Fase 3** do Roadmap concluída.
    - Implementação de Dashboard de Métricas no topo.
    - Implementação de métricas individuais por UC na lista.
    - Documentação da versão 1.4.1.

### 🟢 Prompt 10: Recessos
- **Usuário (Literal):** "Permita adicionar dias de Recesso (com nome). Eles não contam como aula."
- **Ações:**
    - **Fase 4 (Parcial)**.
    - Implementação de input para data e nome (Recesso).
    - Atualização da lógica de `calculateEndDate` para excluir recessos.
    - Documentação da versão 1.5.0.

### 🟢 Prompt 11: Férias e Licenças
- **Usuário (Literal):** "Férias e Licenças. O usuário deve poder adicionar um período (inicio e fim) e um nome. Esses dias o sistema pula no cálculo."
- **Ações:**
    - **Fase 4 (Conclusão)**.
    - Implementação de formulário de Período (Vacation).
    - Implementação de estado `vacationPeriods` e lógica de expansão de datas.
    - Visualização amarela no grid.
    - Atualização de JSON import/export.
    - Documentação da versão 1.6.0.

### 🟢 Prompt 12: PDF Compacto
- **Usuário (Literal):** "Quero um popup na hora que eu clicar na impressão do pdf, que tenha um toggle perguntando se é pra ser calendário compacto ou cheio. Se eu mandar gerar o pdf do calendário compacto, ele tem que aparecer de janeiro á dezembro do mesmo ano em uma única página."
- **Ações:**
    - **Fase 5 (Início)**.
    - Implementação de Modal de Opções de Exportação (Completo vs Compacto).
    - Refatoração da lógica de PDF: Separação em `generateFullPdf` (html2canvas) e `generateCompactPdf` (jsPDF nativo).
    - Implementação da lógica de renderização compacta (4x3 grid) em A4 Paisagem.
    - Mapeamento de cores Tailwind para Hex para suporte a jsPDF.

### 🟢 Prompt 13: Horas por Dia por UC
- **Usuário:** "Faça com que no calculo de horas da UC ele permita eu adicionar quantas horas por dia da UC será utilizada."
- **Ações:**
    - Atualização do formulário de UC (`CurricularUnitControls`) para incluir input opcional de "Horas/Dia".
    - Ajuste no `useEffect` para usar a carga horária específica se definida.
    - Correção crítica: Passagem de `recesses` e `vacations` para a função `calculateEndDate`, garantindo precisão total no cálculo.
    - Documentação da versão 1.8.0.



### 🟢 Prompt 14: Multi-UCs por Dia
- **Usuário (Literal):** "Faça a funcionalidade de eu poder adicionar mais de uma UC no mesmo dia, fazendo com que ele divida o quadrado do dia no meio e coloque as 2 cores das duas matérias. Faça ele dividir até 4 matérias para o mesmo dia."
- **Ações:**
    - Atualização da lógica de seleção de cores (`handleSelectColor`) para permitir array de cores (Toggle/Append).
    - Atualização do `CalendarGrid` para renderizar células divididas (Grid CSS).
    - Atualização do gerador de PDF Compacto para desenhar retângulos fracionados.
    - Documentação da versão 1.9.0.

### 🟢 Prompt 15: Métricas no PDF
- **Usuário (Literal):** "Os dados de quantidades de horas, carga horaria etc também deverá ser mostrado na impressão na página final."
- **Ações:**
    - Atualização da função `generateFullPdf` para incluir seção "Resumo do Curso" com `courseMetrics` (Dias, Horas, Aulas) antes da lista de datas.
    - Documentação da versão 1.9.1.


### 🟢 Prompt 16: Correção de Datas
- **Usuário (Literal):** "Quando eu implemento as datas do curso, ele pinta o calendário nas datas certas porém ele também pinta as datas antes e depois. E quando eu atribuo uma nova UC ele não está pintando o calendário."
- **Ações:**
    - Correção no `getDayStyle` para respeitar estritamente `dates.startDate` e `dates.endDate` para aulas genéricas.
    - Implementação de pintura automática de UCs: O grid agora verifica se o dia está dentro do range de alguma UC e aplica a cor correspondente dinamicamente.
    - Documentação da versão 1.9.2.

### 🟢 Prompt 17: Métricas no Calendário
- **Usuário (Literal):** "Esse resumo do curso eu quero que esteja em baixo do nome do mês bem pequeno. Quero que apareça também o resumo de cada UC."
- **Ações:**
    - Adição de métricas compactas abaixo do título do mês no calendário.
    - Criação de `ucMetrics` useMemo para calcular métricas individuais por UC.
    - Atualização da lista de UCs na sidebar para exibir métricas (dias, horas, aulas).

### 🟢 Prompt 18: Formato HH:MM
- **Usuário (Literal):** "No campo 'Horas de Aula por Dia' ele tem que aceitar os dados em horas (00:00), e não em números inteiros."
- **Ações:**
    - Criação de funções `hoursToTime` e `timeToHours` para conversão HH:MM ↔ decimal.
    - Atualização do input global de horas por dia para `type="time"`.
    - Atualização do input de horas por dia da UC para `type="time"`.
    - Manutenção de armazenamento interno como decimal para cálculos.

### 🟢 Prompt 19: Remover Resumo da Sidebar
- **Usuário (Literal):** "Não quero que o resumo do curso apareça na lateral esquerda."
- **Ações:**
    - Remoção do componente "Resumo do Curso" da sidebar.
    - Manutenção das métricas apenas abaixo do título do mês.

### 🟢 Prompt 20: Reorganizar Header
- **Usuário (Literal):** "Centralize o título do calendário 'Calendário Escolar Interativo' na div dele (div da direita) e o logo do senai na div dele (div da esquerda)"
- **Ações:**
    - Reorganização do header em grid com 3 colunas.
    - Logo SENAI: 1/3 à esquerda.
    - Título: 2/3 centralizado à direita.

### 🟢 Prompt 21: Melhorias PDF Compacto
- **Usuário (Literal):** "Você adiciona o logo do senai, titulo e outras coisas nas páginas quando é o calendário completo. Quero que no calendário compacto também tenha essas coisas. O calendário compacto eu quero que os dias tenham uma borda bem fina em cada dia só pra visualizar a separação delas"
- **Ações:**
    - Adição de header completo no PDF Compacto (logo, turma, título, métricas, legenda).
    - Implementação de bordas finas (0.1mm, cinza) ao redor de cada dia.
    - Ajuste dinâmico de layout baseado na presença do nome da turma.
    - Documentação da versão 1.10.0.

### 🟢 Prompt 22: Correção do Fluxo de Férias
- **Usuário (Literal):** "As férias não apareceram no calendário quando eu inseri. As férias não aparecem lá em baixo para eu poder editar ou remover."
- **Ações:**
    - Identificado que `onAddVacationPeriod` estava faltando nas props de `CalendarControls`.
    - Correção da passagem da função no `App.jsx`.
    - Adição de `vacationDays` às dependências do `getDayStyle` para garantir re-renderização imediata.

### 🟢 Prompt 23: Correção de Renderização do PDF
- **Usuário (Literal):** "No pdf da impressão do calendário completo, não está aparecendo o calendário. Em anexo está um print do resultado que foi gerado."
- **Ações:**
    - Ajuste no cálculo de altura e largura da imagem capturada no `generateFullPdf`.
    - Correção do posicionamento da legenda e do grid na página do PDF.
    - Documentação da versão 1.10.1.


