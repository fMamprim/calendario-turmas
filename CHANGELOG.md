# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

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
