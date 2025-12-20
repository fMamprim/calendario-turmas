# Regras e Diretrizes do Projeto

Este documento consolida todas as regras e diretrizes estabelecidas durante o desenvolvimento do sistema de Calendário Escolar Interativo.

## 1. Versionamento e Documentação

### 1.1 Sistema de Versionamento
- Toda alteração significativa deve gerar uma nova versão
- Versões seguem o padrão Semantic Versioning (MAJOR.MINOR.PATCH)
- Cada versão deve ter:
  - Arquivo em `versions/vX.X.X.md`
  - Entrada no `CHANGELOG.md`
  - Registro no `prompts/history.md`

### 1.2 Documentação Obrigatória
- **CHANGELOG.md**: Registro cronológico de todas as mudanças
- **prompts/history.md**: Histórico de prompts do usuário e ações tomadas
- **ROADMAP.md**: Planejamento futuro e status de features
- **versions/**: Documentação detalhada de cada versão

### 1.3 Formato de Prompt History
```markdown
### 🟢 Prompt X: [Título Descritivo]
- **Usuário (Literal):** "[Texto exato do usuário]"
- **Ações:**
    - [Lista de ações realizadas]
    - Documentação da versão X.X.X.
```

## 2. Regras de Negócio

### 2.1 Cálculo de Datas
- **Dias Letivos**: Apenas dias da semana configurados, excluindo:
  - Feriados
  - Emendas de feriado
  - Recessos
  - Férias/Licenças
- **Dias de Reposição**: Contam como dias letivos mesmo em finais de semana
- **Cálculo Automático**: Deve considerar TODOS os tipos de exclusão

### 2.2 Unidades Curriculares (UCs)
- Cada UC pode ter:
  - Datas específicas (início/fim)
  - Dias da semana próprios
  - Carga horária específica por dia (opcional)
- UCs pintam automaticamente o calendário dentro de seu período
- Múltiplas UCs no mesmo dia dividem a célula (máximo 4)

### 2.3 Formato de Horas
- **Input**: Formato HH:MM (ex: 04:30)
- **Armazenamento**: Decimal (ex: 4.5)
- **Cálculos**: Usar valor decimal
- **Exibição**: Converter para HH:MM quando necessário

### 2.4 Limites do Curso
- Dias fora do intervalo `startDate` - `endDate` não devem ser pintados como dias de aula
- Exceções (feriados, recessos) podem existir fora do intervalo

## 3. Interface e UX

### 3.1 Layout
- **Header**: Logo SENAI à esquerda, título centralizado à direita
- **Sidebar**: Controles e listas de UCs/datas
- **Calendário**: Grid principal com métricas abaixo do título do mês
- **Métricas**: Pequenas e discretas, não devem dominar a interface

### 3.2 Visualização de Múltiplas UCs
- **1 UC**: Célula inteira
- **2 UCs**: Divisão vertical (50%/50%)
- **3 UCs**: Top 100% + Bottom 50%/50%
- **4 UCs**: Grade 2x2

### 3.3 Cores e Prioridades
Ordem de prioridade (maior para menor):
1. Cores individuais (manual)
2. Feriados
3. Recessos
4. Férias
5. Emendas
6. Reposições
7. UCs (automático)
8. Dias de aula genéricos
9. Finais de semana

## 4. Exportação PDF

### 4.1 PDF Completo
- Uma página por mês
- Logo SENAI em todas as páginas
- Legenda em todas as páginas
- Página final com:
  - Resumo do Curso (métricas)
  - Datas Importantes

### 4.2 PDF Compacto
- 12 meses em uma única página A4 Paisagem
- Grid 4x3
- Header completo:
  - Logo SENAI
  - Nome da turma
  - Título
  - Métricas do curso
  - Legenda
- Bordas finas nos dias (0.1mm, cinza claro)
- Suporte a células divididas (múltiplas UCs)

## 5. Funcionalidades Especiais

### 5.1 Emendas de Feriado
- **Terça-feira**: Emenda na segunda-feira anterior
- **Quinta-feira**: Emenda na sexta-feira e sábado seguintes
- Geradas automaticamente ao adicionar feriado

### 5.2 Reposições
- Podem ser vinculadas a UCs específicas
- Contam como dias letivos
- Aparecem com cor específica

### 5.3 Métricas
- **Curso**: Dias, Horas, Aulas totais
- **Por UC**: Calculadas individualmente considerando:
  - Período específico da UC
  - Dias da semana da UC
  - Horas/dia da UC (ou padrão)
  - Todas as exclusões (feriados, recessos, etc)

## 6. Regras Técnicas

### 6.1 Estado e Dados
- Armazenar internamente como decimal/primitivo
- Converter para formato amigável apenas na UI
- Manter compatibilidade com import/export JSON

### 6.2 Responsividade
- Layout adaptativo (mobile/desktop)
- Grid responsivo (1 coluna mobile, 3 colunas desktop)

### 6.3 Validações
- Máximo 8 horas por dia
- Máximo 4 UCs por dia
- Datas válidas (início < fim)

## 7. Convenções de Código

### 7.1 Nomenclatura
- Funções auxiliares: `camelCase`
- Componentes: `PascalCase`
- Constantes: `UPPER_SNAKE_CASE`

### 7.2 Estrutura
- Helpers no topo do arquivo
- Componentes no meio
- App principal no final

### 7.3 Comentários
- Seções importantes devem ter comentários descritivos
- Lógica complexa deve ser explicada

## 8. Controle de Qualidade

### 8.1 Antes de Finalizar
- [ ] Versão criada em `versions/`
- [ ] CHANGELOG atualizado
- [ ] History atualizado
- [ ] Código testado
- [ ] Documentação revisada

### 8.2 Testes Manuais
- Adicionar/remover datas
- Calcular métricas
- Gerar PDFs (ambos os modos)
- Import/Export JSON
- Múltiplas UCs no mesmo dia
