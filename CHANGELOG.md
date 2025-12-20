# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [Planejado]
- Definição do Roadmap de evolução (Fases 1 a 5).
- Implementação de sistema de rastreabilidade via `prompts/history.md`.
- Diretriz de consulta sistemática ao Roadmap para alinhamento de desenvolvimento.

## [1.11.0] - 2025-12-19
### Adicionado
- Página de resumo completa no PDF Compacto.
- Métricas detalhadas por UC (dias, horas, aulas) na página de resumo de ambos os PDFs.
- Listagem de períodos de férias e licenças na seção de Datas Importantes do PDF.
- Suporte a múltiplas UCs na legenda do PDF Compacto com quebra automática.
### Modificado
- Padronização de fontes e negritos entre PDF Completo e Compacto.
- Aumento do espaçamento entre legenda e calendário no PDF Compacto.

## [1.10.2] - 2025-12-19
### Corrigido
- Bug na importação de JSON onde campos de "Início" e "Fim" do curso não atualizavam visualmente.
- Lógica de importação aprimorada para resetar estados ausentes no JSON.

## [1.10.1] - 2025-12-19
### Corrigido
- Bug no formulário de férias onde o botão "Adicionar" não funcionava por falta de prop.
- Grid do calendário ausente no PDF Completo devido a erros de posicionamento e cálculo de altura da imagem.
- Falta de atualização em tempo real do calendário ao adicionar férias (dependência de hook).

## [1.10.0] - 2025-12-19
### Adicionado
- Formato HH:MM para campos de horas por dia (global e por UC).
- Header completo no PDF Compacto (logo, turma, métricas, legenda).
- Bordas finas nos dias do PDF Compacto para melhor visualização.
### Modificado
- Layout do header principal: logo à esquerda, título centralizado à direita.
- Removido "Resumo do Curso" da sidebar (mantido apenas abaixo do título do mês).

## [1.9.2] - 2025-12-19
### Corrigido
- Calendário pintando dias fora do intervalo do curso (antes do início/depois do fim).
- UCs não pintando automaticamente ao definir datas. Agora reflete dinamicamente.

## [1.9.1] - 2025-12-19
### Adicionado
- Inclusão de métricas (Dias, Horas, Aulas) na página final do PDF Completo.

## [1.9.0] - 2025-12-19
### Adicionado
- Suporte a múltiplas UCs por dia (até 4).
- Visualização de células divididas (Split View) no Grid e no PDF Compacto.
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

### 🟢 Prompt 24: Refatoração do PDF Compacto
- **Usuário (Literal):** "Está vendo o resultado do calendário compacto neste print? Em comparação com o calendário completo está faltando no calendário compacto: Logo do senai, Nome da turma, Mesmo padrão de fontes e negritos do calendário completo, Página de resumo do curso igual a do calendário completo, As unidades curriculares não estão aparecendo no pdf compacto. Erros: Legenda está muito grudada com o calendário, Os dias, horas e aulas tem que aparecer na página de resumo."
- **Ações:**
    - Refatoração completa do `generateCompactPdf`.
    - Adição de UCs na legenda e ajuste de espaçamento.
    - Implementação de página de resumo idêntica à do PDF Completo.
    - Inclusão de métricas detalhadas (dias, horas, aulas) por UC no resumo.
    - Adição de períodos de férias na seção de datas importantes do PDF.

### 🟢 Prompt 25: Correção de Sobrescrita no Import
- **Usuário (Literal):** "Quando eu carrego um json, ele não sobrescreve os dados escritos nas configurações gerais"
- **Ações:**
    - Identificado que inputs de data no `CalendarControls` não eram controlados (faltava `value`).
    - Adição de `startDate` e `endDate` como props em `CalendarControls`.
    - Refatoração de `handleImportJson` para resetar estados caso campos estejam ausentes no JSON.
    - Documentação da versão 1.10.2.




- Lógica de Toggle (Adicionar/Remover) na seleção de cores manuais.

## [1.8.0] - 2025-12-19
### Adicionado
- Campo "Horas/Dia" individual por Unidade Curricular.
- Lógica para calcular término da Uc baseada em carga horária específica (override do padrão global).
### Corrigido
- Cálculo de término da UC agora respeita Recessos e Férias cadastrados.

## [1.7.0] - 2025-12-19
### Adicionado
- **PDF Compacto**: Nova opção de exportação com layout anual (12 meses) em uma única página A4 (Paisagem).
- **Modal de Opções**: Escolha entre layout "Completo" (detalhado) ou "Compacto" ao baixar o PDF.

## [1.6.0] - 2025-12-19
### Adicionado
- Sistema de gestão de Férias e Licenças (períodos longos).
- Interface para cadastro de intervalos de datas com nome.
- Visualização de férias no grid (amarelo) e listagem lateral.
- Integração dos períodos de férias no cálculo de término do curso.

## [1.5.0] - 2025-12-19
### Adicionado
- **Gestão de Recessos**: Opção para adicionar dias não letivos personalizados (ex: conselho de classe, recesso escolar).
- **Cor de Recesso**: Nova cor (Laranja) para distinguir recessos de feriados nacionais.
- **Lógica Inteligente**: Os dias de recesso automtaicamente não contam como dias letivos e empurram o término do curso.

## [1.4.1] - 2025-12-19
### Adicionado
- **Dashboard de Métricas**: Exibição de Dias Letivos, Horas Reais (max 7.5h/dia) e Total de Aulas (45min) para o curso e UCs.
- **Detalhamento de UC**: Lista de UCs agora exibe estatísticas individuais de progresso.

## [1.4.0] - 2025-12-19
### Adicionado
- **Cálculo Inteligente por UC**: Cada Unidade Curricular agora possui seu próprio campo de carga horária e cálculo automático de data de término.
- **Toggle de Automação**: Opção de ligar/desligar o cálculo automático individualmente por UC.

## [1.3.1] - 2025-12-19
### Adicionado
- Validação de limite máximo de **8 horas de aula por dia**.

### Alterado
- **Reposições**: Agora deve-se selecionar uma **Unidade Curricular** (UC) ao invés de digitar um texto.
- **Cálculo de Carga Horária**: Dias de reposição agora entram na conta de dias letivos para o cálculo de término do curso.
- **Interface**: Removida a opção de trocar cor de dias individuais clicando neles.





## [1.2.0] - 2025-12-19
### Adicionado
- Integração com a **BrasilAPI** para busca automática de feriados nacionais.
- Campos de **nome/descrição** para feriados e dias de reposição.
- **Tooltips** no calendário para exibir descrições ao passar o mouse.
- Suporte a nomes de datas no **PDF exportado** (página de Datas Importantes).
- Persistência de nomes no arquivo **JSON** (conversão Map/Array).
- Migração automática de dados para arquivos de versões antigas.

## [1.1.0] - 2025-12-19
### Adicionado
- Cálculo automático da data de término com base na **Carga Horária**.
- Campo configurável de **Horas de Aula por Dia**.
- Botões **Toggle (Switch)** modernos para as configurações.
- **Logotipo do SENAI** no cabeçalho do sistema.

### Corrigido
- Loop infinito no cálculo de data (estabilidade do estado com `useEffect`).
- Erro de sintaxe (resíduo de diff) que impedia o carregamento do sistema.

## [1.0.0] - 2024 (Data Base)
### Adicionado
- Funcionalidades base de calendário.
- Marcação de UCs (Unidades Curriculares).
- Exportação para PDF e JSON.
- Gerenciamento manual de feriados e reposições.
