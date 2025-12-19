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
### 🟢 Prompt 7: Limite de Horas Diárias
- **Usuário (Literal):** "Limite as horas de aula por dia até no máximo 8.;"
- **Ações:**
### 🟢 Prompt 8: Cálculo por UC
- **Usuário (Literal):** "Implemente a opção de preencher e calcular "Carga Horária do Curso (horas)" e o toggle "Calcular fim do curso automaticamente com base na carga horária" dentro do "Adicionar Unidade Curricular", para que ele possa calcular automaticamente cada unidade curricular.;"
- **Ações:**
    - Início da **Fase 2** do Roadmap.
    - Implementação de campos de carga horária e cálculo automático dentro do formulário de UCs.
    - Criação de função reutilizável para cálculo de datas.


