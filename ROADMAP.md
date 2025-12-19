# 🗺️ Roadmap de Evolução - Calendário de Turmas

Este documento detalha o planejamento das futuras funcionalidades e melhorias do sistema, organizado em fases lógicas de desenvolvimento para garantir estabilidade e qualidade técnica.

---

## 📅 Fase 1: Arquitetura e Regras de Negócio
**Foco:** Refinar a lógica de cores e validação de horas.

- [ ] **Desvincular Cores de Dias Individuais**: Remover a possibilidade de alteração de cor direta no calendário. As cores serão geridas exclusivamente via legendas/UCs.
- [x] **Reposições Inteligentes**: Transformar o campo de "Nome da Reposição" em um dropdown para seleção de uma **Unidade Curricular (UC)**.
    - [x] Integrar horários de reposição no cálculo de carga horária da UC selecionada.
- [x] **Limitação de Jornada**: Implementar trava de validação para o campo "Horas por Dia" (máximo de 8 horas).

## 🧩 Fase 2: Gestão Descentralizada (Nível UC)
**Foco:** Trazer a inteligência de cálculo para dentro de cada disciplina.

- [x] **Carga Horária Especializada**: Mover as configurações de "Carga Horária Total" e "Cálculo Automático de Fim" para dentro do formulário de cada UC.
- [x] **Cálculo de Término por UC**: O sistema deve calcular individualmente quando cada UC termina com base em sua carga horária específica.

## 📊 Fase 3: Métricas e Estatísticas Detalhadas
**Foco:** Transparência de dados para o curso completo e para cada UC.

- [x] **Dashboard de Métricas**:
    - [x] **Total de Dias**: Contagem de dias letivos.
    - [x] **Carga Horária Real**: Baseada em no máximo 7,5 horas/dia (incluindo intervalos).
    - [x] **Contador de Aulas**: Converter carga horária em aulas de 45 minutos (máximo 10 aulas/dia).
- [x] **Visualização Dupla**: Exibir estas métricas no resumo geral do curso e nos detalhes de cada UC.

## 🏖️ Fase 4: Gestão de Tempos Livres e Afastamentos
**Foco:** Flexibilidade no calendário para períodos não letivos.

- [x] **Módulo de Recessos**: Adição de datas pontuais de recesso com descrição personalizada.
- [x] **Módulo de Férias e Licenças**: Implementar seleção de períodos de afastamento que suspendam automaticamente o cálculo da carga horária e estendam a data final do curso.

## 📄 Fase 5: Exportação e Experiência de Usuário (PDF)
**Foco:** Profissionalização da saída de dados.

- [ ] **Seleção de Layout de Impressão**: Criar popup de pré-impressão com opção entre:
    - [ ] **Calendário Cheio**: Layout detalhado atual.
    - [ ] **Calendário Compacto**: Visualização de Janeiro a Dezembro em uma única página A4.
- [ ] **Toggle de Formato**: Interruptor simples e moderno para escolha do layout antes de gerar o PDF.

---

> [!NOTE]
> Este roadmap segue a ordem de prioridades técnicas, onde as bases de cálculo e estrutura (Fases 1 e 2) precedem as métricas (Fase 3) e visualizações (Fase 5).
