# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [Planejado]
- Definição do Roadmap de evolução (Fases 1 a 5).
- Implementação de sistema de rastreabilidade via `prompts/history.md`.
- Diretriz de consulta sistemática ao Roadmap para alinhamento de desenvolvimento.

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
