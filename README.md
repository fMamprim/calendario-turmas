# Calendário de Turmas - SENAI

Um sistema interativo e inteligente para planejamento de calendários escolares, focado na gestão de Unidades Curriculares (UCs), feriados e carga horária.

![SENAI Logo](src/images/senai-logo.png)

## 🚀 Principais Funcionalidades

- **🕒 Gestão de Carga Horária**: Calcule automaticamente o fim do curso definindo a carga horária total e horas/dia.
- **🇧🇷 Feriados Inteligentes**: Importação automática de feriados nacionais brasileiros via BrasilAPI.
- **📝 Detalhamento de Datas**: Nomeie seus feriados e motivos de reposição, com visualização direta via tooltips.
- **📅 Controle de UCs**: Planeje as Unidades Curriculares com cores distintas e datas específicas.
- **📄 Exportação Profissional**: Gere documentos em PDF prontos para impressão com legendas e lista de datas importantes.
- **💾 Salvamento Local**: Salve e carregue seus projetos em formato JSON.

## 🛠️ Instalação

Siga os passos abaixo para rodar o projeto localmente:

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado.
- Gerenciador de pacotes (NPM ou Yarn).

### Passo a Passo
1. **Clonar o repositório**:
   ```bash
   git clone https://github.com/fMamprim/calendario-turmas.git
   ```
2. **Entrar na pasta**:
   ```bash
   cd calendario-turmas
   ```
3. **Instalar dependências**:
   ```bash
   npm install
   ```
4. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
5. Acesse o link exibido no terminal (geralmente `http://localhost:5173`).

## 📖 Como Usar

### 1. Configurações Iniciais
- Digite o **Nome da Turma**.
- Defina a **Data de Início** do semestre.
- Configure os **Dias de Aula** padrão (ex: Seg-Sex).

### 2. Planejamento por Carga Horária
- Ative o botão **"Calcular fim do curso automaticamente"**.
- Insira a **Carga Horária Total** e as **Horas por Dia**.
- O sistema bloqueará e calculará a data final com base nos dias letivos e feriados.

### 3. Feriados e Reposições
- Clique em **"Feriados Nacionais"** para puxar as datas vigentes no Brasil.
- Para feriados locais, use o campo manual e dê um nome a ele.
- Adicione dias de reposição caso necessário (ex: sábado letivo).

### 4. Unidades Curriculares
- Adicione cada disciplina com seu respectivo período.
- Escolha cores diferentes para facilitar a leitura visual.

### 5. Exportação
- **JSON**: Salve para continuar editando depois.
- **PDF**: Gere o arquivo final oficial para distribuição.

---

## 📄 Licença
Desenvolvido para uso no SENAI. Consulte os termos de uso internos.

---
*Para ver o histórico detalhado de alterações, consulte o arquivo [CHANGELOG.md](./CHANGELOG.md) e a pasta [versions](./versions).*
*Consulte também o nosso [ROADMAP.md](./ROADMAP.md) para futuras funcionalidades.*
*Acompanhe o histórico de pedidos em [prompts/history.md](./prompts/history.md).*


